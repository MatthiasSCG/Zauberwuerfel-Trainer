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
//
// **Was geschrieben wird und was zusätzlich gelesen.** Geschrieben wird genau
// eine Form je Zug, nämlich der Name aus `MOVE_NAMES`. Gelesen wird darüber
// hinaus, was ein Mensch beim Einfügen aus einer fremden Quelle mitbringt: das
// typografische Apostroph anstelle des geraden und die Schreibweise mit
// angehängtem `w` anstelle des Kleinbuchstabens, also `Rw` für `r`. Beim Lesen
// nachsichtig, beim Schreiben streng in einer Form; entschieden in 4T-0016 und
// für das `w` in 3E-0031 fortgeschrieben.
//
// **Die Schreibweise bleibt bedeutungstragend.** Sechs Buchstaben bezeichnen
// groß und klein verschiedene Züge. Wo das nicht so ist, bei `M E S` und bei
// `x y z`, wird die jeweils andere Schreibweise trotzdem abgewiesen, und zwar
// mit einem eigenen Grund. Sie stillschweigend zu deuten brächte dem Anwender
// eine Regel bei, die es nicht gibt.

// `MOVE_COUNT` wird hier bewusst nicht gebraucht: Es zählt allein die
// achtzehn Grunddrehungen, die der Löser durchsucht. Der Umfang der Notation
// ist `EXTENDED_MOVE_COUNT`.
import { FACES } from './cube.js';
import { EXTENDED_MOVE_COUNT, SLICE_BASE, WIDE_BASE, ROTATION_BASE } from './moves.js';

/** Anhänge in der Reihenfolge der Vierteldrehungen: eine, zwei, drei. */
const SUFFIXES = ['', '2', "'"];

/** Die Grundzeichen der Mittelschichten, in der Reihenfolge von `SLICE_AXES`. */
const SLICE_LETTERS = ['M', 'E', 'S'];

/** Die Grundzeichen der Ganzdrehungen, in der Reihenfolge der drei Achsen. */
const ROTATION_LETTERS = ['x', 'y', 'z'];

/** Die Grundzeichen der Doppelschichten: die sechs Seiten in Kleinbuchstaben. */
const WIDE_LETTERS = FACES.map((face) => face.toLowerCase());

/**
 * Die vierundfünfzig Zugnamen, Index gleich Zug-Index aus `moves.js`.
 *
 * **Jeder Block wird an seine Basis gesetzt und nicht angehängt.** Eine
 * Aneinanderreihung ergäbe heute dasselbe, stimmte aber nur so lange, wie die
 * Blocklängen zu den Basen in `moves.js` passen. Wer dort einen Block
 * verschiebt, bekommt hier eine belegte Stelle oder eine Lücke und damit einen
 * Fehler beim Laden, statt stillschweigend falscher Namen. Der Löser sucht
 * seine Züge der zweiten Phase über diese Liste; ein verschobener Name wäre
 * dort ein anderer Zug.
 */
export const MOVE_NAMES = buildMoveNames();

function buildMoveNames() {
  const names = new Array(EXTENDED_MOVE_COUNT).fill(null);
  const setze = (base, letters) => {
    letters.forEach((letter, stelle) => {
      SUFFIXES.forEach((suffix, drehungen) => {
        const index = base + stelle * 3 + drehungen;
        if (index >= names.length) throw new Error(`Zugname ${letter}${suffix} liegt außerhalb`);
        if (names[index] !== null) throw new Error(`Stelle ${index} ist doppelt belegt`);
        names[index] = letter + suffix;
      });
    });
  };
  setze(0, FACES);
  setze(SLICE_BASE, SLICE_LETTERS);
  setze(WIDE_BASE, WIDE_LETTERS);
  setze(ROTATION_BASE, ROTATION_LETTERS);
  const luecke = names.indexOf(null);
  if (luecke >= 0) throw new Error(`Stelle ${luecke} trägt keinen Zugnamen`);
  return names;
}

/**
 * Dieselbe Tabelle, rückwärts gelesen.
 *
 * Damit ist bauartbedingt ausgeschlossen, dass ein Zug einen Namen bekommt,
 * den niemand wieder einlesen kann. Ein neuer Zug wird an einer Stelle
 * ergänzt, nämlich oben, und beide Richtungen kennen ihn danach.
 */
const MOVE_BY_NAME = new Map(MOVE_NAMES.map((name, move) => [name, move]));

/** Schreibt einen einzelnen Zug. */
export function formatMove(move) {
  if (!Number.isInteger(move) || move < 0 || move >= EXTENDED_MOVE_COUNT) {
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

/** Das typografische Apostroph wird wie das gerade gelesen, siehe 4T-0016. */
const ANHAENGE = ['2', "'", '’'];

/** Bringt einen gelesenen Anhang auf die Form, in der er geschrieben wird. */
const normalisiereAnhang = (zeichen) => (zeichen === '2' ? '2' : "'");

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
 *
 * Die möglichen Gründe: `kein-text`, `keine-seite`, `kleinbuchstabe`,
 * `grossbuchstabe`, `zweiter-anhang` und `ungueltige-zahl`.
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

    const grundzeichen = liesGrundzeichen(text, i);
    if (grundzeichen.grund !== undefined) {
      return { ok: false, position: i, zeichen: char, grund: grundzeichen.grund };
    }

    // Anhang lesen, falls vorhanden. Ein zweiter Anhang ist ein Fehler.
    let anhang = '';
    let j = grundzeichen.naechste;
    if (j < text.length && ANHAENGE.includes(text[j])) {
      anhang = normalisiereAnhang(text[j]);
      j++;
      if (j < text.length && ANHAENGE.includes(text[j])) {
        return { ok: false, position: j, zeichen: text[j], grund: 'zweiter-anhang' };
      }
    } else if (j < text.length && /[0-9]/.test(text[j])) {
      // Eine andere Ziffer als die Zwei ergibt keinen Zug dieser Ausbaustufe.
      return { ok: false, position: j, zeichen: text[j], grund: 'ungueltige-zahl' };
    }

    const move = MOVE_BY_NAME.get(grundzeichen.zeichen + anhang);
    if (move === undefined) {
      // Unerreichbar, solange `liesGrundzeichen` nur Zeichen durchlässt, für
      // die es einen Block gibt. Hier wäre nicht die Eingabe falsch, sondern
      // dieses Modul; ein Wurf ist dann besser als ein Befund an den Anwender.
      throw new Error(`Kein Zug zum Namen ${grundzeichen.zeichen + anhang}`);
    }
    moves.push(move);
    i = j;
  }

  return { ok: true, moves };
}

/**
 * Liest das Grundzeichen einer Wortmarke an Stelle `i`.
 *
 * Zurück kommt entweder das Zeichen in der Form, in der es geschrieben wird,
 * samt der nächsten zu lesenden Stelle, oder ein Fehlergrund.
 *
 * **Die Schreibweise mit `w` wird hier aufgelöst und verschwindet damit aus
 * dem Rest des Lesers.** Ab dieser Zeile gibt es nur noch die eine Form, in
 * der auch geschrieben wird.
 */
function liesGrundzeichen(text, i) {
  const char = text[i];

  if (FACES.includes(char)) {
    if (text[i + 1] === 'w') return { zeichen: char.toLowerCase(), naechste: i + 2 };
    return { zeichen: char, naechste: i + 1 };
  }
  if (
    SLICE_LETTERS.includes(char) ||
    WIDE_LETTERS.includes(char) ||
    ROTATION_LETTERS.includes(char)
  ) {
    return { zeichen: char, naechste: i + 1 };
  }

  // Die beiden Fehlgriffe bei der Schreibweise bekommen je einen eigenen
  // Grund. Der Anwender hat den richtigen Zug gemeint und nur den falschen
  // Kasten getroffen; die Oberfläche kann daraus einen Hinweis machen, der die
  // Regel erklärt, statt nur abzulehnen.
  if (SLICE_LETTERS.includes(char.toUpperCase()) && char !== char.toUpperCase()) {
    return { grund: 'kleinbuchstabe' };
  }
  if (ROTATION_LETTERS.includes(char.toLowerCase()) && char !== char.toLowerCase()) {
    return { grund: 'grossbuchstabe' };
  }
  return { grund: 'keine-seite' };
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
