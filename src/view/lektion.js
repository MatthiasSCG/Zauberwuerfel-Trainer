// Der Lektionsbereich der Oberfläche.
//
// Er tritt an die Stelle des Platzhalters im Bereich «Erklärung» und führt
// fünf Dinge: die Zählung im Pfad, die Übersicht über alle zehn Lektionen, den
// Text der laufenden, die Vorführung ihrer Züge und Zugfolgen und die Übung mit
// ihrer Rückmeldung.
//
// ## Was dieses Modul nicht kennt
//
// **Weder `lessons` noch `solver` noch `settings`.** Nach Grundsatz 3 der
// Architektur hängt kein Modul der Oberfläche von einem anderen ab; verdrahtet
// wird in `app`. Der Bereich bekommt deshalb den Stand des Pfades
// hereingereicht, so wie die Wiedergabe ihre Zugfolge bekommt und nicht weiß,
// woher sie stammt. Ohne diese Trennung führte der Lektionsbereich seinen
// eigenen Begriff von «freigegeben», und der wäre die wahrscheinlichste Stelle,
// an der er von dem des Pfades abweicht, ohne sich zu melden.
//
// **Er führt die Vorführung nicht selbst aus.** Er meldet den Wunsch an, und
// `app` lädt die Zugfolge in die vorhandene Wiedergabe. Ein zweiter Abspielweg
// wäre ein zweiter Ort für dieselbe Sache.
//
// ## Warum die Rechnung von der Darstellung getrennt ist
//
// `bereichsstand` ist eine reine Funktion und wird vollständig durchgerechnet,
// `erzeugeLektionsbereich` baut daraus Knoten. Die Trennung ist kein Selbstzweck:
// Die Frage, welche Lektion als gesperrt zu zeigen ist und welcher Nachbar sich
// anwählen lässt, ist genau die Art Rechnung, deren Fehler am Bild nicht
// auffällt, weil ein zu viel freigegebener Knopf aussieht wie ein richtiger.

/**
 * Die vier Zustände, in denen eine Lektion in der Übersicht steht.
 *
 * «Übersprungen» ist bewusst ein eigener Zustand und nicht eine Spielart von
 * «abgeschlossen»: Eine übersprungene Lektion gibt die folgende frei, ohne dass
 * je etwas geprüft worden wäre. Wer beides gleich darstellte, behauptete dem
 * Anwender gegenüber einen Fortschritt, den er nicht gemacht hat.
 */
export const ZUSTAND = {
  ABGESCHLOSSEN: 'abgeschlossen',
  UEBERSPRUNGEN: 'uebersprungen',
  OFFEN: 'offen',
  GESPERRT: 'gesperrt',
};

/**
 * Wie eine Lektion vorankommt.
 *
 * `pruefbar` sind die neun Lektionen mit Würfelaufgabe, `meldbar` ist allein
 * Lektion 0. Die Unterscheidung stammt aus dem Pfad und wird hier nur
 * übersetzt: Was das Programm nicht prüfen kann, braucht ein Bedienelement,
 * sonst endet der Pfad bei Lektion 0.
 */
export const UEBUNGSART = { PRUEFBAR: 'pruefbar', MELDBAR: 'meldbar' };

/**
 * Woraus der Text einer Lektion besteht, in der Reihenfolge der Anzeige.
 *
 * Festgelegt am 2026-08-16 zu 4T-0046 und bindend für alle zehn Lektionen. Die
 * vier Namen bilden ab, was das Didaktik-Konzept unterscheidet: Abschnitt 5
 * führt zu jeder Lektion eine begleitende Vorstellung, und sie ist etwas
 * anderes als die Erklärung davor und die Anweisung danach.
 *
 * **Die Liste steht hier und nicht in `i18n`.** Wer sie ändert, ändert die
 * Anzeige, und die Sprachdateien folgen ihr. Die Prüfstrecke stellt beide
 * Seiten gegeneinander und liest die Liste von hier.
 *
 * Mehrere Absätze stehen in einem Baustein, getrennt durch eine Leerzeile.
 * Jeden Absatz einzeln zu benennen gäbe je Lektion eine andere Bausteinmenge,
 * und dieser Bereich müsste wissen, welche.
 */
export const TEXTBAUSTEINE = ['einstieg', 'erklaerung', 'vorstellung', 'aufgabe'];

/** Ein Baustein, in seine Absätze zerlegt. Leere Zeilen fallen weg. */
export function absaetze(inhalt) {
  return inhalt
    .split(/\n\s*\n/)
    .map((absatz) => absatz.trim())
    .filter((absatz) => absatz.length > 0);
}

/**
 * Der Zustand einer Lektion in der Übersicht.
 *
 * **Abgeschlossen schlägt übersprungen.** Der Fall kann nicht auftreten, weil
 * `progress.js` den Widerspruch schon beim Lesen zugunsten der abgeschlossenen
 * Menge auflöst. Die Reihenfolge steht trotzdem hier, denn eine zweite, still
 * abweichende Auflösung wäre schlimmer als eine, die nie greift.
 */
function zustandVon(eintrag) {
  if (eintrag.completed) return ZUSTAND.ABGESCHLOSSEN;
  if (eintrag.skipped) return ZUSTAND.UEBERSPRUNGEN;
  return eintrag.unlocked ? ZUSTAND.OFFEN : ZUSTAND.GESPERRT;
}

/** Ein Nachbar im Pfad, oder `null` an seinem Rand. */
function nachbar(uebersicht, index) {
  const eintrag = uebersicht[index];
  if (!eintrag) return null;
  // Die Kennung kommt auch dann mit, wenn die Lektion gesperrt ist. Ein Knopf,
  // der die nächste Lektion benennt und untätig ist, sagt mehr als ein Knopf,
  // der verschwindet: Der Anwender sieht, dass es weitergeht und dass er noch
  // nicht so weit ist.
  return { kennung: eintrag.key, nummer: eintrag.number, erreichbar: eintrag.unlocked };
}

/**
 * Rechnet den Anzeigezustand des Bereichs.
 *
 * `uebersicht` ist die Liste, die der Pfad liefert, `laufend` die Kennung der
 * angezeigten Lektion, `folgen` die Kennungen ihrer gelernten Zugfolgen.
 *
 * `zuege` sind einzeln vorgeführte Züge, je einer als
 * `{ notation, seite, art }`. Sie kommen zerlegt herein und nicht als Text:
 * Diesen Bereich vom Kern abhängig zu machen, nur um «R'» in Seite und
 * Richtung zu trennen, wäre der Anfang genau der Verdrahtung, die AK8 aus
 * 4T-0045 ausschließt.
 *
 * `textwerte` sind die Werte, die in den Lektionstext eingesetzt werden, etwa
 * die vorgegebene Zugfolge. Sie stehen damit an einer Stelle und nicht ein
 * zweites Mal im Text.
 *
 * `hilfe` sagt, ob diese Lektion eine Hilfe auf Abruf anbietet. Ein Wahrheitswert
 * und kein Bezeichner: Woher die Auskunft kommt und was sie enthält, weiß dieser
 * Bereich nicht, er zeigt eine Schaltfläche und gibt weiter, was zurückkommt.
 *
 * Eine unbekannte Lektion ist ein Befund und keine Ausnahme, wie im Kern auch.
 * Ein stiller Rückfall auf einen leeren Bereich sähe aus wie eine Lektion ohne
 * Inhalt und verstellte damit die eigentliche Ursache.
 */
export function bereichsstand({
  uebersicht,
  laufend,
  folgen = [],
  zuege = [],
  textwerte = null,
  hilfe = false,
}) {
  const index = uebersicht.findIndex((eintrag) => eintrag.key === laufend);
  if (index < 0) throw new RangeError(`Unbekannte Lektion: ${laufend}`);
  const eintrag = uebersicht[index];

  return {
    kennung: eintrag.key,
    nummer: eintrag.number,
    zustand: zustandVon(eintrag),
    zaehlung: {
      nummer: eintrag.number,
      gesamt: uebersicht.length,
      abgeschlossen: uebersicht.filter((andere) => andere.completed).length,
    },
    vorige: nachbar(uebersicht, index - 1),
    naechste: nachbar(uebersicht, index + 1),
    uebersicht: uebersicht.map((andere) => ({
      kennung: andere.key,
      nummer: andere.number,
      zustand: zustandVon(andere),
      erreichbar: andere.unlocked,
      laufend: andere.key === laufend,
    })),
    folgen: [...folgen],
    zuege: zuege.map((zug) => ({ ...zug })),
    textwerte: textwerte === null ? null : { ...textwerte },
    hilfe,
    uebung: {
      art: eintrag.practice === 'none' ? UEBUNGSART.MELDBAR : UEBUNGSART.PRUEFBAR,
      getan: eintrag.applications,
      verlangt: eintrag.required,
      offen: !eintrag.completed,
      // **Eine gesperrte Lektion lässt sich lesen und nicht üben.** Der Pfad
      // weist jedes `begin` an ihr ab; der Knopf verschwindet hier, damit die
      // Abweisung gar nicht erst nötig wird, genau wie beim Überspringen.
      //
      // Der Fall entsteht mit 4T-0052: Bis dahin war eine gesperrte Lektion
      // überhaupt nicht anzuzeigen, weil die Übersicht sie nicht anbot. Der
      // Verweis aus einem Schritt der Lösung führt jetzt auch dorthin, denn wer
      // zuerst den Löser benutzt, hat den Pfad noch nicht gegangen.
      moeglich: eintrag.unlocked,
    },
    // Eine abgeschlossene Lektion lässt sich nicht überspringen, und eine
    // gesperrte auch nicht. Der Pfad weist beides ab; der Knopf verschwindet
    // hier, damit die Abweisung gar nicht erst nötig wird.
    ueberspringbar: eintrag.unlocked && !eintrag.completed,
  };
}

/**
 * Baut den Lektionsbereich und liefert seine Bedienung.
 *
 * `handlungen` trägt acht Rückrufe: `waehle(kennung)`, `fuehreVor(folge)`,
 * `fuehreZugVor(notation)`, `beginneUebung()`, `melde()`, `ueberspringe()`,
 * `hilf()` und `kehreZurueck()`. Keiner von ihnen liefert etwas zurück; was
 * daraus folgt, kommt beim nächsten `zeige` wieder herein.
 */
export function erzeugeLektionsbereich(dokument, handlungen) {
  const knoten = dokument.createElement('div');
  knoten.className = 'lektion';

  const bau = (art, klasse, elternteil) => {
    const element = dokument.createElement(art);
    element.className = klasse;
    elternteil.append(element);
    return element;
  };

  const knopf = (klasse, elternteil, handlung) => {
    const element = dokument.createElement('button');
    element.type = 'button';
    element.className = klasse;
    element.addEventListener('click', handlung);
    elternteil.append(element);
    return element;
  };

  const zaehlung = bau('p', 'lektion-zaehlung leise', knoten);

  // Ein Aufklapper wie der Bereich «Bedienung» seit 4T-0060, 4T-0061. Er ist
  // beim Lernen offen und wird beim Wechsel in das Lösen von außen geschlossen;
  // wer eine Lösung abarbeitet, lernt nicht.
  //
  // **Der Zustand wird hier gehalten und in `zeige` nicht angefasst.** Das ist
  // die bauliche Einlösung der Zusage, dass der Anwender das letzte Wort behält:
  // `zeige` läuft bei jedem Zug, und ein Aufklapper, den es mitsetzte, ginge
  // wieder zu, sobald der Anwender ihn geöffnet hat.
  const klappe = bau('details', 'klappe', knoten);
  klappe.open = true;
  const marke = dokument.createElement('summary');
  klappe.append(marke);

  // Ohne `marke-bereich` und damit ohne gesperrte Versalien: Das
  // Design-Konzept lässt sie in Abschnitt 6 nur für kurze Marken zu, und
  // «Twisting the corners» misst genau die zwanzig Zeichen der Obergrenze.
  //
  // **Die Zählung steht über dem Aufklapper und der Titel darin.** `summary`
  // nimmt genau ein Überschriftselement auf und keine zwei Absätze; getrennt
  // bleiben beide im eingeklappten Zustand sichtbar und sagen zusammen, welche
  // Lektion darin steckt.
  const titel = bau('h3', 'lektion-titel', marke);

  const uebersichtKnoten = bau('div', 'lektion-uebersicht', klappe);
  uebersichtKnoten.role = 'group';
  /** Die Knöpfe der Übersicht, nach Kennung. Sie entstehen einmal. */
  const uebersichtKnoepfe = new Map();

  const schritte = bau('div', 'datei-reihe lektion-schritte', klappe);
  const knopfVorige = knopf('ruhend', schritte, () => waehleNachbar('vorige'));
  const knopfNaechste = knopf('ruhend', schritte, () => waehleNachbar('naechste'));
  // Der Weg zurück in die Lösung, aus 4T-0052. Er steht in der Reihe der
  // Navigation, weil er eine ist, und an ihrem Ende, damit die beiden
  // Nachbarschaltflächen nicht verrutschen, wenn er erscheint.
  //
  // **Am Kopf des Bereichs und nicht an seinem Fuß.** Dorthin springt der
  // Anwender, wenn er einen Schritt der Lösung nachschlägt, und dort soll der
  // Weg zurück gleich zu sehen sein: Ein Abstecher, dessen Rückweg man erst
  // suchen muss, wird nicht angetreten.
  const knopfZurueck = knopf('ruhend', schritte, () => handlungen.kehreZurueck());

  // Ein Behälter und kein Absatz: Ein Lektionstext besteht aus mehreren
  // Absätzen, und ein einziger langer wäre bei der Schriftgröße «Sehr groß»
  // eine Wand.
  const textKnoten = bau('div', 'lektion-text', klappe);

  // Die Vorführung einzelner Züge, für die Notation. Sie steht vor den
  // Zugfolgen, weil ein Buchstabe vor einer Folge aus Buchstaben kommt.
  const zuegeKnoten = bau('div', 'datei-reihe lektion-zuege', klappe);
  const folgenKnoten = bau('div', 'datei-reihe lektion-folgen', klappe);
  const folgenHinweis = bau('p', 'erklaerung lektion-ohne-folge', klappe);

  const uebungKnoten = bau('div', 'datei-reihe lektion-uebung', klappe);
  const knopfUeben = knopf('', uebungKnoten, () => handlungen.beginneUebung());
  const knopfMelden = knopf('', uebungKnoten, () => handlungen.melde());
  // Die Hilfe steht in derselben Reihe wie die Übung, denn sie gehört zu ihr.
  // Vor dem Überspringen, weil das die stillste Schaltfläche des Bereichs ist
  // und am Ende bleiben soll.
  const knopfHilfe = knopf('ruhend', uebungKnoten, () => handlungen.hilf());
  const knopfUeberspringen = knopf('ruhend', uebungKnoten, () => handlungen.ueberspringe());

  // Die Auskunft steht unmittelbar unter ihrer Schaltfläche und nicht bei der
  // Rückmeldung der Übung. Beide erscheinen und verschwinden zu verschiedenen
  // Zeitpunkten; in einer Zeile zusammengelegt überschriebe die eine die andere.
  const hilfeKnoten = bau('p', 'lektion-hilfe', klappe);
  hilfeKnoten.hidden = true;
  hilfeKnoten.setAttribute('role', 'status');

  // Auskunft, Stand und Rückmeldung stehen im Aufklapper und nicht darüber,
  // obwohl alle drei eine Meldung tragen. Sie entstehen ausnahmslos beim Üben,
  // und dabei ist der Bereich offen; außerhalb stünden sie beim Lösen als Rest
  // einer Tätigkeit, die gerade nicht läuft.
  const standKnoten = bau('p', 'lektion-stand', klappe);
  const rueckmeldungKnoten = bau('p', 'lektion-rueckmeldung', klappe);
  rueckmeldungKnoten.hidden = true;
  // Die Rückmeldung erscheint während des Übens und nicht auf Anforderung. Wer
  // dabei den Blick am Würfel hat, bekommt sie sonst gar nicht mit.
  rueckmeldungKnoten.setAttribute('role', 'status');

  /** Der zuletzt gezeigte Stand, für die beiden Nachbarschaltflächen. */
  let letzter = null;

  function waehleNachbar(richtung) {
    const ziel = letzter?.[richtung];
    if (ziel && ziel.erreichbar) handlungen.waehle(ziel.kennung);
  }

  /** Legt die zehn Knöpfe der Übersicht an, sobald der Pfad zum ersten Mal steht. */
  function baueUebersicht(stand) {
    if (uebersichtKnoepfe.size === stand.uebersicht.length) return;
    uebersichtKnoten.textContent = '';
    uebersichtKnoepfe.clear();
    for (const eintrag of stand.uebersicht) {
      const element = knopf('lektion-punkt', uebersichtKnoten, () =>
        handlungen.waehle(eintrag.kennung),
      );
      element.textContent = String(eintrag.nummer);
      uebersichtKnoepfe.set(eintrag.kennung, element);
    }
  }

  /**
   * Baut den Text der Lektion aus seinen vier Bausteinen.
   *
   * **Jede Lektion trägt alle vier.** Bis 4T-0051 stand hier ein Zweig für die
   * Lektionen, deren Text noch entstand: Fehlte der erste Baustein, erschien ein
   * gemeinsamer Platzhalter. Mit dem letzten Lektionstext gibt es keine solche
   * Lektion mehr, und ein Zweig ohne Fall ist ein Zweig, den niemand mehr prüft.
   * Dass wirklich jede Lektion vollständig ist, verlangt seitdem die Prüfung AK8
   * in `test/i18n.test.js`.
   *
   * Jeder Absatz ist ein eigener Knoten. Ein einziger mit Zeilenumbrüchen
   * darin läge in der Anzeige eng zusammen, und gerade der Wechsel von
   * Erklärung zu Vorstellung soll sichtbar sein.
   */
  function baueText(stand, text) {
    textKnoten.textContent = '';
    const absatz = (inhalt, art) => {
      const element = bau('p', 'lektion-absatz', textKnoten);
      element.textContent = inhalt;
      element.dataset.baustein = art;
    };

    for (const baustein of TEXTBAUSTEINE) {
      const inhalt = text(`lektion.${stand.kennung}.${baustein}`, stand.textwerte);
      for (const teil of absaetze(inhalt)) absatz(teil, baustein);
    }
  }

  /** Die Schaltflächen für die Zugfolgen. Höchstens zwei, deshalb jedes Mal neu. */
  function baueFolgen(stand, text) {
    zuegeKnoten.textContent = '';
    for (const zug of stand.zuege) {
      const element = knopf('ruhend', zuegeKnoten, () => handlungen.fuehreZugVor(zug.notation));
      // Die Notation steht vorn und der Klartext dahinter, nicht umgekehrt: Zu
      // lernen ist das Zeichen, und der Klartext sagt, was es bedeutet.
      element.textContent = text('pfad.vorfuehrenZug', {
        zug: zug.notation,
        seite: text(`seite.${zug.seite}`),
        richtung: text(`richtung.${zug.art}`),
      });
    }

    folgenKnoten.textContent = '';
    for (const folge of stand.folgen) {
      const element = knopf('', folgenKnoten, () => handlungen.fuehreVor(folge));
      element.textContent = text('pfad.vorfuehren', { name: text(`folge.${folge}`) });
    }
    // Der Hinweis steht nur dort, wo das Fehlen einer Zugfolge eine Aussage
    // ist: bei den Lektionen, die eine haben könnten. Bei Lektion 0 wäre er
    // eine Auskunft über etwas, das dort ohnehin niemand erwartet, und bei
    // Lektion 1 stünde er neben acht vorgeführten Zügen und widerspräche dem,
    // was der Anwender sieht.
    //
    // **Die Lektion mit der Hilfe ist der dritte solche Fall**, aufgefallen bei
    // 4T-0051. Sie nennt keine eigene Zugfolge und käme trotzdem ohne keine aus:
    // In ihr kommen alle sechs vor, gelehrt wird nur keine neue. Der Satz wäre
    // dort schlicht falsch.
    folgenHinweis.hidden =
      stand.folgen.length > 0 ||
      stand.zuege.length > 0 ||
      stand.uebung.art === UEBUNGSART.MELDBAR ||
      stand.hilfe;
    folgenHinweis.textContent = text('pfad.ohneFolge');
  }

  return {
    knoten,

    /**
     * Klappt den Bereich auf oder zu, 4T-0061.
     *
     * **Nur für den Wechsel der Tätigkeit gedacht**, also für das Erzeugen einer
     * Lösung und die beiden Wege zwischen Lösung und Lektion. Wer sie an einen
     * Zustand hängt, der sich nebenbei ändert, nimmt dem Anwender die eigene
     * Wahl wieder weg.
     */
    klappe(offen) {
      klappe.open = offen;
    },

    /**
     * Liegt der Fokus in dem, was der Aufklapper verbirgt?
     *
     * Getrennt von `klappe`, weil die Antwort **vor** allem anderen zu holen ist
     * und nicht erst beim Zuklappen: Auf dem Rückweg in die Lösung verschwindet
     * die Schaltfläche, die ihn ausgelöst hat, und nimmt den Fokus mit. Wer erst
     * danach fragt, bekommt in jedem Fall «nein» und lässt den Fokus liegen.
     */
    enthaeltFokus() {
      return klappe.contains(dokument.activeElement);
    },

    /**
     * Zeigt einen Stand.
     *
     * `text` wird bei jedem Aufruf mitgegeben und nicht beim Erzeugen
     * festgehalten: Die Sprache lässt sich umschalten, und ein festgehaltener
     * Verweis zeigte danach auf die alte.
     *
     * `laeuft` sagt, ob gerade eine Übung dieser Lektion offen ist,
     * `rueckmeldung` trägt Bezeichner und Werte der letzten Meldung oder ist
     * `null`. Beides ist flüchtig und steht deshalb nicht im gerechneten Stand.
     *
     * `hilfe` trägt die letzte Auskunft in derselben Form oder `null`,
     * `hilfeLaeuft` sagt, dass eine Anfrage unterwegs ist. Beides ist ebenso
     * flüchtig; die Auskunft gilt für die Lage, zu der sie geholt wurde, und
     * wer sie hereinreicht, nimmt sie beim nächsten Zug wieder zurück.
     *
     * `rueckweg` sagt, ob es eine Lösung gibt, in die zurückzukehren wäre. Ein
     * Wahrheitswert und keine Kennung: Wohin der Weg führt und was dabei
     * wiederherzustellen ist, weiß allein die Verdrahtung, wie schon bei der
     * Hilfe.
     */
    zeige({
      stand,
      text,
      laeuft = false,
      rueckmeldung = null,
      hilfe = null,
      hilfeLaeuft = false,
      rueckweg = false,
    }) {
      letzter = stand;
      baueUebersicht(stand);
      baueFolgen(stand, text);

      // Nummer und Stand nebeneinander, nicht «Lektion 5 von 10»: Die
      // Lektionen zählen ab null, und «Lektion 0 von 10» wäre eine Auskunft,
      // die niemand versteht. Getrennt sagt jede Hälfte, was sie sagen soll.
      zaehlung.textContent = `${text('pfad.zaehlung', {
        nummer: stand.zaehlung.nummer,
      })} · ${text('pfad.stand', {
        abgeschlossen: stand.zaehlung.abgeschlossen,
        gesamt: stand.zaehlung.gesamt,
      })}`;
      titel.textContent = text(`lektion.${stand.kennung}.titel`);
      baueText(stand, text);

      for (const eintrag of stand.uebersicht) {
        const element = uebersichtKnoepfe.get(eintrag.kennung);
        element.dataset.zustand = eintrag.zustand;
        element.disabled = !eintrag.erreichbar;
        element.setAttribute('aria-current', String(eintrag.laufend));
        // Der Titel gehört an den Knopf und nicht in eine Legende daneben:
        // Zehn Ziffern ohne Namen sind eine Zahlenreihe und kein Pfad.
        element.title = `${text(`lektion.${eintrag.kennung}.titel`)} · ${text(
          `pfad.zustand.${eintrag.zustand}`,
        )}`;
        element.setAttribute('aria-label', element.title);
      }

      knopfVorige.textContent = text('pfad.vorige');
      knopfNaechste.textContent = text('pfad.naechste');
      knopfVorige.disabled = !stand.vorige?.erreichbar;
      knopfNaechste.disabled = !stand.naechste?.erreichbar;
      knopfZurueck.hidden = !rueckweg;
      knopfZurueck.textContent = text('pfad.zurLoesung');

      const meldbar = stand.uebung.art === UEBUNGSART.MELDBAR;
      knopfUeben.hidden = meldbar || !stand.uebung.moeglich;
      knopfUeben.textContent = text(laeuft ? 'pfad.uebenNeu' : 'pfad.ueben');
      knopfMelden.hidden = !meldbar || !stand.uebung.offen;
      knopfMelden.textContent = text('pfad.verstanden');
      knopfUeberspringen.hidden = !stand.ueberspringbar;
      knopfUeberspringen.textContent = text('pfad.ueberspringen');

      // Während gerechnet wird, bleibt die Schaltfläche stehen und wird nur
      // untätig. Ein Knopf, der verschwindet und wiederkommt, lässt das Layout
      // springen, und gemessene neun Millisekunden sieht ohnehin niemand; der
      // Zustand ist für den Fall da, dass ein schwaches Gerät länger braucht.
      knopfHilfe.hidden = !stand.hilfe;
      knopfHilfe.textContent = text('pfad.hilfe');
      knopfHilfe.disabled = hilfeLaeuft;
      hilfeKnoten.hidden = hilfe === null;
      if (hilfe !== null) {
        hilfeKnoten.textContent = text(hilfe.bezeichner, hilfe.werte ?? null);
      }

      standKnoten.textContent =
        stand.zustand === ZUSTAND.ABGESCHLOSSEN
          ? text('pfad.abgeschlossen')
          : stand.zustand === ZUSTAND.UEBERSPRUNGEN
            ? text('pfad.uebersprungen')
            : stand.zustand === ZUSTAND.GESPERRT
              ? text('pfad.gesperrt')
              : text('pfad.anwendungen', {
                  getan: stand.uebung.getan,
                  verlangt: stand.uebung.verlangt,
                });

      rueckmeldungKnoten.hidden = rueckmeldung === null;
      if (rueckmeldung !== null) {
        rueckmeldungKnoten.textContent = text(rueckmeldung.bezeichner, rueckmeldung.werte ?? null);
        rueckmeldungKnoten.dataset.art = rueckmeldung.art ?? 'hinweis';
      }
    },
  };
}
