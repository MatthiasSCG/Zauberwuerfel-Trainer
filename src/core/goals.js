// Die sieben Zwischenziele des Anfängerverfahrens als Prädikate.
//
// Sie beantworten die meistgestellte Frage des ganzen Programms: «steht das
// Kreuz?», «stehen zwei Schichten?». Der Lernpfad gibt daran die nächste
// Lektion frei, und der Löser prüft daran seine eigenen Schritte.
//
// **Warum sie im Kern stehen und nicht im Löser.** Sie beschreiben Zustände
// des Würfels und nicht Schritte eines Verfahrens. Nach dem Modulschnitt der
// Architektur hängt `lessons` von `core` ab und kennt den `solver` nicht; eine
// dritte, eigene Formulierung im Lernpfad wäre dessen wahrscheinlichste
// Fehlerquelle, weil ein Prädikat, das minimal anders rechnet als der Löser,
// eine Lektion freigibt, deren Ziel nicht steht, und sich dabei nicht meldet.
//
// **Jedes Prädikat schließt das vorige ein.** Das ist Bauart und nicht Befund:
// Prädikat n prüft seine eigene Bedingung und ruft Prädikat n-1 auf. Ohne diese
// Staffelung wäre «das Kreuz der letzten Farbe ist sichtbar» eine Aussage über
// vier Kanten und träfe auf zahllose Würfel zu, bei denen keine einzige Schicht
// steht. Der Lernpfad gäbe dann eine Lektion frei, obwohl der Anwender beim
// Üben seine erste Schicht zerlegt hat. Auf der Staffelung beruht überdies die
// lineare Freigabe des Pfades.
//
// **Sie gelten für den liegenden Würfel**, erste Schicht unten, letzte oben.
// Das ist die Haltung des gesamten Lernpfads und in 2A-0007 entschieden.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine
// globalen Namen. Die ESLint-Konfiguration erzwingt das.

import { CORNERS, EDGES } from './cube.js';

// Stellen, auf die sich die Ziele beziehen. Aus den Namen gelesen und nicht
// als Zahl geschrieben, damit eine Änderung der Reihenfolge in `cube.js` hier
// nicht stillschweigend etwas anderes bedeutet.
const corner = (name) => CORNERS.indexOf(name);
const edge = (name) => EDGES.indexOf(name);
const UPPER_CORNERS = ['URF', 'UFL', 'ULB', 'UBR'].map(corner);
const LOWER_CORNERS = ['DFR', 'DLF', 'DBL', 'DRB'].map(corner);
const UPPER_EDGES = ['UR', 'UF', 'UL', 'UB'].map(edge);
const LOWER_EDGES = ['DR', 'DF', 'DL', 'DB'].map(edge);
const MIDDLE_SLOTS = ['FR', 'FL', 'BL', 'BR'].map(edge);

/** Liegt jede dieser Kanten an ihrer Stelle und richtig herum? */
const edgesHome = (state, positions) =>
  positions.every((index) => state.ep[index] === index && state.eo[index] === 0);

/** Liegt jede dieser Ecken an ihrer Stelle und ungedreht? */
const cornersHome = (state, positions) =>
  positions.every((index) => state.cp[index] === index && state.co[index] === 0);

/** Zwischenziel 1, Lektion 2: das Kreuz der unteren Schicht steht. */
export function bottomCross(state) {
  return edgesHome(state, LOWER_EDGES);
}

/** Zwischenziel 2, Lektion 3: die erste Schicht ist vollständig. */
export function firstLayer(state) {
  return bottomCross(state) && cornersHome(state, LOWER_CORNERS);
}

/** Zwischenziel 3, Lektion 4: zwei Schichten sind vollständig. */
export function twoLayers(state) {
  return firstLayer(state) && edgesHome(state, MIDDLE_SLOTS);
}

/**
 * Zwischenziel 4, Lektion 5: das Kreuz der letzten Farbe ist sichtbar.
 *
 * Gefragt ist allein die Kippung der vier Kanten oben, nicht ihre Stelle. Wo
 * eine Kante liegt, entscheidet erst das nächste Ziel; hier zeigt sie nur ihre
 * Farbe nach oben.
 */
export function topCrossVisible(state) {
  return twoLayers(state) && UPPER_EDGES.every((index) => state.eo[index] === 0);
}

/** Zwischenziel 5, Lektion 6: alle vier Kanten oben passen zu ihren Seitenmitten. */
export function topEdgesMatched(state) {
  return topCrossVisible(state) && edgesHome(state, UPPER_EDGES);
}

/**
 * Zwischenziel 6, Lektion 7: jede Ecke oben steht an ihrer Stelle.
 *
 * Ihre Drehung bleibt hier offen, und genau darauf beruht die Trennung von
 * Setzen und Drehen, die den Übergang zu den schnellen Methoden trägt.
 */
export function topCornersPlaced(state) {
  return topEdgesMatched(state) && UPPER_CORNERS.every((index) => state.cp[index] === index);
}

/**
 * Zwischenziel 7, Lektion 8: der Würfel ist gelöst.
 *
 * Bewusst als letzte Stufe der Kette formuliert und nicht über `isSolved`.
 * Beide Wege sind gleichwertig, und dass sie es sind, ist die schärfste
 * Prüfung der ganzen Kette: Fehlte in einer Stufe eine Stelle, dann wäre
 * dieses Prädikat auf einem ungelösten Würfel wahr. Die Prüfstrecke rechnet
 * die Gleichwertigkeit über den vollständigen Störungsraum nach.
 */
export function cubeSolved(state) {
  return topCornersPlaced(state) && UPPER_CORNERS.every((index) => state.co[index] === 0);
}

/**
 * Die sieben Ziele in ihrer Reihenfolge.
 *
 * Der Bezeichner ist der Name des Zustands und kein Satz. Die Worte für den
 * Anwender stehen in `i18n`, die Zuordnung zu den Lektionen im Lernpfad; der
 * Kern kennt weder das eine noch das andere.
 */
export const GOALS = [
  { key: 'bottomCross', holds: bottomCross },
  { key: 'firstLayer', holds: firstLayer },
  { key: 'twoLayers', holds: twoLayers },
  { key: 'topCrossVisible', holds: topCrossVisible },
  { key: 'topEdgesMatched', holds: topEdgesMatched },
  { key: 'topCornersPlaced', holds: topCornersPlaced },
  { key: 'cubeSolved', holds: cubeSolved },
];
