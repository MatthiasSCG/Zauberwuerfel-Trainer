// Der Bereich der Zeitnahme in der Oberfläche.
//
// Er trägt die Wahl des Weges, die laufende Uhr und das Ergebnis eines
// Durchgangs. Die Messung selbst rechnet `timing/stopwatch.js`; dieser Bereich
// zeigt sie an und nimmt die Griffe entgegen.
//
// ## Warum die Rechnung von der Darstellung getrennt ist
//
// Derselbe Grund wie bei `trainingsstand` in `view/training.js` und
// `stufenstand` in `view/stufe.js`: **Am Bild fällt es nicht auf.** Eine
// Schaltfläche «Fertig», die am Bildschirm danebensteht, sieht aus wie eine
// richtige. Wer sie drückte, hielte die Uhr an, ohne gelöst zu haben, und der
// Ablauf wiese ihn stumm ab; am Bildschirm wäre das eine Zeit, die niemand
// erreicht hat. `zeitnahmestand` ist deshalb eine reine Funktion und ohne
// Browser vollständig durchzurechnen.
//
// ## Warum der Schritt «vorbereitet» hier steht und nicht im Ablauf
//
// Der Ablauf kennt `READY` als «kein Versuch». Zwischen der Wahl des Weges und
// dem Start liegt aber ein Zustand, in dem der Weg feststeht und die
// Verwürfelung liegt: **Am eigenen Würfel muss der Anwender sie erst
// nachstellen, und die Uhr darf dabei nicht laufen.** Entschieden vom Product
// Owner am 2026-09-03, und zwar für beide Wege gleich.
//
// Ihn in den Ablauf zu ziehen hieße, dessen Phasen um eine zu erweitern, die
// von der **Bedienung** handelt und nicht von der Messung. Der Ablauf misst
// dann eine Wartezeit mit, die keine Messung ist.
//
// ## Wie der Bereich die beiden Wege auseinanderhält
//
// **Gar nicht, und das ist dieselbe Zusage, die der Ablauf gibt.** Er weiß
// nicht, dass es einen Bildschirm und ein eigenes Stück gibt; er weiß, ob der
// Anwender den Versuch **selbst beendet**. Das entscheidet das Feld
// `beendetSelbst` des hereingereichten Weges, und daran allein hängt, ob
// «Fertig» dasteht.
//
// Das ist genau die eine Frage, die `TIMING_MODES` trennt, und sie steht
// deshalb auch hier nur einmal. Wie ein Weg im Modell heißt, weiß
// `timing/stopwatch.js` und nicht dieser Bereich.
//
// ## Was dieses Modul nicht kennt
//
// **Weder `timing` noch `settings`** und kein anderes Modul der Oberfläche, wie
// `view/stufe.js` und `view/training.js`. Nach Grundsatz 3 der Architektur wird
// in `app` verdrahtet. Die Wege kommen mit ihren Kennungen herein, die Zeiten
// in Millisekunden, und das Zeichen zwischen Sekunde und Bruchteil als Wert;
// eine Sprachfrage gehört nicht in eine Rechnung, die keine Sprache kennt.

/**
 * Die vier Schritte, die der Bereich durchläuft.
 *
 * In der Bauart von `ZUSTAND` in `view/stufe.js`: ein Wert mit sprechendem
 * Namen statt einer Zeichenkette an jeder Aufrufstelle.
 */
export const ZEITSCHRITTE = {
  BEREIT: 'bereit',
  VORBEREITET: 'vorbereitet',
  INSPEKTION: 'inspektion',
  LAEUFT: 'laeuft',
  FERTIG: 'fertig',
};

/**
 * Was das große Zahlenfeld gerade zeigt.
 *
 * **Ein Feld und nicht zwei.** Die verbleibende Frist und die verstrichene Zeit
 * stehen nie zugleich an; zwei große Zahlen übereinander hießen, dass eine von
 * beiden immer nichts sagt. Welche von beiden gilt, entscheidet die Rechnung
 * und nicht die Erzeugung, denn es ist dieselbe Frage wie die nach der
 * Stellenzahl.
 */
export const ZEITANZEIGE = { VERSTRICHEN: 'verstrichen', VERBLEIBEND: 'verbleibend' };

/**
 * Eine Dauer in Millisekunden als Text.
 *
 * `stellen` ist die Zahl der Nachkommastellen, `trenner` das Zeichen davor.
 * Unter einer Minute steht die Sekunde allein, darüber die Minute davor und
 * die Sekunde zweistellig.
 *
 * **Ohne Nachkommastelle bleibt auch der Trenner weg.** Das ist der Fall der
 * Inspektionszeit seit 4T-0148: Sie ist eine Frist und keine Messung, und die
 * Einheit einer Frist ist die Sekunde. Ein stehen gebliebener Trenner zeigte
 * «15,» und sähe nach einer abgeschnittenen Zahl aus.
 *
 * **Abgeschnitten und nicht gerundet.** Eine Uhr, die 12,996 als 13,00 zeigt,
 * nennt eine Zeit, die der Anwender nicht erreicht hat. Aus demselben Grund
 * rechnet `alsDauer` im Ablauf mit `Math.trunc`.
 *
 * **Die Minute erscheint erst, wenn es eine gibt.** Ein Einsteiger braucht für
 * einen Durchgang zwei bis fünf Minuten, ein Geübter zwanzig Sekunden; «0:19,4»
 * wäre für den einen umständlich und «187,4» für den anderen unlesbar.
 */
export function alsZeit(ms, { stellen = 1, trenner = ',' } = {}) {
  const gesamt = Math.max(0, Math.trunc(ms) || 0);
  const faktor = 10 ** stellen;
  const bruch =
    stellen === 0
      ? ''
      : `${trenner}${String(Math.floor(gesamt / (1000 / faktor)) % faktor).padStart(stellen, '0')}`;
  const sekundenGesamt = Math.floor(gesamt / 1000);
  const minuten = Math.floor(sekundenGesamt / 60);
  const sekunden = sekundenGesamt % 60;
  if (minuten === 0) return `${sekunden}${bruch}`;
  return `${minuten}:${String(sekunden).padStart(2, '0')}${bruch}`;
}

/** Genauigkeit der laufenden Uhr, der Inspektionszeit und des Ergebnisses. */
const STELLEN_LAUFEND = 1;
const STELLEN_INSPEKTION = 0;
const STELLEN_ERGEBNIS = 2;

/**
 * Eine abgelegte Dauer als Text, mit dem Trenner der Sprache.
 *
 * **Dieselbe Genauigkeit wie beim Ergebnis**, seit 4T-0153, denn es ist
 * dieselbe Größe: eine gemessene Zeit, die stillsteht. Eine zweite Konstante
 * dafür wäre eine zweite Wahrheit über die Genauigkeit einer Messung. **Der
 * Durchschnitt geht denselben Weg**, obwohl er eine Bruchzahl ist; `alsZeit`
 * schneidet ab, und eine vorher gerundete Zahl wäre danach zweimal gerundet.
 */
const zeitText = (ms, text) =>
  alsZeit(ms, { stellen: STELLEN_ERGEBNIS, trenner: text('zeitnahme.trenner') });

/**
 * Die verbleibende Frist, auf ganze Sekunden aufgerundet.
 *
 * **Aufgerundet und nicht abgeschnitten**, und das ist die eine Stelle, an der
 * die Zeitnahme rundet. Eine Frist von 15 Sekunden stünde abgeschnitten schon
 * in ihrer ersten Millisekunde auf «14», und der Anwender läse eine Zahl, die
 * er nicht eingestellt hat. Aufgerundet beginnt sie bei 15 und endet bei 1; die
 * Null erscheint nie, denn dann läuft bereits die Messung.
 */
const alsFrist = (ms) => Math.ceil(Math.max(0, ms) / 1000) * 1000;

/**
 * Rechnet den Stand des Bereichs.
 *
 * `wege` ist die vollständige Liste der Wege, jeder mit `kennung` und
 * `beendetSelbst`. `weg` ist der geltende Weg oder `null`, `dauer` die
 * verstrichene Messzeit in Millisekunden, `ergebnis` das abgeschlossene
 * Ergebnis oder `null`.
 *
 * `vorbereitet`, `inspiziert` und `laeuft` sagen, wo der Durchgang steht. Alle
 * drei kommen von außen und werden nicht aus den Zeiten erraten: Eine Dauer von
 * null steht am Anfang jeder Messung und unterschiede sie nicht, und eine
 * verbleibende Frist von null heißt sowohl «keine Inspektion» als auch «die
 * letzte Millisekunde».
 *
 * **Ein Widerspruch ist ein Befund und kein stiller Rückfall**, wie bei
 * `trainingsstand` die unbekannte Stufe. Er kann nur aus einem Fehler der
 * Verdrahtung stammen, und ein Rückfall sähe aus wie ein richtiger Schritt.
 */
export function zeitnahmestand({
  wege,
  weg = null,
  vorbereitet = false,
  inspiziert = false,
  laeuft = false,
  dauer = 0,
  verbleibend = 0,
  ergebnis = null,
} = {}) {
  if (!Array.isArray(wege) || wege.length === 0) {
    throw new RangeError('Ohne Weg gibt es keine Zeitnahme');
  }
  if (weg !== null && !wege.some((eintrag) => eintrag.kennung === weg)) {
    throw new RangeError(`Unbekannter Weg: ${weg}`);
  }
  // **Die drei Flaggen werden gezählt und nicht paarweise verglichen.** Drei
  // Paare wären drei Stellen für eine Aussage, und ein Bruch an einer von ihnen
  // sagte nicht, welche die Aussage hält.
  const offen = [vorbereitet, inspiziert, laeuft].filter(Boolean);
  if (offen.length > 1) {
    throw new RangeError('Ein Durchgang steht in genau einem Schritt');
  }
  // Ein Durchgang ohne Weg kann es nicht geben: `begin` weist einen unbekannten
  // Weg ab, und die Wahl des Weges ist es, die den Durchgang eröffnet.
  if (offen.length > 0 && weg === null) {
    throw new RangeError('Ein Durchgang ohne Weg');
  }

  const schritt = laeuft
    ? ZEITSCHRITTE.LAEUFT
    : inspiziert
      ? ZEITSCHRITTE.INSPEKTION
      : vorbereitet
        ? ZEITSCHRITTE.VORBEREITET
        : ergebnis !== null
          ? ZEITSCHRITTE.FERTIG
          : ZEITSCHRITTE.BEREIT;

  // **Der Weg als Eintrag und nicht als Kennung**, denn gebraucht wird sein
  // Feld `beendetSelbst`. Er steht hier einmal; zweimal gesucht liefen die
  // beiden Stellen früher oder später auseinander.
  const gewaehlterWeg = wege.find((eintrag) => eintrag.kennung === weg) ?? null;
  const inRuhe = schritt === ZEITSCHRITTE.BEREIT || schritt === ZEITSCHRITTE.FERTIG;

  return {
    schritt,
    // Die Wege stehen immer im Stand, auch wenn die Wahl gerade nicht greift:
    // Wer sie beim Wechsel des Schrittes aus dem Baum nähme, baute sie danach
    // neu auf und setzte dabei den Bildlauf zurück.
    wege: wege.map((eintrag) => ({
      kennung: eintrag.kennung,
      gewaehlt: eintrag.kennung === weg,
    })),
    weg,
    wahlOffen: inRuhe,
    losOffen: schritt === ZEITSCHRITTE.VORBEREITET,
    // **Der Griff für das vorzeitige Ende der Inspektion**, seit 4T-0148. Er
    // steht allein dort: `start` weist ihn in jeder anderen Phase ab, und eine
    // Schaltfläche, die nichts tut, sieht aus wie eine, die etwas tut.
    jetztOffen: schritt === ZEITSCHRITTE.INSPEKTION,
    abbruchOffen: !inRuhe,
    // **Am eigenen Würfel beendet allein der Anwender**, und das ist die eine
    // Frage, die der Weg trennt. Am Bildschirm hält der gelöste Zustand die Uhr
    // an; ein Griff daneben hielte sie an, ohne dass gelöst wäre.
    //
    // **In der Inspektion steht er auf keinem der beiden Wege**, denn `finish`
    // greift allein in der Messung: Wer ihn dort drückte, hielte eine Uhr an,
    // die noch nicht läuft.
    fertigOffen: schritt === ZEITSCHRITTE.LAEUFT && gewaehlterWeg?.beendetSelbst === true,
    // **Die Uhr steht im Ergebnisschritt still und nicht auf der Ergebniszahl.**
    // Beide zeigten dieselbe Zeit, und zwei Knoten mit einer Zahl sind zwei
    // Wahrheiten über sie. Die genaue Zahl steht im Ergebnis, das seinen Weg
    // mitnennt; die laufende Uhr nennt ihn nicht, denn dort steht er darüber.
    //
    // **In der Inspektion zeigt dasselbe Feld die verbleibende Frist**, seit
    // 4T-0148 und mit eigener Art: Die Zahl steht dort für etwas anderes, und
    // die Anzeige benennt sie danach.
    uhr:
      schritt === ZEITSCHRITTE.FERTIG
        ? null
        : schritt === ZEITSCHRITTE.INSPEKTION
          ? {
              ms: alsFrist(verbleibend),
              stellen: STELLEN_INSPEKTION,
              art: ZEITANZEIGE.VERBLEIBEND,
            }
          : {
              ms: schritt === ZEITSCHRITTE.LAEUFT ? dauer : 0,
              stellen: STELLEN_LAUFEND,
              art: ZEITANZEIGE.VERSTRICHEN,
            },
    ergebnis:
      schritt === ZEITSCHRITTE.FERTIG
        ? { weg: ergebnis.weg, ms: ergebnis.dauer, stellen: STELLEN_ERGEBNIS }
        : null,
    // Der Schlüssel des Hinweises und nicht sein Wortlaut. Die beiden Wege
    // verlangen Verschiedenes: Am Bildschirm hält die Uhr von selbst an, am
    // eigenen Würfel drückt der Anwender. Ein Hinweis für beide träfe keinen.
    hinweis: inRuhe ? schritt : `${schritt}.${weg}`,
  };
}

/**
 * Ein Kalenderzeitpunkt als Text, in Ortszeit und im Format der Sprache.
 *
 * `iso` ist der abgelegte Zeitpunkt, also UTC nach ISO 8601; `gebiet` das
 * Gebietskennzeichen aus dem Sprachbaum, etwa `de-DE`.
 *
 * **Die Ortszeit gehört in die Anzeige und nicht in die Ablage**, nach
 * Abschnitt H der globalen Projektstandards. Abgelegt wird in UTC, damit die
 * Reihenfolge über Zeitumstellungen hinweg stimmt; gelesen wird, was der
 * Anwender auf seiner Uhr gesehen hat. **Das Gebietskennzeichen steht im
 * Sprachbaum**, wie der Dezimaltrenner und aus demselben Grund: Die
 * Schreibweise eines Datums ist eine Sprachfrage, und diese Rechnung kennt
 * keine Sprache.
 *
 * **Ohne Sekunden**, seit 4T-0153. Sie sagen an einem Kalenderzeitpunkt nichts
 * aus; die Dauer misst die andere Spalte.
 *
 * **Ein unbrauchbarer Zeitpunkt gibt die leere Zeichenkette und wirft nicht.**
 * Er kommt aus einer Datei, die ein Anwender bearbeitet haben kann, und
 * `readHistory` lässt einen solchen Eintrag gar nicht erst herein; eine
 * Abweisung an dieser Stelle kostete die ganze Liste.
 */
export function alsZeitpunkt(iso, gebiet) {
  const zeit = new Date(iso);
  if (Number.isNaN(zeit.getTime())) return '';
  return zeit.toLocaleString(gebiet, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Wie viele Versuche die Liste je Weg zeigt.
 *
 * **Zwölf, und die Zahl ist begründet:** Es ist das größere der beiden Fenster
 * aus `AVERAGE_WINDOWS`, und damit sieht der Anwender genau die Versuche, aus
 * denen die angezeigten Zahlen entstehen, und keinen mehr. Entschieden vom
 * Product Owner am 2026-09-03.
 *
 * **Alle zu zeigen ist nicht darstellbar.** Der Verlauf hält bis zu
 * `HISTORY_LIMIT` Versuche je Weg, und tausend Zeilen wären gemessen über
 * 21 000 px; mit zwölf Zeilen je Weg steht der Bereich bei 1125 px. **Fünf
 * wäre die halbe Auskunft**, denn der Durchschnitt über zwölf stünde dann über
 * einer Liste, die ihn nicht belegt.
 *
 * **Die Zahl steht hier und nicht in `AVERAGE_WINDOWS`.** Jene Liste sagt,
 * welche Durchschnitte gerechnet werden; diese Zahl, wie viel Platz die Anzeige
 * hat. Dass beide heute übereinstimmen, ist eine Entscheidung und keine
 * Ableitung, und `src/timing` kennt keine Höhe.
 */
export const VERLAUF_ZEILEN = 12;

/** Ein abgelegter Versuch, wie die Anzeige ihn liest. */
const alsVersuch = ({ index, duration, at }) => ({
  // **Die laufende Nummer und die Stelle sind zwei Dinge und nicht eines.** Der
  // Anwender zählt seine Durchgänge von eins an, und das ist die Auskunft; die
  // Stelle im Bestand beginnt bei null und ist der Griff, mit dem `discard` in
  // `timing/history.js` den Versuch verwirft. Sie steht seit 4T-0154 dabei.
  // **Die Anzeige rechnet damit nicht**: Eine Anzeige, die aus der Nummer die
  // Stelle errechnet, wäre eine zweite Wahrheit über die Zählweise.
  nummer: index + 1,
  stelle: index,
  ms: duration,
  zeitpunkt: at,
});

/**
 * Rechnet den Stand des Zeitverlaufs.
 *
 * `wege` ist die vollständige Liste der Wege wie bei `zeitnahmestand`,
 * `verlauf` die Auskunft je Weg, wie die Verdrahtung sie aus `timing/history.js`
 * holt: `{ kennung, versuche, bestzeit, schnitte }` mit den Versuchen als
 * `{ index, duration, at }` in der Reihenfolge des Entstehens, der Bestzeit in
 * derselben Gestalt oder `null` und den Schnitten als `{ fenster, ms }`, wobei
 * `ms` auch `null` sein darf.
 *
 * **Sie rechnet und reicht nicht durch:** die laufende Nummer je Versuch, die
 * Reihenfolge der Anzeige, die Grenze der gezeigten Zeilen, wie viele darüber
 * hinaus abgelegt sind, ob ein Weg leer ist und ob es überhaupt einen Versuch
 * gibt.
 *
 * **Der jüngste Versuch steht oben.** Abgelegt wird in der Reihenfolge des
 * Entstehens, weil die Durchschnitte über die letzten laufen; gelesen wird von
 * hinten, denn wer gerade gemessen hat, sucht seine eigene Zeit und nicht die
 * vom vorigen Monat.
 *
 * **Eine fehlende Auskunft ist ein Befund und keine leere Liste**, wie die
 * fehlenden Messwerte in `trainingsstand`. Sie kann nur aus einem Fehler der
 * Verdrahtung stammen, und ein stiller Rückfall sähe aus wie ein Weg, auf dem
 * noch nie gemessen wurde.
 */
export function zeitverlaufstand({ wege, verlauf = [], zeilen = VERLAUF_ZEILEN } = {}) {
  if (!Array.isArray(wege) || wege.length === 0) {
    throw new RangeError('Ohne Weg gibt es keinen Verlauf');
  }
  if (!Number.isInteger(zeilen) || zeilen < 1) {
    throw new RangeError(`Keine Zahl gezeigter Versuche: ${zeilen}`);
  }
  const auskunftVon = new Map(verlauf.map((eintrag) => [eintrag.kennung, eintrag]));
  const gerechnet = wege.map(({ kennung }) => {
    const auskunft = auskunftVon.get(kennung);
    if (auskunft === undefined) {
      throw new RangeError(`Ohne Auskunft für den Weg: ${kennung}`);
    }
    const versuche = auskunft.versuche ?? [];
    const gezeigt = versuche.slice(-zeilen).reverse().map(alsVersuch);
    return {
      kennung,
      leer: versuche.length === 0,
      // **Die Bestzeit trägt Nummer und Zeitpunkt mit.** Sie wird über alle
      // gehaltenen Versuche gerechnet und kann damit älter sein als die
      // gezeigte Liste; ohne ihre Nummer wäre nicht zu sagen, welcher Durchgang
      // sie war.
      bestzeit: auskunft.bestzeit ? alsVersuch(auskunft.bestzeit) : null,
      schnitte: (auskunft.schnitte ?? []).map(({ fenster, ms }) => ({
        fenster,
        ms: ms ?? null,
      })),
      zeilen: gezeigt,
      // Wie viele Versuche abgelegt sind, wenn die Liste nicht alle zeigt.
      // **Die Gesamtzahl und nicht die Differenz**, denn genau die will der
      // Anwender wissen: wie viele er insgesamt gemessen hat.
      gesamt: versuche.length,
      mehr: versuche.length > gezeigt.length,
    };
  });
  return { gebucht: gerechnet.some((weg) => !weg.leer), wege: gerechnet };
}

/**
 * Die beiden Signale des Tons, aus 4T-0149.
 *
 * Abschnitt 4 des Einstellungs-Katalogs nennt zwei und keines mehr: das Ende
 * der Inspektionszeit und den gelösten Würfel. Ein Klickgeräusch je Zug wird
 * dort ausdrücklich verworfen, weil es bei hundertdreißig Zügen zur Qual wird.
 */
export const ZEITSIGNALE = { START: 'start', GELOEST: 'geloest' };

/**
 * Welches Signal ein Wechsel des Schrittes auslöst, oder `null`.
 *
 * **Die Deutung steht hier und nicht im Ton**, denn wer einen Wechsel deutet,
 * muss die Schritte kennen. Ein zweites Modul mit denselben Kennungen wäre eine
 * zweite Wahrheit über sie; `view/ton.js` bekommt deshalb einen Bezeichner und
 * keine Lage.
 *
 * **Der Beginn der Messung klingt, gleich wodurch er kommt.** Entschieden vom
 * Product Owner am 2026-09-03: Das Signal sagt «die Uhr läuft jetzt» und nicht
 * «deine Frist ist um». Wer vorzeitig startet, hat danach die Hände am Würfel
 * und sieht nicht mehr auf den Bildschirm; und eine Regel ist leichter zu
 * lernen als zwei. Damit klingt es auch bei abgeschalteter Inspektionszeit.
 *
 * **Das Ende klingt allein dort, wo das Programm es selbst bemerkt hat**, also
 * am Bildschirm. Am eigenen Würfel drückt der Anwender; ein Signal wäre die
 * Antwort auf seinen eigenen Griff. Das ist dieselbe Trennung, die der ganze
 * Ablauf führt, und sie kommt aus derselben Quelle: `beendetSelbst`.
 */
export function zeitsignal({ vorher = null, jetzt = null, weg = null, wege = [] } = {}) {
  if (vorher === jetzt) return null;
  if (jetzt === ZEITSCHRITTE.LAEUFT) return ZEITSIGNALE.START;
  if (jetzt !== ZEITSCHRITTE.FERTIG || vorher !== ZEITSCHRITTE.LAEUFT) return null;
  const gewaehlterWeg = wege.find((eintrag) => eintrag.kennung === weg) ?? null;
  return gewaehlterWeg?.beendetSelbst === true ? null : ZEITSIGNALE.GELOEST;
}

/**
 * Baut den Bereich der Zeitnahme und liefert seine Bedienung.
 *
 * `handlungen` trägt sieben Rückrufe: `waehle(kennung)`, `starte()`, `jetzt()`,
 * `beende()` und `brich()` für den Durchgang, dazu seit 4T-0154
 * `verwirf(weg, stelle)` und `loesche()` für den Verlauf. Keiner liefert etwas
 * zurück; was daraus folgt, kommt beim nächsten `zeige` oder `zeigeVerlauf`
 * wieder herein.
 *
 * **Die Rückfrage vor dem Löschen gehört nicht hierher.** `loesche` meldet
 * allein den Griff; dass danach gefragt wird und was eine abgelehnte Antwort
 * bedeutet, entscheidet die Verdrahtung. Dieselbe Trennung wie bei `waehle`
 * und der Verwürfelung.
 *
 * **Die Verwürfelung gehört nicht hierher.** `waehle` meldet allein die Wahl;
 * dass daraufhin verwürfelt wird, entscheidet die Verdrahtung, und sie
 * entscheidet auch, was mit einer abgelehnten Rückfrage geschieht.
 */
export function erzeugeZeitnahmeBereich(dokument, handlungen) {
  const knoten = dokument.createElement('div');
  knoten.className = 'zeitnahme';

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

  // **Eine Reihe von Schaltflächen und keine Segmente.** Der Segmentschalter
  // des Trainings hält einen Zustand, der zwischen den Aufgaben stehen bleibt;
  // diese beiden eröffnen einen Durchgang und sind damit Griffe wie
  // «Verwürfeln». Der Weg gehört zum Versuch und nicht zur Person, entschieden
  // vom Product Owner am 2026-09-02.
  const wegeKnoten = bau('div', 'datei-reihe zeitnahme-wege', knoten);
  /** Die Schaltflächen der Wege, nach Kennung. Sie entstehen einmal. */
  const wegSchaltflaechen = new Map();

  const wegMarke = bau('p', 'zeitnahme-weg leise', knoten);

  // **Die laufende Uhr bekommt keine Ansage.** Sie ändert sich zehnmal in der
  // Sekunde, und eine Vorlesehilfe, die das mitspricht, ist unbenutzbar. Ihren
  // Namen trägt sie über `aria-label`, damit sie beim Anspringen benannt ist,
  // und seit 4T-0148 wechselt er mit der Art: Dieselbe Stelle zeigt in der
  // Inspektion die verbleibende Frist, und «Verstrichene Zeit» wäre dort das
  // Gegenteil dessen, was dasteht.
  const uhrKnoten = bau('p', 'zeitnahme-uhr', knoten);

  // **Das Ergebnis dagegen wird angesagt**, wie die Rückmeldung im
  // Stufenbereich: Es erscheint einmal, und wer beim Lösen den Blick am Würfel
  // hatte, bekäme es sonst gar nicht mit.
  const ergebnisKnoten = bau('p', 'zeitnahme-ergebnis', knoten);
  ergebnisKnoten.setAttribute('role', 'status');

  const steuerung = bau('div', 'datei-reihe zeitnahme-steuerung', knoten);
  const knopfLos = knopf(steuerung, () => handlungen.starte());
  const knopfJetzt = knopf(steuerung, () => handlungen.jetzt());
  const knopfFertig = knopf(steuerung, () => handlungen.beende());
  const knopfAbbruch = knopf(steuerung, () => handlungen.brich());
  knopfAbbruch.className = 'ruhend';

  const hinweisKnoten = bau('p', 'erklaerung', knoten);

  // Der Verlauf, aus 4T-0153. **Er steht unter dem Hinweis und nicht über der
  // Steuerung.** Sonst schöbe er die Griffe «Jetzt starten», «Fertig» und
  // «Abbrechen» von gemessenen 331 px auf über 1200 px, und der Anwender müsste
  // mitten in einer Messung rollen, um sie zu beenden.
  //
  // **Ein Aufklapper, zugeklappt als Vorgabe**, entschieden vom Product Owner
  // am 2026-09-03 auf eine Messung hin: Zugeklappt kostet der Verlauf 49 px und
  // der Bereich steht in Ruhe bei 263 px statt 214; offen kostet er bei zwölf
  // Zeilen je Weg 911 px und bringt den Bereich auf 1125 px, mehr als eine
  // Bildschirmhöhe des Messfalls. Dieselbe Lage und dieselbe Entscheidung wie
  // bei der Messwerte-Tabelle des Trainings seit 4T-0143.
  //
  // **Der Zustand wird hier nicht gesetzt und in `zeigeVerlauf` nicht
  // angefasst**, wie dort: Ein Aufklapper, den das Zeichnen mitsetzte, ginge
  // wieder zu, sobald der Anwender ihn geöffnet hat. Deshalb steht hier auch
  // kein `open = false`; die Vorgabe eines `details` ist zu.
  const verlaufKlappe = bau('details', 'klappe zeitnahme-verlauf', knoten);
  const verlaufMarke = dokument.createElement('summary');
  verlaufKlappe.append(verlaufMarke);
  const verlaufTitel = bau('h3', 'zeitnahme-verlauf-marke', verlaufMarke);
  const verlaufErklaerung = bau('p', 'erklaerung', verlaufKlappe);

  /**
   * Die Stücke je Weg, nach Kennung.
   *
   * **Sie entstehen einmal**, wie die Schaltflächen der Wege: Es gibt genau
   * zwei Wege, und sie wechseln nicht. Was je Zeichnung wechselt, sind die
   * Texte und die Zeilen der Tabelle.
   */
  const verlaufWege = new Map();

  // Das Löschen des ganzen Verlaufs, 4T-0154. **Es steht unter den beiden Wegen
  // und in derselben Klappe**, denn was es löscht, ist das, was darüber steht;
  // im Bereich «Bedienung» stünde es zwei Bereiche entfernt von den Zeiten, die
  // es trifft. Dieselbe Lage und dieselbe Begründung wie beim Zurücksetzen der
  // Messwerte seit 4T-0144.
  //
  // **In einer Reihe wie die Griffe der Zeitnahme**, obwohl es nur einer ist:
  // `.datei-reihe` trägt im Bestand den Abstand nach oben und die Ausrichtung,
  // und eine zweite Bauform für dieselbe Lage müsste der Anwender lernen.
  const loeschenReihe = bau('div', 'datei-reihe zeitnahme-verlauf-loeschen', verlaufKlappe);
  const knopfLoeschen = knopf(loeschenReihe, () => handlungen.loesche());
  knopfLoeschen.className = 'ruhend';

  /** Baut die Stücke eines Weges und hängt sie vor die Reihe zum Löschen. */
  function baueVerlaufWeg() {
    // **Eingefügt und nicht angehängt**, denn die Reihe zum Löschen steht
    // bereits da und gehört unter die Wege. Ein Anhängen schöbe sie über sie.
    const block = dokument.createElement('div');
    block.className = 'zeitnahme-verlauf-weg';
    verlaufKlappe.insertBefore(block, loeschenReihe);
    const marke = bau('h4', 'zeitnahme-verlauf-wegmarke', block);
    // **Der eigene Wortlaut für den leeren Weg**, entschieden vom Product Owner
    // am 2026-09-03 in derselben Haltung wie bei `averageOf`: Kein Versuch ist
    // nicht dasselbe wie eine Zeit von null.
    const leer = bau('p', 'zeitnahme-verlauf-leer', block);
    // **Eine Beschreibungsliste und keine Textzeile.** Bestzeit und die beiden
    // Durchschnitte sind je ein Name und ein Wert, und genau dafür gibt es
    // `dl`; die Vorlesehilfe bekommt die Zuordnung damit von selbst, wie die
    // Tabelle sie über `scope` bekommt. Eine Zeile aus Fließtext müsste sie in
    // jedem Wert wiederholen.
    const kennzahlen = bau('dl', 'zeitnahme-verlauf-kennzahlen', block);
    const tabelle = bau('table', 'zeitnahme-verlauf-tabelle', block);
    const kopfteil = dokument.createElement('thead');
    const kopf = dokument.createElement('tr');
    kopfteil.append(kopf);
    // **Vier Spalten seit 4T-0154**, die vierte für den Griff zum Verwerfen.
    // Ihre Kopfzelle bleibt leer: Sie benennt keine Auskunft, sondern trägt
    // eine Handlung, und ein Wort darüber stünde einmal für zwölf gleiche
    // Griffe.
    const spalten = ['nummer', 'zeit', 'zeitpunkt', 'griff'].map(() => {
      const zelle = dokument.createElement('th');
      zelle.scope = 'col';
      kopf.append(zelle);
      return zelle;
    });
    const rumpf = dokument.createElement('tbody');
    tabelle.append(kopfteil, rumpf);
    const mehr = bau('p', 'erklaerung zeitnahme-verlauf-mehr', block);
    return { marke, leer, kennzahlen, paare: [], tabelle, spalten, rumpf, zeilen: [], mehr };
  }

  /** Eine Zeile der Tabelle, mit ihren vier Zellen. */
  function baueVerlaufZeile(rumpf, kennung) {
    const zeile = dokument.createElement('tr');
    const nummer = dokument.createElement('th');
    nummer.scope = 'row';
    nummer.className = 'zeitnahme-verlauf-nummer';
    const zeit = dokument.createElement('td');
    zeit.className = 'zeitnahme-verlauf-zeit';
    const zeitpunkt = dokument.createElement('td');
    zeitpunkt.className = 'zeitnahme-verlauf-zeitpunkt';
    const griffZelle = dokument.createElement('td');
    griffZelle.className = 'zeitnahme-verlauf-griff';
    // **Die Stelle sitzt am Knoten und nicht in einer geschlossenen Größe**,
    // damit sich von Hand prüfen lässt, welcher Griff welchen Versuch verwirft,
    // ohne den Wortlaut der Sprache zu kennen. Dieselbe Bauform wie `data-fall`
    // an den Zeilen der Messwerte-Tabelle und `data-weg` an der Wahl darüber.
    const griff = knopf(griffZelle, () => {
      const stelle = Number(griff.dataset.stelle);
      if (Number.isInteger(stelle)) handlungen.verwirf(kennung, stelle);
    });
    griff.className = 'zeitnahme-verlauf-verwerfen';
    zeile.append(nummer, zeit, zeitpunkt, griffZelle);
    rumpf.append(zeile);
    return { zeile, nummer, zeit, zeitpunkt, griff };
  }

  /** Ein Paar aus Name und Wert in der Kennzahlenliste. */
  function baueVerlaufPaar(liste, kennung) {
    // **Der Umschlag um Name und Wert ist erlaubt und nötig**: Er hält das Paar
    // zusammen, damit der Abstand innerhalb eines Paares kleiner ist als der
    // zwischen zwei Paaren. Ohne ihn wäre «Bestzeit» von seiner Zahl so weit
    // entfernt wie von der nächsten Kennzahl.
    const paar = bau('div', 'zeitnahme-verlauf-kennzahl', liste);
    const marke = dokument.createElement('dt');
    const wert = dokument.createElement('dd');
    paar.append(marke, wert);
    // **Die Zahl bekommt einen eigenen Knoten**, weil der Griff daneben in
    // dieselbe Zelle gehört: Ein `button` als Geschwister des `dd` wäre in
    // einer Beschreibungsliste kein zulässiger Inhalt.
    const zahl = bau('span', 'zeitnahme-verlauf-wert', wert);
    // **Auch die Bestzeit lässt sich verwerfen**, entschieden vom Product Owner
    // am 2026-09-03. Sie wird über alle gehaltenen Versuche gerechnet und kann
    // älter sein als die gezeigte Liste; ein versehentlich beendeter Versuch
    // von einer Sekunde wäre sonst nach zwölf weiteren Durchgängen dauerhaft
    // Bestzeit und nicht mehr zu löschen. **Nur die Bestzeit trägt einen
    // Griff**, denn ein Durchschnitt ist kein Versuch und hat keine Stelle.
    const griff = knopf(wert, () => {
      const stelle = Number(griff.dataset.stelle);
      if (Number.isInteger(stelle)) handlungen.verwirf(kennung, stelle);
    });
    griff.className = 'zeitnahme-verlauf-verwerfen';
    return { marke, zahl, griff };
  }

  function baueWege(stand, text) {
    if (wegSchaltflaechen.size !== stand.wege.length) {
      wegeKnoten.textContent = '';
      wegSchaltflaechen.clear();
      for (const eintrag of stand.wege) {
        const element = knopf(wegeKnoten, () => handlungen.waehle(eintrag.kennung));
        // Die Kennung am Knoten, damit sich von Hand prüfen lässt, welcher Weg
        // gewählt wurde, ohne den Wortlaut der Sprache zu kennen.
        element.dataset.weg = eintrag.kennung;
        wegSchaltflaechen.set(eintrag.kennung, element);
      }
    }
    for (const eintrag of stand.wege) {
      wegSchaltflaechen.get(eintrag.kennung).textContent = text(`zeitnahme.weg.${eintrag.kennung}`);
    }
  }

  return {
    knoten,

    /**
     * Zeigt einen Stand.
     *
     * `text` wird bei jedem Aufruf mitgegeben und nicht beim Erzeugen
     * festgehalten, wie bei den Schwesterbereichen: Die Sprache lässt sich
     * umschalten, und ein festgehaltener Verweis zeigte danach auf die alte.
     */
    zeige({ stand, text }) {
      baueWege(stand, text);
      wegeKnoten.hidden = !stand.wahlOffen;

      // **Der verborgene Knoten wird geleert und nicht nur verborgen**, Lehre
      // 16 in Abschnitt 14.5 der Konventionen: `hidden` nimmt ihn aus der
      // Darstellung und nicht aus dem Dokument. Ein stehen gebliebener Weg
      // benennte nach dem Abbruch einen Durchgang, den es nicht mehr gibt.
      const wegSteht = !stand.wahlOffen && stand.weg !== null;
      wegMarke.hidden = !wegSteht;
      wegMarke.textContent = wegSteht ? text(`zeitnahme.weg.${stand.weg}`) : '';

      uhrKnoten.hidden = stand.uhr === null;
      uhrKnoten.textContent =
        stand.uhr === null
          ? ''
          : text(`zeitnahme.uhrWert.${stand.uhr.art}`, {
              zeit: alsZeit(stand.uhr.ms, {
                stellen: stand.uhr.stellen,
                trenner: text('zeitnahme.trenner'),
              }),
            });
      // **Der Name steht auch dann fest, wenn die Zahl fort ist.** Ohne Uhr
      // bleibt der letzte stehen; der Knoten ist dann verborgen und leer, und
      // ein Name ohne Inhalt sagt nichts Falsches.
      if (stand.uhr !== null) {
        uhrKnoten.setAttribute('aria-label', text(`zeitnahme.uhrMarke.${stand.uhr.art}`));
      }

      ergebnisKnoten.hidden = stand.ergebnis === null;
      // **Das Ergebnis nennt seinen Weg**, und das ist AK6 von S-0029: Zeiten
      // am Bildschirm und am eigenen Würfel werden getrennt ausgewiesen. Eine
      // nackte Zahl ließe die beiden nebeneinander stehen, als wären sie
      // dasselbe.
      ergebnisKnoten.textContent =
        stand.ergebnis === null
          ? ''
          : text('zeitnahme.ergebnis', {
              weg: text(`zeitnahme.weg.${stand.ergebnis.weg}`),
              zeit: alsZeit(stand.ergebnis.ms, {
                stellen: stand.ergebnis.stellen,
                trenner: text('zeitnahme.trenner'),
              }),
            });

      knopfLos.hidden = !stand.losOffen;
      knopfLos.textContent = text('zeitnahme.los');
      knopfJetzt.hidden = !stand.jetztOffen;
      knopfJetzt.textContent = text('zeitnahme.jetzt');
      knopfFertig.hidden = !stand.fertigOffen;
      knopfFertig.textContent = text('zeitnahme.fertig');
      knopfAbbruch.hidden = !stand.abbruchOffen;
      knopfAbbruch.textContent = text('zeitnahme.abbrechen');
      // Die Reihe trägt einen Abstand nach oben; ohne eine sichtbare
      // Schaltfläche stünde er als Lücke da.
      steuerung.hidden =
        !stand.losOffen && !stand.jetztOffen && !stand.fertigOffen && !stand.abbruchOffen;

      hinweisKnoten.textContent = text(`zeitnahme.hinweis.${stand.hinweis}`);
    },

    /**
     * Zeigt den Verlauf, aus 4T-0153.
     *
     * **Ein eigener Eingang neben `zeige` und nicht ein Feld darin.** `zeige`
     * läuft während einer Messung im Takt des Zeichnens, also etwa sechzigmal
     * in der Sekunde; der Verlauf ändert sich dagegen nur, wenn ein Versuch
     * dazukommt, wegfällt oder der ganze Bestand ersetzt wird. Ihn mitzuziehen
     * wäre sechzigmal in der Sekunde dieselbe Liste.
     *
     * **Jeder verborgene Knoten wird geleert**, Lehre 16 in Abschnitt 14.5 der
     * Konventionen: `hidden` nimmt einen Knoten aus der Darstellung und nicht
     * aus dem Dokument. Eine stehen gebliebene Liste läge sonst unter dem
     * Satz, dass noch nichts gemessen wurde, und die Vorlesehilfe fände sie.
     */
    zeigeVerlauf({ verlauf, text }) {
      verlaufTitel.textContent = text('zeitnahme.verlaufMarke');
      verlaufErklaerung.textContent = text('zeitnahme.verlaufErklaerung');
      const gebiet = text('zeitnahme.gebiet');

      for (const weg of verlauf.wege) {
        if (!verlaufWege.has(weg.kennung)) verlaufWege.set(weg.kennung, baueVerlaufWeg());
        const stuecke = verlaufWege.get(weg.kennung);
        stuecke.marke.textContent = text(`zeitnahme.weg.${weg.kennung}`);

        stuecke.leer.hidden = !weg.leer;
        stuecke.leer.textContent = weg.leer ? text('zeitnahme.verlaufLeer') : '';

        // Die Kennzahlen: die Bestzeit und je Fenster ein Durchschnitt.
        const werte = [
          {
            marke: text('zeitnahme.verlaufBestzeit'),
            ms: weg.bestzeit?.ms ?? null,
            versuch: weg.bestzeit,
          },
          ...weg.schnitte.map((schnitt) => ({
            marke: text('zeitnahme.verlaufSchnitt', { fenster: schnitt.fenster }),
            ms: schnitt.ms,
            versuch: null,
          })),
        ];
        while (stuecke.paare.length < werte.length) {
          stuecke.paare.push(baueVerlaufPaar(stuecke.kennzahlen, weg.kennung));
        }
        stuecke.kennzahlen.hidden = weg.leer;
        for (const [stelle, paar] of stuecke.paare.entries()) {
          const wert = werte[stelle];
          paar.marke.textContent = weg.leer ? '' : wert.marke;
          paar.zahl.textContent = weg.leer
            ? ''
            : wert.ms === null
              ? text('zeitnahme.verlaufKeinWert')
              : text('zeitnahme.verlaufZeit', { zeit: zeitText(wert.ms, text) });
          // Der Griff zum Verwerfen, 4T-0154. **Nur die Bestzeit trägt einen**,
          // denn ein Durchschnitt ist kein Versuch und hat keine Stelle.
          const griffOffen = !weg.leer && wert.versuch !== null;
          paar.griff.hidden = !griffOffen;
          paar.griff.textContent = griffOffen ? text('zeitnahme.verlaufVerwerfen') : '';
          if (griffOffen) {
            paar.griff.dataset.stelle = String(wert.versuch.stelle);
            const marke = text('zeitnahme.verlaufVerwerfenGelesen', {
              nummer: wert.versuch.nummer,
            });
            paar.griff.setAttribute('aria-label', marke);
            paar.griff.title = marke;
          } else {
            delete paar.griff.dataset.stelle;
            paar.griff.removeAttribute('aria-label');
            paar.griff.removeAttribute('title');
          }
          // **Die Bestzeit sagt auch, welcher Durchgang sie war**, und zwar im
          // vorgelesenen Namen und im Titel und nicht im Bild. Sie wird über
          // alle gehaltenen Versuche gerechnet und kann älter sein als die
          // Liste; im Bild stünde die Auskunft als zweite Zahl neben der
          // ersten. Bei den Durchschnitten stellt sich die Frage nicht: Sie
          // tragen ihr Fenster im Namen, und die Zuordnung gibt die
          // Beschreibungsliste her.
          const gelesen =
            weg.leer || wert.versuch === null
              ? null
              : text('zeitnahme.verlaufBestzeitGelesen', {
                  zeit: zeitText(wert.versuch.ms, text),
                  nummer: wert.versuch.nummer,
                  zeitpunkt: alsZeitpunkt(wert.versuch.zeitpunkt, gebiet),
                });
          if (gelesen === null) {
            paar.zahl.removeAttribute('aria-label');
            paar.zahl.removeAttribute('title');
          } else {
            paar.zahl.setAttribute('aria-label', gelesen);
            paar.zahl.title = gelesen;
          }
        }

        stuecke.tabelle.hidden = weg.leer;
        for (const [stelle, spalte] of stuecke.spalten.entries()) {
          // **Die vierte Kopfzelle bleibt leer**, seit 4T-0154: Sie steht über
          // dem Griff zum Verwerfen, und der benennt sich selbst.
          const bezeichner = ['nummer', 'zeit', 'zeitpunkt'][stelle];
          spalte.textContent =
            weg.leer || bezeichner === undefined
              ? ''
              : text(`zeitnahme.verlaufSpalte.${bezeichner}`);
        }
        // **Die Zeilen entstehen je Zahl und nicht je Zeichnung.** Sie wächst
        // mit jedem Versuch, und ihre Texte wechseln ohnehin alle, denn die
        // laufende Nummer verschiebt sich mit jedem neuen Eintrag.
        while (stuecke.zeilen.length < weg.zeilen.length) {
          stuecke.zeilen.push(baueVerlaufZeile(stuecke.rumpf, weg.kennung));
        }
        for (const [stelle, zeile] of stuecke.zeilen.entries()) {
          const versuch = weg.zeilen[stelle] ?? null;
          zeile.zeile.hidden = versuch === null;
          zeile.nummer.textContent = versuch === null ? '' : String(versuch.nummer);
          zeile.zeit.textContent =
            versuch === null
              ? ''
              : text('zeitnahme.verlaufZeit', { zeit: zeitText(versuch.ms, text) });
          zeile.zeitpunkt.textContent =
            versuch === null ? '' : alsZeitpunkt(versuch.zeitpunkt, gebiet);
          // **Der ganze Eintrag steht im vorgelesenen Namen einer Zelle**, wie
          // bei der Messwerte-Tabelle: Eine Reihe aus «7», «1:34,27 s» und
          // «03.09.2026, 14:32» liest die Vorlesehilfe als drei Zahlenkolonnen.
          const gelesen =
            versuch === null
              ? null
              : text('zeitnahme.verlaufGelesen', {
                  nummer: versuch.nummer,
                  zeit: zeitText(versuch.ms, text),
                  zeitpunkt: alsZeitpunkt(versuch.zeitpunkt, gebiet),
                });
          if (gelesen === null) {
            zeile.zeit.removeAttribute('aria-label');
            zeile.zeit.removeAttribute('title');
          } else {
            zeile.zeit.setAttribute('aria-label', gelesen);
            zeile.zeit.title = gelesen;
          }
          // Der Griff zum Verwerfen, 4T-0154. **Die Stelle steht am Knoten und
          // wird bei jeder Zeichnung neu gesetzt**, denn sie verschiebt sich,
          // sobald ein Versuch gefallen ist; ein stehen gebliebener Wert
          // verwürfe beim nächsten Griff den falschen.
          zeile.griff.textContent = versuch === null ? '' : text('zeitnahme.verlaufVerwerfen');
          if (versuch === null) {
            delete zeile.griff.dataset.stelle;
            zeile.griff.removeAttribute('aria-label');
            zeile.griff.removeAttribute('title');
          } else {
            zeile.griff.dataset.stelle = String(versuch.stelle);
            const marke = text('zeitnahme.verlaufVerwerfenGelesen', { nummer: versuch.nummer });
            zeile.griff.setAttribute('aria-label', marke);
            zeile.griff.title = marke;
          }
        }

        stuecke.mehr.hidden = !weg.mehr;
        stuecke.mehr.textContent = weg.mehr
          ? text('zeitnahme.verlaufMehr', { gesamt: weg.gesamt, gezeigt: weg.zeilen.length })
          : '';
      }

      // Das Löschen, 4T-0154. **Es ist gesperrt, solange kein Versuch abgelegt
      // ist.** Ohne Sperre führte der Griff zu einer Rückfrage über nichts, und
      // wer sie bestätigte, bekäme keine Veränderung zu sehen; dieselbe Haltung
      // trägt das Zurücksetzen der Messwerte seit 4T-0144.
      //
      // **Der Grund steht im vorgelesenen Namen und im Titel**, denn eine
      // Schaltfläche, die sich nicht drücken lässt, sagt für sich genommen
      // nicht, warum.
      knopfLoeschen.textContent = text('zeitnahme.verlaufLoeschen');
      knopfLoeschen.disabled = !verlauf.gebucht;
      const zustand = text(
        verlauf.gebucht ? 'zeitnahme.verlaufLoeschenBereit' : 'zeitnahme.verlaufLoeschenLeer',
      );
      knopfLoeschen.setAttribute('aria-label', `${knopfLoeschen.textContent}, ${zustand}`);
      knopfLoeschen.title = knopfLoeschen.getAttribute('aria-label');
    },
  };
}
