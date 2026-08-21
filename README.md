# Zauberwuerfel-Trainer

Interaktives Lernprogramm für den Zauberwürfel (3×3×3). Läuft vollständig im
Browser, ohne Installation, ohne Netzverbindung, ohne Konto.

> **Stand:** Ausbaustufe 1 läuft.
> **[Programm öffnen](https://matthiasscg.github.io/Zauberwuerfel-Trainer/)**

## Was das Programm kann

**Lernen.** Ein geführter Pfad vom ersten Kontakt mit der Notation bis zum
selbstständig gelösten Würfel. Gedacht für erwachsene Einsteiger ohne
Vorkenntnisse, ohne vorausgesetztes Wissen und ohne bloßes Auswendiglernen
von Zugfolgen.

**Lösen.** Das Programm nimmt den Zustand eines verdrehten Würfels auf und zeigt
den Weg zurück in den gelösten Zustand. Wahlweise als Lernlösung, bei der jeder
Schritt benannt und begründet wird, oder als Kurzlösung mit möglichst wenigen
Zügen.

Übertragen wird der Zustand von Hand über das flache Würfelnetz, Feldchen für
Feldchen. Die Erkennung aus Fotos der sechs Seiten kommt in einer späteren
Ausbaustufe dazu.

## Ausbaustufen

| Fassung | Inhalt |
| ------- | ------------------------------------------------- |
| 1       | Anfängerverfahren Schicht für Schicht, Löser, dreidimensionale Ansicht, Einstellungen, Eingabe über das Würfelnetz |
| 2       | CFOP, also Cross, F2L, OLL, PLL, dazu Inspektionszeit und Stoppuhr |
| 3       | Roux und ZZ, dazu ein Vergleich der Systeme, zuletzt die Zustandserfassung aus Fotos |

## Technik

Eine einzelne HTML-Datei ohne externe Abhängigkeiten. Keine Fremdbibliothek,
kein Aufruf nach außen, keine Datenübertragung. Fortschritt und Einstellungen
bleiben im Browser und lassen sich als Datei sichern.

Der Quellcode liegt in `src/` in seiner modularen Entwicklungsform. Die
ausgelieferte Einzeldatei entsteht daraus durch einen Zusammenführungsschritt
und steht hier als [index.html](index.html). Wer sie herunterlädt, kann sie
ohne Netzverbindung im Browser öffnen; sie lädt nichts nach.

Die Lösungssuche läuft in einem nebenläufigen Strang, damit die Oberfläche
währenddessen bedienbar bleibt. Wo der Browser das nicht zulässt, rechnet das
Programm stückweise im Hauptstrang weiter.

## Lizenz

MIT, siehe [LICENSE](LICENSE). Der Code darf genutzt, verändert, weitergegeben
und auch kommerziell verwendet werden, solange der Lizenztext mit dem
Urheberhinweis erhalten bleibt. Eine Gewährleistung ist ausgeschlossen.
