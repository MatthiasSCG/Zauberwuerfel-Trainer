// Auswahl der Sprache und Zugriff auf die Textbausteine.
//
// Dieses Modul hängt von nichts ab, auch nicht vom Kern. So sieht es der
// Modulschnitt der Architektur vor: Texte werden von überall gebraucht, und
// eine Abhängigkeit auf den Kern würde sie unnötig binden.
//
// Es verwendet keinen globalen Namen. Die Spracheinstellung des Browsers wird
// hereingereicht, nicht hier abgefragt. Damit ist die Vorauswahl ohne Browser
// prüfbar, und das ist der Teil, der Fallunterscheidungen enthält.

import de from './de.js';
import en from './en.js';

/** Die verfügbaren Sprachen. */
export const SPRACHEN = { de, en };

/**
 * Rückfallsprache.
 *
 * Englisch, nicht Deutsch: Es ist die Wahl mit der größeren Reichweite für
 * alle, deren Browser weder auf das eine noch das andere eingestellt ist.
 */
export const RUECKFALL = 'en';

/**
 * Wählt die Sprache aus den Angaben des Browsers.
 *
 * Deutsch führt zu Deutsch, alles andere zu Englisch. Geprüft wird auf das
 * Sprachkürzel vor dem Trennzeichen, damit auch `de-CH` und `de-AT` als
 * Deutsch gelten. Wer in der Schweiz sitzt, bekommt sonst Englisch, ohne dass
 * ihm der Grund ersichtlich wäre.
 *
 * Der Unterstrich wird mitgetrennt, obwohl der Browser ihn nicht liefert. Die
 * Angabe kommt später auch aus einer gesicherten Datei, und die kann ein
 * Anwender von Hand bearbeitet haben; in der Schreibweise des Betriebssystems
 * steht dort `de_DE`.
 */
export function waehleSprache(angaben) {
  const liste = Array.isArray(angaben) ? angaben : angaben ? [angaben] : [];
  for (const angabe of liste) {
    if (typeof angabe !== 'string') continue;
    const kuerzel = angabe.trim().toLowerCase().split(/[-_]/)[0];
    if (kuerzel in SPRACHEN) return kuerzel;
  }
  return RUECKFALL;
}

/**
 * Liefert eine Nachschlagefunktion für die gewählte Sprache.
 *
 * Der Bezeichner ist ein Punktpfad, etwa `kopf.titel`. Fehlt er, kommt der
 * Bezeichner selbst zurück statt einer leeren Stelle: Ein sichtbares
 * `kopf.titel` in der Oberfläche fällt auf, eine leere Zeile nicht. Dass es
 * dazu gar nicht erst kommt, sichert die Prüfstrecke.
 */
export function erzeugeTexte(sprache) {
  const baum = SPRACHEN[sprache] ?? SPRACHEN[RUECKFALL];
  return (bezeichner, werte = null) => {
    let stelle = baum;
    for (const teil of bezeichner.split('.')) {
      if (stelle === null || typeof stelle !== 'object' || !(teil in stelle)) return bezeichner;
      stelle = stelle[teil];
    }
    if (typeof stelle !== 'string') return bezeichner;
    // Platzhalter der Form {name}. Sie stehen im Textbaustein und nicht im
    // Programm, weil die Wortstellung je Sprache verschieden ist: Was im
    // Deutschen vorn steht, steht im Englischen womöglich hinten.
    return werte
      ? stelle.replace(/\{(\w+)\}/g, (ganz, name) => (name in werte ? werte[name] : ganz))
      : stelle;
  };
}

/**
 * Sammelt alle Bezeichner eines Sprachbaums als Punktpfade.
 *
 * Wird von der Prüfstrecke gebraucht, um beide Sprachen zu vergleichen, und
 * gehört deshalb hierher und nicht in die Prüfung: Wer den Aufbau des Baums
 * ändert, ändert die Sammlung an derselben Stelle mit.
 */
export function sammleBezeichner(baum, praefix = '') {
  const bezeichner = [];
  for (const [name, wert] of Object.entries(baum)) {
    const pfad = praefix ? `${praefix}.${name}` : name;
    if (wert !== null && typeof wert === 'object') {
      bezeichner.push(...sammleBezeichner(wert, pfad));
    } else {
      bezeichner.push(pfad);
    }
  }
  return bezeichner;
}
