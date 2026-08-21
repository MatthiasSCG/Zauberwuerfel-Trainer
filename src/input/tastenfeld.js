// Das Tastenfeld: achtzehn Drucktasten in sechs Dreierblöcken.
//
// Ein Auswahlfeld mit achtzehn Einträgen ist zum Ausprobieren brauchbar und
// zum Üben unbrauchbar; wer eine Zugfolge nachvollziehen will, klickt sich
// tot. Nachtrag des Product Owners vom 2026-08-13.
//
// **Jede Taste trägt ihre Tastenkombination.** Damit ist das Feld zugleich die
// Übersicht, die S-0007 in AK3 verlangt, und es gibt keine getrennte Legende,
// die von der Belegung abweichen könnte.

import { FACES, MOVE_COUNT } from '../core/cube.js';
import { MOVE_NAMES } from '../core/notation.js';
import { tasteFuerZug } from './tasten.js';

/**
 * Die Blöcke in ihrer Anordnung, je zwei nebeneinander.
 *
 * Gegenüberliegende Seiten stehen als Paar, weil sie am Würfel eines bilden
 * und im Lernpfad meist zusammen auftreten.
 */
export const BLOCK_PAARE = [
  ['U', 'D'],
  ['R', 'L'],
  ['F', 'B'],
];

/**
 * Baut das Tastenfeld. `aufZug` bekommt den Zug-Index.
 *
 * `aufZeigen` bekommt den Zug-Index, solange der Zeiger oder der Fokus auf
 * einer Taste steht, und `null`, sobald beides sie verlässt. Aus 4T-0065: Wer
 * auf eine Taste zeigt, sieht am Würfel, welche Schicht sie dreht und wohin.
 * **Das Tastenfeld kennt den Würfel dabei nicht**, es meldet nur, worauf
 * gezeigt wird.
 */
export function erzeugeTastenfeld(dokument, aufZug, aufZeigen = () => {}) {
  const knoten = dokument.createElement('div');
  knoten.className = 'tastenfeld';

  const tasten = new Map();

  for (const paar of BLOCK_PAARE) {
    const zeile = dokument.createElement('div');
    zeile.className = 'tastenfeld-zeile';
    for (const seite of paar) {
      const block = dokument.createElement('div');
      block.className = 'tastenblock';
      // Die Seite steht am Block, damit das Raster ihn ansprechen kann, ohne
      // über Geschwisterzählung zu gehen. Seit 4T-0058 stehen die sechs Blöcke
      // bei breiten Fenstern links und rechts vom Würfel statt untereinander,
      // und ihre Stellung im Dokument sagt dann nichts mehr über ihren Platz.
      block.dataset.seite = seite;
      const seitenIndex = FACES.indexOf(seite);
      // Im Uhrzeigersinn, dagegen, halbe Drehung. Die Reihenfolge folgt der
      // Notation und nicht der Zählung des Kerns: Wer U liest, erwartet U'
      // daneben und nicht U2.
      for (const art of [0, 2, 1]) {
        const zug = seitenIndex * 3 + art;
        const taste = dokument.createElement('button');
        taste.type = 'button';
        taste.className = 'zugtaste ruhend notation';
        taste.dataset.zug = String(zug);
        const notation = dokument.createElement('span');
        notation.className = 'zugtaste-notation';
        notation.textContent = MOVE_NAMES[zug];
        const kuerzel = dokument.createElement('span');
        kuerzel.className = 'zugtaste-kuerzel';
        kuerzel.textContent = tasteFuerZug(zug);
        taste.append(notation, kuerzel);
        taste.addEventListener('click', () => aufZug(zug));
        // **Eine gesperrte Taste zeigt nichts.** Während einer Wiedergabe
        // gehört die Hervorhebung dem anstehenden Zug, und zwei Quellen für
        // dasselbe Zeichen wären ein Wettlauf. Der Zeiger erreicht eine
        // gesperrte Schaltfläche außerdem nicht in jedem Browser gleich, und
        // ein Verhalten, das davon abhinge, wäre nicht prüfbar.
        for (const ereignis of ['pointerenter', 'focus']) {
          taste.addEventListener(ereignis, () => {
            if (!taste.disabled) aufZeigen(zug);
          });
        }
        for (const ereignis of ['pointerleave', 'blur']) {
          taste.addEventListener(ereignis, () => aufZeigen(null));
        }
        block.append(taste);
        tasten.set(zug, taste);
      }
      zeile.append(block);
    }
    knoten.append(zeile);
  }

  return {
    knoten,

    /**
     * Hebt eine Taste kurz hervor, wenn ihr Zug über die Tastatur kam.
     *
     * Ohne diese Rückmeldung bleibt offen, ob der Tastendruck angekommen ist,
     * und der Anwender tippt ein zweites Mal.
     */
    melde(zug) {
      const taste = tasten.get(zug);
      if (!taste) return;
      taste.classList.remove('gedrueckt');
      // Das Auslesen erzwingt einen neuen Anlauf der Hervorhebung, auch wenn
      // dieselbe Taste zweimal hintereinander kommt.
      void taste.offsetWidth;
      taste.classList.add('gedrueckt');
    },

    /**
     * Sperrt oder gibt alle Zugtasten frei.
     *
     * Gebraucht während der Wiedergabe einer Lösung: Ein Zug am Übungswürfel
     * machte die abgespielte Zugfolge ungültig. Gesperrt wird sichtbar und
     * nicht stumm, damit erkennbar bleibt, warum nichts geschieht.
     */
    sperre(ja) {
      for (const taste of tasten.values()) taste.disabled = ja;
    },

    /** Alle achtzehn Tasten, für die Prüfung von außen. */
    anzahl: () => tasten.size,
  };
}

/** Die Zahl der Tasten, die das Feld tragen muss. */
export const TASTEN_ZAHL = MOVE_COUNT;
