// Die beiden Signale der Zeitnahme als Klang.
//
// ## Zur Laufzeit erzeugt und nicht eingebettet
//
// Abschnitt 4 des Einstellungs-Katalogs legt das fest, und die bindende Regel
// aus `CLAUDE.md` verlangt es ohnehin: **Eine Tondatei kostet Platz in einer
// Datei, die klein bleiben soll, und wirft Lizenzfragen auf.** Zwei kurze Töne
// sind ein Dutzend Zeilen; als eingebettete Daten wären sie ein Vielfaches der
// ganzen Anwendung.
//
// ## Der Klangerzeuger wird hereingereicht
//
// Dieselbe Bauform wie die beiden Uhren in `timing/stopwatch.js` und die Ablage
// in `settings/einstellungen.js`, und hier ist sie die Bedingung dafür, dass
// überhaupt etwas prüfbar ist: Ein Modul, das sich seinen Klangkontext selbst
// nimmt, ließe sich nur mit Ohren prüfen. So liest die Prüfung ab, welche
// Frequenz mit welcher Dauer angefordert wurde.
//
// ## Er entsteht erst beim ersten Signal
//
// Browser weisen einen Klangkontext ab, der vor der ersten Nutzergeste entsteht,
// oder halten ihn angehalten; ein Programm, das beim Laden einen anlegt, meldet
// das in der Konsole und bleibt trotzdem stumm. **Beide Signale folgen ohnehin
// auf einen Griff**, und deshalb kostet das Warten nichts.
//
// Dieses Modul kennt weder die Zeitnahme noch die Einstellungen. Welcher
// Wechsel welches Signal auslöst, rechnet `view/zeitnahme.js`; ob überhaupt
// geklungen wird, entscheidet die Verdrahtung an Eintrag 8 des Katalogs.

/**
 * Die Klangfolge je Signal, als Daten.
 *
 * `hertz` ist die Tonhöhe, `dauer` die Länge in Millisekunden. Entschieden vom
 * Product Owner am 2026-09-03: **Der Start ist ein Punkt, das Lösen ein
 * Abschluss.** Ein einzelner Ton gegen ein aufsteigendes Paar bildet genau das
 * ab und ist auch dann zu unterscheiden, wenn niemand hinsieht; dieselbe Folge
 * zweimal wäre im Lauf kaum auseinanderzuhalten, und eine dreitönige Melodie
 * würde beim zwanzigsten Durchgang lästig.
 */
export const KLAENGE = {
  start: [{ hertz: 880, dauer: 120 }],
  geloest: [
    { hertz: 660, dauer: 110 },
    { hertz: 990, dauer: 110 },
  ],
};

/** Pause zwischen zwei Tönen einer Folge, in Millisekunden. */
const PAUSE = 60;

/**
 * Die Lautstärke, deutlich unter der Vollaussteuerung.
 *
 * Ein Signal, das neben der Musik des Anwenders liegt, muss nicht lauter sein
 * als sie; es muss nur da sein. Voll ausgesteuert wäre es außerdem der lauteste
 * Laut, den das Gerät hervorbringt, und das für einen Hinweis.
 */
const LAUTSTAERKE = 0.15;

/**
 * Die Länge der Ein- und Ausblende, in Sekunden.
 *
 * **Ohne sie knackt es**, und zwar hörbar an beiden Enden: Ein Ton, der bei
 * voller Auslenkung beginnt, ist ein Sprung in der Wellenform, und der klingt
 * wie ein Defekt des Geräts. Zehn Millisekunden sind zu kurz, um die Länge des
 * Signals zu verändern, und lang genug, um den Sprung zu vermeiden.
 */
const BLENDE = 0.01;

/**
 * Erzeugt die Tonausgabe.
 *
 * `baueKontext()` liefert einen Klangkontext oder `null`, wenn das Gerät keinen
 * hergibt. Er wird höchstens einmal gerufen, und erst dann, wenn das erste
 * Signal fällig ist.
 */
export function erzeugeTon({ baueKontext } = {}) {
  let kontext = null;
  let versucht = false;

  return {
    /**
     * Spielt ein Signal und meldet, ob es geklungen hat.
     *
     * **Ein unbekanntes Signal ist kein Fehler, sondern still.** Anders als bei
     * einem unbekannten Weg in der Zeitnahme wird hier nicht geworfen: Ein Ton,
     * der ausbleibt, kostet den Anwender nichts, und ein Wurf mitten in der
     * Anzeige nähme ihm den laufenden Durchgang.
     */
    spiele(signal) {
      const folge = KLAENGE[signal];
      if (!folge) return false;
      if (!versucht) {
        versucht = true;
        kontext = typeof baueKontext === 'function' ? (baueKontext() ?? null) : null;
      }
      if (kontext === null) return false;

      let beginn = kontext.currentTime;
      for (const ton of folge) {
        const dauer = ton.dauer / 1000;
        const quelle = kontext.createOscillator();
        const regler = kontext.createGain();
        quelle.type = 'sine';
        quelle.frequency.value = ton.hertz;
        // Die Hüllkurve: leise beginnen, leise enden. Siehe `BLENDE`.
        regler.gain.setValueAtTime(0, beginn);
        regler.gain.linearRampToValueAtTime(LAUTSTAERKE, beginn + BLENDE);
        regler.gain.setValueAtTime(LAUTSTAERKE, beginn + dauer - BLENDE);
        regler.gain.linearRampToValueAtTime(0, beginn + dauer);
        quelle.connect(regler);
        regler.connect(kontext.destination);
        quelle.start(beginn);
        quelle.stop(beginn + dauer);
        beginn += dauer + PAUSE / 1000;
      }
      return true;
    },
  };
}
