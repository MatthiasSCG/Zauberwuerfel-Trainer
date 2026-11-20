// Der Trainingsbereich der Oberfläche.
//
// Er trägt die Wahl der Stufe und der Übungsform für das Karteikarten-Training
// aus 2A-0019 und seit 4T-0139 die Erkennungsübung selbst: die Aufgabe, die
// Auswahl aus den Fallnamen und das Urteil, seit 4T-0140 dazu die Merkmale bei
// einem Fehler. Seit 4T-0141 trägt er auch die Ausführungsübung, und die Fläche
// hat dafür kein zweites Mal aufgebrochen werden müssen.
//
// ## Wie der Bereich die beiden Übungsformen auseinanderhält
//
// **Gar nicht, und das ist die Zusage aus seinem letzten Abschnitt.** Er weiß
// nicht, dass es eine Erkennung und eine Ausführung gibt; er weiß, ob der Fall
// **gesucht** oder **gegeben** ist. Das entscheidet das Feld `aufgabe` des
// flüchtigen Übungsstands: Ohne es ist der Fall zu benennen, und die Namen
// stehen zur Wahl; mit ihm ist er genannt, und zu tun ist die Zugfolge.
//
// **Der Wortlaut des Urteils kommt deshalb von außen mit.** Was ein Urteil
// **sagt**, hängt an der Übungsform, und die kennt dieser Bereich nicht; ob es
// ein Erfolg ist, hängt am Urteil selbst und ist von der Form unabhängig.
// Darum trägt das Urteil beides, `bezeichner` für den Wortlaut und `richtig`
// für die Art. Dieselbe Trennung hält `rueckmeldung` im Lektionsbereich seit
// Release 1.
//
// ## Warum die Merkmale hier stehen und nicht im Übergang
//
// **Der Übergang zeigt sie ohnehin, aber nicht verlässlich.** Sobald das
// Urteil gefallen ist, endet seine Verdeckung, und er benennt die liegende
// Lage wieder mitsamt Erkennungsbild. Daran hängen jedoch drei Bedingungen,
// die keine der Anwender festhält: Er zeigt den Fall der **bei ihm** gewählten
// Stufe, die von der Trainingsstufe unabhängig ist; sein Aufklapper kann zu
// sein; und wer nach der Antwort dreht, ändert die Lage und damit den Fall,
// den er nennt.
//
// Die Rückmeldung steht deshalb hier. Sie ist von der Wahl im Übergang, von
// dessen Aufklapper und von jedem weiteren Zug unabhängig.
//
// **Die Fläche hat gehalten, was 3E-0044 versprochen hat.** Die Übung ist
// unter die Wahl getreten, ohne dass an ihr eine Zeile zu ändern war; der
// Segmentschalter, der Umfang und der Hinweis stehen unverändert.
//
// ## Warum die richtige Antwort nicht im gerechneten Stand steht
//
// **Was im Stand steht, steht im Dokument.** Der Bereich schreibt jeden Wert,
// den er bekommt, in Knoten, und ein Wert, den niemand zeichnet, wäre über die
// Entwicklerwerkzeuge trotzdem zu lesen. Die gesuchte Kennung käme damit dem
// Anwender vor die Augen, dem sie verborgen bleiben soll.
//
// `trainingsstand` kennt deshalb die laufende Aufgabe nicht. Was gerade gefragt
// ist und wie das Urteil ausfiel, kommt als flüchtiger Wert an `zeige`, wie
// beim Stufenbereich die Rückmeldung; und die Lösung kommt erst dorthin, **wenn
// sie ohnehin gesagt wird**, also mit dem Urteil.
//
// **Die Namen zur Wahl sind seit 4T-0173 ebenfalls flüchtig**, und das ist die
// Kehrseite derselben Regel. Bis dahin rechnete der Stand den **Vorrat**, also
// alle Fälle der gewählten Stufe, und der war für jede Aufgabe derselbe; die
// gesuchte Kennung stand darin nicht anders da als jede andere. Seit die
// Auswahl gezogen wird, **muss** der gesuchte Fall darin sein, und damit gehört
// sie in den Stand nicht mehr hinein. Sie entsteht mit der Aufgabe in
// `lessons/exercise.js` und kommt denselben Weg wie das Urteil.
//
// ## Warum die Rechnung von der Darstellung getrennt ist
//
// Derselbe Grund wie bei `stufenstand` in `view/stufe.js`: **Welche Stufe
// wählbar ist und welche nicht, fällt am Bild nicht auf.** Ein zu viel
// angebotener Knopf sieht aus wie ein richtiger, und wer ihn drückt, bekäme
// eine Übung ohne Fälle. `trainingsstand` ist deshalb eine reine Funktion und
// ohne Browser vollständig durchzurechnen.
//
// ## Warum nur Stufen mit Fallmenge zur Wahl stehen
//
// Am 2026-08-31 gemessen und in 4T-0138 belegt: Von den vier Stufen des
// Übergangs haben nur die ersten beiden Fälle, zehn und sechs. Die Stufen 3
// und 4 messen nach Abschnitt 11.7 des Didaktik-Konzepts gelungene Anwendungen
// und nicht die Deckung einer Fallmenge; `beginAttempt` in `progress.js` weist
// sie mit `NO_CASES` ab, und `createExercise` liefert für sie `null`.
//
// **Der gesperrte Zustand im Übergang hat einen Sinn, weil die Sperre
// aufgeht.** Bei diesen beiden ginge sie nie auf. Ein Knopf, den niemand je
// drücken kann, ist kein gesperrter Zustand, sondern eine Leerstelle mit
// Beschriftung; entschieden vom Product Owner am 2026-08-31.
//
// **Gefiltert wird hier und nicht in der Verdrahtung.** Die vollständige
// Übersicht kommt herein, und diese Rechnung entscheidet. Nur so ist die Regel
// ohne Browser prüfbar, und nur so erscheint eine Stufe von selbst, sobald der
// Bestand ihr Fälle gibt; eine geschriebene Liste liefe ihm davon.
//
// ## Was dieses Modul nicht kennt
//
// **Weder `lessons` noch `settings`** und kein anderes Modul der Oberfläche,
// wie `view/stufe.js`. Nach Grundsatz 3 der Architektur wird in `app`
// verdrahtet. Die Stufen kommen mit ihren Fällen herein, die Übungsformen mit
// ihren Kennungen, und der Name eines Falls als Bezeichner des Sprachbaums;
// wie eine Übungsform im Modell heißt und wie ein Baustein im Sprachbaum,
// wissen `lessons/exercise.js` und `lessons/cases.js` und nicht dieser Bereich.

/**
 * Der erste Absatz eines Bausteins, also sein Erkennungsmerkmal.
 *
 * **Der Baustein `bild` eines Falls trägt gemessen genau zwei Absätze**, und
 * sie sagen Verschiedenes: Der erste nennt, woran der Fall zu erkennen ist, der
 * zweite, wie vor der Zugfolge auszurichten wäre. Für die Erkennungsübung zählt
 * der erste; der zweite gehört zur Ausführung und stünde hier als Auskunft zu
 * einer Aufgabe, die der Anwender gar nicht hat. Entschieden vom Product Owner
 * am 2026-09-02.
 *
 * **Eine eigene Zerlegung und kein Import von `absaetze`**, das `view/stufe.js`
 * ausführt. Der Kopf dieser Datei sagt zu, kein anderes Modul der Oberfläche zu
 * kennen, und die Zusage für eine Zeile zu brechen wäre der schlechtere Tausch;
 * dieselbe Abwägung trägt `STUFENBAUSTEINE` dort. Gebraucht wird hier ohnehin
 * nur der erste Absatz und nicht die ganze Liste.
 */
export function erkennungsmerkmal(inhalt) {
  return absatzVon(inhalt, 0);
}

/**
 * Der zweite Absatz eines Bausteins, also sein Ausrichtungshinweis, 4T-0142.
 *
 * **Die andere Hälfte desselben Bausteins**, und deshalb steht sie hier und
 * nicht anderswo. Der zweite Absatz von `bild` sagt gemessen, wie vor der
 * Zugfolge auszurichten wäre; 4T-0140 hat ihn für die Erkennung ausdrücklich
 * verworfen und der Ausführung zugewiesen, und dort ist er jetzt fällig.
 *
 * **Er gehört an das Ende eines Fehlversuchs und nicht an den Anfang eines
 * Versuchs.** Vor dem Versuch wäre er ein Teil der Lösung; danach ist er das,
 * was zur Zugfolge noch fehlt, denn die Aufgabenlage ist gestreut und verlangt
 * eine Ausrichtung, die in keiner Folge steht.
 */
export function ausrichtungshinweis(inhalt) {
  return absatzVon(inhalt, 1);
}

/**
 * Ein Absatz eines Bausteins, an seiner Stelle.
 *
 * **Eine Zerlegung für beide** und nicht zwei gleiche mit verschiedenem Index.
 * Ein fehlender Absatz gibt die leere Zeichenkette und wirft nicht: Wer einen
 * Baustein ohne zweiten Absatz anzeigt, hat ein Anzeigeproblem und kein
 * Rechenproblem; dieselbe Haltung trägt `viewSolved` bei einem unbekannten
 * Blick.
 */
function absatzVon(inhalt, stelle) {
  return (inhalt.split(/\n\s*\n/)[stelle] ?? '').trim();
}

/**
 * Die Messwerte einer Stufe, eine Zeile je Fall, 4T-0143.
 *
 * **Eine Zeile je Fall und darin je Übungsform ein Paar, keine Summe.** Wer
 * einen Fall erkennt, ihn aber nicht ausführen kann, hat ein anderes Problem
 * als der umgekehrte Fall, und eine gemeinsame Zahl verlöre genau diese
 * Auskunft. Entschieden vom Product Owner am 2026-09-02.
 *
 * **Verbunden wird über die Kennung und nicht über die Stelle.** Beide Listen
 * kommen heute aus derselben Quelle und in derselben Reihenfolge,
 * `casesForStage` ist `[...casesOf(key)]`; eine Kopplung an die Stelle wäre
 * eine Annahme, die niemand zugesagt hat.
 *
 * **Eine fehlende Liste und ein fehlender Fall sind Befunde und keine Nullen.**
 * Sie können nur aus einem Fehler der Verdrahtung stammen, und ein stiller
 * Rückfall auf null und null sähe aus wie ein nie geübter Fall. Dieselbe
 * Haltung trägt `trainingsstand` bei einer unbekannten Stufe.
 */
function messwerteVon(stufe, formen) {
  const jeForm = formen.map((kennung) => {
    const liste = stufe.messwerte === undefined ? undefined : stufe.messwerte[kennung];
    if (!Array.isArray(liste)) {
      throw new RangeError(`Ohne Messwerte für die Übungsform: ${kennung}`);
    }
    return [kennung, new Map(liste.map((eintrag) => [eintrag.kennung, eintrag]))];
  });
  return stufe.faelle.map((fall) => ({
    kennung: fall.kennung,
    name: fall.name,
    formen: jeForm.map(([kennung, tabelle]) => {
      const wert = tabelle.get(fall.kennung);
      if (wert === undefined) {
        throw new RangeError(`Ohne Messwert für den Fall: ${fall.kennung}`);
      }
      return { kennung, versuche: wert.versuche, fehler: wert.fehler };
    }),
  }));
}

/**
 * Rechnet den Anzeigezustand des Trainingsbereichs.
 *
 * `uebersicht` ist die vollständige Liste der Stufen, je als
 * `{ key, number, unlocked, faelle, messwerte }`, wobei `faelle` die **Fälle**
 * der Stufe sind, je als `{ kennung, name }` mit dem Bezeichner des Namens im
 * Sprachbaum. `formen` sind die Übungsformen in der Reihenfolge der Anzeige,
 * je als Kennung.
 *
 * **`messwerte` trägt je Übungsform die Liste aus `metricsOf`**, seit 4T-0143,
 * und steht an der Stufe und nicht am Fall. Der Grund ist die Rückfallregel
 * darunter: **Welche Stufe gewählt ist, entscheidet erst diese Rechnung**, und
 * die Verdrahtung kann die Messwerte deshalb nicht für die eine gewählte
 * holen. Am Fall stünden sie zudem in `antworten` mit, das eine Kopie jedes
 * Falls in das Dokument gibt.
 *
 * **`faelle` trug bis 4T-0139 die bloße Zahl.** Aus ihr wird jetzt die Liste,
 * weil die Messwerte je Fall einen Namen brauchen und die Zahl in ihr steckt.
 * Zwei Felder für denselben Gegenstand liefen einander früher oder später
 * davon; dieselbe Begründung trägt `stages.js` bei `views`. **Bis 4T-0173 war
 * die Liste zugleich der Vorrat an Antworten**, und der ist seitdem flüchtig.
 *
 * `stufe` und `form` sind die **Wünsche** des Anwenders und keine Zusagen.
 * `stufe` darf auf eine gesperrte Stufe zeigen oder `null` sein; dann fällt
 * die Wahl auf die erste erreichbare. Das ist der Alltag und kein Befund: Beim
 * ersten Aufruf ist keine Stufe frei, und wer eine gewählte Stufe später
 * verliert, kann das nicht.
 *
 * **Eine unbekannte Stufe oder Übungsform ist dagegen sehr wohl ein Befund**,
 * wie im Kern auch. Sie kann nur aus einem Fehler der Verdrahtung stammen, und
 * ein stiller Rückfall sähe aus wie eine getroffene Wahl.
 */
export function trainingsstand({ uebersicht, formen, stufe = null, form = null }) {
  if (!Array.isArray(formen) || formen.length === 0) {
    throw new RangeError('Ohne Übungsform gibt es keine Wahl');
  }
  if (stufe !== null && !uebersicht.some((eintrag) => eintrag.key === stufe)) {
    throw new RangeError(`Unbekannte Stufe: ${stufe}`);
  }
  if (form !== null && !formen.includes(form)) {
    throw new RangeError(`Unbekannte Übungsform: ${form}`);
  }

  const waehlbar = uebersicht.filter((eintrag) => eintrag.faelle.length > 0);
  const erreichbar = waehlbar.filter((eintrag) => eintrag.unlocked);
  // Der Wunsch zählt nur, wenn er auch erreichbar ist. Sonst die erste
  // erreichbare, und ohne eine solche gar keine.
  const gewuenscht = erreichbar.find((eintrag) => eintrag.key === stufe);
  const gewaehlt = gewuenscht ?? erreichbar[0] ?? null;

  // Vorgezogen, weil zwei Felder des Standes daraus entstehen: die Zeilen und
  // die Frage, ob es überhaupt etwas zurückzusetzen gibt. Zweimal gerechnet
  // liefen sie einander früher oder später davon.
  const messwerte = gewaehlt === null ? [] : messwerteVon(gewaehlt, formen);

  return {
    stufen: waehlbar.map((eintrag) => ({
      kennung: eintrag.key,
      nummer: eintrag.number,
      erreichbar: eintrag.unlocked,
      gewaehlt: gewaehlt !== null && eintrag.key === gewaehlt.key,
      faelle: eintrag.faelle.length,
    })),
    gewaehlt: gewaehlt === null ? null : gewaehlt.key,
    formen: formen.map((kennung) => ({ kennung, gewaehlt: kennung === (form ?? formen[0]) })),
    form: form ?? formen[0],
    // **Das Feld `antworten` ist mit 4T-0173 weggefallen.** Es trug den
    // vollständigen Fallbestand der gewählten Stufe, entschieden vom Product
    // Owner am 2026-09-02. Seit die Auswahl gezogen wird und den gesuchten Fall
    // enthalten muss, gehört sie nicht mehr in den gerechneten Stand; die
    // Begründung steht im Kopf dieser Datei. Sie kommt als flüchtiger Wert an
    // `zeige`, und zwar auch dort, wo sie der ganze Vorrat ist: Zwei Wege zur
    // Antwortliste wären zwei Gelegenheiten, verschieden zu ziehen.
    //
    // Die Messwerte je Fall, 4T-0143. **Sie sind damit die einzige Liste über
    // Fälle, die der Stand noch führt**, und das ist richtig so: Sie sind eine
    // Auskunft über die Wahl und nicht die Schaltflächen einer Aufgabe.
    messwerte,
    // Ob es überhaupt etwas zurückzusetzen gibt, 4T-0144. **Gerechnet und
    // nicht am Bild abgelesen**, aus demselben Grund wie die Wahl der Stufen:
    // Eine Schaltfläche, die nichts bewirkt, sieht aus wie eine, die etwas
    // bewirkt, und wer sie drückte, bekäme eine Rückfrage über nichts.
    messwerteGebucht: messwerte.some((zeile) => zeile.formen.some((form) => form.versuche > 0)),
    // **Der Umfang war bis 4T-0139 die einzige Wirkung der Wahl** und ist
    // deshalb gerechnet und nicht abgelesen. Er bleibt, obwohl die Übung ihn
    // nicht mehr braucht: Er sagt vor dem ersten Druck, was den Anwender
    // erwartet, und das ist eine eigene Auskunft und keine Ersatzanzeige.
    umfang: gewaehlt === null ? null : { nummer: gewaehlt.number, faelle: gewaehlt.faelle.length },
    // Keine einzige Stufe erreichbar. Das ist der Zustand beim ersten Aufruf
    // und kein Fehler; die Wahl steht trotzdem da, damit der Anwender sieht,
    // was ihn erwartet.
    gesperrt: erreichbar.length === 0,
  };
}

/**
 * Baut den Trainingsbereich und liefert seine Bedienung.
 *
 * `handlungen` trägt sieben Rückrufe: `waehleStufe(kennung)`, `waehleForm(kennung)`,
 * `stelleAufgabe()`, `antworte(kennung)`, `gibAuf()`, `wiederhole()` und, seit
 * 4T-0144, `setzeZurueck()`. Keiner liefert etwas zurück; was daraus folgt,
 * kommt beim nächsten `zeige` wieder herein.
 *
 * **Die Ankündigung vor dem Zurücksetzen gehört nicht hierher.** Sie nennt die
 * Stufe beim Namen und ist eine Entscheidung über den Fortschritt; beides
 * gehört der Verdrahtung, wie beim Löschen des Fortschritts seit 4T-0084.
 */
export function erzeugeTrainingsbereich(dokument, handlungen) {
  const knoten = dokument.createElement('div');
  knoten.className = 'training';

  const bau = (art, klasse, elternteil) => {
    const element = dokument.createElement(art);
    element.className = klasse;
    elternteil.append(element);
    return element;
  };

  /** Legt eine Schaltfläche an und hängt ihren Rückruf ein. */
  const knopf = (elternteil, handlung) => {
    const element = dokument.createElement('button');
    element.type = 'button';
    element.addEventListener('click', handlung);
    elternteil.append(element);
    return element;
  };

  // Zwei Segmentschalter und keine eigene Bauform. Der Bestand führt sie seit
  // 4T-0025 für die Palette und die Ansicht, und sie sind genau das, was hier
  // gebraucht wird: genau eine von wenigen Möglichkeiten, über `aria-pressed`
  // angesagt. **Ein Auswahlfeld wäre die Bauform der Einstellungen**, und die
  // werden einmal gewählt; diese Wahl wechselt beim Üben.
  const stufeMarke = bau('p', 'training-marke leise', knoten);
  const stufenKnoten = bau('div', 'segmente training-stufen', knoten);
  stufenKnoten.role = 'group';
  /** Die Segmente der Stufenwahl, nach Kennung. Sie entstehen je Stufenmenge. */
  const stufenSegmente = new Map();
  /**
   * Die Kennungen, für die die Segmente oben angelegt sind.
   *
   * **Und nicht ihre Zahl**, aus demselben Grund, den `view/stufe.js` bei der
   * Deckungsliste nennt: Zwei gleich große Mengen ließen die Segmente der
   * einen für die andere stehen, und `get` fände zu keiner Kennung mehr einen
   * Knoten.
   */
  let stufenFuer = null;

  const formMarke = bau('p', 'training-marke leise', knoten);
  const formenKnoten = bau('div', 'segmente', knoten);
  formenKnoten.role = 'group';
  /** Die Segmente der Formwahl, nach Kennung. Sie entstehen einmal. */
  const formSegmente = new Map();

  const umfangKnoten = bau('p', 'training-umfang', knoten);

  // Die Erkennungsübung, 4T-0139. **Sie steht zwischen dem Umfang und dem
  // Hinweis.** Der Umfang gehört zur Wahl darüber und beantwortet sie, der
  // Hinweis ist die Fußnote des ganzen Bereichs; die Tätigkeit gehört
  // dazwischen und nicht unter eine Fußnote.
  const uebungKnoten = bau('div', 'datei-reihe training-uebung', knoten);
  const knopfAufgabe = knopf(uebungKnoten, () => handlungen.stelleAufgabe());
  // Das Aufgeben, 4T-0141. **Es steht neben dem Stellen und nicht unter den
  // Zügen**, denn es gehört zur Aufgabe und nicht zum Würfel. Es erscheint
  // allein zu einer laufenden Ausführungsaufgabe: Bei der Erkennung steht die
  // Antwort zur Wahl, und wer nicht weiß, rät; bei der Ausführung gibt es
  // keine Wahl, und ohne diesen Weg endete ein misslungener Versuch nie.
  const knopfAufgeben = knopf(uebungKnoten, () => handlungen.gibAuf());
  // Die Wiederholung, 4T-0142. **Sie steht in derselben Reihe wie das Stellen
  // und das Aufgeben**, denn alle drei tun dasselbe an derselben Sache: eine
  // Aufgabe anfangen, abbrechen, noch einmal anfangen. Sie erscheint nur zu
  // einer stehenden Auskunft, also nach einem Fehlversuch der Ausführung.
  const knopfWiederholen = knopf(uebungKnoten, () => handlungen.wiederhole());

  const frageKnoten = bau('p', 'training-frage', knoten);
  const antwortKnoten = bau('div', 'training-antworten', knoten);
  // Eine Gruppe und keine Liste: Die Einträge sind Schaltflächen und keine
  // Aufzählung. Ihr Name kommt in `zeige` aus derselben Frage, die darüber
  // steht; ein zweiter Wortlaut liefe ihr davon.
  antwortKnoten.role = 'group';

  const urteilKnoten = bau('p', 'training-urteil', knoten);
  // Wie die Rückmeldung des Stufenbereichs: Sie erscheint während des Übens,
  // und wer dabei den Blick am Würfel hat, bekäme sie sonst gar nicht mit.
  urteilKnoten.setAttribute('role', 'status');

  // Die Merkmale bei einem Fehler, 4T-0140. **Zwei feste Blöcke und keine
  // erzeugte Liste**: Es sind gemessen entweder keine oder genau zwei, der
  // gesuchte Fall und der genannte. Eine Liste, die zwischen null und zwei
  // Einträgen schwankt, brächte einen Knotenwechsel für einen Fall, den es
  // nicht gibt.
  const merkmalKnoten = bau('div', 'training-merkmale', knoten);
  const merkmalBloecke = ['gesucht', 'genannt'].map((rolle) => {
    const huelle = bau('div', 'training-merkmal', merkmalKnoten);
    huelle.dataset.rolle = rolle;
    return {
      rolle,
      huelle,
      marke: bau('p', 'training-merkmal-marke', huelle),
      text: bau('p', 'training-merkmal-text', huelle),
    };
  });

  // Die Auskunft nach einem Fehlversuch der Ausführung, 4T-0142. **Sie steht
  // unter den Merkmalen und nicht an ihrer Stelle**, obwohl beide nie zugleich
  // erscheinen: Die Merkmale gehören zur Erkennung, diese zur Ausführung, und
  // zwei Gegenstände in einem Knoten hießen, ihre Wortlaute auseinanderzuhalten
  // statt ihre Knoten.
  const auskunftKnoten = bau('div', 'training-auskunft', knoten);
  const folgeMarke = bau('p', 'training-auskunft-marke', auskunftKnoten);
  // Die Notationsschrift wie überall, wo Züge stehen. Sie trennt die Folge vom
  // Fließtext darunter, und in ihr sind Apostroph und Zwei nicht zu verlesen.
  const folgeKnoten = bau('p', 'training-folge notation', auskunftKnoten);
  const ausrichtungMarke = bau('p', 'training-auskunft-marke', auskunftKnoten);
  const ausrichtungKnoten = bau('p', 'training-ausrichtung', auskunftKnoten);

  // Die Messwerte je Fall, 4T-0143. **Sie stehen unter der Übung und über dem
  // Hinweis.** Der Hinweis ist die Fußnote des ganzen Bereichs und bleibt
  // unten; über der Übung schöbe die Liste diese um ihre eigene Höhe nach
  // unten, und dann wäre die Auskunft im Blick und das Tun nicht mehr.
  //
  // **Ein Aufklapper, zugeklappt als Vorgabe**, entschieden vom Product Owner
  // am 2026-09-02 bei der Abnahme. Die Vorlage hatte ihn offen vorgesehen und
  // dafür rund 280 px veranschlagt; gemessen sind es 320 px, und der Bereich
  // stand damit in Ruhe bei 707 px statt 363 px. **Die Marke bleibt sichtbar
  // und lädt ein**, und wer die Zahlen sucht, findet sie mit einem Griff.
  //
  // **Der Zustand wird hier nicht gesetzt und in `zeige` nicht angefasst**, wie
  // beim Stufenbereich seit 4T-0060: Ein Aufklapper, den das Zeichnen
  // mitsetzte, ginge wieder zu, sobald der Anwender ihn geöffnet hat. Genau
  // deshalb steht hier auch kein `open = false`; die Vorgabe eines `details`
  // ist zu, und eine Zeile, die sie wiederholt, sähe wie eine Setzung aus.
  const messwerteKlappe = bau('details', 'klappe training-messwerte', knoten);
  const messwerteMarke = dokument.createElement('summary');
  messwerteKlappe.append(messwerteMarke);
  const messwerteTitel = bau('h3', 'training-messwerte-marke', messwerteMarke);
  // Die Erklärung sagt, was die beiden Zahlen einer Zelle bedeuten. Ohne sie
  // wäre «3 / 1» eine Schreibweise, die der Anwender erraten müsste.
  const messwerteErklaerung = bau('p', 'erklaerung', messwerteKlappe);

  // **Eine Tabelle und keine Liste**, anders als die Deckung im Übergang. Dort
  // trägt ein Fall einen Zustand, hier vier Zahlen in zwei benannten Spalten;
  // das ist der Gegenstand, für den es Tabellen gibt. Eine Liste müsste die
  // Zuordnung in jedem der zehn Einträge wiederholen, im Bild wie im
  // vorgelesenen Namen, und die Vorlesehilfe bekäme sie nicht von selbst.
  // Der Rollbereich um die Tabelle, 4T-0174. **Er ist ein eigener Knoten und
  // keine Regel an der Tabelle**, und das ist gemessen und nicht gewählt: Eine
  // Tabelle mit `display: block` rollt zwar, verliert dabei aber `table-layout:
  // fixed`, weil `thead` und `tbody` zu anonymen Boxen werden und die
  // Spaltenaufteilung der ersten Zeile nicht mehr gilt. Genau diese Aufteilung
  // hält seit 4T-0143 jeden Fallnamen einzeilig. Der Rahmen rollt, die Tabelle
  // bleibt eine Tabelle, und die Kopfzeile bleibt über dem Rollen stehen.
  const messwerteRahmen = bau('div', 'training-messwerte-rahmen', messwerteKlappe);
  const messwerteTabelle = bau('table', 'training-messwerte-tabelle', messwerteRahmen);
  const messwerteKopfteil = dokument.createElement('thead');
  const messwerteKopf = dokument.createElement('tr');
  messwerteKopfteil.append(messwerteKopf);
  const messwerteRumpf = dokument.createElement('tbody');
  messwerteTabelle.append(messwerteKopfteil, messwerteRumpf);
  /** Die Kopfzelle der ersten Spalte. Sie steht fest, weil es immer Fälle sind. */
  const messwerteFallKopf = dokument.createElement('th');
  messwerteFallKopf.scope = 'col';
  messwerteKopf.append(messwerteFallKopf);
  /** Die Kopfzellen der Übungsformen, nach Kennung. Sie entstehen je Formmenge. */
  const messwerteFormKoepfe = new Map();
  /** Die Zeilen, nach Fallkennung, je als `{ name, zellen }`. */
  const messwerteZeilen = new Map();
  /**
   * Die Kennungen, für die die Zeilen oben angelegt sind.
   *
   * **Fälle und Übungsformen zusammen**, denn beide bestimmen den Bau: die
   * Fälle die Zeilen, die Formen die Zellen darin. Ein Schlüssel aus den
   * Fällen allein ließe die Zellen einer alten Formmenge stehen.
   */
  let messwerteFuer = null;

  // Das Zurücksetzen, 4T-0144. **Es steht unter der Liste und in derselben
  // Klappe**, denn was es löscht, ist das, was darüber steht. Im Bereich
  // «Bedienung» stünde es zwei Bereiche entfernt von der Stufe, die es trifft.
  //
  // **In einer Reihe wie die Schaltflächen der Übung**, obwohl es nur eine ist:
  // `.datei-reihe` trägt im Bestand den Abstand nach oben und die Ausrichtung,
  // und eine zweite Bauform für dieselbe Lage müsste der Anwender lernen.
  const zuruecksetzenReihe = bau('div', 'datei-reihe training-zuruecksetzen', messwerteKlappe);
  const knopfZuruecksetzen = knopf(zuruecksetzenReihe, () => handlungen.setzeZurueck());
  knopfZuruecksetzen.className = 'ruhend';

  const hinweisKnoten = bau('p', 'erklaerung', knoten);

  /** Die Schaltflächen der Antwort, nach Kennung. Sie entstehen je Auswahl. */
  const antwortSchaltflaechen = new Map();
  /**
   * Die Kennungen, für die die Schaltflächen oben angelegt sind.
   *
   * **Und nicht ihre Zahl**, aus demselben Grund wie bei den Segmenten der
   * Stufenwahl: Zwei gleich große Fallmengen ließen die Schaltflächen der
   * einen für die andere stehen, und `get` fände zu keiner Kennung mehr einen
   * Knoten. Hier wöge das schwerer als dort, denn der Rückruf trüge dann die
   * Kennung der anderen Stufe und der Anwender bekäme ein Urteil über eine
   * Antwort, die er nicht gegeben hat.
   *
   * **Seit 4T-0173 wiegt es noch schwerer**, denn zwei Auswahlen sind jetzt
   * fast immer gleich groß: Jede zieht sechs. Ohne die Kennungen im Schlüssel
   * bekäme der Anwender die Namen der vorigen Aufgabe zu sehen.
   */
  let antwortenFuer = null;

  function baueStufen(stand, text) {
    const kennungen = stand.stufen.map((eintrag) => eintrag.kennung).join('|');
    if (kennungen !== stufenFuer) {
      stufenKnoten.textContent = '';
      stufenSegmente.clear();
      for (const eintrag of stand.stufen) {
        stufenSegmente.set(
          eintrag.kennung,
          knopf(stufenKnoten, () => handlungen.waehleStufe(eintrag.kennung)),
        );
      }
      stufenFuer = kennungen;
    }
    for (const eintrag of stand.stufen) {
      const element = stufenSegmente.get(eintrag.kennung);
      element.textContent = text(`stufe.${eintrag.kennung}.titel`);
      element.disabled = !eintrag.erreichbar;
      element.setAttribute('aria-pressed', String(eintrag.gewaehlt));
      // Die Nummer steht im vorgelesenen Namen und nicht auf dem Segment. Sie
      // ordnet die Stufe in den Übergang ein, und der Titel sagt, worum es
      // geht; auf dem Segment stünde sie vor jedem Titel und trüge nichts bei.
      const zustand = text(eintrag.erreichbar ? 'training.frei' : 'training.nochGesperrt');
      element.setAttribute(
        'aria-label',
        `${text('uebergang.zaehlung', { nummer: eintrag.nummer })}, ${element.textContent}, ${zustand}`,
      );
      element.title = element.getAttribute('aria-label');
    }
  }

  function baueFormen(stand, text) {
    if (formSegmente.size !== stand.formen.length) {
      formenKnoten.textContent = '';
      formSegmente.clear();
      for (const eintrag of stand.formen) {
        formSegmente.set(
          eintrag.kennung,
          knopf(formenKnoten, () => handlungen.waehleForm(eintrag.kennung)),
        );
      }
    }
    for (const eintrag of stand.formen) {
      const element = formSegmente.get(eintrag.kennung);
      element.textContent = text(`training.form.${eintrag.kennung}`);
      element.setAttribute('aria-pressed', String(eintrag.gewaehlt));
    }
  }

  /**
   * Baut die Schaltflächen, aus denen der Anwender den Fall benennt, 4T-0173.
   *
   * `auswahl` ist die Liste zur laufenden Erkennungsaufgabe, je als
   * `{ kennung, name }`, oder `null`, wo nichts zu benennen ist: keine Aufgabe,
   * oder eine Ausführungsaufgabe, bei der der Fall genannt ist.
   *
   * **Sie entstehen jetzt mit der Aufgabe und nicht mehr mit der Fallmenge.**
   * Bis 4T-0173 war der Vorrat für jede Aufgabe derselbe, und der Neuaufbau
   * unterblieb deshalb fast immer; seit die Auswahl gezogen wird, wechselt sie
   * mit jeder Frage. Der Bildlauf, den ein Neuaufbau damals zurückgesetzt
   * hätte, ist mit der kurzen Liste kein Thema mehr.
   *
   * **Ohne Auswahl wird geleert und nicht bloß verborgen**, nach der Lehre aus
   * 4T-0139 und 4T-0141: Ein verborgener Knoten trägt seinen Inhalt weiter,
   * und stehengebliebene Namen gehörten zu einer Aufgabe, die vorbei ist. Sie
   * verzerrten zudem die Gleichverteilung, an der sich messen lässt, dass die
   * Anzeige die laufende Aufgabe nicht verrät.
   */
  function baueAntworten(auswahl, text) {
    const eintraege = auswahl ?? [];
    const kennungen = eintraege.map((eintrag) => eintrag.kennung).join('|');
    if (kennungen !== antwortenFuer) {
      antwortKnoten.textContent = '';
      antwortSchaltflaechen.clear();
      for (const eintrag of eintraege) {
        const element = knopf(antwortKnoten, () => handlungen.antworte(eintrag.kennung));
        // Die Kennung am Knoten, damit sich von Hand prüfen lässt, welche
        // Antwort gegeben wurde, ohne den Wortlaut der Sprache zu kennen.
        // **Sie verrät nichts:** Jede Schaltfläche trägt ihre eigene, und
        // welche gesucht ist, steht an keiner.
        element.dataset.fall = eintrag.kennung;
        antwortSchaltflaechen.set(eintrag.kennung, element);
      }
      antwortenFuer = kennungen;
    }
    for (const eintrag of eintraege) {
      antwortSchaltflaechen.get(eintrag.kennung).textContent = text(eintrag.name);
    }
  }

  /**
   * Baut die Messwerte je Fall, 4T-0143.
   *
   * **Der Zustand steht im vorgelesenen Namen und nicht nur im Bild**, wie bei
   * der Deckungsliste: «3 / 1» liest die Vorlesehilfe als drei Schrägstrich
   * eins, und die Spaltenzuordnung allein sagt nicht, welche Zahl was ist.
   *
   * **Ohne gewählte Stufe gibt es nichts zu zeigen.** Die Tabelle wird dann
   * verborgen, und ihre Zeilen fallen dabei von selbst weg: Der Schlüssel
   * wechselt auf die leere Fallmenge, und der Rumpf wird geleert. Das ist die
   * Lehre aus 4T-0139 an dieser Stelle, ohne eine eigene Zeile dafür.
   */
  function baueMesswerte(stand, text) {
    messwerteKlappe.hidden = stand.messwerte.length === 0;
    messwerteTitel.textContent = text('training.messwerteMarke');
    messwerteErklaerung.textContent = text('training.messwerteErklaerung');
    messwerteFallKopf.textContent = text('training.messwerteFall');

    if (messwerteFormKoepfe.size !== stand.formen.length) {
      // Die feste erste Kopfzelle bleibt stehen, deshalb wird einzeln entfernt
      // und nicht die ganze Zeile geleert.
      for (const element of messwerteFormKoepfe.values()) element.remove();
      messwerteFormKoepfe.clear();
      for (const eintrag of stand.formen) {
        const zelle = dokument.createElement('th');
        zelle.scope = 'col';
        messwerteKopf.append(zelle);
        messwerteFormKoepfe.set(eintrag.kennung, zelle);
      }
    }
    for (const eintrag of stand.formen) {
      messwerteFormKoepfe.get(eintrag.kennung).textContent = text(
        `training.form.${eintrag.kennung}`,
      );
    }

    const kennungen = [
      stand.formen.map((eintrag) => eintrag.kennung).join(','),
      stand.messwerte.map((eintrag) => eintrag.kennung).join(','),
    ].join(' · ');
    if (kennungen !== messwerteFuer) {
      messwerteRumpf.textContent = '';
      messwerteZeilen.clear();
      for (const eintrag of stand.messwerte) {
        const zeile = dokument.createElement('tr');
        // Die Kennung am Knoten, damit sich von Hand prüfen lässt, welche Zeile
        // welchen Fall trägt, ohne den Wortlaut der Sprache zu kennen. **Sie
        // verrät nichts**, wie bei den Antwortschaltflächen: Jede Zeile trägt
        // ihre eigene, und welcher Fall gesucht ist, steht an keiner.
        zeile.dataset.fall = eintrag.kennung;
        const name = dokument.createElement('th');
        name.scope = 'row';
        name.className = 'training-messwert-name';
        zeile.append(name);
        const zellen = new Map();
        for (const form of eintrag.formen) {
          const zelle = dokument.createElement('td');
          zelle.className = 'training-messwert-zahlen';
          zelle.dataset.form = form.kennung;
          zeile.append(zelle);
          zellen.set(form.kennung, zelle);
        }
        messwerteRumpf.append(zeile);
        messwerteZeilen.set(eintrag.kennung, { name, zellen });
      }
      messwerteFuer = kennungen;
    }
    for (const eintrag of stand.messwerte) {
      const zeile = messwerteZeilen.get(eintrag.kennung);
      zeile.name.textContent = text(eintrag.name);
      for (const form of eintrag.formen) {
        const zelle = zeile.zellen.get(form.kennung);
        const leer = form.versuche === 0;
        // **Im Bild ein Strich, im vorgelesenen Namen der Wortlaut.** Beim
        // ersten Aufruf ist jeder der zehn Fälle ungeübt, und zehnmal «noch
        // nicht geübt» untereinander wäre eine Wand aus Wiederholung; der
        // Strich sagt dasselbe auf einen Blick, und die Auskunft steht
        // vollständig im Namen und im Titel.
        //
        // **Die Zahlen kommen als Wortlaut und nicht über den Sprachbaum**, wie
        // die Zugfolge seit 4T-0142: Ziffern und Schrägstrich sind in beiden
        // Sprachen dieselben, und ein Baustein dafür hätte in der einen stehen
        // können, was in der anderen fehlt.
        zelle.textContent = leer ? '—' : `${form.versuche} / ${form.fehler}`;
        const wortlaut = leer
          ? text('training.messwertLeer')
          : text('training.messwertGelesen', { versuche: form.versuche, fehler: form.fehler });
        zelle.setAttribute('aria-label', wortlaut);
        zelle.title = wortlaut;
      }
    }

    // Das Zurücksetzen, 4T-0144. **Es ist gesperrt, solange nichts gebucht
    // ist.** Ohne Sperre führte der Griff zu einer Rückfrage über nichts, und
    // wer sie bestätigte, bekäme keine Veränderung zu sehen; dieselbe Haltung
    // trägt die Wahl einer Stufe ohne Fälle.
    //
    // **Der Grund steht im vorgelesenen Namen und im Titel**, denn eine
    // Schaltfläche, die sich nicht drücken lässt, sagt für sich genommen nicht,
    // warum. Dieselbe Bauform wie bei den Segmenten der Stufenwahl.
    knopfZuruecksetzen.textContent = text('training.zuruecksetzen');
    knopfZuruecksetzen.disabled = !stand.messwerteGebucht;
    const zustand = text(
      stand.messwerteGebucht ? 'training.zuruecksetzenBereit' : 'training.zuruecksetzenLeer',
    );
    knopfZuruecksetzen.setAttribute('aria-label', `${knopfZuruecksetzen.textContent}, ${zustand}`);
    knopfZuruecksetzen.title = knopfZuruecksetzen.getAttribute('aria-label');
  }

  /**
   * Zeigt die Übung in einem ihrer vier Zustände.
   *
   * `uebung` ist `null`, wo die getroffene Wahl nichts zu üben gibt, sonst
   * `{ laeuft, urteil, aufgabe, auswahl }`. Daraus entstehen: keine Übung,
   * bereit, laufende Aufgabe, beurteilt.
   *
   * **`auswahl` trägt seit 4T-0173 die Namen zur Wahl**, je als
   * `{ kennung, name }`, und ist `null`, wo nichts zu benennen ist.
   *
   * **`aufgabe` entscheidet, ob der Fall gesucht oder gegeben ist.** Ohne sie
   * ist er zu benennen, und die Namen stehen zur Wahl; mit ihr trägt sie den
   * Bezeichner seines Namens, die Aufforderung nennt ihn, und zu tun ist die
   * Zugfolge. Der Bereich braucht dafür keine der beiden Übungsformen zu
   * kennen; die Begründung steht im Kopf dieser Datei.
   *
   * **Die Aufforderung und die Antworten erscheinen zusammen und gehen
   * zusammen.** Eine Antwortliste ohne Frage wäre eine Liste von Namen ohne
   * Anlass, und eine Frage ohne Liste eine Aufforderung ohne Weg.
   */
  function zeigeUebung(stand, text, uebung) {
    const laeuft = uebung !== null && uebung.laeuft;
    const urteil = uebung === null ? null : uebung.urteil;
    const aufgabe = uebung === null ? null : (uebung.aufgabe ?? null);

    // Die Namen zur Wahl, 4T-0173. **Sie stehen hier und nicht mehr neben den
    // anderen Bauschritten**, denn sie gehören zur laufenden Aufgabe und nicht
    // zum gerechneten Stand. Vor der Sichtbarkeit gebaut, denn ein Knoten wird
    // verborgen, nachdem sein Inhalt steht, und nicht davor.
    baueAntworten(uebung === null ? null : (uebung.auswahl ?? null), text);

    uebungKnoten.hidden = uebung === null;
    // Drei Beschriftungen für eine Schaltfläche, weil sie drei Sachen tut:
    // anfangen, überspringen, weitermachen. Ein Wortlaut für alle drei sagte
    // dem Anwender bei der zweiten und dritten nicht, was ihn erwartet.
    knopfAufgabe.textContent = text(
      laeuft
        ? 'training.andereAufgabe'
        : urteil === null
          ? 'training.aufgabeStellen'
          : 'training.naechsteAufgabe',
    );

    knopfAufgeben.hidden = !laeuft || aufgabe === null;
    knopfAufgeben.textContent = text('training.aufgeben');

    // Die Auskunft nach einem Fehlversuch, 4T-0142. **Sie steht oder steht
    // nicht, und dazwischen gibt es nichts**: Die Verdrahtung liefert sie nur
    // zu einem misslungenen Versuch der Ausführung, und diese Stelle richtet
    // sich danach, statt das Urteil ein zweites Mal zu deuten. Dieselbe
    // Arbeitsteilung wie bei den Merkmalen seit 4T-0140.
    const auskunft = urteil?.auskunft ?? null;
    auskunftKnoten.hidden = auskunft === null;
    knopfWiederholen.hidden = auskunft === null;
    knopfWiederholen.textContent = text('training.wiederholen');
    if (auskunft === null) {
      // Geleert und nicht bloß verborgen, nach der Lehre aus 4T-0139 und
      // 4T-0141: Die Folge gehört zu einem Fall, und nach der nächsten Aufgabe
      // wäre sie die Lösung eines anderen.
      folgeMarke.textContent = '';
      folgeKnoten.textContent = '';
      ausrichtungMarke.textContent = '';
      ausrichtungKnoten.textContent = '';
    } else {
      folgeMarke.textContent = text('training.folgeMarke');
      // **Die Züge kommen als Wortlaut und nicht über den Sprachbaum.**
      // Notation ist in beiden Sprachen dieselbe; ein Baustein dafür hätte in
      // der einen stehen können, was in der anderen fehlt.
      folgeKnoten.textContent = auskunft.folge;
      ausrichtungMarke.textContent = text('training.ausrichtungMarke');
      ausrichtungKnoten.textContent = ausrichtungshinweis(text(auskunft.bild));
    }

    // **Geleert und nicht bloß verborgen**, nach der Lehre aus 4T-0139. Bei
    // einer Ausführungsaufgabe trägt diese Zeile den Namen des Falls, und ein
    // stehengebliebener Wortlaut spräche von einer Aufgabe, die längst vorbei
    // ist. Dass er dabei nichts verrät, entlastet nicht: Die Zeile ist die
    // einzige, die den Anwender auf seine laufende Aufgabe hinweist.
    frageKnoten.hidden = !laeuft;
    frageKnoten.textContent = !laeuft
      ? ''
      : aufgabe === null
        ? text('training.frage')
        : text('training.auftrag', { name: text(aufgabe.name) });

    // Die Namen stehen zur Wahl, wo der Fall gesucht ist. Wo er genannt wurde,
    // wäre die Liste die Antwort auf eine Frage, die niemand gestellt hat.
    antwortKnoten.hidden = !laeuft || aufgabe !== null;
    // **Der Name der Gruppe ist die Frage der Erkennung und nicht die Zeile
    // darüber**, seit 4T-0141. Bis dahin waren beide dasselbe; seit es die
    // Ausführung gibt, steht dort zeitweise eine Aufforderung, die zu dieser
    // Liste nicht passt, und in den Zwischenständen gar nichts.
    antwortKnoten.setAttribute('aria-label', text('training.frage'));

    // **Die Merkmale erscheinen allein bei einem Fehler**, entschieden vom
    // Product Owner am 2026-09-02. Wer richtig geantwortet hat, hat das Merkmal
    // erkannt; es ihm trotzdem vorzuhalten machte aus der Bestätigung eine
    // Belehrung. Die Verdrahtung liefert deshalb eine leere Liste, und diese
    // Stelle richtet sich danach, statt das Urteil ein zweites Mal zu deuten.
    const merkmale = urteil?.merkmale ?? [];
    merkmalKnoten.hidden = merkmale.length === 0;
    for (const [i, block] of merkmalBloecke.entries()) {
      const merkmal = merkmale[i] ?? null;
      block.huelle.hidden = merkmal === null;
      if (merkmal === null) {
        // Geleert und nicht bloß verborgen, 4T-0139: `hidden` nimmt einen
        // Knoten aus der Darstellung und nicht aus dem Dokument, und ein alter
        // Wortlaut spräche von einer Aufgabe, die längst vorbei ist.
        block.marke.textContent = '';
        block.text.textContent = '';
        continue;
      }
      block.marke.textContent = text(`training.merkmal.${merkmal.rolle}`, {
        name: text(merkmal.name),
      });
      block.text.textContent = erkennungsmerkmal(text(merkmal.bild));
    }

    urteilKnoten.hidden = urteil === null;
    if (urteil === null) {
      // **Geleert und nicht bloß verborgen**, 4T-0141. Die Lehre stammt aus
      // 4T-0139 und war an dieser Stelle noch nicht angewandt; aufgefallen ist
      // sie bei der Messung an der laufenden Seite, und zwar an derselben
      // Gleichverteilung, die dort den Beleg geführt hat: Nach einem
      // aufgegebenen Versuch stand ein Fallname neunmal viermal und einmal
      // fünfmal im Dokument.
      //
      // **Die Antwort verrät der alte Wortlaut nicht**, denn er nennt den Fall
      // der **vorigen** Aufgabe. Er benennt aber eine Aufgabe, die vorbei ist,
      // und wer die Häufigkeit auszählt, bekommt ein Signal, das in die Irre
      // führt. Beides sind Gründe zu leeren, und der zweite ist der ältere:
      // Ein Knoten, der etwas behauptet, das nicht mehr gilt, ist schlimmer
      // als ein leerer.
      urteilKnoten.textContent = '';
      urteilKnoten.removeAttribute('data-art');
    } else {
      // **Der Name des Falls steht in jedem Urteil.** Bei einem Fehler ist er
      // die Auskunft, die zählt; bei einem Treffer bestätigt er, worauf der
      // Anwender getippt hat, und ein bloßes «richtig» ließe offen, ob das
      // Programm dieselbe Frage meinte.
      //
      // **Der Wortlaut kommt mit, die Art wird gerechnet**, 4T-0141. Die
      // Begründung steht im Kopf dieser Datei.
      urteilKnoten.textContent = text(urteil.bezeichner, { name: text(urteil.name) });
      urteilKnoten.dataset.art = urteil.richtig ? 'erfolg' : 'hinweis';
    }
  }

  return {
    knoten,

    /**
     * Zeigt einen Stand.
     *
     * `text` wird bei jedem Aufruf mitgegeben und nicht beim Erzeugen
     * festgehalten, wie beim Stufenbereich: Die Sprache lässt sich umschalten,
     * und ein festgehaltener Verweis zeigte danach auf die alte.
     *
     * `uebung` trägt den flüchtigen Stand der Übung, also ob eine Frage offen
     * ist und wie das letzte Urteil ausfiel, oder ist `null`, wo die getroffene
     * Wahl nichts zu üben gibt. **Er steht nicht im gerechneten Stand**, und
     * der Grund steht im Kopf dieser Datei.
     */
    zeige({ stand, text, uebung = null }) {
      stufeMarke.textContent = text('training.stufeMarke');
      formMarke.textContent = text('training.formMarke');
      baueStufen(stand, text);
      baueFormen(stand, text);
      baueMesswerte(stand, text);
      zeigeUebung(stand, text, uebung);

      // Der Umfang nennt den Titel und nicht die Nummer: Er steht unter der
      // Wahl und beantwortet, was sie bewirkt hat, und dafür ist der Name die
      // Auskunft. Ohne gewählte Stufe bleibt die Zeile leer statt eine Null zu
      // zeigen; eine Null behauptete eine Stufe ohne Fälle.
      umfangKnoten.hidden = stand.umfang === null;
      if (stand.umfang !== null) {
        umfangKnoten.textContent = text('training.umfang', {
          titel: text(`stufe.${stand.gewaehlt}.titel`),
          faelle: stand.umfang.faelle,
        });
      }

      // **Zwei Hinweise und nicht mehr drei**, seit 4T-0141. Solange nichts
      // frei ist, ist das die Auskunft, die zählt; sonst die, warum hier zwei
      // Stufen stehen und im Übergang vier.
      //
      // **Der mittlere ist mit seinem Gegenstand weggefallen.** Er sagte, dass
      // das Ausführen noch komme, und traf genau dann zu, wenn `uebung` null
      // war; seit beide Übungsformen etwas zu üben geben, ist `uebung === null`
      // dieselbe Bedingung wie `stand.gesperrt` und ein zweiter Zweig dafür
      // eine Verzweigung ohne Entscheidung.
      hinweisKnoten.textContent = text(stand.gesperrt ? 'training.gesperrt' : 'training.nurFaelle');
    },
  };
}
