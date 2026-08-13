# Zauberwuerfel-Trainer

Interaktives Lernprogramm für den Zauberwürfel (3×3×3). Läuft vollständig im
Browser, ohne Installation, ohne Netzverbindung, ohne Konto.

> **Stand:** in Entwicklung. Es gibt noch keine lauffähige Fassung.

## Was das Programm können wird

**Lernen.** Ein geführter Pfad vom ersten Kontakt mit der Notation bis zum
selbstständig gelösten Würfel. Gedacht für erwachsene Einsteiger ohne
Vorkenntnisse, ohne vorausgesetztes Wissen und ohne bloßes Auswendiglernen
von Zugfolgen.

**Lösen.** Aus Fotos der sechs Seiten erkennt das Programm den Zustand des
Würfels und zeigt den Weg zurück in den gelösten Zustand. Wahlweise als
Lernlösung, bei der jeder Schritt benannt und begründet wird, oder als
Kurzlösung mit möglichst wenigen Zügen.

## Ausbaustufen

| Fassung | Inhalt |
| ------- | ------------------------------------------------- |
| 1       | Anfängerverfahren Schicht für Schicht, Löser, dreidimensionale Ansicht |
| 2       | CFOP, also Cross, F2L, OLL, PLL                    |
| 3       | Roux und ZZ, dazu ein Vergleich der Systeme        |

## Technik

Eine einzelne HTML-Datei ohne externe Abhängigkeiten. Keine Fremdbibliothek,
kein Aufruf nach außen, keine Datenübertragung. Fortschritt und Einstellungen
bleiben im Browser und lassen sich als Datei sichern.

Der Quellcode liegt in `src/` in seiner modularen Entwicklungsform. Die
ausgelieferte Einzeldatei entsteht daraus durch einen Zusammenführungsschritt.

## Lizenz

MIT, siehe [LICENSE](LICENSE). Der Code darf genutzt, verändert, weitergegeben
und auch kommerziell verwendet werden, solange der Lizenztext mit dem
Urheberhinweis erhalten bleibt. Eine Gewährleistung ist ausgeschlossen.
