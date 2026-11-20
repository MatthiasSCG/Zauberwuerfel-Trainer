// Übungslagen je Lektion.
//
// ## Warum eine Lektion eine eigene Ausgangslage braucht
//
// An einer Zufallsverwürfelung lässt sich keine Lektion üben. Wer Lektion 6
// übt, braucht einen Würfel, bei dem die ersten beiden Schichten und das Kreuz
// oben stehen und die Kanten oben noch falsch liegen. Aus zwanzig Zufallszügen
// entsteht diese Lage praktisch nie.
//
// ## Warum die Lage gebaut und nicht gesucht wird
//
// Der naheliegende Weg wäre, zu verwürfeln und zu verwerfen, bis die Lage
// passt. Er ist der falsche: Für Lektion 6 träfe er nur einen verschwindenden
// Teil aller Verwürfelungen, und die Zahl der Versuche wäre unbeschränkt. Genau
// diese Falle hat der Verwürfelungs-Generator in 4T-0036 bereits einmal
// gestellt.
//
// Gebaut wird deshalb rückwärts vom gelösten Würfel: Was die Lektion lösen
// soll, wird aufgelöst, und nur das. Alles, was ihre Vorbedingung festnagelt,
// bleibt unangetastet. Die Zahl der Ziehungen steht damit vor dem ersten
// Schritt fest, und es gibt keine Schleife, die nicht enden könnte.
//
// **Der Preis dieser Bauart ist die Lösbarkeit.** Wer Steine unmittelbar
// umsetzt, statt zu drehen, verlässt den Raum der echten Würfel, sobald er
// nicht aufpasst. Die drei Erhaltungssätze werden deshalb hier von Hand
// hergestellt, und `test/lessons/setup.test.js` rechnet sie mit `validate.js`
// nach. Auf dem Weg über Züge wäre diese Zusicherung geschenkt und damit
// wertlos.
//
// ## Zwei Tabellen, beide über die Ziele des Kerns
//
// `FREEDOM` beantwortet «was lässt dieses Ziel frei», `CASE_KINDS` beantwortet
// «was ist zu diesem Ziel noch zu tun». Beide sind über die Bezeichner aus
// `core/goals.js` geführt und nicht über Lektionsnummern. Eine Lektion liefert
// nur zwei Angaben: das Ziel ihrer Vorgängerin, das die Freiheiten bestimmt,
// und ihr eigenes, das die Fallmenge bestimmt. Damit gibt es keine Lektion mit
// Sonderbehandlung, und eine Verzweigung des Pfades in Release 2 ändert an
// diesem Modul nichts.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine
// globalen Namen. Die ESLint-Konfiguration erzwingt das.

import { CORNERS, EDGES, applyMoves, isSolved, solvedCube } from '../core/cube.js';
import { scramble } from '../core/scramble.js';
import { PRACTICE, lessonFor } from './catalog.js';
import { gleicheParitaetAus, parity, randomInt, setzeOrientierung, verteile } from './scatter.js';

// Stellen, wie in `core/goals.js` aus den Namen gelesen und nicht als Zahl
// geschrieben. Eine Änderung der Reihenfolge in `cube.js` bedeutete hier sonst
// stillschweigend etwas anderes.
const corner = (name) => CORNERS.indexOf(name);
const edge = (name) => EDGES.indexOf(name);
const UPPER_CORNERS = ['URF', 'UFL', 'ULB', 'UBR'].map(corner);
const LOWER_CORNERS = ['DFR', 'DLF', 'DBL', 'DRB'].map(corner);
const UPPER_EDGES = ['UR', 'UF', 'UL', 'UB'].map(edge);
const LOWER_EDGES = ['DR', 'DF', 'DL', 'DB'].map(edge);
const MIDDLE_EDGES = ['FR', 'FL', 'BL', 'BR'].map(edge);
const ALL_CORNERS = CORNERS.map((_, index) => index);
const ALL_EDGES = EDGES.map((_, index) => index);

/**
 * Was ein erreichtes Ziel festnagelt.
 *
 * `fixedCorners` und `fixedEdges` müssen an ihrer Stelle und ungedreht liegen,
 * `placedCorners` an ihrer Stelle, aber beliebig gedreht, `flatEdges` beliebig
 * gelegen, aber ungekippt. Die letzten beiden Fälle sind kein Beiwerk: Auf
 * ihnen beruht die Trennung von Setzen und Drehen, die den Übergang zu den
 * schnellen Methoden trägt.
 *
 * Der Schlüssel `null` steht für «keine Vorbedingung am Würfel». Ihn trägt
 * Lektion 2, deren Vorgängerin die Notation ist und kein Würfelziel hat.
 */
const FREEDOM = new Map([
  [null, { fixedCorners: [], fixedEdges: [], placedCorners: [], flatEdges: [] }],
  ['bottomCross', { fixedCorners: [], fixedEdges: LOWER_EDGES, placedCorners: [], flatEdges: [] }],
  [
    'firstLayer',
    { fixedCorners: LOWER_CORNERS, fixedEdges: LOWER_EDGES, placedCorners: [], flatEdges: [] },
  ],
  [
    'twoLayers',
    {
      fixedCorners: LOWER_CORNERS,
      fixedEdges: [...LOWER_EDGES, ...MIDDLE_EDGES],
      placedCorners: [],
      flatEdges: [],
    },
  ],
  [
    'topCrossVisible',
    {
      fixedCorners: LOWER_CORNERS,
      fixedEdges: [...LOWER_EDGES, ...MIDDLE_EDGES],
      placedCorners: [],
      flatEdges: UPPER_EDGES,
    },
  ],
  [
    'topEdgesMatched',
    { fixedCorners: LOWER_CORNERS, fixedEdges: ALL_EDGES, placedCorners: [], flatEdges: [] },
  ],
  [
    'topCornersPlaced',
    {
      fixedCorners: LOWER_CORNERS,
      fixedEdges: ALL_EDGES,
      placedCorners: UPPER_CORNERS,
      flatEdges: [],
    },
  ],
]);

/**
 * Woraus die Fälle einer Lektion bestehen, nach ihrem eigenen Ziel.
 *
 * Vier Arten, und die Wahl ist keine Stilfrage, sondern folgt dem Gegenstand:
 *
 * - `openSlots` für die Lektionen 2 bis 4. Sie setzen vier gleichartige Steine
 *   nacheinander; der Fall ist die Teilmenge der Plätze, die noch offen sind.
 * - `pattern` für Lektion 5. Sie orientiert und setzt nicht; der Fall ist das
 *   Bild der Kippung, also Punkt, Linie oder Winkel.
 * - `permutation` für die Lektionen 6 und 7. Sie setzen, ohne zu orientieren;
 *   der Fall ist die Anordnung.
 * - `twist` für Lektion 8. Sie orientiert, ohne zu setzen; der Fall ist der
 *   Drehungsvektor.
 *
 * Lektion 9 trägt dasselbe Ziel wie Lektion 8, hat aber keine Fallmenge. Sie
 * wird über `practice` unterschieden und nicht über das Ziel.
 */
const CASE_KINDS = new Map([
  ['bottomCross', { kind: 'openSlots', piece: 'edge', slots: LOWER_EDGES }],
  ['firstLayer', { kind: 'openSlots', piece: 'corner', slots: LOWER_CORNERS }],
  ['twoLayers', { kind: 'openSlots', piece: 'edge', slots: MIDDLE_EDGES }],
  ['topCrossVisible', { kind: 'pattern', piece: 'edge', slots: UPPER_EDGES }],
  ['topEdgesMatched', { kind: 'permutation', piece: 'edge', slots: UPPER_EDGES, evenOnly: false }],
  [
    'topCornersPlaced',
    { kind: 'permutation', piece: 'corner', slots: UPPER_CORNERS, evenOnly: true },
  ],
  ['cubeSolved', { kind: 'twist', piece: 'corner', slots: UPPER_CORNERS }],
]);

/**
 * Die drei Bilder der Lektion 5, benannt wie im Didaktik-Konzept.
 *
 * Gemeint ist die Lage der Kanten, deren Farbe schon nach oben zeigt: beim
 * Punkt keine, bei der Linie zwei gegenüberliegende, beim Winkel zwei
 * benachbarte. Ein viertes Bild gäbe es nur mit vier richtigen Kanten, und das
 * ist das Ziel und kein Fall. Dass es kein Bild mit einer oder drei richtigen
 * Kanten gibt, ist keine Auswahl, sondern die Kanten-Kippungsparität.
 */
export const TOP_PATTERNS = ['point', 'line', 'angle'];

/** Ganze Zahl von 0 bis n-1. Geklemmt, damit auch eine entartete Quelle trägt. */
/** Alle Anordnungen einer Liste, für die Aufzählung der endlichen Fallmengen. */
function permutations(werte) {
  if (werte.length <= 1) return [[...werte]];
  const liste = [];
  for (let i = 0; i < werte.length; i++) {
    const rest = [...werte.slice(0, i), ...werte.slice(i + 1)];
    for (const teil of permutations(rest)) liste.push([werte[i], ...teil]);
  }
  return liste;
}

/** Alle nichtleeren Teilmengen, als Listen in der Reihenfolge der Vorlage. */
function nonEmptySubsets(werte) {
  const liste = [];
  for (let maske = 1; maske < 1 << werte.length; maske++) {
    liste.push(werte.filter((_, index) => (maske >> index) & 1));
  }
  return liste;
}

/**
 * Alle Drehungsvektoren mit einer durch drei teilbaren Summe, ohne den
 * Nullvektor.
 *
 * Die Bedingung ist der Erhaltungssatz und keine Auswahl: Ein Vektor, der ihn
 * verletzt, gehört zu keinem echten Würfel. Von 81 Vektoren bleiben deshalb 26.
 */
function allTwists(anzahl) {
  const liste = [];
  for (let code = 1; code < 3 ** anzahl; code++) {
    const vektor = [];
    let rest = code;
    for (let i = 0; i < anzahl; i++) {
      vektor.push(rest % 3);
      rest = Math.floor(rest / 3);
    }
    if (vektor.reduce((a, b) => a + b, 0) % 3 === 0) liste.push(vektor);
  }
  return liste;
}

/** Der Name einer Stelle, für die lesbare Fallkennung. */
const namerFor = (art) => (art.piece === 'corner' ? (i) => CORNERS[i] : (i) => EDGES[i]);
const indexerFor = (art) => (art.piece === 'corner' ? corner : edge);

/** Das Ziel, das die Vorgängerin einer Lektion herstellt, oder `null`. */
function preconditionGoal(lesson) {
  return lesson.requires === null ? null : (lessonFor(lesson.requires)?.goal ?? null);
}

/** Die Fallart einer Lektion, oder `null`, wo es keine endliche Fallmenge gibt. */
function kindFor(key) {
  const lesson = lessonFor(key);
  if (lesson === null || lesson.practice !== PRACTICE.SETUP) return null;
  return CASE_KINDS.get(lesson.goal) ?? null;
}

/**
 * Die Fälle einer Lektion als Liste von Kennungen.
 *
 * Leer, wo es keine endliche Fallmenge gibt: bei Lektion 0 ohne Würfelaufgabe,
 * bei Lektion 1 mit ihrer einen festen Lage und bei Lektion 9, die an einer
 * vollen Verwürfelung übt.
 *
 * Die Kennung ist eine Zeichenkette und keine Zahl, damit sie beim Lesen etwas
 * aussagt und ihre Bedeutung nicht verliert, sobald sich die Reihenfolge der
 * Aufzählung ändert.
 */
export function casesFor(key) {
  const art = kindFor(key);
  if (art === null) return [];
  const name = namerFor(art);

  switch (art.kind) {
    case 'openSlots':
      return nonEmptySubsets(art.slots).map((offen) => offen.map(name).join('+'));
    case 'pattern':
      return [...TOP_PATTERNS];
    case 'permutation':
      return permutations(art.slots)
        .filter((anordnung) => !art.evenOnly || parity(anordnung) === 0)
        .filter((anordnung) => anordnung.some((stein, index) => stein !== art.slots[index]))
        .map((anordnung) => anordnung.map(name).join('/'));
    case 'twist':
      return allTwists(art.slots.length).map((vektor) => vektor.join(''));
    default:
      return [];
  }
}

/**
 * Die Fallkennung einer vorliegenden Lage, oder `null`.
 *
 * `null` heißt: Die Lage gehört zu keinem Fall dieser Lektion, weil ihr Ziel
 * bereits erreicht ist oder weil die Lektion keine Fallmenge hat. Die Prüfung
 * stellt damit fest, ob eine bestellte Lage auch die bestellte ist; die
 * Oberfläche kann später dasselbe tun, um das passende Bild zu zeigen.
 */
export function caseOf(key, state) {
  const art = kindFor(key);
  if (art === null) return null;
  const name = namerFor(art);
  const eckig = art.piece === 'corner';

  switch (art.kind) {
    case 'openSlots': {
      const offen = art.slots.filter((stelle) =>
        eckig
          ? state.cp[stelle] !== stelle || state.co[stelle] !== 0
          : state.ep[stelle] !== stelle || state.eo[stelle] !== 0,
      );
      return offen.length === 0 ? null : offen.map(name).join('+');
    }
    case 'pattern': {
      const richtig = art.slots.filter((stelle) => state.eo[stelle] === 0);
      if (richtig.length === 0) return 'point';
      if (richtig.length !== 2) return null;
      // Zwei Kanten liegen einander gegenüber, wenn im Ring der vier Stellen
      // genau eine dritte zwischen ihnen steht. Das ist die Linie, der um eine
      // Stelle versetzte Fall der Winkel.
      const [a, b] = richtig.map((stelle) => art.slots.indexOf(stelle));
      return (b - a) % 2 === 0 ? 'line' : 'angle';
    }
    case 'permutation': {
      const steine = art.slots.map((stelle) => (eckig ? state.cp[stelle] : state.ep[stelle]));
      if (steine.every((stein, index) => stein === art.slots[index])) return null;
      return steine.map(name).join('/');
    }
    case 'twist': {
      const vektor = art.slots.map((stelle) => state.co[stelle]);
      return vektor.every((wert) => wert === 0) ? null : vektor.join('');
    }
    default:
      return null;
  }
}

/**
 * Was ein Fall an der Lage verlangt, noch ohne Rücksicht auf die Lösbarkeit.
 *
 * Getrennt vom Zusammenbau, weil beides verschiedene Fragen beantwortet: Hier
 * steht, was der Fall festlegt, dort, wie daraus ein lösbarer Würfel wird. Die
 * Trennung ist der Grund, warum eine neue Fallart nur an einer Stelle etwas
 * hinzufügt.
 *
 * `home…` sind Plätze, die stehen bleiben, `…Placement` und `…Twist` und
 * `…Flip` sind vorgeschriebene Werte, `displaced…` sind Plätze, die auf jeden
 * Fall fremd besetzt sein müssen.
 */
function prescribe(art, caseId, random) {
  const wunsch = {
    homeCorners: new Set(),
    homeEdges: new Set(),
    cornerPlacement: new Map(),
    edgePlacement: new Map(),
    cornerTwist: new Map(),
    edgeFlip: new Map(),
    displacedCorners: [],
    displacedEdges: [],
  };
  const name = namerFor(art);
  const eckig = art.piece === 'corner';

  switch (art.kind) {
    case 'openSlots': {
      const offen = new Set(caseId.split('+'));
      for (const stelle of art.slots) {
        if (!offen.has(name(stelle))) {
          (eckig ? wunsch.homeCorners : wunsch.homeEdges).add(stelle);
          continue;
        }
        // Ein offener Platz kann auf zwei Arten offen sein: Der Stein liegt
        // woanders, oder er liegt richtig und ist verdreht. Beides kommt am
        // Würfel vor und kostet den Anwender Verschiedenes, eine am Platz
        // verdrehte Ecke der ersten Schicht acht Züge statt vier. Gezogen wird
        // deshalb je Platz, und die Zahl der Fälle wächst dadurch nicht.
        if (randomInt(random, 3) === 0) {
          if (eckig) {
            wunsch.cornerPlacement.set(stelle, stelle);
            wunsch.cornerTwist.set(stelle, 1 + randomInt(random, 2));
          } else {
            wunsch.edgePlacement.set(stelle, stelle);
            wunsch.edgeFlip.set(stelle, 1);
          }
        } else {
          (eckig ? wunsch.displacedCorners : wunsch.displacedEdges).push(stelle);
        }
      }
      return wunsch;
    }
    case 'pattern': {
      const richtig = patternSlots(art.slots, caseId, random);
      for (const stelle of art.slots) {
        wunsch.edgeFlip.set(stelle, richtig.includes(stelle) ? 0 : 1);
      }
      return wunsch;
    }
    case 'permutation': {
      const zuIndex = indexerFor(art);
      const steine = caseId.split('/').map(zuIndex);
      const ziel = eckig ? wunsch.cornerPlacement : wunsch.edgePlacement;
      art.slots.forEach((stelle, index) => ziel.set(stelle, steine[index]));
      return wunsch;
    }
    case 'twist': {
      art.slots.forEach((stelle, index) => wunsch.cornerTwist.set(stelle, Number(caseId[index])));
      return wunsch;
    }
    default:
      throw new RangeError(`Unbekannte Fallart: ${art.kind}`);
  }
}

/**
 * Welche Kanten beim gewünschten Bild schon richtig herum liegen.
 *
 * Die Ausrichtung wird gezogen und gehört nicht zum Fall. Eine Linie quer und
 * eine Linie längs sind für den Anwender dasselbe Bild; sie zu trennen
 * verdoppelte die Fallzahl, ohne eine zweite Aufgabe zu stellen.
 */
function patternSlots(slots, muster, random) {
  if (muster === 'point') return [];
  const start = randomInt(random, slots.length);
  const abstand = muster === 'line' ? 2 : 1;
  return [slots[start], slots[(start + abstand) % slots.length]];
}

/**
 * Erzeugt die Ausgangslage einer Lektion.
 *
 * Rückgabe `{ state, caseId }`, oder `null` für eine Lektion ohne Würfelaufgabe.
 * `caseId` ist `null`, wo es keine endliche Fallmenge gibt, also bei Lektion 9.
 *
 * Die Zufallsquelle wird hereingereicht, wie es der Verwürfler in `scramble.js`
 * vormacht: Zu gleicher Quelle entsteht dieselbe Lage, und ein Fehlschlag ist
 * damit nachstellbar. Ein bestellter Fall wird zusätzlich angenommen, damit eine
 * Lektion ein bestimmtes Bild gezielt zeigen kann und die Prüfung ihre
 * Vollständigkeit nicht dem Zufall überlassen muss.
 */
export function createSetup(key, { random = Math.random, caseId = null } = {}) {
  const lesson = lessonFor(key);
  if (lesson === null || lesson.practice === PRACTICE.NONE) return null;

  // Lektion 1 übt an der einzigen Lage, an der sich eine Zugfolge nachvollziehen
  // lässt: dem gelösten Würfel. Aus jeder anderen entstünde ein Bild, das nichts
  // aussagt, und der Anwender könnte nicht sehen, was seine Züge angerichtet
  // haben. Einen Fall gibt es hier nicht, denn die Lage ist immer dieselbe.
  if (lesson.practice === PRACTICE.DRILL) return { state: solvedCube(), caseId: null };

  if (lesson.practice === PRACTICE.SCRAMBLE) {
    let state = applyMoves(solvedCube(), scramble({ random }));
    // Eine Verwürfelung, die zufällig auf den gelösten Würfel führt, wäre keine
    // Aufgabe. Der Fall ist so selten, dass er sich nie zeigen wird, und er
    // wird trotzdem behandelt: Eine Zusicherung, die nur fast immer gilt, ist
    // keine. Ein einzelner Zug genügt, denn er zerstört den gelösten Würfel.
    if (isSolved(state)) state = applyMoves(state, [0]);
    return { state, caseId: null };
  }

  const bound = FREEDOM.get(preconditionGoal(lesson));
  const art = CASE_KINDS.get(lesson.goal);
  if (!bound || !art) throw new RangeError(`Zu Lektion ${key} fehlt eine Tabelle`);

  const faelle = casesFor(key);
  const gewaehlt = caseId ?? faelle[randomInt(random, faelle.length)];
  if (!faelle.includes(gewaehlt)) throw new RangeError(`Unbekannter Fall: ${gewaehlt}`);
  const wunsch = prescribe(art, gewaehlt, random);

  const state = solvedCube();
  for (const [stelle, stein] of wunsch.cornerPlacement) state.cp[stelle] = stein;
  for (const [stelle, stein] of wunsch.edgePlacement) state.ep[stelle] = stein;

  // Was die Vorbedingung hält, was der Fall setzt, und was übrig bleibt. Der
  // Rest ist der Pool, in dem gemischt werden darf.
  const gebundeneEcken = new Set([...bound.fixedCorners, ...bound.placedCorners]);
  const gebundeneKanten = new Set(bound.fixedEdges);
  const eckenPool = ALL_CORNERS.filter(
    (stelle) =>
      !gebundeneEcken.has(stelle) &&
      !wunsch.homeCorners.has(stelle) &&
      !wunsch.cornerPlacement.has(stelle),
  );
  const kantenPool = ALL_EDGES.filter(
    (stelle) =>
      !gebundeneKanten.has(stelle) &&
      !wunsch.homeEdges.has(stelle) &&
      !wunsch.edgePlacement.has(stelle),
  );

  verteile(state.cp, eckenPool, wunsch.displacedCorners, random);
  verteile(state.ep, kantenPool, wunsch.displacedEdges, random);

  const offeneEcken = new Set(wunsch.displacedCorners);
  const offeneKanten = new Set(wunsch.displacedEdges);
  gleicheParitaetAus(
    state,
    eckenPool.filter((stelle) => !offeneEcken.has(stelle)),
    kantenPool.filter((stelle) => !offeneKanten.has(stelle)),
  );

  // Die Drehung ist an mehr Plätzen frei als die Lage: `placedCorners` stehen
  // an ihrer Stelle und dürfen trotzdem gedreht sein. Genau das ist der
  // Unterschied zwischen Lektion 7 und Lektion 8.
  for (const [stelle, drehung] of wunsch.cornerTwist) state.co[stelle] = drehung;
  for (const [stelle, kippung] of wunsch.edgeFlip) state.eo[stelle] = kippung;
  setzeOrientierung(
    state.co,
    ALL_CORNERS.filter(
      (stelle) =>
        !bound.fixedCorners.includes(stelle) &&
        !wunsch.homeCorners.has(stelle) &&
        !wunsch.cornerTwist.has(stelle),
    ),
    3,
    random,
  );
  setzeOrientierung(
    state.eo,
    ALL_EDGES.filter(
      (stelle) =>
        !bound.fixedEdges.includes(stelle) &&
        !bound.flatEdges.includes(stelle) &&
        !wunsch.homeEdges.has(stelle) &&
        !wunsch.edgeFlip.has(stelle),
    ),
    2,
    random,
  );

  return { state, caseId: gewaehlt };
}
