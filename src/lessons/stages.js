// Die vier Stufen des Übergangs zum Verfahren CFOP als Daten.
//
// Sie stehen neben den zehn Lektionen und nicht unter ihnen. **Der Grund ist
// gemessen und nicht erwogen:** Eine Stufe als elfte Lektion in `LESSONS`
// eingehängt, und 19 der 629 Prüfungen fallen, darunter «die prüfbaren
// Lektionen tragen die sieben Zwischenziele in ihrer Reihenfolge». Diese
// Aussagen gelten dem Anfängerverfahren, sie sind wahr und sollen wahr bleiben;
// sie so zu weiten, dass eine Stufe hindurchpasst, machte sie stumpfer.
// Einzelheiten in 4T-0117.
//
// **Eine Stufe ist auch inhaltlich kein Sonderfall einer Lektion.** Sie hat eine
// Fallmenge statt einer Zugfolge, eine Deckung statt eines Zählers und später
// zwei Fassungen statt einer.
//
// **Der Fortschritt bleibt trotzdem einer.** `requires` nennt einen Bezeichner
// und keine Nummer, und die erste Stufe knüpft damit unmittelbar an die letzte
// Lektion an. Genau darauf hat `catalog.js` diese Verzweigung seit 4T-0043
// vorbereitet.
//
// **Dieses Modul liest `cases.js` unmittelbar.** Der Modulschnitt der
// Architektur regelt Abhängigkeiten zwischen Modulen; beide gehören zu
// `lessons`, und `setup.js` hängt dort seit 4T-0044 ebenso von `catalog.js` ab.
// Die Bauart ist die von `goal` in `catalog.js`: Der Bezeichner steht in den
// Daten, das Modul löst ihn auf.
//
// **Die Ziele werden einzeln geholt und nicht über `GOALS`.** Die Liste führt
// die sieben Zwischenziele des Anfängerverfahrens, und `topLayerOriented` steht
// mit Absicht nicht darin; die Begründung ist in 4T-0116 gemessen.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine globalen
// Namen. Die ESLint-Konfiguration erzwingt das.

import { bottomCross, cubeSolved, topLayerOriented, twoLayers } from '../core/goals.js';
import { EDITIONS, VIEWS, casesForView } from './cases.js';

/** Wie viele gelungene Anwendungen eine Stufe ohne Fallmenge verlangt. */
const APPLICATIONS = 3;

/**
 * Die Fassungen, über die dieses Modul rechnet.
 *
 * **Aus `EDITIONS` abgeleitet und nicht daneben geschrieben.** Eine dritte
 * Fassung wäre sonst an zwei Orten anzumelden, und die zweite ginge vergessen;
 * `cases.js` bildet seine eigene Menge auf demselben Weg.
 */
const BEKANNTE_FASSUNGEN = Object.values(EDITIONS);

/**
 * Die vier Stufen in der Reihenfolge des Pfades.
 *
 * Sie läuft dem Lösungsweg entgegen und beginnt bei der letzten Schicht;
 * Abschnitt 11.2 des Didaktik-Konzepts begründet das und nennt als schwersten
 * Grund, dass jede Stufe für sich benutzbar bleibt.
 *
 * **`views` führt seine Blicke je Fassung, seit 4T-0170.** Bis dahin stand dort
 * eine einzige Liste und daneben ein Feld `edition` mit dem festen Wert
 * `reduced`. Beides zusammen sagte, welche Fassung gilt, und genau das ist seit
 * diesem Task eine Wahl des Anwenders und keine Eigenschaft des Bestands. Was
 * hier bleibt, ist die Angabe, welche Blicke eine Fassung ansieht.
 *
 * **Die Liste der reduzierten Fassung ist leer, wo die Stufe eine Denkweise ist
 * und keine Fallsammlung.** Daran und an nichts anderem hängt, welche der
 * beiden Freigaberegeln aus Abschnitt 11.7 gilt; `masteredByCoverage` rechnet
 * es. Ein eigenes Feld dafür wäre ein zweiter Ausdruck derselben Sache und
 * könnte ihm davonlaufen.
 *
 * **Bis 4T-0196 stand hier «beide Listen», und das war richtig, solange keine
 * Stufe eine Fallsammlung allein im vollen Umfang trug.** Die dritte tut es
 * seitdem: Sie bleibt eine Denkweise, deren Freigabe drei gelungene Anwendungen
 * misst, und trägt daneben vierundzwanzig Fälle als Abkürzung. Der Ausbau ist
 * ein Deckungsstand und kein Freigabetor, und genau deshalb sieht die Weiche
 * die reduzierte Fassung an und nicht beide.
 *
 * **Beim Setzen führt der volle Umfang denselben Blick wie die reduzierte
 * Fassung**, und das ist gemessen und kein Versehen: `edgePermutation` liest
 * die Anordnung der Ecken **und** der Kanten und ist damit schon das Merkmal
 * des vollen Umfangs. Dass die reduzierte Fassung dort vier Fälle sieht und der
 * volle Umfang einundzwanzig, trennt `casesForView` über `editions` am Fall.
 * Die Rechnung dazu steht in `cases.js` und in `test/lessons/cases.test.js`.
 *
 * **`lastLayerOrientation` trägt heute keinen Fall.** Der Blick ist mit
 * 4T-0155 als Gefäß entstanden, seine siebenundfünfzig Fälle kommen mit
 * 3E-0058. Er steht hier trotzdem, denn `anyEditionFilled` rechnet die Frage,
 * ob eine Fassung etwas zu üben gibt, am Bestand und nicht an dieser Liste;
 * sobald die Fälle da sind, ist hier nichts nachzuziehen.
 */
export const STAGES = [
  {
    number: 1,
    key: 'orientLastLayer',
    requires: 'solveAlone',
    goal: topLayerOriented,
    views: {
      [EDITIONS.REDUCED]: [VIEWS.EDGE_ORIENTATION, VIEWS.CORNER_ORIENTATION],
      [EDITIONS.FULL]: [VIEWS.LAST_LAYER_ORIENTATION],
    },
  },
  {
    number: 2,
    key: 'permuteLastLayer',
    requires: 'orientLastLayer',
    goal: cubeSolved,
    views: {
      [EDITIONS.REDUCED]: [VIEWS.CORNER_PERMUTATION, VIEWS.EDGE_PERMUTATION],
      [EDITIONS.FULL]: [VIEWS.EDGE_PERMUTATION],
    },
  },
  {
    number: 3,
    key: 'firstTwoLayers',
    requires: 'permuteLastLayer',
    goal: twoLayers,
    // **Die einzige Stufe, deren Fassungen sich in der Art unterscheiden und
    // nicht in der Zahl**, seit 4T-0196. Der geführte Weg ist hier kein
    // kleinerer Fallbestand, sondern gar keiner: Der Anwender legt das Paar
    // nach dem Handgriff ein, den Abschnitt 11.6 des Didaktik-Konzepts
    // beschreibt. Der volle Umfang stellt vierundzwanzig Abkürzungen daneben.
    views: { [EDITIONS.REDUCED]: [], [EDITIONS.FULL]: [VIEWS.PAIR_PLACEMENT] },
  },
  {
    number: 4,
    key: 'plannedCross',
    requires: 'firstTwoLayers',
    goal: bottomCross,
    views: { [EDITIONS.REDUCED]: [], [EDITIONS.FULL]: [] },
  },
];

const STAGE_BY_KEY = new Map(STAGES.map((stage) => [stage.key, stage]));

/** Die Stufe zu einem Bezeichner, oder `null` bei einem unbekannten. */
export function stageFor(key) {
  return STAGE_BY_KEY.get(key) ?? null;
}

/** Gehört dieser Bezeichner zu einer Stufe? */
export function isStage(key) {
  return STAGE_BY_KEY.has(key);
}

/**
 * Die Blicke, die diese Stufe in dieser Fassung ansieht.
 *
 * Eine leere Liste für eine unbekannte Stufe, eine unbekannte Fassung und für
 * eine Stufe ohne Fallmenge. **Kein Wurf:** Wer nach den Blicken einer Stufe
 * fragt, die es nicht gibt, hat ein Anzeigeproblem und kein Rechenproblem, und
 * dieselbe Haltung tragen `stageMastered` und `createStageSetup` seit 4T-0117.
 *
 * **Diese Auskunft steht hier, damit niemand `stage.views` unmittelbar liest.**
 * Bis 4T-0170 tat das die Verdrahtung an zwei Stellen, und beide nahmen damit
 * in jedem Fall die Blicke der reduzierten Fassung. Ein Feld, das seine Gestalt
 * ändert, fällt so an einer Stelle auf statt an allen.
 */
export function viewsOf(key, edition = EDITIONS.REDUCED) {
  const stage = stageFor(key);
  if (stage === null) return [];
  return stage.views[edition] ?? [];
}

/**
 * Die Kennungen aller Fälle dieser Stufe in dieser Fassung, oder eine leere
 * Menge.
 *
 * **Gerechnet und nicht geschrieben**, denn eine zweite Fassung der Zahl liefe
 * dem Bestand davon, sobald ein Fall hinzukommt. Eine Kennung trägt den Blick
 * mit, weil zwei Blicke dieselbe Fallkennung führen dürfen; ohne den Blick
 * fielen sie in der Menge zusammen und die Deckung zählte zu wenig.
 *
 * **Auf Abruf gerechnet und nicht im Modulrumpf.** `casesForView` wirft bei
 * einem unbekannten Blick, und ein Wurf im Modulrumpf risse jede Prüfdatei mit,
 * die dieses Modul lädt, ohne zu sagen, welche Aussage gefallen ist. Dass ein
 * genannter Blick im Bestand steht, sagt deshalb eine Prüfung und kein Wurf.
 *
 * **Die Fassung kommt seit 4T-0170 von außen und nicht mehr aus der Stufe.**
 * Sie zu brauchen ist älter: Beim Setzen führen beide Fassungen denselben
 * Blick, und ohne die Angabe zöge die reduzierte Fassung die Fälle des vollen
 * Umfangs mit. Ihre Fallmenge wüchse, und mit ihr die Zahl, die ihre Freigabe
 * verlangt; Abschnitt 11.7 des Didaktik-Konzepts legt für sie sechs fest.
 *
 * **Die Vorgabe ist die reduzierte Fassung**, wie bei `casesForView` seit
 * 4T-0159 und aus demselben Grund: Ein Aufrufer, der die Fassung vergisst,
 * bekommt die, die das Programm bis zu diesem Task ausgeliefert hat, und
 * richtet nichts an.
 */
export function casesOf(key, edition = EDITIONS.REDUCED) {
  const kennungen = viewsOf(key, edition).flatMap((view) =>
    casesForView(view, edition).map((fall) => `${view}/${fall.id}`),
  );
  return new Set(kennungen);
}

/**
 * Hat diese Stufe überhaupt eine Fallmenge, gleich in welcher Fassung?
 *
 * **Ohne Fassung, und das ist keine Lücke.** Ob eine Stufe irgendwo Fälle führt,
 * ist eine Frage des Zuschnitts und keine der Fassung. Daran hängt, was das
 * Training zur Wahl stellt, ob eine Fallliste erscheint und ob der Fortschritt
 * einen gelungenen Fall entgegennimmt.
 *
 * Gerechnet wird deshalb über beide Blicklisten zusammen.
 *
 * **Bis 4T-0196 hing hier zusätzlich die Freigaberegel**, mit der Begründung,
 * eine Stufe dürfe nicht mit der Fassung ihr Maß wechseln. Die Begründung gilt
 * unverändert; sie wird von `masteredByCoverage` gerade eingelöst, das an der
 * reduzierten Fassung hängt und damit an keiner Wahl des Anwenders. Beide
 * Auskünfte fallen bei drei der vier Stufen zusammen und bei der dritten nicht,
 * seit sie eine Fallsammlung allein im vollen Umfang trägt.
 */
export function hasCases(key) {
  return BEKANNTE_FASSUNGEN.some((edition) => viewsOf(key, edition).length > 0);
}

/**
 * Misst die Freigabe dieser Stufe die Deckung ihrer Fallmenge?
 *
 * Die Weiche aus Abschnitt 11.7 des Didaktik-Konzepts, seit 4T-0196 als eigene
 * Auskunft. **Sie sieht allein die reduzierte Fassung an**, und das ist der
 * Wortlaut des Konzepts und keine Auslegung: «Die Stufen 3 und 4 haben in der
 * reduzierten Fassung keine Fallmenge, und für sie bleibt die Regel aus
 * Abschnitt 7 unverändert.»
 *
 * **Der Ausbau ist ein Deckungsstand und kein Freigabetor.** Wer im vollen
 * Umfang übt, ändert damit nicht, woran seine Stufe freigegeben wird; sonst
 * hinge die Freigabe an einer Wahl, die der Anwender jederzeit umstellen kann.
 *
 * **Nach Blicken gefragt und nicht nach Fällen**, anders als
 * `anyEditionFilled`. Eine Fassung ohne Blicke ist eine Denkweise; eine Fassung
 * mit Blicken, aber noch ohne Fälle, ist ein Gefäß, das gefüllt wird. Am
 * Bestand vom 2026-09-07 fällt beides zusammen, doch das war schon einmal
 * anders: Zwischen 4T-0155 und 3E-0058 trug `lastLayerOrientation` einen Blick
 * ohne einen einzigen Fall.
 */
export function masteredByCoverage(key) {
  return viewsOf(key, EDITIONS.REDUCED).length > 0;
}

/**
 * Trägt mindestens eine Fassung dieser Stufe einen Fall?
 *
 * Die Bedingung, unter der 4T-0171 die Umschaltung anbietet, **am 2026-09-07
 * mit 4T-0196 von «beide» auf «mindestens eine» geweitet**, entschieden vom
 * Product Owner. Sie fragt nach Fällen und nicht nach Blicken, und darin liegt
 * ihr ganzer Zweck: Eine Umschaltung in eine Fassung, deren Gefäß leer steht,
 * zeigte eine leere Fallliste, und das ist derselbe Fall wie die Einstellung
 * ohne Wirkung, die das Projekt am 2026-08-13 aus dem Einstellungs-Katalog
 * gestrichen hat.
 *
 * **Die Weitung unterscheidet zwei Arten von leerer Fassung, und der
 * Unterschied ist gerechnet.** Bis 4T-0175 war der volle Umfang der ersten
 * Stufe leer, **weil ihn niemand gefüllt hatte**; die reduzierte Fassung der
 * dritten ist leer, **weil sie eine Denkweise ist**. Jene war kein Angebot,
 * diese ist eines. Welche von beiden vorliegt, sagt die Blickliste, und
 * `setEdition` in `progress.js` weist danach ab oder lässt zu.
 *
 * **Gerechnet und nicht geschrieben**, aus demselben Grund wie die Fallzahl
 * selbst: Eine Liste der umschaltbaren Stufen liefe dem Bestand davon.
 */
export function anyEditionFilled(key) {
  return BEKANNTE_FASSUNGEN.some((edition) => casesOf(key, edition).size > 0);
}

/**
 * Die Fassungen, zwischen denen diese Stufe zu wählen erlaubt, je mit ihrer
 * Fallzahl. Eine leere Liste, wo es nichts zu wählen gibt.
 *
 * **Diese Rechnung stand bis zur Bruchmessung von 4T-0171 in der Verdrahtung**,
 * und dort war sie nur als Text zu prüfen: Ein Bruch, der die Bedingung
 * entfernte, ließ keine einzige Prüfung fallen, obwohl die erste Stufe damit
 * eine Umschaltung in einen leeren Umfang bekommen hätte. Nach Lehre 15 in
 * Abschnitt 14.5 ist ein Bruch ohne Ausschlag selbst der Befund; hier war er
 * eine Rechnung am falschen Ort. Sie gehört zum Fallbestand, wie
 * `anyEditionFilled` darüber, und ist hier vollständig durchzurechnen.
 *
 * **Die Reihenfolge ist die von `EDITIONS`**, also die reduzierte zuerst. Sie
 * ist die des Lernwegs, und die Anzeige übernimmt sie, ohne sie zu kennen.
 */
export function editionsOfStage(key) {
  if (!anyEditionFilled(key)) return [];
  return BEKANNTE_FASSUNGEN.map((edition) => ({
    name: edition,
    anzahl: casesOf(key, edition).size,
  }));
}

/**
 * Wie viele gelungene Anwendungen diese Stufe verlangt, oder `0`.
 *
 * `0` heißt hier nicht «keine», sondern «die Zahl ist nicht das Maß»: Wo die
 * Deckung misst, zählt keine Anwendung. Beides in einem Feld zu führen war beim
 * Zuschnitt erwogen und verworfen, weil jede Lesestelle daraus eine
 * Fallunterscheidung machte.
 *
 * **Gefragt wird `masteredByCoverage` und nicht `hasCases`**, seit 4T-0196. Die
 * dritte Stufe trägt Fälle und wird trotzdem über drei Anwendungen freigegeben;
 * wer hier nach der bloßen Fallmenge fragte, gäbe ihr die Null und damit ein
 * Maß, das sie nie erreicht.
 */
export function requiredApplications(key) {
  if (stageFor(key) === null || masteredByCoverage(key)) return 0;
  return APPLICATIONS;
}

/** Erreicht dieser Zustand das Ziel der Stufe? */
export function reachesGoal(key, state) {
  const stage = stageFor(key);
  return stage !== null && stage.goal(state);
}

/**
 * Ist diese Stufe beherrscht?
 *
 * Die Regel aus Abschnitt 11.7 des Didaktik-Konzepts, als Rechnung und nicht als
 * Anzeige: **Wo eine Stufe eine Fallmenge hat, misst die Freigabe deren Deckung;
 * wo sie eine Denkweise ist, misst sie die Zahl gelungener Anwendungen.**
 * Welches von beidem gilt, sagt `masteredByCoverage` und seit 4T-0196 nicht
 * mehr `hasCases`; die dritte Stufe ist beides zugleich, eine Denkweise mit
 * einer Fallsammlung daneben.
 *
 * **Der Stand wird hereingereicht und nicht geholt.** `progress.js` bekommt sein
 * zweites Feld erst in 4T-0118; bis dahin bliebe dieses Modul sonst
 * unvollständig prüfbar. Dieselbe Haltung wie dort beim Speicher, der von `app`
 * verdrahtet wird.
 *
 * Ein unbekannter Bezeichner ist nicht beherrscht und wirft nicht. Wer eine
 * Stufe freigibt, die es nicht gibt, hat ein Anzeigeproblem und kein
 * Rechenproblem; ein Wurf machte daraus eines.
 *
 * **Die Fassung gehört seit 4T-0170 zum hereingereichten Stand** und steht
 * damit neben den gelungenen Fällen und dem Zähler. Sie gehört dorthin und
 * nicht zur Stufe, denn sie ist wie jene beiden eine Größe des Anwenders und
 * keine des Bestands. Wer im vollen Umfang arbeitet, gibt die nächste Stufe
 * damit nicht leichter frei, sondern schwerer, und das ist die Folge seiner
 * eigenen Wahl; Abschnitt 11.7 des Didaktik-Konzepts hält daran fest, dass der
 * Ausbau einen Deckungsstand zeigt und kein Freigabetor ist.
 */
export function stageMastered(
  key,
  { cases = null, applications = 0, edition = EDITIONS.REDUCED } = {},
) {
  const stage = stageFor(key);
  if (stage === null) return false;
  if (!masteredByCoverage(key)) return applications >= APPLICATIONS;
  const verlangt = casesOf(key, edition);
  if (verlangt.size === 0) return false;
  const gelungen = cases ?? new Set();
  for (const kennung of verlangt) {
    if (!gelungen.has(kennung)) return false;
  }
  return true;
}
