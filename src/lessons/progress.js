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
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine
// globalen Namen.

import {
  LESSONS,
  dependentsOf,
  isCheckable,
  isLesson,
  lessonFor,
  reachesGoal,
  requiredApplications,
} from './catalog.js';

/** Gründe, aus denen eine gemeldete Anwendung nicht zählt. */
export const REJECTED = {
  UNKNOWN: 'unknown',
  LOCKED: 'locked',
  NOT_RUNNING: 'notRunning',
  GOAL_MISSED: 'goalMissed',
  CHECKABLE: 'checkable',
  NOT_CHECKABLE: 'notCheckable',
};

const leererFortschritt = () => ({
  completed: new Set(),
  skipped: new Set(),
  last: null,
  applications: new Map(),
});

/** Nur die Bezeichner behalten, die zu einer Lektion gehören. */
function nurBekannte(wert) {
  if (!Array.isArray(wert)) return [];
  return wert.filter((eintrag) => typeof eintrag === 'string' && isLesson(eintrag));
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
      if (!isLesson(key) || typeof zahl !== 'number' || !Number.isFinite(zahl)) continue;
      // Geklemmt, damit ein von Hand erhöhter Wert nicht mehr behauptet, als
      // die Lektion verlangt, und ein negativer keinen Zähler unter null zieht.
      stand.applications.set(
        key,
        Math.min(Math.max(Math.floor(zahl), 0), requiredApplications(key)),
      );
    }
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

  stand.last = typeof roh.zuletzt === 'string' && isLesson(roh.zuletzt) ? roh.zuletzt : null;
  return stand;
}

/** Schreibt den Fortschritt in die Form, die abgelegt wird. */
export function writeProgress(stand) {
  const anwendungen = {};
  for (const [key, zahl] of stand.applications) {
    if (zahl > 0) anwendungen[key] = zahl;
  }
  return {
    abgeschlossen: [...stand.completed],
    uebersprungen: [...stand.skipped],
    zuletzt: stand.last,
    anwendungen,
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
  const stand = readProgress(load ? load() : null);

  // Die laufende Übung ist flüchtig und wird nicht abgelegt. Ohne sie zählte
  // derselbe erfüllte Würfelzustand bei jeder erneuten Prüfung wieder, und drei
  // verlangte Anwendungen wären mit einer einzigen gelösten Lage erfüllt.
  let running = null;

  const sichere = () => {
    if (save) save(writeProgress(stand));
  };

  const isCompleted = (key) => stand.completed.has(key);
  const isSkipped = (key) => stand.skipped.has(key);

  // Eine abgeschlossene Lektion hat ihre Anwendungen hinter sich; der Zähler
  // wird deshalb abgeleitet und nicht gehalten.
  const applicationsOf = (key) =>
    isCompleted(key) ? requiredApplications(key) : (stand.applications.get(key) ?? 0);

  /**
   * Ist die Lektion erreichbar?
   *
   * Die erste Lektion ist es immer, jede weitere, sobald ihre Vorbedingung
   * abgeschlossen **oder** übersprungen ist. Beides gibt frei, nur das erste
   * gilt als abgeschlossen.
   */
  const isUnlocked = (key) => {
    const lesson = lessonFor(key);
    if (lesson === null) return false;
    if (lesson.requires === null) return true;
    return isCompleted(lesson.requires) || isSkipped(lesson.requires);
  };

  const abgelehnt = (key, reason) => ({
    counted: false,
    reason,
    completed: isCompleted(key),
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
    if (!isCompleted(key)) {
      const verlangt = requiredApplications(key);
      const jetzt = (stand.applications.get(key) ?? 0) + 1;
      if (jetzt >= verlangt) {
        stand.applications.delete(key);
        stand.completed.add(key);
        stand.skipped.delete(key);
        const naechste = LESSONS.find((lesson) => lesson.requires === key);
        freigegeben = naechste ? naechste.key : null;
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
      completed: isCompleted(key),
      applications: applicationsOf(key),
      unlocked: freigegeben,
    };
  };

  return {
    isUnlocked,
    isCompleted,
    isSkipped,
    applicationsOf,

    /** Die Lektionen mit ihrem Stand, in der Reihenfolge des Pfades. */
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
     * Wo weiterzumachen ist.
     *
     * `stored` unterscheidet den abgelegten Stand vom Vorschlag beim ersten
     * Start. Nur im ersten Fall darf die Oberfläche anbieten, an der zuletzt
     * bearbeiteten Lektion weiterzumachen; im zweiten gäbe es nichts
     * fortzusetzen.
     */
    resume: () => {
      if (stand.last !== null) return { key: stand.last, stored: true };
      const offen = LESSONS.find((lesson) => !isCompleted(lesson.key) && isUnlocked(lesson.key));
      return { key: offen ? offen.key : LESSONS[0].key, stored: false };
    },

    /**
     * Beginnt eine Übung an dieser Lektion.
     *
     * Setzt zugleich die zuletzt bearbeitete Lektion, denn genau das ist sie
     * von diesem Augenblick an.
     */
    begin: (key) => {
      if (!isLesson(key)) return { ok: false, reason: REJECTED.UNKNOWN };
      if (!isUnlocked(key)) return { ok: false, reason: REJECTED.LOCKED };
      running = key;
      stand.last = key;
      sichere();
      return { ok: true, reason: null, practice: lessonFor(key).practice };
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
     */
    abort: () => {
      running = null;
    },

    /**
     * Prüft den Zustand des Übungswürfels gegen das Ziel der Lektion.
     *
     * Der einzige Weg, eine prüfbare Lektion voranzubringen. Was hier gezählt
     * wird, hat das Programm selbst gesehen.
     */
    check: (key, state) => {
      if (!isLesson(key)) return abgelehnt(key, REJECTED.UNKNOWN);
      if (!isCheckable(key)) return abgelehnt(key, REJECTED.NOT_CHECKABLE);
      if (!isUnlocked(key)) return abgelehnt(key, REJECTED.LOCKED);
      if (running !== key) return abgelehnt(key, REJECTED.NOT_RUNNING);
      if (!reachesGoal(key, state)) return abgelehnt(key, REJECTED.GOAL_MISSED);
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
      if (!isLesson(key)) return abgelehnt(key, REJECTED.UNKNOWN);
      if (isCheckable(key)) return abgelehnt(key, REJECTED.CHECKABLE);
      if (!isUnlocked(key)) return abgelehnt(key, REJECTED.LOCKED);
      if (running !== key) return abgelehnt(key, REJECTED.NOT_RUNNING);
      return zaehle(key);
    },

    /**
     * Überspringt eine Lektion.
     *
     * Sie wird dadurch nicht abgeschlossen, gibt aber die folgende frei. Der
     * Hinweis, worauf sie aufbaut, entsteht aus der zurückgelieferten Liste;
     * die Worte dazu stehen in `i18n`.
     */
    skip: (key) => {
      if (!isLesson(key)) return { ok: false, reason: REJECTED.UNKNOWN };
      if (!isUnlocked(key)) return { ok: false, reason: REJECTED.LOCKED };
      if (isCompleted(key)) return { ok: false, reason: null, affects: [] };
      stand.skipped.add(key);
      const naechste = LESSONS.find((lesson) => lesson.requires === key);
      if (naechste) stand.last = naechste.key;
      running = null;
      sichere();
      return { ok: true, reason: null, affects: dependentsOf(key) };
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
      stand.last = null;
      running = null;
      sichere();
    },

    /** Der Fortschritt in der Form, die abgelegt wird. Für Sicherung und Prüfung. */
    snapshot: () => writeProgress(stand),
  };
}
