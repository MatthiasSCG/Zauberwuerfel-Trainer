// Der Übungsgang von Erkennung und Ausführung.
//
// ## Vier Schritte, zwei Übungsformen, ein Gefäß
//
// Aufgabe, Antwort, Urteil, Buchung. Beide Übungsformen gehen denselben Weg und
// unterscheiden sich allein darin, **was die Antwort ist**: eine Fallkennung
// bei der Erkennung, eine Würfellage bei der Ausführung. Die Übungsform ist
// deshalb ein Wert und keine zweite Bauart; zwei Bauarten hätten zwei Stellen,
// an denen eine Aufgabe entsteht, und eine dritte Übungsform müsste eine dritte
// anlegen.
//
// ## Warum das Modul neben `stageSetup.js` steht und nicht darin
//
// Jenes beantwortet «welche Lage gehört zu diesem Fall» und ist ein Erzeuger.
// Dieses beantwortet «was ist die Aufgabe, und war die Antwort richtig» und ist
// der Ablauf darüber. Der Erzeuger ändert sich dafür um keine Zeile.
//
// **`drill` wäre der naheliegende Name gewesen und ist vergeben.**
// `PRACTICE.DRILL` in `catalog.js` meint seit Release 1 die vorgegebene
// Zugfolge einer Lektion. Zwei Bedeutungen für dasselbe Wort in demselben
// Verzeichnis wären eine Fehlerquelle ohne Gegenwert.
//
// ## Das Urteil der Ausführung sieht mehr an als seinen Blick
//
// **Der naheliegende Vergleich ist zu schwach, und das ist gemessen.**
// `caseIdFor(state, view) === solvedIdFor(view)` sagt allein, dass dieser eine
// Blick nichts mehr zu tun findet. Über die sechzehn Fälle gerechnet, jeweils
// die richtige Folge und danach einer der achtzehn Grundzüge: Von den 288 so
// gestörten Lagen hielte jener Vergleich 148 für gelungen, darunter 100, bei
// denen die ersten beiden Schichten zerlegt sind. Der Anwender bekäme ein
// «richtig» für einen zerlegten Zauberwürfel.
//
// **Die Pflicht einer Folge ist zweierlei**, und der Kopf von `PROMISES` in
// `cases.js` sagt es bereits: den Blick lösen **und** stehen lassen, was zu
// diesem Zeitpunkt bereits stand. Genau das rechnet `viewSolved` nach.
//
// **Die Ausrichtung bleibt erlaubt.** Dasselbe Urteil lässt an denselben 288
// Lagen genau drei Störzüge durch, `U`, `U2` und `U'`, je einmal pro Fall. Das
// ist die Drehung, mit der der Anwender die obere Ebene nach der Folge
// ausrichtet; die Fallkennung ist die kleinste Lesart über sechzehn Drehungen
// und trägt sie von sich aus.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine globalen
// Namen. Die ESLint-Konfiguration erzwingt das.

import { twoLayers } from '../core/goals.js';
import { EDITIONS, caseIdFor, groupOfPlace, solvedIdFor, viewOfPlace } from './cases.js';
import { shuffled } from './scatter.js';
import { STAGES, viewsOf } from './stages.js';
import { casesForStage, createStageSetup } from './stageSetup.js';

/**
 * Die beiden Übungsformen.
 *
 * In der Bauart von `EDITIONS` in `stages.js` und `REJECTED` in `progress.js`:
 * ein Wert mit sprechendem Namen statt einer Zeichenkette an jeder Aufrufstelle.
 */
export const EXERCISE_MODES = { RECOGNITION: 'recognition', EXECUTION: 'execution' };

const MODE_VALUES = new Set(Object.values(EXERCISE_MODES));

/**
 * Die Blicke in der Reihenfolge, in der sie zu lösen sind.
 *
 * **Gerechnet und nicht geschrieben.** Sie steht in `STAGES` als Feld `views`
 * der Stufen mit Fallmenge, und die Reihenfolge der Stufen ist die des
 * Lernwegs. Eine zweite Liste liefe dem Bestand davon, sobald ein Blick
 * hinzukommt oder eine Stufe eine Fallmenge bekommt.
 *
 * **Über beide Fassungen und ohne Wiederholung, seit 4T-0170.** Die Reihenfolge
 * soll nicht davon abhängen, in welcher Fassung eine Stufe gerade steht: Sie
 * sagt, was **vor** einem Blick bereits zu stehen hat, und das ist eine
 * Eigenschaft des Würfels und keine der Wahl des Anwenders. Die reduzierte
 * Fassung steht dabei vorn, weil sie feiner unterteilt; ein Blick, der in
 * beiden Fassungen vorkommt, behält damit seinen früheren Platz.
 */
const VIEW_ORDER = [
  ...new Set(
    STAGES.flatMap((stage) => [
      ...viewsOf(stage.key, EDITIONS.REDUCED),
      ...viewsOf(stage.key, EDITIONS.FULL),
    ]),
  ),
];

/**
 * Ist an dieser Lage nichts mehr zu tun, was bis zu diesem Blick zu tun war?
 *
 * Wahr, wenn die ersten beiden Schichten stehen und jeder Blick bis
 * einschließlich des genannten sein Merkmal in der gelösten Lesart trägt.
 *
 * **Die ersten beiden Schichten sind die gemeinsame Vorbedingung aller vier
 * Blicke** und stehen deshalb vor der Schleife und nicht in ihr. Kein Blick
 * sieht sie an; wer sie zerlegt, hat den Fall trotzdem nicht gekonnt.
 *
 * **Ein unbekannter Blick ist nicht gelöst und wirft nicht.** Wer einen Blick
 * nennt, den es nicht gibt, hat ein Anzeigeproblem und kein Rechenproblem;
 * dieselbe Haltung tragen `stageMastered` und `createStageSetup`. Der Wächter
 * auf die Lage steht daneben und aus demselben Grund: Eine Übung, die noch
 * keinen Würfel hat, soll ein «nicht gelungen» bekommen und keinen Wurf.
 */
export function viewSolved(state, view) {
  if (state === null || typeof state !== 'object') return false;
  const stelle = VIEW_ORDER.indexOf(view);
  if (stelle < 0) return false;
  if (!twoLayers(state)) return false;
  // Bis **einschließlich** des genannten Blicks, daher `stelle + 1`. `every`
  // bricht beim ersten offenen Blick ab und rechnet die späteren nicht.
  return VIEW_ORDER.slice(0, stelle + 1).every(
    (frueher) => caseIdFor(state, frueher) === solvedIdFor(frueher),
  );
}

/**
 * Das Gewicht eines Falls, der immer verfehlt wird, gegenüber einem, der immer
 * gelingt.
 *
 * Entschieden vom Product Owner am 2026-08-29 aus einer Vorlage mit drei
 * Stufen. Über eine Stufe mit zehn Fällen gerechnet, von denen einer immer
 * verfehlt wird: Er bekommt 52,6 Prozent der Durchgänge, jeder sichere 5,3.
 * Verworfen sind vier, weil die Reihenfolge nahe an der Gleichverteilung
 * bliebe, und zwanzig, weil die übrigen Fälle kaum noch vorkämen.
 */
const SCHWERSTES_GEWICHT = 10;

/**
 * Das Gewicht eines Falls in der Ziehung.
 *
 * `1 + 9 · fehlerquote`, also eins bei einer Quote von null und zehn bei einer
 * von eins. **Das Mindestgewicht ist die Eins und keine zusätzliche Regel**;
 * ein sicher beherrschter Fall verschwindet damit nie ganz aus der Übung.
 *
 * **Die rohe Quote und keine Glättung.** Ein Fall mit einem Versuch und einem
 * Fehler bekommt sofort das volle Gewicht, und das ist gewollt: Er ist genau
 * der, den der Anwender als nächstes braucht. Eine Glättung machte die Zahl
 * robuster gegen dünne Datenlage und zugleich träger gegen den frischen Fehler.
 */
function gewichtVon({ versuche, fehler }) {
  if (versuche <= 0) return 1;
  return 1 + (SCHWERSTES_GEWICHT - 1) * (fehler / versuche);
}

/**
 * Zieht den Fall, der als nächstes zu üben ist.
 *
 * Nimmt entgegen, was `metricsOf` aus `progress.js` liefert, also je Fall der
 * Stufe `{ kennung, versuche, fehler }`. Liefert eine Kennung oder `null` zu
 * einer leeren Liste.
 *
 * **Die Messwerte werden hereingereicht und nicht geholt.** Der Grund ist hier
 * zwingend und nicht bloß sauber: `progress.js` liest dieses Modul, und ein
 * Import in die Gegenrichtung wäre ein Kreis. Dieselbe Haltung trägt
 * `stageMastered` in `stages.js`.
 *
 * **Ein nie versuchter Fall kommt garantiert zuerst**, entschieden vom Product
 * Owner am 2026-08-29. Solange die Stufe ungeübte Fälle führt, wird aus ihnen
 * gezogen und aus keinem anderen. Der Grund ist die Deckung: Nach Abschnitt
 * 11.7 des Didaktik-Konzepts misst die Freigabe einer Stufe mit Fallmenge
 * deren Deckung, und ein Fall, der nie gezogen wird, kann nie gelingen. So
 * führt die Ziehung von selbst zur Deckung, ohne dass es dafür eine zweite
 * Regel bräuchte.
 *
 * **Der Vorrang braucht keinen eigenen Zweig für sein Gewicht.** Unter lauter
 * ungeübten Fällen ist jede Quote null, jedes Gewicht eins, und die Ziehung
 * verteilt gleich. Das ist zugleich das Verhalten ohne jede Datenlage.
 */
export function pickCase(metrics, random = Math.random) {
  if (!Array.isArray(metrics) || metrics.length === 0) return null;
  const ungeuebt = metrics.filter((eintrag) => eintrag.versuche <= 0);
  const vorrat = ungeuebt.length > 0 ? ungeuebt : metrics;
  const gewichte = vorrat.map(gewichtVon);
  const summe = gewichte.reduce((a, b) => a + b, 0);
  let ziel = random() * summe;
  for (const [i, gewicht] of gewichte.entries()) {
    ziel -= gewicht;
    if (ziel < 0) return vorrat[i].kennung;
  }
  // **Der Rückfall ist kein toter Code, sondern der Schutz gegen die Eins.**
  // Eine Quelle, die genau 1 liefert, trifft die Summe punktgenau, und dann
  // fällt `ziel` nie unter null. Eine Schleife, die auf eine bessere Zahl
  // wartete, liefe bei einer entarteten Quelle ewig.
  return vorrat[vorrat.length - 1].kennung;
}

/**
 * Wie viele Namen bei der Erkennung zur Wahl stehen, 4T-0173.
 *
 * Entschieden vom Product Owner am 2026-09-04. **Die Zahl löst nicht nur eine
 * Höhe, sondern erhält den Gegenstand der Übung:** Wer aus siebenundfünfzig
 * Namen den richtigen sucht, übt Suchen und nicht Erkennen, und die Erkennung
 * ist seit 3E-0045 gerade deshalb von der Ausführung getrennt. Gemessen wächst
 * die Auswahl von 460 px bei zehn Namen auf 2659 px bei siebenundfünfzig; bei
 * sechs steht sie bei 273 px.
 *
 * **Raten trifft damit jeden sechsten, und das ist tragbar.** Die Deckung
 * wächst nach Abschnitt 11.7 des Didaktik-Konzepts allein aus der am Würfel
 * geprüften Ausführung, und `recordAttempt` in `progress.js` hält es so. Ein
 * geratener Treffer gibt nichts frei; er verschiebt allein die Fehlerquote, die
 * die Ziehung des nächsten Falls steuert.
 */
export const ANSWER_CHOICES = 6;

/**
 * Die Namen, die zu einer Erkennungsaufgabe zur Wahl stehen, 4T-0173.
 *
 * Nimmt die gesuchte Kennung und den Vorrat der Stufe, liefert höchstens
 * `anzahl` Kennungen in zufälliger Reihenfolge, den gesuchten Fall darunter.
 * `null` zu einem Vorrat, der die gesuchte Kennung nicht führt.
 *
 * **Die Ablenker kommen zuerst aus derselben Gruppe**, entschieden vom Product
 * Owner am 2026-09-04. Ein Ablenker aus derselben Gruppe trägt dasselbe
 * Erkennungsbild und muss wirklich unterschieden werden; ein zufälliger ist
 * meist schon am Bild auszuschließen, und die Übung misst dann weniger, als sie
 * könnte. Reicht die Gruppe nicht, wird aus der übrigen Stufe aufgefüllt.
 *
 * **Gezogen wird nur aus einem Vorrat mit genau einem Blick**, und diese
 * Bedingung wiegt schwerer als die Zahl. Trägt eine Stufe zwei Blicke, so ist
 * die Gruppe eines Falls sein Blick, und eine Auswahl aus lauter nahen
 * Ablenkern bestünde aus lauter Fällen desselben Blicks; sie verriete ihn
 * vollständig. Genau das hat die Entscheidung vom 2026-09-02 für den vollen
 * Vorrat begründet: Am eigenen Zauberwürfel steht auch nicht daneben, welcher
 * Blick an der Reihe ist.
 *
 * **Der Fall ist wirklich und nicht gedacht.** Die Stufe «Orientieren» führt in
 * der reduzierten Fassung zehn Fälle über zwei Blicke, drei für das Kippen der
 * Kanten und sieben für das Drehen der Ecken. Aus den sieben ließen sich fünf
 * Ablenker ziehen, ohne den Blick je zu verlassen. Aufgefallen ist das an einem
 * Bruch ohne Ausschlag, nach Lehre 15 in Abschnitt 14.5 der Konventionen.
 *
 * **Ein Vorrat bis zur vollen Zahl bleibt ebenfalls vollständig, und dafür
 * braucht es keine eigene Zeile.** Sie stand hier und ist bei der Bruchmessung
 * von 4T-0173 gefallen: Wo weniger Fälle da sind, als Ablenker gebraucht
 * werden, kappt `slice` von selbst nichts mehr, und die Kürzung liefert
 * denselben vollständigen Vorrat. Über alle einundzwanzig Vorratsgrößen mit
 * einem Blick gerechnet, jede gegen jeden ihrer Fälle, ergaben beide Wege in
 * 231 Fällen dasselbe. **Eine Verzweigung, die nichts entscheidet, behauptet
 * eine Sorgfalt, die es nicht gibt**; dieselbe Begründung hat in 4T-0119 einen
 * Wächter aus `createStageSetup` genommen.
 *
 * **Gemischt wird auch die vollständige Auswahl.** Stünde der gesuchte Fall
 * immer an derselben Stelle, wäre die Übung nach zwei Aufgaben gelöst; und eine
 * Auswahl in der Reihenfolge des Bestands verriete über die Stelle des
 * gesuchten Falls seine Nähe zu den anderen.
 */
export function pickChoices(
  kennung,
  vorrat,
  { anzahl = ANSWER_CHOICES, random = Math.random } = {},
) {
  if (!Array.isArray(vorrat) || !vorrat.includes(kennung)) return null;
  if (new Set(vorrat.map(viewOfPlace)).size > 1) return shuffled(random, vorrat);
  const gruppe = groupOfPlace(kennung);
  const uebrige = vorrat.filter((eintrag) => eintrag !== kennung);
  const nah = uebrige.filter((eintrag) => groupOfPlace(eintrag) === gruppe);
  const fern = uebrige.filter((eintrag) => groupOfPlace(eintrag) !== gruppe);
  // Beide Hälften einzeln gemischt und dann verkettet, nicht gemeinsam
  // gemischt: Nur so kommen die nahen zuerst dran, und innerhalb jeder Hälfte
  // entscheidet trotzdem der Zufall und nicht die Reihenfolge des Bestands.
  const ablenker = [...shuffled(random, nah), ...shuffled(random, fern)].slice(0, anzahl - 1);
  return shuffled(random, [kennung, ...ablenker]);
}

/**
 * Die Messwerte, aus denen gezogen wird, notfalls aus dem bloßen Vorrat.
 *
 * **Ohne Messwerte gilt jeder Fall als ungeübt.** Das ist keine Ausnahme,
 * sondern derselbe Weg mit leerer Datenlage: Unter lauter ungeübten Fällen
 * zieht `pickCase` gleichverteilt, und genau das tat die Stelle vor 4T-0135.
 */
const messwerteOderVorrat = (key, metrics, edition) =>
  Array.isArray(metrics) && metrics.length > 0
    ? metrics
    : casesForStage(key, edition).map((kennung) => ({ kennung, versuche: 0, fehler: 0 }));

/**
 * Stellt eine Übungsaufgabe zu einer Stufe.
 *
 * Rückgabe `{ mode, key, kennung, view, state }`, oder `null`, wenn die
 * Übungsform unbekannt ist, die Stufe keine Fallmenge hat oder die genannte
 * Kennung nicht zu ihr gehört.
 *
 * **Die Lage kommt unverändert aus `createStageSetup`.** Dieses Modul erzeugt
 * keine eigene; es fügt allein die Übungsform hinzu und nennt die Stufe mit,
 * denn die Buchung braucht sie und die Lage trägt sie nicht.
 *
 * **Ohne Kennung zieht `pickCase`**, seit 4T-0135 und mit den Messwerten, die
 * `metrics` mitbringt. Fehlen sie, gilt jeder Fall als ungeübt, und das ist
 * dieselbe Gleichverteilung, die hier vorher stand; ein zweiter Weg entsteht
 * dadurch nicht.
 *
 * **`choices` trägt die Namen zur Wahl und steht allein bei der Erkennung**,
 * seit 4T-0173; bei der Ausführung ist es `null`. Dort ist der Fall genannt und
 * die Zugfolge gesucht, und eine Antwortliste wäre die Antwort auf eine Frage,
 * die niemand gestellt hat. Dieselbe Haltung trägt `coverage` in
 * `recordAttempt`.
 *
 * **Die Auswahl entsteht hier und nicht im Anzeigestand.** Sie muss die gesuchte
 * Kennung enthalten, und was im gerechneten Stand steht, schreibt der Bereich in
 * Knoten; die Antwort käme damit dem Anwender vor die Augen. Sie reist deshalb
 * mit der Aufgabe, wie das Urteil seit 4T-0141.
 */
export function createExercise(
  key,
  { mode, random = Math.random, kennung = null, metrics = [], edition = EDITIONS.REDUCED } = {},
) {
  if (!MODE_VALUES.has(mode)) return null;
  const gewaehlt = kennung ?? pickCase(messwerteOderVorrat(key, metrics, edition), random);
  const aufgabe = createStageSetup(key, { random, kennung: gewaehlt, edition });
  if (aufgabe === null) return null;
  const choices =
    mode === EXERCISE_MODES.RECOGNITION
      ? pickChoices(aufgabe.kennung, casesForStage(key, edition), { random })
      : null;
  return {
    mode,
    key,
    kennung: aufgabe.kennung,
    view: aufgabe.view,
    state: aufgabe.state,
    choices,
  };
}

/**
 * Beurteilt die Antwort auf eine Übungsaufgabe.
 *
 * Rückgabe `{ correct, mode, kennung, view }`, oder `null` zu einer Aufgabe,
 * die keine ist. `kennung` ist dabei immer die **richtige** Antwort; die
 * Rückmeldung der Erkennungsübung braucht sie, um das Merkmal des gesuchten
 * Falls zu zeigen.
 *
 * Was `answer` ist, entscheidet die Übungsform: bei der Erkennung die vom
 * Anwender genannte Fallkennung, bei der Ausführung die Lage seines
 * Übungswürfels.
 *
 * **Die Erkennung vergleicht die Kennung und nicht den Bezeichner des Falls.**
 * Sie trägt den Blick vor dem Schrägstrich, weil zwei Blicke dieselbe
 * Fallkennung führen dürfen; `casesOf` in `stages.js` hat diese Trennung
 * bereits getroffen, und eine zweite Lesart liefe ihr davon.
 *
 * **Die Ausführung urteilt am Zustand und nicht am Zugtext.** Damit gilt jede
 * Alternative als gelungen, sofern sie dieselbe Lage herstellt, und zwar ohne
 * dass sie dafür in einer Liste stehen müsste. Der Weg über den Zugtext wäre
 * überdies nicht bloß strenger, sondern falsch: Die Aufgabenlage ist gestreut
 * und verlangt vor der Folge eine Ausrichtung, die in keiner Liste steht.
 */
export function judgeExercise(exercise, answer) {
  if (exercise === null || typeof exercise !== 'object') return null;
  if (!MODE_VALUES.has(exercise.mode)) return null;
  const correct =
    exercise.mode === EXERCISE_MODES.RECOGNITION
      ? answer === exercise.kennung
      : viewSolved(answer, exercise.view);
  return { correct, mode: exercise.mode, kennung: exercise.kennung, view: exercise.view };
}
