// Der Zugverlauf des Übungswürfels.
//
// Wer eine Zugfolge übt und sich vertippt, steht sonst vor einem verwürfelten
// Würfel und muss von vorn anfangen. Das ist der schnellste Weg, einen
// Einsteiger zu entmutigen. Am echten Würfel gibt es diese Möglichkeit nicht,
// und sie ist einer der Gründe, warum die Übung am Bildschirm ihren eigenen
// Wert hat.
//
// **Der Übungswürfel hält einen eigenen Zustand**, getrennt von jedem anderen.
// Er lässt sich aus einem erfassten setzen, überschreibt ihn aber nie;
// andernfalls verlöre der Anwender seine Eingabe, sobald er einen Zug übt.
// Bindend aus der Architektur, Abschnitt 3.
//
// Dieses Modul ist reine Rechnung. Es kennt weder Darstellung noch Browser.
//
// **Der Übungswürfel führt die achtzehn Grunddrehungen und nicht die
// vierundfünfzig.** Entschieden am 2026-08-24 in 4T-0100, und der Grund steht
// hier und nicht allein im Task.
//
// Zweierlei hängt zusammen. Erstens verschieben sechsunddreißig der
// vierundfünfzig Züge die Würfelorientierung, und zwar nicht nur die neun
// Ganzdrehungen: Mittelschicht und Doppelschicht enthalten die mittlere
// Schicht und werden deshalb über den ganzen Würfel gerechnet. Sobald der
// Übungswürfel einen davon ausführt, ist der Modellbezug nicht mehr der Bezug
// des Anwenders, und jede Auskunft, die auf diesem Zustand beruht, nennt
// Buchstaben, die er auf dem Bildschirm nicht wiederfindet: die Lernlösung,
// die Kurzlösung und die Hilfe des Lernpfads. Das wäre keine Unschönheit,
// sondern eine falsche Anleitung.
//
// Zweitens hat der Übungswürfel für diese Züge keine Quelle. Die Tastatur
// erreicht achtzehn der vierundfünfzig; die achtzehn Doppelschichten sind
// nicht nachrüstbar, ohne die Bedienung neu zu regeln, denn sie unterscheiden
// sich von den Flächendrehungen allein durch Kleinschreibung, und die
// Umschalttaste ist bereits die Gegenrichtung.
//
// **Entweder beides oder keines von beiden.** Eine mitgeführte Orientierung
// ohne erweiterte Bedienung wäre toter Code, eine erweiterte Bedienung ohne
// umbenannte Auskünfte eine falsche Anleitung. Der Bedarf entsteht sichtbar
// mit dem Training von Erkennung und Ausführung in 2A-0019; dort gehört die
// Entscheidung neu gestellt, und zwar mit beiden Hälften zusammen.
//
// **Die Wiedergabe trägt die neuen Züge dagegen seit 4T-0100.** Sie zeigt eine
// Folge, ohne den Übungswürfel anzufassen, und läuft deshalb nicht in dieses
// Problem hinein.

import { applyMove, inverseMove, solvedCube, toFacelets } from '../core/cube.js';
import { validateFacelets } from '../core/validate.js';

/** Eine eigene Kopie eines Zustands. */
const kopie = (zustand) => ({
  cp: [...zustand.cp],
  co: [...zustand.co],
  ep: [...zustand.ep],
  eo: [...zustand.eo],
});

/**
 * Erzeugt einen Verlauf über einem Ausgangszustand.
 *
 * Geführt werden die Züge seit dem letzten Setzen und eine Stelle darin. Der
 * Zustand wird bei jedem Schritt neu gerechnet und nicht mitgeschleppt: Der
 * Kern ist die einzige Stelle, die weiß, was ein Zug bewirkt.
 */
export function erzeugeVerlauf(ausgang = solvedCube()) {
  let anfang = kopie(ausgang);
  let zustand = kopie(ausgang);
  let zuege = [];
  let stelle = 0;

  /**
   * Setzt den Würfel auf einen Zustand, gegeben als die 54 Seitenbuchstaben.
   *
   * Steht als Funktion vor dem Rückgabewert und nicht als Methode darin, weil
   * `setze` sie aufruft. Über `this` liefe das so lange gut, bis jemand die
   * Methode einzeln aus dem Objekt nimmt.
   */
  function setzeAusFeldern(facelets) {
    const befund = validateFacelets(facelets);
    if (!befund.ok) return befund;
    anfang = kopie(befund.cube);
    zustand = kopie(befund.cube);
    zuege = [];
    stelle = 0;
    return befund;
  }

  return {
    /** Der aktuelle Zustand. Als Kopie, damit ihn niemand von außen verdreht. */
    zustand: () => kopie(zustand),

    /** Die Züge bis zur aktuellen Stelle. */
    zuege: () => zuege.slice(0, stelle),

    /** Wieviele Züge lassen sich zurücknehmen? */
    stelle: () => stelle,

    /** Wieviele Züge stehen zur Wiederherstellung bereit? */
    wartend: () => zuege.length - stelle,

    kannZurueck: () => stelle > 0,
    kannWieder: () => stelle < zuege.length,

    /**
     * Führt einen Zug aus.
     *
     * Ein neuer Zug nach einer Rücknahme verwirft die noch nicht
     * wiederhergestellten Züge. Das ist das erwartete Verhalten und zugleich
     * die Stelle, an der eine schlampige Umsetzung einen widersprüchlichen
     * Verlauf hinterlässt: einen Zustand, der zu keiner Folge im Verlauf passt.
     */
    fuehreAus(zug) {
      zuege = zuege.slice(0, stelle);
      zuege.push(zug);
      stelle = zuege.length;
      zustand = applyMove(zustand, zug);
      return zug;
    },

    /** Nimmt den letzten Zug zurück und liefert den Gegenzug, oder `null`. */
    nimmZurueck() {
      if (stelle === 0) return null;
      stelle -= 1;
      const gegenzug = inverseMove(zuege[stelle]);
      zustand = applyMove(zustand, gegenzug);
      return gegenzug;
    },

    /** Stellt den nächsten Zug wieder her und liefert ihn, oder `null`. */
    stelleWieder() {
      if (stelle >= zuege.length) return null;
      const zug = zuege[stelle];
      stelle += 1;
      zustand = applyMove(zustand, zug);
      return zug;
    },

    /**
     * Setzt den Würfel auf einen Zustand.
     *
     * Der übergebene Zustand wird kopiert und nicht übernommen. Damit kann ein
     * Zug am Übungswürfel die Quelle nicht verändern, aus der er gesetzt
     * wurde, etwa den aus Fotos erfassten Zustand.
     *
     * Nach jedem Setzen ist der Verlauf leer. Ihn zu behalten hieße, ein
     * Zurücknehmen anzubieten, das in einen Zustand führt, den es nie gab.
     *
     * **Jeder Zustand passiert vorher die Prüfung der Lösbarkeit**, so wie es
     * der Datenfluss der Architektur vorsieht: Kein Zustand wird gezeigt, der
     * sie nicht bestanden hat. Für den gelösten Würfel und eine erzeugte
     * Verwürfelung ist das eine Formsache; für den aus Fotos erfassten
     * Zustand ist es die Stelle, an der ein Erkennungsfehler auffällt, statt
     * später den Löser in seine Schranken laufen zu lassen.
     *
     * Ein Verstoß ist ein Befund und keine Ausnahme, wie im Kern auch.
     *
     * **Seit 4T-0070 auf `setzeAusFeldern` zurückgeführt.** Beide Wege prüfen
     * dieselbe Sache, und zwei Aufrufe von `validateFacelets` in einer Datei
     * sind zwei Stellen, an denen die Bedingung stehen kann.
     */
    setze: (neu) => setzeAusFeldern(toFacelets(neu)),

    /**
     * Setzt den Würfel auf einen Zustand, gegeben als die 54 Seitenbuchstaben.
     *
     * **Der Eingang für eine Eingabe von Hand**, aus 4T-0070. Sie kann nicht
     * über `setze` kommen: Dort steht ein Zustand auf Steinebene, und aus 54
     * Feldchen, die die Prüfung nicht bestehen, lässt sich gar keiner bauen.
     * `fromFacelets` liefert bei jeder Verletzung `null`, und der Befund wäre
     * verloren, bevor ihn jemand lesen könnte.
     *
     * **Der übernommene Zustand kommt aus der Prüfung selbst.**
     * `validateFacelets` rechnet ihn ohnehin aus, um die Erhaltungssätze zu
     * prüfen, und gibt ihn bei Erfolg als `cube` zurück. Ihn hier ein zweites
     * Mal zu bauen wäre dieselbe Rechnung mit der Möglichkeit, davonzulaufen.
     *
     * Damit läuft die Prüfung an genau einer Stelle, und `setze` ist auf
     * diesen Eingang zurückgeführt.
     */
    setzeAusFeldern,

    /** Der Zustand, auf dem der Verlauf aufsetzt. */
    ausgangszustand: () => kopie(anfang),
  };
}
