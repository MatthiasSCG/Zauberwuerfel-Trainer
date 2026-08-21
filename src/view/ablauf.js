// Warteschlange für Bewegungen.
//
// Wer zügig tippt oder eine Lernlösung mit hundertfünfzig Zügen abspielt,
// löst Züge schneller aus, als eine Bewegung dauert. Ohne Warteschlange
// überschreiben sie sich gegenseitig: Die Darstellung springt, und am Ende
// zeigt sie einen Zustand, den es nie gab.
//
// **Das ist eine reine Zustandsmaschine.** Sie weiß nicht, was sie ausführt,
// und bekommt die Ausführung hereingereicht. Damit sind alle Grenzfälle ohne
// Browser prüfbar, auch der, den man von Hand kaum herstellt: das Abschalten
// mitten in der Bewegung.

/**
 * Erzeugt eine Warteschlange.
 *
 * `fuehreAus(eintrag)` liefert ein Versprechen, das sich erfüllt, wenn die
 * Bewegung fertig ist. Fehler daraus beenden die Schlange nicht, sondern
 * überspringen den Eintrag: Eine Darstellung, die nach einem Fehlschlag gar
 * nichts mehr zeigt, ist schlechter als eine, die weiterläuft.
 */
export function erzeugeAblauf(fuehreAus) {
  const wartend = [];
  let laeuft = false;
  const fertigmeldungen = [];
  // Laufende Nummer des Eintrags und die Nummer, bis zu der verworfen wurde.
  // Damit kann ein Eintrag, der schon in Arbeit ist, erkennen, dass sein
  // Ergebnis nicht mehr gilt.
  let nummer = 0;
  let verworfenBis = 0;

  const melde = () => {
    if (laeuft || wartend.length > 0) return;
    while (fertigmeldungen.length > 0) fertigmeldungen.shift()();
  };

  const arbeite = async () => {
    if (laeuft) return;
    laeuft = true;
    while (wartend.length > 0) {
      const eintrag = wartend.shift();
      const meine = ++nummer;
      try {
        // Die Ausführung bekommt einen Weg, ihre eigene Gültigkeit zu
        // erfragen. Ohne ihn schreibt eine Bewegung, die während eines
        // Zurücksetzens zu Ende läuft, ihren überholten Zustand darüber.
        await fuehreAus(eintrag, () => verworfenBis >= meine);
      } catch {
        // Übersprungen, siehe oben.
      }
    }
    laeuft = false;
    melde();
  };

  return {
    /** Reiht einen Eintrag ein und stößt die Abarbeitung an. */
    reiheEin(eintrag) {
      wartend.push(eintrag);
      arbeite();
    },

    /** Wieviele Einträge warten noch? Der laufende zählt nicht mit. */
    laenge: () => wartend.length,

    /** Läuft gerade eine Bewegung? */
    laeuft: () => laeuft,

    /**
     * Verwirft alles, was noch wartet, und entwertet den laufenden Eintrag.
     *
     * Der laufende wird zu Ende geführt, damit die Darstellung nicht in einer
     * halben Drehung stehen bleibt. Sein **Ergebnis** gilt aber nicht mehr:
     * Wer die Schlange leert, hat einen neuen Zustand gesetzt, und eine
     * Bewegung, die danach zu Ende läuft, gehörte zu einem Würfel, den es
     * nicht mehr gibt.
     */
    leere() {
      wartend.length = 0;
      verworfenBis = nummer;
    },

    /** Ein Versprechen, das sich erfüllt, wenn nichts mehr aussteht. */
    ruhe() {
      if (!laeuft && wartend.length === 0) return Promise.resolve();
      return new Promise((fertig) => fertigmeldungen.push(fertig));
    },
  };
}
