// Kurzlösung nach dem Zweiphasenverfahren.
//
// Wer den Würfel nur in Ordnung bringen will, ist mit über hundertfünfzig
// Zügen der Lernlösung schlecht bedient. Dieses Modul liefert eine kurze
// Zugfolge. Sie folgt keiner menschlichen Systematik und wird deshalb
// bewusst nicht in Schritte gegliedert und nicht begründet, siehe F-0009.
//
// **Kein fremder Programmcode.** Die verbreiteten Umsetzungen des Verfahrens
// stehen unter Copyleft-Lizenzen und sind mit der MIT-Lizenz dieses Projekts
// unvereinbar, siehe E-0003. Übernommen ist das publizierte Verfahren, nicht
// der Quelltext. Die Koordinaten-Systematik stammt aus dem eigenen Spike
// 4T-0011, wo sie über ihren vollständigen Wertebereich geprüft wurde.
//
// ## Das Verfahren in zwei Sätzen
//
// Die erste Phase bringt den Würfel in die Untergruppe der Stellungen, die
// sich ohne Vierteldrehung der vier seitlichen Flächen lösen lassen. Die
// zweite Phase löst innerhalb dieser Untergruppe, wo nur noch zehn Züge
// erlaubt sind und die Arbeit der ersten Phase deshalb nicht mehr zerstört
// werden kann.
//
// ## Koordinaten
//
// Eine Koordinate ist eine Zahl, die einen Teilaspekt der Stellung
// vollständig beschreibt und sich unter jedem Zug eindeutig weiterentwickelt.
// Damit wird aus einem Zug ein Tabellenzugriff, und aus der Suche über
// Würfelzustände eine Suche über Zahlen.
//
// | Phase | Koordinate | Werte |
// | --- | --- | --- |
// | 1 | Drehung der Ecken | 2187 |
// | 1 | Kippung der Kanten | 2048 |
// | 1 | Lage der vier Mittelschicht-Kanten | 495 |
// | 2 | Anordnung der acht Ecken | 40320 |
// | 2 | Anordnung der acht oberen und unteren Kanten | 40320 |
// | 2 | Anordnung der vier Mittelschicht-Kanten | 24 |
//
// ## Warum der Übergang über den echten Würfel läuft
//
// Die zweite Phase braucht Koordinaten, die die erste nicht mitführt. Der
// naheliegende Weg wäre, drei weitere Koordinaten durch die erste Phase
// mitzuschleppen. Stattdessen wird die gefundene Zugfolge auf den Zustand
// angewandt und die Koordinaten daraus gelesen. Das kostet höchstens ein
// Dutzend Zuganwendungen je Kandidat und erspart drei Koordinaten samt
// Tabellen, von denen jede eine eigene Fehlerquelle wäre.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine
// globalen Namen. Die ESLint-Konfiguration erzwingt das.

import {
  CORNERS,
  EDGES,
  MOVE_COUNT,
  applyMove,
  applyMoves,
  isSolved,
  solvedCube,
  toFacelets,
} from '../core/cube.js';
import { MOVE_NAMES } from '../core/notation.js';
import { validateFacelets } from '../core/validate.js';

/** Die achtzehn Züge der ersten Phase, also alle. */
export const PHASE1_MOVES = Array.from({ length: MOVE_COUNT }, (_, move) => move);

/**
 * Die zehn Züge der zweiten Phase: Vierteldrehungen von U und D,
 * Halbdrehungen der vier seitlichen Flächen.
 *
 * Aus den Namen gelesen und nicht als Zahlen geschrieben, damit die Auswahl
 * lesbar bleibt und an die Notation gebunden ist.
 */
export const PHASE2_MOVES = ['U', 'U2', "U'", 'D', 'D2', "D'", 'R2', 'L2', 'F2', 'B2'].map(
  (name) => {
    const move = MOVE_NAMES.indexOf(name);
    if (move < 0) throw new Error(`Unbekannter Zugname: ${name}`);
    return move;
  },
);

/** Obere Schranken der beiden Phasen. */
//
// Veröffentlicht ist, dass zwölf Züge für die erste und achtzehn für die
// zweite Phase genügen. Hier steht je einer mehr, weil eine übernommene Zahl
// eine Annahme ist und ein Fehlschlag an der Schranke schwer zu deuten wäre.
// Die tatsächlich benötigten Tiefen misst die Prüfstrecke.
const MAX_PHASE1 = 13;
const MAX_PHASE2 = 19;

// Der Regler: wie viele Kandidaten der ersten Phase geprüft werden, und ab
// welcher Länge die Suche zufrieden ist. Beides bestimmt Zuglänge und
// Rechenzeit zugleich. Gemessen über 600 Verwürfelungen nach hundert
// Aufwärmläufen, ausführlich in 4T-0020:
//
// | Kandidaten | Züge im Schnitt | ms je Lösung |
// | ---: | ---: | ---: |
// |  1 | 22,97 | 11,8 |
// |  3 | 22,41 | 15,6 |
// |  5 | 22,25 | 17,6 |
// | 10 | 21,97 | 20,0 |
// | 20 | 21,62 | 23,2 |
// | 40 | 21,33 | 34,3 |
//
// Fünf ist ein bewusst mittlerer Wert: Bis dahin kostet jeder gesparte Zug
// rund drei Millisekunden, danach deutlich mehr. Wer eine kürzere Lösung will,
// dreht den Regler hoch; die Rechenzeit bleibt für einen Menschen unmerklich.
export const DEFAULT_ATTEMPTS = 5;

/** Länge, bei der die Suche zufrieden ist und abbricht. */
export const DEFAULT_TARGET = 21;

// Weiche Schranke für die zweite Phase.
//
// Ein Kandidat der ersten Phase kann einen Zustand hinterlassen, dessen zweite
// Phase sechzehn oder mehr Züge braucht. Solche Zustände sind nicht nur lang,
// sie sind auch teuer: Die Abschätzung der zweiten Phase reicht nur bis
// vierzehn, darüber sucht sie fast ungebremst. Gemessen lag dort der gesamte
// Ausläufer der Rechenzeit.
//
// Statt einen solchen Kandidaten auszurechnen, wird er verworfen und der
// nächste geprüft. Das ist schneller **und** liefert kürzere Lösungen. Findet
// keiner der Kandidaten eine Lösung unter dieser Schranke, läuft ein zweiter
// Durchgang ohne sie; erst der garantiert das Ergebnis.
const PHASE2_SOFT_LIMIT = 15;

// --------------------------------------------------------- Stellen und Maße

const CORNER_COUNT = CORNERS.length;
const UD_EDGE_COUNT = 8;
const SLICE_COUNT = 4;
const FIRST_SLICE = EDGES.indexOf('FR');

// Die Koordinaten setzen voraus, dass die vier Mittelschicht-Kanten in
// `EDGES` geschlossen und am Ende liegen. Das ist in `cube.js` so; hier wird
// es geprüft, statt darauf zu bauen. Läge eine davon anderswo, rechneten
// gleich drei Koordinaten still falsch.
for (let i = 0; i < SLICE_COUNT; i++) {
  if (EDGES[FIRST_SLICE + i] !== ['FR', 'FL', 'BL', 'BR'][i]) {
    throw new Error('Die Mittelschicht-Kanten liegen in EDGES nicht wie erwartet');
  }
}
if (FIRST_SLICE !== UD_EDGE_COUNT) {
  throw new Error('Die Mittelschicht-Kanten liegen in EDGES nicht am Ende');
}

const N_TWIST = 3 ** (CORNER_COUNT - 1);
const N_FLIP = 2 ** (EDGES.length - 1);
const N_PLACE = 495;
const N_CORNER_PERM = factorial(CORNER_COUNT);
const N_UD_EDGE_PERM = factorial(UD_EDGE_COUNT);
const N_SLICE_PERM = factorial(SLICE_COUNT);

function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

const BINOMIAL = (() => {
  const rows = [];
  for (let n = 0; n <= EDGES.length; n++) {
    rows.push([]);
    for (let k = 0; k <= EDGES.length; k++) {
      rows[n][k] = k === 0 ? 1 : n === 0 ? 0 : rows[n - 1][k - 1] + rows[n - 1][k];
    }
  }
  return rows;
})();

const binomial = (n, k) => (n < 0 || k < 0 || k > n ? 0 : BINOMIAL[n][k]);

// ------------------------------------------------------------ Koordinaten

/**
 * Drehung der Ecken. Die achte Ecke wird nicht mitgezählt: Die Summe aller
 * Drehungen ist bei jeder erreichbaren Stellung durch drei teilbar, also
 * ergibt sich die letzte aus den ersten sieben.
 */
function twist(cube) {
  let value = 0;
  for (let i = 0; i < CORNER_COUNT - 1; i++) value = 3 * value + cube.co[i];
  return value;
}

function setTwist(cube, value) {
  let rest = value;
  let sum = 0;
  for (let i = CORNER_COUNT - 2; i >= 0; i--) {
    const digit = rest % 3;
    rest = (rest - digit) / 3;
    cube.co[i] = digit;
    sum += digit;
  }
  cube.co[CORNER_COUNT - 1] = (3 - (sum % 3)) % 3;
  return cube;
}

/** Kippung der Kanten, aus demselben Grund ohne die zwölfte. */
function flip(cube) {
  let value = 0;
  for (let i = 0; i < EDGES.length - 1; i++) value = 2 * value + cube.eo[i];
  return value;
}

function setFlip(cube, value) {
  let rest = value;
  let sum = 0;
  for (let i = EDGES.length - 2; i >= 0; i--) {
    const digit = rest % 2;
    rest = (rest - digit) / 2;
    cube.eo[i] = digit;
    sum += digit;
  }
  cube.eo[EDGES.length - 1] = sum % 2;
  return cube;
}

/**
 * Lage der vier Mittelschicht-Kanten: der Rang ihrer Positionsmenge in
 * lexikographischer Ordnung, ohne Rücksicht auf ihre Reihenfolge
 * untereinander.
 *
 * **Der gelöste Stand ist hier nicht die Null**, sondern der letzte Rang, weil
 * die vier Kanten dann auf den vier höchsten Positionen liegen. Wer die
 * Breitensuche an einer angenommenen Null starten lässt, füllt die Tabelle vom
 * falschen Punkt aus. Genau dieser Fehler steckte in der ersten Fassung des
 * Spikes.
 */
function slicePlace(cube) {
  let value = 0;
  let found = 0;
  for (let position = 0; position < EDGES.length; position++) {
    if (cube.ep[position] >= FIRST_SLICE) {
      value += binomial(position, found + 1);
      found++;
    }
  }
  return value;
}

function setSlicePlace(cube, value) {
  let rest = value;
  let remaining = SLICE_COUNT - 1;
  for (let position = 0; position < EDGES.length; position++) cube.ep[position] = -1;
  for (let position = EDGES.length - 1; position >= 0 && remaining >= 0; position--) {
    if (rest >= binomial(position, remaining + 1)) {
      cube.ep[position] = FIRST_SLICE + remaining;
      rest -= binomial(position, remaining + 1);
      remaining--;
    }
  }
  let next = 0;
  for (let position = 0; position < EDGES.length; position++) {
    if (cube.ep[position] === -1) cube.ep[position] = next++;
  }
  return cube;
}

/**
 * Rang einer Anordnung im Fakultäts-Zahlensystem. Zu jeder Stelle wird
 * gezählt, wie viele der noch nicht verbrauchten Werte kleiner sind.
 */
function permutationRank(values) {
  const count = values.length;
  let rank = 0;
  for (let i = 0; i < count - 1; i++) {
    let smaller = 0;
    for (let j = i + 1; j < count; j++) if (values[j] < values[i]) smaller++;
    rank = rank * (count - i) + smaller;
  }
  return rank;
}

function permutationFromRank(rank, count, into) {
  const digits = new Array(count).fill(0);
  let rest = rank;
  for (let i = count - 2; i >= 1; i--) {
    digits[i] = rest % (count - i);
    rest = (rest - digits[i]) / (count - i);
  }
  digits[0] = rest;

  const unused = Array.from({ length: count }, (_, i) => i);
  for (let i = 0; i < count; i++) into[i] = unused.splice(digits[i], 1)[0];
  return into;
}

function cornerPerm(cube) {
  return permutationRank(cube.cp);
}

function setCornerPerm(cube, value) {
  permutationFromRank(value, CORNER_COUNT, cube.cp);
  return cube;
}

/**
 * Anordnung der acht oberen und unteren Kanten. Gültig nur innerhalb der
 * Untergruppe, wo diese acht Kanten die acht Stellen der oberen und unteren
 * Schicht besetzen. Außerhalb ist die Koordinate sinnlos, und der Löser
 * prüft deshalb vor dem Übergang, dass die Untergruppe erreicht ist.
 */
function udEdgePerm(cube) {
  return permutationRank(cube.ep.slice(0, UD_EDGE_COUNT));
}

function setUdEdgePerm(cube, value) {
  const values = new Array(UD_EDGE_COUNT);
  permutationFromRank(value, UD_EDGE_COUNT, values);
  for (let i = 0; i < UD_EDGE_COUNT; i++) cube.ep[i] = values[i];
  for (let i = 0; i < SLICE_COUNT; i++) cube.ep[FIRST_SLICE + i] = FIRST_SLICE + i;
  return cube;
}

/** Anordnung der vier Mittelschicht-Kanten untereinander. */
function slicePerm(cube) {
  const values = new Array(SLICE_COUNT);
  for (let i = 0; i < SLICE_COUNT; i++) values[i] = cube.ep[FIRST_SLICE + i] - FIRST_SLICE;
  return permutationRank(values);
}

function setSlicePerm(cube, value) {
  const values = new Array(SLICE_COUNT);
  permutationFromRank(value, SLICE_COUNT, values);
  for (let i = 0; i < UD_EDGE_COUNT; i++) cube.ep[i] = i;
  for (let i = 0; i < SLICE_COUNT; i++) cube.ep[FIRST_SLICE + i] = FIRST_SLICE + values[i];
  return cube;
}

/**
 * Alle sechs Koordinaten in einer Aufstellung.
 *
 * Öffentlich, weil die Prüfstrecke jede von ihnen über den vollständigen
 * Wertebereich in beide Richtungen nachrechnet und ihre Zugtabelle gegen den
 * Kern prüft. Genau diese Prüfung hat im Spike einen echten Fehler gefunden,
 * den eine Stichprobe nur zufällig gefunden hätte.
 */
export const COORDINATES = [
  { name: 'twist', phase: 1, size: N_TWIST, get: twist, set: setTwist },
  { name: 'flip', phase: 1, size: N_FLIP, get: flip, set: setFlip },
  { name: 'slicePlace', phase: 1, size: N_PLACE, get: slicePlace, set: setSlicePlace },
  { name: 'cornerPerm', phase: 2, size: N_CORNER_PERM, get: cornerPerm, set: setCornerPerm },
  { name: 'udEdgePerm', phase: 2, size: N_UD_EDGE_PERM, get: udEdgePerm, set: setUdEdgePerm },
  { name: 'slicePerm', phase: 2, size: N_SLICE_PERM, get: slicePerm, set: setSlicePerm },
];

// ------------------------------------------------------------- Zugtabellen

/**
 * Zugtabelle über eine Koordinate: zu jedem Wert und jedem Zug der neue Wert.
 *
 * Gerechnet wird über den Kern. Damit gibt es im Löser keine zweite
 * Zugtabelle, die von der des Würfelmodells abweichen könnte.
 */
function coordinateTable(size, set, get, moves) {
  const table = new Uint16Array(size * moves.length);
  for (let value = 0; value < size; value++) {
    const base = set(solvedCube(), value);
    for (let i = 0; i < moves.length; i++) {
      table[value * moves.length + i] = get(applyMove(base, moves[i]));
    }
  }
  return table;
}

/**
 * Umordnung, die jeder Zug der zweiten Phase bewirkt, aus dem Kern gelesen:
 * Auf den gelösten Würfel angewandt ist das Ergebnis genau diese Umordnung,
 * weil dort jeder Stein an der Stelle seiner eigenen Nummer liegt.
 */
const PHASE2_SHIFT = PHASE2_MOVES.map((move) => {
  const state = applyMove(solvedCube(), move);
  return { cp: state.cp, ep: state.ep };
});

// Die zehn Züge der zweiten Phase vermischen die Mittelschicht-Kanten nicht
// mit den übrigen. Darauf beruht die Zerlegung in drei Anordnungs-Koordinaten,
// deshalb wird es geprüft und nicht angenommen.
for (const shift of PHASE2_SHIFT) {
  for (let position = 0; position < UD_EDGE_COUNT; position++) {
    if (shift.ep[position] >= FIRST_SLICE) {
      throw new Error('Ein Zug der zweiten Phase holt eine Mittelschicht-Kante nach außen');
    }
  }
  for (let i = 0; i < SLICE_COUNT; i++) {
    if (shift.ep[FIRST_SLICE + i] < FIRST_SLICE) {
      throw new Error('Ein Zug der zweiten Phase holt eine äußere Kante in die Mittelschicht');
    }
  }
}

/**
 * Zugtabelle über eine Anordnungs-Koordinate. Arbeitet auf der Anordnung
 * selbst statt auf einem Würfelzustand, weil sonst über achthunderttausend
 * Zustände zu erzeugen wären und die Vorbereitung ihre Zeitvorgabe verfehlte.
 */
function permutationTable(size, count, offset, part) {
  const moves = PHASE2_MOVES.length;
  // Uint16 trägt bis 65535 und damit die 40320 Anordnungen von acht Steinen.
  const table = new Uint16Array(size * moves);
  const values = new Array(count);
  const next = new Array(count);
  for (let value = 0; value < size; value++) {
    permutationFromRank(value, count, values);
    for (let i = 0; i < moves; i++) {
      const shift = PHASE2_SHIFT[i][part];
      for (let position = 0; position < count; position++) {
        next[position] = values[shift[offset + position] - offset];
      }
      table[value * moves + i] = permutationRank(next);
    }
  }
  return table;
}

// -------------------------------------------------- Abschätzungstabellen

/** Wert für eine noch nicht erreichte Stellung. */
const UNKNOWN = 255;

/**
 * Breitensuche über das Produkt zweier Koordinaten, vom gelösten Stand aus.
 * Liefert je Kombination die Mindestzahl an Zügen bis zum Ziel.
 *
 * **Die Suche läuft vorwärts, gebraucht wird die Entfernung rückwärts.** Das
 * ist zulässig, weil beide Zugmengen unter Umkehrung abgeschlossen sind: Zu
 * jedem Zug ist auch sein Gegenzug erlaubt, bei den Halbdrehungen ist er der
 * Zug selbst. Ohne diese Eigenschaft wäre die Tabelle unbrauchbar.
 */
function pruningTable(sizeA, sizeB, tableA, tableB, startA, startB, moveCount) {
  const total = sizeA * sizeB;
  const depths = new Uint8Array(total).fill(UNKNOWN);
  depths[startA * sizeB + startB] = 0;
  let reached = 1;
  let depth = 0;
  while (reached < total) {
    let added = 0;
    for (let index = 0; index < total; index++) {
      if (depths[index] !== depth) continue;
      const a = (index / sizeB) | 0;
      const b = index % sizeB;
      for (let i = 0; i < moveCount; i++) {
        const target = tableA[a * moveCount + i] * sizeB + tableB[b * moveCount + i];
        if (depths[target] === UNKNOWN) {
          depths[target] = depth + 1;
          added++;
        }
      }
    }
    if (added === 0) break;
    reached += added;
    depth++;
  }
  return { depths, depth, reached };
}

// ------------------------------------------------------------ Vorbereitung

// Die Tabellen liegen als einzelne Bindungen und nicht in einem Objekt. Die
// Suche greift sie an jedem Knoten sechsmal ab; ein Objektzugriff je Zugriff
// ist auf diesem Pfad messbar.
let moveTwist = null;
let moveFlip = null;
let movePlace = null;
let moveCornerPerm = null;
let moveUdEdgePerm = null;
let moveSlicePerm = null;
let estimateTwistPlace = null;
let estimateFlipPlace = null;
let estimateCornerSlice = null;
let estimateEdgeSlice = null;
let solvedPlaceValue = 0;
let stats = null;
let builds = 0;

/**
 * Erzeugt die Tabellen schrittweise und gibt nach jedem Teil ab.
 *
 * Diese Form ist die Grundlage der Rückfallebene aus
 * [[4T-0021]]: Wo kein nebenläufiger Strang zur Verfügung steht, treibt der
 * Läufer die Vorbereitung Schritt für Schritt und gibt die Bedienung
 * dazwischen frei. Der längste Einzelschritt dauert gemessen 161 ms, die
 * ganze Vorbereitung 468 ms.
 *
 * Rückgabe des Generators sind die Kennzahlen, die Zwischenwerte sind die
 * einzelnen Teile. Bestehen die Tabellen schon, gibt er nichts ab und liefert
 * unmittelbar die Kennzahlen.
 */
export function* prepareTablesStepwise() {
  if (stats) return stats;

  const parts = [];
  const record = (name, entries, bytes, extra) => {
    const part = { name, entries, bytes, ...extra };
    parts.push(part);
    return part;
  };

  moveTwist = coordinateTable(N_TWIST, setTwist, twist, PHASE1_MOVES);
  moveFlip = coordinateTable(N_FLIP, setFlip, flip, PHASE1_MOVES);
  movePlace = coordinateTable(N_PLACE, setSlicePlace, slicePlace, PHASE1_MOVES);
  yield record(
    'Zugtabellen erste Phase',
    moveTwist.length + moveFlip.length + movePlace.length,
    moveTwist.byteLength + moveFlip.byteLength + movePlace.byteLength,
  );

  const solved = solvedCube();
  solvedPlaceValue = slicePlace(solved);

  const twistPlace = pruningTable(
    N_TWIST,
    N_PLACE,
    moveTwist,
    movePlace,
    twist(solved),
    solvedPlaceValue,
    PHASE1_MOVES.length,
  );
  yield record(
    'Abschätzung Drehung mal Lage',
    twistPlace.depths.length,
    twistPlace.depths.byteLength,
    {
      depth: twistPlace.depth,
      reached: twistPlace.reached,
    },
  );

  const flipPlace = pruningTable(
    N_FLIP,
    N_PLACE,
    moveFlip,
    movePlace,
    flip(solved),
    solvedPlaceValue,
    PHASE1_MOVES.length,
  );
  yield record(
    'Abschätzung Kippung mal Lage',
    flipPlace.depths.length,
    flipPlace.depths.byteLength,
    {
      depth: flipPlace.depth,
      reached: flipPlace.reached,
    },
  );

  moveCornerPerm = permutationTable(N_CORNER_PERM, CORNER_COUNT, 0, 'cp');
  moveUdEdgePerm = permutationTable(N_UD_EDGE_PERM, UD_EDGE_COUNT, 0, 'ep');
  moveSlicePerm = permutationTable(N_SLICE_PERM, SLICE_COUNT, FIRST_SLICE, 'ep');
  yield record(
    'Zugtabellen zweite Phase',
    moveCornerPerm.length + moveUdEdgePerm.length + moveSlicePerm.length,
    moveCornerPerm.byteLength + moveUdEdgePerm.byteLength + moveSlicePerm.byteLength,
  );

  const cornerSlice = pruningTable(
    N_CORNER_PERM,
    N_SLICE_PERM,
    moveCornerPerm,
    moveSlicePerm,
    0,
    0,
    PHASE2_MOVES.length,
  );
  yield record(
    'Abschätzung Ecken mal Lage',
    cornerSlice.depths.length,
    cornerSlice.depths.byteLength,
    {
      depth: cornerSlice.depth,
      reached: cornerSlice.reached,
    },
  );

  const edgeSlice = pruningTable(
    N_UD_EDGE_PERM,
    N_SLICE_PERM,
    moveUdEdgePerm,
    moveSlicePerm,
    0,
    0,
    PHASE2_MOVES.length,
  );
  yield record(
    'Abschätzung Kanten mal Lage',
    edgeSlice.depths.length,
    edgeSlice.depths.byteLength,
    {
      depth: edgeSlice.depth,
      reached: edgeSlice.reached,
    },
  );

  estimateTwistPlace = twistPlace.depths;
  estimateFlipPlace = flipPlace.depths;
  estimateCornerSlice = cornerSlice.depths;
  estimateEdgeSlice = edgeSlice.depths;

  builds++;
  stats = {
    builds,
    parts,
    bytes: parts.reduce((sum, part) => sum + part.bytes, 0),
    entries: parts.reduce((sum, part) => sum + part.entries, 0),
  };
  return stats;
}

/**
 * Erzeugt die Tabellen in einem Zug und liefert die Kennzahlen. Ein zweiter
 * Aufruf rechnet nicht erneut.
 *
 * Die Tabellen entstehen beim ersten Aufruf der Kurzlösung und nicht beim
 * Programmstart. Wer nur den Lernpfad nutzt, zahlt dafür nichts.
 *
 * `onProgress` wird nach jedem Teil gerufen. Die Zeitmessung gehört nicht
 * hierher: Dieses Modul bleibt frei von Umgebungsabhängigkeiten, und wer
 * messen will, misst von außen.
 *
 * Diese Fassung treibt denselben Generator, den auch die Rückfallebene des
 * Läufers treibt. Es gibt also nur einen Ablauf und nicht zwei, die
 * auseinanderlaufen könnten.
 */
export function prepareTables({ onProgress } = {}) {
  const steps = prepareTablesStepwise();
  let step = steps.next();
  while (!step.done) {
    if (onProgress) onProgress(step.value);
    step = steps.next();
  }
  return step.value;
}

/** Bestehen die Tabellen schon? Für die Prüfung von AK4. */
export function tablesPrepared() {
  return stats !== null;
}

/** Kennzahlen der Tabellen, oder `null`, solange sie nicht bestehen. */
export function tableStats() {
  return stats;
}

/**
 * Nur für die Prüfstrecke: der Tabelleneintrag zu einer Koordinate. So lässt
 * sich nachrechnen, dass die Tabelle dasselbe sagt wie der Zug am echten
 * Würfel.
 */
export function movedCoordinate(name, value, moveIndex) {
  if (!stats) throw new Error('Die Tabellen bestehen noch nicht');
  const tableByName = {
    twist: moveTwist,
    flip: moveFlip,
    slicePlace: movePlace,
    cornerPerm: moveCornerPerm,
    udEdgePerm: moveUdEdgePerm,
    slicePerm: moveSlicePerm,
  };
  const table = tableByName[name];
  if (!table) throw new Error(`Unbekannte Koordinate: ${name}`);
  const coordinate = COORDINATES.find((entry) => entry.name === name);
  const stride = coordinate.phase === 1 ? PHASE1_MOVES.length : PHASE2_MOVES.length;
  return table[value * stride + moveIndex];
}

/** Nur für die Prüfstrecke: der Wert einer Abschätzungstabelle. */
export function estimate(which, a, b) {
  if (!stats) throw new Error('Die Tabellen bestehen noch nicht');
  if (which === 'twistPlace') return estimateTwistPlace[a * N_PLACE + b];
  if (which === 'flipPlace') return estimateFlipPlace[a * N_PLACE + b];
  if (which === 'cornerSlice') return estimateCornerSlice[a * N_SLICE_PERM + b];
  if (which === 'edgeSlice') return estimateEdgeSlice[a * N_SLICE_PERM + b];
  throw new Error(`Unbekannte Abschätzung: ${which}`);
}

// -------------------------------------------------------------- Die Suche

/**
 * Darf dieser Zug auf die beiden vorigen folgen?
 *
 * Dieselbe Überlegung wie in `scramble.js`, hier aber je Kandidat statt je
 * fertiger Folge, weil die Suche die Auskunft an jedem Knoten braucht. Beide
 * Regeln schneiden nur Folgen ab, die sich kürzer schreiben lassen; eine
 * kürzeste Lösung geht dadurch nie verloren.
 */
function isAllowed(move, previous, beforePrevious) {
  if (previous < 0) return true;
  const face = Math.floor(move / 3);
  const previousFace = Math.floor(previous / 3);
  if (face === previousFace) return false;
  if (beforePrevious >= 0) {
    const beforeFace = Math.floor(beforePrevious / 3);
    if (beforeFace === face && previousFace === (face + 3) % 6) return false;
  }
  return true;
}

// Die Auskunft steht vorberechnet bereit, weil die Suche sie an jedem Knoten
// achtzehnmal braucht. Der Index rechnet die beiden vorigen Züge und den
// Kandidaten zusammen, wobei minus eins für «kein Zug» auf die Null abgebildet
// wird. Sechseinhalbtausend Einträge, also nichts gegen die Tabellen.
const NO_MOVE = MOVE_COUNT;
const ALLOWED = (() => {
  const span = MOVE_COUNT + 1;
  const table = new Uint8Array(span * span * MOVE_COUNT);
  for (let previous = 0; previous < span; previous++) {
    for (let before = 0; before < span; before++) {
      for (let move = 0; move < MOVE_COUNT; move++) {
        const allowed = isAllowed(
          move,
          previous === NO_MOVE ? -1 : previous,
          before === NO_MOVE ? -1 : before,
        );
        table[(previous * span + before) * MOVE_COUNT + move] = allowed ? 1 : 0;
      }
    }
  }
  return table;
})();
const ALLOWED_SPAN = MOVE_COUNT + 1;

/**
 * Erste Phase, Tiefensuche mit fester Tiefe. Gemeldet werden nur Lösungen
 * genau dieser Länge; kürzere sind in einer früheren Runde gemeldet worden.
 * Der Rückruf liefert `true`, wenn die Suche ganz enden soll.
 */
function searchPhase1(
  twistValue,
  flipValue,
  place,
  remaining,
  depth,
  path,
  previous,
  before,
  onFound,
) {
  // Die Koordinaten werden als einzelne Zahlen übergeben und nicht als Objekt.
  // Ein Objekt je Knoten wäre lesbarer und erzeugte auf dem heißen Pfad
  // Millionen kurzlebiger Zuweisungen.
  const estimateA = estimateTwistPlace[twistValue * N_PLACE + place];
  const estimateB = estimateFlipPlace[flipValue * N_PLACE + place];
  const lower = estimateA > estimateB ? estimateA : estimateB;
  if (lower > remaining) return false;
  if (remaining === 0) return onFound(path.slice(0, depth));
  if (lower === 0) return false;

  const stride = PHASE1_MOVES.length;
  const allowedBase = (previous * ALLOWED_SPAN + before) * MOVE_COUNT;
  for (let i = 0; i < stride; i++) {
    const move = PHASE1_MOVES[i];
    if (ALLOWED[allowedBase + move] === 0) continue;
    path[depth] = move;
    const stop = searchPhase1(
      moveTwist[twistValue * stride + i],
      moveFlip[flipValue * stride + i],
      movePlace[place * stride + i],
      remaining - 1,
      depth + 1,
      path,
      move,
      previous,
      onFound,
    );
    if (stop) return true;
  }
  return false;
}

/** Zweite Phase, Tiefensuche mit fester Tiefe. Liefert die Züge oder `null`. */
function searchPhase2(corner, edge, place, remaining, depth, path, previous, before) {
  const estimateA = estimateCornerSlice[corner * N_SLICE_PERM + place];
  const estimateB = estimateEdgeSlice[edge * N_SLICE_PERM + place];
  const lower = estimateA > estimateB ? estimateA : estimateB;
  if (lower > remaining) return null;
  if (lower === 0) return path.slice(0, depth);

  const stride = PHASE2_MOVES.length;
  const allowedBase = (previous * ALLOWED_SPAN + before) * MOVE_COUNT;
  for (let i = 0; i < stride; i++) {
    const move = PHASE2_MOVES[i];
    if (ALLOWED[allowedBase + move] === 0) continue;
    path[depth] = move;
    const found = searchPhase2(
      moveCornerPerm[corner * stride + i],
      moveUdEdgePerm[edge * stride + i],
      moveSlicePerm[place * stride + i],
      remaining - 1,
      depth + 1,
      path,
      move,
      previous,
    );
    if (found) return found;
  }
  return null;
}

/**
 * Löst die zweite Phase für einen Zustand, der die Untergruppe erreicht hat,
 * mit einer oberen Grenze für die Länge.
 */
function solvePhase2(cube, limit, previous, beforePrevious) {
  // Die Anordnungs-Koordinaten sind nur innerhalb der Untergruppe sinnvoll.
  // Ein Verstoß hier wäre ein Fehler in der ersten Phase, und ohne diese
  // Prüfung käme dabei eine Zugfolge heraus, die niemand als falsch erkennt.
  if (twist(cube) !== 0 || flip(cube) !== 0 || slicePlace(cube) !== solvedPlaceValue) {
    throw new Error('Der Übergang erreicht die Untergruppe nicht');
  }

  const corner = cornerPerm(cube);
  const edge = udEdgePerm(cube);
  const place = slicePerm(cube);
  const path = new Array(MAX_PHASE2);

  // Die Suche beginnt bei der Abschätzung und nicht bei null. Die Durchläufe
  // darunter können nichts finden, weil die Abschätzung eine untere Schranke
  // ist, und sie kosten bei jedem Kandidaten erneut Zeit.
  const estimateA = estimateCornerSlice[corner * N_SLICE_PERM + place];
  const estimateB = estimateEdgeSlice[edge * N_SLICE_PERM + place];
  const lower = estimateA > estimateB ? estimateA : estimateB;

  for (let depth = lower; depth <= Math.min(limit, MAX_PHASE2); depth++) {
    const found = searchPhase2(corner, edge, place, depth, 0, path, previous, beforePrevious);
    if (found) return found;
  }
  return null;
}

/**
 * Erzeugt die Kurzlösung zu einem Zustand.
 *
 * Rückgabe: `{ moves, phase1, phase2, candidates }` mit der vollständigen
 * Zugfolge als Zug-Indizes, den Längen beider Phasen und der Zahl geprüfter
 * Kandidaten der ersten Phase.
 *
 * `attempts` begrenzt die Zahl der Kandidaten, `target` beendet die Suche,
 * sobald eine Lösung dieser Länge oder kürzer gefunden ist. Beide zusammen
 * bestimmen Zuglänge und Rechenzeit; die Voreinstellung ist gemessen, siehe
 * 4T-0020.
 *
 * Ein gelöster Würfel ergibt eine leere Lösung und baut nicht einmal die
 * Tabellen. Ein unlösbarer Zustand wirft, aus demselben Grund wie bei der
 * Lernlösung: Der Datenfluss sieht die Prüfung der Lösbarkeit vor, bevor ein
 * Zustand irgendwohin gelangt.
 */
export function solveTwoPhase(cube, options = {}) {
  const { attempts = DEFAULT_ATTEMPTS, target = DEFAULT_TARGET } = options;
  const befund = validateFacelets(toFacelets(cube));
  if (!befund.ok) {
    throw new RangeError(`Unlösbarer Zustand, Bedingung: ${befund.grund}`);
  }
  if (isSolved(cube)) return { moves: [], phase1: 0, phase2: 0, candidates: 0 };

  prepareTables();

  const startTwist = twist(cube);
  const startFlip = flip(cube);
  const startPlace = slicePlace(cube);
  const path = new Array(MAX_PHASE1);
  const seen = [];
  let best = null;

  /** Versucht, einen Kandidaten der ersten Phase zu einer Lösung zu ergänzen. */
  const complete = (movesPhase1, phase2Limit) => {
    // Die zweite Phase darf nur suchen, was die bisher beste Lösung schlägt.
    // Mit jeder besseren Lösung wird die Suche schneller statt langsamer.
    const ceiling = best ? best.moves.length : MAX_PHASE1 + MAX_PHASE2;
    const remainingLength = Math.min(ceiling - movesPhase1.length - 1, phase2Limit);
    if (remainingLength < 0) return;

    const count = movesPhase1.length;
    // Der erste Zug der zweiten Phase darf nicht auf dieselbe Fläche fallen wie
    // der letzte der ersten. Sonst ließen sich beide zusammenfassen, und die
    // Lösung wäre länger geschrieben, als sie ist.
    const last = count > 0 ? movesPhase1[count - 1] : NO_MOVE;
    const beforeLast = count > 1 ? movesPhase1[count - 2] : NO_MOVE;
    const movesPhase2 = solvePhase2(
      applyMoves(cube, movesPhase1),
      remainingLength,
      last,
      beforeLast,
    );
    if (!movesPhase2) return;
    best = {
      moves: [...movesPhase1, ...movesPhase2],
      phase1: count,
      phase2: movesPhase2.length,
    };
  };

  const onFound = (movesPhase1) => {
    seen.push(movesPhase1);
    complete(movesPhase1, PHASE2_SOFT_LIMIT);
    if (best && best.moves.length <= target) return true;
    return seen.length >= attempts;
  };

  // Sobald eine Lösung steht, sind erste Phasen ab deren Länge zwecklos: Die
  // zweite Phase kann nichts abziehen, sie kann nur hinzufügen.
  let stopped = false;
  for (let limit = 0; limit <= MAX_PHASE1 && !stopped; limit++) {
    if (best && limit >= best.moves.length) break;
    stopped = searchPhase1(
      startTwist,
      startFlip,
      startPlace,
      limit,
      0,
      path,
      NO_MOVE,
      NO_MOVE,
      onFound,
    );
  }

  // Kein Kandidat kam unter der weichen Schranke durch. Jetzt dieselben
  // Kandidaten ohne sie, in derselben Reihenfolge. Die erste Phase wird dafür
  // **nicht** erneut aufgezählt: Das war der Grund, aus dem eine frühere
  // Fassung dieses Notausgangs mehr gekostet hat als er einbrachte.
  if (!best) {
    for (const movesPhase1 of seen) {
      complete(movesPhase1, MAX_PHASE2);
      if (best) break;
    }
  }

  if (!best) throw new Error('Keine Kurzlösung gefunden');

  // Selbstprüfung, wie bei der Lernlösung: Sie kostet nichts und macht aus
  // einem Fehler in der Suche eine Meldung statt einer Zugfolge, die den
  // Würfel nicht löst.
  if (!isSolved(applyMoves(cube, best.moves))) {
    throw new Error('Die erzeugte Kurzlösung führt nicht zum gelösten Würfel');
  }

  return { ...best, candidates: seen.length };
}
