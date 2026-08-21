// Würfelmodell auf Steinebene.
//
// Ein Würfel besteht aus acht Ecken und zwölf Kanten, je mit Position und
// Orientierung. Diese Darstellung ist der Sicht auf die 54 Felder überlegen:
// Züge werden zu einfachen Umordnungen, und die Erhaltungssätze lassen sich
// unmittelbar prüfen. Auf Feldebene wäre beides umständlich.
//
// Für Erkennung, Eingabe und Darstellung gibt es die Umrechnung in beide
// Richtungen am Ende der Datei.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine
// globalen Namen. Die ESLint-Konfiguration erzwingt das.

/** Ecken in fester Reihenfolge. Die Buchstaben nennen die drei Seiten. */
export const CORNERS = ['URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB'];

/** Kanten in fester Reihenfolge. Die Buchstaben nennen die zwei Seiten. */
export const EDGES = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR'];

/** Seiten in der Reihenfolge, in der die Felder gezählt werden. */
export const FACES = ['U', 'R', 'F', 'D', 'L', 'B'];

/** Anzahl der Züge: sechs Seiten mal drei Drehungen. */
export const MOVE_COUNT = 18;

// Die sechs Grunddrehungen als Umordnung. `cp` und `ep` sagen, welcher Stein
// nach dem Zug an dieser Stelle liegt; `co` und `eo` sagen, um wie viel er
// dabei gedreht wird.
//
// Übernommen aus dem Spike 4T-0011, wo sie über Erhaltungssätze und die
// vollständige Umkehr aller Koordinatenwerte geprüft sind. Hier werden sie
// erneut geprüft, statt ihnen zu vertrauen.
const FACE_MOVES = [
  // U
  {
    cp: [3, 0, 1, 2, 4, 5, 6, 7],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  // R
  {
    cp: [4, 1, 2, 0, 7, 5, 6, 3],
    co: [2, 0, 0, 1, 1, 0, 0, 2],
    ep: [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  // F
  {
    cp: [1, 5, 2, 3, 0, 4, 6, 7],
    co: [1, 2, 0, 0, 2, 1, 0, 0],
    ep: [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11],
    eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
  },
  // D
  {
    cp: [0, 1, 2, 3, 5, 6, 7, 4],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  // L
  {
    cp: [0, 2, 6, 3, 4, 1, 5, 7],
    co: [0, 1, 2, 0, 0, 2, 1, 0],
    ep: [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  // B
  {
    cp: [0, 1, 3, 7, 4, 5, 2, 6],
    co: [0, 0, 1, 2, 0, 0, 2, 1],
    ep: [0, 1, 2, 11, 4, 5, 6, 10, 8, 9, 3, 7],
    eo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
  },
];

/** Der gelöste Würfel. Jeder Aufruf liefert einen eigenen Zustand. */
export function solvedCube() {
  return {
    cp: [0, 1, 2, 3, 4, 5, 6, 7],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };
}

/**
 * Wendet eine der sechs Grunddrehungen einmal an.
 *
 * Der übergebene Zustand bleibt unangetastet; zurück kommt ein neuer. Diese
 * Zusicherung gilt für das ganze Modul und wird in der Prüfstrecke geprüft.
 * Sie kostet etwas Rechenzeit und erspart eine ganze Klasse von Fehlern, bei
 * denen ein Aufrufer einen Zustand ändert, den ein anderer noch braucht.
 */
function applyFaceTurn(cube, face) {
  const t = FACE_MOVES[face];
  const next = { cp: new Array(8), co: new Array(8), ep: new Array(12), eo: new Array(12) };
  for (let i = 0; i < 8; i++) {
    next.cp[i] = cube.cp[t.cp[i]];
    next.co[i] = (cube.co[t.cp[i]] + t.co[i]) % 3;
  }
  for (let i = 0; i < 12; i++) {
    next.ep[i] = cube.ep[t.ep[i]];
    next.eo[i] = (cube.eo[t.ep[i]] + t.eo[i]) % 2;
  }
  return next;
}

/**
 * Wendet einen Zug an. Der Index zählt von 0 bis 17:
 * Seitenindex mal drei, plus Anzahl der Vierteldrehungen minus eins.
 * Beispiel: 0 ist U, 1 ist U2, 2 ist U'.
 */
export function applyMove(cube, move) {
  if (!Number.isInteger(move) || move < 0 || move >= MOVE_COUNT) {
    throw new RangeError(`Ungültiger Zug-Index: ${move}`);
  }
  const face = Math.floor(move / 3);
  const turns = (move % 3) + 1;
  let next = cube;
  for (let i = 0; i < turns; i++) next = applyFaceTurn(next, face);
  return next;
}

/** Wendet eine Folge von Zug-Indizes nacheinander an. */
export function applyMoves(cube, moves) {
  let next = cube;
  for (const move of moves) next = applyMove(next, move);
  return next;
}

/** Der Zug, der den übergebenen aufhebt. U wird zu U', U2 bleibt U2. */
export function inverseMove(move) {
  const face = Math.floor(move / 3);
  return face * 3 + (2 - (move % 3));
}

/** Kehrt eine ganze Zugfolge um: rückwärts und jeder Zug einzeln umgekehrt. */
export function inverseMoves(moves) {
  return [...moves].reverse().map(inverseMove);
}

/**
 * Setzt Züge derselben Seite zu einem einzigen zusammen.
 *
 * Für die Hand des Anwenders sind zwei Drehungen derselben Seite kein Paar,
 * sondern ein Griff: `U` und `U2` hintereinander sind eine Dreivierteldrehung.
 * Wer die Züge einzeln ausführt, macht zwei Handgriffe statt einem; gemessen
 * betrifft das 8,0 Prozent aller Züge einer Lernlösung, siehe 4T-0040.
 *
 * **Die Rückgabe ist `null`, wenn sich die Züge ganz aufheben.** Einen
 * Zug-Index für «nicht drehen» gibt es nicht, und es soll ihn auch nicht
 * geben: Der Fall ist keine Rundung, sondern eine eigene Aussage, die die
 * Anzeige aussprechen muss. Er ist häufig, nämlich in 5 004 von 17 173 Ketten.
 *
 * Züge verschiedener Seiten sind ein Fehler im Aufrufer und werfen, wie ein
 * ungültiger Zug-Index in `applyMove`. Sie stillschweigend zu übergehen
 * lieferte einen Zug, der eine andere Seite dreht als eine der Vorlagen.
 */
export function mergeSameFace(moves) {
  if (!Array.isArray(moves) || moves.length === 0) {
    throw new RangeError('Ohne Zug gibt es nichts zusammenzusetzen');
  }
  const face = Math.floor(moves[0] / 3);
  let quarters = 0;
  for (const move of moves) {
    if (!Number.isInteger(move) || move < 0 || move >= MOVE_COUNT) {
      throw new RangeError(`Ungültiger Zug-Index: ${move}`);
    }
    if (Math.floor(move / 3) !== face) {
      throw new RangeError(`Zug ${move} dreht eine andere Seite als ${moves[0]}`);
    }
    quarters += (move % 3) + 1;
  }
  // Vier Vierteldrehungen führen auf die Ausgangslage zurück.
  quarters %= 4;
  return quarters === 0 ? null : face * 3 + quarters - 1;
}

/** Vergleicht zwei Zustände in allen vier Bestandteilen. */
export function equals(a, b) {
  for (let i = 0; i < 8; i++) {
    if (a.cp[i] !== b.cp[i] || a.co[i] !== b.co[i]) return false;
  }
  for (let i = 0; i < 12; i++) {
    if (a.ep[i] !== b.ep[i] || a.eo[i] !== b.eo[i]) return false;
  }
  return true;
}

/** Ist der Würfel gelöst? */
export function isSolved(cube) {
  return equals(cube, solvedCube());
}

// --------------------------------------------------------------- Feldebene
//
// Die 54 Felder werden seitenweise gezählt, in der Reihenfolge U R F D L B,
// je Seite zeilenweise von links oben nach rechts unten. Feld 4 jeder Seite
// ist der Mittelstein und bestimmt die Farbe dieser Seite.

/**
 * Feldnummern je Ecke, in der Reihenfolge der Buchstaben im Eckennamen.
 * Wird von `validate.js` mitbenutzt, um betroffene Felder zu benennen.
 */
export const CORNER_FACELETS = [
  [8, 9, 20],
  [6, 18, 38],
  [0, 36, 47],
  [2, 45, 11],
  [29, 26, 15],
  [27, 44, 24],
  [33, 53, 42],
  [35, 17, 51],
];

/** Feldnummern je Kante, in der Reihenfolge der Buchstaben im Kantennamen. */
export const EDGE_FACELETS = [
  [5, 10],
  [7, 19],
  [3, 37],
  [1, 46],
  [32, 16],
  [28, 25],
  [30, 43],
  [34, 52],
  [23, 12],
  [21, 41],
  [50, 39],
  [48, 14],
];

const CORNER_COLORS = CORNERS.map((name) => [...name]);
const EDGE_COLORS = EDGES.map((name) => [...name]);

/** Erzeugt aus einem Zustand die 54 Felder als Seitenbuchstaben. */
export function toFacelets(cube) {
  const facelets = new Array(54);
  for (let i = 0; i < 6; i++) facelets[i * 9 + 4] = FACES[i];
  for (let i = 0; i < 8; i++) {
    for (let k = 0; k < 3; k++) {
      facelets[CORNER_FACELETS[i][(k + cube.co[i]) % 3]] = CORNER_COLORS[cube.cp[i]][k];
    }
  }
  for (let i = 0; i < 12; i++) {
    for (let k = 0; k < 2; k++) {
      facelets[EDGE_FACELETS[i][(k + cube.eo[i]) % 2]] = EDGE_COLORS[cube.ep[i]][k];
    }
  }
  return facelets;
}

/**
 * Erzeugt aus 54 Feldern einen Zustand, oder `null`, wenn die Felder keinen
 * Würfel ergeben.
 *
 * Diese Funktion prüft nur so viel, wie sie zum Arbeiten braucht: ob jedes
 * Feldertripel einen bekannten Eckstein und jedes Feldpaar eine bekannte
 * Kante ergibt. Die vollständige Prüfung auf Lösbarkeit, also Farbverteilung,
 * Vollständigkeit und Paritäten, ist Sache von `validate.js`. Diese Trennung
 * ist gewollt: Hier wird gerechnet, dort wird beurteilt.
 */
export function fromFacelets(facelets) {
  if (!Array.isArray(facelets) || facelets.length !== 54) return null;

  const cube = { cp: new Array(8), co: new Array(8), ep: new Array(12), eo: new Array(12) };

  for (let i = 0; i < 8; i++) {
    const seen = CORNER_FACELETS[i].map((f) => facelets[f]);
    const found = findPiece(CORNER_COLORS, seen);
    if (!found) return null;
    cube.cp[i] = found.index;
    cube.co[i] = found.rotation;
  }
  for (let i = 0; i < 12; i++) {
    const seen = EDGE_FACELETS[i].map((f) => facelets[f]);
    const found = findPiece(EDGE_COLORS, seen);
    if (!found) return null;
    cube.ep[i] = found.index;
    cube.eo[i] = found.rotation;
  }
  return cube;
}

/**
 * Sucht den Stein, dessen Farben zu den gesehenen passen, und die Drehung,
 * mit der er dort liegt. Verglichen wird über alle Verschiebungen, weil ein
 * Stein in jeder Orientierung eingebaut sein kann.
 */
function findPiece(pieces, seen) {
  const n = seen.length;
  for (let index = 0; index < pieces.length; index++) {
    const colors = pieces[index];
    for (let rotation = 0; rotation < n; rotation++) {
      let match = true;
      for (let k = 0; k < n; k++) {
        if (colors[k] !== seen[(k + rotation) % n]) {
          match = false;
          break;
        }
      }
      if (match) return { index, rotation };
    }
  }
  return null;
}
