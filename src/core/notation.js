// Notation: Zugfolgen als Text lesen und schreiben.
//
// Die Notation ist die Schnittstelle zwischen Mensch und Modell. Sie
// erscheint in den Lektionen, in der Verwürfelung, in der Wiedergabe der
// Lösung und in der Tastaturbedienung. Beide Richtungen laufen über dieselbe
// Namenstabelle, damit sie nicht auseinanderlaufen können.
//
// Die Notation bleibt in beiden Oberflächensprachen international. Sie ist
// die gemeinsame Sprache aller weiterführenden Quellen; wer sie eingedeutscht
// lernt, kann später keine fremde Anleitung lesen.

import { FACES, MOVE_COUNT } from './cube.js';

/** Anhänge in der Reihenfolge der Vierteldrehungen: eine, zwei, drei. */
const SUFFIXES = ['', '2', "'"];

/** Die achtzehn Zugnamen, Index gleich Zug-Index aus `cube.js`. */
export const MOVE_NAMES = FACES.flatMap((face) => SUFFIXES.map((suffix) => face + suffix));

/** Schreibt einen einzelnen Zug. */
export function formatMove(move) {
  if (!Number.isInteger(move) || move < 0 || move >= MOVE_COUNT) {
    throw new RangeError(`Ungültiger Zug-Index: ${move}`);
  }
  return MOVE_NAMES[move];
}

/**
 * Schreibt eine Zugfolge in Normalform: die Namen durch je ein Leerzeichen
 * getrennt, ohne führende oder abschließende Leerzeichen.
 */
export function formatMoves(moves) {
  return [...moves].map(formatMove).join(' ');
}

/**
 * Liest eine Zugfolge aus Text.
 *
 * Rückgabe bei Erfolg: `{ ok: true, moves }`.
 * Rückgabe bei Misserfolg: `{ ok: false, position, zeichen, grund }`, wobei
 * `position` der nullbasierte Index im übergebenen Text ist.
 *
 * Der Kern wirft hier nicht, sondern liefert einen Befund. Die Formulierung
 * für den Anwender ist Sache der Oberfläche, die den Grund übersetzt und die
 * Stelle hervorhebt. Ohne Stellenangabe müsste der Anwender bei einer Folge
 * aus dreißig Zeichen raten.
 */
export function parseMoves(text) {
  if (typeof text !== 'string') {
    return { ok: false, position: 0, zeichen: '', grund: 'kein-text' };
  }

  const moves = [];
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    // Leerraum in jeder Form überspringen, auch mehrfachen und Zeilenumbrüche.
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Kleinbuchstaben werden ausdrücklich abgewiesen und nicht stillschweigend
    // als Großbuchstaben gedeutet. In der erweiterten Notation ab Release 2
    // bezeichnen sie eine andere Drehung, nämlich zwei Schichten zugleich.
    if (FACES.includes(char.toUpperCase()) && char !== char.toUpperCase()) {
      return { ok: false, position: i, zeichen: char, grund: 'kleinbuchstabe' };
    }

    const face = FACES.indexOf(char);
    if (face < 0) {
      return { ok: false, position: i, zeichen: char, grund: 'keine-seite' };
    }

    // Anhang lesen, falls vorhanden. Ein zweiter Anhang ist ein Fehler.
    //
    // Das typografische Apostroph wird wie das gerade behandelt. Wer eine
    // Zugfolge aus einer Textverarbeitung einfügt, bekommt oft jenes; sie
    // abzuweisen wäre formal richtig und praktisch ärgerlich.
    const ANHAENGE = ['2', "'", '’'];
    let turns = 0;
    let j = i + 1;
    if (j < text.length && ANHAENGE.includes(text[j])) {
      turns = text[j] === '2' ? 1 : 2;
      j++;
      if (j < text.length && ANHAENGE.includes(text[j])) {
        return { ok: false, position: j, zeichen: text[j], grund: 'zweiter-anhang' };
      }
    } else if (j < text.length && /[0-9]/.test(text[j])) {
      // Eine andere Ziffer als die Zwei ergibt keinen Zug dieser Ausbaustufe.
      return { ok: false, position: j, zeichen: text[j], grund: 'ungueltige-zahl' };
    }

    moves.push(face * 3 + turns);
    i = j;
  }

  return { ok: true, moves };
}

/**
 * Bequemer Zugang für Stellen, an denen der Text nachweislich gültig ist,
 * etwa bei fest eingebauten Zugfolgen der Lektionen. Wirft bei Fehlern, statt
 * einen Befund zu liefern, damit ein Tippfehler in einer Lektion sofort
 * auffällt und nicht stillschweigend zu einer leeren Folge führt.
 */
export function parseMovesOrThrow(text) {
  const result = parseMoves(text);
  if (!result.ok) {
    throw new SyntaxError(
      `Unlesbare Zugfolge an Stelle ${result.position} (${result.zeichen}): ${result.grund}`,
    );
  }
  return result.moves;
}
