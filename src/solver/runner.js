// Ausführung der beiden Löser, nebenläufig oder stückweise.
//
// Eine Oberfläche, die eine Sekunde lang auf nichts reagiert, wirkt
// abgestürzt, und der Anwender klickt erneut. Die Vorbereitung der Tabellen
// für die Kurzlösung dauert gemessen 468 ms. Das ist wenig, aber nicht nichts.
//
// ## Ein Ablauf, zwei Antriebe
//
// Eine Anfrage ist eine Folge von Schritten: bis zu sechs für die Vorbereitung
// der Tabellen, danach einer für die Suche. Diese Folge steht **einmal** in
// diesem Modul, als Generator `planWork`. Im nebenläufigen Strang wird sie in
// einem Zug durchgezogen, im Hauptstrang Schritt für Schritt mit einer
// Freigabe dazwischen.
//
// Damit können die beiden Wege nicht auseinanderlaufen. Sie unterscheiden sich
// im Antrieb, nicht im Ablauf. AK4 wird so durch die Bauart getragen und nicht
// durch Sorgfalt.
//
// ## Warum alles hereingereicht wird
//
// Dieses Modul verwendet keinen einzigen globalen Namen, und das ist hier
// keine Formalie: Derselbe Quelltext läuft im nebenläufigen Strang, wo es
// weder Fenster noch Dokument gibt. Strang, Freigabe und Uhr kommen deshalb
// als Umgebung von außen. Die Oberfläche reicht später die echten
// Entsprechungen herein, die Prüfstrecke Attrappen, und damit sind beide Wege
// und der Wechsel zwischen ihnen ohne Browser prüfbar.
//
// ## Gemessene Schrittdauern
//
// | Schritt | Dauer |
// | --- | ---: |
// | Zugtabellen erste Phase | 29 ms |
// | Abschätzung Drehung mal Lage | 91 ms |
// | Abschätzung Kippung mal Lage | 75 ms |
// | Zugtabellen zweite Phase | 161 ms |
// | Abschätzung Ecken mal Lage | 53 ms |
// | Abschätzung Kanten mal Lage | 59 ms |
// | Suche | Median 15 ms, Ausläufer bis 350 ms |
//
// **Die Suche wird bewusst nicht gestückelt.** Das hieße, die Tiefensuche in
// eine fortsetzbare Maschine mit eigenem Zustand umzubauen, und das steht in
// keinem Verhältnis zu einem Median von 15 Millisekunden. Im nebenläufigen
// Strang blockiert sie ohnehin nichts, und die Rückfallebene ist der seltene
// Fall.

import { solveBeginner } from './beginner.js';
import { prepareTablesStepwise, solveTwoPhase, tablesPrepared } from './twophase.js';

/** Die beiden Verfahren, die der Läufer bedient. */
export const BEGINNER = 'beginner';
export const TWO_PHASE = 'twoPhase';

/** Die beiden Wege, auf denen gerechnet werden kann. */
export const WORKER = 'worker';
export const MAIN = 'main';

/**
 * Frist, in der sich ein frisch gestarteter Strang melden muss.
 *
 * Drei Sekunden sind großzügig für eine Antwort, die im Erfolgsfall nach
 * wenigen Millisekunden kommt. Die Frist ist keine Zeitvorgabe, sondern der
 * Notausgang für den Fall, dass der Browser den Strang stillschweigend nicht
 * startet, statt einen Fehler zu melden.
 */
export const READY_TIMEOUT = 3000;

// Nachrichtenarten zwischen Läufer und Strang.
const PING = 'gruss';
const PONG = 'antwort';
const REQUEST = 'auftrag';
const PROGRESS = 'fortschritt';
const DONE = 'fertig';
const FAILED = 'fehler';

/**
 * Der Ablauf einer Anfrage als Folge von Schritten.
 *
 * Abgegeben wird je Schritt ein Fortschritt, zurückgegeben am Ende das
 * Ergebnis des Lösers. Die Vorbereitung entfällt für die Lernlösung ganz und
 * für die Kurzlösung ab dem zweiten Aufruf, weil die Tabellen dann bestehen.
 */
export function* planWork(kind, cube, options) {
  if (kind === TWO_PHASE && !tablesPrepared()) {
    for (const part of prepareTablesStepwise()) {
      yield { stage: 'preparation', part };
    }
  }
  yield { stage: 'search', kind };
  if (kind === BEGINNER) return solveBeginner(cube);
  return solveTwoPhase(cube, options);
}

/**
 * Welcher Weg kommt in dieser Umgebung in Frage?
 *
 * Entschieden wird allein nach dem, was die Umgebung anbietet. Ob der Strang
 * dann wirklich anläuft, zeigt sich erst beim Versuch; scheitert er, wechselt
 * der Läufer dauerhaft in den Hauptstrang.
 *
 * Verlangt werden alle vier Angaben zusammen. Ein Strang ohne Uhr wäre ein
 * Strang ohne Frist, und eine ausbleibende Antwort ließe den Läufer für immer
 * warten.
 */
export function chooseMode(environment) {
  if (!environment) return MAIN;
  const complete =
    typeof environment.startWorker === 'function' &&
    typeof environment.setTimer === 'function' &&
    typeof environment.clearTimer === 'function' &&
    typeof environment.workerSource === 'string' &&
    environment.workerSource.length > 0;
  return complete ? WORKER : MAIN;
}

/**
 * Bedient die Gegenseite im nebenläufigen Strang.
 *
 * Der Geltungsbereich wird übergeben und nicht als globaler Name verwendet,
 * damit dieselbe Funktion in der Prüfstrecke gegen eine Attrappe läuft. Der
 * eigentliche Einstiegspunkt des Bündels entsteht mit dem Bau in 2A-0011 und
 * besteht nur aus dem Aufruf dieser Funktion.
 */
export function serveWorker(scope) {
  scope.onmessage = (event) => {
    const message = event && event.data;
    if (!message) return;

    if (message.art === PING) {
      scope.postMessage({ art: PONG });
      return;
    }
    if (message.art !== REQUEST) return;

    try {
      const steps = planWork(message.kind, message.cube, message.options);
      let step = steps.next();
      while (!step.done) {
        scope.postMessage({ art: PROGRESS, id: message.id, fortschritt: step.value });
        step = steps.next();
      }
      scope.postMessage({ art: DONE, id: message.id, ergebnis: step.value });
    } catch (error) {
      scope.postMessage({ art: FAILED, id: message.id, meldung: error.message });
    }
  };
}

/**
 * Startet den Strang und wartet auf seinen Gruß.
 *
 * Liefert den Strang oder `null`. Der Gruß ist nötig, weil ein Browser den
 * Start nicht immer als Fehler meldet: Im Spike 4T-0011 war die
 * Herkunftsprüfung genau dieser Fall. Wer nur auf eine Ausnahme wartet,
 * wartet unter Umständen vergeblich.
 */
function connect(environment) {
  return new Promise((resolve) => {
    let worker = null;
    try {
      worker = environment.startWorker(environment.workerSource);
    } catch {
      resolve(null);
      return;
    }
    if (!worker) {
      resolve(null);
      return;
    }

    let timer = null;
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      if (timer !== null) environment.clearTimer(timer);
      if (!value && typeof worker.terminate === 'function') worker.terminate();
      resolve(value);
    };

    worker.onerror = () => finish(null);
    worker.onmessage = (event) => {
      if (event && event.data && event.data.art === PONG) finish(worker);
    };

    const timeout = environment.readyTimeout ?? READY_TIMEOUT;
    timer = environment.setTimer(() => finish(null), timeout);

    try {
      worker.postMessage({ art: PING });
    } catch {
      finish(null);
    }
  });
}

/** Treibt den Ablauf im Hauptstrang, Schritt für Schritt. */
function runInMain(environment, kind, cube, options, report, run) {
  return new Promise((resolve) => {
    const steps = planWork(kind, cube, options);
    const defer = environment.defer ?? ((callback) => Promise.resolve().then(callback));

    const step = () => {
      if (run.cancelled) {
        resolve({ ok: false, grund: 'abgebrochen' });
        return;
      }
      let outcome;
      try {
        outcome = steps.next();
      } catch (error) {
        // Ein Fehler wird zum Befund und nicht zur Ausnahme. Über die Grenze
        // zum Strang käme er ohnehin nur als Text an, und beide Wege sollen
        // sich gleich verhalten.
        resolve({ ok: false, grund: 'fehler', meldung: error.message });
        return;
      }
      if (outcome.done) {
        resolve({ ok: true, ergebnis: outcome.value });
        return;
      }
      report(outcome.value);
      defer(step);
    };

    defer(step);
  });
}

/** Treibt den Ablauf im nebenläufigen Strang. */
function runInWorker(worker, id, kind, cube, options, report, run) {
  return new Promise((resolve) => {
    const finish = (value) => {
      worker.onmessage = null;
      worker.onerror = null;
      run.onCancel = null;
      resolve(value);
    };

    // Ein Abbruch beendet den Strang **nicht**. Er würde die Tabellen
    // mitnehmen, und die nächste Anfrage müsste sie erneut erzeugen. Der
    // Strang rechnet die angefangene Anfrage still zu Ende, seine Antwort
    // fällt am Vergleich der Nummer durch, und die nächste Anfrage reiht sich
    // dahinter ein.
    run.onCancel = () => finish({ ok: false, grund: 'abgebrochen' });

    worker.onmessage = (event) => {
      const message = event && event.data;
      if (!message || message.id !== id) return;
      if (message.art === PROGRESS) {
        report(message.fortschritt);
        return;
      }
      if (message.art === DONE) {
        finish({ ok: true, ergebnis: message.ergebnis });
        return;
      }
      if (message.art === FAILED) {
        finish({ ok: false, grund: 'fehler', meldung: message.meldung });
      }
    };
    worker.onerror = () =>
      finish({ ok: false, grund: 'fehler', meldung: 'Der nebenläufige Strang ist ausgefallen' });

    worker.postMessage({ art: REQUEST, id, kind, cube, options });
  });
}

/**
 * Erzeugt einen Läufer für die übergebene Umgebung.
 *
 * `solve(verfahren, zustand, optionen)` liefert `{ promise, cancel }`. Das
 * Versprechen erfüllt sich mit `{ ok: true, ergebnis }`, mit
 * `{ ok: false, grund: 'abgebrochen' }` oder mit
 * `{ ok: false, grund: 'fehler', meldung }`. Ein Abbruch ist ein erwarteter
 * Ausgang und deshalb ein Befund, keine Ausnahme.
 *
 * `optionen.onProgress` bekommt je Schritt `{ stage, part }` beziehungsweise
 * `{ stage: 'search', kind }`. Die übrigen Angaben reicht der Läufer an den
 * Löser weiter.
 *
 * **Ein Vorgang zur Zeit.** Eine zweite Anfrage bei laufendem Vorgang wird
 * abgewiesen. Sie einzureihen würde die Oberfläche über den Zustand täuschen,
 * und die erste stillschweigend zu verwerfen wäre noch schlechter. Wer
 * wechseln will, bricht ab.
 */
export function createRunner(environment = {}) {
  const preferred = chooseMode(environment);
  let connection = null;
  let worker = null;
  let effective = preferred;
  let busy = false;
  let counter = 0;

  const ensureWorker = () => {
    if (preferred !== WORKER) return Promise.resolve(null);
    if (!connection) {
      connection = connect(environment).then((started) => {
        worker = started;
        effective = started ? WORKER : MAIN;
        return started;
      });
    }
    return connection;
  };

  const solve = (kind, cube, options = {}) => {
    if (kind !== BEGINNER && kind !== TWO_PHASE) {
      throw new RangeError(`Unbekanntes Verfahren: ${kind}`);
    }
    if (busy) throw new Error('Es läuft bereits ein Vorgang');
    busy = true;

    const { onProgress, ...solverOptions } = options;
    const id = ++counter;
    const run = { cancelled: false, onCancel: null };
    const report = (progress) => {
      if (!run.cancelled && onProgress) onProgress(progress);
    };

    const promise = ensureWorker()
      .then((started) => {
        if (run.cancelled) return { ok: false, grund: 'abgebrochen' };
        return started
          ? runInWorker(started, id, kind, cube, solverOptions, report, run)
          : runInMain(environment, kind, cube, solverOptions, report, run);
      })
      .then((result) => {
        busy = false;
        return result;
      });

    const cancel = () => {
      if (run.cancelled) return;
      run.cancelled = true;
      if (run.onCancel) run.onCancel();
    };

    return { promise, cancel };
  };

  /** Der tatsächlich verwendete Weg. Vor der ersten Anfrage der erwartete. */
  const mode = () => effective;

  /** Beendet den Strang. Für den Fall, dass die Anwendung schließt. */
  const dispose = () => {
    if (worker && typeof worker.terminate === 'function') worker.terminate();
    worker = null;
    connection = null;
    effective = preferred;
  };

  return { solve, mode, dispose };
}
