// Der Ablauf der Zeitnahme: Inspektionszeit, Stoppuhr, beide Wege.
//
// ## Vier Phasen, zwei Wege, ein Gefäß
//
// Bereit, Inspektion, Messung, fertig. Beide Wege durchlaufen dieselben Phasen
// und unterscheiden sich in **genau einer** Frage: wer den Versuch beendet. Am
// Bildschirm tut es der gelöste Würfel, am eigenen Stück der Anwender. Der Weg
// ist deshalb ein Wert und keine zweite Bauart; zwei Bauarten hätten zwei
// Stellen, an denen ein Versuch entsteht.
//
// ## Beide Uhren werden hereingereicht und keine gelesen
//
// Das ist die Bauform von `erzeugeWiedergabe`, die `warte` von außen bekommt,
// und von `createRunner`, der `setTimer` bekommt. Hier ist sie die Bedingung
// dafür, dass die Prüfung trägt: Eine Rechnung, die selbst auf die Uhr sieht,
// lässt sich nicht in Millisekunden prüfen, sondern nur in Wartezeit.
//
// **`jetzt()` läuft monoton und trägt die Dauer.** Die Verdrahtung baut sie aus
// `performance.now()`. Die Kalenderzeit taugt dafür nicht: Sie folgt der
// Systemzeit, und eine Korrektur über das Netz oder die Umstellung auf
// Winterzeit verschiebt sie mitten im Versuch. Die Stoppuhr zeigte dann eine um
// eine Stunde falsche oder eine negative Dauer.
//
// **`zeitpunkt()` benennt, wann der Versuch war.** Eine monotone Uhr hat keinen
// Bezugspunkt in der Welt; ihr Nullpunkt ist der Beginn des Dokuments und beim
// nächsten Öffnen ein anderer. Der Verlauf braucht beides, und deshalb stehen
// hier zwei Uhren und nicht eine. Ihr Wert wird unverändert durchgereicht und
// nicht gerechnet; die Gestalt nach ISO 8601 in UTC entsteht in der
// Verdrahtung, weil `Date` dorthin gehört.
//
// ## Die Phase wird gerechnet und nicht fortgeschrieben
//
// Der Wechsel von der Inspektion in die Messung braucht keinen Weckruf.
// `status()` fragt die Uhr und rechnet daraus, welche Phase gilt. Das ist die
// Bauform von `standAn(n)` in der Wiedergabe, und der Grund ist derselbe: Zwei
// Wege zum selben Wert laufen früher oder später auseinander. Ein Weckruf wäre
// überdies eine zweite Uhr neben der Anzeige, und die Prüfung müsste auf ihn
// warten statt ihn zu setzen.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine globalen
// Namen. Die ESLint-Konfiguration erzwingt das seit 4T-0146; ihr Kommentar
// nennt die Lücke, die sie dabei offen lässt.

import { isSolved } from '../core/cube.js';

/**
 * Die vier Phasen eines Versuchs.
 *
 * In der Bauart von `EXERCISE_MODES` in `exercise.js` und `EDITIONS` in
 * `stages.js`: ein Wert mit sprechendem Namen statt einer Zeichenkette an jeder
 * Aufrufstelle.
 */
export const STOPWATCH_PHASES = {
  READY: 'ready',
  INSPECTION: 'inspection',
  RUNNING: 'running',
  DONE: 'done',
};

/**
 * Die beiden Wege, auf denen gemessen wird.
 *
 * `SCREEN` misst am Übungswürfel im Programm, `OWN_CUBE` am eigenen Stück des
 * Anwenders. **Der Weg gehört zum Versuch und nicht zur Person**, entschieden
 * vom Product Owner am 2026-09-02: Wer sein Stück zur Hand nimmt, wechselt
 * mitten in der Sitzung.
 *
 * **Aus der Bedienung ließe er sich nicht ableiten**, und das ist gemessen:
 * `verlauf-verwuerfeln` setzt den Übungswürfel und legt die Züge zugleich als
 * Notation zum Nachstellen ab. Für das Programm sehen beide Wege gleich aus.
 */
export const TIMING_MODES = { SCREEN: 'screen', OWN_CUBE: 'ownCube' };

const MODE_VALUES = new Set(Object.values(TIMING_MODES));

/** Eine Dauer in Millisekunden, ganzzahlig und nie negativ. */
const alsDauer = (wert) => Math.max(0, Math.trunc(wert) || 0);

/**
 * Erzeugt einen Ablauf der Zeitnahme.
 *
 * `jetzt()` liefert eine monoton laufende Zeit in Millisekunden, `zeitpunkt()`
 * die Kalenderzeit. Beide sind Pflicht.
 *
 * **Ohne Uhr wird geworfen, und das ist die Ausnahme von der Haltung des
 * Bestands.** `createExercise` liefert `null` statt zu werfen, weil eine
 * unbekannte Stufe ein Anzeigeproblem ist. Eine fehlende Uhr ist keines: Sie
 * ist ein Fehler der Verdrahtung, und ein Rückfall auf eine stehende Uhr
 * lieferte lautlos lauter Versuche von null Sekunden. Die Meldung nennt, was
 * fehlt, nach Lehre 4 in Abschnitt 14.5 der Konventionen.
 */
export function createStopwatch({ jetzt, zeitpunkt } = {}) {
  if (typeof jetzt !== 'function' || typeof zeitpunkt !== 'function') {
    throw new TypeError(
      'createStopwatch braucht beide Uhren: jetzt() für die Dauer und zeitpunkt() für den Zeitpunkt.',
    );
  }

  let modus = null;
  // Beginn des Versuchs auf der monotonen Uhr, zugleich Beginn der Inspektion.
  let beginn = null;
  let inspektionsdauer = 0;
  // Gesetzter Messbeginn nach einem vorzeitigen Start, sonst `null`.
  let vorgezogen = null;
  let ende = null;
  // Die Kalenderzeit des Beginns, unverändert durchgereicht.
  let stempel = null;

  /**
   * Der Zeitpunkt, an dem die Messung beginnt.
   *
   * **Gesetzt oder gerechnet, und in beiden Fällen ein Zeitpunkt.** Die Phase
   * rechnet gegen diesen einen Wert; zwei Zweige für die beiden Fälle wären
   * zwei Wege zur selben Auskunft, und der zweite liefe dem ersten davon.
   *
   * **Bei abgeschalteter Inspektion fällt der Sonderfall von selbst heraus**,
   * denn dann ist der Messbeginn der Beginn des Versuchs und die
   * Inspektionsphase hat keine Ausdehnung.
   */
  const messbeginn = () => vorgezogen ?? beginn + inspektionsdauer;

  const phaseAn = (t) => {
    if (beginn === null) return STOPWATCH_PHASES.READY;
    if (ende !== null) return STOPWATCH_PHASES.DONE;
    return t < messbeginn() ? STOPWATCH_PHASES.INSPECTION : STOPWATCH_PHASES.RUNNING;
  };

  /**
   * Die verstrichene Messzeit an einem Zeitpunkt.
   *
   * **Nie negativ.** Während der Inspektion liegt `t` vor dem Messbeginn, und
   * eine negative Dauer ist keine; sie stünde dort als Zahl in der Anzeige.
   */
  const dauerAn = (t) => {
    if (beginn === null) return 0;
    return Math.max(0, (ende ?? t) - messbeginn());
  };

  /** Setzt alles zurück, was einen Versuch ausmacht. */
  const raeumeAuf = () => {
    modus = null;
    beginn = null;
    inspektionsdauer = 0;
    vorgezogen = null;
    ende = null;
    stempel = null;
  };

  return {
    /**
     * Beginnt einen Versuch.
     *
     * `inspection` ist die Dauer der Inspektionszeit in Millisekunden; null
     * steht für die Einstellung «aus». Der Wert kommt aus Eintrag 7 des
     * Einstellungs-Katalogs, und **die Zuordnung dorthin ist nicht Sache dieses
     * Moduls**: Es rechnet mit einer Dauer und liest keine Einstellung.
     *
     * Liefert `false`, wenn schon ein Versuch läuft oder der Weg unbekannt ist.
     */
    begin({ mode, inspection = 0 } = {}) {
      if (beginn !== null) return false;
      if (!MODE_VALUES.has(mode)) return false;
      modus = mode;
      inspektionsdauer = alsDauer(inspection);
      beginn = jetzt();
      // **Der Zeitpunkt entsteht hier und nicht bei der Ablage.** Wer ihn erst
      // dort nähme, stempelte den Zeitpunkt des Ablegens.
      stempel = zeitpunkt();
      return true;
    },

    /**
     * Beendet die Inspektionszeit vorzeitig und beginnt die Messung.
     *
     * Entschieden vom Product Owner am 2026-09-03 aus einer Vorlage mit drei
     * Varianten. **Verworfen ist das Warten auf den Anwender nach Ablauf**,
     * denn das ist der Wettkampfablauf und trägt dort allein wegen der
     * Strafsekunden, die S-0049 ausgrenzt. **Verworfen ist die immer voll
     * ablaufende Inspektion**, weil der Geübte bei jedem Versuch wartete.
     *
     * Greift allein in der Inspektionsphase und liefert sonst `false`.
     */
    start() {
      if (phaseAn(jetzt()) !== STOPWATCH_PHASES.INSPECTION) return false;
      vorgezogen = jetzt();
      return true;
    },

    /**
     * Meldet die Lage des Übungswürfels und beendet den Versuch, wenn sie
     * gelöst ist.
     *
     * **Allein für den Weg über den Bildschirm.** Am eigenen Würfel greift die
     * Meldung nicht: Der Übungswürfel im Programm hat mit jenem Versuch nichts
     * zu tun und stünde womöglich von einem früheren her gelöst da.
     *
     * **Allein in der Messung.** Während der Inspektion beendete ein bereits
     * gelöster Würfel den Versuch, bevor er begonnen hat.
     *
     * Das Urteil kommt aus `isSolved` und nicht aus `cubeSolved` in `goals.js`.
     * Beide sind gleichwertig, und die Prüfstrecke rechnet das über den
     * vollständigen Störungsraum nach; jenes ist aber das siebte der sieben
     * Zwischenziele und für den Lernpfad gebaut, dieses ist der Vergleich mit
     * dem gelösten Würfel und damit die Frage, die hier gestellt wird.
     *
     * **Der Wächter auf die Lage steht daneben und nicht darin.** `equals`
     * greift auf `cube.cp` zu und würfe bei `null`; hier ist eine fehlende Lage
     * ein «noch nicht fertig» und kein Wurf, wie schon bei `viewSolved`.
     */
    observe(cube) {
      if (modus !== TIMING_MODES.SCREEN) return false;
      const t = jetzt();
      if (phaseAn(t) !== STOPWATCH_PHASES.RUNNING) return false;
      if (cube === null || typeof cube !== 'object') return false;
      if (!isSolved(cube)) return false;
      ende = t;
      return true;
    },

    /**
     * Beendet den Versuch von Hand.
     *
     * **Allein für den Weg über den eigenen Würfel.** Am Bildschirm greift er
     * nicht; sonst hielte der Anwender die Uhr an, ohne gelöst zu haben.
     */
    finish() {
      if (modus !== TIMING_MODES.OWN_CUBE) return false;
      const t = jetzt();
      if (phaseAn(t) !== STOPWATCH_PHASES.RUNNING) return false;
      ende = t;
      return true;
    },

    /**
     * Bricht den Versuch ab und geht auf «bereit» zurück.
     *
     * **Ein Abbruch liefert kein Ergebnis.** Er ist gebaut, weil der Anwender
     * sonst in einem Versuch feststeckt, den er nicht mehr will; das Verwerfen
     * eines bereits **abgelegten** Versuchs ist etwas anderes und steht als AK5
     * in S-0049.
     */
    abort() {
      if (beginn === null) return false;
      raeumeAuf();
      return true;
    },

    /**
     * Die Auskunft über den laufenden Versuch.
     *
     * `remaining` ist die verbleibende Inspektionszeit und außerhalb der
     * Inspektion null. `duration` ist die verstrichene Messzeit; sie wächst mit
     * der Uhr und steht nach dem Ende fest.
     */
    status() {
      const t = jetzt();
      const phase = phaseAn(t);
      return {
        phase,
        mode: modus,
        remaining: phase === STOPWATCH_PHASES.INSPECTION ? messbeginn() - t : 0,
        duration: dauerAn(t),
      };
    },

    /**
     * Das Ergebnis eines abgeschlossenen Versuchs, oder `null`.
     *
     * **Die Verwürfelung gehört nicht dazu.** Kein Kriterium von S-0029 und
     * keines von S-0049 fordert sie, und ein Feld auf Vorrat wäre eine Fassung
     * des abgelegten Datensatzes, die niemand liest.
     *
     * **Dieses Modul liefert das Ergebnis ab und behält es nicht.** Was damit
     * geschieht, entscheidet 3E-0050; ein Versuch, der hier läge, wäre eine
     * zweite Ablage neben jener.
     */
    result() {
      if (ende === null) return null;
      return { mode: modus, duration: ende - messbeginn(), at: stempel };
    },
  };
}
