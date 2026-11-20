// Wiedergabe einer Zugfolge.
//
// Eine Zugfolge als Textzeile ist für einen Einsteiger nahezu wertlos: Er
// verliert die Stelle, verdreht die Richtung und weiß nicht, welche Fläche
// gemeint ist. Bei einer Lernlösung von gemessen 108 Zügen im Median
// entscheidet das darüber, ob die Lösung benutzbar ist.
//
// **Dieses Modul kennt den Löser nicht.** Es bekommt Ausgangszustand, Zugfolge
// und ihre Gliederung übergeben und weiß nicht, woher sie stammen. So sieht es
// der Modulschnitt der Architektur vor, und damit lassen sich Lernlösung,
// Kurzlösung und eine vorgeführte Lektion mit demselben Baustein zeigen.
//
// **Es ist eine reine Zustandsmaschine.** Darstellung und Uhr werden
// hereingereicht, wie bei der Warteschlange in `ablauf.js`. Damit sind alle
// Grenzfälle ohne Browser prüfbar, auch der, um den es hier vor allem geht:
// das Anhalten mitten in einer laufenden Bewegung.

import { mergeSameFace, solvedCube } from '../core/cube.js';
import {
  SOLVED_ORIENTATION,
  applyExtendedMoves,
  inverseExtendedMove,
  isFaceMove,
  toOrientedFacelets,
} from '../core/moves.js';

/** Eine eigene Kopie eines Zustands. */
const kopie = (zustand) => ({
  cp: [...zustand.cp],
  co: [...zustand.co],
  ep: [...zustand.ep],
  eo: [...zustand.eo],
});

/**
 * Erzeugt eine Wiedergabe.
 *
 * `darstellung` trägt die vier Methoden, die `erzeugeWuerfel` anbietet:
 * `spieleZug(zug, facelets)`, `zeige(facelets)`, `haltAn()` und `ruhe()`.
 * `warte(ms)` ist die Uhr des fortlaufenden Abspielens; sie wird
 * hereingereicht, weil dieses Modul keinen globalen Namen verwendet.
 * `pause()` liefert die Verweildauer je Zug in Millisekunden. Sie stammt aus
 * der Einstellung, und die kennt allein die Verdrahtung.
 */
export function erzeugeWiedergabe({ darstellung, warte, pause = () => 0 }) {
  let ausgang = solvedCube();
  let zuege = [];
  let schritte = [];
  let stelle = 0;
  let spielt = false;
  // Kennung des laufenden Abspielens. Ohne sie liefen nach einem raschen
  // Anhalten und Wiederanlaufen zwei Schleifen nebeneinander und spielten
  // jeden Zug doppelt.
  let lauf = 0;
  const zuhoerer = [];

  const melde = () => {
    for (const rueckruf of zuhoerer) rueckruf();
  };

  /**
   * Zustand **und** Orientierung an einer Stelle, gerechnet statt
   * fortgeschrieben.
   *
   * **Die Orientierung gehört seit 4T-0100 dazu.** Von den vierundfünfzig
   * Zügen verschieben sechsunddreißig sie, und zwar nicht nur die neun
   * Ganzdrehungen: Mittelschicht und Doppelschicht enthalten die mittlere
   * Schicht und werden deshalb über den ganzen Würfel gerechnet. Ohne sie
   * zeigte die Darstellung nach jedem solchen Zug einen Würfel, den es nicht
   * gibt.
   *
   * **Der Ausgang steht immer unverdreht.** Die Zugfolge setzt auf dem
   * Übungswürfel auf, und der führt nach der Entscheidung des Product Owners
   * vom 2026-08-24 keine Orientierung. Ein Parameter dafür wäre ein Vorrat
   * ohne Aufrufer.
   *
   * **Weiterhin gerechnet und nicht fortgeschrieben.** Damit trifft ein Sprung
   * dieselbe Rechnung wie ein Vorwärtsgehen, und die beiden können nicht
   * auseinander laufen.
   */
  const standAn = (n) => applyExtendedMoves(ausgang, zuege.slice(0, n), SOLVED_ORIENTATION);

  /** Der Zustand an einer Stelle, ohne die Orientierung. */
  const zustandAn = (n) => kopie(standAn(n).cube);

  /**
   * Die 54 Felder an einer Stelle, wie der Anwender sie sieht.
   *
   * Das ist es, was die Darstellung bekommt: der fertige Anblick und nicht der
   * Modellzustand. Bei unverdrehter Orientierung kommt genau `toFacelets`
   * heraus, die Wiedergabe einer Lösung des Lösers sieht davon also nichts.
   */
  const feldernAn = (n) => {
    const stand = standAn(n);
    return toOrientedFacelets(stand.cube, stand.orientation);
  };

  /**
   * Beendet ein laufendes Abspielen.
   *
   * **Die Warteschlange wird dabei nicht geleert.** Das ist die tragende
   * Festlegung dieses Moduls: `ablauf.leere()` führt den laufenden Eintrag
   * zwar zu Ende, unterdrückt aber seine Anzeige. Die Darstellung bliebe
   * damit einen Zug hinter der Stelle zurück, und der Anwender sähe einen
   * anderen Würfel, als der Zähler behauptet. Angehalten wird deshalb, indem
   * nichts Neues mehr eingereiht wird; die laufende Bewegung läuft zu Ende
   * und zeigt ihr Ergebnis.
   */
  function halteAn() {
    if (!spielt) return;
    spielt = false;
    lauf++;
    melde();
  }

  /**
   * Setzt die Stelle und baut den Zustand vom Ausgang neu auf.
   *
   * Hier ist `darstellung.haltAn()` richtig: Wer springt, setzt einen neuen
   * Zustand, und eine Bewegung, die danach zu Ende liefe, gehörte zu einem
   * Würfel, den es nicht mehr gibt.
   *
   * Ein Sprung hält das Abspielen an. Wer springt, will sehen, wo er ist; ein
   * Abspielen, das sofort weiterläuft, nimmt ihm die Gelegenheit dazu.
   */
  function springeZu(ziel) {
    halteAn();
    const neu = Math.min(Math.max(Math.trunc(ziel) || 0, 0), zuege.length);
    stelle = neu;
    darstellung.haltAn();
    darstellung.zeige(feldernAn(stelle));
    melde();
    return stelle;
  }

  /**
   * Der Schritt, in dem eine Stelle liegt, oder `null`.
   *
   * `null` steht für zweierlei: eine Zugfolge ohne Gliederung und das Ende der
   * Folge, wo kein Zug mehr aussteht und damit auch kein Schritt mehr läuft.
   *
   * **Leere Schritte fallen von selbst heraus.** Ihr Bereich enthält keine
   * Stelle, weil `count` null ist; die Bedingung trifft dann auf den folgenden
   * Schritt zu. Ein bereits gelöster Würfel besteht ausschließlich aus solchen
   * Schritten, und gemessen gibt es sie in 58 von 1400 Fällen auch sonst.
   */
  function schrittAn(n) {
    const index = schritte.findIndex(
      (schritt) => n >= schritt.from && n < schritt.from + schritt.count,
    );
    if (index < 0) return null;
    const schritt = schritte[index];
    return {
      index,
      von: schritte.length,
      nummer: schritt.number,
      kennung: schritt.key,
      lektion: schritt.lesson,
      // Fortschritt innerhalb des Schrittes, für die Anzeige.
      getan: n - schritt.from,
      anzahl: schritt.count,
    };
  }

  /** Die Stellen, an denen ein Schritt beginnt, ohne Wiederholung. */
  function schrittgrenzen() {
    const grenzen = new Set();
    for (const schritt of schritte) grenzen.add(schritt.from);
    return [...grenzen].sort((a, b) => a - b);
  }

  // ------------------------------------------------- Griffe, aus 4T-0040
  //
  // Zwei oder drei Züge derselben Seite sind für die Hand des Anwenders ein
  // einziger Griff. Gemessen über 3000 Verwürfelungen betrifft das 9,4 Prozent
  // aller Züge einer Lernlösung und spart ihm 6,9 Handgriffe je Lösung, also
  // 100,3 Handgriffe statt 107,1 Zügen.
  //
  // Die Zahlen sind am 2026-08-14 mit 4T-0039 nachgezogen worden. Sie waren
  // 8,0 Handgriffe bei 150,9 Zügen; an der kürzeren Lernlösung gibt es weniger
  // Ketten zu verbinden. Der Anteil an den Zügen ist dabei gestiegen.
  //
  // **Ein Griff verlässt nie den laufenden Schritt.** Sonst spannte er über ein
  // Zwischenziel hinweg, das der frühere Schritt gerade erst hergestellt hat;
  // in 4T-0038 ist gemessen, dass genau das in 1678 von 3000 Lösungen bricht.
  // Zugleich bleibt damit jede Schrittgrenze auch eine Griffgrenze, und die
  // Sprünge aus 4T-0033 treffen nie mitten in einen Griff.
  //
  // **Gerechnet statt vorgehalten.** Beide Funktionen rechnen bei jedem Aufruf.
  // Damit ist auch ein Sprung mitten in eine Kette verträglich: Von dort aus
  // ist der Rest der Kette der Griff, und das ist die richtige Auskunft. Eine
  // vorgehaltene Zerlegung müsste bei jedem Sprung nachgeführt werden.

  /** Der Bereich des Schrittes an einer Stelle. Ohne Gliederung die ganze Folge. */
  function bereichAn(n) {
    if (schritte.length === 0) return { von: 0, bis: zuege.length };
    const schritt = schritte.find((s) => n >= s.from && n < s.from + s.count);
    return schritt
      ? { von: schritt.from, bis: schritt.from + schritt.count }
      : { von: n, bis: n + 1 };
  }

  /**
   * Sind zwei Züge für die Hand einer?
   *
   * **Nur Grunddrehungen derselben Seite, seit 4T-0100.** Für die
   * sechsunddreißig erweiterten Züge kennt der Kern keine Zusammenfassung, und
   * sie hier nachzubauen wäre eine zweite Wahrheit über dieselbe Frage. Ein
   * erweiterter Zug ist deshalb immer ein Griff für sich, und `mergeSameFace`
   * bekommt nie einen Zug, den es abweisen müsste.
   *
   * Beide Bedingungen stehen an dieser einen Stelle, damit die Vorwärts- und
   * die Rückwärtsrichtung nicht zwei Fassungen davon führen.
   */
  const einGriff = (a, b) =>
    isFaceMove(a) && isFaceMove(b) && Math.floor(a / 3) === Math.floor(b / 3);

  /**
   * Der Griff, der an einer Stelle beginnt, oder `null` am Ende der Folge.
   *
   * `zug` ist der eine Zug, der alle Züge des Griffs ersetzt, oder `null`,
   * wenn sie sich ganz aufheben. Der zweite Fall ist häufig: 5 004 von 17 173
   * mehrzügigen Griffen, und er kommt in 2 558 von 3000 Lösungen vor.
   */
  function griffAb(n) {
    if (n < 0 || n >= zuege.length) return null;
    if (!isFaceMove(zuege[n])) return { von: n, anzahl: 1, zug: zuege[n] };
    const grenze = bereichAn(n).bis;
    let ende = n + 1;
    while (ende < grenze && einGriff(zuege[n], zuege[ende])) ende++;
    return { von: n, anzahl: ende - n, zug: mergeSameFace(zuege.slice(n, ende)) };
  }

  /** Der Griff, der an einer Stelle endet, oder `null` am Anfang der Folge. */
  function griffBis(n) {
    if (n <= 0 || n > zuege.length) return null;
    const letzter = zuege[n - 1];
    if (!isFaceMove(letzter)) return { von: n - 1, anzahl: 1, zug: letzter };
    const grenze = bereichAn(n - 1).von;
    let anfang = n - 1;
    while (anfang > grenze && einGriff(letzter, zuege[anfang - 1])) anfang--;
    return { von: anfang, anzahl: n - anfang, zug: mergeSameFace(zuege.slice(anfang, n)) };
  }

  /**
   * Ein Griff vorwärts, als eine Bewegung.
   *
   * Der Zustand **nach** dem Griff wird mitgegeben; die Darstellung rechnet
   * nichts nach, sie zeigt.
   *
   * **Ein Griff, der sich aufhebt, meldet der Darstellung nichts.** Der Zustand
   * ist derselbe wie vorher, es gibt also nichts zu zeigen. Ihn trotzdem über
   * `zeige` zu setzen wäre der Fehler aus 4T-0033 in neuer Gestalt: Läuft noch
   * eine Bewegung, überholte die Anzeige sie und zeigte deren Ergebnis, bevor
   * die Drehung dort angekommen ist.
   *
   * Steht hier oben und nicht erst in der Rückgabe, weil das fortlaufende
   * Abspielen sie braucht. Über `this` erreichbar wäre sie nur so lange, wie
   * niemand die Rückgabe zerlegt.
   */
  function vor() {
    const griff = griffAb(stelle);
    if (!griff) return false;
    stelle += griff.anzahl;
    if (griff.zug !== null) {
      darstellung.spieleZug(griff.zug, feldernAn(stelle));
    }
    melde();
    return true;
  }

  return {
    /**
     * Übernimmt eine Zugfolge.
     *
     * `schritte` ist wahlfrei: Die Kurzlösung liefert keine Gliederung, und
     * die Wiedergabe muss beides bedienen. Ohne Gliederung gibt es keine
     * Schrittsprünge, alles andere bleibt gleich.
     */
    lade({ ausgang: neuerAusgang, zuege: neueZuege = [], schritte: neueSchritte = [] } = {}) {
      halteAn();
      lauf++;
      ausgang = kopie(neuerAusgang ?? solvedCube());
      zuege = [...neueZuege];
      schritte = [...neueSchritte];
      stelle = 0;
      darstellung.haltAn();
      darstellung.zeige(feldernAn(0));
      melde();
    },

    /** Der Zustand, auf dem die Zugfolge aufsetzt. */
    ausgangszustand: () => kopie(ausgang),

    /**
     * Der Zustand an der aktuellen Stelle. Als Kopie.
     *
     * **Das ist der Modellzustand und nicht der Anblick.** Beide fallen
     * zusammen, solange die Folge aus Grunddrehungen besteht; eine Folge mit
     * erweiterten Zügen steht an der Stelle womöglich verdreht, und dieser
     * Zustand weiß davon nichts.
     *
     * Der einzige Aufrufer ist das Beenden einer **Lösung**, die der
     * Übungswürfel übernimmt, und eine Lösung des Lösers besteht aus
     * Grunddrehungen. Die Prüfstrecke hält genau das fest, damit die Zusage
     * nicht bei der nächsten Erweiterung stillschweigend fällt.
     */
    zustand: () => zustandAn(stelle),

    /**
     * Die Orientierung an der aktuellen Stelle, für die Prüfung.
     *
     * Sie steht hier, weil die Zusage über `zustand` sonst nicht prüfbar wäre:
     * Ob eine Folge verdreht endet, sieht man dem Zustand nicht an.
     */
    orientierung: () => [...standAn(stelle).orientation],

    /** Die Zugfolge. Als Kopie, damit sie von außen fest bleibt. */
    zuege: () => [...zuege],

    /** Die Gliederung, oder eine leere Liste. */
    schritte: () => schritte.map((schritt) => ({ ...schritt })),

    stelle: () => stelle,
    anzahl: () => zuege.length,
    spielt: () => spielt,
    hatGliederung: () => schritte.length > 0,
    kannVor: () => stelle < zuege.length,
    kannZurueck: () => stelle > 0,

    /** Der Griff, der als nächstes ansteht, oder `null` am Ende. */
    naechsterGriff: () => griffAb(stelle),

    griffAb,
    griffBis,

    schrittAn,

    /** Der Schritt, in dem die aktuelle Stelle liegt, oder `null`. */
    aktuellerSchritt: () => schrittAn(stelle),

    vor,

    /**
     * Ein Griff zurück, als Rückdrehung.
     *
     * Gezeigt wird der Gegenzug des zuletzt ausgeführten Griffs, nicht ein
     * Sprung. Das Rückwärtsgehen ist so wichtig wie das Vorwärtsgehen, und wer
     * sich vertan hat, muss sehen, was rückgängig gemacht wird.
     */
    zurueck() {
      const griff = griffBis(stelle);
      if (!griff) return false;
      stelle = griff.von;
      if (griff.zug !== null) {
        // `inverseExtendedMove` und nicht `inverseMove`: Beide liefern für
        // alle vierundfünfzig Züge dasselbe, gemessen am 2026-08-24, weil jede
        // Blockbasis durch drei teilbar ist. Verschieden ist die **Zusage**,
        // und allein die trägt hier: `inverseMove` sagt nichts über einen Zug
        // ab achtzehn zu.
        darstellung.spieleZug(inverseExtendedMove(griff.zug), feldernAn(stelle));
      }
      melde();
      return true;
    },

    springeZu,
    zumAnfang: () => springeZu(0),
    zumEnde: () => springeZu(zuege.length),

    /** Springt an den Beginn des Schrittes mit diesem Index. */
    zumSchritt(index) {
      const schritt = schritte[index];
      if (!schritt) return stelle;
      return springeZu(schritt.from);
    },

    /**
     * An den Beginn des laufenden Schrittes, von dort an den des vorigen.
     *
     * Dieselbe Bedeutung wie bei jeder Wiedergabe: Der erste Druck geht an den
     * Anfang dessen, worin man steckt. Leere Schritte fallen dabei von selbst
     * heraus, weil sie mit ihrem Nachfolger dieselbe Stelle teilen.
     */
    vorigerSchritt() {
      const ziele = schrittgrenzen().filter((grenze) => grenze < stelle);
      return springeZu(ziele.length > 0 ? ziele.at(-1) : 0);
    },

    /** An den Beginn des nächsten Schrittes, sonst ans Ende. */
    naechsterSchritt() {
      const ziel = schrittgrenzen().find((grenze) => grenze > stelle);
      return springeZu(ziel ?? zuege.length);
    },

    /**
     * Spielt fortlaufend ab, bis zum Ende oder bis zum Anhalten.
     *
     * **Der Takt kommt von der Bewegung, nicht von einer zweiten Uhr.** Erst
     * wenn die Darstellung ruht, folgt der nächste Zug. Eine Uhr, die daneben
     * liefe, überholte bei langsamer Stufe die eigene Darstellung, und die
     * Warteschlange füllte sich, bis das Anhalten wirkungslos wäre.
     *
     * Bei abgeschalteter Bewegung ruht die Darstellung sofort. Dann trägt
     * `pause()` den Takt: «Aus» bedeutet keine Bewegung, nicht keine Zeit.
     */
    async spieleAb() {
      if (spielt || stelle >= zuege.length) return;
      spielt = true;
      const meiner = ++lauf;
      melde();
      while (spielt && lauf === meiner && stelle < zuege.length) {
        vor();
        await darstellung.ruhe();
        if (!spielt || lauf !== meiner) break;
        const dauer = pause();
        if (dauer > 0) await warte(dauer);
      }
      if (lauf === meiner && spielt) {
        spielt = false;
        melde();
      }
    },

    halteAn,

    /** Meldet jede Änderung von Stelle oder Abspielzustand. */
    aufAenderung(rueckruf) {
      zuhoerer.push(rueckruf);
    },
  };
}
