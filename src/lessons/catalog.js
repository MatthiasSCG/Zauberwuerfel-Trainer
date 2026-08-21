// Die zehn Lektionen des Lernpfads als Daten.
//
// Der Schnitt stammt aus Abschnitt 3 des Didaktik-Konzepts, die Zahl der
// verlangten Anwendungen aus dem Entscheid des Product Owners vom 2026-08-16,
// festgehalten in Abschnitt 7 desselben Dokuments.
//
// **Das Weiterkommen steht hier nicht noch einmal formuliert.** Es steht als
// Bezeichner eines Zwischenziels aus `core/goals.js`, und das Prädikat selbst
// wird von dort geholt. Eine eigene Fassung im Lernpfad wäre genau die
// Fehlerquelle, die 4T-0042 beseitigt hat: Ein Prädikat, das minimal anders
// rechnet als das des Lösers, gibt eine Lektion frei, deren Ziel nicht steht,
// und meldet sich dabei nicht.
//
// **Die Texte stehen hier ebenfalls nicht.** Eine Lektion trägt einen
// Bezeichner, die Worte für den Anwender stehen in `i18n` und werden über
// `lektion.${key}.…` angesprochen, wie die Oberfläche es seit 4T-0034 mit den
// Schritten des Lösers hält.
//
// **Die Zugfolgen stehen hier ebenso wenig, wohl aber ihre Namen.** Eine
// Lektion nennt in `sequences` die Kennungen der gelernten Zugfolgen, die sie
// vorführt; der Wortlaut steht in `SEQUENCES` des Lösers, und `lessons`
// importiert ihn nicht. Das ist dieselbe Haltung wie bei den Zwischenzielen:
// Wer beide Seiten lesen darf, prüft die Deckung, und sie wird in beide
// Richtungen geprüft. Eine zweite Fassung des Wortlauts hier wäre die
// Fehlerquelle, die niemand bemerkt, solange nur eine Seite gelesen wird.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine
// globalen Namen. Die ESLint-Konfiguration erzwingt das.

import { applyMoves, equals, solvedCube } from '../core/cube.js';
import { GOALS } from '../core/goals.js';
import { parseMovesOrThrow } from '../core/notation.js';

/** Die Zwischenziele nach ihrem Bezeichner. */
const GOAL_BY_KEY = new Map(GOALS.map((goal) => [goal.key, goal]));

/**
 * Woran eine Lektion geübt wird.
 *
 * `none` ist die Lektion ohne Würfelaufgabe, `drill` die vorgegebene Zugfolge
 * auf gelöstem Würfel, `setup` eine Übungslage nach 4T-0044, `scramble` ein
 * vollständig verwürfelter Würfel. Die Unterscheidung ist nötig, weil Lektion 8
 * und Lektion 9 dasselbe Ziel tragen, nämlich den gelösten Würfel, und sich
 * allein in der Ausgangslage unterscheiden.
 */
export const PRACTICE = { NONE: 'none', DRILL: 'drill', SETUP: 'setup', SCRAMBLE: 'scramble' };

/**
 * Worauf die Lektion den Blick richtet.
 *
 * `default` ist die Ausgangsansicht mit oben, rechts und vorn, `bottom` die
 * Ansicht auf die Unterseite. Sie wird in den Lektionen 2 und 3 gebraucht, weil
 * die erste Schicht unten entsteht und der Anwender dorthin nicht von selbst
 * sieht.
 *
 * **Hier steht der Bezeichner und nicht der Winkel.** Ein Winkel wäre
 * Anzeigewissen in einem Modul, das ohne Browser läuft; die beiden Winkel
 * stehen in `view/blick.js`, und `app` bringt beide Seiten zusammen. Die
 * Lektion sagt, was sie zeigen will, nicht wie es gerechnet wird.
 */
export const VIEW = { DEFAULT: 'default', BOTTOM: 'bottom' };

/**
 * Was die Lektion am Würfel hervorhebt, während sie angezeigt wird.
 *
 * `none` zeigt den Würfel wie sonst, `workingCorner` lässt allein die
 * Arbeitsstelle stehen und nimmt alles Übrige zurück. Sie wird in Lektion 8
 * gebraucht, und der Grund steht in Abschnitt 5 des Didaktik-Konzepts: Dort
 * sieht der Würfel zwischendurch zerstört aus, und der Anwender soll genau das
 * **nicht** ansehen. Das ist die Umkehrung der Hervorhebung des anstehenden
 * Zuges: Nicht das Wichtige wird betont, sondern das Ablenkende genommen.
 *
 * **Hier steht der Bezeichner und nicht die Stelle.** Wo die Arbeitsstelle
 * liegt, weiß `view/geometrie.js`; dieses Modul läuft ohne Browser und kennt
 * keine Koordinaten. Dieselbe Trennung wie bei `VIEW`.
 */
export const FOCUS = { NONE: 'none', WORKING_CORNER: 'workingCorner' };

/**
 * Welche Hilfe die Lektion auf Abruf anbietet.
 *
 * `none` bietet keine, `nextStep` nennt den nächsten Schritt der Lernlösung
 * samt der Lektion, in der er steht. Sie wird allein in Lektion 9 gebraucht,
 * denn sie ist die einzige, in der niemand mehr sagt, was zu tun ist; S-0014
 * verlangt in AK3 eine erreichbare Hilfe, die nicht die ganze Lösung nennt.
 *
 * **Hier steht wieder der Bezeichner und nicht die Auskunft.** Woher sie
 * kommt, weiß der Löser, und `lessons` kennt ihn nicht. Dieselbe Trennung wie
 * bei `VIEW` und `FOCUS`: Die Lektion sagt, dass sie eine Hilfe anbietet, nicht
 * wie diese gerechnet wird.
 */
export const HELP = { NONE: 'none', NEXT_STEP: 'nextStep' };

/**
 * Die zehn Lektionen in der Reihenfolge des Pfades.
 *
 * `requires` nennt die Lektion, die vorausgeht, und nicht eine Nummer. Der
 * Unterschied trägt: Sobald der Pfad in Release 2 verzweigt, ist die Nummer
 * keine Vorbedingung mehr, der Bezeichner aber weiterhin einer.
 *
 * **Die Bezeichner der Lektionen 2 bis 8 sind genau die der sieben Schritte des
 * Lösers.** Das ist Absicht und wird in der Prüfstrecke nachgerechnet: 4T-0052
 * verbindet Schritte und Lektionen, und bei gleicher Benennung ist diese
 * Verbindung die Identität statt einer Tabelle, die auseinanderlaufen kann.
 * `lessons` importiert den Löser deshalb trotzdem nicht; die Deckung prüft, wer
 * beide Seiten lesen darf.
 *
 * **`drill` und `demos` tragen Notation im Wortlaut, `sequences` nur Namen.**
 * Der Unterschied hat einen Grund: Was in `sequences` steht, gehört dem Löser,
 * und eine zweite Fassung davon hier liefe ihm davon. Was in `drill` und
 * `demos` steht, gehört der Lektion allein; es kommt in keiner Lösung vor und
 * hat deshalb keinen anderen Ort, an dem es stehen könnte.
 */
export const LESSONS = [
  {
    number: 0,
    key: 'pieces',
    requires: null,
    goal: null,
    drill: null,
    demos: '',
    applications: 1,
    practice: 'none',
    view: 'default',
    focus: 'none',
    help: 'none',
    sequences: [],
  },
  // Die einzige Lektion mit `drill`, entschieden am 2026-08-16 zu 4T-0046. Ihr
  // Weiterkommen, eine vorgegebene Folge auszuführen, ist am Zustand ablesbar
  // und deshalb prüfbar; es steht nur in keinem der sieben Zwischenziele des
  // Kerns, denn es ist keines. Die sechs Züge nennen jede Seite genau einmal,
  // dazu einen Strich und eine Zwei: Wer sie ausgeführt hat, hat die ganze
  // Notation angewandt und nicht nur gelesen.
  //
  // `demos` führt dieselben Zeichen einzeln vor. Die acht sind die sechs
  // Buchstaben und die beiden Anhänge; achtzehn wären die vollständige Tabelle
  // und damit das Tastenfeld ein zweites Mal.
  {
    number: 1,
    key: 'notation',
    requires: 'pieces',
    goal: null,
    drill: "R U F' L D2 B",
    demos: "U R F D L B R' R2",
    applications: 1,
    practice: 'drill',
    view: 'default',
    focus: 'none',
    help: 'none',
    sequences: [],
  },
  // Lektion 2 trägt bewusst keine Zugfolge. Das Kreuz gelingt ohne eine, und
  // das ist nach Abschnitt 5 des Didaktik-Konzepts ihre eigentliche Aussage:
  // Sie ist die einzige Lektion, die vollständig erklärt ist.
  {
    number: 2,
    key: 'cross',
    requires: 'notation',
    goal: 'bottomCross',
    drill: null,
    demos: '',
    applications: 1,
    practice: 'setup',
    view: 'bottom',
    focus: 'none',
    help: 'none',
    sequences: [],
  },
  {
    number: 3,
    key: 'firstLayerCorners',
    requires: 'cross',
    goal: 'firstLayer',
    drill: null,
    demos: '',
    applications: 1,
    practice: 'setup',
    view: 'bottom',
    focus: 'none',
    help: 'none',
    sequences: ['firstLayerCorner'],
  },
  // Die einzige Lektion mit zwei Folgen. Sie sind einander gespiegelt, und die
  // Wahl zwischen ihnen ist die Aufgabe: rechte oder linke Lücke.
  {
    number: 4,
    key: 'secondLayer',
    requires: 'firstLayerCorners',
    goal: 'twoLayers',
    drill: null,
    demos: '',
    applications: 1,
    practice: 'setup',
    view: 'default',
    focus: 'none',
    help: 'none',
    sequences: ['secondLayerRight', 'secondLayerLeft'],
  },
  // Ab hier drei Anwendungen: In den Lektionen 2 bis 4 umfasst ein Durchgang
  // bereits vier Steine, also vier Anwendungen derselben Idee; ab Lektion 5
  // genügt oft eine einzige, und danach steht das Ziel.
  {
    number: 5,
    key: 'topCross',
    requires: 'secondLayer',
    goal: 'topCrossVisible',
    drill: null,
    demos: '',
    applications: 3,
    practice: 'setup',
    view: 'default',
    focus: 'none',
    help: 'none',
    sequences: ['topCross'],
  },
  {
    number: 6,
    key: 'topEdges',
    requires: 'topCross',
    goal: 'topEdgesMatched',
    drill: null,
    demos: '',
    applications: 3,
    practice: 'setup',
    view: 'default',
    focus: 'none',
    help: 'none',
    sequences: ['topEdges'],
  },
  {
    number: 7,
    key: 'topCorners',
    requires: 'topEdges',
    goal: 'topCornersPlaced',
    drill: null,
    demos: '',
    applications: 3,
    practice: 'setup',
    view: 'default',
    focus: 'none',
    help: 'none',
    sequences: ['topCorners'],
  },
  {
    number: 8,
    key: 'cornerTwist',
    requires: 'topCorners',
    goal: 'cubeSolved',
    drill: null,
    demos: '',
    applications: 3,
    practice: 'setup',
    view: 'default',
    // Die einzige Lektion mit einer Hervorhebung. Sie ist die Stelle, an der
    // Einsteiger abbrechen, weil die untere Schicht zwischendurch zerstört
    // aussieht; gemessen stehen dabei von zwanzig beweglichen Steinen nur noch
    // zwei. Die Anzeige nimmt deshalb alles zurück außer der Arbeitsstelle.
    focus: 'workingCorner',
    help: 'none',
    sequences: ['cornerTwist'],
  },
  // Lektion 9 führt zusammen und lernt nichts Neues. Sie nennt deshalb keine
  // eigene Folge; alle sechs sind an dieser Stelle bereits gelernt.
  //
  // Sie ist zugleich die einzige mit einer Hilfe. Bis hierher sagt jede Lektion,
  // was zu tun ist; hier sagt es niemand mehr, und ohne einen Ausweg bliebe
  // stecken, wer den nächsten Schritt nicht erkennt.
  {
    number: 9,
    key: 'solveAlone',
    requires: 'cornerTwist',
    goal: 'cubeSolved',
    drill: null,
    demos: '',
    applications: 3,
    practice: 'scramble',
    view: 'default',
    focus: 'none',
    help: 'nextStep',
    sequences: [],
  },
];

const LESSON_BY_KEY = new Map(LESSONS.map((lesson) => [lesson.key, lesson]));

/** Die Lektion zu einem Bezeichner, oder `null` bei einem unbekannten. */
export function lessonFor(key) {
  return LESSON_BY_KEY.get(key) ?? null;
}

/** Gehört der Bezeichner zu einer Lektion? */
export function isLesson(key) {
  return LESSON_BY_KEY.has(key);
}

/**
 * Der Zustand, den eine Übungsfolge auf dem gelösten Würfel herstellt.
 *
 * **Er wird bei Bedarf gerechnet und behalten, nicht im Modulrumpf.** Ein
 * fehlerhafter Wortlaut risse den Wurf aus `parseMovesOrThrow` sonst durch das
 * ganze Modul, und die Meldung stünde an einer Stelle, die mit der Ursache
 * nichts zu tun hat. So trifft er den, der die Lektion anspricht.
 */
const DRILL_STATES = new Map();
function drillState(lesson) {
  if (!DRILL_STATES.has(lesson.key)) {
    DRILL_STATES.set(lesson.key, applyMoves(solvedCube(), parseMovesOrThrow(lesson.drill)));
  }
  return DRILL_STATES.get(lesson.key);
}

/**
 * Prüft das Programm das Weiterkommen dieser Lektion selbst?
 *
 * Falsch allein für Lektion 0. Einen gezeigten Stein zu benennen ist an keinem
 * Würfelzustand ablesbar, und das Programm behauptet dort nichts, was es nicht
 * prüfen kann.
 *
 * **Lektion 1 ist prüfbar, obwohl sie kein Zwischenziel des Kerns trägt.**
 * Entschieden am 2026-08-16 zu 4T-0046: Der Zustand nach einer vorgegebenen
 * Folge auf bekannter Ausgangslage ist eindeutig bestimmt. Nicht prüfbar war
 * sie zuvor allein deshalb, weil `goal` nur einen der sieben Bezeichner tragen
 * konnte, und keiner davon bedeutet «diese Folge ist ausgeführt».
 */
export function isCheckable(key) {
  const lesson = lessonFor(key);
  return lesson !== null && (lesson.goal !== null || lesson.drill !== null);
}

/**
 * Erreicht dieser Würfelzustand das Ziel der Lektion?
 *
 * Zwei Arten von Ziel, und die Reihenfolge ist gleichgültig, weil keine Lektion
 * beide trägt: ein Zwischenziel des Kerns, oder der Zustand nach einer
 * vorgegebenen Folge.
 *
 * Falsch für eine unbekannte Lektion und für eine ohne Ziel. Ein fehlendes Ziel
 * gilt bewusst als nicht erreicht statt als erreicht: Wer hier irrtümlich
 * fragt, bekommt keine Freigabe geschenkt.
 *
 * **Beim `drill` wird verglichen und nicht geprüft.** Ein Prädikat über den
 * Zustand wäre hier falsch: Verlangt ist genau diese Lage und keine, die ihr
 * ähnlich sieht. Geprüft wird trotzdem der Zustand und nicht die Tastenfolge;
 * wer sich vertippt und den Fehler selbst zurücknimmt, hat die Aufgabe gelöst.
 */
export function reachesGoal(key, state) {
  const lesson = lessonFor(key);
  if (lesson === null) return false;
  if (lesson.drill !== null) return equals(state, drillState(lesson));
  if (lesson.goal === null) return false;
  return GOAL_BY_KEY.get(lesson.goal).holds(state);
}

/** Die vorgegebene Übungsfolge dieser Lektion in Notation, oder `null`. */
export function drillFor(key) {
  return lessonFor(key)?.drill ?? null;
}

/** Die einzeln vorgeführten Züge dieser Lektion in Notation, oder leer. */
export function demosFor(key) {
  return lessonFor(key)?.demos ?? '';
}

/**
 * Worauf diese Lektion den Blick richtet.
 *
 * Die Ausgangsansicht für eine unbekannte Lektion. Ein Blickwinkel ist die eine
 * Auskunft dieses Moduls, deren Fehlen nichts verstellt: Wer nach einer Lektion
 * fragt, die es nicht gibt, bekommt keinen Vorteil, sondern die gewohnte
 * Ansicht.
 */
export function viewFor(key) {
  return lessonFor(key)?.view ?? VIEW.DEFAULT;
}

/**
 * Was diese Lektion am Würfel hervorhebt.
 *
 * Wie beim Blickwinkel ist der Rückfall harmlos: Wer nach einer Lektion fragt,
 * die es nicht gibt, bekommt den unveränderten Würfel und keine Auszeichnung,
 * die niemand erklären könnte.
 */
export function focusFor(key) {
  return lessonFor(key)?.focus ?? FOCUS.NONE;
}

/**
 * Welche Hilfe diese Lektion auf Abruf anbietet.
 *
 * Derselbe harmlose Rückfall wie bei Blickwinkel und Hervorhebung: Wer nach
 * einer Lektion fragt, die es nicht gibt, bekommt keine Hilfe geschenkt.
 */
export function helpFor(key) {
  return lessonFor(key)?.help ?? HELP.NONE;
}

/** Wie viele gelungene Anwendungen die Lektion verlangt. */
export function requiredApplications(key) {
  return lessonFor(key)?.applications ?? 0;
}

/**
 * Die Kennungen der gelernten Zugfolgen dieser Lektion.
 *
 * Leer für die vier Lektionen ohne eigene Folge, als Kopie für alle anderen:
 * Wer die Liste bekommt, soll den Katalog nicht umschreiben können.
 */
export function sequencesFor(key) {
  return [...(lessonFor(key)?.sequences ?? [])];
}

/** Alle Zugfolgen, die irgendeine Lektion nennt, ohne Wiederholung. */
export function allSequences() {
  return [...new Set(LESSONS.flatMap((lesson) => lesson.sequences))];
}

/**
 * Die Lektionen, die auf dieser aufbauen.
 *
 * Wird für den Hinweis beim Überspringen gebraucht. Im linearen Pfad sind das
 * alle folgenden; die Kette wird trotzdem über `requires` gelaufen und nicht
 * über die Position, damit die Antwort auch nach einer Verzweigung stimmt.
 */
export function dependentsOf(key) {
  const gefunden = new Set(isLesson(key) ? [key] : []);
  const liste = [];
  for (const lesson of LESSONS) {
    if (lesson.requires !== null && gefunden.has(lesson.requires)) {
      gefunden.add(lesson.key);
      liste.push(lesson.key);
    }
  }
  return liste;
}
