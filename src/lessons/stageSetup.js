// Übungslagen je Fall einer Stufe.
//
// ## Warum nicht `setup.js`
//
// Der Erzeuger des Anfängerverfahrens führt zwei Tabellen, und beide sind über
// die Zwischenziele aus `core/goals.js` geführt. Eine Stufe von CFOP ist aber
// nicht über ein Ziel geschnitten, sondern über einen **Blick** des
// Fallbestands: Welcher Fall vorliegt, sagt `caseIdFor` und kein Zwischenziel.
// Was beide teilen, sind die Handgriffe aus `scatter.js`.
//
// ## Der Fall kommt aus der Umkehrung, die Umgebung aus der Streuung
//
// Entschieden vom Product Owner am 2026-08-26, gemessen über alle 62208 Lagen
// der letzten Schicht. Die reine Umkehrung der Hauptfolge liefert je Fall vier
// bis sechzehn Lagen; die Klasse des Falls umfasst beim ersten Blick bis zu
// 31104. **Der Ausschlag ist nicht die Zahl, sondern die Umgebung:** Der Fall
// `edgesAngle` umfasst 648 verschiedene Eckenbilder, die Umkehrung zeigt
// sechzehn. Beim ersten Blick sind die Ecken am eigenen Würfel weder gedreht
// noch gesetzt, und wer nur die Umkehrungslagen geübt hat, trifft dort auf eine
// Umgebung, die er nie gesehen hat.
//
// **Der Vertreter kommt trotzdem aus der Umkehrung**, denn sie liefert zwei
// Zusicherungen geschenkt: Die Lage entsteht aus Zügen und ist damit ein echter
// Würfel, und sie trägt den bestellten Fall, ohne dass ihn jemand ausrechnen
// müsste. Die Fallkennung ist die kleinste Lesart über sechzehn Drehungen und
// nicht der Steinwert; sie rückwärts zu deuten wäre je Blick eine eigene
// Rechnung mit einer eigenen Fehlerquelle. Begründung in 4T-0119.
//
// ## Warum das Streuen den Fall nicht verliert
//
// **Die Orientierung hängt am Platz und nicht am Stein.** In `cube.js`
// nachgesehen: `co[i]` und `eo[i]` sagen, wie stark der Stein **an Stelle i**
// gedreht ist. Ein Blick, der die Drehung ansieht, liest also Plätze, und die
// Steine darunter dürfen wandern. Genau das macht die Streuung.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine globalen
// Namen. Die ESLint-Konfiguration erzwingt das.

import {
  CORNERS,
  EDGES,
  FACES,
  applyMove,
  applyMoves,
  composeStates,
  inverseMoves,
  solvedCube,
} from '../core/cube.js';
import { parseMovesOrThrow } from '../core/notation.js';
import { EDITIONS, PAIR_CORNER, PAIR_EDGE, VIEWS, casesForView } from './cases.js';
import { STAGES, casesOf, hasCases, stageFor } from './stages.js';
import { gleicheParitaetAus, randomInt, setzeOrientierung, verteile } from './scatter.js';

// Stellen, wie in `setup.js` aus den Namen gelesen und nicht als Zahl
// geschrieben. Eine geänderte Reihenfolge in `cube.js` fällt damit hier auf,
// statt still eine andere Stelle zu treffen.
const UPPER_CORNERS = CORNERS.map((name, index) => ({ name, index }))
  .filter(({ name }) => name.includes('U'))
  .map(({ index }) => index);
const UPPER_EDGES = EDGES.map((name, index) => ({ name, index }))
  .filter(({ name }) => name.includes('U'))
  .map(({ index }) => index);

/**
 * Was jeder Blick ansieht und was er freilässt.
 *
 * Die Bauart von `FREEDOM` in `setup.js`, eine Ebene weiter. `frei` nennt die
 * Plätze, deren **Belegung** gestreut werden darf, `drehungFrei` die, deren
 * **Drehung** gestreut werden darf, `kippungFrei` die Kanten, deren **Kippung**
 * gestreut werden darf. Der Unterschied zwischen dem ersten und den beiden
 * übrigen ist derselbe wie zwischen Lektion 7 und 8: Ein Stein kann an seinem
 * Platz stehen und trotzdem gedreht sein.
 *
 * Die Staffelung folgt dem Bestand. Was ein früherer Blick hergestellt hat, ist
 * für die späteren Vorbedingung und damit nicht mehr frei; was ein Blick
 * ansieht, ist sein Merkmal und erst recht nicht frei.
 *
 * **`kippungFrei` steht seit 4T-0191 und ist bei den fünf Blicken der letzten
 * Schicht leer.** Dort ist die Kippung der oberen Kanten nie frei: Der erste
 * Blick sieht sie an, die übrigen setzen sie als hergestellt voraus. Die leere
 * Liste ist deshalb eine Aussage und keine fehlende Angabe, und sie steht
 * ausgeschrieben, damit ein neuer Blick sie nicht vergessen kann.
 *
 * **Ein Eintrag darf eine Funktion über die Lage sein**, ebenfalls seit
 * 4T-0191. Die fünf festen Einträge bleiben feste Objekte, weil sie es sind;
 * beim Blick auf das Paar wechseln die freien Plätze von Lage zu Lage, und
 * `freiheitFuer` löst beides auf.
 */
const FREEDOM = new Map([
  [
    VIEWS.EDGE_ORIENTATION,
    {
      frei: { corners: UPPER_CORNERS, edges: UPPER_EDGES },
      drehungFrei: UPPER_CORNERS,
      kippungFrei: [],
    },
  ],
  [
    VIEWS.CORNER_ORIENTATION,
    { frei: { corners: UPPER_CORNERS, edges: UPPER_EDGES }, drehungFrei: [], kippungFrei: [] },
  ],
  [
    VIEWS.CORNER_PERMUTATION,
    { frei: { corners: [], edges: UPPER_EDGES }, drehungFrei: [], kippungFrei: [] },
  ],
  [VIEWS.EDGE_PERMUTATION, { frei: { corners: [], edges: [] }, drehungFrei: [], kippungFrei: [] }],
  // **Der Blick des vollen Umfangs, seit 4T-0175.** Er sieht die Kippung der
  // Kanten **und** die Drehung der Ecken an; frei ist damit allein die
  // Belegung beider Plätze, also welcher Stein wo liegt, und keine Drehung.
  //
  // **Er steht damit auf demselben Eintrag wie der Blick auf das Eckendrehen
  // und nicht auf dem des Kantenkippens**, obwohl er beide zusammenfasst. Jener
  // gibt die Drehung der Ecken frei, weil sie ihn nichts angeht; hier ist sie
  // die halbe Aufgabe. Die Staffelung dieser Tabelle folgt dem, was ein Blick
  // ansieht, und nicht dem, was vor ihm steht.
  //
  // **Bis 4T-0175 fehlte der Eintrag, und das fiel still aus:** `fallFuer`
  // weist eine Kennung ab, deren Blick hier nicht steht, `createStageSetup`
  // liefert darauf `null`, und die Stufe hätte im vollen Umfang keine einzige
  // Übungslage gezeigt. Beim Setzen bestand der Eintrag bereits, weil dort
  // beide Fassungen denselben Blick führen.
  [
    VIEWS.LAST_LAYER_ORIENTATION,
    { frei: { corners: UPPER_CORNERS, edges: UPPER_EDGES }, drehungFrei: [], kippungFrei: [] },
  ],
  // **Der Blick auf das Paar, seit 4T-0191, und der einzige gerechnete
  // Eintrag.** Die fünf darüber nennen feste Listen, weil dort die vier oberen
  // Ecken und die vier oberen Kanten entweder ganz frei sind oder ganz nicht.
  // Hier ist genau **einer** von je vier Plätzen belegt, nämlich der, an dem
  // der Stein des Paares liegt, und welcher das ist, wechselt von Fall zu Fall
  // und mit jeder Vordrehung. Gemessen am 2026-09-07: Über die acht Fälle mal
  // sechzehn Drehkombinationen kommen alle sechzehn Platzpaare vor.
  //
  // **Die Kippung der übrigen oberen Kanten ist hier zum ersten Mal frei.** Das
  // Merkmal liest allein die Kippung der Kante des Paares; alles andere der
  // letzten Schicht geht diesen Blick nichts an, denn beim Einlegen des Paares
  // ist sie noch unbearbeitet. Ohne diese Streuung sähe der Anwender über 8000
  // Ziehungen genau **ein** Kippungsbild, und das ist derselbe Befund, der
  // 4T-0119 die Entscheidung getragen hat: Der Ausschlag ist nicht die Zahl der
  // Lagen, sondern die Umgebung, die er am eigenen Würfel nie gesehen hat.
  [
    VIEWS.PAIR_PLACEMENT,
    (state) => {
      const ecken = UPPER_CORNERS.filter((platz) => platz !== state.cp.indexOf(PAIR_CORNER));
      const kanten = UPPER_EDGES.filter((platz) => platz !== state.ep.indexOf(PAIR_EDGE));
      return { frei: { corners: ecken, edges: kanten }, drehungFrei: ecken, kippungFrei: kanten };
    },
  ],
]);

/**
 * Die Freiheit eines Blicks an dieser Lage.
 *
 * **Der Umweg über eine Funktion ist die halbe Aussage dieses Tasks.** Ein
 * fester Eintrag beschreibt, was ein Blick ansieht; beim Paar hängt das nicht am
 * Blick allein, sondern an der Lage, weil der Ort der beiden Steine der
 * Gegenstand ist. Wer hier eine feste Liste schriebe, gäbe je nach Lage einen
 * Platz frei, an dem ein Stein des Paares liegt, und verlöre den Fall.
 */
function freiheitFuer(view, state) {
  const eintrag = FREEDOM.get(view);
  return typeof eintrag === 'function' ? eintrag(state) : eintrag;
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

/** Die Kennungen aller Fälle, die diese Stufe in dieser Fassung zu üben gibt. */
export function casesForStage(key, edition = EDITIONS.REDUCED) {
  return [...casesOf(key, edition)];
}

/**
 * Der Fall hinter einer Kennung, oder `null`.
 *
 * Die Kennung trägt den Blick vor dem Schrägstrich, weil zwei Blicke dieselbe
 * Fallkennung führen dürfen. Getrennt wird deshalb am **ersten** Schrägstrich:
 * Die Kennung des Falls selbst darf weitere enthalten, und `0123/0231` ist eine
 * davon.
 *
 * **Hier prallte der volle Umfang bis 4T-0170 ab**, und zwar still: Der Aufruf
 * von `casesForView` ließ die Fassung weg, bekam damit die reduzierte, und ein
 * Fall des vollen Umfangs war schlicht nicht zu finden. Die Antwort war `null`,
 * `createStageSetup` lieferte darauf `null`, und niemand konnte sehen, dass die
 * einundzwanzig Fälle aus 3E-0055 im Bestand standen. **Die Fassung gehört
 * deshalb zur Bestellung** und nicht zur Kennung: Zwei Fassungen führen
 * dieselbe Kennung, wo sie denselben Fall meinen, und aus ihr allein ist die
 * Fassung nicht zu lesen.
 */
function fallFuer(kennung, edition) {
  if (typeof kennung !== 'string') return null;
  const trenner = kennung.indexOf('/');
  if (trenner < 0) return null;
  const view = kennung.slice(0, trenner);
  const id = kennung.slice(trenner + 1);
  if (FREEDOM.get(view) === undefined) return null;
  return casesForView(view, edition).find((fall) => fall.id === id) ?? null;
}

/**
 * Erzeugt die Ausgangslage zu einem Fall einer Stufe.
 *
 * Rückgabe `{ state, kennung, view }`, oder `null`, wenn die Stufe keine
 * Fallmenge hat oder die Kennung nicht zu ihr gehört. **Kein Wurf:** Wer eine
 * Lage zu einem Fall bestellt, den es nicht gibt, hat ein Anzeigeproblem und
 * kein Rechenproblem, und dieselbe Haltung trägt schon `stageMastered`.
 *
 * Die Zufallsquelle wird hereingereicht, wie es `scramble.js` und `setup.js`
 * vormachen: Zu gleicher Quelle entsteht dieselbe Lage, und ein Fehlschlag ist
 * damit nachstellbar. Die Zahl der Ziehungen steht vor dem ersten Schritt fest;
 * es gibt keine Schleife, die auf den Zufall wartet.
 */
export function createStageSetup(
  key,
  { random = Math.random, kennung = null, edition = EDITIONS.REDUCED } = {},
) {
  if (stageFor(key) === null) return null;

  // **Eine Stufe ohne Fallmenge braucht keinen eigenen Wächter.** Ihr Vorrat ist
  // leer, und eine Bestellung, die nicht darin steht, wird eine Zeile weiter
  // abgewiesen. Ein zusätzliches `hasCases` stand hier bis zur Bruchmessung von
  // 4T-0119 und ist gefallen, weil kein Bruch ihn treffen konnte: Beide Wege
  // liefern `null`, und eine Verzweigung, die nichts entscheidet, behauptet eine
  // Sorgfalt, die es nicht gibt.
  const vorrat = casesForStage(key, edition);
  const gewaehlt = kennung ?? vorrat[randomInt(random, vorrat.length)];
  if (!vorrat.includes(gewaehlt)) return null;
  return createCaseSetup(gewaehlt, { random, edition });
}

/**
 * Erzeugt die Ausgangslage zu einem Fall, ohne nach seiner Stufe zu fragen.
 *
 * Rückgabe wie bei `createStageSetup`, oder `null`, wenn die Kennung zu keinem
 * Fall dieser Fassung gehört.
 *
 * **Die Zerlegung ist die, die der Erzeuger ohnehin geht**, und sie steht seit
 * 4T-0191 auch als Schnitt da: Die Stufe sagt, welche Fälle zu üben sind, der
 * Fall sagt, wie seine Lage entsteht. Wer die Lage baut, braucht die Stufe
 * nicht, und `createStageSetup` verliert dadurch keine Zusage: Es prüft die
 * Bestellung weiterhin gegen den Vorrat seiner Stufe, bevor es hierher kommt.
 *
 * **Der Anlass ist der Blick auf das Paar.** Seine Stufe darf ihre Fallliste
 * erst führen, wenn alle vierundzwanzig Fälle stehen, denn sonst misst die
 * Freigabe die Deckung einer halb gefüllten Menge statt der drei gelungenen
 * Anwendungen; der Befund steht in 4T-0188 und gehört zum siebten Task von
 * 3E-0059. Ohne diese Stelle wäre der Eintrag in `FREEDOM` bis dahin von
 * niemandem auszuführen und damit auch von keiner Prüfung zu fassen.
 */
export function createCaseSetup(
  kennung,
  { random = Math.random, edition = EDITIONS.REDUCED } = {},
) {
  const fall = fallFuer(kennung, edition);
  if (fall === null) return null;

  // Der Vertreter: aus dem gelösten Würfel die Umkehrung der Hauptfolge, dazu
  // je eine zufällige Drehung der oberen Ebene davor und danach. Beide gehören
  // dazu, denn ein Fall ist die Menge der Lagen, die dieselbe Folge löst, wenn
  // der Anwender vorher und nachher frei drehen darf.
  const rueckwaerts = inverseMoves(parseMovesOrThrow(fall.sequence));
  const grund = applyMoves(solvedCube(), rueckwaerts);
  const vorher = UPPER_TURNS[randomInt(random, UPPER_TURNS.length)];
  const nachher = UPPER_TURNS[randomInt(random, UPPER_TURNS.length)];
  const state = composeStates(composeStates(vorher, grund), nachher);

  streue(state, freiheitFuer(fall.view, state), random);
  return { state, kennung, view: fall.view };
}

/**
 * Streut, was der Blick nicht ansieht, und hält dabei die Erhaltungssätze.
 *
 * Die Reihenfolge ist die von `setup.js`: erst die Belegung, dann ihr
 * Paritätsausgleich, dann die Drehungen.
 *
 * **Sie ist hier gemessen gleichgültig**, und das steht da, damit niemand eine
 * Sorgfalt hineinliest, die keine ist: Vertauscht fällt keine einzige Prüfung.
 * Der Grund ist der Zuschnitt der Blicke. Ein Ausgleich verschiebt Steine, und
 * die Drehungen bleiben dabei an ihren Plätzen; gefährlich wäre das nur für
 * einen Blick, der eine Drehung ansieht **und** dieselbe Drehung freigibt. Den
 * gibt es nicht: Der erste Blick sieht die Kippung der Kanten an und gibt die
 * Drehung der Ecken frei, alle übrigen geben keine Drehung frei.
 *
 * **Die Kippung der Kanten kommt seit 4T-0191 dazu**, mit dem Modulus zwei und
 * demselben Handgriff, den `setup.js` für den Lernpfad längst benutzt. Sie ist
 * allein beim Blick auf das Paar frei; für die fünf Blicke der letzten Schicht
 * ist die Liste leer, und dann sagt der Handgriff nur noch, dass die Summe der
 * Kippungen schon gerade ist. Das ist an einer aus Zügen entstandenen Lage
 * immer der Fall, und wäre sie es nicht, zeigte der Wurf genau dorthin.
 */
function streue(state, freiheit, random) {
  verteile(state.cp, freiheit.frei.corners, [], random);
  verteile(state.ep, freiheit.frei.edges, [], random);
  gleicheParitaetAus(state, freiheit.frei.corners, freiheit.frei.edges);
  setzeOrientierung(state.co, freiheit.drehungFrei, 3, random);
  setzeOrientierung(state.eo, freiheit.kippungFrei, 2, random);
}

/**
 * Alle Stufen mit Fallmenge, mit ihren Kennungen in dieser Fassung. Für Prüfung
 * und Anzeige.
 *
 * **Die Auswahl der Stufen hängt nicht an der Fassung, ihre Kennungen schon.**
 * `hasCases` fragt nach dem Zuschnitt, `casesForStage` nach dem Inhalt; eine
 * Stufe, deren gewählte Fassung heute keinen Fall trägt, steht deshalb mit
 * leerer Liste darin und fällt nicht heraus. Das ist die ehrlichere Antwort:
 * Die Stufe hat eine Fallmenge, und diese Fassung hat noch nichts davon.
 */
export function stagesWithCases(edition = EDITIONS.REDUCED) {
  return STAGES.filter((stage) => hasCases(stage.key)).map((stage) => ({
    key: stage.key,
    cases: casesForStage(stage.key, edition),
  }));
}
