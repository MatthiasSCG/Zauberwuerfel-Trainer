// Der Fallbestand von CFOP als Daten.
//
// Ein Fall ist ein eigenes Erkennungsbild mit einer eigenen Zugfolge. Das
// unterscheidet ihn von einer Übungslage des Anfängerverfahrens, wo viele
// Ausgangslagen auf dieselbe gelernte Folge führen; die Begründung steht in
// Abschnitt 11.7 des Didaktik-Konzepts und trägt dort die Freigaberegel.
//
// **Die Texte stehen hier nicht.** Ein Fall trägt einen Bezeichner, die Worte
// für den Anwender stehen in `i18n` und werden über `fall.${key}.…`
// angesprochen. Dieselbe Trennung wie bei den Lektionen in `catalog.js`.
//
// **Der Wortlaut der Zugfolgen steht hier sehr wohl**, und darin weicht dieses
// Modul von `catalog.js` ab. Dort nennt eine Lektion nur die Kennung ihrer
// Folge, weil der Wortlaut dem Löser gehört und eine zweite Fassung ihm
// davonliefe. Für die Folgen von CFOP gibt es keinen Löser, dem sie gehören
// könnten: Dieses Modul ist ihr einziger Ort. Eine Kennung, die auf nichts
// zeigt, wäre hier ein Umweg ohne Gewinn.
//
// **Die Wirkung steht zweimal da, und das ist Absicht.** Einmal als Satz für
// den Anwender in `i18n`, einmal als Angabe in `effect` für die Rechnung. Nur
// so lässt sich einlösen, was Punkt 3 des Quality-Gates von 2A-0017 verlangt:
// dass die Prüfung die Angabe in der Erklärung mitfasst und nicht bloss die
// Folge selbst. Was `effect` aufnimmt, entscheidet der Task zur
// Wirkungsprüfung; hier ist das Feld angelegt und darf `null` sein.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine
// globalen Namen. Die ESLint-Konfiguration erzwingt das.

import { CORNERS, EDGES, FACES, composeStates, applyMove, solvedCube } from '../core/cube.js';

/**
 * Die Blicke auf die letzte Schicht.
 *
 * Die ersten vier tragen die reduzierte Fassung: zwei Stufen zu je zwei
 * Blicken, und ein Fall gehört immer zu genau einem Blick. Die Stufe selbst
 * steht hier nicht als eigener Wert: Sie ergibt sich aus dem Blick, und ein
 * Zustand, der sich ableiten lässt, wird nicht mitgeführt.
 *
 * **Der fünfte gehört dem vollen Umfang**, seit 4T-0155. Er sieht die ganze
 * Orientierung der letzten Schicht in einem Stück an, wo die reduzierte Fassung
 * zweimal hinsieht, und trägt damit die siebenundfünfzig Fälle statt drei und
 * sieben.
 *
 * **Für das Setzen gibt es keinen fünften Blick, und das ist gemessen und nicht
 * vergessen.** `EDGE_PERMUTATION` liest die Anordnung der Ecken **und** der
 * Kanten und ist damit schon das Merkmal des vollen Umfangs; über alle 288
 * orientierten Lagen liefert er einundzwanzig Klassen zu tun. Dass der Bestand
 * nur vier davon führt, liegt an dem, was in der reduzierten Fassung vor ihm
 * steht: Dort sind die Ecken gesetzt, wenn er an die Reihe kommt. Die Rechnung
 * steht in `test/lessons/cases.test.js`.
 *
 * **Der sechste sieht nicht die letzte Schicht an, und er ist damit der erste
 * seiner Art**, seit 4T-0188. Er sieht ein Paar aus Ecke und Kante der ersten
 * beiden Schichten an und den Platz, in den es gehört. Die fünf darüber lesen
 * samt und sonders `UPPER_CORNERS` und `UPPER_EDGES`; dieser liest zwei
 * Steine, die überall liegen können.
 */
export const VIEWS = {
  EDGE_ORIENTATION: 'edgeOrientation',
  CORNER_ORIENTATION: 'cornerOrientation',
  CORNER_PERMUTATION: 'cornerPermutation',
  EDGE_PERMUTATION: 'edgePermutation',
  LAST_LAYER_ORIENTATION: 'lastLayerOrientation',
  PAIR_PLACEMENT: 'pairPlacement',
};

/**
 * Die Fassungen des Fallbestands.
 *
 * `REDUCED` ist die Fassung des Lernpfades, wie ihn Release 2 ausliefert:
 * wenige Fälle, dafür je Stufe zwei Blicke. `FULL` ist der Ausbau, bei dem eine
 * Stufe einen Blick trägt und dafür mehr Fälle. Angelegt in 4T-0117, um einen
 * zweiten Wert erweitert in 4T-0159.
 *
 * **Der Begriff steht hier und nicht bei den Stufen**, wo er bis 4T-0159
 * stand. Ein Fall nennt seit dort seine Fassung selbst, `stages.js` liest
 * dieses Modul ohnehin, und die umgekehrte Richtung wäre ein Ring; AK6 von
 * 4T-0117 schreibt die Importliste von `stages.js` buchstabengetreu fest und
 * schlüge bei einem solchen Ring an.
 */
export const EDITIONS = { REDUCED: 'reduced', FULL: 'full' };

const BEKANNTE_FASSUNGEN = new Set(Object.values(EDITIONS));

/**
 * Die Stellen der letzten Schicht, aus den Namen gelesen und nicht als Zahl
 * geschrieben. Dieselbe Vorsicht wie im Löser: Eine geänderte Reihenfolge in
 * `cube.js` fällt damit hier auf, statt still eine andere Stelle zu treffen.
 */
const UPPER_CORNERS = CORNERS.map((name, index) => ({ name, index }))
  .filter(({ name }) => name.includes('U'))
  .map(({ index }) => index);
const UPPER_EDGES = EDGES.map((name, index) => ({ name, index }))
  .filter(({ name }) => name.includes('U'))
  .map(({ index }) => index);

if (UPPER_CORNERS.length !== 4 || UPPER_EDGES.length !== 4) {
  throw new Error(
    `Die letzte Schicht hat ${UPPER_CORNERS.length} Ecken und ${UPPER_EDGES.length} Kanten`,
  );
}

/**
 * Der Platz der ersten beiden Schichten, den der sechste Blick ansieht.
 *
 * **Einer und nicht vier**, seit 4T-0188. Der Anwender hält den offenen Platz
 * vorn rechts, wie er beim Lernpfad die letzte Schicht oben hält; die Haltung
 * ist damit dieselbe Festlegung wie dort und keine zusätzliche.
 *
 * **Gemessen ist, dass die Wahl des Platzes keine Fälle zusammenwirft**,
 * sondern sie eins zu eins aufeinander abbildet. Sie ist deshalb die
 * Normalisierung vor dem Blick und keine Symmetrie in ihm.
 *
 * **Beide sind seit 4T-0191 ausgeführt**, weil der Erzeuger der Übungslagen
 * wissen muss, welche oberen Plätze das Paar belegt, um die übrigen freizugeben.
 * Sie ein zweites Mal aus `CORNERS` und `EDGES` abzulesen wäre eine zweite
 * Fassung derselben fachlichen Festlegung, und welcher Platz der offene ist,
 * entscheidet dieses Modul und nicht der Erzeuger.
 */
export const PAIR_CORNER = CORNERS.indexOf('DFR');
export const PAIR_EDGE = EDGES.indexOf('FR');

if (PAIR_CORNER < 0 || PAIR_EDGE < 0) {
  throw new Error('Der Platz vorn rechts steht nicht im Modell');
}

/** Die vier Drehlagen der oberen Ebene, als Lagen und nicht als Zug-Indizes. */
const UPPER_TURNS = buildUpperTurns();

function buildUpperTurns() {
  const move = FACES.indexOf('U') * 3;
  const lagen = [];
  let lage = solvedCube();
  for (let quarter = 0; quarter < 4; quarter++) {
    lagen.push(lage);
    lage = applyMove(lage, move);
  }
  return lagen;
}

/**
 * Was der Anwender bei diesem Blick ansieht, als Zeichenkette.
 *
 * **Der vierte Blick liest die Ecken mit, und das ist der Punkt, an dem die
 * Messung beim Zuschnitt von 2A-0017 zuerst falsch war.** Ein Merkmal allein
 * aus dem Kantenplatz ergab vier statt sechs Fällen: Es warf die beiden
 * gegenläufigen Ringtausche zusammen, weil es Drehlagen mitzählte, in denen
 * die Ecken mitgewandert sind. Stehen die Ecken bereits, ist die Lage der
 * Kanten **relativ zu ihnen** der Fall.
 */
const FEATURES = {
  [VIEWS.EDGE_ORIENTATION]: (state) => UPPER_EDGES.map((i) => state.eo[i]).join(''),
  [VIEWS.CORNER_ORIENTATION]: (state) => UPPER_CORNERS.map((i) => state.co[i]).join(''),
  [VIEWS.CORNER_PERMUTATION]: (state) => UPPER_CORNERS.map((i) => state.cp[i]).join(''),
  [VIEWS.EDGE_PERMUTATION]: (state) =>
    `${UPPER_CORNERS.map((i) => state.cp[i]).join('')}/${UPPER_EDGES.map((i) => state.ep[i]).join('')}`,
  // **Die beiden Teile werden hier nur verkettet und nicht einzeln kleinst
  // gemacht**, und darin liegt der Unterschied zu einer naheliegenden
  // Ableitung, die falsch wäre: Wer die kleinste Lesart der Kanten und die
  // kleinste der Ecken getrennt bildet, verliert ihre Lage zueinander, und
  // zwei verschiedene Fälle fielen zusammen. Die Kleinstform bildet
  // `caseIdFor`, indem es die **ganze Lage** dreht; jedes Merkmal hier liest
  // sie nur ab. Dieselbe Arbeitsteilung wie bei den vier Blicken darüber.
  //
  // Die Kanten stehen vorn, weil die reduzierte Fassung sie zuerst ansieht.
  [VIEWS.LAST_LAYER_ORIENTATION]: (state) =>
    `${UPPER_EDGES.map((i) => state.eo[i]).join('')}/${UPPER_CORNERS.map((i) => state.co[i]).join('')}`,
  // **Der einzige Blick, der einen Stein sucht, statt einen Platz zu lesen.**
  // Die fünf darüber fragen, wie es an vier festen Stellen aussieht; dieser
  // fragt, wo zwei bestimmte Steine liegen. Deshalb steht hier ein `indexOf`
  // und kein `map` über eine Platzliste.
  //
  // Die Ecke steht vorn, weil der Anwender sie zuerst sucht: Sie trägt drei
  // Farben und ist am Bild leichter zu finden als die Kante. `groupOfPlace`
  // schneidet den letzten Teil ab und liefert damit die Lage der Ecke als
  // Gruppe, und das ist zugleich die Nähe, aus der die Erkennungsübung ihre
  // Ablenker zieht.
  [VIEWS.PAIR_PLACEMENT]: (state) => {
    const ecke = state.cp.indexOf(PAIR_CORNER);
    const kante = state.ep.indexOf(PAIR_EDGE);
    return `${pairSpot(ecke, UPPER_CORNERS, PAIR_CORNER)}${state.co[ecke]}/${pairSpot(kante, UPPER_EDGES, PAIR_EDGE)}${state.eo[kante]}`;
  },
};

/**
 * Wo ein Stein des Paares liegt, als eine Ziffer.
 *
 * `0` bis `3` sind die Plätze der oberen Ebene in der Reihenfolge des Rings,
 * `4` ist der Platz selbst, in dem der Stein falsch steckt.
 *
 * **`9` heißt «anderswo», und diese Ziffer ist kein Zierrat.** Anders als bei
 * den fünf Blicken der letzten Schicht kann ein Stein dieses Blicks auch in
 * einem **fremden** Platz stecken; dann steht der Blick gar nicht zur Frage.
 * Eine Kennung dafür ist trotzdem nötig, denn `caseIdFor` wird auf jede Lage
 * angewandt, die der Anwender gerade hat. Sie trägt keinen Fall, und
 * `caseFor` liefert deshalb `null`, also dasselbe wie bei einem noch nicht
 * hinterlegten Fall. Ein Wurf wäre hier falsch: Wer den Würfel verdreht hat,
 * hat kein Rechenproblem, sondern eine Lage, für die es nichts anzuwenden gibt.
 */
function pairSpot(platz, obere, eigener) {
  if (platz === eigener) return 4;
  const oben = obere.indexOf(platz);
  return oben < 0 ? 9 : oben;
}

/**
 * Die Kennung des Falls, der bei diesem Blick vorliegt.
 *
 * **Zwei Lagen tragen dieselbe Kennung, wenn dieselbe Zugfolge beide löst.**
 * Der Anwender darf die obere Ebene drehen, bevor er die Folge anwendet, und
 * danach noch einmal, um sie auszurichten. Beides zusammen ergibt sechzehn
 * Lagen, die derselbe Fall sind, und die Kennung ist die kleinste ihrer
 * Merkmale.
 *
 * **Die zweite Drehung ist der Grund, warum der Kern verketten können muss.**
 * Vor die Lage gesetzt wird sie mit `composeStates`; angehängt genügte
 * `applyMove`. Ohne sie zerfiele jeder Fall in mehrere, und die Erkennung
 * meldete für dieselbe Aufgabe verschiedene Antworten.
 */
export function caseIdFor(state, view) {
  const feature = FEATURES[view];
  if (feature === undefined) throw new RangeError(`Unbekannter Blick: ${view}`);
  let kleinste = null;
  for (const vorher of UPPER_TURNS) {
    const angesetzt = composeStates(vorher, state);
    for (const nachher of UPPER_TURNS) {
      const text = feature(composeStates(angesetzt, nachher));
      if (kleinste === null || text < kleinste) kleinste = text;
    }
  }
  return kleinste;
}

/** Die Kennung der Lage, bei der dieser Blick nichts mehr zu tun findet. */
export function solvedIdFor(view) {
  return caseIdFor(solvedCube(), view);
}

/**
 * Der Wortschatz der Zusagen, die ein Fall über seine Pflicht hinaus macht.
 *
 * **Die Pflicht steht hier nicht.** Dass eine Folge ihren Blick löst und stehen
 * lässt, was zu diesem Zeitpunkt bereits stand, ergibt sich aus `view` und der
 * festen Reihenfolge der vier Blicke; kein Fall muss es eigens sagen. Was hier
 * steht, ist allein das, was eine Erklärung darüber hinaus behauptet.
 *
 * **Warum es diese Angabe überhaupt braucht**, ist am 2026-08-25 in
 * 4T-0110 gemessen worden: Die Pflicht allein lässt je Fall zwischen vier und
 * 31104 verschiedene Netto-Wirkungen zu. Beim Fall, in dem die beiden
 * gegenüberliegenden Kantenpaare zu tauschen sind, ist darunter eine, die die
 * Kanten überhaupt nicht anfasst und stattdessen die Ecken vertauscht. Der
 * Würfel steht danach richtig, und eine Erklärung, die von den Kanten spricht,
 * wäre falsch.
 *
 * **Geprüft wird die rohe Netto-Wirkung**, also die Lage, die aus dem gelösten
 * Würfel entsteht, wenn man nur diese Folge anwendet. Nicht bis auf eine
 * Drehung der oberen Ebene: Bis auf Drehung wäre «die Kanten bleiben
 * unberührt» sogar für den Kantentausch selbst wahr, weil dessen Wirkung auf
 * die Kanten dieselbe ist wie eine halbe Drehung der Ebene. Die hinterlegte
 * Folge ist die, die der Anwender ausführt; die Ausrichtung danach ist ein
 * eigener Griff.
 *
 * **Der Wortschatz wächst mit dem Bestand.** Ein neuer Eintrag ist eine Zeile
 * hier und ändert keine Prüfung.
 */
export const PROMISES = {
  cornersUntouched: (effect) =>
    UPPER_CORNERS.every((i) => effect.cp[i] === i && effect.co[i] === 0),
  edgesUntouched: (effect) => UPPER_EDGES.every((i) => effect.ep[i] === i && effect.eo[i] === 0),
  // **Am Platz ist weniger als unberührt**, und der Unterschied ist genau die
  // Drehung. Diese Zusage sagt allein, dass keine Ecke ihren Platz wechselt;
  // wie sie steht, bleibt offen. Für einen Blick, dessen Aufgabe das Drehen
  // ist, wäre `cornersUntouched` nicht bloß falsch, sondern unerfüllbar: Eine
  // Folge, die keine Ecke dreht, löst keinen seiner Fälle.
  //
  // Angelegt am 2026-08-26 in 4T-0115 für den Fall, in dem alle vier Ecken
  // gedreht sind und keine wandert. Gemessen: Von den 288 Netto-Wirkungen, die
  // jenen Fall lösen, halten 12 diese Zusage und 276 nicht.
  cornersInPlace: (effect) => UPPER_CORNERS.every((i) => effect.cp[i] === i),
  // **Die drei bejahenden Zusagen, seit 4T-0157.** Bis dahin kannte der
  // Wortschatz allein verneinende, also was eine Folge **nicht** anfasst; eine
  // Aussage darüber, was sie herstellt, hatte hier keinen Ausdruck. Vier Sätze
  // des Bestands behaupten genau das, und keiner war gedeckt. Entschieden vom
  // Product Owner am 2026-09-03: Der Wortschatz wächst, statt die Sätze zu
  // streichen, denn bei den Texten von 2A-0021 werden bejahende Aussagen
  // häufiger und nicht seltener.
  //
  // **Drei und nicht einer, weil die Zahl zur Aussage gehört.** Ein
  // gemeinsamer Begriff «die Kanten wandern mit» ließe offen, ob drei oder
  // vier, und genau das sagen die Texte verschieden. Wer die Zahl aus der
  // Zusage nimmt, nimmt sie aus der Prüfung.
  //
  // **Sie fragen nach dem Platz und nicht nach der Berührung**, und das ist
  // die schärfere wie die gemeinte Aussage: Gerechnet ist bei allen vier
  // Folgen keine obere Kante gekippt, versetzt und berührt fallen hier also
  // zusammen. Ein Fall, bei dem sie es nicht täten, wäre mit `edgesUntouched`
  // ohnehin nicht zu beschreiben.
  cornersAllMoved: (effect) => UPPER_CORNERS.every((i) => effect.cp[i] !== i),
  edgesThreeMoved: (effect) => UPPER_EDGES.filter((i) => effect.ep[i] !== i).length === 3,
  edgesAllMoved: (effect) => UPPER_EDGES.every((i) => effect.ep[i] !== i),
};

/** Die Zusagen eines Falls, immer als Liste. Ohne Angabe sind es keine. */
export function promisesOf(fall) {
  return fall.effect ?? [];
}

/**
 * Die Fassungen, zu denen ein Fall gehört, immer als Liste.
 *
 * **Ohne Angabe ist es keine, und das ist Absicht.** Bei `effect` steht eine
 * fehlende Angabe für «dieser Fall sagt nichts zu», und das ist eine gültige
 * Aussage. Hier gibt es sie nicht: Ein Fall, der zu keiner Fassung gehört,
 * steht in keiner Fallmenge und fehlt trotzdem nirgends. `validateCase` weist
 * ihn deshalb ab, statt ihn stillschweigend übergehen zu lassen.
 */
export function editionsOf(fall) {
  return fall.editions ?? [];
}

/**
 * Wirft, wenn ein Fall nicht die Form hat, die die Erkennung und die
 * Wirkungsprüfung voraussetzen.
 *
 * Ein eigener Aufruf und nicht bloß eine Schleife im Modulrumpf, damit die
 * Prüfstrecke ihn an einem verdorbenen Fall auslösen kann, ohne den Bestand
 * anzufassen.
 */
export function validateCase(fall) {
  if (FEATURES[fall.view] === undefined) {
    throw new Error(`Fall ${fall.key} nennt den unbekannten Blick ${fall.view}`);
  }
  if (fall.effect !== undefined && fall.effect !== null && !Array.isArray(fall.effect)) {
    throw new Error(`Fall ${fall.key} führt effect weder als Liste noch als null`);
  }
  for (const zusage of promisesOf(fall)) {
    // Ein Tippfehler wäre sonst eine Zusage, die niemand prüft, und sie sähe
    // von einer gehaltenen nicht zu unterscheiden aus.
    if (PROMISES[zusage] === undefined) {
      throw new Error(`Fall ${fall.key} nennt die unbekannte Zusage ${zusage}`);
    }
  }
  // **Die Fassung ist Pflicht und nicht wahlfrei**, anders als `effect`. Ein
  // Fall ohne Fassung stünde in keiner Fallmenge; er fiele niemandem auf,
  // sondern wäre einfach nicht da. Ein Tippfehler in der Fassung wäre dasselbe.
  const fassungen = editionsOf(fall);
  if (!Array.isArray(fall.editions) || fassungen.length === 0) {
    throw new Error(`Fall ${fall.key} nennt keine Fassung`);
  }
  for (const fassung of fassungen) {
    if (!BEKANNTE_FASSUNGEN.has(fassung)) {
      throw new Error(`Fall ${fall.key} nennt die unbekannte Fassung ${fassung}`);
    }
  }
}

/**
 * Woraus der Text eines Falls besteht, in der Reihenfolge der Anzeige.
 *
 * Festgelegt am 2026-08-25 zu 4T-0112 und bindend für jeden Fall. Drei
 * Bausteine und nicht vier: Ein eigener für die Ausrichtung wäre beim Fall
 * ohne gleichfarbiges Paar leer, denn an dem ist gemessen nichts auszurichten.
 * Und nicht die vier der Lektionen aus `view/lektion.js`: Ein Fall hat keine
 * Aufgabe, die gehört dem Lernpfad, und vor allem fehlte dort das
 * Erkennungsbild, also gerade das, was einen Fall ausmacht.
 *
 * **Die Liste steht hier und nicht in `view`.** Bei den Lektionen steht sie
 * dort, weil sie die Anzeige bestimmt; für Fälle gibt es noch keine, und der
 * Bestand ist damit heute der einzige Ort, an dem die Verabredung stehen kann.
 *
 * Die Namen sind deutsch, weil sie im Sprachbaum stehen, und der Bezeichner
 * des Falls davor ist englisch, weil er zum Bestand gehört. Dasselbe Gefälle
 * wie bei `lektion.cross.titel`.
 */
export const CASE_TEXTS = ['name', 'bild', 'erklaerung'];

/**
 * Der Bezeichner, unter dem ein Baustein dieses Falls in `i18n` steht.
 *
 * **Der zusammengesetzte Pfad gehört an eine Stelle und nicht an jede.** Wer
 * die Worte eines Falls braucht, fragt hier und baut die Zeichenkette nicht
 * selbst; sonst stünde die Verabredung zwischen Bestand und Sprachbaum an so
 * vielen Orten, wie es Aufrufer gibt.
 */
export function textKeyFor(fall, teil) {
  if (!CASE_TEXTS.includes(teil)) throw new RangeError(`Unbekannter Baustein: ${teil}`);
  return `fall.${fall.key}.${teil}`;
}

/**
 * Die Fälle der reduzierten Fassung.
 *
 * Ein Fall trägt:
 *
 * - `key` als Bezeichner, über den die Worte in `i18n` gefunden werden,
 * - `view` als einen der vier Blicke,
 * - `id` als Kennung, die `caseIdFor` an der vorliegenden Lage liefert,
 * - `sequence` als Hauptfolge in Notation,
 * - `alternatives` als Liste weiterer Folgen, mindestens eine,
 * - `effect` als Liste der Zusagen aus `PROMISES`, auch leer oder `null`,
 * - `editions` als nichtleere Liste der Fassungen aus `EDITIONS`.
 *
 * **Die Fassung steht als Liste und nicht als einzelner Wert**, seit 4T-0159.
 * Zwischen den beiden Fassungen gibt es keine Rangfolge: Ein Fall des
 * Eckensetzens gehört allein der reduzierten, ein Fall des vollen Umfangs
 * allein diesem, und die vier des Kantensetzens gehören **beiden**, weil sie
 * zugleich vier der einundzwanzig Klassen des zusammengefassten Blicks sind.
 * Ein einzelner Wert könnte das nicht sagen, ohne eine Fassung zur
 * Obermenge der anderen zu erklären, und das wäre falsch.
 *
 * **Sie steht an jedem Fall und nicht nur dort, wo sie nötig wäre.** Bei vier
 * der fünf Blicke ließe sie sich aus dem Blick ableiten; beim Kantensetzen
 * bricht die Ableitung, und das ist genau der Blick, um den es geht. Eine
 * Regel mit einer Ausnahme an der einzigen Stelle, an der die Frage überhaupt
 * gestellt wird, ist keine Regel. Dass die Angabe nicht aus dem Blick folgt,
 * rechnet `test/lessons/cases.test.js` nach.
 *
 * **Die Bezeichner benennen das Merkmal und nicht die Anordnung.** Am
 * 2026-08-25 in 4T-0112 gemessen: Der Fall `0132` enthält vier Anordnungen mit
 * zwei benachbarten vertauschten Ecken, acht mit einem Ringtausch dreier und
 * vier mit einem Ringtausch aller vier. Ein Name nach der Anordnung träfe
 * damit 48 seiner 192 Lagen, und der Zyklentyp «zwei Ecken vertauscht» kommt
 * in **beiden** Fällen vor. Das gleichfarbige Eckenpaar trennt sie dagegen
 * über alle 288 Lagen des Blicks.
 *
 * **Die erste Folge steht auch im Löser, und sie wird hier trotzdem
 * ausgeschrieben.** Sie ist dort `SEQUENCES.topCorners` und löst die Aufgabe
 * von Lektion 7; hier löst sie einen Fall von CFOP. Das sind zwei Gegenstände,
 * die heute dieselbe Folge tragen, und ein Import machte aus dem Befund eine
 * Abhängigkeit: Eine bessere Folge für Lektion 7 wanderte stillschweigend
 * hierher, ohne für diesen Blick gerechnet zu sein. Die eigene Suche in
 * 4T-0112 hat sie unabhängig wiedergefunden, und die Wirkungsprüfung rechnet
 * sie für ihren neuen Fall neu nach.
 *
 * **Der zweite Fall trägt dieselbe Folge zweimal**, mit einer Vierteldrehung
 * dazwischen. Bis elf Züge gibt es für ihn gemessen keine eigene Folge, und
 * eine zweite gelernte Folge für den selteneren der beiden Fälle wäre teurer
 * als ein zweiter Durchgang. Gemessen wird nach dem ersten Durchgang
 * ausnahmslos der erste Fall daraus, aus jeder der vier Haltungen.
 *
 * **Der zweite Fall trägt keine Zusage.** Keine der sechzehn kürzesten Folgen
 * lässt verdoppelt die oberen Kanten unberührt; eine Zusage stünde hier also
 * gegen die Messung. Der nächste Blick setzt die Kanten ohnehin.
 *
 * **Der Prüfkörper in `test/lessons/cases.test.js` trägt dieselbe erste
 * Folge, und das bleibt so.** Entschieden am 2026-08-25 in 4T-0112: Er misst
 * die Wirkungsprüfung und nicht den Bestand, und drei seiner sieben Brüche
 * nennen Zahlen, die am Bestand aufgehängt stillschweigend mitwanderten. Wer
 * hier eine Folge austauscht, ändert deshalb dort nichts.
 *
 * **Dasselbe gilt für den zweiten Prüfkörper und den Blick auf die Kanten.**
 * Entschieden am 2026-08-25 in 4T-0113. Dort ist die Doppelung sogar kleiner:
 * Der Prüfkörper trägt `SEQUENCES.topEdges`, und diese Folge steht hier
 * nirgends, denn sie verlangt die stehende Kante hinten statt vorn. Gedoppelt
 * ist allein die Kennung `0123/0312`.
 *
 * **Die Bezeichner der Kantenfälle benennen die Anordnung, und bei den Ecken
 * wäre das falsch gewesen.** Der Unterschied ist am 2026-08-25 in 4T-0113
 * gemessen: Beim Eckensetzen enthält eine Klasse drei verschiedene Zyklentypen,
 * beim Kantensetzen trägt jede Klasse genau einen. Der Grund steht oben an
 * `FEATURES`: Der vierte Blick liest die Ecken mit, und damit wird die
 * Anordnung der Kanten eindeutig.
 *
 * **Jede der vier Kantenfolgen ist eine eigene und kein zweiter Durchgang.**
 * Anders als beim zweiten Eckenfall gibt es für jeden der vier Fälle eine
 * eigene Folge; gemessen in 4T-0113 über eine Begegnungssuche, die bis elf
 * Züge vollständig ist und für den Fall ohne Fund bis zwölf reicht. Ein
 * zweiter Durchgang käme auf neunzehn Züge und ließe die Ecken nicht unberührt.
 *
 * **Die Hauptfolge ist die griffnahe und nicht die kürzeste.** Für die beiden
 * Ringtausche gibt es Folgen mit neun Zügen; sie greifen vier Seiten an und
 * verlangen zwei Gegengriffe zugleich, und ihre vier Fassungen sind dieselbe
 * Bewegung. Die elfzügigen kommen mit zwei Seiten aus und haben eine Fassung
 * für die andere Hand. Die kurzen stehen deshalb als zweite Alternative.
 *
 * **Der Bestand folgt der Reihenfolge der vier Blicke.** Seit 4T-0114 stehen
 * die Fälle des Kantenkippens vorn, weil ihr Blick der erste ist; die sechs
 * des Setzens sind dabei unverändert geblieben und nur nach hinten gerückt.
 * Innerhalb eines Blicks ordnet die Kennung.
 *
 * **Die Bezeichner des Kantenkippens benennen das Bild**, und das ist bei
 * diesem Blick dasselbe wie das Merkmal: Die Anordnung der Kanten steht hier
 * überhaupt nicht zur Frage, allein ihre Kippung. Punkt, Linie und Winkel sind
 * dieselben drei Bilder wie in Lektion 5 und werden nicht neu benannt.
 *
 * **Die Folge der Linie steht auch im Löser, und sie wird hier trotzdem
 * ausgeschrieben.** Sie ist dort `SEQUENCES.topCross` und löst die Aufgabe von
 * Lektion 5; hier löst sie einen Fall von CFOP. Dieselbe Festlegung wie oben
 * für `topCorners`, mit derselben Begründung, und diesmal deckt sich sogar die
 * Haltung: Lektion 5 verlangt die Linie quer, und genau das verlangt die
 * Konvention dieses Bestands. Beim Kantensetzen war das anders, denn
 * `topEdges` verlangt die stehende Kante hinten statt vorn.
 *
 * **Kein Fall des Kantenkippens trägt eine Zusage.** Gemessen an allen acht
 * sechszügigen Folgen dieses Blicks: Keine hält `cornersUntouched`, keine hält
 * `edgesUntouched`. Das ist kein Mangel, sondern die Aufgabe dieses Blicks. Er
 * ordnet die Orientierung, und die Anordnung setzen die beiden späteren Blicke.
 *
 * **Der Punkt trägt zwei Folgen in einer, verbunden durch eine feste
 * Halbdrehung.** Bis zehn Züge gibt es für ihn gemessen keine eigene Folge; die
 * Suche lief dreimal, zuletzt gegen eine Tabelle von 8240087 Lagen. Die
 * hinterlegte Folge ist die Linienfolge, `U2` und die Winkelfolge, und sie löst
 * alle 7776 Lagen aus jeder Haltung. **Die Halbdrehung ist nicht schmückend:**
 * Die Winkelfolge ist die Umkehrung der Linienfolge, ohne Drehung dazwischen
 * heben sich beide auf. Mit `U` oder `U'` löst die Verkettung keine einzige
 * Lage, und in umgekehrter Reihenfolge ebenso wenig.
 *
 * **Die Bezeichner des Eckendrehens benennen die Sollhaltung**, also was der
 * Anwender sieht, nachdem er ausgerichtet hat: wie viele Ecken schon oben
 * stehen und wo sie liegen. Dieselbe Regel wie bei `cornersMatchedPair` und
 * anders als beim Kantenkippen, wo Bild und Merkmal denselben Namen tragen. Der
 * Grund ist, dass bei diesem Blick sieben Fälle **dieselben drei Merkmalsarten**
 * teilen: Die Zahl der stehenden Ecken ist 1, 1, 2, 2, 2, 0, 0 und trennt sie
 * nicht.
 *
 * **Ausgezeichnet sind die Seiten, an denen keine Oberfarbe klebt.** Entschieden
 * am 2026-08-26 in 4T-0115 aus vier gerechneten Kandidaten. Er ist der einzige,
 * der bei **jedem** der sieben Fälle eine Forderung stellt; die drei anderen
 * zeichnen bei zwei, drei oder vier Fällen null oder alle vier Seiten aus und
 * lassen den Anwender dort ohne Ansage. Er ist zugleich die Entsprechung zu der
 * Auszeichnung des Kantenkippens, die ebenfalls das Fehlende benennt.
 *
 * **Jede Folge dieses Blicks löst aus genau einem Bild.** Über alle 7488
 * Netto-Wirkungen der sieben Fälle gemessen. Daraus folgt, dass Hauptfolge und
 * Alternative genau dann dieselbe Haltung verlangen, wenn sie aus demselben
 * Bild stammen; beim Kantenkippen war das noch eigens zu prüfen.
 *
 * **Jeder der sieben trägt eine eigene Folge und keinen zweiten Durchgang.**
 * Gemessen über 174 lösende Verkettungen aus je zwei Folgen des Bestands, mit
 * jeder Zwischendrehung: Keine ist kürzer als die eigene Folge ihres Falls, und
 * der Abstand beträgt drei bis acht Züge. Beim zweiten Eckenfall und beim Punkt
 * war es umgekehrt, dort stand die Entscheidung vor einer leeren Suche.
 *
 * **Drei der sieben tragen als Alternative keine gespiegelte Fassung**, und das
 * ist gemessen und nicht versäumt. `cornersOneUpFrontLeft` und
 * `cornersOneUpFrontRight` sind füreinander das Spiegelbild; wer den einen
 * spiegelt, bekommt den anderen. Bei `cornersTwoUpDiagonal` liegt die
 * gespiegelte Fassung im gegenüberliegenden Bild desselben Falls und verlangte
 * damit eine andere Haltung. Dort ist die Alternative eine andere Folge aus
 * demselben Bild.
 *
 * **Zwei Folgen dieses Blicks verwirft Lektion 8 ausdrücklich**, und zwar in
 * gedrehter Fassung: `B U B' U B U2 B'` ist `R U R' U R U2 R'` um drei Viertel
 * gedreht, `L U2 L' U' L U' L'` ist `R U2 R' U' R U' R'` um zwei. Beide
 * vertauschen drei Kanten und alle vier Ecken oben und machen damit im
 * Anfängerverfahren die Arbeit aus Lektion 6 und 7 zunichte. **Hier ist
 * derselbe Schaden keiner**, denn zu diesem Zeitpunkt ist oben noch nichts
 * gesetzt; die beiden folgenden Blicke setzen es. Die Rechnung dazu steht in
 * `test/lessons/cases.test.js`, die zur Untauglichkeit unverändert in
 * `test/solver/beginner.test.js`.
 *
 * ## Die siebzehn Fälle des vollen Umfangs, seit 4T-0160
 *
 * **Sie stehen unter demselben Blick wie die vier darüber und tragen allein
 * die volle Fassung.** Der Unterschied ist nicht der Blick, sondern was vor
 * ihm steht: In der Kette sind die Ecken gesetzt, wenn er an die Reihe kommt,
 * im vollen Umfang ist nur orientiert. Aus fünf Klassen werden zweiundzwanzig,
 * und die vier hinterlegten sind vier davon.
 *
 * **Der Bezeichner ist dreiteilig, und der dritte Teil steht nur, wo er
 * trennt.** Entschieden vom Product Owner am 2026-09-04, gerechnet in
 * 4T-0160 über alle 288 Lagen:
 *
 * 1. Das **Eckenmerkmal**, also `matchedPair` für die zwölf Klassen mit einem
 *    gleichfarbigen Eckenpaar und `noMatchedPair` für die fünf ohne eines. Das
 *    ist die Regel des Eckensetzens, unverändert angewandt; die vier Klassen
 *    mit gesetzten Ecken sind die vier oben und behalten ihre Namen.
 * 2. Die **Anordnung der Kanten gegen die Ecken gerechnet**, also
 *    `edgesAlong`, `cycleClockwise`, `cycleCounterClockwise`, `swapNeighbours`
 *    und `swapOpposite`. Das ist die Regel des Kantensetzens, unverändert
 *    angewandt. Absolut ist der Zyklentyp der Kanten je Klasse nicht konstant,
 *    gegen die Ecken gerechnet sehr wohl.
 * 3. Die **Lage gegenüber dem gleichfarbigen Eckenpaar**, aber nur bei den
 *    zehn Fällen, bei denen die ersten beiden Teile mit einem anderen Fall
 *    zusammenfielen. Bei den beiden Ringtauschen ist es die Seite, an der die
 *    stehende Kante liegt, beim Tausch benachbarter Paare die Seite, mit der
 *    die vordere Kante tauscht. **Elf Namen bleiben zweiteilig**, und zwei
 *    davon tragen den dritten Teil deshalb nicht, weil ihre Kantenanordnung
 *    symmetrisch ist und das Paar an jeder der vier Seiten liegen kann.
 *
 * **Die Hauptfolge ist die griffnahe und nicht die kürzeste**, wie bei den
 * vier oben. Gemessen und angewandt ist dabei diese Reihenfolge: keine zwei
 * Gegengriffe zugleich, dann wenige Seiten, dann die kürzere Folge, und erst
 * zuletzt die rechte Hand. **Was sie kostet, ist gemessen**: Acht der
 * siebzehn Fälle zahlen einen Aufschlag, sechsmal zwei Züge und zweimal
 * einen, zusammen vierzehn Züge. Dafür kommt keine der siebzehn Folgen über
 * drei Seiten hinaus, wo die kürzeste bei vier Fällen fünf greift und zwei
 * Gegengriffe zugleich verlangt. **Die Alternative bedient die andere Hand**,
 * und dass sie dieselbe Haltung verlangt, rechnet die Prüfstrecke nach.
 *
 * **Der Aufschlag ist am 2026-09-06 in 4T-0185 nachgemessen und unverändert
 * bestätigt**, die Zahl der Seiten dagegen von fünf Fällen auf vier
 * berichtigt. Beide Zahlen stammten aus einer Suche ohne vollständige
 * Aufzählung, die je Fall nur **eine** kürzeste Folge nennt; deren Seitenzahl
 * ist damit zufällig. **Bei acht der siebzehn Fälle tragen die kürzesten
 * Folgen verschiedene Seitenzahlen nebeneinander**, bei `0321/0132` etwa drei,
 * vier und fünf. Die alte Zahl zählte einen solchen Fall mit, für den es sehr
 * wohl eine kürzeste Folge über drei Seiten gibt. **Nur bei vier Fällen kommt
 * keine kürzeste Folge unter fünf Seiten aus**, nämlich bei `0132/1302`,
 * `0132/2031`, `0132/2310` und `0132/3201`, und das sind genau vier der sechs,
 * die zwei Züge zahlen.
 *
 * **Keine der siebzehn Folgen ist ein zweiter Durchgang.** Gemessen in
 * 4T-0162: Zwölf Fälle brauchen bis zwölf Züge, fünf dreizehn und vier
 * vierzehn. Beim zweiten Eckenfall und beim Punkt stand die Entscheidung vor
 * einer leeren Suche, hier bei keinem.
 *
 * **Sechs Fälle tragen keine Zusage**, und das ist gemessen und nicht
 * versäumt: Für sie hält keine der sechs Zusagen des Wortschatzes, weil die
 * Folge zu diesem Zeitpunkt Ecken **und** Kanten setzen muss und deshalb
 * beide anfasst. Wo eine Zusage steht, ist sie über die ganze Klasse
 * nachgerechnet und schließt gemessen etwas aus.
 *
 * ## Die sieben Fälle mit stehendem Kreuz, seit 4T-0175
 *
 * **Sie sind die ersten des Blicks auf die ganze Orientierung**, und sie
 * tragen keine neue Zugfolge. Die sieben Folgen des Eckendrehens lösen sie
 * vollständig, Hauptfolge und Alternative, gemessen am 2026-09-05 über alle
 * 7488 Lagen ihrer Klassen. Der Grund ist der Zuschnitt: Steht das Kreuz
 * bereits, ist von der ganzen Orientierung nur noch die Aufgabe des
 * Eckendrehens übrig.
 *
 * **Es sind trotzdem neue Einträge und keine erweiterte Fassungsangabe**, und
 * darin liegt der Unterschied zum Setzen. Dort stehen vier Fälle in beiden
 * Fassungen unter demselben Blick, und `editions` trennt sie; hier ist der
 * Blick des vollen Umfangs ein anderer als beide Blicke der reduzierten
 * Fassung, und ein Fall gehört zu genau einem Blick. Die Kennung `0000/0012`
 * und die Kennung `0012` sind zwei verschiedene Stellen.
 *
 * **Für die drei Fälle des Kantenkippens gilt das ausdrücklich nicht.** Ihre
 * Folgen verdrehen die Ecken; `edgesAngle` löst unter diesem Blick den Fall
 * `0011/0210` und nicht `0011/0000`. Die drei Fälle, bei denen allein die
 * Kanten zu kippen sind, brauchen deshalb eigene Folgen und stehen in
 * 4T-0176, 4T-0177 und 4T-0179.
 *
 * **Der Bezeichner ist dreiteilig, und der dritte Teil steht nur, wo er
 * trennt.** Entschieden vom Product Owner am 2026-09-05, gerechnet in 4T-0175
 * über alle 62208 Lagen:
 *
 * 1. Das **Bild der Kanten**, also `cross`, `dot`, `line` oder `angle`. Es
 *    steht vorn, weil es das zuerst Sichtbare ist und weil es zugleich die
 *    Gruppe ist, aus der die Erkennungsübung ihre Ablenker zieht.
 * 2. Die **Sollhaltung der Ecken**, also die Regel des Eckendrehens,
 *    unverändert angewandt. Diese sieben tragen damit dieselbe Ansage wie die
 *    sieben Fälle, die sie im vollen Umfang ablösen.
 * 3. Die **Lage des Kantenbildes in der Arbeitshaltung**, also in der Haltung,
 *    aus der die hinterlegte Folge löst, und nur dort, wo die ersten beiden
 *    Teile mit einem anderen Fall zusammenfielen. **Beim Kreuz nie**, denn sein
 *    Bild sieht aus jeder Haltung gleich aus; alle sieben Namen hier bleiben
 *    zweiteilig.
 *
 * **Der dritte Teil las bis 4T-0177 die Haltung der Eckenansage und nicht die
 * Arbeitshaltung.** Berichtigt am 2026-09-05, und der Grund ist gemessen: Bei
 * **24 der 57 Fälle** gibt es überhaupt keine Haltung, in der zugleich die
 * Ecken ihre kleinste Lesart zeigen und die ausgezeichnete Seite vorn liegt.
 * Sechs davon standen da bereits im Bestand, drei mit stehendem Kreuz und drei
 * mit dem Punkt, und ihre Namen folgten immer schon der Arbeitshaltung: Bei
 * `crossOneUpFrontLeft` liegt die fertige Ecke beim Anwenden nachgerechnet
 * vorn links, obwohl das nicht die Haltung der kleinsten Lesart ist. Nach der
 * alten Fassung hätten zwei Namen der Linie das Gegenteil dessen angesagt, was
 * der Anwender vor sich hat.
 *
 * **Der Preis ist benannt und nicht übergangen:** Ein Name steht erst fest,
 * wenn seine Folge gewählt ist, und dass alle Namen trennen, ist je Task
 * nachzurechnen statt einmal vorab. Entschieden vom Product Owner am
 * 2026-09-05 aus drei vorgelegten Wegen; die beiden anderen hätten den Namen
 * unwahr werden lassen oder die Ausrichtungsregel aller siebenundfünfzig
 * angefasst.
 *
 * **Die Zusagen sind die der Fälle des Eckendrehens**, unverändert. Die
 * Netto-Wirkung einer Folge hängt nicht davon ab, unter welchem Blick sie
 * steht, und die Wirkungsprüfung rechnet jede von ihnen für ihren neuen Fall
 * neu nach.
 *
 * ## Die acht Fälle mit dem Punkt, seit 4T-0176
 *
 * **Sie sind die ersten des vollen Umfangs mit eigener Zugfolge.** Keine der
 * vier oberen Kanten zeigt nach oben, und deshalb trägt keiner von ihnen die
 * Folge eines Falls der reduzierten Fassung: Die Folgen des Eckendrehens
 * lassen die Kanten stehen, und die des Kantenkippens verdrehen die Ecken.
 * Alle sechzehn Folgen sind am 2026-09-05 in diesem Projekt gesucht und ohne
 * Tabelle und Zielmenge gegen jede Lage ihrer Klasse nachgerechnet worden.
 *
 * **Bis zehn Züge ist der Zugraum leer**, für alle acht gemessen. Sieben
 * Folgen haben elf Züge, die des Falls mit den vier stehenden Ecken dreizehn.
 * Ein zweiter Durchgang steht bei keinem.
 *
 * **Die Hauptfolge ist die griffnahe und nicht die kürzeste**, nach derselben
 * Reihenfolge wie beim Setzen: keine zwei Gegengriffe zugleich, dann wenige
 * Seiten, dann die kürzere Folge, und erst zuletzt die rechte Hand. Alle acht
 * kommen mit drei Seiten aus. **Was das kostet, ist gemessen:** Zwei Fälle
 * zahlen je einen Zug Aufschlag gegenüber der kürzesten Folge über alle
 * Seiten, zusammen zwei.
 *
 * **Am 2026-09-06 in 4T-0185 nachgemessen und unverändert bestätigt**, diesmal
 * über die vollständige Aufzählung aller kürzesten Folgen statt über eine
 * Suche, die je Fall nur eine kurze nennt. Es sind `dotAllUp` mit zwölf gegen
 * dreizehn Züge und `dotTwoUpFrontShared` mit elf gegen zwölf; bei beiden
 * braucht die kürzeste Folge vier Seiten statt drei, und genau das ist der
 * Grund der Wahl.
 *
 * **Die Alternative bedient die andere Hand, und dass sie dieselbe Haltung
 * verlangt, ist vor der Wahl gemessen worden.** Das war nötig und nicht
 * vorsorglich: Von den acht Folgen, die die Suche über die linke Hand zuerst
 * fand, verlangen **fünf** eine andere Haltung. Für den Anwender wäre das eine
 * zweite Ausrichtung und keine Wahl der Hand, und die Prüfstrecke hätte es
 * gemeldet.
 *
 * **Alle acht Bezeichner sind zweiteilig**, denn das Bild des Punktes sieht
 * wie das des Kreuzes aus jeder Haltung gleich aus. `dotAllUp` trägt dabei
 * einen zweiten Teil, den der Bestand noch nicht kannte: Beim Eckendrehen
 * kommt der Fall, in dem bereits alle vier Ecken stehen, nicht vor, weil dort
 * nichts mehr zu tun wäre. Er reiht sich in `TwoUp`, `OneUp` und `NoneUp` ein.
 *
 * **`dotTwoUpFrontShared` trägt keine Zusage**, und das ist gemessen und nicht
 * versäumt: Von den sechs Zusagen des Wortschatzes hält für seine Hauptfolge
 * keine. Seine Alternative hielte zwei; eine Zusage steht aber am Fall und
 * gilt für jede seiner Folgen.
 *
 * **`dotOneUpFrontLeft` und `dotOneUpFrontRight` sind das einzige Spiegelpaar
 * dieser acht**, die übrigen sechs sind selbstgespiegelt. Ihre Folgen spiegeln
 * einander buchstäblich, Hauptfolge wie Alternative, und darauf beruht der
 * kurze Text des zweiten. Die Wahl der Hand folgt dem Fall: Wo die fertige
 * Ecke vorn links liegt, greift die linke Hand.
 *
 * ## Die sieben Fälle der Linie mit vier und zwei stehenden Ecken, seit 4T-0177
 *
 * **Sie sind die ersten mit dreiteiligen Namen.** Bei Kreuz und Punkt trennen
 * die ersten beiden Teile, weil beide Kantenbilder aus jeder Haltung gleich
 * aussehen; die Linie hat eine Richtung, und deshalb tragen sechs dieser
 * sieben einen dritten Teil. Alle vierzehn Folgen sind am 2026-09-05 in diesem
 * Projekt gesucht und ohne Tabelle und Zielmenge gegen jede Lage ihrer Klasse
 * nachgerechnet worden.
 *
 * **Die Linie liegt näher am Ziel als der Punkt.** Sechs bis zwölf Züge gegen
 * elf bis dreizehn dort, gefunden in 24 Sekunden mit derselben Tiefe, die
 * 4T-0176 gemessen hat. `lineTwoUpRightShared` kommt mit sechs Zügen aus und
 * ist damit die kürzeste Folge des ganzen vollen Umfangs.
 *
 * **Zwei Fälle heißen nach der Lage der fertigen Ecken und nicht nach der
 * Richtung der Linie**, nämlich das Spiegelpaar `lineTwoUpDiagonalFrontRight`
 * und `lineTwoUpDiagonalFrontLeft`. In der Arbeitshaltung liegt die Linie bei
 * beiden quer; was sie trennt, ist die Diagonale, auf der die beiden fertigen
 * Ecken liegen. Das ist der Fall, für den die Regel oben «nur dort, wo die
 * ersten beiden Teile zusammenfielen» den dritten Teil vorsieht, und der
 * Bestand benennt ihn wie das Spiegelpaar des Punktes: nach links und rechts.
 *
 * **`lineTwoUpRightShared` trägt als einziger eine Eckenlage, die der geführte
 * Weg nicht kennt.** Beim Eckendrehen heißt derselbe Eckenfall
 * `TwoUpFrontShared`, weil dort die beiden fertigen Ecken vorn liegen. Hier
 * liegen sie rechts, und zwar in jeder Haltung, die die Ausrichtung zulässt;
 * gemessen ist, dass keine seiner vier Haltungen beides zugleich trägt. Der
 * Name folgt dem, was der Anwender sieht.
 *
 * **Seine Alternative greift dieselbe Hand wie die Hauptfolge**, und das ist
 * die eine Abweichung dieses Tasks. Beide Folgen des Falls, `F R U R' U' F'`
 * und `B' R' U' R U B`, arbeiten über die rechte Seite. Der Grund ist
 * gemessen: Die linkshändigen Folgen lösen denselben Fall aus der gespiegelten
 * Haltung, in der die fertigen Ecken links liegen, und eine Alternative in
 * anderer Haltung wäre für den Anwender eine zweite Ausrichtung statt einer
 * Wahl. Die Wahl steht hier zwischen zwei Haltungen und nicht zwischen zwei
 * Händen; gewählt ist die rechte, weil die Vorzugshand des Bestands die rechte
 * ist. Über vier Seiten ist bis zehn Züge keine linkshändige Folge dieser
 * Haltung gefunden worden.
 *
 * **Was die Griffnähe kostet, ist gemessen und beträgt drei Züge über alle
 * sieben.** `lineAllUp` zahlt zwei, zwölf Züge über drei Seiten gegen zehn
 * über vier, und `lineTwoUpFrontSplitCrosswise` einen, elf gegen zehn. Die
 * übrigen fünf tragen die kürzeste Folge, die es über alle Seiten gibt.
 * Gewählt wird nach derselben Reihenfolge wie beim Punkt: erst wenige Seiten,
 * dann die kürzere Folge.
 *
 * **Am 2026-09-06 in 4T-0185 nachgemessen und unverändert bestätigt**, über
 * die vollständige Aufzählung aller kürzesten Folgen. Die beiden zahlenden
 * Fälle sind dieselben, und bei beiden braucht die kürzeste Folge vier Seiten.
 *
 * **`lineTwoUpDiagonalFrontRight` und `lineTwoUpDiagonalFrontLeft` tragen
 * keine Zusage.** Von den sechs des Wortschatzes hält für ihre Folgen keine;
 * ihre Texte machen deshalb keine Wirkungsaussage.
 *
 * **`lineAllUp` ist der zweite der drei Fälle der linken Spalte.** Wie
 * `dotAllUp` stehen bei ihm alle vier Ecken bereits, und die Folge des
 * Kantenkippens verdrehte sie; er braucht deshalb eine eigene. Anders als
 * jener wirkt sie nicht aus jeder Haltung, sondern aus zweien: Die Linie ist
 * unter einer halben Drehung dieselbe Lage, und das Erkennungsbild zeichnet
 * genau die beiden Seiten aus, an denen die Kante noch nicht steht.
 *
 * ## Die acht Fälle der Linie mit einer und keiner stehenden Ecke, seit 4T-0178
 *
 * **Mit ihnen trägt das Kantenbild der Linie alle fünfzehn Fälle.** Höchstens
 * eine Ecke steht bereits, die Folge hat also drei oder vier Ecken zu drehen
 * und zugleich zwei Kanten zu kippen. Alle sechzehn Folgen sind am 2026-09-05
 * in diesem Projekt gesucht und ohne Tabelle und Zielmenge gegen jede Lage
 * ihrer Klasse nachgerechnet worden.
 *
 * **Sie sind kürzer als die acht mit dem Punkt und nicht länger, obwohl mehr
 * zu tun ist.** Zehn bis zwölf Züge gegen elf bis dreizehn; die kürzeste über
 * alle fünf Seiten liegt bei jedem der acht bei zehn oder elf. **Was die
 * Griffnähe kostet, ist gemessen und beträgt drei Züge über alle acht**, je
 * einen bei den beiden Fällen mit einer stehenden Ecke und querer Linie und
 * einen bei den beiden Paaren seitlich mit querer Linie. Die übrigen fünf
 * tragen die kürzeste Folge, die es über alle Seiten gibt.
 *
 * **Am 2026-09-06 in 4T-0185 nachgemessen und unverändert bestätigt**, über
 * die vollständige Aufzählung aller kürzesten Folgen. Bestätigt ist dabei
 * beides, der Aufschlag von drei Zügen über dieselben drei Fälle und die
 * Spanne der kürzesten Folgen von zehn oder elf Zügen bei jedem der acht. Bei
 * allen drei zahlenden Fällen braucht die kürzeste Folge vier Seiten.
 *
 * **Der dritte Namensteil trennt hier vier Paare und nicht eines.** Je zwei
 * der acht tragen dieselbe Sollhaltung der Ecken, und allein die Lage der
 * Linie in der Arbeitshaltung unterscheidet sie: `0101/0111` gegen
 * `0101/1011`, `0101/0222` gegen `0101/2022`, `0101/1122` gegen `0101/1221`
 * und `0101/1212` gegen `0101/2121`. Gemessen über alle 62208 Lagen, je Klasse
 * ohne Abweichung. **Für jeden der acht ist die Folge so gewählt, dass ihre
 * Arbeitshaltung die Ansage des zweiten Namensteils trifft**, also die fertige
 * Ecke wirklich vorn links oder vorn rechts liegt und das Paar wirklich
 * hinten; anders als bei `lineTwoUpRightShared` musste dafür kein Namensteil
 * vom geführten Weg abweichen.
 *
 * **Die Spiegelung überquert dabei die Sollhaltung.** Die beiden Spiegelpaare
 * sind `0101/0111` mit `0101/2022` und `0101/0222` mit `0101/1011`, also
 * jeweils ein Fall der einen Sollhaltung mit einem der anderen. Der zweite
 * Partner trägt nach der Staffelungsregel den kurzen Text und als Folge die
 * Spiegelung der ersten; beide sind gemessen nicht länger als die beste eigene
 * Folge ihres Falls. **Die vier übrigen sind selbstgespiegelt**, und dort ist
 * die Alternative die Spiegelung der Hauptfolge.
 *
 * **Vier der acht tragen keine Zusage**, nämlich die vier mit einer stehenden
 * Ecke. Der Grund ist gemessen: Hauptfolge und Alternative halten dort keine
 * gemeinsame Zusage des Wortschatzes, und eine Zusage, die nur die Hauptfolge
 * hält, wäre für die Alternative unwahr. Die vier übrigen tragen, was beide
 * Folgen halten.
 *
 * **Bei zwei Fällen steht die Alternative über vier Seiten**, nämlich bei
 * `lineOneUpFrontRightCrosswise` und seinem Spiegelbild. Über drei Seiten gibt
 * es in ihrer Haltung keine zweite Folge bis dreizehn Züge; die gewählte hält
 * die andere Hand und nimmt dafür die hintere Seite dazu.
 *
 * **`lineNoneUpSidePairsLengthwise` ist der neunte Eintrag in der Liste der
 * Fälle ohne Ansage** in `cases.test.js` und von derselben Art wie der achte:
 * Er sieht aus zwei der vier Haltungen gleich aus, seine Folge wirkt aus
 * denselben zweien, und was fehlt, ist die maschinelle Ansage. Er ist einer
 * der vier Fälle, die die Prüfung «die Ausrichtung legt die Haltung fest» seit
 * 4T-0155 namentlich führt; sein Erkennungsbild nennt die Haltung deshalb
 * ausdrücklich, über die Zahl der Oberfarben in der obersten Reihe je Seite.
 *
 * ## Die dreizehn Fälle des Winkels mit vier und zwei stehenden Ecken, seit 4T-0179
 *
 * **Sie sind die größte Gruppe des Bestands und die Probe auf das
 * Namensschema.** Zwölf von ihnen liegen in derselben Zelle der Kreuztabelle
 * aus 4T-0175, tragen also dasselbe Kantenbild und dieselbe Zahl stehender
 * Ecken; was sie trennt, muss der Name leisten. Alle sechsundzwanzig Folgen
 * sind am 2026-09-06 in diesem Projekt gesucht und ohne Tabelle und Zielmenge
 * gegen jede Lage ihrer Klasse nachgerechnet worden.
 *
 * **Der dritte Namensteil trägt beim Winkel zwei Werte und nicht vier**, und
 * das ist der Befund dieses Tasks. Die Tabelle in 4T-0175 hatte «hinten links,
 * hinten rechts, vorn rechts, vorn links» vorhergesagt. Gemessen an allen
 * 62208 Lagen lässt die Ausrichtungsregel bei zwölf der dreizehn Fälle nur
 * Haltungen zu, in denen der Winkel **vorn** liegt; hinten kommt nie vor. Der
 * eine Fall ohne Ansage ist die Ausnahme, und auch er ist so gewählt.
 *
 * **Deshalb nennt der zweite Namensteil die sichtbare Eckenlage und nicht die
 * Ansage des geführten Weges.** Das setzt fort, was `lineTwoUpRightShared` in
 * 4T-0177 als Einzelfall getan hat, und der Grund ist derselbe: Der Name folgt
 * dem, was der Anwender vor sich hat. Sechs der dreizehn zeigen in ihrer
 * Arbeitshaltung eine Eckenlage, die der geführte Weg nicht kennt; zwei Werte
 * sind dafür neu, `BackSplit` für das getrennte Paar hinten und `LeftShared`
 * für das Paar links. **So gelesen trennen die Namen alle dreizehn**, und dass
 * sie es tun, ist gegen alle 63 bestehenden Bezeichner nachgerechnet.
 * Entschieden vom Product Owner am 2026-09-06.
 *
 * **Die Ablesung ist vor der Deutung geprüft**, nach Lehre 4 in Abschnitt 14.6
 * der Konventionen: Für jeden der dreißig bestehenden Fälle dieses Blicks
 * zeigt sie in der Arbeitshaltung genau das, was sein Name ansagt, dreißig von
 * dreißig ohne Abweichung.
 *
 * **Die Griffnähe kostet hier nichts**, und das ist gemessen und nicht
 * erwartet: Bei allen dreizehn ist die gewählte Folge so kurz wie die kürzeste
 * über alle fünf Seiten, sechs bis elf Züge. In 4T-0177 und 4T-0178 kostete
 * sie je drei Züge. Der Grund liegt an der Ausrichtungsregel: Sie legt die
 * Haltung ohnehin fest, und die kürzesten Folgen liegen gerade dort.
 *
 * **`angleTwoUpLeftSharedRight` trägt die Folge des Kantenkippens**, also
 * `F U R U' R' F'` aus `edgesAngle`, und `angleTwoUpRightSharedLeft` ihre
 * Spiegelung. Das ist die Einlösung der Rechnung aus 4T-0175: Jene Folge löst
 * unter diesem Blick den Fall `0011/0210` und nicht `0011/0000`. **Der Fall
 * der linken Spalte bekommt seine eigene**, neun Züge über drei Seiten, und
 * damit ist die Spalte mit `angleAllUp` vollständig.
 *
 * **`angleTwoUpDiagonalFrontRightRight` macht keine Ansage** und ist der zehnte
 * Eintrag in der Liste der Fälle ohne Ausrichtung in `cases.test.js`. Er war
 * dort seit 4T-0155 als vierter der namentlich geführten Fälle angekündigt;
 * sein Erkennungsbild nennt die Haltung deshalb ausdrücklich.
 *
 * **Vier der dreizehn tragen keine Zusage**, nämlich die beiden Spiegelpaare
 * mit dem getrennten Paar hinten und dem Paar vorn. Hauptfolge und Alternative
 * halten dort keine gemeinsame Zusage des Wortschatzes, und eine Zusage, die
 * nur die Hauptfolge hält, wäre für die Alternative unwahr. **Bei zweien ist
 * die Alternative eigens danach gewählt worden**: Zu `angleAllUp` und zu
 * `angleTwoUpDiagonalFrontRightRight` gibt es je mehrere linkshändige Folgen
 * derselben Haltung, und die gewählte ist die, die die Zusage der Hauptfolge
 * mitträgt.
 *
 * **Drei sind selbstgespiegelt und zehn bilden fünf Spiegelpaare**, gerechnet
 * an den Zugfolgen und damit gegen die Zahlen aus 4T-0175 geeicht, die dort an
 * den Lagen entstanden. Bei allen fünf Paaren sind Hauptfolge **und**
 * Alternative des zweiten Partners die Spiegelungen der ersten, und keine ist
 * länger als die beste eigene Folge ihres Falls.
 *
 * ## Die acht Fälle des Winkels mit einer stehenden Ecke, seit 4T-0180
 *
 * **Sie belegen als erste Gruppe des Bestands ein volles Raster**, nämlich die
 * vier Eckenlagen mal die zwei Winkellagen. Genau eine obere Ecke steht bereits,
 * die Folge hat also drei Ecken zu drehen und zwei Kanten zu kippen. Alle
 * sechzehn Folgen sind am 2026-09-06 in diesem Projekt gesucht und ohne Tabelle
 * und Zielmenge gegen jede Lage ihrer Klasse nachgerechnet worden.
 *
 * **Der Winkel liegt auch hier bei allen acht vorn**, und das ist gewählt und
 * nicht vorgefunden: Bei vier der acht lässt die Ausrichtungsregel nur eine
 * einzige Haltung zu, bei den vier übrigen drei, und unter deren zwölf Optionen
 * sind sechs mit dem Winkel hinten. Der dritte Namensteil behält damit die zwei
 * Werte, die 4T-0179 für den Winkel gemessen hat, und der zweite bekommt die
 * beiden Werte `OneUpBackLeft` und `OneUpBackRight` dazu.
 *
 * **Die Wahl der vier freien Haltungen ist gemeinsam getroffen und nicht je
 * Fall**, denn sie hängen zusammen. Zwei der zwölf Optionen tragen einen Namen,
 * den ein Fall mit fester Haltung bereits führt, und fallen deshalb weg. Unter
 * den übrigen ist bei `0011/0111`, `0011/0222` und `0011/1011` die griffnächste
 * Folge zugleich die des gewählten Namens; bei `0011/2220` bindet die
 * Staffelungsregel die Haltung an die seines Spiegelpartners `0011/1011`.
 * **Der Preis ist gemessen und beträgt keinen einzigen Zug**: Die dortige
 * Alternative greift die linke statt der rechten Hand, gleich lang.
 *
 * **Die Griffnähe kostet auch sonst nichts.** Bei allen acht ist die gewählte
 * Folge so kurz wie die kürzeste über alle fünf Seiten, sieben bis elf Züge; für
 * die drei längsten ist zusätzlich nachgewiesen, dass es darunter über keine
 * Seitenwahl eine gibt. Damit trägt der Befund aus 4T-0179 auch für diese Zelle.
 *
 * **Zwei der acht tragen keine Zusage**, nämlich das Spiegelpaar mit der
 * fertigen Ecke an der Spitze des Winkels. Hauptfolge und Alternative halten
 * dort keine gemeinsame Zusage des Wortschatzes. **Bei zwei weiteren ist die
 * Alternative eigens danach gewählt worden**, wie in 4T-0179: Zu `0011/1011`
 * gibt es mehrere linkshändige Folgen derselben Haltung und Länge, und die
 * gewählte ist die, die die Zusage der Hauptfolge mitträgt.
 *
 * **Alle acht bilden vier Spiegelpaare, keiner ist selbstgespiegelt.** Das
 * trifft die Rechnung aus 4T-0175 und ist an den Zugfolgen nachgerechnet: Bei
 * allen vier Paaren sind Hauptfolge und Alternative des zweiten Partners die
 * Spiegelungen der ersten.
 *
 * ## Die sechs Fälle des Winkels ohne stehende Ecke, seit 4T-0181
 *
 * **Mit ihnen ist die Stufe im vollen Umfang vollständig**, siebenundfünfzig
 * Fälle, und das Kantenbild des Winkels trägt seine siebenundzwanzig. Keine der
 * vier oberen Ecken steht bereits, die Folge hat also alle vier zu drehen und
 * zugleich zwei Kanten zu kippen. Alle zwölf Folgen sind am 2026-09-06 in
 * diesem Projekt aufgezählt und gegen jede Lage ihrer Klasse nachgerechnet.
 *
 * **Der zweite Namensteil nennt hier die Lage der Eckenpaare und nicht die
 * stehenden Ecken**, denn es steht keine. Er setzt damit fort, was der geführte
 * Weg mit `cornersNoneUpBackPair` und `cornersNoneUpSidePairs` bereits tut, und
 * zählt wie jener die Ecken-Oberfarben je Seitenfläche. **Die Ablesung dafür
 * ist eigens gerechnet und vor der Deutung geprüft**, nach Lehre 4 in Abschnitt
 * 14.6: Über alle 1152 Lagen je Klasse und alle vier Drehlagen, also 27648
 * Ablesungen, liefert sie dieselbe Kennung wie `caseIdFor`, das ohne Farben
 * rechnet. **`FrontPair` ist der eine Wert, den weder der geführte Weg noch der
 * bisherige Bestand kennt.**
 *
 * **Die Ausrichtungsregel lässt bei vier der sechs nur eine Haltung zu und bei
 * zweien drei.** Die beiden freien sind Spiegelpartner, ihre Haltung ist
 * deshalb gemeinsam zu wählen und nicht je Fall; die Staffelungsregel bindet
 * den zweiten an die gespiegelte Haltung des ersten. Von den drei stimmigen
 * Wegen hat der Product Owner am 2026-09-06 den mit dem Winkel und dem
 * Eckenpaar vorn entschieden. **Er ist der einzige, bei dem Hauptfolge und
 * Alternative gleich lang sind**, neun Züge, und er hält den dritten
 * Namensteil bei den zwei Werten, die 4T-0179 für den Winkel gemessen hat; die
 * beiden verworfenen Wege hätten die Alternative um zwei Züge verteuert oder
 * den dritten Teil auf vier Werte gebracht.
 *
 * **Die Griffnähe kostet hier bei der Alternative und nicht bei der
 * Hauptfolge.** Bei allen sechs ist die Hauptfolge so kurz wie die kürzeste
 * über alle fünf Seiten. Die Alternative der Gegenhand kostet beim Spiegelpaar
 * mit dem Eckenpaar hinten zwei Züge und bei dem mit den Paaren seitlich einen;
 * **bis elf Züge gibt es bei jenem überhaupt keine Folge der Gegenhand**, und
 * deshalb ist dort bis zwölf aufgezählt worden. Beim Spiegelpaar mit dem
 * Eckenpaar vorn kostet sie nichts.
 *
 * **Alle sechs tragen eine Zusage**, und das ist der Unterschied zu den beiden
 * Vorgängergruppen. Bei dem Paar mit dem Eckenpaar hinten ist die Alternative
 * eigens danach gewählt worden: Von den beiden rechtshändigen Folgen zu zwölf
 * Zügen hält allein die gewählte `edgesThreeMoved` und damit die Zusage der
 * Hauptfolge mit; die andere hätte den Fall zusagenlos gelassen.
 *
 * **Alle sechs bilden drei Spiegelpaare, keiner ist selbstgespiegelt.** Das
 * trifft die Rechnung aus 4T-0175 und ist an den Zugfolgen nachgerechnet: Jede
 * der sechs gespiegelten Folgen steht in der Fundliste ihres eigenen Falls und
 * ist dort unabhängig als lösend belegt.
 *
 * ## Die Fälle des Paar-Blicks, seit 4T-0190
 *
 * **Sie gehören der ersten Stufe und nicht der letzten Schicht**, und das ist
 * der Bruch gegenüber allen neunzig darüber. Der Blick sieht ein Paar aus Ecke
 * und Kante an und den Platz vorn rechts, in den es gehört; die letzte Schicht
 * ist dabei frei und bleibt es.
 *
 * **Hinterlegt werden vierundzwanzig von einundvierzig Klassen**, nämlich die
 * mit beiden Steinen in der oberen Ebene. Entschieden vom Product Owner am
 * 2026-09-06 in 4T-0188: Bei den siebzehn übrigen steckt ein Stein falsch im
 * Platz, und dort nennt die Erklärung den Rückweg über das Herausholen. Der
 * Grund ist der Auftrag dieser Stufe, die Denkweise zu erhalten.
 *
 * **Der Bezeichner ist dreiteilig, und alle drei Teile werden immer
 * gebraucht.** Entschieden vom Product Owner am 2026-09-06, gerechnet in
 * 4T-0190: Drei Ausrichtungen der Ecke mal vier Kantenplätze mal zwei
 * Kippungen ergeben genau die vierundzwanzig; ein zweiteiliger Name, wie ihn
 * siebzehn Fälle des Orientierens tragen, trennt hier keinen einzigen.
 *
 * 1. Die **Ausrichtung der Ecke**, also `cornerUp`, `cornerRight` oder
 *    `cornerFront`, danach benannt, wohin die Zielfarbe der Ecke zeigt. Sie
 *    steht vorn, weil `groupOfPlace` genau sie als Gruppe liefert und die
 *    Erkennungsübung daraus ihre Ablenker zieht.
 * 2. Der **Ort der Kante**, also `EdgeRight`, `EdgeFront`, `EdgeLeft` oder
 *    `EdgeBack`, gelesen bei der Ecke über ihrem Platz.
 * 3. Die **Kippung der Kante**, also `Up`, wenn ihre Vorderfarbe nach oben
 *    zeigt, und `Side`, wenn sie an einer Seitenfläche klebt.
 *
 * **Die Hand ist eine Eigenschaft des Falls und keine Wahl**, und das ist der
 * Unterschied zu allen neunzig Fällen darüber. Der offene Platz liegt vorn
 * rechts; die rechte Hand dreht dort `R`, die linke `F`. Gezählt über alle 212
 * lösenden Folgen bis acht Zügen tragen elf Fälle nur eine Folge über `R`, elf
 * nur eine über `F` und zwei nur solche über beide; **kein einziger trägt eine
 * Folge für jede Hand**. Die Alternative ist deshalb ein zweiter Weg und keine
 * zweite Hand, entschieden vom Product Owner am 2026-09-06.
 *
 * **Eine Alternative, die sich allein in den Zügen der oberen Ebene
 * unterscheidet, ist keine.** Das verlängert die Regel aus 4T-0160, wonach
 * eine Alternative, die die Hauptfolge wiederholt, keine ist: Vier der acht
 * Fälle dieses Tasks trügen sonst eine Folge daneben, die dieselbe Bewegung
 * mit anderer Vordrehung ist.
 *
 * **Kein Fall dieser Stufe trägt eine Zusage.** Der Wortschatz in `PROMISES`
 * beschreibt Wirkungen auf die obere Ebene, und die ist hier frei; was eine
 * Folge dort anrichtet, ist keine Aussage, die ein Text machen soll.
 *
 * **Bei `01/10` steht die dreiseitige Folge vor der zweiseitigen**, und das
 * weicht von der Wahlregel ab. Sie entstand für die letzte Schicht, wo das
 * Umgreifen zwischen Seiten der Preis ist; hier begrenzen `R` und `F`
 * **beide** den offenen Platz und gehören zu demselben Griff. Die zweiseitige
 * `R' U2 R2 U R2 U R` trägt zwei Doppeldrehungen an einer Seitenfläche, die
 * dreiseitige `F' U2 F U' R U R'` keine und liest sich als zwei bekannte
 * Grundgriffe hintereinander.
 *
 * ## Die zweite Gruppe, seit 4T-0194
 *
 * **Sie ist die erste, die von Anfang an nach der Wahlregel dieses Blicks
 * gewählt ist.** Die Gruppe `01` darüber ist nach der Reihenfolge des Bestands
 * entstanden, und ein Fall daraus ist mit 4T-0193 nachgezogen worden. Bei zwei
 * der acht Fälle hier entscheidet die Regel dieses Blicks anders als die des
 * Bestands; beide tragen den Grund als Kommentar an ihrem Eintrag.
 *
 * **Die Staffelungsregel ist am 2026-09-07 geschärft worden**, entschieden vom
 * Product Owner: **Der Verweis eines kurzen Textes bleibt in der Gruppe.**
 * 4T-0190 hat sie als «derselbe Weg über die Grundgriffe wie ein schon
 * erklärter Fall» entschieden, und die Frage der Reichweite stellte sich dort
 * nicht, weil es keinen früher erklärten Fall außerhalb der Gruppe gab. Jetzt
 * gibt es acht, und **jeder der acht Fälle dieser Gruppe teilt sein Gerüst mit
 * einem der Gruppe `01`**; ohne die Schärfung bekäme sie keinen einzigen
 * eigenen vollen Text.
 *
 * **Der tragende Grund ist der Anwender und nicht der Umfang.** Die Gruppe ist
 * die Antwort auf die eine Frage, die er am Würfel stellt, nämlich wohin die
 * Zielfarbe der Ecke zeigt, und sie ist die Menge, aus der die Erkennungsübung
 * ihre Ablenker zieht. Dasselbe Gerüst heißt dabei nicht dieselbe Aufgabe: Die
 * Ecke steht anders, die Arbeitsstellung ist eine andere, und der Satz über den
 * Weg ohne den Fall lautet anders. Gemessen kostet die Wahl rund fünfzehn
 * Prozent Text gegenüber dem gruppenübergreifenden Verweis.
 *
 * **Vier der acht Fälle tragen einen Gleichstand, und er ist keiner.** Bei
 * `02/00` und `02/31` stehen zwei gleichrangige Alternativen, bei `02/20` und
 * `02/30` zwei gleichrangige Hauptfolgen; die gleichrangigen Kandidaten tragen
 * jedes Mal **dasselbe Gerüst** und unterscheiden sich allein in den Zügen der
 * oberen Ebene. Für den Anwender sind sie dieselbe Bewegung, und hinterlegt ist
 * die zuerst aufgezählte. Dieselbe Lage steht viermal in der Gruppe `01`.
 *
 * ## Die dritte Gruppe und das Vorrangkriterium, seit 4T-0195
 *
 * **Mit ihr steht der Blick auf das Paar vollständig da**, vierundzwanzig von
 * einundvierzig Klassen. Sie ist die schwerste der drei: Sie trägt keinen der
 * vier Grundgriffe, keine Folge unter sechs Zügen, und vier ihrer acht Fälle
 * tragen bis acht Zügen überhaupt nur zwei lösende Folgen.
 *
 * **Die Wahlregel dieses Blicks hat deshalb ein Vorrangkriterium bekommen**,
 * entschieden vom Product Owner am 2026-09-07: **Unter den Folgen derselben
 * Arbeitsstellung steht die vorn, die sich als Verkettung der vier Grundgriffe
 * liest**, also deren Gerüst in Paare `R … R'` und `F' … F` zerfällt. Erst
 * danach greift die Reihenfolge aus 4T-0192.
 *
 * **Der Anlass ist gerechnet.** Ohne das Kriterium wählt die Regel bei vier der
 * acht Fälle eine Folge mit einem Griff, den diese Stufe nicht lehrt; alle acht
 * Gerüste wären dann verschieden, und die Gruppe bekäme acht volle Texte statt
 * sechs. **Die Erklärung dieser Stufe hängt an den Grundgriffen**, denn sie zeigt
 * den Fall als Abkürzung eines Weges, den der Anwender ohne ihn aus bekannten
 * Griffen ginge.
 *
 * **Am bestehenden Bestand kostet das Kriterium nichts**, und das ist gemessen:
 * Alle sechzehn Fälle der Gruppen `01` und `02` tragen bereits eine
 * grundgriffige Hauptfolge, das Kriterium wählt dort in keinem einzigen Fall
 * anders.
 *
 * **Die Arbeitsstellung bleibt die, die ohne das Kriterium gewählt würde**, und
 * das ist die Grenze der Regel. Bei `00/01` und `00/10` liegt die grundgriffige
 * Folge in einer anderen Stellung und kostet zwei Züge mehr; dort bleibt es bei
 * der kürzeren Folge mit dem fremden Griff, und ihr Text benennt ihn. Bei
 * `00/21` und `00/30` greift das Kriterium und kostet je einen Zug.
 */
export const CASES = [
  {
    key: 'edgesAngle',
    view: VIEWS.EDGE_ORIENTATION,
    id: '0011',
    sequence: "F U R U' R' F'",
    alternatives: ["R' U' F' U F R"],
    effect: null,
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'edgesLine',
    view: VIEWS.EDGE_ORIENTATION,
    id: '0101',
    sequence: "F R U R' U' F'",
    alternatives: ["F' L' U' L U F"],
    effect: null,
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'edgesDot',
    view: VIEWS.EDGE_ORIENTATION,
    id: '1111',
    sequence: "F R U R' U' F' U2 F U R U' R' F'",
    alternatives: ["F' L' U' L U F U2 F' U' L' U L F"],
    effect: null,
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'cornersTwoUpFrontSplit',
    view: VIEWS.CORNER_ORIENTATION,
    id: '0012',
    sequence: "R' F' R B' R' F R B",
    alternatives: ["L F L' B L F' L' B'"],
    effect: ['edgesUntouched'],
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'cornersTwoUpFrontShared',
    view: VIEWS.CORNER_ORIENTATION,
    id: '0021',
    sequence: "R2 F2 R' B2 R F2 R' B2 R'",
    alternatives: ["L2 F2 L B2 L' F2 L B2 L"],
    effect: ['edgesUntouched'],
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'cornersTwoUpDiagonal',
    view: VIEWS.CORNER_ORIENTATION,
    id: '0102',
    sequence: "F R B R' F' R B' R'",
    alternatives: ["L' B L F' L' B' L F"],
    effect: ['edgesUntouched'],
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'cornersOneUpFrontLeft',
    view: VIEWS.CORNER_ORIENTATION,
    id: '0111',
    sequence: "L U2 L' U' L U' L'",
    alternatives: ["B' U' B U' B' U2 B"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'cornersOneUpFrontRight',
    view: VIEWS.CORNER_ORIENTATION,
    id: '0222',
    sequence: "R' U2 R U R' U R",
    alternatives: ["B U B' U B U2 B'"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'cornersNoneUpBackPair',
    view: VIEWS.CORNER_ORIENTATION,
    id: '1122',
    sequence: "F' U2 F2 U F2 U F2 U2 F'",
    alternatives: ["F U2 F2 U' F2 U' F2 U2 F"],
    effect: null,
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'cornersNoneUpSidePairs',
    view: VIEWS.CORNER_ORIENTATION,
    id: '1212',
    sequence: "R U R' U R U' R' U R U2 R'",
    alternatives: ["L' U' L U' L' U L U' L' U2 L"],
    effect: ['cornersInPlace', 'edgesThreeMoved'],
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'cornersMatchedPair',
    view: VIEWS.CORNER_PERMUTATION,
    id: '0132',
    sequence: "R B' R F2 R' B R F2 R2",
    alternatives: ["L' B L' F2 L B' L' F2 L2"],
    effect: ['edgesUntouched'],
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'cornersNoMatchedPair',
    view: VIEWS.CORNER_PERMUTATION,
    id: '0321',
    sequence: "R B' R F2 R' B R F2 R2 U' R B' R F2 R' B R F2 R2",
    alternatives: ["L' B L' F2 L B' L' F2 L2 U L' B L' F2 L B' L' F2 L2"],
    effect: ['edgesAllMoved'],
    editions: [EDITIONS.REDUCED],
  },
  {
    key: 'edgesCycleClockwise',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0123/0231',
    sequence: "R' U R' U' R' U' R' U R U R2",
    alternatives: ["L2 U L U L' U' L' U' L' U L'", "B2 U R L' B2 L R' U B2"],
    effect: ['cornersUntouched'],
    editions: [EDITIONS.REDUCED, EDITIONS.FULL],
  },
  {
    key: 'edgesCycleCounterClockwise',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0123/0312',
    sequence: "R2 U' R' U' R U R U R U' R",
    alternatives: ["L U' L U L U L U' L' U' L2", "B2 U' R L' B2 L R' U' B2"],
    effect: ['cornersUntouched'],
    editions: [EDITIONS.REDUCED, EDITIONS.FULL],
  },
  {
    key: 'edgesSwapNeighbours',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0123/1032',
    sequence: "R2 U R2 U' R2 F2 R2 U' F2 U R2 F2",
    alternatives: ["L2 U L2 U' L2 B2 L2 U' B2 U L2 B2"],
    effect: ['cornersUntouched'],
    editions: [EDITIONS.REDUCED, EDITIONS.FULL],
  },
  {
    key: 'edgesSwapOpposite',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0123/2301',
    sequence: 'R2 U2 R U2 R2 U2 R2 U2 R U2 R2',
    alternatives: ['L2 U2 L U2 L2 U2 L2 U2 L U2 L2'],
    effect: ['cornersUntouched'],
    editions: [EDITIONS.REDUCED, EDITIONS.FULL],
  },
  {
    key: 'matchedPairEdgesAlong',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/0132',
    sequence: "R' U' B R B' U' B R' B' U2 R",
    alternatives: ["B' U L' U B U B' U' L U2 B"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairCycleCounterClockwiseRight',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/0213',
    sequence: "B2 R2 U B U B' U' B' U' R2 B' U B'",
    alternatives: ["L U2 L' U2 L F' L' U' L U L F L2"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairCycleClockwiseRight',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/0321',
    sequence: "F' R' U2 F' U' R' F' R U F U' R U' F",
    alternatives: ["B U B' U' B' R B2 U' B' U' B U B' R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairSwapNeighboursRight',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/1023',
    sequence: "R' U2 R U2 R' F R U R' U' R' F' R2",
    alternatives: ["B2 R B U B U' B' R' B U2 B' U2 B"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairCycleClockwiseLeft',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/1230',
    sequence: "R' U R' B2 R U' R U R2 B2 R2",
    alternatives: ["L2 B2 L2 U L U' L B2 L' U L'"],
    effect: ['edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairCycleClockwiseBack',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/1302',
    sequence: "F2 U R2 U2 F2 U' R2 F2 U F2 U F2 U2 R2",
    alternatives: ["B2 U B2 U2 R2 U' B2 U' B2 U R2 B2 U2 B2"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairCycleCounterClockwiseLeft',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/2031',
    sequence: "R2 U2 R2 F2 U' R2 U R2 U F2 U2 R2 U' R2",
    alternatives: ["B2 R2 U' B2 U' B2 U R' U R' B2 R U' R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairCycleCounterClockwiseFront',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/2103',
    sequence: "R' U R U' R2 F' U' F U R F R' F' R2",
    alternatives: ["B2 R B R' B' U' R' U R B2 U B' U' B"],
    effect: ['edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairSwapNeighboursLeft',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/2310',
    sequence: "R' U' R F2 R' U R' U F2 U' F2 U' R2 F2",
    alternatives: ["F2 U' L2 U2 F2 U L2 F2 U' F2 U' F2 U2 L2"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairCycleCounterClockwiseBack',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/3012',
    sequence: "R2 B2 R2 U' R' U R' B2 R U' R",
    alternatives: ["L U' L B2 L' U L' U' L2 B2 L2"],
    effect: ['edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairCycleClockwiseFront',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/3120',
    sequence: "B U' R U' B' U' B U R' U2 B'",
    alternatives: ["L U B' L' B U B' L B U2 L'"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'matchedPairSwapOpposite',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0132/3201',
    sequence: "B2 R2 U B2 R U R' B2 R U' R' U' R2 B2",
    alternatives: ["L2 U2 L2 F2 U L2 U' L2 U' F2 U2 L2 U L2"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'noMatchedPairCycleCounterClockwise',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0321/0132',
    sequence: "B R B R' U R' U' R2 B' R' U' B' U B'",
    alternatives: ["R' U2 R2 B U B' R2 F' U' F2 R F2 U F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'noMatchedPairCycleClockwise',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0321/0213',
    sequence: "F U F' R2 F U' F' U' R2 U R2 U R2",
    alternatives: ["F2 U F2 U F2 U2 R B R' F2 R B' R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'noMatchedPairEdgesAlong',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0321/0321',
    sequence: "R U' R2 F2 U' R F2 R' U F2 R2 U R'",
    alternatives: ["B U' B2 R2 U' B R2 B' U R2 B2 U B'"],
    effect: ['cornersAllMoved', 'edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'noMatchedPairSwapNeighbours',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0321/1230',
    sequence: "R2 U F2 U2 F2 R2 U F2 U F2 U2 R2 U' R2",
    alternatives: ["R2 U' B2 U2 B2 R2 U' B2 U' B2 U2 R2 U R2"],
    effect: ['cornersAllMoved', 'edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'noMatchedPairSwapOpposite',
    view: VIEWS.EDGE_PERMUTATION,
    id: '0321/2103',
    sequence: "F' U F2 R2 U F' R2 F U' R2 F2 U' F",
    alternatives: ["R' U R2 B2 U R' B2 R U' B2 R2 U' R"],
    effect: ['cornersAllMoved', 'edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'crossTwoUpFrontSplit',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0000/0012',
    sequence: "R' F' R B' R' F R B",
    alternatives: ["L F L' B L F' L' B'"],
    effect: ['edgesUntouched'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'crossTwoUpFrontShared',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0000/0021',
    sequence: "R2 F2 R' B2 R F2 R' B2 R'",
    alternatives: ["L2 F2 L B2 L' F2 L B2 L"],
    effect: ['edgesUntouched'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'crossTwoUpDiagonal',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0000/0102',
    sequence: "F R B R' F' R B' R'",
    alternatives: ["L' B L F' L' B' L F"],
    effect: ['edgesUntouched'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'crossOneUpFrontLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0000/0111',
    sequence: "L U2 L' U' L U' L'",
    alternatives: ["B' U' B U' B' U2 B"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'crossOneUpFrontRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0000/0222',
    sequence: "R' U2 R U R' U R",
    alternatives: ["B U B' U B U2 B'"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'crossNoneUpBackPair',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0000/1122',
    sequence: "F' U2 F2 U F2 U F2 U2 F'",
    alternatives: ["F U2 F2 U' F2 U' F2 U2 F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'crossNoneUpSidePairs',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0000/1212',
    sequence: "R U R' U R U' R' U R U2 R'",
    alternatives: ["L' U' L U' L' U L U' L' U2 L"],
    effect: ['cornersInPlace', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineAllUp',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/0000',
    sequence: "F2 R' F' R F' U2 F R U' R' U' F'",
    alternatives: ["L U F U F' L' U2 L F' L F L2"],
    effect: ['edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineTwoUpFrontSplitCrosswise',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/0012',
    sequence: "F' U2 F2 U R U' R2 F' R2 U' R'",
    alternatives: ["F U2 F2 U' L' U L2 F L2 U L"],
    effect: ['edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineTwoUpFrontShared',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/0021',
    sequence: "B' U' B' R B R' U B",
    alternatives: ["B U B L' B' L U' B'"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineTwoUpDiagonalFrontRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/0102',
    sequence: "R' F R U R' U' F' U R",
    alternatives: ["R' U L F U F' U' L' R"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineOneUpFrontLeftLengthwise',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/0111',
    sequence: "R' F' U' F2 U F' R F U' F'",
    alternatives: ["F' L F U F' L' F L U' L'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineTwoUpFrontSplitLengthwise',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/0120',
    sequence: "F' U' F U F R' F' R",
    alternatives: ["F U F' U' F' L F L'"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineTwoUpRightShared',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/0210',
    sequence: "F R U R' U' F'",
    alternatives: ["B' R' U' R U B"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineOneUpFrontRightCrosswise',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/0222',
    sequence: "F U2 F2 U' F2 R U' R' F2 U F",
    alternatives: ["L' B' R' L U' R U L' B L"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineOneUpFrontLeftCrosswise',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/1011',
    sequence: "F' U2 F2 U F2 L' U L F2 U' F'",
    alternatives: ["R B L R' U L' U' R B' R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineTwoUpDiagonalFrontLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/1020',
    sequence: "L F' L' U' L U F U' L'",
    alternatives: ["L U' R' F' U' F U L' R"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineNoneUpBackPairLengthwise',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/1122',
    sequence: "R U B U' B' U B U' B' R'",
    alternatives: ["L' U' B' U B U' B' U B L"],
    effect: ['cornersInPlace', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineNoneUpSidePairsCrosswise',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/1212',
    sequence: "R' F R F' U2 R U' R' U F' U2 F",
    alternatives: ["L F' L' F U2 L' U L U' F U2 F'"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineNoneUpBackPairCrosswise',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/1221',
    sequence: "F R U R' U F' U' F U' F'",
    alternatives: ["F' L' U' L U' F U F' U F"],
    effect: ['cornersAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineOneUpFrontRightLengthwise',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/2022',
    sequence: "L F U F2 U' F L' F' U F",
    alternatives: ["F R' F' U' F R F' R' U R"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'lineNoneUpSidePairsLengthwise',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0101/2121',
    sequence: "R U2 R2 U' R U' R' U2 F R F'",
    alternatives: ["L' U2 L2 U L' U L U2 F' L' F"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'dotAllUp',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '1111/0000',
    sequence: "F' R U2 F2 R F' R2 F R' F2 U2 R' F",
    alternatives: ["F L' U2 F2 L' F L2 F' L F2 U2 L F'"],
    effect: ['cornersAllMoved', 'edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'dotTwoUpFrontSplit',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '1111/0012',
    sequence: "R U2 B' R' U' R U B2 U2 B' R'",
    alternatives: ["L' U2 B L U L' U' B2 U2 B L"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'dotTwoUpFrontShared',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '1111/0021',
    sequence: "F R' F' R2 U R' F' U2 F R U2 R'",
    alternatives: ["F' L F L2 U' L F U2 F' L' U2 L"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'dotTwoUpDiagonal',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '1111/0102',
    sequence: "B' R' U2 R2 U B U' B' R' U2 B",
    alternatives: ["L F U2 F2 U' L' U L F U2 L'"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'dotOneUpFrontLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '1111/0111',
    sequence: "L' B2 L2 U2 L' B' L U2 L2 B2 L",
    alternatives: ["R B2 R2 U2 R B' R' U2 R2 B2 R'"],
    effect: ['cornersAllMoved', 'edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'dotOneUpFrontRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '1111/0222',
    sequence: "R B2 R2 U2 R B R' U2 R2 B2 R'",
    alternatives: ["L' B2 L2 U2 L' B L U2 L2 B2 L"],
    effect: ['cornersAllMoved', 'edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'dotNoneUpBackPair',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '1111/1122',
    sequence: "R B' R' B U2 R B' R' B2 U2 B'",
    alternatives: ["L' B L B' U2 L' B L B2 U2 B"],
    effect: ['edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'dotNoneUpSidePairs',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '1111/1212',
    sequence: "R U2 R2 F R F' U2 R' F R F'",
    alternatives: ["R' U2 R2 B' R' B U2 R B' R' B"],
    effect: ['edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleAllUp',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/0000',
    sequence: "B' R B' R2 F R' F' R2 B2",
    alternatives: ["L F' L F2 U F2 L F L' U' L2"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpBackSplitRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/0012',
    sequence: "B' U' R U B U' B' R' B",
    alternatives: ["B' U2 B U L U' L' B' U B"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpRightSharedLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/0021',
    sequence: "F' U' L' U L F",
    alternatives: ["R' U' F R' F' R U R"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpDiagonalFrontLeftLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/0102',
    sequence: "R' U2 R2 B' R' B R' U2 R",
    alternatives: ["B U L' B L B2 U B U2 B'"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleOneUpBackLeftRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/0111',
    sequence: "F R2 B' R' B R' F'",
    alternatives: ['F U F2 L F L2 U L'],
    effect: ['cornersAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpBackSplitLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/0120',
    sequence: "B U L' U' B' U B L B'",
    alternatives: ["B U2 B' U' R' U R B U' B'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpDiagonalFrontRightRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/0201',
    sequence: "R' F R F' U' F' U F",
    alternatives: ["F U2 F' L F' L' F2 U2 F'"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpLeftSharedRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/0210',
    sequence: "F U R U' R' F'",
    alternatives: ["L U F' L F L' U' L'"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleOneUpBackRightLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/0222',
    sequence: "F' L2 B L B' L F",
    alternatives: ["F' U' F2 R' F' R2 U' R'"],
    effect: ['cornersAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpFrontSharedLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/1002',
    sequence: "R' U R U2 R' U' F' U F U R",
    alternatives: ["L' B2 L2 U' B U' B' U2 L2 B2 L"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleOneUpBackRightRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/1011',
    sequence: "B' R' F R' F' R2 B",
    alternatives: ["B' U2 B U B L' B' L2 U' L'"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpDiagonalFrontRightLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/1020',
    sequence: "R' F' U' F2 U R U' R' F' R",
    alternatives: ["F U F2 L' U' L U F2 U2 F'"],
    effect: ['cornersAllMoved', 'edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleOneUpFrontLeftLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/1101',
    sequence: "F' U' F L F' L' U L F L'",
    alternatives: ["F' U' F U' F R' F' R F' U2 F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleOneUpFrontLeftRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/1110',
    sequence: "L F U F2 L F L2 U L U2 L'",
    alternatives: ["F2 R2 F' R2 B' R2 F R2 F2 R B R'"],
    effect: ['cornersInPlace'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleNoneUpBackPairLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/1122',
    sequence: "L F U F' U' F U F' U' L'",
    alternatives: ["R U2 R' U F' U' F U2 R' F R F'"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpFrontSplitRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/1200',
    sequence: "F' L U L2 U L2 U2 L' U F",
    alternatives: ["F U R U2 R' U' R U2 R' U' F'"],
    effect: ['cornersAllMoved', 'edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleNoneUpSidePairsRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/1212',
    sequence: "B' R B R' U' R B' R' B2 U' B'",
    alternatives: ["B U' L' B L B2 U' B2 L' B' L B'"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleNoneUpFrontPairRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/1221',
    sequence: "F R' F2 R U2 R U2 R' F",
    alternatives: ["F L' U2 L U2 L F2 L' F"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpFrontSplitLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/2001',
    sequence: "F R' U' R2 U' R2 U2 R U' F'",
    alternatives: ["F' U' L' U2 L U L' U2 L U F"],
    effect: ['cornersAllMoved', 'edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpDiagonalFrontLeftRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/2010',
    sequence: "L F U F2 U' L' U L F L'",
    alternatives: ["F' U' F2 R U R' U' F2 U2 F"],
    effect: ['cornersAllMoved', 'edgesAllMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleOneUpFrontRightLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/2022',
    sequence: "R' F' U' F2 R' F' R2 U' R' U2 R",
    alternatives: ["F2 L2 F L2 B L2 F' L2 F2 L' B' L"],
    effect: ['cornersInPlace'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleTwoUpFrontSharedRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/2100',
    sequence: "L U' L' U2 L U F U' F' U' L'",
    alternatives: ["R B2 R2 U B' U B U2 R2 B2 R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleNoneUpBackPairRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/2112',
    sequence: "R' F' U' F U F' U' F U R",
    alternatives: ["L' U2 L U' F U F' U2 L F' L' F"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleNoneUpSidePairsLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/2121',
    sequence: "B L' B' L U L' B L B2 U B",
    alternatives: ["B' U R B' R' B2 U B2 R B R' B"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleOneUpFrontRightRight',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/2202',
    sequence: "F U F' R' F R U' R' F' R",
    alternatives: ["F U F' U F' L F L' F U2 F'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleNoneUpFrontPairLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/2211',
    sequence: "F' L F2 L' U2 L' U2 L F'",
    alternatives: ["F' R U2 R' U2 R' F2 R F'"],
    effect: ['cornersAllMoved', 'edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'angleOneUpBackLeftLeft',
    view: VIEWS.LAST_LAYER_ORIENTATION,
    id: '0011/2220',
    sequence: "B L F' L F L2 B'",
    alternatives: ["B U2 B' U' B' R B R2 U R"],
    effect: ['edgesThreeMoved'],
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerRightEdgeRightUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '01/00',
    sequence: "R U' R' U R U R'",
    alternatives: ["R' U' F' U F R2 U R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerRightEdgeRightSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '01/01',
    sequence: "R U' R' U2 F' U' F",
    // **Die Alternative ist mit 4T-0197 nachgezogen.** Bis dahin stand hier
    // `F' U F' U2 F2 U F2 U F2`: gleich lang, aber mit vier halben Drehungen
    // gegen keine. Beide fordern dieselbe Arbeitsstellung wie die Hauptfolge,
    // und damit entscheidet die Stufe der halben Drehungen. Die beiden
    // achtzügigen Folgen dieses Falls scheiden aus, weil sie eine andere
    // Stellung verlangen.
    alternatives: ["F' R' U' F U F' R U F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerRightEdgeFrontUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '01/10',
    // **Seit 4T-0193 gewählt nach der Reihenfolge dieses Blicks**, also nach der
    // Zuglänge und dann nach den halben Drehungen. Bis dahin stand hier
    // `R' U2 R2 U R2 U R`: gleich lang, über eine Seite weniger und mit drei
    // halben Drehungen statt einer. Die Seitenzahl misst bei diesem Blick kein
    // Umgreifen, denn `R` und `F` begrenzen denselben offenen Platz.
    sequence: "F' U2 F U' R U R'",
    alternatives: ["F' U2 F2 U R U' R2 F' R"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerRightEdgeFrontSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '01/11',
    sequence: "F' U F",
    alternatives: ["R U R' F' U F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerRightEdgeLeftUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '01/20',
    sequence: "R U R' U R U R'",
    alternatives: ["F' U' F U2 R U R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerRightEdgeLeftSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '01/21',
    sequence: "F' U' F U F' U2 F",
    // **Die Alternative ist mit 4T-0197 nachgezogen**, und sie ist einen Zug
    // länger als die abgelöste `F' U' F U' F R' F' R`. Das ist der Preis des
    // Vorrangkriteriums aus 4T-0195: Unter den Folgen derselben
    // Arbeitsstellung steht die grundgriffige vorn, und erst danach greift die
    // Länge. Der einzige kürzere grundgriffige Kandidat unterscheidet sich von
    // der Hauptfolge allein in den Zügen der oberen Ebene und ist deshalb nach
    // 4T-0190 keine Alternative.
    alternatives: ["F' U' F R U R' F' U2 F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerRightEdgeBackUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '01/30',
    sequence: "R U R'",
    alternatives: ["R U' R' U' R U' R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerRightEdgeBackSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '01/31',
    sequence: "F' U2 F U F' U2 F",
    // **Die Alternative ist mit 4T-0197 nachgezogen**, aus demselben Grund wie
    // bei `01/21` und mit demselben Preis von einem Zug. Abgelöst ist
    // `F' U2 F U' F R' F' R`.
    alternatives: ["F' U2 F R U R' F' U2 F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerFrontEdgeRightUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '02/00',
    sequence: "R U' R'",
    alternatives: ["F' U F R U' R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerFrontEdgeRightSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '02/01',
    // **Die Wahlregel dieses Blicks entscheidet hier anders als die des
    // Bestands**, gemessen in 4T-0192. Jene hätte `F U2 F2 U' F2 U' F'`
    // genommen, gleich lang und über eine Seite weniger, aber mit drei halben
    // Drehungen statt einer.
    sequence: "R U2 R' U F' U' F",
    alternatives: ["R U2 R2 U' F' U F2 R F'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerFrontEdgeFrontUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '02/10',
    sequence: "F' U F U2 R U R'",
    alternatives: ["R F U R' U' R F' U' R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerFrontEdgeFrontSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '02/11',
    sequence: "F' U F U' F' U' F",
    alternatives: ["F U R U' R' F2 U' F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerFrontEdgeLeftUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '02/20',
    sequence: "R U2 R' U' R U2 R'",
    alternatives: ["R U2 R' U R' F R F'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerFrontEdgeLeftSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '02/21',
    sequence: "F' U' F",
    alternatives: ["F' U F U F' U F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerFrontEdgeBackUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '02/30',
    sequence: "R U R' U' R U2 R'",
    alternatives: ["R U R' U R' F R F'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerFrontEdgeBackSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '02/31',
    // **Auch hier wählt die Regel dieses Blicks anders als die des Bestands.**
    // Jene hätte `F' U F U F' U' F` genommen, gleich lang und gleich drehungsarm,
    // aber ohne einen einzigen Zug der rechten Seite; die Seitenzahl schlug dort
    // die Hand, die in der Reihenfolge hinter ihr steht.
    sequence: "R U' R' U F' U' F",
    alternatives: ["R' F R F' U F' U2 F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerUpEdgeRightUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '00/00',
    sequence: "R U2 R' U' R U R'",
    alternatives: ["F R' F' R2 U2 R' F' U2 F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerUpEdgeRightSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '00/01',
    // **Einer der beiden Fälle ohne ein Gerüst aus Grundgriffen**, siehe den
    // Abschnitt zur dritten Gruppe. Die grundgriffige Folge dieses Falls liegt in
    // einer anderen Arbeitsstellung und kostet zwei Züge mehr.
    sequence: "F2 U2 F U F' U F2",
    alternatives: ["F' R' U2 R U R' U R F"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerUpEdgeFrontUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '00/10',
    // **Der zweite Fall ohne Gerüst aus Grundgriffen**, aus demselben Grund wie
    // `00/01`; er ist dessen Gegenstück an der rechten Seite.
    sequence: "R2 U2 R' U' R U' R2",
    alternatives: ["R F U2 F' U' F U' F' R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerUpEdgeFrontSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '00/11',
    sequence: "F' U2 F U F' U' F",
    alternatives: ["R' F R F2 U2 F R U2 R'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerUpEdgeLeftUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '00/20',
    sequence: "F' U' F R U R'",
    alternatives: ["R U R2 F R F'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerUpEdgeLeftSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '00/21',
    // **Hier greift das Vorrangkriterium aus 4T-0195.** Ohne es stünde die
    // sechszügige `F' U2 F2 R' F' R` hier; sie ist einen Zug kürzer, trägt aber
    // eine halbe Drehung mehr und einen Griff, den diese Stufe nicht lehrt. Sie
    // steht deshalb als Alternative daneben und nicht an erster Stelle.
    sequence: "F' U2 F U' F' U F",
    alternatives: ["F' U2 F2 R' F' R"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerUpEdgeBackUp',
    view: VIEWS.PAIR_PLACEMENT,
    id: '00/30',
    // **Dieselbe Wahl wie bei `00/21`, an der rechten Seite**: Die sechszügige
    // `R U2 R2 F R F'` steht als Alternative, die grundgriffige an erster Stelle.
    sequence: "R U2 R' U R U' R'",
    alternatives: ["R U2 R2 F R F'"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
  {
    key: 'cornerUpEdgeBackSide',
    view: VIEWS.PAIR_PLACEMENT,
    id: '00/31',
    sequence: "R U R' F' U' F",
    alternatives: ["F' U' F2 R' F' R"],
    effect: null,
    editions: [EDITIONS.FULL],
  },
];

// Ein Wächter am Ort der eigenen Arbeit: Er schlägt an, während der Fall
// entsteht, und nicht, wenn ihn Wochen später jemand sucht. Zwei Fälle
// desselben Blicks mit derselben Kennung wären für die Erkennung nicht zu
// trennen, und ein Fall ohne bekannten Blick würde von jeder Abfrage
// übergangen, ohne zu fehlen.
{
  const gesehen = new Set();
  for (const fall of CASES) {
    validateCase(fall);
    const stelle = `${fall.view}/${fall.id}`;
    if (gesehen.has(stelle)) {
      throw new Error(`Fall ${fall.key} trägt die Kennung ${fall.id} ein zweites Mal`);
    }
    gesehen.add(stelle);
  }
}

const CASE_BY_PLACE = new Map(CASES.map((fall) => [`${fall.view}/${fall.id}`, fall]));

/**
 * Alle Fälle dieses Blicks in dieser Fassung, in der Reihenfolge des Bestands.
 *
 * **Ohne Angabe die reduzierte**, seit 4T-0159. Das ist die einzige Fassung,
 * die das Programm heute anbietet; wer nicht fragt, bekommt sie, und die
 * Vorgabe zeigt damit in die Richtung, in der ein vergessener Aufrufer nichts
 * anrichtet. Die Fassung durchzureichen ist Sache von 3E-0056.
 *
 * **Der Blick allein genügt nicht mehr.** Beim Kantensetzen stehen Fälle
 * beider Fassungen unter demselben Blick, und deshalb filtert diese Stelle und
 * nicht der Aufrufer: Sonst stünde die Regel an so vielen Orten, wie es
 * Aufrufer gibt.
 */
export function casesForView(view, edition = EDITIONS.REDUCED) {
  if (FEATURES[view] === undefined) throw new RangeError(`Unbekannter Blick: ${view}`);
  if (!BEKANNTE_FASSUNGEN.has(edition)) throw new RangeError(`Unbekannte Fassung: ${edition}`);
  return CASES.filter((fall) => fall.view === view && editionsOf(fall).includes(edition));
}

/**
 * Der Fall, der bei diesem Blick vorliegt, oder `null`.
 *
 * `null` heißt zweierlei und wird bewusst nicht getrennt: Entweder findet der
 * Blick nichts mehr zu tun, oder der Fall ist noch nicht hinterlegt. Beides
 * bedeutet für den Aufrufer dasselbe, nämlich dass es hier keine Folge
 * anzuwenden gibt. Wer den Unterschied braucht, vergleicht die Kennung mit
 * `solvedIdFor`.
 */
export function caseFor(state, view) {
  return CASE_BY_PLACE.get(`${view}/${caseIdFor(state, view)}`) ?? null;
}

/**
 * Die Gruppe, zu der eine Fallstelle gehört, 4T-0173.
 *
 * Eine Stelle ist `view/id`, wie `CASE_BY_PLACE` und `casesOf` sie bilden; die
 * Gruppe ist sie ohne ihren **letzten** Teil. Bei einem Blick mit einfacher
 * Kennung bleibt der Blick übrig, bei einem mit zusammengesetzter zusätzlich
 * deren vordere Hälfte.
 *
 * **Eine Regel und keine Fallunterscheidung**, und das trägt, weil der letzte
 * Teil genau das ist, was innerhalb einer Gruppe noch unterscheidet. Bei den
 * Blicken des vollen Umfangs verkettet `FEATURES` zwei Merkmale, und das
 * vordere ist das, was der Anwender zuerst ansieht: beim Setzen die Anordnung
 * der Ecken, beim Orientieren das Bild der Kanten. Über alle 62208 Lagen
 * gerechnet zerfallen die einundzwanzig Fälle des Setzens damit in drei Gruppen
 * zu 12, 5 und 4, die siebenundfünfzig des Orientierens in vier zu 27, 15, 8
 * und 7; `cases.test.js` rechnet beides nach.
 *
 * **Der Blick bleibt in der Gruppe stehen, und das ist nicht kosmetisch.** Zwei
 * Blicke dürfen dieselbe Fallkennung führen, und ohne ihn fielen Fälle
 * verschiedener Blicke mit gleichem Merkmalspräfix zusammen.
 *
 * **Gerechnet und nicht am Fall geschrieben**, wie die Fallmenge einer Stufe.
 * Ein Feld an jedem Fall liefe der Kennung davon, sobald ein Blick hinzukommt.
 */
export function groupOfPlace(stelle) {
  const letzter = stelle.lastIndexOf('/');
  return letzter < 0 ? stelle : stelle.slice(0, letzter);
}

/**
 * Der Blick, zu dem eine Fallstelle gehört, 4T-0173.
 *
 * Getrennt wird am **ersten** Schrägstrich, denn die Kennung des Falls selbst
 * darf weitere enthalten; `fallFuer` in `stageSetup.js` hält es ebenso und
 * nennt dort den Grund.
 *
 * **Das Gegenstück zu `groupOfPlace` und nicht dasselbe von hinten.** Jenes
 * schneidet den letzten Teil ab und liefert die Nähe **innerhalb** eines
 * Blicks; dieses liefert den Blick. Bei einer Kennung aus zwei Teilen fallen
 * beide zusammen, bei einer aus dreien nicht, und genau dort wird die
 * Unterscheidung gebraucht.
 */
export function viewOfPlace(stelle) {
  const erster = stelle.indexOf('/');
  return erster < 0 ? stelle : stelle.slice(0, erster);
}
