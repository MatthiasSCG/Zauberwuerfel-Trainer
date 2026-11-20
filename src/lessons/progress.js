// Der Ablauf des Lernpfads: Freigabe, Anwendungen, Fortschritt.
//
// ## Warum der Speicher hereingereicht wird
//
// Nach dem Modulschnitt der Architektur hängt `lessons` allein von `core` ab
// und kennt `settings` nicht. Der Fortschritt wird deshalb über ein Paar aus
// `load` und `save` bedient, das `app` gegen die Einstellungen verdrahtet.
// **Das Gefäß entsteht hier nicht neu:** Datensatz, Fassung, Datei-Sicherung
// und der Fall ohne Speicher stehen seit 4T-0026. Hierher gehört allein der
// Inhalt.
//
// ## Der Fortschritt ist eine Menge und kein Zähler
//
// Gespeichert werden die Bezeichner der abgeschlossenen Lektionen, die der
// übersprungenen, die zuletzt bearbeitete und die Zahl der gelungenen
// Anwendungen je Lektion. Ein bloßer Zählerstand ginge verloren, sobald der
// Pfad in Release 2 verzweigt, und er könnte nicht ausdrücken, dass eine
// Lektion übersprungen wurde.
//
// **Eine übersprungene Lektion gilt nicht als abgeschlossen.** Sie steht in
// einer eigenen Menge, die allein die Freigabe der folgenden bewirkt. Stünde
// sie unter den abgeschlossenen, behauptete der Fortschritt später etwas, das
// nie geprüft wurde.
//
// ## Zwei Bestände, und je Stufe eine zweite Menge
//
// Seit 4T-0118 kennt dieses Modul beide Bestände, die zehn Lektionen aus
// `catalog.js` und die vier Stufen aus `stages.js`. Ein Bezeichner gehört
// immer nur einem von beiden; `isStage` entscheidet, wer gefragt wird.
//
// **Für eine Stufe mit Fallmenge zählt nicht die Zahl, sondern die Deckung.**
// Abschnitt 11.7 des Didaktik-Konzepts nennt den Grund: Wer die Folge der
// Lektion 6 kann, kann alle dreiundzwanzig Lagen, und drei gelungene
// Anwendungen prüfen dort die eine Folge, die es gibt. Wer drei von zehn
// Fällen kann, kann drei Zugfolgen und nicht die Stufe. Der Fortschritt hält
// deshalb je Stufe die Menge der gelungenen Fallkennungen.
//
// **Die Menge ist zugleich der Schutz gegen doppeltes Zählen.** Bei der Zahl
// musste dafür der Begriff der laufenden Übung eingeführt werden, sonst hätte
// dieselbe gelöste Lage bei jeder erneuten Prüfung wieder gezählt. Denselben
// Fall zweimal in eine Menge zu legen ändert nichts, und `recordCase` braucht
// den Begriff deshalb nicht.
//
// ## Die Freigabe fragt über die Grenze, keine Auskunft antwortet über sie
//
// Seit 4T-0127 trägt dieses Modul beide Bestände vollständig: Eine Stufe lässt
// sich beginnen, prüfen, überspringen und abschließen. **Die Freigabe läuft
// dabei über `requires` durch beide Bestände hindurch**, denn die erste Stufe
// knüpft an die letzte Lektion an, und genau darauf hat `catalog.js` seit
// 4T-0043 vorbereitet.
//
// **Jede Auskunft nach außen bleibt dagegen in ihrem Bestand.** `overview` und
// `resume` führen die zehn Lektionen, `stageOverview` und `stageResume` die
// vier Stufen; `unlocked` aus `zaehle`, `affects` aus `skip` und die zuletzt
// bearbeitete Stelle nennen nie etwas aus dem anderen Bestand.
//
// **Der Grund ist gemessen und nicht erwogen.** Die Oberfläche löst jeden
// zurückgelieferten Bezeichner als `lektion.<kennung>.titel` auf, und die
// Stufentitel stehen im Zweig `stufe.`. Eine Auskunft über die Grenze zeigte
// dort einen fehlenden Textbaustein, und wer die letzte Lektion besteht,
// verlöre zusätzlich die Abschlussmeldung des ganzen Weges: Der Zweig für die
// Freigabe greift vor dem für den Abschluss. Der Übertritt gehört deshalb zur
// Verdrahtung in 4T-0121 und nicht hierher.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine
// globalen Namen.

import {
  LESSONS,
  isCheckable,
  isLesson,
  lessonFor,
  reachesGoal,
  requiredApplications,
} from './catalog.js';
import {
  STAGES,
  casesOf,
  hasCases,
  isStage,
  masteredByCoverage,
  reachesGoal as stageReachesGoal,
  requiredApplications as stageApplications,
  stageFor,
  stageMastered,
  viewsOf,
} from './stages.js';
// **Die Fassungen kommen unmittelbar aus `cases.js`, seit 4T-0170.** Dieses
// Modul legt die gewählte Fassung je Stufe ab und muss dafür wissen, welche es
// gibt und welche die Vorgabe ist. Der Umweg über `stages.js` wäre eine zweite
// Wahrheit über dieselbe Aufzählung; ein Ring entsteht nicht, denn `cases.js`
// liest innerhalb von `lessons` nichts.
import { EDITIONS } from './cases.js';
// **Der Fortschritt kennt die Übungsformen, weil er sie ablegt.** Sie sind der
// Schlüssel der Messwerte, und ohne sie ließe sich eine unbekannte Form beim
// Lesen nicht von einer bekannten unterscheiden. Der Modulschnitt erlaubt das:
// Beide gehören zu `lessons`, und `exercise.js` kennt dieses Modul nicht, es
// entsteht also kein Kreis.
import { EXERCISE_MODES } from './exercise.js';

/**
 * Gründe, aus denen eine gemeldete Anwendung oder ein Fall nicht zählt.
 *
 * **`COVERAGE` ist seit 4T-0127 dabei** und meint: Hier misst die Deckung und
 * nicht die Zahl. `NOT_CHECKABLE` wäre dafür falsch, denn eine Stufe mit
 * Fallmenge ist sehr wohl am Würfel prüfbar; sie kommt nur über `recordCase`
 * voran und nicht über den Zähler.
 */
export const REJECTED = {
  UNKNOWN: 'unknown',
  LOCKED: 'locked',
  NOT_RUNNING: 'notRunning',
  GOAL_MISSED: 'goalMissed',
  CHECKABLE: 'checkable',
  NOT_CHECKABLE: 'notCheckable',
  NO_CASES: 'noCases',
  UNKNOWN_CASE: 'unknownCase',
  COVERAGE: 'coverage',
  // **`UNKNOWN_MODE` ist seit 4T-0134 dabei** und meint eine Übungsform, die es
  // nicht gibt. `UNKNOWN` wäre dafür falsch, denn der sagt, es gebe die Stelle
  // im Pfad nicht, und schickte den Suchenden an die falsche Stelle.
  UNKNOWN_MODE: 'unknownMode',
  // **Zwei Gründe für die Fassung, seit 4T-0170**, und sie sind auseinander zu
  // halten. `UNKNOWN_EDITION` meint eine Fassung, die es nicht gibt, und ist
  // damit ein Fehler des Programms. `EMPTY_EDITION` meint eine, die es gibt und
  // die bei dieser Stufe heute keinen Fall trägt; das trifft auf den vollen
  // Umfang der ersten Stufe zu, bis 3E-0058 seine siebenundfünfzig bringt. Ein
  // gemeinsamer Grund schickte den Suchenden an die falsche Stelle, und
  // dieselbe Trennung führen `NO_CASES` und `NOT_CHECKABLE` bereits.
  UNKNOWN_EDITION: 'unknownEdition',
  EMPTY_EDITION: 'emptyEdition',
};

const MODE_VALUES = new Set(Object.values(EXERCISE_MODES));
const EDITION_VALUES = new Set(Object.values(EDITIONS));

const leererFortschritt = () => ({
  completed: new Set(),
  skipped: new Set(),
  last: null,
  applications: new Map(),
  cases: new Map(),
  // Die gewählte Fassung je Stufe, seit 4T-0170. Wer nicht darin steht, steht
  // in der reduzierten; ein Gerüst aus Vorgabewerten wäre eine Ablage von
  // Leerstellen, und dieselbe Zurückhaltung übt `applications` beim Zähler null.
  editions: new Map(),
  // Je Übungsform eine Tabelle von der Fallkennung auf Versuche und
  // Fehlversuche. Zwei Ebenen und nicht eine: Die gewichtete Ziehung arbeitet
  // je Übungsform und bekommt damit genau eine Tabelle.
  metrics: new Map(),
});

/** Eine ganze Zahl von null aufwärts, oder null bei allem anderen. */
const nichtNegativ = (wert) =>
  typeof wert === 'number' && Number.isFinite(wert) ? Math.max(Math.floor(wert), 0) : 0;

/**
 * Ein Messwertpaar aus einem abgelegten Eintrag, oder `null`.
 *
 * **Mehr Fehler als Versuche wird zugunsten der Versuche aufgelöst.** Die Zahl
 * der Versuche ist die tragende: Ohne sie hat die Fehlerquote keinen Nenner,
 * und ein Fall mit null Versuchen und drei Fehlern wäre keine Aussage, sondern
 * ein Widerspruch.
 *
 * **Ein Fall ohne Versuche wird nicht behalten**, wie ein Zähler auf null und
 * eine leere Fallmenge. Er sagt dasselbe wie sein Fehlen.
 */
function liesMesswert(wert) {
  if (wert === null || typeof wert !== 'object') return null;
  const versuche = nichtNegativ(wert.versuche);
  if (versuche === 0) return null;
  return { versuche, fehler: Math.min(nichtNegativ(wert.fehler), versuche) };
}

/**
 * Nur die Bezeichner behalten, die einem der beiden Bestände angehören.
 *
 * **Beide seit 4T-0127, und der Schaden der einen Fassung ist gemessen:** Ein
 * Datensatz, wie ihn eine künftige Fassung ablegt, verlor durch das Lesen mit
 * `isLesson` allein zwei von drei übersprungenen Einträgen. Die Stufen standen
 * darin, und niemand hat sie je zurückgeschrieben.
 */
function nurBekannte(wert) {
  if (!Array.isArray(wert)) return [];
  return wert.filter(
    (eintrag) => typeof eintrag === 'string' && (isLesson(eintrag) || isStage(eintrag)),
  );
}

/**
 * Wie viele gelungene Anwendungen dieser Bezeichner verlangt.
 *
 * Fragt den Bestand, zu dem er gehört. Für eine Stufe mit Fallmenge liefert
 * `stages.js` dabei `0`, und das ist keine Lücke, sondern die Aussage «hier ist
 * die Zahl nicht das Maß». Ein Zählwert wird für sie folglich auf null geklemmt
 * und gar nicht erst abgelegt.
 */
const verlangteAnwendungen = (key) =>
  isStage(key) ? stageApplications(key) : requiredApplications(key);

/**
 * Erreicht dieser Zustand das Ziel dieser Stelle des Pfades?
 *
 * Wie `verlangteAnwendungen` eine Weiche zwischen den beiden Beständen. Beide
 * Module führen eine Funktion dieses Namens, und beide antworten für einen
 * fremden Bezeichner mit `false`; gefragt wird trotzdem gezielt, damit ein
 * Tippfehler nicht in der einen Antwort untergeht.
 */
const erreichtZiel = (key, state) =>
  isStage(key) ? stageReachesGoal(key, state) : reachesGoal(key, state);

/**
 * Die Stelle, die unmittelbar auf dieser aufbaut, oder `null`.
 *
 * **Gesucht wird im eigenen Bestand.** Eine Lektion nennt nie eine Stufe als
 * Nachfolgerin und umgekehrt; der Grund steht im Kopf dieser Datei unter der
 * Grenze zwischen Freigabe und Auskunft. Gelaufen wird über `requires` und
 * nicht über die Nummer, damit die Antwort auch nach einer Verzweigung stimmt.
 */
function naechsteNach(key) {
  const bestand = isStage(key) ? STAGES : LESSONS;
  return bestand.find((eintrag) => eintrag.requires === key)?.key ?? null;
}

/**
 * Die Stellen, die auf dieser aufbauen, über beide Bestände.
 *
 * **Die einzige Auskunft, die die Bestandsgrenze überschreitet**, und sie tut es
 * seit 4T-0121. Der Grund für die Ausnahme liegt darin, dass sie reine
 * Information ist: Der Hinweis beim Überspringen sagt, was der Anwender sich
 * verbaut, und er löste bis dahin jeden Eintrag als `lektion.<kennung>.titel`
 * auf. Seit der Übergang eine eigene Anzeige hat, kennt sie beide Zweige des
 * Sprachbaums, und `skip('solveAlone')` nennt endlich die vier Stufen, die
 * tatsächlich darauf aufbauen; bis dahin nannte es nichts.
 *
 * Die Bauart ist die von `dependentsOf` in `catalog.js`: die Kette über
 * `requires` und nicht über die Position, damit die Antwort auch nach einer
 * Verzweigung stimmt.
 */
function abhaengigeVon(key) {
  const gefunden = new Set([key]);
  const liste = [];
  for (const eintrag of [...LESSONS, ...STAGES]) {
    if (eintrag.requires !== null && gefunden.has(eintrag.requires)) {
      gefunden.add(eintrag.key);
      liste.push(eintrag.key);
    }
  }
  return liste;
}

/**
 * Liest einen abgelegten Fortschritt.
 *
 * **Nichts hieran darf werfen.** Der Wert kommt aus einer Datei, die ein
 * Anwender von Hand bearbeitet haben kann, oder aus einer älteren Fassung des
 * Programms, die andere Lektionen kannte. Unbekannte Bezeichner werden
 * übergangen, unpassende Typen fallen auf den leeren Stand zurück; abgelehnt
 * wird nichts, denn eine Ablehnung kostete den gesamten übrigen Fortschritt.
 */
export function readProgress(roh) {
  const stand = leererFortschritt();
  if (roh === null || typeof roh !== 'object') return stand;

  for (const key of nurBekannte(roh.abgeschlossen)) stand.completed.add(key);
  for (const key of nurBekannte(roh.uebersprungen)) stand.skipped.add(key);

  if (roh.anwendungen !== null && typeof roh.anwendungen === 'object') {
    for (const [key, zahl] of Object.entries(roh.anwendungen)) {
      const bekannt = isLesson(key) || isStage(key);
      if (!bekannt || typeof zahl !== 'number' || !Number.isFinite(zahl)) continue;
      // Geklemmt, damit ein von Hand erhöhter Wert nicht mehr behauptet, als
      // die Lektion verlangt, und ein negativer keinen Zähler unter null zieht.
      stand.applications.set(
        key,
        Math.min(Math.max(Math.floor(zahl), 0), verlangteAnwendungen(key)),
      );
    }
  }

  // Die Fallmengen der Stufen.
  //
  // **Eine unbekannte Fallkennung wird hier behalten und nicht verworfen**, und
  // darin weicht das Lesen von `nurBekannte` oben ab. Der volle Umfang aus
  // 2A-0021 führt mehr Kennungen als die reduzierte Fassung; sie gegen den
  // heutigen Bestand zu prüfen zerstörte eine Deckung, die der Anwender
  // erarbeitet hat, und zwar unwiederbringlich beim nächsten Schreiben.
  // Gefiltert wird deshalb allein gegen den Stufenbestand, der feststeht, und
  // auf Zeichenketten. Beim Aufnehmen über `recordCase` gilt das Umgekehrte:
  // Dort ist eine unbekannte Kennung ein Fehler des Programms.
  if (roh.faelle !== null && typeof roh.faelle === 'object') {
    for (const [key, liste] of Object.entries(roh.faelle)) {
      if (!isStage(key) || !Array.isArray(liste)) continue;
      const menge = new Set(liste.filter((eintrag) => typeof eintrag === 'string'));
      if (menge.size > 0) stand.cases.set(key, menge);
    }
  }

  // Die gewählte Fassung je Stufe, seit 4T-0170.
  //
  // **Hier wird gefiltert und nicht behalten**, und darin weicht das Lesen von
  // `faelle` darüber ab. Eine unbekannte Fallkennung ist eine Leistung des
  // Anwenders aus einer volleren Fassung des Bestands; eine unbekannte
  // **Fassung** ist keine Leistung, sondern eine Angabe, mit der jede Rechnung
  // dieses Moduls arbeiten muss. Sie fällt deshalb auf die reduzierte zurück,
  // wie ein ungültiger Wert im Einstellungs-Katalog, und kostet den übrigen
  // Fortschritt nichts.
  //
  // **Eine Fassung ohne Fälle fällt ebenso zurück.** Der volle Umfang der
  // ersten Stufe trägt bis 3E-0058 keinen Fall; eine Stufe, die dort stünde,
  // zeigte eine leere Fallliste und wäre nie beherrscht. Setzen lässt sich das
  // über die Bedienung nicht, wohl aber in einer von Hand bearbeiteten Datei.
  //
  // **Eine eigene Abfrage auf eine bekannte Fassung steht hier nicht, und das
  // ist gemessen und nicht vergessen.** Sie stand in der ersten Fassung dieses
  // Tasks und ließ bei der Bruchmessung keine einzige Prüfung fallen: `casesOf`
  // liefert zu einer Fassung, die es nicht gibt, die leere Menge, und die Zeile
  // darunter fängt sie damit mit. Eine Verzweigung, die nichts entscheidet,
  // behauptet eine Sorgfalt, die es nicht gibt; denselben Weg ist 4T-0119 in
  // `createStageSetup` gegangen. **`setEdition` trennt die beiden Fälle sehr
  // wohl**, denn dort ist der Grund die Antwort an den Aufrufer.
  if (roh.fassungen !== null && typeof roh.fassungen === 'object') {
    for (const [key, fassung] of Object.entries(roh.fassungen)) {
      if (!isStage(key) || fassung === EDITIONS.REDUCED) continue;
      if (casesOf(key, fassung).size === 0) continue;
      stand.editions.set(key, fassung);
    }
  }

  // Die Messwerte je Fall, seit 4T-0134.
  //
  // **Die Übungsform wird geprüft, die Fallkennung nicht**, und die Asymmetrie
  // ist dieselbe wie bei `faelle` darüber: Es gibt genau zwei Übungsformen, und
  // eine dritte wäre ein Fehler des Programms; Fallkennungen dagegen bringt der
  // volle Umfang aus 2A-0021 mehr mit, als diese Fassung kennt, und sie gegen
  // den heutigen Bestand zu prüfen zerstörte Messwerte, die der Anwender
  // erarbeitet hat.
  if (roh.messwerte !== null && typeof roh.messwerte === 'object') {
    for (const [mode, tabelle] of Object.entries(roh.messwerte)) {
      if (!MODE_VALUES.has(mode) || tabelle === null || typeof tabelle !== 'object') continue;
      const gelesen = new Map();
      for (const [kennung, wert] of Object.entries(tabelle)) {
        if (typeof kennung !== 'string') continue;
        const messwert = liesMesswert(wert);
        if (messwert !== null) gelesen.set(kennung, messwert);
      }
      if (gelesen.size > 0) stand.metrics.set(mode, gelesen);
    }
  }

  // Ein dritter Widerspruch, seit 4T-0127: eine Stufe, deren Freigabe die
  // Deckung misst, unter den abgeschlossenen. Der Eintrag behauptete dort
  // etwas, das nie geprüft wurde. Er wird entfernt, und zwar **vor** der
  // Auflösung darunter: Sonst verlöre ein Datensatz, der die Stufe zugleich
  // als übersprungen führt, auch noch die Freigabe der folgenden.
  //
  // **Eine Stufe, die Anwendungen zählt, bleibt stehen.** Für sie ist die Zahl
  // das Maß, und `zaehle` legt sie nach der dritten Anwendung genau hier ab.
  //
  // **Gefragt wird `masteredByCoverage` und nicht `hasCases`**, seit 4T-0196.
  // Die dritte Stufe trägt Fälle und zählt trotzdem Anwendungen; ein `hasCases`
  // hier löschte beim nächsten Laden genau den Abschluss, den sie eben erst
  // abgelegt hat, und der Anwender fände seine Stufe wieder offen. Gefunden hat
  // das die Prüfung «eine Stufe mit Fallmenge wird aus der abgeschlossenen
  // Menge entfernt» und keine Überlegung.
  for (const key of [...stand.completed]) {
    if (masteredByCoverage(key)) stand.completed.delete(key);
  }

  // Zwei Widersprüche, die ein fremder Datensatz tragen kann, werden zugunsten
  // der abgeschlossenen Menge aufgelöst: Sie ist die Aussage, auf die es
  // ankommt, und beide Nebenangaben lassen sich aus ihr herstellen. Der Zähler
  // einer abgeschlossenen Lektion wird dabei nicht auf das Verlangte gesetzt,
  // sondern entfernt. Er ist ableitbar, und Abgeleitetes gehört nicht in die
  // Ablage: Sonst stünde dieselbe Aussage zweimal, und ein späterer Widerspruch
  // wäre wieder aufzulösen.
  for (const key of stand.completed) {
    stand.skipped.delete(key);
    stand.applications.delete(key);
  }

  // Auch hier beide Bestände, seit 4T-0127. Der gemessene Datensatz verlor die
  // zuletzt bearbeitete Stufe **ganz**, und anders als bei einer Menge fällt
  // das nicht einmal als Lücke auf: Ein leeres `zuletzt` sieht aus wie ein
  // erster Start.
  const zuletzt = roh.zuletzt;
  stand.last =
    typeof zuletzt === 'string' && (isLesson(zuletzt) || isStage(zuletzt)) ? zuletzt : null;
  return stand;
}

/** Schreibt den Fortschritt in die Form, die abgelegt wird. */
export function writeProgress(stand) {
  const anwendungen = {};
  for (const [key, zahl] of stand.applications) {
    if (zahl > 0) anwendungen[key] = zahl;
  }
  // Eine leere Fallmenge wird weggelassen, wie ein Zähler auf null. Abgelegt
  // wird, was der Anwender geleistet hat, und nicht ein Gerüst aus Leerstellen.
  const faelle = {};
  for (const [key, menge] of stand.cases) {
    if (menge.size > 0) faelle[key] = [...menge];
  }
  // Dieselbe Zurückhaltung bei den Fassungen: Die reduzierte ist die Vorgabe
  // und trüge als Eintrag keine Aussage. Wer von ihr abweicht, steht darin.
  const fassungen = {};
  for (const [key, fassung] of stand.editions) {
    if (fassung !== EDITIONS.REDUCED) fassungen[key] = fassung;
  }
  // Dieselbe Zurückhaltung bei den Messwerten: kein Eintrag ohne Versuch, keine
  // Übungsform ohne Eintrag.
  const messwerte = {};
  for (const [mode, tabelle] of stand.metrics) {
    const eintraege = {};
    for (const [kennung, { versuche, fehler }] of tabelle) {
      if (versuche > 0) eintraege[kennung] = { versuche, fehler };
    }
    if (Object.keys(eintraege).length > 0) messwerte[mode] = eintraege;
  }
  return {
    abgeschlossen: [...stand.completed],
    uebersprungen: [...stand.skipped],
    zuletzt: stand.last,
    anwendungen,
    faelle,
    fassungen,
    messwerte,
  };
}

/**
 * Erzeugt die Führung durch den Pfad.
 *
 * `load()` liefert den abgelegten Fortschritt, `save(wert)` nimmt ihn entgegen.
 * Fehlt eines von beiden, läuft der Pfad im Gedächtnis und vergisst beim
 * Schließen. Ein Wurf aus `save` wird hier nicht abgefangen: Das Gefäß aus
 * 4T-0026 fängt ihn bereits und meldet ihn über `speicherFehlt()`; ein zweiter
 * Fang an dieser Stelle verdeckte ihn nur.
 */
export function createPath({ load = null, save = null } = {}) {
  // **Veränderlich seit 4T-0151**, denn `reload` liest den Stand neu, wenn eine
  // Datei zurückgeholt worden ist. Jede Ausführung darunter liest die Variable
  // und nicht ihren ersten Wert.
  let stand = readProgress(load ? load() : null);

  // Die laufende Übung ist flüchtig und wird nicht abgelegt. Ohne sie zählte
  // derselbe erfüllte Würfelzustand bei jeder erneuten Prüfung wieder, und drei
  // verlangte Anwendungen wären mit einer einzigen gelösten Lage erfüllt.
  let running = null;

  // **Die laufende Übungsaufgabe des Trainings, seit 4T-0134.** Sie steht neben
  // `running` und nicht darin: Jene ist eine Stelle des Pfades, diese ein Fall
  // in einer Übungsform. Sie trägt dieselbe Aufgabe wie ihr Vorbild, und für
  // die Ausführungsübung wiegt sie schwerer als für den Lernpfad, denn dort
  // wird womöglich nach jedem Zug geurteilt. Entschieden vom Product Owner am
  // 2026-08-29: Jede vorgelegte Aufgabe zählt genau einen Versuch.
  let attempt = null;

  const sichere = () => {
    if (save) save(writeProgress(stand));
  };

  const isCompleted = (key) => stand.completed.has(key);
  const isSkipped = (key) => stand.skipped.has(key);

  // Eine abgeschlossene Lektion hat ihre Anwendungen hinter sich; der Zähler
  // wird deshalb abgeleitet und nicht gehalten.
  const applicationsOf = (key) =>
    isCompleted(key) ? verlangteAnwendungen(key) : (stand.applications.get(key) ?? 0);

  /**
   * Der Deckungsstand einer Stufe.
   *
   * `done` zählt die verlangten Fälle, die gelungen sind, und nicht die Größe
   * der abgelegten Menge: Ein Stand aus einer volleren Fassung des Bestands
   * bringt Kennungen mit, die es hier nicht gibt, und die dürfen den Stand
   * dieser Fassung nicht über ihr eigenes Maß heben.
   *
   * Für eine Stufe ohne Fallmenge und für einen unbekannten Bezeichner ist alles
   * null und leer. Das ist keine Ausrede, sondern die richtige Antwort: Es gibt
   * dort nichts zu decken.
   */
  /**
   * Die Fassung, in der diese Stufe steht.
   *
   * Die reduzierte, solange nichts anderes abgelegt ist. **Eine einzige
   * Bedeutung und keine zwei:** Was hier herauskommt, ist das, was gilt, und
   * zugleich das, was die Umschaltung markiert. Ein Rückfall auf die reduzierte
   * Fassung, wo die gewählte keinen Fall trägt, steht deshalb in `readProgress`
   * und nicht hier; sonst zeigte die Anzeige eine Fassung und die Rechnung
   * benutzte eine andere.
   */
  const editionOf = (key) => stand.editions.get(key) ?? EDITIONS.REDUCED;

  const coverageOf = (key) => {
    const verlangt = casesOf(key, editionOf(key));
    const gelungen = stand.cases.get(key) ?? new Set();
    const missing = [...verlangt].filter((kennung) => !gelungen.has(kennung));
    return { done: verlangt.size - missing.length, required: verlangt.size, missing };
  };

  /**
   * Ist diese Stufe beherrscht?
   *
   * Die Verdrahtung von `stageMastered` aus 4T-0117 an den abgelegten Stand.
   * Dort wird der Stand hereingereicht und nicht geholt, damit die Regel ohne
   * dieses Modul prüfbar bleibt; hier ist der Ort, an dem er herkommt.
   */
  const isStageMastered = (key) =>
    stageMastered(key, {
      cases: stand.cases.get(key) ?? null,
      applications: applicationsOf(key),
      edition: editionOf(key),
    });

  const stufeAbgelehnt = (key, reason) => ({
    counted: false,
    reason,
    ...coverageOf(key),
    mastered: isStageMastered(key),
  });

  /**
   * Nimmt einen gelungenen Fall in die Deckung auf, ohne zu sichern.
   *
   * **Seit 4T-0134 gibt es zwei Stellen, die das tun**, den Stufenbereich über
   * `recordCase` und die Ausführungsübung über `recordAttempt`. Die Rechnung
   * steht deshalb hier und nicht in einer von beiden; zwei Fassungen liefen
   * einander früher oder später davon.
   *
   * Liefert `true`, wenn die Menge dabei gewachsen ist. Wer sichert,
   * entscheidet der Aufrufer: Eine Wiederholung soll den Speicher nicht bei
   * jedem gelösten Fall anfassen.
   */
  const nimmFallAuf = (key, kennung) => {
    const gelungen = stand.cases.get(key);
    if (gelungen === undefined) {
      stand.cases.set(key, new Set([kennung]));
      return true;
    }
    if (gelungen.has(kennung)) return false;
    gelungen.add(kennung);
    return true;
  };

  /** Die abgelegten Messwerte eines Falls, oder das leere Paar. */
  const messwertVon = (mode, kennung) =>
    stand.metrics.get(mode)?.get(kennung) ?? { versuche: 0, fehler: 0 };

  /**
   * Ist diese Stelle des Pfades erledigt?
   *
   * Für eine Lektion ist es die abgelegte Menge, für eine Stufe die Rechnung
   * aus Deckung oder Zähler. **Beides fällt bei einer Stufe ohne Fallmenge
   * zusammen:** `zaehle` legt sie unter den abgeschlossenen ab, und
   * `applicationsOf` leitet daraus die verlangte Zahl ab, die `stageMastered`
   * dann wiederfindet.
   */
  const istFertig = (key) => (isStage(key) ? isStageMastered(key) : isCompleted(key));

  /**
   * Gibt diese Stelle die auf ihr aufbauende frei?
   *
   * **Hier läuft die Freigabe über die Grenze der beiden Bestände**, und nur
   * hier. Eine Stufe gilt als erledigt, sobald sie beherrscht ist; sie steht
   * dafür nicht zwingend unter den abgeschlossenen, denn bei einer Fallmenge
   * misst die Deckung.
   */
  const gibtFrei = (key) => isCompleted(key) || isSkipped(key) || istFertig(key);

  /**
   * Ist die Lektion oder die Stufe erreichbar?
   *
   * Die erste Lektion ist es immer, jede weitere Stelle, sobald ihre
   * Vorbedingung abgeschlossen, übersprungen oder beherrscht ist. Alle drei
   * geben frei, nur das erste gilt als abgeschlossen.
   */
  const isUnlocked = (key) => {
    const eintrag = lessonFor(key) ?? stageFor(key);
    if (eintrag === null) return false;
    if (eintrag.requires === null) return true;
    return gibtFrei(eintrag.requires);
  };

  const abgelehnt = (key, reason) => ({
    counted: false,
    reason,
    completed: istFertig(key),
    applications: applicationsOf(key),
    unlocked: null,
  });

  /**
   * Zählt eine gelungene Anwendung und schließt die Lektion ab, sobald die
   * verlangte Zahl erreicht ist.
   *
   * Der Zähler wächst und fällt nie. Eine misslungene Anwendung setzt ihn
   * ausdrücklich nicht zurück: Gezählt wird allein Gelungenes, weil
   * «misslungen» erst zu definieren wäre und jede Definition das Ausprobieren
   * bestrafte. Damit ist auch eine Wiederholung ohne Verlust möglich.
   */
  const zaehle = (key) => {
    let freigegeben = null;
    if (!istFertig(key)) {
      // **`verlangteAnwendungen` und nicht `requiredApplications`.** Der Import
      // aus `catalog.js` liefert für jede der vier Stufen `0`, gemessen am
      // 2026-08-27, und `jetzt >= 0` wäre immer wahr: Eine einzige Anwendung
      // schlösse die Stufe ab. Solange `check` jede Stufe abwies, war die
      // Stelle unerreichbar; wer sie öffnet, ohne diese Zeile mitzuziehen,
      // verschenkt die dritte Stufe.
      const verlangt = verlangteAnwendungen(key);
      const jetzt = (stand.applications.get(key) ?? 0) + 1;
      if (jetzt >= verlangt) {
        stand.applications.delete(key);
        stand.completed.add(key);
        stand.skipped.delete(key);
        freigegeben = naechsteNach(key);
      } else {
        stand.applications.set(key, jetzt);
      }
    }

    stand.last = key;
    running = null;
    sichere();
    return {
      counted: true,
      reason: null,
      completed: istFertig(key),
      applications: applicationsOf(key),
      unlocked: freigegeben,
    };
  };

  return {
    isUnlocked,
    isCompleted,
    isSkipped,
    applicationsOf,
    coverageOf,
    isStageMastered,
    editionOf,

    /**
     * Setzt die Fassung, in der eine Stufe geübt wird, 4T-0170.
     *
     * **Die Wahl liegt im Fortschritt und nicht in den Einstellungen**,
     * entschieden vom Product Owner am 2026-09-04. Sie gehört zu einer
     * einzelnen Stufe und nicht zur Person, und die Bedienung dafür sitzt aus
     * demselben Grund beim Lernstoff. Denselben Weg hat am 2026-09-02 die Wahl
     * zwischen den beiden Wegen der Zeitnahme genommen.
     *
     * **Drei Gründe werden getrennt abgewiesen.** Keine Stufe, eine Stufe ohne
     * Fallmenge, und eine Fassung, die es nicht gibt oder die bei dieser Stufe
     * heute keinen Fall trägt. Ein gemeinsamer Grund verstellte die Ursache,
     * und derselbe Anspruch trägt bereits `UNKNOWN_MODE` seit 4T-0134.
     *
     * **Eine unbekannte Fassung wird hier abgewiesen und beim Lesen
     * übergangen.** Die Asymmetrie ist dieselbe wie zwischen `recordCase` und
     * `readProgress`: Hier kommt der Wert aus dem laufenden Programm und ist
     * dann ein Fehler, dort aus einer Datei, die ein Anwender bearbeitet haben
     * kann.
     *
     * **Der Fortschritt bleibt unangetastet, und das ist AK4 der Story.** Die
     * Menge der gelungenen Fälle wird nicht angefasst; ein Wechsel ändert
     * allein, welche Kennungen verlangt sind. Es gibt hier nichts umzurechnen,
     * und genau das ist der Grund, aus dem die Deckung seit 4T-0118 eine Menge
     * ist und kein Zähler.
     *
     * **Die laufende Übungsaufgabe endet.** Sie steht auf einem Fall, den die
     * neue Fassung womöglich nicht führt, und ein Urteil über eine Aufgabe, die
     * es in der geltenden Fassung nicht gibt, wäre eine Aussage über nichts.
     * Dieselbe Haltung wie bei `abort` und bei `reload`.
     */
    setEdition: (key, edition) => {
      if (!isStage(key)) return { ok: false, reason: REJECTED.UNKNOWN };
      if (!hasCases(key)) return { ok: false, reason: REJECTED.NO_CASES };
      if (!EDITION_VALUES.has(edition)) return { ok: false, reason: REJECTED.UNKNOWN_EDITION };
      // **Ein leeres Gefäß wird abgewiesen, eine Denkweise nicht**, seit
      // 4T-0196. Beide Fassungen tragen null Fälle, und trotzdem ist die eine
      // ein Angebot und die andere keines: Wo Blicke stehen und kein Fall,
      // wartet die Fassung auf ihren Inhalt; wo kein Blick steht, ist die
      // Fassung der Weg über das eigene Überlegen und vollständig. Gerechnet an
      // der Blickliste und nicht an einer Liste der Ausnahmen.
      if (casesOf(key, edition).size === 0 && viewsOf(key, edition).length > 0) {
        return { ok: false, reason: REJECTED.EMPTY_EDITION };
      }
      if (editionOf(key) === edition) return { ok: true, reason: null, changed: false };
      if (edition === EDITIONS.REDUCED) stand.editions.delete(key);
      else stand.editions.set(key, edition);
      attempt = null;
      sichere();
      return { ok: true, reason: null, changed: true };
    },

    /**
     * Nimmt einen gelungenen Fall einer Stufe auf.
     *
     * **Ohne den Begriff der laufenden Übung**, anders als beim Zähler. Die
     * Menge ist gegen doppeltes Zählen von sich aus dicht, und was ein
     * gelungener Fall ist, entscheidet die Erkennung des Übungsmodus und nicht
     * dieses Modul.
     *
     * **Eine unbekannte Kennung wird abgewiesen.** Beim Lesen eines abgelegten
     * Standes wird sie behalten, weil sie dort aus einer volleren Fassung
     * stammen kann; hier kommt sie aus dem laufenden Programm, und dann ist sie
     * ein Fehler.
     *
     * Abgelegt wird nur, wenn die Menge dabei wirklich gewachsen ist. Eine
     * Wiederholung soll den Speicher nicht bei jedem gelösten Fall anfassen.
     */
    recordCase: (key, kennung) => {
      if (!isStage(key)) return stufeAbgelehnt(key, REJECTED.UNKNOWN);
      if (!hasCases(key)) return stufeAbgelehnt(key, REJECTED.NO_CASES);
      if (!casesOf(key, editionOf(key)).has(kennung))
        return stufeAbgelehnt(key, REJECTED.UNKNOWN_CASE);
      if (nimmFallAuf(key, kennung)) sichere();
      return {
        counted: true,
        reason: null,
        ...coverageOf(key),
        mastered: isStageMastered(key),
      };
    },

    /**
     * Meldet die Übungsaufgabe an, die der Anwender gerade vorgelegt bekommt.
     *
     * Ohne sie nimmt `recordAttempt` nichts an. **Das ist der Schutz gegen
     * doppeltes Zählen**, und er ist hier nötiger als beim Zähler des
     * Lernpfads: Die Ausführungsübung urteilt womöglich nach jedem Zug, und
     * ohne die Anmeldung buchte jeder weitere Zug einen neuen Versuch auf
     * denselben Fall.
     *
     * **Die Freigabe der Stufe wird nicht geprüft**, und das ist dem Bestand
     * abgesehen und keine Nachlässigkeit: `recordCase` prüft sie ebenso wenig.
     * Welche Stufe geübt werden darf, entscheidet die Auswahl in der
     * Oberfläche; dieses Modul rechnet.
     */
    beginAttempt: (key, { kennung, mode } = {}) => {
      if (!isStage(key)) return { ok: false, reason: REJECTED.UNKNOWN };
      if (!hasCases(key)) return { ok: false, reason: REJECTED.NO_CASES };
      if (!casesOf(key, editionOf(key)).has(kennung))
        return { ok: false, reason: REJECTED.UNKNOWN_CASE };
      if (!MODE_VALUES.has(mode)) return { ok: false, reason: REJECTED.UNKNOWN_MODE };
      attempt = { key, kennung, mode };
      return { ok: true, reason: null };
    },

    /**
     * Bucht das Urteil über die laufende Übungsaufgabe und beendet sie.
     *
     * **Der Versuch zählt immer, der Fehler nur bei `false`.** Entschieden vom
     * Product Owner am 2026-08-29: Jede vorgelegte Aufgabe zählt genau einen
     * Versuch. Ein zweiter Aufruf ohne neue Aufgabe wird mit `NOT_RUNNING`
     * abgewiesen; das ist derselbe Grund, den der Zähler des Lernpfads schon
     * führt, und eine zweite Aussage darüber wäre eine Doppelung.
     *
     * **Aufgeben ist ein Fehlversuch und braucht keinen eigenen Weg.** Wer sich
     * die Zugfolge zeigen lässt, ruft `recordAttempt(false)`; für die Buchung
     * ist das dasselbe wie eine falsche Antwort. Entschieden am selben Tag, mit
     * der Begründung, dass eine geschönte Quote den Fall seltener vorlegte,
     * obwohl er gerade der ist, der geübt gehört.
     *
     * **Die Deckung wächst allein aus der Ausführung.** Abschnitt 11.7 des
     * Didaktik-Konzepts misst die am Würfel geprüfte Anwendung; eine richtige
     * Benennung ist keine. `coverage` ist deshalb `null`, wo nichts gebucht
     * wurde, und trägt sonst denselben Stand wie `recordCase`.
     */
    recordAttempt: (correct) => {
      if (attempt === null) {
        return {
          counted: false,
          reason: REJECTED.NOT_RUNNING,
          versuche: 0,
          fehler: 0,
          coverage: null,
        };
      }
      const { key, kennung, mode } = attempt;
      attempt = null;
      const tabelle = stand.metrics.get(mode) ?? new Map();
      const bisher = messwertVon(mode, kennung);
      const jetzt = { versuche: bisher.versuche + 1, fehler: bisher.fehler + (correct ? 0 : 1) };
      tabelle.set(kennung, jetzt);
      stand.metrics.set(mode, tabelle);

      let coverage = null;
      if (correct === true && mode === EXERCISE_MODES.EXECUTION) {
        nimmFallAuf(key, kennung);
        coverage = { ...coverageOf(key), mastered: isStageMastered(key) };
      }
      sichere();
      return { counted: true, reason: null, ...jetzt, coverage };
    },

    /** Läuft gerade eine Übungsaufgabe, und welche? */
    runningAttempt: () => attempt,

    /**
     * Setzt die Messwerte einer Stufe zurück, 4T-0144.
     *
     * **Eine Stufe und nicht alles**, entschieden vom Product Owner am
     * 2026-09-02. Die Schaltfläche steht unter der Liste einer Stufe, und was
     * sie löscht, ist das, was darüber steht; eine, die über ihren sichtbaren
     * Gegenstand hinausgriffe, wäre eine Falle.
     *
     * **Beide Übungsformen zugleich.** Wer eine Stufe von vorn üben will,
     * meint das Erkennen und das Ausführen; getrennt zurückzusetzen verlangte
     * zwei Griffe und zwei Rückfragen für einen Vorsatz.
     *
     * **Die Deckung bleibt unberührt, und das ist der Kern.** Sie gibt nach
     * Abschnitt 11.7 des Didaktik-Konzepts die nächste Stufe frei und wächst
     * nur; wer mit einer Übungsstatistik seinen Lernfortschritt verlöre, hätte
     * einen Schaden aus einer Handlung, die ihn nicht ankündigt. Dasselbe gilt
     * für die abgeschlossenen und die übersprungenen Stellen und für die Zahl
     * der Anwendungen.
     *
     * **Die laufende Übungsaufgabe bleibt stehen.** Zurücksetzen ist kein
     * Setzen des Würfels: Die Lage liegt weiter, die Aufgabe gilt weiter, und
     * ihr Urteil bucht danach einen Versuch, den es wirklich gegeben hat.
     * Darin unterscheidet sich dieser Weg von `clear`.
     *
     * **Eine Übungsform ohne Eintrag wird entfernt und nicht leer behalten.**
     * Dieselbe Zurückhaltung übt `writeProgress` beim Ablegen; eine leere
     * Tabelle sagt dasselbe wie ihr Fehlen.
     *
     * Abgelegt wird nur, wenn wirklich etwas fortgefallen ist, wie bei
     * `recordCase`. Geliefert wird die Zahl der geräumten Einträge, damit der
     * Aufrufer weiß, ob es etwas zu räumen gab.
     */
    resetMetrics: (key) => {
      if (!isStage(key)) return { ok: false, reason: REJECTED.UNKNOWN, geraeumt: 0 };
      if (!hasCases(key)) return { ok: false, reason: REJECTED.NO_CASES, geraeumt: 0 };
      const kennungen = casesOf(key, editionOf(key));
      let geraeumt = 0;
      for (const [mode, tabelle] of stand.metrics) {
        for (const kennung of kennungen) {
          if (tabelle.delete(kennung)) geraeumt += 1;
        }
        if (tabelle.size === 0) stand.metrics.delete(mode);
      }
      if (geraeumt > 0) sichere();
      return { ok: true, reason: null, geraeumt };
    },

    /**
     * Die Messwerte einer Stufe in einer Übungsform, Fall für Fall.
     *
     * **Jeder Fall der Stufe steht darin, auch der nie versuchte**, mit null
     * und null. Das ist keine Bequemlichkeit für die Anzeige, sondern die
     * Voraussetzung der gewichteten Ziehung: Sie gibt dem nie versuchten Fall
     * das höchste Gewicht und kann ihn nur gewichten, wenn sie ihn zu sehen
     * bekommt. Dieselbe Haltung trägt `coverageOf`, das die verlangten Fälle
     * zählt und nicht die abgelegten.
     *
     * Die Reihenfolge ist die des Bestands. Für eine Stufe ohne Fallmenge und
     * für eine unbekannte Übungsform ist die Liste leer.
     */
    metricsOf: (key, mode) => {
      if (!MODE_VALUES.has(mode)) return [];
      return [...casesOf(key, editionOf(key))].map((kennung) => ({
        kennung,
        ...messwertVon(mode, kennung),
      }));
    },

    /**
     * Die zehn Lektionen mit ihrem Stand, in der Reihenfolge des Pfades.
     *
     * **Sie führt die Stufen nicht mit, und das ist gemessen:** Vier Stufen
     * hier angehängt, und sechs Prüfungen fallen, allesamt Aussagen über den
     * Lernpfad des Anfängerverfahrens. Sie sind wahr und sollen wahr bleiben;
     * sie so zu weiten, dass vier Stufen hindurchpassen, machte sie stumpfer.
     * Derselbe Befund wie in 4T-0117, eine Ebene weiter. Für die Stufen steht
     * `stageOverview` daneben.
     */
    overview: () =>
      LESSONS.map((lesson) => ({
        number: lesson.number,
        key: lesson.key,
        practice: lesson.practice,
        unlocked: isUnlocked(lesson.key),
        completed: isCompleted(lesson.key),
        skipped: isSkipped(lesson.key),
        applications: applicationsOf(lesson.key),
        required: lesson.applications,
      })),

    /**
     * Die vier Stufen mit ihrem Stand, in der Reihenfolge aus `STAGES`.
     *
     * Dieselben Felder wie oben, ohne `practice`: Jede Stufe ist am Würfel
     * prüfbar, und woran sie geübt wird, sagt die Lage und nicht der Bestand.
     *
     * **`completed` ist `istFertig` und nicht `isCompleted`.** Bei einer Stufe
     * mit Fallmenge steht der Abschluss in der Deckung, nicht in einer Menge
     * abgeschlossener Bezeichner; wer hier `isCompleted` fragte, zeigte eine
     * vollständig gedeckte Stufe als offen.
     */
    stageOverview: () =>
      STAGES.map((stage) => ({
        number: stage.number,
        key: stage.key,
        unlocked: isUnlocked(stage.key),
        completed: istFertig(stage.key),
        skipped: isSkipped(stage.key),
        applications: applicationsOf(stage.key),
        required: verlangteAnwendungen(stage.key),
      })),

    /**
     * Wo weiterzumachen ist.
     *
     * `stored` unterscheidet den abgelegten Stand vom Vorschlag beim ersten
     * Start. Nur im ersten Fall darf die Oberfläche anbieten, an der zuletzt
     * bearbeiteten Lektion weiterzumachen; im zweiten gäbe es nichts
     * fortzusetzen.
     */
    resume: () => {
      if (isLesson(stand.last)) return { key: stand.last, stored: true };
      const offen = LESSONS.find((lesson) => !isCompleted(lesson.key) && isUnlocked(lesson.key));
      return { key: offen ? offen.key : LESSONS[0].key, stored: false };
    },

    /**
     * Wo im Übergang weiterzumachen ist.
     *
     * Die Entsprechung zu `resume` für die vier Stufen, und aus demselben Grund
     * eine zweite Auskunft statt einer Erweiterung: **Sobald die zuletzt
     * bearbeitete Stelle eine Stufe sein darf, lieferte ein gemeinsames
     * `resume` sie an die Lektionsanzeige**, und die bekäme einen Bezeichner,
     * den ihr Bestand nicht kennt. Jede der beiden Auskünfte antwortet
     * deshalb nur über ihren eigenen Bestand, und welche die Oberfläche fragt,
     * entscheidet 4T-0121.
     */
    stageResume: () => {
      if (isStage(stand.last)) return { key: stand.last, stored: true };
      const offen = STAGES.find((stage) => !istFertig(stage.key) && isUnlocked(stage.key));
      return { key: offen ? offen.key : STAGES[0].key, stored: false };
    },

    /**
     * Beginnt eine Übung an dieser Lektion oder an dieser Stufe.
     *
     * Setzt zugleich die zuletzt bearbeitete Stelle, denn genau das ist sie von
     * diesem Augenblick an.
     *
     * **Für eine Stufe ist `practice` `null` und nicht `PRACTICE.NONE`.** Jener
     * Wert heißt «ohne Würfelaufgabe» und wäre gelogen: Jede Stufe hat eine.
     * `null` heißt «diese Frage stellt sich hier nicht», und woraus eine
     * Übungslage entsteht, sagt `stageSetup.js` und nicht der Bestand.
     */
    begin: (key) => {
      if (!isLesson(key) && !isStage(key)) return { ok: false, reason: REJECTED.UNKNOWN };
      if (!isUnlocked(key)) return { ok: false, reason: REJECTED.LOCKED };
      running = key;
      stand.last = key;
      sichere();
      return { ok: true, reason: null, practice: lessonFor(key)?.practice ?? null };
    },

    /** Läuft gerade eine Übung, und an welcher Lektion? */
    running: () => running,

    /**
     * Beendet die laufende Übung, ohne zu zählen.
     *
     * **Gebraucht wird das, sobald der Würfel von außen gesetzt wird**, etwa
     * über «Gelöster Würfel», eine Verwürfelung oder das Ende einer
     * Wiedergabe. Ohne diesen Weg bliebe die Übung auf einer Lage stehen, die
     * es nicht mehr gibt, und ein gesetzter gelöster Würfel erfüllte beim
     * nächsten Zug jedes Ziel des Pfades. Die Prüfung am Würfel wäre damit
     * umgangen, und der Fortschritt behauptete etwas, das niemand geübt hat.
     *
     * Der Zähler bleibt, wie er ist. Abbrechen ist kein Misslingen, und
     * Misslingen setzt den Zähler ohnehin nicht zurück.
     *
     * **Die laufende Übungsaufgabe endet mit, seit 4T-0134**, und aus demselben
     * Grund: Ein von außen gesetzter Würfel macht auch sie hinfällig. Gebucht
     * wird dabei nichts; ein Abbruch ist kein Fehlversuch, denn der Anwender
     * hat den Fall nicht abgelehnt, sondern gar nicht erst beantwortet.
     */
    abort: () => {
      running = null;
      attempt = null;
    },

    /**
     * Prüft den Zustand des Übungswürfels gegen das Ziel dieser Stelle.
     *
     * Der einzige Weg, eine prüfbare Lektion oder eine Stufe ohne Fallmenge
     * voranzubringen. Was hier gezählt wird, hat das Programm selbst gesehen.
     *
     * **Eine Stufe, deren Freigabe die Deckung misst, wird abgewiesen, und das
     * ist kein Mangel, sondern der Schutz.** Dort liefert
     * `verlangteAnwendungen` folgerichtig `0`, und `jetzt >= 0` wäre sofort
     * wahr: Ein einziger Durchlauf schlösse eine Stufe ab, für die zehn Fälle zu
     * üben sind. Ihr Weg ist `recordCase`, und welcher Fall vorliegt,
     * entscheidet die Erkennung und nicht dieses Modul.
     *
     * **Gefragt wird `masteredByCoverage` und nicht `hasCases`**, seit 4T-0196.
     * Die dritte Stufe trägt Fälle und wird über drei gelungene Anwendungen
     * freigegeben; ein `hasCases` hier nähme ihr den einzigen Weg, auf dem
     * diese Anwendungen gezählt werden, und der Pfad stünde still. Gemessen an
     * jenem Tag: Von 1027 Prüfungen fielen sechzehn, darunter «die vierte Stufe
     * folgt auf die dritte».
     */
    check: (key, state) => {
      if (!isLesson(key) && !isStage(key)) return abgelehnt(key, REJECTED.UNKNOWN);
      if (masteredByCoverage(key)) return abgelehnt(key, REJECTED.COVERAGE);
      if (isLesson(key) && !isCheckable(key)) return abgelehnt(key, REJECTED.NOT_CHECKABLE);
      if (!isUnlocked(key)) return abgelehnt(key, REJECTED.LOCKED);
      if (running !== key) return abgelehnt(key, REJECTED.NOT_RUNNING);
      if (!erreichtZiel(key, state)) return abgelehnt(key, REJECTED.GOAL_MISSED);
      return zaehle(key);
    },

    /**
     * Nimmt eine gelungene Anwendung von außen entgegen.
     *
     * Nur für Lektion 0, die einzige ohne Würfelaufgabe. Auf einer prüfbaren
     * Lektion wird die Meldung abgewiesen, sonst ließe sich die Prüfung am
     * Würfel umgehen, und der Fortschritt behauptete etwas, das niemand
     * gesehen hat.
     */
    report: (key) => {
      if (!isLesson(key) && !isStage(key)) return abgelehnt(key, REJECTED.UNKNOWN);
      // **Jede Stufe trägt ein Ziel und ist damit am Würfel prüfbar.** Sie wird
      // deshalb hier abgewiesen, und zwar mit diesem Grund und nicht mit
      // «unbekannt»: Der alte Grund sagte, es gebe sie nicht, und schickte den
      // Suchenden an die falsche Stelle.
      if (isStage(key) || isCheckable(key)) return abgelehnt(key, REJECTED.CHECKABLE);
      if (!isUnlocked(key)) return abgelehnt(key, REJECTED.LOCKED);
      if (running !== key) return abgelehnt(key, REJECTED.NOT_RUNNING);
      return zaehle(key);
    },

    /**
     * Überspringt eine Lektion oder eine Stufe.
     *
     * Sie wird dadurch nicht abgeschlossen, gibt aber die folgende frei. Der
     * Hinweis, worauf sie aufbaut, entsteht aus der zurückgelieferten Liste;
     * die Worte dazu stehen in `i18n`.
     *
     * **AK6 von S-0040 verlangt das Überspringen für Stufen ausdrücklich**, und
     * eine übersprungene Stufe steht danach in derselben Menge wie eine
     * übersprungene Lektion. Eine eigene Menge dafür wäre keine Trennung,
     * sondern eine Doppelung: gleicher Typ, gleiche Bedeutung, und jede
     * Lesestelle müsste beide fragen.
     */
    skip: (key) => {
      if (!isLesson(key) && !isStage(key)) return { ok: false, reason: REJECTED.UNKNOWN };
      if (!isUnlocked(key)) return { ok: false, reason: REJECTED.LOCKED };
      if (istFertig(key)) return { ok: false, reason: null, affects: [] };
      stand.skipped.add(key);
      const naechste = naechsteNach(key);
      if (naechste !== null) stand.last = naechste;
      running = null;
      sichere();
      return { ok: true, reason: null, affects: abhaengigeVon(key) };
    },

    /**
     * Gibt diese Stelle frei, indem alles übersprungen wird, worauf sie aufbaut.
     *
     * **Der freie Einstieg, 4T-0207.** Abschnitt 7 des Didaktik-Konzepts lässt
     * seit dem 2026-09-08 an jeder Stelle einsteigen: Wer nicht bei null
     * anfängt, wählt die Lektion oder Stufe, die er lernen will, und übt dort.
     * Bis dahin führte der Weg an die dritte Stufe über zwölf Übersprünge
     * nacheinander.
     *
     * **Gelaufen wird über `requires` und durch beide Bestände**, denn die erste
     * Stufe baut auf der letzten Lektion auf. Wer bei einer Stufe einsteigt,
     * überspringt deshalb auch den Lernpfad, soweit er nicht erledigt ist; genau
     * das ist die Bedingung, unter der die Stufe sonst frei würde.
     *
     * **Übersprungen wird nur, was noch nicht freigibt.** Eine abgeschlossene
     * oder beherrschte Stelle bleibt, was sie ist, und taucht in der Liste nicht
     * auf: Sie unter die übersprungenen zu legen, behauptete, an ihr sei nichts
     * geprüft. **Die Stelle selbst wird nicht übersprungen**, denn an ihr soll
     * geübt werden.
     *
     * **`skipped` überschreitet die Bestandsgrenze**, wie `affects` beim
     * Überspringen, und aus demselben Grund: Es ist reine Information für den
     * Hinweis, und die Oberfläche löst beide Zweige des Sprachbaums auf. Die
     * Liste steht in der Reihenfolge des Weges, vom Anfang her.
     *
     * Eine schon freie Stelle ist kein Fehler und ändert nichts; die Antwort ist
     * dann eine leere Liste und kein Abweisungsgrund.
     */
    skipTo: (key) => {
      if (!isLesson(key) && !isStage(key)) {
        return { ok: false, reason: REJECTED.UNKNOWN, skipped: [] };
      }
      if (isUnlocked(key)) return { ok: true, reason: null, skipped: [] };
      const uebergangen = [];
      let vorbedingung = (lessonFor(key) ?? stageFor(key)).requires;
      while (vorbedingung !== null) {
        if (!gibtFrei(vorbedingung)) {
          stand.skipped.add(vorbedingung);
          uebergangen.push(vorbedingung);
        }
        vorbedingung = (lessonFor(vorbedingung) ?? stageFor(vorbedingung)).requires;
      }
      // **Die gewählte Stelle ist danach die zuletzt bearbeitete**, anders als
      // beim Blättern. Der Anwender hat sich für sie entschieden, und wer den
      // Browser schließt, soll dort weitermachen und nicht am Anfang des Weges.
      stand.last = key;
      // **Eine laufende Übung läuft weiter**, anders als beim Überspringen. Sie
      // steht an einer freien Stelle, denn nur dort lässt sich eine beginnen,
      // und der Einstieg ändert an ihr nichts; zählt sie später, macht `zaehle`
      // aus «übersprungen» richtig «abgeschlossen». Sie hier zu beenden ließ ihre
      // Meldung stehen und das Lösen still ins Leere laufen, gefunden am
      // 2026-11-20 von der unabhängigen Prüfung.
      sichere();
      return { ok: true, reason: null, skipped: uebergangen.reverse() };
    },

    /**
     * Löscht den Fortschritt vollständig.
     *
     * Die Ankündigung davor ist Sache der Oberfläche. Hier steht allein die
     * Ausführung, und sie geschieht nur auf ausdrücklichen Aufruf.
     */
    clear: () => {
      stand.completed.clear();
      stand.skipped.clear();
      stand.applications.clear();
      stand.cases.clear();
      // **Die Fassung geht mit, seit 4T-0170.** Wer den Fortschritt löscht,
      // fängt von vorn an, und die reduzierte Fassung ist der Anfang; eine
      // stehen gebliebene Wahl zeigte dem geleerten Stand einundzwanzig Fälle
      // statt sechs.
      stand.editions.clear();
      stand.metrics.clear();
      stand.last = null;
      running = null;
      attempt = null;
      sichere();
    },

    /**
     * Liest den Stand aus der Ablage neu, 4T-0151.
     *
     * **Der Fall ist «Aus Datei holen».** `uebernimm` in den Einstellungen
     * ersetzt den Datensatz, und dieser Pfad hielte sonst seinen alten Stand
     * weiter; sein nächstes Sichern schriebe ihn über den geholten. Gemessen am
     * 2026-09-03: Eine Datei mit drei abgeschlossenen Lektionen übernommen,
     * eine Lektion begonnen, und der Datensatz führte keine mehr.
     *
     * **Gesichert wird hier nicht.** Der Stand kommt gerade aus dem Speicher;
     * ihn zurückzuschreiben wäre eine Schreibung ohne Änderung, und bei einem
     * Stand aus einer neueren Fassung liefe sie in die Schreibsperre.
     *
     * **Die laufende Übung und die laufende Aufgabe enden**, wie bei `abort`
     * und aus demselben Grund: Sie gehörten zu einem Stand, den es nicht mehr
     * gibt, und ein Urteil über sie buchte auf den neuen.
     */
    reload: () => {
      stand = readProgress(load ? load() : null);
      running = null;
      attempt = null;
    },

    /** Der Fortschritt in der Form, die abgelegt wird. Für Sicherung und Prüfung. */
    snapshot: () => writeProgress(stand),
  };
}
