// Der Zustand einer Eingabe über das flache Netz.
//
// Wer den Zustand seines echten Würfels überträgt, hat ihn während der Eingabe
// gerade nicht vollständig vor sich. **Ein halbfertiger Würfel ist aber kein
// Würfelzustand:** `core/cube.js` führt ihn auf Steinebene und kennt kein «noch
// nicht gesetzt», und `validateFacelets` weist alles ab, was nicht 54 belegte
// Felder trägt. Das ist dort richtig so, denn sein Gegenstand ist die
// Lösbarkeit und nicht der Fortschritt einer Eingabe.
//
// Dieses Modul führt deshalb einen eigenen Gegenstand: 54 Felder, von denen
// jedes unbesetzt sein darf, mit den sechs Mitten als festem Rahmen. Erst wenn
// alle belegt sind, entsteht daraus etwas, das der Kern prüfen kann.
//
// Es ist reine Rechnung und kennt weder Darstellung noch Browser. Der Ort folgt
// Abschnitt 2 der Architektur, die `input` die Verantwortung «Setzen einzelner
// Feldchen» mit F-0006 zuweist.

import { FACES, solvedCube, toFacelets } from '../core/cube.js';

/** Anzahl der Felder überhaupt. */
export const FELDER = 54;

/**
 * Die Feldnummern der sechs Mittelsteine.
 *
 * Die 54 Felder werden nach `core/cube.js` seitenweise gezählt, in der
 * Reihenfolge U R F D L B und je Seite zeilenweise. Feld 4 jeder Seite ist
 * damit ihr Mittelstein. Gerechnet statt abgeschrieben: Eine zweite Tabelle
 * derselben Zuordnung liefe der ersten früher oder später davon.
 */
export const MITTEN = FACES.map((_, seite) => seite * 9 + 4);

/**
 * Erzeugt eine leere Eingabe.
 *
 * Leer heißt: allein die sechs Mitten. Kein Feld trägt eine Farbe, die der
 * Anwender nicht selbst gesetzt hat. Entschieden am 2026-08-18, Begründung in
 * 2A-0012.
 */
export function erzeugeEingabe() {
  const felder = new Array(FELDER).fill(null);

  /**
   * Die zurücknehmbaren Setzungen, jede mit dem Wert **vor** ihr.
   *
   * Der vorige Wert und nicht der neue: Nur so führt zweimaliges Setzen
   * desselben Feldes über zwei Rücknahmen zurück in den Ausgangszustand.
   */
  const stapel = [];

  /** Setzt die sechs Mitten auf ihre Seitenfarbe. */
  function stelleMittenAuf() {
    for (const [seite, feld] of MITTEN.entries()) felder[feld] = FACES[seite];
  }

  const istMitte = (nummer) => MITTEN.includes(nummer);

  const istFeldnummer = (nummer) =>
    Number.isInteger(nummer) && nummer >= 0 && nummer < FELDER && !istMitte(nummer);

  /**
   * Verwirft die Rücknahme.
   *
   * Nach einem Sprung, also nach `leere` oder `belegeGeloest`, führte eine
   * Rücknahme in einen Zustand, den es nie gab. Denselben Weg geht der
   * Zugverlauf beim Setzen, aus demselben Grund. Der Preis ist, dass ein
   * Sprung nicht umkehrbar ist; deshalb kündigt ihn die Bedienung nach AK4 von
   * S-0019 vorher an.
   */
  function vergissRuecknahme() {
    stapel.length = 0;
  }

  stelleMittenAuf();

  return {
    /** Die 54 Felder als Kopie, jedes ein Seitenbuchstabe oder `null`. */
    felder: () => [...felder],

    /** Gehört diese Feldnummer zu einem Mittelstein? */
    istMitte,

    /**
     * Setzt ein Feld auf eine Farbe und meldet, ob sich dadurch etwas geändert
     * hat.
     *
     * **Ein Mittelstein bleibt unberührt.** Wer ihn verstellt, erzeugt einen
     * Zustand, der nie lösbar sein kann, und versteht die Meldung dazu nicht;
     * so begründet es S-0018. Dasselbe gilt für eine Feldnummer oder eine
     * Farbe, die es nicht gibt: Beides ist ein Fehlgriff der Bedienung und
     * keine Ausnahme.
     *
     * **Eine Setzung, die nichts ändert, kommt nicht auf den Stapel.** Sonst
     * zählte ein Doppelklick als zwei Schritte, und die erste Rücknahme sähe
     * danach wie ein Fehlschlag aus.
     */
    setze(nummer, farbe) {
      if (!istFeldnummer(nummer) || !FACES.includes(farbe)) return false;
      if (felder[nummer] === farbe) return false;
      stapel.push({ nummer, vorher: felder[nummer] });
      felder[nummer] = farbe;
      return true;
    },

    /** Macht die letzte Setzung rückgängig und meldet, ob es eine gab. */
    nimmZurueck() {
      const letzte = stapel.pop();
      if (letzte === undefined) return false;
      felder[letzte.nummer] = letzte.vorher;
      return true;
    },

    /** Gibt es eine Setzung, die sich zurücknehmen lässt? */
    kannZurueck: () => stapel.length > 0,

    /** Leert alle Felder außer den Mitten. */
    leere() {
      felder.fill(null);
      stelleMittenAuf();
      vergissRuecknahme();
    },

    /**
     * Belegt jede Seite in ihrer eigenen Farbe.
     *
     * Der gelöste Würfel ist der schnellere Ausgangspunkt für einen nur leicht
     * verdrehten Würfel, bei dem wenige Felder abweichen. Er kommt aus dem
     * Kern und nicht aus einer hier aufgeschriebenen Tabelle.
     */
    belegeGeloest() {
      const geloest = toFacelets(solvedCube());
      for (let nummer = 0; nummer < FELDER; nummer++) felder[nummer] = geloest[nummer];
      vergissRuecknahme();
    },

    /**
     * Je Farbe die Anzahl der Felder, die sie tragen.
     *
     * **Gezählt werden die gesetzten Felder einschließlich der Mitten**, nicht
     * die verbleibenden. Damit steht die Zahl im selben Maß wie die Soll-Zahl
     * neun aus der ersten Bedingung der Lösbarkeitsprüfung, und der Anwender
     * vergleicht zwei Zahlen, statt zu rechnen.
     */
    zaehlung() {
      const anzahl = {};
      for (const seite of FACES) anzahl[seite] = 0;
      for (const farbe of felder) if (farbe !== null) anzahl[farbe]++;
      return anzahl;
    },

    /** Tragen alle 54 Felder eine Farbe? */
    istVollstaendig: () => felder.every((farbe) => farbe !== null),
  };
}
