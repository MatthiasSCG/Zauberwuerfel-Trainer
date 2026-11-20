// Ein Zug in Worten, etwa «rechte Seite, gegen den Uhrzeigersinn».
//
// «R'» sagt einem Einsteiger nichts über die Richtung, und die Marke am Würfel
// will einmal gedeutet werden. Diesen Satz stellt die Anzeige des anstehenden
// Zuges neben die Notation, seit 4T-0034.
//
// **Ein eigenes Modul und keine Funktion in der Verdrahtung**, seit 4T-0100.
// Für die sechsunddreißig erweiterten Züge wird die Bezugsfläche aus der
// Zugbeschreibung des Kerns gerechnet, und genau diese Rechnung gehört
// geprüft. In `app/main.js` läge sie hinter einem `document` und wäre ohne
// Browser nicht erreichbar.
//
// **Den Sprachbaum kennt dieses Modul nicht.** Die Textfunktion wird
// hereingereicht, wie überall in `view`.

import { FACES } from '../core/cube.js';
import { ROTATION_BASE, WIDE_BASE, isFaceMove, moveDescription } from '../core/moves.js';

/**
 * Die drei Richtungen, nach der Zahl der Vierteldrehungen.
 *
 * Eine, zwei und drei Vierteldrehungen sind Uhrzeigersinn, halbe Umdrehung und
 * Gegenrichtung.
 */
const RICHTUNGEN = ['uhr', 'halb', 'gegen'];

/**
 * Die positive und die negative Fläche jeder der drei Achsen.
 *
 * **Aus dem Kern gerechnet und nicht hingeschrieben.** Der Zug einer Fläche im
 * Uhrzeigersinn trägt den Index «Fläche mal drei», und seine Beschreibung
 * nennt Achse und Vorzeichen. Eine Tabelle von Hand wäre eine zweite Wahrheit
 * neben den Achsen in `core/moves.js` und liefe ihnen beim ersten
 * Vorzeichenfehler davon, und zwar stillschweigend.
 */
const ACHSENFLAECHEN = [];
for (const [nummer, seite] of FACES.entries()) {
  const { axis, quarters } = moveDescription(nummer * 3);
  const flaechen = ACHSENFLAECHEN[axis] ?? {};
  flaechen[quarters > 0 ? 'positiv' : 'negativ'] = seite;
  ACHSENFLAECHEN[axis] = flaechen;
}

/** Die Zugart der drei neuen Blöcke, als Bezeichner im Sprachbaum. */
function zugart(zug) {
  if (zug < WIDE_BASE) return 'mittel';
  if (zug < ROTATION_BASE) return 'doppel';
  return 'ganz';
}

/**
 * Die Fläche, von der aus die Drehung gesehen wird.
 *
 * Für eine Flächendrehung ist das die drehende Seite selbst. Für die übrigen
 * ist es die Außenfläche der Achse, in deren Richtung der Zug dreht: bei `M`
 * die linke, bei `E` die untere, bei `S` die vordere, bei einer
 * Doppelschicht ihre namengebende Seite und bei `x y z` die rechte, obere und
 * vordere.
 */
export function bezugsflaeche(zug) {
  const { axis, quarters } = moveDescription(zug);
  return ACHSENFLAECHEN[axis][quarters > 0 ? 'positiv' : 'negativ'];
}

/**
 * Der Zug in Worten. `text` ist die Textfunktion der gewählten Sprache.
 *
 * **Die Richtung kommt aus der Zugbeschreibung des Kerns**, seit 4T-0100:
 * `quarters` zählt die Vierteldrehungen, und sein Betrag ist eins, zwei oder
 * drei. Bis dahin stand hier `zug % 3`, was für alle vierundfünfzig Züge
 * dasselbe ergibt, aber nur so lange, wie jede Blockbasis durch drei teilbar
 * bleibt. Das ist eine Annahme über den Kern, und sie wird nicht mehr
 * getroffen.
 *
 * **Die sechsunddreißig erweiterten Züge haben keine einzelne Seite.** Sie
 * bekommen deshalb einen eigenen Satz aus Zugart und Bezugsfläche. Ohne die
 * zweite Angabe bliebe «im Uhrzeigersinn» bei einer Mittelschicht ohne Bezug:
 * Sie folgt der linken Fläche und nicht der rechten, und das sagt ihr Name
 * nicht.
 */
export function zugInWorten(zug, text) {
  const { quarters } = moveDescription(zug);
  const richtung = text(`richtung.${RICHTUNGEN[Math.abs(quarters) - 1]}`);
  if (isFaceMove(zug)) {
    return text('anstehend.klartext', {
      seite: text(`seite.${FACES[Math.floor(zug / 3)]}`),
      richtung,
    });
  }
  return text('anstehend.klartextErweitert', {
    art: text(`zugart.${zugart(zug)}`),
    richtung,
    bezug: text(`seiteAus.${bezugsflaeche(zug)}`),
  });
}
