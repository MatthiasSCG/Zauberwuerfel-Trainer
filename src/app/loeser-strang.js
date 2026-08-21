// Einstiegspunkt des nebenläufigen Strangs.
//
// Er besteht aus einem einzigen Aufruf, und das ist der ganze Zweck: Der
// Ablauf steht in `solver/runner.js` und kennt keinen globalen Namen, damit
// derselbe Quelltext im Hauptstrang, im nebenläufigen Strang und in der
// Prüfstrecke gegen eine Attrappe läuft. Wer ihm den wirklichen
// Geltungsbereich reicht, ist die Verdrahtung, und die steht in `app`.
//
// **Deshalb liegt die Datei hier und nicht bei `solver`.** Die
// ESLint-Konfiguration hält `src/solver/` frei von Browser- und
// Node-Eigenheiten; `self` wäre dort ein Verstoß, und er wäre berechtigt.
//
// **Was der Bau daraus macht, seit 4T-0078.** Die Auslieferung ist eine
// einzelne Datei, und in ihr gibt es keine zweite Adresse, die sich laden
// ließe. Diese Datei wird deshalb ein zweites Mal gebündelt und als Textblock
// in das Dokument gesetzt; `main.js` erzeugt daraus zur Laufzeit eine
// `blob:`-Adresse. Über den Entwicklungsserver bleibt es beim Weg über die
// Datei, die er als Modul ausliefert. **Läuft der Strang auf keinem der beiden
// Wege an, rechnet der Hauptstrang stückweise weiter**; dafür ist die
// Rückfallebene aus 4T-0021 gebaut.

import { serveWorker } from '../solver/runner.js';

serveWorker(self);
