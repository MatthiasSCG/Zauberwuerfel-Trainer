// Der erweiterte Zugraum: Mittelschicht, Doppelschicht und ganzer Würfel.
//
// Der Kern in `cube.js` kennt achtzehn Züge, nämlich die sechs Flächen zu je
// drei Vierteldrehungen. Die schnellen Methoden brauchen mehr: die Drehung
// einer mittleren Schicht, die Drehung zweier benachbarter Schichten zugleich
// und die Drehung des ganzen Würfels. Ohne sie lässt sich keine ihrer
// Zugfolgen hinschreiben und vor allem keine nachrechnen.
//
// **Warum das ein eigenes Modul ist und keine größere Zahl in `cube.js`.**
// Der Löser bildet die Züge seiner ersten Phase als «alle `MOVE_COUNT`» und
// legt seine Koordinatentabellen in dieser Breite an. Eine größere Zahl dort
// ließe ihn Ganzdrehungen durchsuchen und in Lösungen ausgeben, und die
// Tabellen wüchsen um das Dreifache, ohne dass eine einzige Lösung kürzer
// würde. `cube.js` bleibt deshalb unangetastet.
//
// **Der tragende Befund: Das Modell führt keine Mittelsteine.** `toFacelets`
// setzt das mittlere Feld jeder Seite fest auf den Seitenbuchstaben, der
// Zustand ist also relativ zu einer festen Würfelorientierung beschrieben.
// Genau diese Orientierung verschieben die neuen Züge. Sie wird deshalb
// **neben** dem Zustand geführt und nicht in ihm: Eine Ganzdrehung ändert
// allein sie und lässt die Steine in Ruhe. Damit bleibt der gelöste Würfel
// nach jeder Ganzdrehung gelöst, und zwar bauartbedingt statt bewiesen.
//
// **Die Orientierung wird nicht gespeichert.** Sie ergibt sich aus der
// Zugfolge, und ein Zustand, der sich ableiten lässt, wird nicht mitgeführt.
//
// Dieses Modul läuft wie `cube.js` in jeder Umgebung: kein Browser, kein Node,
// keine globalen Namen.

import { FACES, MOVE_COUNT, applyMove, toFacelets, CORNERS, EDGES } from './cube.js';

/**
 * Die Zahl aller Züge, Grunddrehungen eingeschlossen.
 *
 * `MOVE_COUNT` bleibt bei achtzehn und zählt weiterhin allein die
 * Flächendrehungen. Wer den vollen Raum meint, nennt ihn beim Namen.
 */
export const EXTENDED_MOVE_COUNT = 54;

/** Beginn der drei Blöcke im Zugraum. Innerhalb jedes Blocks gilt weiter
 * `basis + stelle * 3 + vierteldrehungen - 1`, wie schon bei den Flächen. */
export const SLICE_BASE = 18;
export const WIDE_BASE = 27;
export const ROTATION_BASE = 45;

// ------------------------------------------------------------------ Achsen
//
// Jede Drehung dieses Würfels läuft um eine von drei Achsen, und jede Achse
// trägt drei Schichten: die beiden Außenschichten und die mittlere. Die
// Beschreibung eines Zuges braucht deshalb nur dreierlei: die Achse, die
// Menge der bewegten Schichten und die Zahl der Vierteldrehungen.
//
// **Die positive Richtung einer Achse ist die ihrer positiven Fläche.** Für
// die x-Achse ist das R, für die y-Achse U, für die z-Achse F. Eine Drehung
// «in positiver Achsrichtung» sieht auf der positiven Fläche wie deren eigener
// Zug aus und auf der gegenüberliegenden wie deren Gegenzug; wer das
// verwechselt, dreht den halben Würfel falsch herum.

/** Die drei Achsen mit ihren beiden Außenflächen, als Index in `FACES`. */
const AXES = [
  { positive: FACES.indexOf('R'), negative: FACES.indexOf('L') },
  { positive: FACES.indexOf('U'), negative: FACES.indexOf('D') },
  { positive: FACES.indexOf('F'), negative: FACES.indexOf('B') },
];

/** Die Achse und das Vorzeichen, unter dem eine Fläche liegt. */
const FACE_AXIS = FACES.map((_, face) => {
  for (let axis = 0; axis < AXES.length; axis++) {
    if (AXES[axis].positive === face) return { axis, sign: 1 };
    if (AXES[axis].negative === face) return { axis, sign: -1 };
  }
  throw new Error(`Fläche ${face} liegt an keiner Achse`);
});

// Die drei Schichten einer Achse, als Bitmaske. So lässt sich jede Zugart als
// Menge hinschreiben, statt sie einzeln aufzuzählen.
const LAYER_POSITIVE = 1;
const LAYER_MIDDLE = 2;
const LAYER_NEGATIVE = 4;
const LAYER_ALL = LAYER_POSITIVE | LAYER_MIDDLE | LAYER_NEGATIVE;

/**
 * Welche Achse dreht eine Mittelschicht, und in welcher Richtung?
 *
 * **Das ist eine Festlegung der Notation und keine Behauptung über eine
 * Wirkung.** Sie ist international gebräuchlich: Die erste Mittelschicht folgt
 * der linken Fläche, die zweite der unteren, die dritte der vorderen. Zwei von
 * dreien laufen damit entgegen der positiven Achsrichtung, und das ist der
 * bekannteste Stolperstein der erweiterten Notation. Was diese Züge dann
 * bewirken, wird gerechnet und nicht übernommen.
 */
const SLICE_AXES = [
  { axis: 0, sign: -1 }, // folgt L
  { axis: 1, sign: -1 }, // folgt D
  { axis: 2, sign: 1 }, // folgt F
];

/**
 * Beschreibt einen Zug des erweiterten Raums.
 *
 * `quarters` zählt die Vierteldrehungen in **positiver Achsrichtung** und ist
 * damit auch negativ, wenn der Zug der negativen Fläche folgt.
 */
function describeMove(move) {
  if (!Number.isInteger(move) || move < 0 || move >= EXTENDED_MOVE_COUNT) {
    throw new RangeError(`Ungültiger Zug-Index: ${move}`);
  }

  if (move < MOVE_COUNT) {
    const face = Math.floor(move / 3);
    const { axis, sign } = FACE_AXIS[face];
    return {
      axis,
      layers: sign > 0 ? LAYER_POSITIVE : LAYER_NEGATIVE,
      quarters: sign * ((move % 3) + 1),
    };
  }

  if (move < WIDE_BASE) {
    const index = Math.floor((move - SLICE_BASE) / 3);
    const { axis, sign } = SLICE_AXES[index];
    return { axis, layers: LAYER_MIDDLE, quarters: sign * (((move - SLICE_BASE) % 3) + 1) };
  }

  if (move < ROTATION_BASE) {
    const face = Math.floor((move - WIDE_BASE) / 3);
    const { axis, sign } = FACE_AXIS[face];
    return {
      axis,
      layers: LAYER_MIDDLE | (sign > 0 ? LAYER_POSITIVE : LAYER_NEGATIVE),
      quarters: sign * (((move - WIDE_BASE) % 3) + 1),
    };
  }

  const axis = Math.floor((move - ROTATION_BASE) / 3);
  return { axis, layers: LAYER_ALL, quarters: ((move - ROTATION_BASE) % 3) + 1 };
}

/**
 * Ein Zug, beschrieben statt gerechnet: um welche Achse er dreht, welche
 * Schichten er dabei mitnimmt und um wie viele Vierteldrehungen.
 *
 * Das ist der Zugang für alle, die einen Zug **zeigen** und nicht ausführen.
 * Die Darstellung braucht genau dieses Tripel, und sie soll es nicht ein
 * zweites Mal herleiten: Eine zweite Rechnung über dieselbe Frage läuft der
 * ersten beim ersten Vorzeichenfehler davon, und zwar stillschweigend.
 *
 * `layers` nennt die Schichten als Verschiebung entlang der Achse, also `1`
 * für die Schicht an der positiven Fläche, `0` für die mittlere und `-1` für
 * die gegenüberliegende. Die Bitmaske bleibt innen, denn sie ist eine
 * Bequemlichkeit dieses Moduls und keine Aussage über den Zug.
 *
 * `quarters` zählt wie überall hier in **positiver Achsrichtung** und ist
 * deshalb negativ, wenn der Zug der negativen Fläche folgt.
 *
 * **Der Kern bleibt dabei frei von Darstellung.** Hier steht keine Gradzahl,
 * keine Achse in Bildschirmkoordinaten und kein Drehsinn des Browsers; wer
 * zeichnet, rechnet das aus diesem Tripel selbst aus.
 */
export function moveDescription(move) {
  const { axis, layers, quarters } = describeMove(move);
  const offsets = [];
  if (layers & LAYER_POSITIVE) offsets.push(1);
  if (layers & LAYER_MIDDLE) offsets.push(0);
  if (layers & LAYER_NEGATIVE) offsets.push(-1);
  return { axis, layers: offsets, quarters };
}

/** Gehört der Zug zu den achtzehn Flächendrehungen? */
export function isFaceMove(move) {
  return Number.isInteger(move) && move >= 0 && move < MOVE_COUNT;
}

/** Dreht der Zug den ganzen Würfel? */
export function isRotation(move) {
  return Number.isInteger(move) && move >= ROTATION_BASE && move < EXTENDED_MOVE_COUNT;
}

// ------------------------------------------------------------- Orientierung
//
// Die Orientierung sagt, welche Fläche des Modells der Anwender gerade an
// welcher Stelle sieht.
//
// **Gelesen wird sie so: `orientation[i]` ist die Modellfläche, die der
// Anwender heute `FACES[i]` nennt.** Wer «R» schreibt, meint also die
// Modellfläche `orientation[FACES.indexOf('R')]`. Die umgekehrte Lesart wäre
// genauso plausibel und überall um eine Umkehrung falsch; sie steht deshalb
// hier und nicht in der Erinnerung des nächsten Lesers.

/** Der unverdrehte Würfel: jede Fläche liegt, wo sie heißt. */
export const SOLVED_ORIENTATION = Object.freeze(FACES.map((_, i) => i));

/** Kehrt eine Orientierung um. */
function invertOrientation(orientation) {
  const back = new Array(orientation.length);
  for (let i = 0; i < orientation.length; i++) back[orientation[i]] = i;
  return back;
}

/**
 * Eine Vierteldrehung des ganzen Würfels um eine Achse, als Umbenennung der
 * sechs Flächen: `image[f]` ist die Stelle, an die Fläche `f` wandert.
 *
 * **Erzeugt statt hingeschrieben.** Eine Drehung um die Achse lässt deren
 * beide Außenflächen an Ort und Stelle und schiebt die vier übrigen im Kreis.
 * Welche vier das sind und in welcher Reihenfolge, folgt aus den beiden
 * anderen Achsen: Die positive Fläche der nächsten Achse wandert auf die
 * **negative** der übernächsten. Wer den Kreis von Hand hinschreibt,
 * vertauscht früher oder später zwei Flächen, und wer ihn falsch herum
 * schließt, dreht den ganzen Würfel gegenläufig.
 *
 * Ob die Richtung stimmt, sagt keine Quelle, sondern der Kern: Die Prüfstrecke
 * liest an einer Flächendrehung ab, wohin die Nachbarflächen wandern, und
 * verlangt von der Ganzdrehung dieselbe Zuordnung.
 */
function rotationImage(axis) {
  const image = FACES.map((_, i) => i);
  const next = AXES[(axis + 1) % 3];
  const after = AXES[(axis + 2) % 3];
  image[next.positive] = after.negative;
  image[after.negative] = next.negative;
  image[next.negative] = after.positive;
  image[after.positive] = next.positive;
  return image;
}

const ROTATION_IMAGES = AXES.map((_, axis) => rotationImage(axis));

/**
 * Dreht eine Orientierung um eine Achse, `quarters` Vierteldrehungen in
 * positiver Achsrichtung. Negative Werte drehen zurück.
 */
export function rotateOrientation(orientation, axis, quarters) {
  const image = ROTATION_IMAGES[axis];
  let turned = [...orientation];
  const steps = ((quarters % 4) + 4) % 4;
  for (let n = 0; n < steps; n++) {
    const next = new Array(turned.length);
    // Was vorher an Stelle `i` lag, liegt danach an Stelle `image[i]`.
    for (let i = 0; i < turned.length; i++) next[image[i]] = turned[i];
    turned = next;
  }
  return turned;
}

// ---------------------------------------------------------------- Zerlegung

/**
 * Zerlegt einen erweiterten Zug in Grunddrehungen und eine Änderung der
 * Orientierung.
 *
 * **Die Herleitung, und warum keine Gleichung übernommen wird.** Ein Zug ist
 * dadurch bestimmt, welche Schichten er dreht. Sind das nur Außenschichten,
 * gibt es für jede davon bereits eine Grunddrehung, und mehr ist nicht zu tun.
 * Ist die mittlere Schicht dabei, gibt es für sie keine, und der Zug wird über
 * den ganzen Würfel gerechnet: **erst alle drei Schichten drehen, dann die
 * nicht gemeinten zurück.** Für die Ganzdrehung selbst bleibt nichts
 * zurückzudrehen, sie ist reine Orientierung.
 *
 * Auf diesem Weg entstehen die bekannten Gleichungen zwischen den Zugarten von
 * selbst, statt aus einer Quelle übernommen zu werden. Geprüft wird trotzdem,
 * und zwar an dem, was jeder Zug unberührt lässt.
 *
 * **Die Reihenfolge innerhalb der Zerlegung ist gleichgültig**, denn alle
 * beteiligten Drehungen laufen um dieselbe Achse und vertauschen deshalb
 * miteinander. Die Grunddrehungen stehen hier vor der Orientierungsänderung,
 * weil sie dann im selben Bezug gelesen werden wie der Zug selbst.
 */
export function decomposeMove(move, orientation = SOLVED_ORIENTATION) {
  const { axis, layers, quarters } = describeMove(move);

  if (layers === LAYER_ALL) {
    return { moves: [], orientation: rotateOrientation(orientation, axis, quarters) };
  }

  const moves = [];
  if ((layers & LAYER_MIDDLE) === 0) {
    // Nur Außenschichten: jede hat ihre eigene Grunddrehung, und jede dreht um
    // dasselbe Maß in Achsrichtung.
    if (layers & LAYER_POSITIVE) moves.push(faceMove(orientation, AXES[axis].positive, quarters));
    if (layers & LAYER_NEGATIVE) moves.push(faceMove(orientation, AXES[axis].negative, quarters));
    return { moves, orientation: [...orientation] };
  }

  // Die mittlere Schicht ist dabei: über den ganzen Würfel rechnen und die
  // nicht gemeinten Außenschichten um dasselbe Maß zurückdrehen.
  if ((layers & LAYER_POSITIVE) === 0) {
    moves.push(faceMove(orientation, AXES[axis].positive, -quarters));
  }
  if ((layers & LAYER_NEGATIVE) === 0) {
    moves.push(faceMove(orientation, AXES[axis].negative, -quarters));
  }
  return { moves, orientation: rotateOrientation(orientation, axis, quarters) };
}

/**
 * Der Grundzug, der die Fläche `face` des Anwenders um `quarters`
 * Vierteldrehungen **in positiver Achsrichtung** dreht.
 *
 * Zwei Umrechnungen stecken darin. Erstens zeigt die Orientierung, welche
 * Fläche des Modells gemeint ist. Zweitens dreht eine negative Fläche in
 * positiver Achsrichtung entgegen ihrem eigenen Zug, und ihr Vorzeichen kehrt
 * sich deshalb um.
 */
function faceMove(orientation, face, quarters) {
  const signed = FACE_AXIS[face].sign * quarters;
  const turns = ((signed % 4) + 4) % 4;
  if (turns === 0) throw new RangeError('Eine ganze Umdrehung ist kein Zug');
  return orientation[face] * 3 + turns - 1;
}

/**
 * Zerlegt eine ganze Folge. Zurück kommen die Grunddrehungen in einer Kette
 * und die Orientierung am Ende.
 *
 * Das ist der Zugang, den Nachrechnung, Wiedergabe und Übungswürfel brauchen:
 * Sie bekommen eine Folge, wie ein Mensch sie schreibt, und arbeiten mit
 * Zügen, wie der Kern sie kennt.
 */
export function decomposeMoves(moves, orientation = SOLVED_ORIENTATION) {
  let current = [...orientation];
  const out = [];
  for (const move of moves) {
    const step = decomposeMove(move, current);
    out.push(...step.moves);
    current = step.orientation;
  }
  return { moves: out, orientation: current };
}

// ---------------------------------------------------------------- Ausführung

/**
 * Wendet einen erweiterten Zug an. Zurück kommen Zustand und Orientierung.
 *
 * Der übergebene Zustand bleibt unangetastet, wie überall im Kern.
 */
export function applyExtendedMove(cube, move, orientation = SOLVED_ORIENTATION) {
  const step = decomposeMove(move, orientation);
  let next = cube;
  for (const base of step.moves) next = applyMove(next, base);
  return { cube: next, orientation: step.orientation };
}

/** Wendet eine Folge erweiterter Züge an. */
export function applyExtendedMoves(cube, moves, orientation = SOLVED_ORIENTATION) {
  let state = cube;
  let current = orientation;
  for (const move of moves) {
    const step = applyExtendedMove(state, move, current);
    state = step.cube;
    current = step.orientation;
  }
  return { cube: state, orientation: current };
}

/** Der Zug, der den übergebenen aufhebt. Aus einer Vierteldrehung wird ihre
 * Gegenrichtung, eine halbe Drehung bleibt sich selbst. */
export function inverseExtendedMove(move) {
  if (!Number.isInteger(move) || move < 0 || move >= EXTENDED_MOVE_COUNT) {
    throw new RangeError(`Ungültiger Zug-Index: ${move}`);
  }
  const base = blockBase(move);
  const inner = move - base;
  return base + Math.floor(inner / 3) * 3 + (2 - (inner % 3));
}

/** Kehrt eine ganze Folge um: rückwärts und jeder Zug einzeln umgekehrt. */
export function inverseExtendedMoves(moves) {
  return [...moves].reverse().map(inverseExtendedMove);
}

/** Der Beginn des Blocks, in dem ein Zug liegt. */
function blockBase(move) {
  if (move < SLICE_BASE) return 0;
  if (move < WIDE_BASE) return SLICE_BASE;
  if (move < ROTATION_BASE) return WIDE_BASE;
  return ROTATION_BASE;
}

// ------------------------------------------------------- Sicht des Anwenders

/**
 * Die Umordnung der Steine, die eine Orientierung an ihnen vornimmt.
 *
 * **Aus den Namen gerechnet.** Der Stein `URF` liegt nach der Drehung dort, wo
 * die Bilder von U, R und F zusammentreffen, und um so viel verdreht, wie die
 * Buchstaben gegeneinander verschoben sind. Mehr braucht es nicht, und eine
 * Tabelle von Hand wäre eine Fehlerquelle mehr.
 */
function pieceRotation(image) {
  const cp = new Array(8);
  const co = new Array(8);
  const ep = new Array(12);
  const eo = new Array(12);
  fillPieces(CORNERS, image, cp, co, 3);
  fillPieces(EDGES, image, ep, eo, 2);
  return { cp, co, ep, eo };
}

function fillPieces(names, image, permutation, twist, size) {
  for (let i = 0; i < names.length; i++) {
    const moved = [...names[i]].map((f) => FACES[image[FACES.indexOf(f)]]).join('');
    const target = names.findIndex((name) => sorted(name) === sorted(moved));
    if (target < 0) throw new Error(`Kein Stein für ${moved}`);
    permutation[target] = i;
    // Das Vorzeichen folgt aus `toFacelets`: dort trägt die Feldstelle
    // `k + Drehung` die Farbe des Steins an Stelle `k`. Aus der Verschiebung
    // der Namen folgt deshalb ihr Gegenwert.
    twist[target] = (size - shift(names[target], moved)) % size;
  }
}

const sorted = (name) => [...name].sort().join('');

/** Um wie viele Stellen ist `b` gegenüber `a` zyklisch verschoben? */
function shift(a, b) {
  for (let k = 0; k < a.length; k++) {
    let same = true;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[(i + k) % a.length]) same = false;
    }
    if (same) return k;
  }
  throw new Error(`${b} ist keine Verschiebung von ${a}`);
}

/**
 * Die 54 Felder, wie der Anwender sie sieht.
 *
 * Zweierlei ist dafür zu tun. Die Steine liegen im Modell an ihren
 * Modellstellen und müssen um die Orientierung gedreht werden. Und die
 * Mittelsteine, die das Modell gar nicht führt, bekommen die Farbe der Fläche,
 * die an dieser Stelle liegt.
 *
 * **Bei unverdrehter Orientierung kommt genau `toFacelets` heraus.** Das ist
 * die Probe darauf, dass hier nichts anderes gerechnet wird als bisher.
 */
export function toOrientedFacelets(cube, orientation = SOLVED_ORIENTATION) {
  // Die Orientierung sagt, was der Anwender wo sieht; die Steine wandern in
  // die Gegenrichtung dazu.
  const image = invertOrientation(orientation);
  const turned = applyPieceRotation(cube, pieceRotation(image));
  const facelets = toFacelets(turned);
  for (let i = 0; i < FACES.length; i++) facelets[i * 9 + 4] = FACES[orientation[i]];
  return facelets;
}

function applyPieceRotation(cube, t) {
  const next = { cp: new Array(8), co: new Array(8), ep: new Array(12), eo: new Array(12) };
  for (let i = 0; i < 8; i++) {
    next.cp[i] = cube.cp[t.cp[i]];
    next.co[i] = (cube.co[t.cp[i]] + t.co[i]) % 3;
  }
  for (let i = 0; i < 12; i++) {
    next.ep[i] = cube.ep[t.ep[i]];
    next.eo[i] = (cube.eo[t.ep[i]] + t.eo[i]) % 2;
  }
  return next;
}
