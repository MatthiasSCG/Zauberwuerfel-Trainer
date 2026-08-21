// Die Belegung der Tastatur.
//
// Wer den Würfel bedient, schreibt nebenbei Notation. Die sechs Buchstaben der
// Notation lösen die Vierteldrehung aus, die Umschalttaste die Gegenrichtung,
// die Alt-Taste die halbe Drehung.
//
// **Dieses Modul verwendet keinen globalen Namen.** Es bekommt die Angaben
// eines Tastendrucks als Datenwerte und liefert einen Zug-Index des Kerns.
// Damit ist die Belegung vollständig ohne Browser prüfbar, und das ist der
// Teil, der Fallunterscheidungen enthält.

import { FACES } from '../core/cube.js';

/**
 * Die drei Ausprägungen je Seite, in der Zählung des Kerns.
 *
 * Der Zug-Index ist Seitenindex mal drei plus Vierteldrehungen minus eins.
 * Eine Vierteldrehung ergibt also den Rest null, die halbe eins, die
 * Gegenrichtung zwei.
 */
export const IM_UHRZEIGERSINN = 0;
export const HALBE_DREHUNG = 1;
export const GEGEN_UHRZEIGERSINN = 2;

/**
 * Der Buchstabe einer Taste, oder `null`.
 *
 * Zuerst wird der erzeugte Buchstabe genommen, denn der Anwender soll das
 * tippen, was die Notation nennt. Bei gedrückter Alt-Taste liefern manche
 * Tastaturbelegungen dort ein Sonderzeichen; dann greift die physische Lage
 * der Taste als Rückfall.
 */
function buchstabe(taste, lage) {
  if (typeof taste === 'string' && /^[a-z]$/i.test(taste)) return taste.toUpperCase();
  if (typeof lage === 'string' && /^Key[A-Z]$/.test(lage)) return lage.slice(3);
  return null;
}

/**
 * Der Zug zu einem Tastendruck, oder `null`.
 *
 * `null` ist der häufigste Fall und kein Fehler: Die meisten Tasten bedeuten
 * hier nichts und dürfen deshalb auch keine Meldung erzeugen.
 *
 * **Alt hat Vorrang vor der Umschalttaste.** Eine halbe Drehung hat keine
 * Richtung, und Alt zusammen mit Umschalten wäre sonst eine stille
 * Fallunterscheidung, über die niemand nachgedacht hat.
 */
export function zugFuerTaste({ taste, lage, umschalt = false, alt = false } = {}) {
  const zeichen = buchstabe(taste, lage);
  if (zeichen === null) return null;
  const seite = FACES.indexOf(zeichen);
  if (seite < 0) return null;
  if (alt) return seite * 3 + HALBE_DREHUNG;
  if (umschalt) return seite * 3 + GEGEN_UHRZEIGERSINN;
  return seite * 3 + IM_UHRZEIGERSINN;
}

/**
 * Die Beschreibung der Tastenkombination zu einem Zug.
 *
 * Sie steht auf der Drucktaste und ist damit zugleich die Übersicht, die
 * S-0007 in AK3 verlangt. Eine getrennte Legende könnte von der Belegung
 * abweichen; diese kann es nicht.
 */
export function tasteFuerZug(zug) {
  const seite = FACES[Math.floor(zug / 3)];
  const art = zug % 3;
  if (art === HALBE_DREHUNG) return `Alt+${seite}`;
  if (art === GEGEN_UHRZEIGERSINN) return `⇧${seite}`;
  return seite;
}
