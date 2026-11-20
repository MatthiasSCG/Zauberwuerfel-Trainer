// Der Stufenbereich der Oberfläche.
//
// Er zeigt eine Stufe des Übergangs zum Verfahren CFOP und den Fall, der am
// Übungswürfel gerade vorliegt. Vier Dinge führt er: die Zählung im Übergang,
// die Übersicht über die vier Stufen, den Fall mit seinen Texten und Folgen und
// den Deckungsstand.
//
// ## Warum ein eigenes Modul und keine Erweiterung von `lektion.js`
//
// Entschieden am 2026-08-27 in 4T-0120, und die Grundlage ist gemessen. Der
// Lektionsbereich hat 241 Codezeilen, nicht 514; der Rest ist Kommentar und
// Leerraum. Von diesen 241 trügen 69 unverändert, 110 in der Form und 62 gar
// nicht. Der Ausschlag liegt aber nicht in den Zeilen, sondern in den Stellen,
// an denen eine Erweiterung verzweigen müsste: **19 der 23 Textaufrufe** und
// **5 der 10 Bedienelemente** lauten für eine Stufe anders oder entfallen, und
// **11 der 31 Bausteine des Zweigs `pfad`** nennen das Wort Lektion. Ein
// Bereich, bei dem vier Fünftel seiner Textstellen verzweigen, ist kein
// erweiterter erster, sondern ein zweiter im Gewand des ersten.
//
// **Der Preis ist benannt:** rund 69 Codezeilen stehen hier ein zweites Mal.
// Ein gemeinsames Grundmodul dafür wäre der dritte Weg und ist verworfen, weil
// erst 3E-0039 und 3E-0040 zeigen, welcher Schnitt trägt; ihn jetzt zu legen
// hieße, ihn zu raten.
//
// ## Warum das Erkennungsbild Text ist und keine Zeichnung
//
// Ebenfalls am 2026-08-27 entschieden und über den vollständigen Lagenraum
// jedes Blicks gemessen, also über 62208, 7776, 288 und 48 Lagen. Betrachtet
// sind die 21 Felder einer Draufsicht der letzten Schicht.
//
// **Ein gezeichnetes Bild trüge bei zehn der sechzehn Fälle und bei sechs
// nicht.** Beim Blick auf die Eckendrehung ist es vollständig: 21 von 21
// Feldern stehen fest, jeder der sieben Fälle hat genau ein Bild, und die
// sieben sind verschieden. Beim Blick auf die Kantenkippung sind zwölf Felder
// frei, weil die Ecken dort weder gedreht noch gesetzt sind; neutral gelassen
// trägt das Bild, mit Ecken gezeichnet gäbe es 27 Bilder je Fall. **Bei den
// beiden Blicken des Setzens trägt es gar nichts:** Die letzte Schicht ist
// dort bereits orientiert, oben trägt jedes Feld die Oberfarbe und im Kranz
// keines, und alle sechs Fälle hätten dasselbe Bild. Sie sind nur über echte
// Farben zu trennen, und die stehen bei vier der sechs nicht fest.
//
// Dazu kommt, was der Text leistet und ein Bild nicht: Von den zwei Absätzen
// jedes Bild-Bausteins sagt der zweite, **wie auszurichten ist**. Ein Bild
// zeigt eine Haltung, es benennt sie nicht. Und der Anwender hat die
// vorliegende Lage ohnehin vor sich, räumlich und im Netz.
//
// ## Was dieses Modul nicht kennt
//
// **Weder `lessons` noch `solver` noch `settings`**, und auch kein anderes
// Modul der Oberfläche. Nach Grundsatz 3 der Architektur wird in `app`
// verdrahtet. Der Fall kommt deshalb fertig herein, mit den Bezeichnern seiner
// Texte und dem Wortlaut seiner Folgen; wie ein Baustein im Sprachbaum heißt,
// weiß `textKeyFor` im Bestand und nicht dieser Bereich.
//
// **Er führt die Vorführung nicht selbst aus.** Er meldet den Wunsch an, und
// `app` lädt die Zugfolge in die vorhandene Wiedergabe, genau wie beim
// Lektionsbereich.
//
// ## Warum die Rechnung von der Darstellung getrennt ist
//
// `stufenstand` ist eine reine Funktion und ohne Browser vollständig
// durchzurechnen, `erzeugeStufenbereich` baut daraus Knoten. Der Grund ist
// derselbe wie bei `bereichsstand`: Welche Stufe gesperrt ist und welcher Fall
// als gelungen gilt, ist die Art Rechnung, deren Fehler am Bild nicht
// auffällt, weil ein zu viel freigegebener Knopf aussieht wie ein richtiger.

/**
 * Die vier Zustände, in denen eine Stufe in der Übersicht steht.
 *
 * Dieselben vier wie beim Lektionsbereich, und aus demselben Grund getrennt:
 * Eine übersprungene Stufe gibt die folgende frei, ohne dass je etwas geprüft
 * worden wäre. S-0040 verlangt in AK6 ausdrücklich, dass sich eine Stufe
 * überspringen lässt.
 */
export const ZUSTAND = {
  ABGESCHLOSSEN: 'abgeschlossen',
  UEBERSPRUNGEN: 'uebersprungen',
  OFFEN: 'offen',
  GESPERRT: 'gesperrt',
};

/**
 * Woran der Fortschritt einer Stufe gemessen wird.
 *
 * Die beiden Regeln aus Abschnitt 11.7 des Didaktik-Konzepts, wie sie S-0040 in
 * AK1 und AK2 festhält: Wo eine Stufe eine Fallmenge hat, zählt die Deckung; wo
 * sie eine Denkweise ist, zählt die Zahl gelungener Anwendungen.
 *
 * **Welche gilt, hängt allein an der Fallliste.** Ein eigenes Feld dafür wäre
 * ein zweiter Ausdruck derselben Sache und könnte ihm davonlaufen; `stages.js`
 * hält es an `views` genauso.
 */
export const MASS = { DECKUNG: 'deckung', ANWENDUNGEN: 'anwendungen' };

/**
 * Woran die Sperre einer Stufe hängt, seit 4T-0207.
 *
 * Die Werte sind zugleich die Endung des Textbausteins, wie bei `ZUSTAND`.
 */
export const SPERRE = { LERNPFAD: 'lernpfad', STUFE: 'stufe' };

/**
 * Woraus der Text einer Stufe besteht, in der Reihenfolge der Anzeige.
 *
 * Festgelegt am 2026-08-28 zu 4T-0122. **Dieselben vier wie bei einer Lektion**
 * und nicht die drei eines Falls: Ein Fall hat ein Erkennungsbild und keine
 * Aufgabe, bei einer Stufe ist es umgekehrt. Sie wird geübt, ihr Ziel steht am
 * Würfel, und woran der Anwender den vorliegenden Fall erkennt, sagt der
 * Fallbestand und nicht sie.
 *
 * **Die `vorstellung` ist keine Zutat.** Abschnitt 11.4 des Didaktik-Konzepts
 * gibt jeder der vier Stufen eine begleitende Vorstellung, so wie Abschnitt 5
 * es für jede Lektion tut.
 *
 * **Die Liste steht hier und wird nicht aus `view/lektion.js` geliehen**,
 * obwohl sie dort gleich lautet. Der Kopf dieser Datei sagt zu, kein anderes
 * Modul der Oberfläche zu kennen, und ein Import bräche die Zusage für vier
 * Zeichenketten. Dass beide Listen heute übereinstimmen, ist zudem keine
 * Zusage für morgen: Eine Stufe könnte einen fünften Baustein bekommen, den
 * eine Lektion nicht hat.
 */
export const STUFENBAUSTEINE = ['einstieg', 'erklaerung', 'vorstellung', 'aufgabe'];

/** Ein Baustein, in seine Absätze zerlegt. Leere Zeilen fallen weg. */
export function absaetze(inhalt) {
  return inhalt
    .split(/\n\s*\n/)
    .map((absatz) => absatz.trim())
    .filter((absatz) => absatz.length > 0);
}

/**
 * Der Zustand einer Stufe in der Übersicht.
 *
 * **Abgeschlossen schlägt übersprungen**, wie beim Lektionsbereich. Der Fall
 * kann nicht auftreten, weil `progress.js` den Widerspruch schon beim Lesen
 * auflöst; die Reihenfolge steht trotzdem hier, denn eine zweite, still
 * abweichende Auflösung wäre schlimmer als eine, die nie greift.
 */
function zustandVon(eintrag) {
  if (eintrag.completed) return ZUSTAND.ABGESCHLOSSEN;
  if (eintrag.skipped) return ZUSTAND.UEBERSPRUNGEN;
  return eintrag.unlocked ? ZUSTAND.OFFEN : ZUSTAND.GESPERRT;
}

/** Ein Nachbar im Übergang, oder `null` an seinem Rand. */
function nachbar(uebersicht, index) {
  const eintrag = uebersicht[index];
  if (!eintrag) return null;
  // Die Kennung kommt auch dann mit, wenn die Stufe gesperrt ist, und seit
  // 4T-0207 führt der Knopf auch dorthin: Gelesen werden darf jede Stufe.
  // `erreichbar` sagt weiterhin, ob sie frei ist.
  return { kennung: eintrag.key, nummer: eintrag.number, erreichbar: eintrag.unlocked };
}

/** Der hereingereichte Fall als eigene Kopie, damit der Stand für sich steht. */
function fallKopie(fall) {
  if (fall === null) return null;
  return {
    kennung: fall.kennung,
    name: fall.name,
    texte: fall.texte.map((teil) => ({ ...teil })),
    folge: fall.folge,
    alternativen: [...fall.alternativen],
  };
}

/**
 * Rechnet den Anzeigezustand des Bereichs.
 *
 * `uebersicht` ist die Liste der vier Stufen mit ihrem Stand, `laufend` die
 * Kennung der angezeigten. Jeder Eintrag trägt `key`, `number`, `unlocked`,
 * `completed`, `skipped`, `applications` und `required`, also dieselbe Form,
 * die der Lernpfad für seine Lektionen liefert.
 *
 * `fall` ist der Fall, den die Erkennung an der vorliegenden Lage nennt, oder
 * `null`. Er kommt fertig herein, als `{ kennung, name, texte, folge,
 * alternativen }`, wobei `name` und die Bezeichner in `texte` auf den
 * Sprachbaum zeigen und `folge` den Wortlaut in Notation trägt.
 *
 * `faelle` sind alle Fälle dieser Stufe, je als `{ kennung, name }`, in der
 * Reihenfolge des Bestands. Ist die Liste leer, misst die Stufe Anwendungen.
 *
 * `deckung` ist, was `coverageOf` liefert, also `{ done, required, missing }`.
 * **`null` ist kein Fehler, sondern der leere Stand:** Dann ist nichts
 * gelungen, und verlangt sind alle Fälle. Ein Wurf dafür machte aus einem
 * ersten Start einen Befund.
 *
 * `verdeckt` hält Name, Text und Zugfolgen des Falls zurück, 4T-0139.
 * **Sonst stünde die Antwort der Erkennungsübung im Bereich darüber**, denn
 * dieser Bereich benennt jede aufgelegte Lage, und das Training legt seine
 * Aufgaben auf denselben Würfel. Entschieden vom Product Owner am 2026-09-02;
 * verworfen sind das Zuklappen des Bereichs, weil es dem Anwender einen
 * Aufklapper nähme, den er selbst geöffnet hat, und das Hinnehmen, weil die
 * Übung beim ersten Gebrauch wertlos wäre.
 *
 * **Zurückgehalten wird die Auskunft und nicht der Fortschritt.** Die
 * Deckungsliste bleibt stehen: Sie sagt, welche Fälle gelungen sind, und nicht,
 * welcher gerade vorliegt.
 *
 * Eine unbekannte Stufe ist dagegen sehr wohl ein Befund und keine Ausnahme,
 * wie im Kern auch. Ein stiller Rückfall auf einen leeren Bereich sähe aus wie
 * eine Stufe ohne Inhalt und verstellte damit die Ursache.
 */
export function stufenstand({
  uebersicht,
  laufend,
  fall = null,
  faelle = [],
  deckung = null,
  verdeckt = false,
  fassung = null,
  fassungen = [],
  deckungMisst = false,
  nichtHinterlegt = false,
}) {
  const index = uebersicht.findIndex((eintrag) => eintrag.key === laufend);
  if (index < 0) throw new RangeError(`Unbekannte Stufe: ${laufend}`);
  const eintrag = uebersicht[index];

  const mitFaellen = faelle.length > 0;
  // **Verdeckt wird nur, wo es etwas zu verdecken gibt.** Eine Stufe ohne
  // Fallmenge führt nie einen Fall; der Satz über den zurückgehaltenen
  // behauptete dort etwas, das der Anwender nie zu sehen bekäme.
  const zurueckgehalten = verdeckt && mitFaellen;
  // Ohne abgelegten Stand fehlt jeder Fall. Die Menge wird aus `missing`
  // gebildet und nicht aus dem Gegenteil: Ein Stand aus einer volleren Fassung
  // des Bestands bringt Kennungen mit, die es hier nicht gibt, und `coverageOf`
  // hat sie bereits gegen den heutigen Bestand gerechnet.
  const fehlend = new Set(deckung === null ? faelle.map((f) => f.kennung) : deckung.missing);

  // **Die Umschaltung erscheint nur, wo beide Fassungen Fälle tragen**, und die
  // Rechnung dazu steht in `stages.js` und wird hier nur durchgereicht: Dieses
  // Modul kennt den Fallbestand nicht. `fassungen` ist deshalb leer, wo nicht
  // umgeschaltet werden kann, und die Anzeige entfällt damit von selbst.
  // Entschieden vom Product Owner am 2026-09-04 mit 4T-0170.
  const umschaltbar = fassungen.length > 1;

  // **Der Hinweis auf den Rückfall, 4T-0172.** Drei Bedingungen hier, und jede
  // hat ihren Grund.
  //
  // **`fall.rueckfall` kommt fertig herein**, und das ist der Schnitt: Ob die
  // andere Fassung dieselbe Lage anders angeht, ist eine Frage an den
  // Fallbestand, und dieses Modul kennt ihn nicht. Es weiß nicht einmal, welche
  // der Fassungen die kleinere ist. Dieselbe Arbeitsteilung wie beim Namen des
  // Falls, der als Bezeichner hereinkommt und nicht als Text.
  //
  // **Der Fall ist noch nicht gelungen**, gemessen an der Deckung und nicht an
  // den Messwerten: Die Deckung ist das Maß aus Abschnitt 11.7 des
  // Didaktik-Konzepts, und ein zweites Maß daneben liefe ihm davon.
  //
  // **Und der Fall wird gerade nicht zurückgehalten.** Sonst verriete der
  // Hinweis, dass die aufgelegte Lage zu den noch nicht gelungenen gehört, und
  // schränkte die Antwortmenge der Erkennungsübung ein. Dieselbe Verdeckung wie
  // beim Namen des Falls seit 4T-0139.
  const rueckfallHinweis =
    fall !== null && !zurueckgehalten && fall.rueckfall === true && fehlend.has(fall.kennung);

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
    fall: zurueckgehalten ? null : fallKopie(fall),
    verdeckt: zurueckgehalten,
    // **Kein Fall, und dafür gibt es zwei Gründe**, seit 4T-0196. Entweder ist
    // an dieser Lage nichts zu tun, oder es ist etwas zu tun und der Bestand
    // führt dazu keinen Fall. Welcher von beiden vorliegt, weiß allein die
    // Verdrahtung, denn nur sie liest die Lage; hier kommt die Antwort fertig
    // herein, wie der Rückfall seit 4T-0172. **Während einer Erkennungsübung
    // schweigt der Satz**, denn er verriete, dass zur aufgelegten Lage kein
    // Fall gehört, und schränkte die Antwortmenge ein; dieselbe Verdeckung wie
    // beim Namen des Falls.
    nichtHinterlegt: nichtHinterlegt && !verdeckt,
    // **Steht überhaupt ein Satz an der Stelle des Falls?**
    //
    // Die Rechnung stand bis 4T-0196 im Bau-Teil und war dort nur als Text zu
    // prüfen; ein Bruch an ihr ließ keine einzige Prüfung fallen. Nach Lehre 14
    // in Abschnitt 14.5 gehört eine Aussage dorthin, wo ihr Bruch sie fallen
    // lässt, und das ist hier.
    //
    // **Gemessen an den Fällen und nicht am Maß.** Bis 4T-0196 fielen beide
    // zusammen; seit die dritte Stufe Fälle trägt und trotzdem Anwendungen
    // zählt, sagte das Maß nicht mehr, ob es überhaupt einen Fall zu finden
    // gäbe. Bei einer Stufe ohne Fallmenge stünde der Satz sonst dauerhaft da,
    // wo der Anwender ohne Fall arbeitet.
    ohneFallSichtbar: (zurueckgehalten ? null : fall) === null && mitFaellen,
    // Der Hinweis auf den Rückfall, 4T-0172. Ein Wahrheitswert und kein Text:
    // Die Worte stehen im Sprachbaum, wie überall in diesem Modul.
    rueckfall: rueckfallHinweis,
    /**
     * Die Fassung, in der diese Stufe geübt wird, und die Wahl darüber.
     *
     * `gilt` ist die geltende Fassung, `wahl` trägt je Fassung ihren Namen und
     * ihre Fallzahl. **`umschaltbar` ist gerechnet und nicht gesetzt:** Wo es
     * nichts zu wählen gibt, steht eine Wahl mit einem Eintrag oder keine, und
     * eine Bedienung dafür wäre eine ohne Gegenstand.
     */
    fassung: {
      gilt: fassung,
      umschaltbar,
      wahl: fassungen.map((eintrag) => ({ ...eintrag, gilt: eintrag.name === fassung })),
    },
    // **Das Maß kommt herein und wird nicht mehr aus der Fallzahl gerechnet**,
    // seit 4T-0196. Bis dahin fielen beide zusammen: Wer Fälle hatte, wurde an
    // ihrer Deckung gemessen. Die dritte Stufe trennt das, denn sie trägt
    // vierundzwanzig Fälle und bleibt bei drei gelungenen Anwendungen; welche
    // der beiden Regeln aus Abschnitt 11.7 des Didaktik-Konzepts gilt, rechnet
    // `stages.js` und nicht dieses Modul, das den Fallbestand nicht kennt.
    //
    // **Die Fallliste hängt weiterhin an den Fällen und nicht am Maß.** Sie ist
    // der Deckungsstand, den derselbe Abschnitt für den Ausbau verlangt, und
    // steht auch dort, wo die Freigabe eine andere Größe misst.
    fortschritt: {
      mass: deckungMisst ? MASS.DECKUNG : MASS.ANWENDUNGEN,
      getan: deckungMisst ? (deckung?.done ?? 0) : eintrag.applications,
      verlangt: deckungMisst ? (deckung?.required ?? faelle.length) : eintrag.required,
      // **Die Liste und nicht nur die Zahl.** AK3 von S-0040 verlangt, dass der
      // Anwender sieht, welche Fälle ihm gelungen sind und welche fehlen. Eine
      // Zahl sagt ihm, wie weit er ist, und nicht, was als Nächstes zu üben
      // wäre.
      faelle: faelle.map((einzeln) => ({ ...einzeln, gelungen: !fehlend.has(einzeln.kennung) })),
    },
    uebung: {
      offen: !eintrag.completed,
      // **Eine gesperrte Stufe lässt sich lesen und nicht üben.** Der Knopf
      // verschwindet hier, damit die Abweisung im Pfad gar nicht erst nötig
      // wird, genau wie beim Überspringen.
      moeglich: eintrag.unlocked,
    },
    // Eine abgeschlossene Stufe lässt sich nicht überspringen, und eine
    // gesperrte auch nicht.
    ueberspringbar: eintrag.unlocked && !eintrag.completed,
    // An einer gesperrten Stufe steht stattdessen der Einstieg, 4T-0207, aus
    // demselben Grund wie im Lernpfad.
    einsteigbar: !eintrag.unlocked,
    // **Woran die Sperre hängt**, 4T-0207. Die erste Stufe baut auf dem
    // Lernpfad auf und nicht auf einer vorigen Stufe; bis dahin nannte sie
    // trotzdem «sobald die vorige steht», und der Abnahmelauf vom 2026-09-08
    // hat genau das als falsche Auskunft gefunden. Gerechnet an der Stellung
    // im Übergang und nicht an einer Kennung, damit eine neue erste Stufe den
    // Satz von selbst bekommt.
    gesperrtDurch: index === 0 ? SPERRE.LERNPFAD : SPERRE.STUFE,
  };
}

/**
 * Der Satz der Standzeile zu einem Stand aus `stufenstand`.
 *
 * **Eine übersprungene Stufe nennt ihren bisherigen Stand mit**, seit 4T-0212.
 * Bis dahin sagte sie allein «übersprungen», und wer darin übte, sah weder
 * Anwendungen noch Deckung. Mit dem freien Einstieg ist das der Regelfall für
 * jeden, der schon etwas kann: Er überspringt die Stufen vor seinem Ziel und
 * übt dann doch in einer davon. Gefunden im Abnahmelauf vom 2026-11-20, B4.
 *
 * Eigens herausgezogen, damit der Satz ohne Dokument prüfbar ist.
 */
export function standsatz(stand, text) {
  if (stand.zustand === ZUSTAND.ABGESCHLOSSEN) return text('uebergang.abgeschlossen');
  if (stand.zustand === ZUSTAND.GESPERRT) return text(`uebergang.gesperrt.${stand.gesperrtDurch}`);
  const fortschritt = text(
    stand.fortschritt.mass === MASS.DECKUNG ? 'uebergang.deckung' : 'uebergang.anwendungen',
    { getan: stand.fortschritt.getan, verlangt: stand.fortschritt.verlangt },
  );
  if (stand.zustand !== ZUSTAND.UEBERSPRUNGEN) return fortschritt;
  return `${text('uebergang.uebersprungen')} ${text('uebergang.bisher', { stand: fortschritt })}`;
}

/**
 * Baut den Stufenbereich und liefert seine Bedienung.
 *
 * `handlungen` trägt sechs Rückrufe: `waehle(kennung)`, `fuehreVor(folge)`,
 * `beginneUebung()`, `ueberspringe()`, seit 4T-0171 `waehleFassung(fassung)`
 * und seit 4T-0207 `steigeEin()`. Keiner liefert etwas zurück; was daraus
 * folgt, kommt beim nächsten `zeige` wieder herein.
 *
 * **Sechs und nicht die neun des Lektionsbereichs.** Es fehlen die Meldung ohne
 * Würfelaufgabe, weil jede Stufe am Würfel prüfbar ist, die Hilfe auf Abruf,
 * die Vorführung einzelner Züge und der Rückweg in eine Lösung.
 */
export function erzeugeStufenbereich(dokument, handlungen) {
  const knoten = dokument.createElement('div');
  knoten.className = 'stufe';

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

  const zaehlung = bau('p', 'stufe-zaehlung leise', knoten);

  // Ein Aufklapper wie beim Lektionsbereich seit 4T-0060, 4T-0061, und mit
  // derselben Zusage: **Der Zustand wird hier gehalten und in `zeige` nicht
  // angefasst.** `zeige` läuft bei jedem Zug, und ein Aufklapper, den es
  // mitsetzte, ginge wieder zu, sobald der Anwender ihn geöffnet hat.
  const klappe = bau('details', 'klappe', knoten);
  klappe.open = true;
  const marke = dokument.createElement('summary');
  klappe.append(marke);

  // Die Zählung steht über dem Aufklapper und der Titel darin. `summary` nimmt
  // genau ein Überschriftselement auf und keine zwei Absätze; getrennt bleiben
  // beide im eingeklappten Zustand sichtbar.
  const titel = bau('h3', 'stufe-titel', marke);

  const uebersichtKnoten = bau('div', 'stufe-uebersicht', klappe);
  uebersichtKnoten.role = 'group';
  /** Die Knöpfe der Übersicht, nach Kennung. Sie entstehen einmal. */
  const uebersichtKnoepfe = new Map();

  const schritte = bau('div', 'datei-reihe stufe-schritte', klappe);
  const knopfVorige = knopf('ruhend', schritte, () => waehleNachbar('vorige'));
  const knopfNaechste = knopf('ruhend', schritte, () => waehleNachbar('naechste'));

  // Der Text der Stufe, über dem Fall und nicht unter ihm. Er gilt der Stufe,
  // der Falltext darunter allein der Lage, die gerade vorliegt; die
  // allgemeinere Auskunft steht oben. Ein eigener Behälter mit eigenem Namen,
  // denn `stufe-text` ist bereits der Falltext, und zwei Texte im selben
  // Bereich ohne verschiedene Namen wären nicht auseinanderzuhalten.
  const lehrtextKnoten = bau('div', 'stufe-lehrtext', klappe);

  // Der Name des Falls als eigene Überschrift und nicht als erster Absatz des
  // Textes: Er wechselt bei jedem Zug, der Stufentitel darüber nicht, und die
  // beiden Ebenen sollen unterscheidbar bleiben.
  const fallName = bau('h4', 'stufe-fall', klappe);

  // Der Hinweis auf den Rückfall, 4T-0172. **Am Fall und nicht bei der
  // Umschaltung**, denn er gilt der Lage, die gerade vorliegt, und nicht der
  // Stufe. Er steht unter dem Namen und über dem Text: Wer den Fall nicht
  // kennt, soll es erfahren, bevor er die Erklärung liest.
  const rueckfallKnoten = bau('p', 'stufe-rueckfall', klappe);
  rueckfallKnoten.hidden = true;

  // Ein Behälter und kein Absatz: Erkennungsbild und Erklärung tragen gemessen
  // je zwei Absätze, und ein einziger langer wäre bei der Schriftgröße «Sehr
  // groß» eine Wand.
  const textKnoten = bau('div', 'stufe-text', klappe);

  const folgenKnoten = bau('div', 'datei-reihe stufe-folgen', klappe);
  const ohneFall = bau('p', 'erklaerung stufe-ohne-fall', klappe);

  const uebungKnoten = bau('div', 'datei-reihe stufe-uebung', klappe);
  const knopfUeben = knopf('', uebungKnoten, () => handlungen.beginneUebung());
  const knopfUeberspringen = knopf('ruhend', uebungKnoten, () => handlungen.ueberspringe());
  // Der Einstieg, 4T-0207, an derselben Stelle, zurückhaltend dargestellt und
  // mit derselben Begründung wie im Lernpfad. **Hier wiegt das schwerer**: Beim
  // ersten Start steht der Übergang aufgeklappt auf der gesperrten ersten Stufe,
  // und ein hervorgehobener Einstieg wäre das Erste, was ein Einsteiger dort
  // sieht. Gefunden am 2026-11-20 von der unabhängigen Prüfung.
  const knopfEinsteigen = knopf('ruhend', uebungKnoten, () => handlungen.steigeEin());

  const standKnoten = bau('p', 'stufe-stand', klappe);

  // Die Wahl der Fassung, 4T-0171. **Über der Fallliste und unter dem Stand**,
  // und der Ort ist begründet: Die Fassung bestimmt, welche Fälle die Liste
  // führt und wie viele der Stand verlangt. Sie steht damit unmittelbar über
  // ihrer eigenen Wirkung, und der Anwender sieht beim Umschalten in einem
  // Blick, was sich ändert. Oben beim Titel sähe sie aus wie eine Eigenschaft
  // der Stufe und nicht wie eine Wahl über das Üben.
  //
  // **Im Aufklapper**, aus demselben Grund wie die Deckungsliste: Sie gehört
  // zum Üben und stünde außerhalb als Rest einer Tätigkeit, die gerade nicht
  // läuft.
  const fassungKnoten = bau('div', 'stufe-fassung', klappe);
  const fassungMarke = bau('p', 'stufe-fassung-marke leise', fassungKnoten);
  const fassungGewinn = bau('p', 'erklaerung stufe-fassung-gewinn', fassungKnoten);
  const fassungReihe = bau('div', 'datei-reihe stufe-fassung-wahl', fassungKnoten);
  fassungReihe.role = 'group';
  /** Die Schaltflächen der Wahl, nach Fassung. Sie entstehen einmal. */
  const fassungKnoepfe = new Map();

  // Die Deckung als Liste unter dem Stand. Sie steht im Aufklapper, weil sie
  // zum Üben gehört; außerhalb stünde sie beim Lösen als Rest einer Tätigkeit,
  // die gerade nicht läuft.
  const deckungMarke = bau('p', 'stufe-deckung-marke leise', klappe);
  const deckungKnoten = bau('ul', 'stufe-deckung', klappe);
  /** Die Einträge der Deckung, nach Kennung. Sie entstehen einmal je Fallmenge. */
  const deckungEintraege = new Map();
  /** Die Fassungen, für die die Schaltflächen angelegt sind. Wie `deckungFuer`. */
  let fassungFuer = null;
  /**
   * Die Kennungen, für die die Einträge oben angelegt sind.
   *
   * **Und nicht ihre Zahl**, obwohl die kürzer wäre. Zwei Stufen mit gleich
   * vielen Fällen ließen die Einträge der einen für die andere stehen, und
   * `deckungEintraege.get` fände zu keiner Kennung mehr einen Knoten. Heute
   * haben die beiden Stufen mit Fallmenge zehn und sechs Fälle, und mit dem
   * vollen Umfang aus 2A-0021 werden es andere Zahlen sein; sich darauf zu
   * verlassen hieße, eine Aussage über künftige Bestände zu treffen, die
   * niemand geprüft hat.
   */
  let deckungFuer = null;

  const rueckmeldungKnoten = bau('p', 'stufe-rueckmeldung', klappe);
  rueckmeldungKnoten.hidden = true;
  // Die Rückmeldung erscheint während des Übens und nicht auf Anforderung. Wer
  // dabei den Blick am Würfel hat, bekommt sie sonst gar nicht mit.
  rueckmeldungKnoten.setAttribute('role', 'status');

  /** Der zuletzt gezeigte Stand, für die beiden Nachbarschaltflächen. */
  let letzter = null;

  // Auch eine gesperrte Nachbarin wird gewählt, seit 4T-0207.
  function waehleNachbar(richtung) {
    const ziel = letzter?.[richtung];
    if (ziel) handlungen.waehle(ziel.kennung);
  }

  /** Legt die vier Knöpfe der Übersicht an, sobald der Übergang zum ersten Mal steht. */
  function baueUebersicht(stand) {
    if (uebersichtKnoepfe.size === stand.uebersicht.length) return;
    uebersichtKnoten.textContent = '';
    uebersichtKnoepfe.clear();
    for (const eintrag of stand.uebersicht) {
      const element = knopf('stufe-punkt', uebersichtKnoten, () =>
        handlungen.waehle(eintrag.kennung),
      );
      element.textContent = String(eintrag.nummer);
      uebersichtKnoepfe.set(eintrag.kennung, element);
    }
  }

  /**
   * Baut den Text der Stufe aus seinen vier Bausteinen.
   *
   * **Eine Stufe ohne Text zeigt keinen.** `erzeugeTexte` liefert für einen
   * Baustein, den der Sprachbaum nicht kennt, seinen Bezeichner zurück, und ein
   * roher Bezeichner mitten im Bereich wäre für den Anwender schlimmer als eine
   * Lücke. Das ist der Bauzustand bis 4T-0125: Die Stufen 3 und 4 bekommen
   * ihren Text in 3E-0040. **Dass keiner still fehlt, sagt die Prüfstrecke**,
   * die abzählt, wie viele Stufen ihre vier Bausteine tragen; ein Rückfall in
   * der Anzeige kann das nicht leisten, denn er sieht aus wie Absicht.
   *
   * **Entweder alle vier oder keiner.** Eine Stufe mit drei Bausteinen zeigte
   * sonst drei, und die fehlende Aussage fiele niemandem auf.
   */
  function baueLehrtext(stand, text) {
    lehrtextKnoten.textContent = '';
    const bausteine = STUFENBAUSTEINE.map((art) => {
      const bezeichner = `stufe.${stand.kennung}.${art}`;
      return { art, bezeichner, inhalt: text(bezeichner) };
    });
    const vollstaendig = bausteine.every((teil) => teil.inhalt !== teil.bezeichner);
    lehrtextKnoten.hidden = !vollstaendig;
    if (!vollstaendig) return;
    for (const teil of bausteine) {
      for (const inhalt of absaetze(teil.inhalt)) {
        const element = bau('p', 'stufe-lehrabsatz', lehrtextKnoten);
        element.textContent = inhalt;
        element.dataset.baustein = teil.art;
      }
    }
  }

  /**
   * Baut Name, Text und Folgen des vorliegenden Falls.
   *
   * **Ohne Fall bleibt alles leer und ein Satz steht da**, aber nur, wo das
   * Fehlen eine Aussage ist: bei einer Stufe mit Fallmenge. Wo die Stufe eine
   * Denkweise ist, gibt es überhaupt keine Fälle, und ein Satz darüber wäre
   * eine Auskunft über etwas, das dort niemand erwartet.
   */
  function baueFall(stand, text) {
    const fall = stand.fall;
    fallName.hidden = fall === null;
    textKnoten.textContent = '';
    folgenKnoten.textContent = '';

    // Der Hinweis auf den Rückfall, 4T-0172. **Geleert und nicht bloß
    // verborgen**, Lehre 16 in Abschnitt 14.5: Sein Wortlaut sagt, dass dieser
    // Fall noch nicht gelungen ist, und der bliebe sonst im Textbaum stehen,
    // während die Erkennungsübung nach genau diesem Fall fragt.
    rueckfallKnoten.hidden = !stand.rueckfall;
    // **Der Wortlaut steht bei der Stufe und nicht beim Übergang**, seit
    // 4T-0196. Was der geführte Weg leistet, ist je Stufe verschieden: Bei den
    // beiden Stufen der letzten Schicht sind es zwei bekannte Zugfolgen statt
    // einer, bei den ersten beiden Schichten ist es das eigene Einlegen des
    // Paares. Ein gemeinsamer Satz war für die dritte Stufe schlicht unwahr.
    rueckfallKnoten.textContent = stand.rueckfall ? text(`stufe.${stand.kennung}.rueckfall`) : '';
    // **Der Satz sagt, warum dort nichts steht, und die Gründe sind drei.**
    // Bei einer verdeckten Lage ist der Fall bekannt und wird zurückgehalten;
    // sonst ist an dieser Lage entweder nichts zu tun, oder es ist etwas zu tun
    // und der Bestand führt dazu keinen Fall. Der dritte Grund ist seit
    // 4T-0196 eigens benannt und steht bei der Stufe, denn was der Anwender
    // dann tut, ist ihre Sache: bei den ersten beiden Schichten das Paar von
    // Hand einlegen, bei den anderen der Weg über den vollen Umfang.
    ohneFall.textContent = text(
      stand.verdeckt
        ? 'uebergang.verdeckt'
        : stand.nichtHinterlegt
          ? `stufe.${stand.kennung}.ohneHinterlegtenFall`
          : 'uebergang.ohneFall',
    );
    // **Die Bedingung ist gerechnet und kommt aus dem Stand**, seit 4T-0196.
    // Sie stand bis dahin hier und war damit nur als Text zu prüfen; die
    // Begründung steht bei `ohneFallSichtbar` in `stufenstand`.
    ohneFall.hidden = !stand.ohneFallSichtbar;
    if (fall === null) {
      // **Der Name wird geleert und nicht bloß verborgen**, 4T-0139. Am
      // 2026-09-02 an der laufenden Seite mit Beleg gefunden: `hidden` nimmt
      // den Knoten aus der Darstellung und nicht aus dem Dokument, und der
      // alte Wortlaut blieb darin stehen. Beim Stellen einer Erkennungsaufgabe
      // war das die **richtige Antwort**: `setze` zeichnet den Übergang, bevor
      // die Aufgabe gehalten wird, schreibt den Namen der frischen Lage in
      // diesen Knoten, und das Verdecken danach setzte nur `hidden`. Wer den
      // Knoten auslas, gewann jede Aufgabe.
      //
      // **Die Zeile gilt über das Training hinaus.** Ein verborgener Knoten
      // mit altem Inhalt benennt den Fall einer Lage, die es nicht mehr gibt;
      // die beiden Behälter darunter werden aus demselben Grund geleert.
      fallName.textContent = '';
      return;
    }

    fallName.textContent = text(fall.name);
    for (const teil of fall.texte) {
      for (const inhalt of absaetze(text(teil.bezeichner))) {
        const element = bau('p', 'stufe-absatz', textKnoten);
        element.textContent = inhalt;
        element.dataset.baustein = teil.art;
      }
    }

    // Die Hauptfolge zuerst und voll, die Alternativen zurückhaltend daneben.
    // **Beide tragen die Notation auf dem Knopf**, denn zu lernen ist sie
    // selbst; dieselbe Haltung wie bei `pfad.vorfuehrenZug`, wo das Zeichen vor
    // dem Klartext steht. Und die Rolle steht im Text und nicht bloß in der
    // Reihenfolge: Wer allein aus der Stellung schließen müsste, welche Folge
    // die gelernte ist, schlösse falsch, sobald die Reihe umbricht.
    //
    // **Die Klasse `notation` steht am Knopf und nicht im Stilblatt.** Sie ist
    // die vorhandene Verabredung über die Schrift der Zugzeichen, und sie ein
    // zweites Mal über einen Nachfahrensatz zu setzen hieße, dieselbe Aussage
    // an zwei Orten zu führen. Dass sie die zwei Wörter davor mitfasst, ist
    // hingenommen: Der Gegenstand der Schaltfläche ist die Folge.
    const folge = knopf('notation', folgenKnoten, () => handlungen.fuehreVor(fall.folge));
    folge.textContent = text('uebergang.vorfuehren', { folge: fall.folge });
    for (const andere of fall.alternativen) {
      const element = knopf('ruhend notation', folgenKnoten, () => handlungen.fuehreVor(andere));
      element.textContent = text('uebergang.vorfuehrenAlternative', { folge: andere });
    }
  }

  /**
   * Baut die Wahl der Fassung, 4T-0171.
   *
   * **Zwei Schaltflächen, und die geltende ist markiert.** Das ist die Form,
   * die 4T-0147 für die beiden Wege der Zeitnahme gebaut hat, und sie leistet
   * hier zweierlei in einem Griff: Sie schaltet um, und sie zeigt zugleich, in
   * welcher Fassung die Stufe steht. Damit ist AK6 von S-0041 ohne einen
   * zweiten Satz eingelöst. **Verworfen ist die einzelne Schaltfläche** nach
   * dem Muster «auf den vollen Umfang wechseln»: Sie benennt immer nur den
   * Zustand, in dem die Stufe gerade **nicht** ist, und der Anwender müsste aus
   * der Beschriftung rückwärts schließen, wo er steht.
   *
   * **Die Fallzahlen stehen nicht im Sprachbaum, sondern kommen aus der
   * Rechnung.** Eine geschriebene Zahl liefe dem Bestand davon, sobald 3E-0058
   * die siebenundfünfzig Fälle des Orientierens bringt. Dieselbe Vorsicht übt
   * der Text der ersten Stufe seit 4T-0122.
   */
  function baueFassung(stand, text) {
    const wahl = stand.fassung.wahl;
    fassungKnoten.hidden = !stand.fassung.umschaltbar;
    if (!stand.fassung.umschaltbar) {
      // **Geleert und nicht bloß verborgen**, Lehre 16 in Abschnitt 14.5: Ein
      // verborgener Knoten trägt seinen Inhalt weiter, und der Wortlaut einer
      // Stufe stünde sonst im Textbaum einer anderen, die gar nicht umschalten
      // kann.
      fassungReihe.textContent = '';
      fassungKnoepfe.clear();
      // **Die Merkgröße geht mit, und das ist keine Sorgfalt, sondern die
      // Behebung eines gemessenen Fehlers.** Ohne diese Zeile hielt der Bau
      // sich beim Rückweg für erledigt: Wer von der zweiten Stufe zur ersten
      // wechselt, räumt hier die Knöpfe ab; beim Weg zurück stimmt `namen`
      // wieder mit `fassungFuer` überein, der Bau wird übersprungen, und die
      // Schleife darunter greift ins Leere. **Der Wurf fällt dabei nicht auf,
      // sondern die Anzeige bleibt stehen**, denn `zeige` setzt den Titel erst
      // nach den Bau-Schritten. Genau davor warnt der Kommentar bei
      // `deckungFuer`, und die Warnung hat hier gefehlt.
      fassungFuer = null;
      fassungMarke.textContent = '';
      fassungGewinn.textContent = '';
      return;
    }

    fassungMarke.textContent = text('uebergang.fassungMarke');
    // **Der Satz über den Gewinn steht bei der Stufe**, seit 4T-0196 und auf
    // Entscheid des Product Owners vom selben Tag. Er stand bis dahin einmal für
    // alle vier und war am Setzen und am Orientieren entstanden, wo der Ausbau
    // eine Zugfolge an die Stelle zweier setzt. Bei den ersten beiden Schichten
    // ersetzt er nichts, sondern kürzt ab, und der gemeinsame Satz war dort
    // unwahr. AK7 von S-0043 verlangt die Auskunft ausdrücklich je Stufe.
    fassungGewinn.textContent = text(`stufe.${stand.kennung}.fassungGewinn`);

    const namen = wahl.map((eintrag) => eintrag.name).join('|');
    if (namen !== fassungFuer) {
      fassungReihe.textContent = '';
      fassungKnoepfe.clear();
      for (const eintrag of wahl) {
        const element = knopf('stufe-fassung-punkt', fassungReihe, () =>
          handlungen.waehleFassung(eintrag.name),
        );
        fassungKnoepfe.set(eintrag.name, element);
      }
      fassungFuer = namen;
    }

    for (const eintrag of wahl) {
      const element = fassungKnoepfe.get(eintrag.name);
      // **Auch die Beschriftung steht bei der Stufe**, aus demselben Grund wie
      // der Satz darüber und in derselben Bauart: «Geführt: 0 Fälle» wäre bei
      // den ersten beiden Schichten eine Auskunft über einen Mangel, wo in
      // Wahrheit ein anderer Weg steht. Beide Namen wandern gemeinsam, damit
      // hier keine Fallunterscheidung nach der Fassung nötig wird; dieses Modul
      // kennt die Fassungen nicht und soll sie nicht kennen.
      element.textContent = text(`stufe.${stand.kennung}.fassung.${eintrag.name}`, {
        anzahl: eintrag.anzahl,
      });
      element.dataset.gilt = String(eintrag.gilt);
      // **Die geltende Fassung wird markiert und nicht gesperrt.** Ein
      // gesperrter Knopf sähe aus, als sei die Fassung nicht erreichbar; sie
      // ist es gerade. `aria-pressed` sagt der Vorlesehilfe dasselbe, was die
      // Markierung dem Auge sagt.
      element.setAttribute('aria-pressed', String(eintrag.gilt));
    }
  }

  /**
   * Baut die Deckungsliste, also welche Fälle gelungen sind und welche fehlen.
   *
   * **Der Zustand hängt nicht allein an der Darstellung.** Jeder Eintrag trägt
   * ihn zusätzlich im Namen, den die Vorlesehilfe ausgibt; ohne ihn wäre eine
   * Liste aus sechzehn Namen für sie eine Liste aus sechzehn Namen.
   */
  function baueDeckung(stand, text) {
    const faelle = stand.fortschritt.faelle;
    deckungKnoten.hidden = faelle.length === 0;
    deckungMarke.hidden = faelle.length === 0;
    deckungMarke.textContent = text('uebergang.deckungMarke');
    const kennungen = faelle.map((fall) => fall.kennung).join('|');
    if (kennungen !== deckungFuer) {
      deckungKnoten.textContent = '';
      deckungEintraege.clear();
      for (const fall of faelle) {
        deckungEintraege.set(fall.kennung, bau('li', 'stufe-fall-eintrag', deckungKnoten));
      }
      deckungFuer = kennungen;
    }
    for (const fall of faelle) {
      const element = deckungEintraege.get(fall.kennung);
      element.textContent = text(fall.name);
      element.dataset.gelungen = String(fall.gelungen);
      const wortlaut = text(fall.gelungen ? 'uebergang.fallGelungen' : 'uebergang.fallFehlt');
      element.setAttribute('aria-label', `${element.textContent} · ${wortlaut}`);
      element.title = element.getAttribute('aria-label');
    }
  }

  return {
    knoten,

    /**
     * Klappt den Bereich auf oder zu.
     *
     * Nur für den Wechsel der Tätigkeit gedacht, wie beim Lektionsbereich. Wer
     * sie an einen Zustand hängt, der sich nebenbei ändert, nimmt dem Anwender
     * die eigene Wahl wieder weg.
     */
    klappe(offen) {
      klappe.open = offen;
    },

    /**
     * Liegt der Fokus in dem, was der Aufklapper verbirgt?
     *
     * Getrennt von `klappe`, weil die Antwort **vor** allem anderen zu holen
     * ist und nicht erst beim Zuklappen: Wer erst danach fragt, bekommt in
     * jedem Fall «nein» und lässt den Fokus liegen.
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
     * `laeuft` sagt, ob gerade eine Übung dieser Stufe offen ist,
     * `rueckmeldung` trägt Bezeichner und Werte der letzten Meldung oder ist
     * `null`. Beides ist flüchtig und steht deshalb nicht im gerechneten Stand.
     */
    zeige({ stand, text, laeuft = false, rueckmeldung = null }) {
      letzter = stand;
      baueUebersicht(stand);
      baueLehrtext(stand, text);
      baueFall(stand, text);
      baueFassung(stand, text);
      baueDeckung(stand, text);

      // Nummer und Stand nebeneinander, nicht «Stufe 1 von 4»: Die zweite Zahl
      // sagt, wie viele abgeschlossen sind, und das ist eine andere Auskunft
      // als die Stellung im Übergang.
      zaehlung.textContent = `${text('uebergang.zaehlung', {
        nummer: stand.zaehlung.nummer,
      })} · ${text('uebergang.stand', {
        abgeschlossen: stand.zaehlung.abgeschlossen,
        gesamt: stand.zaehlung.gesamt,
      })}`;
      titel.textContent = text(`stufe.${stand.kennung}.titel`);

      for (const eintrag of stand.uebersicht) {
        const element = uebersichtKnoepfe.get(eintrag.kennung);
        // Kein Punkt ist gesperrt, seit 4T-0207; den Zustand tragen
        // `data-zustand` und der vorgelesene Name.
        element.dataset.zustand = eintrag.zustand;
        element.setAttribute('aria-current', String(eintrag.laufend));
        // Der Titel gehört an den Knopf und nicht in eine Legende daneben:
        // Vier Ziffern ohne Namen sind eine Zahlenreihe und kein Weg.
        element.title = `${text(`stufe.${eintrag.kennung}.titel`)} · ${text(
          `uebergang.zustand.${eintrag.zustand}`,
        )}`;
        element.setAttribute('aria-label', element.title);
      }

      knopfVorige.textContent = text('uebergang.vorige');
      knopfNaechste.textContent = text('uebergang.naechste');
      knopfVorige.disabled = stand.vorige === null;
      knopfNaechste.disabled = stand.naechste === null;

      knopfUeben.hidden = !stand.uebung.moeglich;
      knopfUeben.textContent = text(laeuft ? 'uebergang.uebenNeu' : 'uebergang.ueben');
      knopfUeberspringen.hidden = !stand.ueberspringbar;
      knopfUeberspringen.textContent = text('uebergang.ueberspringen');
      knopfEinsteigen.hidden = !stand.einsteigbar;
      knopfEinsteigen.textContent = text('uebergang.einsteigen');

      standKnoten.textContent = standsatz(stand, text);

      rueckmeldungKnoten.hidden = rueckmeldung === null;
      if (rueckmeldung !== null) {
        rueckmeldungKnoten.textContent = text(rueckmeldung.bezeichner, rueckmeldung.werte ?? null);
        rueckmeldungKnoten.dataset.art = rueckmeldung.art ?? 'hinweis';
      }
    },
  };
}
