// Verwürfelung: erzeugt eine zufällige Zugfolge.
//
// Der Generator ist Voraussetzung für die Abschlusslektion des Lernpfads, in
// der drei verwürfelte Würfel nacheinander zu lösen sind. Ohne ihn gibt es
// diese Lektion nicht und damit kein Quality-Gate für Release 1.
//
// Er gehört technisch in den Kern, obwohl er fachlich zum Üben zählt: Er
// erzeugt eine Zugfolge und braucht dafür das Zugmodell.

import { MOVE_COUNT } from './cube.js';

/** Übliche Länge einer Verwürfelung. */
export const DEFAULT_LENGTH = 20;

/**
 * Höchstzahl vergeblicher Ziehungen für einen einzelnen Zug.
 *
 * Bei redlichem Zufall sind schon zwei Fehlversuche in Folge unwahrscheinlich,
 * weil höchstens zwei der sechs Seiten ausgeschlossen sind. Hundert Versuche
 * treten damit praktisch nie ein und lassen zugleich keinen Zweifel, dass die
 * Quelle entartet ist.
 *
 * Öffentlich, damit die Prüfstrecke die Zahl nicht ein zweites Mal führt.
 */
export const MAX_ATTEMPTS = 100;

/** Zu jeder Seite die gegenüberliegende. U und D, R und L, F und B. */
const oppositeFace = (face) => (face + 3) % 6;

/**
 * Zwei Regeln, die eine brauchbare Verwürfelung einhält.
 *
 * 1. Kein Zug derselben Seite wie der unmittelbar vorige. `R R'` hebt sich
 *    auf, `R R` ist in Wahrheit `R2`; in beiden Fällen ist die Folge kürzer,
 *    als sie aussieht.
 * 2. Kein Zug derselben Seite wie der vorvorige, wenn dazwischen die
 *    Gegenseite liegt. Gegenüberliegende Seiten stören einander nicht, also
 *    ist `R L R'` dasselbe wie `L`, nur länger geschrieben.
 *
 * Beide Regeln dienen demselben Zweck: Eine Folge aus zwanzig Zügen soll auch
 * zwanzig Züge weit verwürfeln.
 */
function isAllowed(moves, face) {
  const n = moves.length;
  if (n >= 1) {
    const prevFace = Math.floor(moves[n - 1] / 3);
    if (prevFace === face) return false;
    if (n >= 2) {
      const prevPrevFace = Math.floor(moves[n - 2] / 3);
      if (prevPrevFace === face && prevFace === oppositeFace(face)) return false;
    }
  }
  return true;
}

/**
 * Erzeugt eine Verwürfelung als Folge von Zug-Indizes.
 *
 * Die Zufallsquelle ist austauschbar, damit die Prüfstrecke mit einer festen
 * Quelle arbeiten und ein Ergebnis wiederholen kann. Ohne diese Möglichkeit
 * wäre ein Fehlschlag nicht nachstellbar.
 *
 * Genau diese Möglichkeit ist zugleich die einzige Gefahrenstelle: Eine Quelle
 * ohne Streuung bietet immer wieder dieselbe ausgeschlossene Seite an, und die
 * Schleife käme nie zum Ende. Deshalb die Schranke unten. Sie wirft, statt die
 * Folge zu kürzen, denn eine gekürzte Verwürfelung sähe aus wie eine gültige
 * und wäre keine; ein Fehler dagegen zeigt sofort auf die Quelle.
 */
export function scramble({ random = Math.random, length = DEFAULT_LENGTH } = {}) {
  if (!Number.isInteger(length) || length < 0) {
    throw new RangeError(`Ungültige Länge: ${length}`);
  }
  const moves = [];
  // Der Zähler gilt je Zug und wird nach jedem gesetzten Zug zurückgesetzt.
  // Über die ganze Folge zu zählen wäre falsch: Bei redlichem Zufall summieren
  // sich vereinzelte Fehlversuche mit wachsender Länge auf und erreichten die
  // Schranke irgendwann auch ohne jede Entartung.
  let attempts = 0;
  while (moves.length < length) {
    // Erst die Seite wählen, dann die Drehung. Andersherum müsste ein
    // unzulässiger Zug verworfen und neu gezogen werden, was die Verteilung
    // der Drehungen unmerklich verzerrte.
    const face = Math.floor(random() * 6);
    if (!isAllowed(moves, face)) {
      if (++attempts >= MAX_ATTEMPTS) {
        throw new Error(
          `Die Zufallsquelle liefert keine brauchbare Streuung: ` +
            `nach ${MAX_ATTEMPTS} Versuchen war für Zug ${moves.length + 1} ` +
            `keine zulässige Seite dabei.`,
        );
      }
      continue;
    }
    attempts = 0;
    const turns = Math.floor(random() * 3);
    moves.push(face * 3 + turns);
  }
  return moves;
}

/**
 * Prüft, ob eine Zugfolge die beiden Regeln einhält.
 *
 * Öffentlich, weil die Regeln damit belegbar werden, statt nur im Generator
 * zu stecken. Die Prüfstrecke nutzt sie, und eine von außen übernommene
 * Verwürfelung ließe sich damit ebenfalls beurteilen.
 */
export function isValidScramble(moves) {
  if (!Array.isArray(moves)) return { ok: false, position: 0, grund: 'keine-folge' };
  const seen = [];
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (!Number.isInteger(move) || move < 0 || move >= MOVE_COUNT) {
      return { ok: false, position: i, grund: 'ungueltiger-zug' };
    }
    const face = Math.floor(move / 3);
    if (!isAllowed(seen, face)) {
      const prevFace = Math.floor(seen[seen.length - 1] / 3);
      return {
        ok: false,
        position: i,
        grund: prevFace === face ? 'seite-wiederholt' : 'zusammenfassbar',
      };
    }
    seen.push(move);
  }
  return { ok: true };
}
