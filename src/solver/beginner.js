// Lernlösung nach dem Anfängerverfahren.
//
// Dies ist das Band zwischen Lernpfad und Löser. Eine Lösung, die andere
// Zugfolgen verwendet als die gelernten, wäre für den Anwender genauso fremd
// wie eine optimierte Kurzlösung. Deshalb löst dieses Modul in genau den
// sieben Schritten des Didaktik-Konzepts und mit genau seinen sechs
// Zugfolgen.
//
// **Keine Optimierung, die Bausteine, Schrittgrenzen oder gelernte Zugfolgen
// antastet.** Die Lösung soll nachvollziehbar sein. Was sie zeigt, muss der
// Anwender wiedererkennen; unter mehreren Lösungen, die er gleichermaßen
// wiedererkennt, darf sie die kürzeste wählen. Diese Fassung stammt vom
// 2026-08-14 aus 4T-0039 und ersetzt die frühere «nachvollziehbar, nicht kurz».
//
// Was der Grundsatz weiterhin ausschließt, gilt ausdrücklich auch für die Züge
// an den Blockgrenzen. Endet eine Zugfolge mit U und beginnt die nächste mit
// U', dann stehen beide in der Lösung, mit dem Ausrichtungszug dazwischen, also
// etwa `U U2 U'`. Zusammengefasst wären es 6,1 Prozent weniger Züge, gemessen
// über 3000 Verwürfelungen, aber dann wären 44 Prozent der Zugfolgen nicht mehr
// die, die der Anwender gelernt hat. Und die stehende Reihenfolge ist genau
// die, die er auch mit der Hand ausführt: Folge zu Ende drehen, hinsehen,
// ausrichten, nächste Folge beginnen.
//
// **Was er erlaubt, ist die Wahl der Reihenfolge**, in der die vier
// Teilaufgaben eines Schrittes abgearbeitet werden, siehe `chooseOrder`. Sie
// steht in keiner Lektion und war bisher nur zufällig fest.
//
// **Freie Züge untereinander werden dagegen sehr wohl zusammengefasst**, und
// zwar innerhalb eines Schrittes, siehe `turn`. Zwei aufeinanderfolgende
// Ausrichtungszüge sind keine didaktische Aussage, sondern ein Mangel der
// Buchführung: Sie kosten den Anwender zwei Handgriffe statt einen. Der
// Unterschied zwischen beiden Fällen ist in 4T-0038 gemessen und begründet.
//
// Drei Festlegungen aus der Nachrechnung, ausführlich in 4T-0019:
//
// 1. **Die erste Schicht liegt unten, die letzte oben.** Das Didaktik-Konzept
//    enthält eine verdeckte Ganzdrehung: `R' D' R D` lässt die obere Schicht
//    unberührt außer der Ecke vorn oben rechts und setzt für Lektion 3 damit
//    eine fertige erste Schicht oben voraus, während die Folge der Lektion 4
//    eine erste Schicht unten verlangt. Das Zugmodell kennt keine
//    Ganzdrehung, also muss eine der beiden Gruppen gespiegelt erscheinen.
//    Gewählt ist die kleinere: Lektion 3 verwendet die an der waagerechten
//    Achse gespiegelte Form `F' U' F U`. Sie stört nachgerechnet keine andere
//    Ecke und keine Kante der unteren Schicht; `R' D' R D` täte das dort und
//    wäre unbrauchbar.
// 2. **Vier Haltungen je Zugfolge.** Die zweite Schicht hat vier Lücken, die
//    erste Schicht vier Ecken. Ohne Ganzdrehung muss jede Zugfolge in vier
//    Haltungen um die senkrechte Achse vorliegen. Sie entstehen mechanisch
//    aus der Ausgangsform, siehe `rotateMoves`.
// 3. **Vorwärts und rückwärts.** Die beiden Vierzug-Folgen dürfen auch
//    rückwärts verwendet werden. Das dreht die Ecke in die andere Richtung
//    und kostet zwei statt vier Anwendungen.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine
// globalen Namen. Die ESLint-Konfiguration erzwingt das.

import {
  CORNERS,
  EDGES,
  FACES,
  applyMoves,
  inverseMoves,
  solvedCube,
  toFacelets,
} from '../core/cube.js';
import { GOALS } from '../core/goals.js';
import { parseMovesOrThrow } from '../core/notation.js';
import { validateFacelets } from '../core/validate.js';

/**
 * Die Zugfolgen des Lernpfads, in der Haltung, in der sie hier stehen.
 *
 * Sieben Einträge für sechs gelernte Zugfolgen: `firstLayerCorner` ist die
 * gespiegelte Form von `cornerTwist`, siehe Festlegung 1 im Kopf der Datei.
 * Sie stehen als Notationstext und nicht als Zug-Indizes, damit sie mit den
 * Lektionen abgleichbar bleiben und ein Tippfehler beim Laden auffällt.
 */
export const SEQUENCES = {
  firstLayerCorner: "F' U' F U",
  secondLayerRight: "U R U' R' U' F' U F",
  secondLayerLeft: "U' L' U L U F U' F'",
  topCross: "F R U R' U' F'",
  topEdges: "R U' R U R U R U' R' U' R2",
  topCorners: "R B' R F2 R' B R F2 R2",
  cornerTwist: "R' D' R D",
};

/**
 * Die sieben Schritte in der Reihenfolge des Didaktik-Konzepts.
 *
 * Zu jedem Schritt gehört das gleichnummerierte Zwischenziel aus
 * `core/goals.js`; die Zuordnung ist die Reihenfolge und keine zweite Tabelle.
 * Dass beide Listen gleich lang sind, wird beim Laden geprüft, damit ein
 * hinzugefügter Schritt ohne Ziel nicht erst mitten in einer Lösung auffällt.
 */
export const STEPS = [
  { number: 1, key: 'cross', lesson: 2 },
  { number: 2, key: 'firstLayerCorners', lesson: 3 },
  { number: 3, key: 'secondLayer', lesson: 4 },
  { number: 4, key: 'topCross', lesson: 5 },
  { number: 5, key: 'topEdges', lesson: 6 },
  { number: 6, key: 'topCorners', lesson: 7 },
  { number: 7, key: 'cornerTwist', lesson: 8 },
];

if (GOALS.length !== STEPS.length) {
  throw new Error(`${STEPS.length} Schritte, aber ${GOALS.length} Zwischenziele`);
}

/** Anzahl der Haltungen um die senkrechte Achse. */
export const HOLD_COUNT = 4;

// Die freien Züge des ersten Schrittes, in der Haltung mit Ziel DF. Der
// Lernpfad erlaubt in Lektion 2 freie Züge; diese vier Rezepte sind die
// Handgriffe, die er dort beschreibt.
const CROSS = {
  // Kreuzkante aus der unteren Schicht nach oben holen.
  fromBottom: parseMovesOrThrow('F2'),
  // Kreuzkante aus der Lücke vorn rechts nach oben holen. Der mittlere Zug
  // dreht sie aus der Ebene der Seite heraus, damit der letzte Zug die
  // Kreuzkante der Seite wieder schließt, statt sie erneut mitzunehmen.
  fromMiddle: parseMovesOrThrow("R U R'"),
  // Von oben über ihrem Platz nach unten.
  insert: parseMovesOrThrow('F2'),
  // Gekippt, von der Nachbarstelle aus. Über ihrem eigenen Platz gibt es
  // keinen Einfügezug aus drei Zügen, der die anderen Kreuzkanten stehen
  // lässt; nachgerechnet über alle Folgen bis Länge vier. Von der
  // Nachbarstelle aus genügen drei, weil die Kante auf dem Weg nach unten
  // einmal umgelegt wird.
  insertFlipped: parseMovesOrThrow("R' F R"),
};

// Schranke gegen Endlosschleifen. Sie ist großzügig gewählt: Sie soll einen
// Denkfehler sichtbar machen, nicht einen Grenzfall abschneiden. Ohne sie
// würde ein Fehler in einer Fallunterscheidung das Programm aufhängen, statt
// eine Meldung zu erzeugen.
const GUARD = 12;

// Stellen, auf die sich die Schritte beziehen. Aus den Namen gelesen und
// nicht als Zahl geschrieben, damit eine Änderung der Reihenfolge in
// `cube.js` hier nicht stillschweigend etwas anderes bedeutet.
const corner = (name) => CORNERS.indexOf(name);
const edge = (name) => EDGES.indexOf(name);
const URF = corner('URF');
const DFR = corner('DFR');
const UF = edge('UF');
const UR = edge('UR');
const DF = edge('DF');
const FR = edge('FR');
const UPPER_CORNERS = ['URF', 'UFL', 'ULB', 'UBR'].map(corner);
const LOWER_CORNERS = ['DFR', 'DLF', 'DBL', 'DRB'].map(corner);
const UPPER_EDGES = ['UR', 'UF', 'UL', 'UB'].map(edge);
const LOWER_EDGES = ['DR', 'DF', 'DL', 'DB'].map(edge);
const MIDDLE_SLOTS = ['FR', 'FL', 'BL', 'BR'].map(edge);

/** Der Zug U, aus dem Seitenindex gerechnet. */
const UP_TURN = FACES.indexOf('U') * 3;

// Eine Haltung um die senkrechte Achse: F wird R, R wird B, B wird L, L wird
// F. Oben und unten bleiben, wo sie sind. Deshalb bleibt jede Zugfolge in
// jeder Haltung eine Aussage über dieselbe Schicht.
const YAW = [0, 5, 1, 3, 2, 4];

/**
 * Dreht eine Zugfolge in eine andere Haltung um die senkrechte Achse.
 *
 * Das ist keine neue Zugfolge, sondern dieselbe, anders gehalten. Genau das
 * meint die Lektion mit «halte den Würfel so, dass die Lücke vorn rechts
 * liegt». Weil eine Ganzdrehung eine Drehung im Uhrzeigersinn wieder auf
 * eine Drehung im Uhrzeigersinn abbildet, genügt es, den Seitenbuchstaben zu
 * vertauschen und die Anzahl der Vierteldrehungen zu behalten.
 */
export function rotateMoves(moves, quarters) {
  let out = moves;
  for (let i = 0; i < quarters; i++) {
    out = out.map((move) => YAW[Math.floor(move / 3)] * 3 + (move % 3));
  }
  return out;
}

/** Bild einer Stelle unter einer Haltung, über die Seitenbuchstaben. */
function imageOf(names, index, quarters) {
  let letters = [...names[index]];
  for (let i = 0; i < quarters; i++) {
    letters = letters.map((letter) => FACES[YAW[FACES.indexOf(letter)]]);
  }
  const key = [...letters].sort().join('');
  return names.findIndex((name) => [...name].sort().join('') === key);
}

// Zu jeder Haltung die Bilder aller Stellen. `CORNER_AT[2][DFR]` ist die
// Lücke, die in der dritten Haltung dort liegt, wo in der ersten die Lücke
// vorn rechts unten liegt.
const CORNER_AT = buildImages(CORNERS);
const EDGE_AT = buildImages(EDGES);

function buildImages(names) {
  const rows = [];
  for (let quarters = 0; quarters < HOLD_COUNT; quarters++) {
    rows.push(names.map((_, index) => imageOf(names, index, quarters)));
  }
  return rows;
}

/** Die Haltung, in der `base` auf `position` fällt. */
function holdOf(images, base, position) {
  const hold = images.findIndex((row) => row[base] === position);
  if (hold < 0) throw new Error(`Keine Haltung bringt ${base} auf ${position}`);
  return hold;
}

/** Wiederholt eine Zugfolge. */
function times(moves, count) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(...moves);
  return out;
}

/**
 * Ausrichtungszug der oberen Schicht, von einer Stelle zu einer anderen.
 *
 * Ein Zug U hebt den Index einer Stelle der oberen Schicht um eins, bei Ecken
 * wie bei Kanten. Das folgt aus der Reihenfolge in `CORNERS` und `EDGES` und
 * ist in der Prüfstrecke festgehalten, damit es nicht stillschweigend
 * wegbricht. Zug-Index 0 ist U, 1 ist U2, 2 ist U'.
 */
function alignUp(from, to) {
  const quarters = (to - from + HOLD_COUNT) % HOLD_COUNT;
  return quarters === 0 ? [] : [UP_TURN + quarters - 1];
}

/** Die Drehung, die eine Ecke mit dieser Verdrehung wieder gerade stellt. */
const neededTwist = (twist) => (3 - twist) % 3;

// ------------------------------------------------- Wirkung der Zugfolgen
//
// Alle Fallunterscheidungen der Schritte 2, 3 und 7 brauchen die Wirkung
// einer Zugfolge: welche Lücke sie füllt, von welcher Stelle der oberen
// Schicht, mit welcher Kippung, und welche Drehung eine bestimmte Zahl von
// Wiederholungen bewirkt.
//
// Diese Angaben werden hier **gerechnet und nicht eingetragen**. Eine von
// Hand geschriebene Tabelle wäre die wahrscheinlichste Fehlerquelle des
// ganzen Moduls, weil jede Zeile darin eine Behauptung über eine
// Drehrichtung ist; gerechnet ist sie eine Folgerung.
//
// Dass die naheliegende Annahme hier falsch wäre, zeigt die Kippung der
// eingesetzten Kante in Schritt 3: Sie wechselt zwischen den vier
// Haltungen, weil die Bezugsfläche der Kantenorientierung mitwandert. Wer
// sie einmal misst und für alle Haltungen übernimmt, baut einen Fehler ein,
// der nur in zwei von vier Lücken auftritt.

/**
 * Sucht zu jeder bewirkten Eckendrehung den kürzesten Block aus
 * Wiederholungen einer Zugfolge, vorwärts oder rückwärts.
 *
 * `piece` ist der Stein, der nach dem Block an `position` liegen soll. Damit
 * dient dieselbe Funktion zwei Zwecken: Einsetzen einer Ecke von oben, wenn
 * der Stein von einer anderen Stelle kommt, und Drehen einer Ecke am Platz,
 * wenn Stein und Stelle dieselben sind.
 *
 * Gerechnet wird auf dem gelösten Würfel. Das genügt, weil die Drehung eines
 * Steins sich über eine Zugfolge hinweg addiert; die gemessene Drehung ist
 * damit der Zuwachs, unabhängig davon, wie die Ecke vorher lag.
 */
function twistBlocks(key, piece, position, powers) {
  const base = parseMovesOrThrow(SEQUENCES[key]);
  const blocks = new Map();
  for (const reversed of [false, true]) {
    const sequence = reversed ? inverseMoves(base) : base;
    for (const repeat of powers) {
      const moves = times(sequence, repeat);
      const state = applyMoves(solvedCube(), moves);
      if (state.cp[position] !== piece) continue;
      const twist = state.co[position];
      const known = blocks.get(twist);
      if (!known || known.moves.length > moves.length) {
        blocks.set(twist, { key, hold: 0, reversed, repeat, moves });
      }
    }
  }
  return blocks;
}

/**
 * Stellt sicher, dass die Ableitung die Drehungen abdeckt, die der Löser von
 * ihr verlangt.
 *
 * Ohne diese Prüfung würde eine unvollständige Ableitung erst mitten in einer
 * Lösung auffallen, und zwar als Zugriff auf einen fehlenden Eintrag. Eine
 * geänderte Zugfolge soll beim Laden auffallen.
 *
 * Verlangt wird nicht überall dasselbe: Beim Einsetzen kommt jede der drei
 * Drehungen vor, weil die Ecke oben in jeder Lage liegen kann. Beim Drehen an
 * Ort und Stelle kommt die Drehung null nicht vor, weil eine Ecke, die schon
 * gerade steht, keinen Block braucht.
 */
function completeTwists(blocks, twists, name) {
  for (const twist of twists) {
    if (!blocks.has(twist)) throw new Error(`${name} deckt die Drehung ${twist} nicht ab`);
  }
  return blocks;
}

// Ecke der ersten Schicht von oben einsetzen. Ungerade Wiederholungen
// tauschen die Stelle oben mit der Lücke unten, gerade lassen den Stein, wo
// er ist; deshalb hier nur ungerade.
const CORNER_INSERT = completeTwists(
  twistBlocks('firstLayerCorner', URF, DFR, [1, 3, 5]),
  [0, 1, 2],
  'Ecke einsetzen',
);

// Dieselbe Folge, angewandt auf eine Ecke, die schon in ihrer Lücke liegt,
// aber verdreht. Gerade Wiederholungen lassen sie dort und drehen sie nur.
const CORNER_TWIST_IN_PLACE = completeTwists(
  twistBlocks('firstLayerCorner', DFR, DFR, [2, 4]),
  [1, 2],
  'Ecke am Platz drehen',
);

// Ecke der letzten Schicht drehen. Auch hier nur gerade Wiederholungen: Die
// ungeraden würden die Ecke nach unten mitnehmen.
const TOP_CORNER_TWIST = completeTwists(
  twistBlocks('cornerTwist', URF, URF, [2, 4]),
  [1, 2],
  'Ecke oben drehen',
);

// Eine Anwendung der Einsetz-Folge holt eine falsch liegende Ecke aus ihrer
// Lücke nach oben. Nachgerechnet rührt sie dabei keine andere Ecke und keine
// Kante der unteren Schicht an.
const CORNER_EJECT = {
  key: 'firstLayerCorner',
  hold: 0,
  reversed: false,
  repeat: 1,
  moves: parseMovesOrThrow(SEQUENCES.firstLayerCorner),
};

/**
 * Die acht Ausprägungen der zweiten Schicht: zwei Zugfolgen in vier
 * Haltungen. Zu jeder gehört, welche Lücke sie füllt, von welcher Stelle der
 * oberen Schicht die Kante kommt und mit welcher Kippung sie dort ankommt.
 *
 * Auf dem gelösten Würfel liegt jeder Stein an der Stelle seiner eigenen
 * Nummer. Deshalb ist der Stein, der nach der Zugfolge in der Lücke liegt,
 * zugleich die Stelle, von der er kam.
 */
function buildSecondLayerVariants() {
  const variants = [];
  for (const key of ['secondLayerRight', 'secondLayerLeft']) {
    for (let hold = 0; hold < HOLD_COUNT; hold++) {
      const moves = rotateMoves(parseMovesOrThrow(SEQUENCES[key]), hold);
      const state = applyMoves(solvedCube(), moves);
      const slot = MIDDLE_SLOTS.find((index) => state.ep[index] !== index);
      if (slot === undefined) throw new Error(`${key} füllt keine Lücke der zweiten Schicht`);
      variants.push({
        key,
        hold,
        reversed: false,
        repeat: 1,
        moves,
        slot,
        source: state.ep[slot],
        flip: state.eo[slot],
      });
    }
  }

  // Zu jeder Lücke muss es genau eine Ausprägung je Kippung geben, sonst wäre
  // eine Kante nicht einlegbar. Das ist keine Selbstverständlichkeit: Die
  // beiden Zugfolgen sind zueinander spiegelbildlich, und dass ihre Kippungen
  // sich gerade ergänzen, ist gerechnet und nicht angenommen.
  for (const slot of MIDDLE_SLOTS) {
    for (const flip of [0, 1]) {
      const passend = variants.filter((v) => v.slot === slot && v.flip === flip);
      if (passend.length !== 1) {
        throw new Error(
          `Zur Lücke ${EDGES[slot]} mit Kippung ${flip} gibt es ${passend.length} Ausprägungen`,
        );
      }
    }
  }
  return variants;
}

const SECOND_LAYER = buildSecondLayerVariants();

// ------------------------------------------------------------ Buchführung

/** Beginnt einen Schritt und merkt sich, wo er in der Zugfolge anfängt. */
function beginStep(run, definition) {
  run.step = { ...definition, from: run.moves.length, count: 0, blocks: [] };
}

/** Schließt den laufenden Schritt ab und schreibt seinen Bereich fest. */
function endStep(run) {
  run.step.count = run.moves.length - run.step.from;
  run.steps.push(run.step);
  run.step = null;
}

/**
 * Die Stelle, ab der im laufenden Schritt freie Züge stehen: hinter dem letzten
 * Block, und solange es keinen gibt, am Anfang des Schrittes.
 */
function freeSince(run) {
  const last = run.step.blocks[run.step.blocks.length - 1];
  return last ? last.from + last.count : run.step.from;
}

/**
 * Freie Züge und Ausrichtungszüge.
 *
 * Zwei freie Züge derselben Seite werden zu einem zusammengefasst, und ein
 * Paar, das sich ganz aufhebt, entfällt. Ohne das stehen in der Lösung Stellen
 * wie `U U2`, die den Anwender zwei Handgriffe kosten statt einen; sie kamen in
 * 3000 von 3000 Verwürfelungen vor, siehe 4T-0038.
 *
 * **Zwei Grenzen bleiben unangetastet**, beide aus `run.step` gelesen:
 *
 * 1. **Das Ende des letzten Blocks.** Davor steht eine gelernte Zugfolge. Sie
 *    um ihren letzten Zug zu kürzen machte sie unkenntlich, und genau darauf
 *    beruht der Zweck der Lernlösung.
 * 2. **Der Anfang des Schrittes.** Über diese Grenze hinweg zusammenzufassen
 *    zerstört das Zwischenziel des vorigen Schrittes, denn dessen letzter
 *    Ausrichtungszug hat es gerade erst hergestellt und der erste des nächsten
 *    dreht es wieder weg. Gemessen bricht das in 1678 von 3000 Lösungen, und
 *    keine Zuordnung des verschmolzenen Zuges heilt es.
 *
 * Beide Grenzen ergeben sich hier von selbst, auch für die Züge eines Blocks:
 * Während `apply` seine Züge ablegt, ist `run.moves.length` nie größer als das
 * bereits eingetragene Blockende. Es braucht deshalb keine Fallunterscheidung.
 *
 * `run.cube` entsteht weiterhin aus allen übergebenen Zügen. Zwei
 * zusammengefasste Drehungen derselben Seite wirken wie beide einzeln; das
 * Zusammenfassen ändert die Aufschreibung und nicht die Rechnung.
 */
function turn(run, moves) {
  if (moves.length === 0) return;
  run.cube = applyMoves(run.cube, moves);
  for (const move of moves) {
    const previous = run.moves.length > freeSince(run) ? run.moves[run.moves.length - 1] : null;
    if (previous !== null && Math.floor(previous / 3) === Math.floor(move / 3)) {
      run.moves.pop();
      // Zug-Index 0, 1, 2 sind ein, zwei und drei Vierteldrehungen. Vier
      // Viertel führen auf die Ausgangslage zurück, dann entfällt der Zug ganz.
      const quarters = ((previous % 3) + (move % 3) + 2) % 4;
      if (quarters > 0) run.moves.push(Math.floor(move / 3) * 3 + quarters - 1);
      continue;
    }
    run.moves.push(move);
  }
}

/**
 * Eine Zugfolge des Lernpfads. Anders als bei `turn` wird sie als Block
 * vermerkt: mit Zugfolge, Haltung, Richtung und Bereich. Darauf beruht die
 * maschinelle Prüfung, dass die Lösung nur die gelernten Folgen verwendet,
 * und darauf setzt später die Oberfläche auf, wenn sie von einem Block zur
 * zugehörigen Lektion führt.
 */
function apply(run, block) {
  run.step.blocks.push({
    sequence: block.key,
    hold: block.hold,
    reversed: block.reversed,
    repeat: block.repeat,
    from: run.moves.length,
    count: block.moves.length,
  });
  turn(run, block.moves);
}

/** Dieselbe Zugfolge, in einer anderen Haltung. */
function inHold(block, hold) {
  return { ...block, hold, moves: rotateMoves(block.moves, hold) };
}

// ------------------------------------------------------------- Schritt 1

/**
 * Das Kreuz der unteren Schicht, Lektion 2, ohne Zugfolge.
 *
 * Je Kante: nach oben holen, über ihren Platz drehen, herunterziehen. Eine
 * gekippte Kante wird nicht über ihrem Platz, sondern über der Nachbarstelle
 * ausgerichtet und mit drei Zügen eingelegt; über ihrem eigenen Platz gibt es
 * keinen so kurzen Handgriff, siehe `CROSS.insertFlipped`.
 *
 * Warum die Kante immer erst nach oben kommt: Die obere Schicht ist zu
 * diesem Zeitpunkt Freifläche. Jeder Handgriff, der eine Kante unmittelbar
 * von unten nach unten bewegt, müsste die schon gesetzten Kreuzkanten
 * mitdrehen.
 *
 * Die Reihenfolge der vier Kanten kommt von außen, siehe `chooseOrder`.
 */
function solveCross(run, order) {
  for (const hold of order.cross) {
    const target = EDGE_AT[hold][DF];
    const above = EDGE_AT[hold][UF];
    const beside = EDGE_AT[hold][UR];
    for (let guard = 0; ; guard++) {
      if (guard > GUARD) throw new Error('Kreuz: kein Fortschritt');
      const state = run.cube;
      if (state.ep[target] === target && state.eo[target] === 0) break;
      const at = state.ep.indexOf(target);
      if (UPPER_EDGES.includes(at)) {
        const flipped = state.eo[at] === 1;
        turn(run, alignUp(at, flipped ? beside : above));
        turn(run, rotateMoves(flipped ? CROSS.insertFlipped : CROSS.insert, hold));
      } else if (LOWER_EDGES.includes(at)) {
        turn(run, rotateMoves(CROSS.fromBottom, holdOf(EDGE_AT, DF, at)));
      } else {
        turn(run, rotateMoves(CROSS.fromMiddle, holdOf(EDGE_AT, FR, at)));
      }
    }
  }
}

// ------------------------------------------------------------- Schritt 2

/**
 * Die vier Ecken der ersten Schicht, Lektion 3.
 *
 * Je Ecke drei Lagen: Sie liegt in einer fremden Lücke der unteren Schicht
 * und wird mit einer Anwendung herausgeholt. Sie liegt in ihrer Lücke, aber
 * verdreht, und wird dort gedreht. Oder sie liegt oben und wird über ihre
 * Lücke gedreht und eingesetzt, mit so vielen Anwendungen, wie ihre Drehung
 * verlangt.
 *
 * Die Reihenfolge der vier Ecken kommt von außen, siehe `chooseOrder`.
 */
function solveFirstLayerCorners(run, order) {
  for (const hold of order.corners) {
    const slot = CORNER_AT[hold][DFR];
    const above = CORNER_AT[hold][URF];
    for (let guard = 0; ; guard++) {
      if (guard > GUARD) throw new Error('Erste Schicht: kein Fortschritt');
      const state = run.cube;
      if (state.cp[slot] === slot && state.co[slot] === 0) break;
      const at = state.cp.indexOf(slot);
      if (at === slot) {
        apply(run, inHold(CORNER_TWIST_IN_PLACE.get(neededTwist(state.co[slot])), hold));
      } else if (LOWER_CORNERS.includes(at)) {
        apply(run, inHold(CORNER_EJECT, holdOf(CORNER_AT, DFR, at)));
      } else {
        turn(run, alignUp(at, above));
        apply(run, inHold(CORNER_INSERT.get(neededTwist(run.cube.co[above])), hold));
      }
    }
  }
}

// ------------------------------------------------------------- Schritt 3

/**
 * Die vier Kanten der zweiten Schicht, Lektion 4.
 *
 * Liegt die Kante oben, entscheidet ihre Kippung, ob die rechte oder die
 * linke Zugfolge sie einlegt; beide gibt es für jede Lücke, und sie
 * verlangen entgegengesetzte Kippungen. Steckt sie in einer Lücke der
 * Mittelschicht, richtig oder falsch gekippt, holt eine Anwendung für diese
 * Lücke sie nach oben.
 *
 * Die Reihenfolge der vier Lücken kommt von außen, siehe `chooseOrder`.
 */
function solveSecondLayer(run, order) {
  for (const index of order.second) {
    const slot = MIDDLE_SLOTS[index];
    for (let guard = 0; ; guard++) {
      if (guard > GUARD) throw new Error('Zweite Schicht: kein Fortschritt');
      const state = run.cube;
      if (state.ep[slot] === slot && state.eo[slot] === 0) break;
      const at = state.ep.indexOf(slot);
      if (MIDDLE_SLOTS.includes(at)) {
        apply(
          run,
          SECOND_LAYER.find((variant) => variant.slot === at),
        );
      } else if (UPPER_EDGES.includes(at)) {
        const variant = SECOND_LAYER.find(
          (candidate) => candidate.slot === slot && (candidate.flip + state.eo[at]) % 2 === 0,
        );
        turn(run, alignUp(at, variant.source));
        apply(run, variant);
      } else {
        // Die untere Schicht steht seit Schritt 2 vollständig. Liegt hier
        // eine Kante der zweiten Schicht, ist der übergebene Zustand nicht
        // der, für den dieser Schritt gebaut ist.
        throw new Error('Zweite Schicht: Kante in der unteren Schicht');
      }
    }
  }
}

// -------------------------------------------------------- Schritte 4 bis 6

/**
 * Die drei Schritte der letzten Schicht folgen demselben Muster: Sie
 * bestehen aus Blöcken, und ein Block ist ein Ausrichtungszug der oberen
 * Schicht, gefolgt von der Zugfolge des Schrittes. Am Ende steht ein
 * letzter Ausrichtungszug.
 *
 * Gesucht wird die kürzeste Kette solcher Blöcke, die das Zwischenziel
 * erreicht, mit steigender Länge. Zwei Gründe für die Suche und gegen eine
 * Falltabelle:
 *
 * 1. **Jede Wahl ist belegt statt behauptet.** Ein Block wird erst
 *    ausgegeben, wenn nachgerechnet ist, dass die Kette ihr Zwischenziel
 *    erreicht. Eine Falltabelle behauptet dasselbe und trifft ihre Aussage
 *    über Bilder, die jemand von Hand eingetragen hat.
 * 2. **Sie kommt mit den erlaubten Bausteinen aus.** Die Suche kennt nur
 *    zwei Züge: den Ausrichtungszug und die Zugfolge des Schrittes. Sie kann
 *    deshalb nichts erzeugen, was der Lernpfad nicht lehrt.
 *
 * Der Suchraum ist klein: vier Ausrichtungen je Block. Gemessen über 3000
 * Verwürfelungen brauchen die Schritte 5 und 6 höchstens zwei Blöcke,
 * Schritt 4 dagegen in zwölf von hundert Lagen drei. Der Grund liegt in der
 * Zugfolge selbst: Nur aus der Linie führt eine einzige Anwendung zum Kreuz,
 * aus dem Winkel führt sie zunächst wieder auf eine Zweierlage. Erlaubt sind
 * vier Blöcke, damit eine ungemessene Lage nicht an der Schranke scheitert.
 */
function solveByChain(run, key, goal, name) {
  const base = parseMovesOrThrow(SEQUENCES[key]);
  const search = (state, depth, openings) => {
    for (let closing = 0; closing < HOLD_COUNT; closing++) {
      if (goal(applyMoves(state, alignUp(0, closing)))) return { openings, closing };
    }
    if (depth === 0) return null;
    for (let opening = 0; opening < HOLD_COUNT; opening++) {
      const next = applyMoves(applyMoves(state, alignUp(0, opening)), base);
      const found = search(next, depth - 1, [...openings, opening]);
      if (found) return found;
    }
    return null;
  };

  for (let depth = 0; depth <= 4; depth++) {
    const chain = search(run.cube, depth, []);
    if (!chain) continue;
    for (const opening of chain.openings) {
      turn(run, alignUp(0, opening));
      apply(run, { key, hold: 0, reversed: false, repeat: 1, moves: base });
    }
    turn(run, alignUp(0, chain.closing));
    return;
  }
  throw new Error(`${name}: keine Kette gefunden`);
}

// ------------------------------------------------------------- Schritt 7

/**
 * Die Ecken der letzten Schicht drehen, Lektion 8.
 *
 * Die obere Schicht wird nie gedreht, außer um die nächste Ecke an die
 * Arbeitsstelle zu bringen. Dass die untere Schicht zwischendurch zerstört
 * aussieht, gehört zum Verfahren: Die Summe der Eckendrehungen einer
 * lösbaren Lage ist durch drei teilbar, und daraus folgt, dass sich die
 * Wirkung der Blöcke auf die unteren Schichten gerade aufhebt, sobald die
 * letzte Ecke steht. Der Lernpfad sagt das dem Anwender vorher an, siehe
 * Didaktik-Konzept Abschnitt 5.
 *
 * Am Ende steht ein Ausrichtungszug, der die Zwischenzüge der oberen Schicht
 * zurücknimmt.
 */
function twistTopCorners(run) {
  let quarters = 0;
  for (let round = 0; round < HOLD_COUNT; round++) {
    // Hier steht bewusst die reine Frage nach der Drehung und nicht das
    // Zwischenziel `cubeSolved`. Zwischen den Blöcken sind die unteren
    // Schichten zerstört, und das gestaffelte Prädikat wäre dort falsch,
    // obwohl der Schritt genau nach Plan läuft. Es gilt erst wieder, wenn die
    // letzte Ecke steht.
    if (run.cube.co[URF] !== 0) {
      apply(run, TOP_CORNER_TWIST.get(neededTwist(run.cube.co[URF])));
    }
    if (UPPER_CORNERS.every((index) => run.cube.co[index] === 0)) break;
    turn(run, [UP_TURN]);
    quarters++;
  }
  turn(run, alignUp(quarters % HOLD_COUNT, 0));
  if (!UPPER_CORNERS.every((index) => run.cube.co[index] === 0)) {
    throw new Error('Ecken drehen: eine Ecke ist verdreht geblieben');
  }
}

// ---------------------------------------------------------------- Lösung

// Die Ziele der Kettensuche sind die Zwischenziele des Kerns und keine eigenen
// Formulierungen. Weil diese gestaffelt sind, verlangt etwa das Ziel von
// Schritt 5 zugleich, dass die beiden unteren Schichten und das Kreuz oben
// stehen bleiben. Das ist keine zusätzliche Bedingung, sondern die
// ausgesprochene: Nachgerechnet rühren alle drei Zugfolgen der letzten Schicht
// die unteren Schichten nicht an, weshalb die Suche dieselben Ketten findet wie
// zuvor. Schritt 6 hat diese Konjunktion schon vorher von Hand geführt.
const STEP_FUNCTIONS = [
  solveCross,
  solveFirstLayerCorners,
  solveSecondLayer,
  (run) => solveByChain(run, 'topCross', GOALS[3].holds, 'Kreuz oben'),
  (run) => solveByChain(run, 'topEdges', GOALS[4].holds, 'Kanten setzen'),
  (run) => solveByChain(run, 'topCorners', GOALS[5].holds, 'Ecken setzen'),
  twistTopCorners,
];

// ------------------------------------------- Reihenfolge der Teilaufgaben
//
// Die Schritte 1, 2 und 3 arbeiten je vier Steine ab, und in welcher
// Reihenfolge sie das tun, schreibt keine Lektion vor. Bisher war sie fest
// verdrahtet, nämlich die Haltungen null bis drei. Sie zu wählen spart
// gemessen 42,9 Handgriffe je Lösung, ohne eine einzige gelernte Zugfolge
// anzutasten; die Messung steht in 4T-0039.
//
// **Schritt 7 bleibt fest.** Sein Startpunkt ist gemessen in 500 von 500
// Verwürfelungen schon der beste. Eine Wahl, die nichts einbringt, kostet
// trotzdem eine Fallunterscheidung.

/**
 * Alle Reihenfolgen von vier Teilaufgaben.
 *
 * **Die bisherige feste Reihenfolge steht vorn.** Darauf beruht die
 * Zusicherung, dass bei gleicher Länge die gewohnte Lösung stehen bleibt: Der
 * Vergleich in `chooseOrder` ist strikt, also gewinnt der erste Fund.
 */
function buildOrders(values) {
  if (values.length <= 1) return [values];
  const out = [];
  for (let i = 0; i < values.length; i++) {
    const rest = [...values.slice(0, i), ...values.slice(i + 1)];
    for (const tail of buildOrders(rest)) out.push([values[i], ...tail]);
  }
  return out;
}

const ORDERS = buildOrders([0, 1, 2, 3]);
const NATURAL_ORDER = { cross: ORDERS[0], corners: ORDERS[0], second: ORDERS[0] };

/**
 * Wählt die Reihenfolge je Schritt, gierig und in der Reihenfolge der Schritte.
 *
 * **Bewertet wird die vollständige Lösung und nicht der eigene Schritt.** Die
 * Wahl in Schritt 1 verändert die Lage, in der Schritt 2 beginnt; wer nur den
 * eigenen Schritt misst, wählt lokal und verliert global. Die billigere
 * Bewertung kostet gemessen 23,8 Züge je Lösung und trifft nur in 10 von 500
 * Verwürfelungen dieselbe Wahl. Sie ist damit keine Ersparnis, sondern ein
 * anderes Verfahren.
 *
 * **Bewertet wird nach der Zuglänge und nicht nach Handgriffen**, obwohl der
 * Handgriff die Größe ist, die den Anwender etwas kostet. Die Zerlegung einer
 * Lösung in Griffe steht in `view/wiedergabe.js`, und der Löser darf laut
 * Architektur nur aus `core` lesen. Sie hierher zu ziehen oder nachzubauen
 * bringt gemessen 0,4 Handgriffe von 42,9 und wäre der teurere Weg.
 *
 * Das sind 72 vollständig gerechnete Lösungen je Aufruf. Die vollständige Suche
 * über alle 13 824 Kombinationen ergäbe weitere 20 Züge weniger, kostete aber
 * 1,2 Sekunden je Lösung und unterschritte die Größenordnung, die S-0022
 * zusagt.
 */
function chooseOrder(cube) {
  const order = { ...NATURAL_ORDER };
  for (const key of ['cross', 'corners', 'second']) {
    let best = null;
    for (const candidate of ORDERS) {
      const length = solveInOrder(cube, { ...order, [key]: candidate }).moves.length;
      if (best === null || length < best.length) best = { candidate, length };
    }
    order[key] = best.candidate;
  }
  return order;
}

/**
 * Die eigentliche Rechnung, zu einer gegebenen Reihenfolge.
 *
 * Sie prüft die Lösbarkeit nicht; das tut der äußere Aufruf einmal, statt
 * dreiundsiebzigmal dasselbe zu prüfen.
 */
function solveInOrder(cube, order) {
  const run = { cube, moves: [], steps: [], step: null };
  STEPS.forEach((definition, index) => {
    beginStep(run, definition);
    STEP_FUNCTIONS[index](run, order);
    endStep(run);

    // Selbstprüfung nach jedem Schritt und nicht nur am Ende. Sie macht aus
    // einem Denkfehler in einer Fallunterscheidung eine Meldung, statt eine
    // Zugfolge auszuliefern, die den Würfel nicht löst.
    //
    // **Nach jedem Schritt und nicht nur am Ende**, weil ein Schritt sein Ziel
    // verfehlen und ein späterer den Fehler zufällig heilen kann. Die Lösung
    // wäre dann richtig und ihre Gliederung eine Behauptung ohne Deckung.
    // Weil das letzte Zwischenziel der gelöste Würfel ist, deckt diese Prüfung
    // die frühere Schlussprüfung mit ab.
    if (!GOALS[index].holds(run.cube)) {
      throw new Error(
        `Schritt ${definition.number} erreicht sein Zwischenziel ${GOALS[index].key} nicht`,
      );
    }
  });

  return { moves: run.moves, steps: run.steps };
}

/**
 * Erzeugt die Lernlösung zu einem Zustand.
 *
 * Rückgabe: `{ moves, steps }`. `moves` ist die vollständige Zugfolge als
 * Zug-Indizes, `steps` ihre Gliederung in die sieben Schritte, je Schritt mit
 * Nummer, Bezeichner, Lektion, Bereich und den verwendeten Blöcken.
 *
 * Der Löser formuliert keine Texte. Der Bezeichner verweist auf die Lektion;
 * die Worte stehen dort und werden dort gepflegt.
 *
 * Ein bereits gelöster Würfel ergibt eine leere Lösung mit sieben leeren
 * Schritten und ist kein Fehler.
 *
 * Ein unlösbarer Zustand wirft. Der Datenfluss sieht vor, dass jeder Zustand
 * die Prüfung der Lösbarkeit passiert, bevor ihn irgendjemand sieht; ein
 * Verstoß dagegen ist ein Fehler im Aufrufer. Ohne diese Zusicherung liefe
 * der Löser in seine Schranken, und die Meldung nennte einen Schritt statt
 * der Ursache.
 */
export function solveBeginner(cube) {
  const befund = validateFacelets(toFacelets(cube));
  if (!befund.ok) {
    throw new RangeError(`Unlösbarer Zustand, Bedingung: ${befund.grund}`);
  }
  return solveInOrder(cube, chooseOrder(cube));
}

/**
 * Der Schritt, der als Nächstes zu tun ist, oder `null` beim gelösten Würfel.
 *
 * Gebraucht von der Hilfe der Lektion 9, die den nächsten Schritt nennt und
 * nicht die Lösung. Übergeben wird die Gliederung aus `solveBeginner`.
 *
 * **Zurück kommt eine Kopie mit drei Angaben und nicht der Schritt selbst.**
 * Der Schritt trägt seinen Bereich in der Zugfolge und die verwendeten Blöcke;
 * wer ihn bekäme, könnte daraus die Züge holen. Dass die Auskunft keine trägt,
 * ist so eine Frage der Bauart und keine der Sorgfalt.
 *
 * **Ein Schritt ohne Züge ist ein erledigter Schritt.** Darauf beruht die
 * Auswahl, und es ist keine Annahme: `solveInOrder` prüft nach jedem Schritt
 * dessen Zwischenziel und wirft, wenn es nicht steht. Die Prüfstrecke stellt
 * dieselbe Frage zusätzlich von der anderen Seite, nämlich über das erste
 * Zwischenziel aus `core/goals.js`, das nicht gilt.
 */
export function nextStep(steps) {
  const offen = steps.find((step) => step.count > 0);
  return offen ? { number: offen.number, key: offen.key, lesson: offen.lesson } : null;
}

/**
 * Die Lernlösung zu einer vorgegebenen Reihenfolge.
 *
 * **Nur für die Prüfstrecke.** Sie belegt damit zweierlei, was ohne diesen
 * Zugang nur behauptet wäre: dass die Wahl nie eine längere Lösung liefert als
 * der Stand vor 4T-0039, und dass jede der drei Stellschrauben überhaupt
 * wirkt. Die zweite Aussage fehlte zunächst, und ein absichtlicher Bruch hat
 * gezeigt, dass ein wirkungslos gewordener Schritt 3 sonst unbemerkt bliebe.
 *
 * Die Lösbarkeit prüft sie nicht; das tut `solveBeginner`.
 */
export function solveBeginnerInOrder(cube, order = NATURAL_ORDER) {
  return solveInOrder(cube, order);
}

/** Die Reihenfolge, die bis 4T-0039 fest verdrahtet war. Für die Prüfstrecke. */
export { NATURAL_ORDER };
