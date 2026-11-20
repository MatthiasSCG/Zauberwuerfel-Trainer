// Der Katalog der Einstellungen, als Daten und nicht als Programmablauf.
//
// Jeder Eintrag ist im Einstellungs-Katalog der Konzeptphase hergeleitet und
// dort begründet. Weil er hier als Datenwert steht, lässt sich maschinell
// prüfen, dass Katalog und Umsetzung übereinstimmen, in beide Richtungen.
//
// **Seit 4T-0149 ist der Katalog vollständig umgesetzt.** Die Inspektionszeit
// und der Ton standen seit dem 2026-08-13 zurück, weil ihre Wirkung erst mit
// der Zeitnahme entsteht und eine Einstellung ohne Wirkung S-0030, AK2
// verletzt; beide sind am 2026-09-03 nachgezogen worden, jene mit 4T-0148 und
// dieser hier.
//
// **Die Tastenbelegung ist am 2026-08-13 aus dem Katalog gestrichen worden.**
// Ihre Begründung, die Zugtasten lägen für eine Hand verdreht, trifft auf die
// sechs Buchstaben der Notation nicht zu: Sie sind über die Tastatur verteilt
// und werden mit beiden Händen getippt. Damit hatte die Einstellung keinen
// Gegenstand. Begründet im Einstellungs-Katalog, Abschnitt 2.
//
// Dieses Modul verwendet keinen globalen Namen. Vorgaben, die von der
// Umgebung abhängen, sind Funktionen über eine hereingereichte Umgebung.

/**
 * Fassung des Datensatzes. Wird bei jeder Änderung an seiner Gestalt erhöht.
 *
 * **2 seit 4T-0118:** Der Fortschritt trägt je Stufe mit Fallmenge die Menge
 * der gelungenen Fälle. Ein Stand der Fassung 1 wird beim Öffnen ergänzt, ein
 * Stand einer höheren Fassung wird gelesen, aber nicht überschrieben; die
 * Begründung dieser Trennung steht in `einstellungen.js`.
 *
 * **3 seit 4T-0127:** Die übersprungenen Stellen und die zuletzt bearbeitete
 * dürfen eine Stufe nennen. Das Erhöhen gilt unabhängig davon, wie klein die
 * Änderung an der Gestalt aussieht: Schreibsperre und Abweisung aus 4T-0118
 * greifen allein über diese Zahl, und ohne sie beschnitte die Fassung 1.28.0
 * einen künftigen Stand stillschweigend. Ein Stand der Fassung 2 trägt die
 * neuen Bezeichner nicht und verliert dadurch nichts.
 *
 * **4 seit 4T-0134:** Der Fortschritt trägt unter `messwerte` je Übungsform
 * und Fall die Versuche und die Fehlversuche. Ein Stand der Fassung 3 trägt
 * das Feld nicht und bekommt leere Messwerte; er verliert dabei nichts.
 *
 * **5 seit 4T-0148:** Die Einstellungen tragen die Dauer der Inspektionszeit,
 * und seit 4T-0149 am selben Tag auch den Ton. Ein Stand der Fassung 4 kennt
 * beide nicht und bekommt ihre Vorgaben, ohne dabei etwas zu verlieren. **Der
 * Ton hat die Zahl nicht noch einmal erhöht**, wie es dieser Absatz seit
 * 4T-0148 zusagt: Zwei Einstellungen, die in demselben Epic entstehen, sind ein
 * Fall für eine Fassung, und eine Zwischenfassung, die nie ausgeliefert worden
 * ist, beschriebe einen Stand, den es nirgends gibt.
 *
 * **6 seit 4T-0150:** Der Datensatz trägt neben Einstellungen und Fortschritt
 * ein drittes Feld, `zeiten`, den Zeitverlauf je Weg. **Neben dem Fortschritt
 * und nicht darin**, weil `writeProgress` allein schreibt, was es kennt, und
 * ein fremdes Feld dort beim nächsten Sichern des Pfades verloren wäre. Ein
 * Stand der Fassung 5 trägt das Feld nicht und bekommt den leeren Verlauf, ohne
 * dabei etwas zu verlieren.
 *
 * **7 seit 4T-0170:** Der Fortschritt trägt unter `fassungen` je Stufe die
 * gewählte Fassung des Fallbestands. **Im Fortschritt und nicht hier**,
 * entschieden vom Product Owner am 2026-09-04: Die Wahl gehört zu einer
 * einzelnen Stufe und nicht zur Person, und die Bedienung dafür sitzt aus
 * demselben Grund beim Lernstoff. Ein Eintrag in diesem Katalog bedeutete vier
 * Einträge, von denen zwei heute keinen Gegenstand haben. Ein Stand der Fassung
 * 6 kennt das Feld nicht und übt jede Stufe in der reduzierten Fassung; er
 * verliert dabei nichts.
 */
export const FASSUNG = 7;

/** Schlüssel im Browserspeicher. */
export const SCHLUESSEL = 'zauberwuerfel-trainer';

/**
 * Die acht Einträge in der Reihenfolge des Katalogs.
 *
 * Sie sind seit 4T-0149 vollzählig; bis zum 2026-09-03 fehlten die letzten
 * beiden.
 *
 * `vorgabe` ist entweder ein fester Wert oder eine Funktion über die
 * Umgebung. Die Umgebung trägt `sprache` (bereits ermittelt) und
 * `wenigerBewegung` (Systemvorgabe für reduzierte Bewegung).
 */
export const KATALOG = [
  {
    name: 'sprache',
    werte: ['de', 'en'],
    // Die Zuordnung der Browserangaben zu einer Sprache steht in `i18n` und
    // wird von `app` hereingereicht. Sie hier zu wiederholen wäre die
    // zweite Wahrheit über dieselbe Frage; eine Abhängigkeit auf `i18n`
    // verbietet der Modulschnitt der Architektur.
    vorgabe: (umgebung) => umgebung?.sprache ?? 'en',
    wirkt: 'sofort',
    herkunft: 'S-0033, S-0034',
  },
  {
    name: 'palette',
    werte: ['kanonisch', 'alternativ'],
    vorgabe: 'kanonisch',
    wirkt: 'sofort',
    herkunft: 'S-0031',
  },
  {
    name: 'kennzeichnung',
    werte: ['aus', 'an'],
    vorgabe: 'aus',
    // Die Form der Kennzeichnung ist in 4T-0030 zu entscheiden, das
    // Design-Konzept lässt sie in Abschnitt 9 ausdrücklich offen. Bis dahin
    // wird der Wert geführt und abgelegt, aber nicht gezeigt.
    wirkt: '4T-0030',
    herkunft: 'S-0031',
  },
  {
    name: 'bewegung',
    werte: ['aus', 'langsam', 'mittel', 'schnell'],
    // Die Systemvorgabe für reduzierte Bewegung wird beim ersten Start von
    // sich aus beachtet. Wer sie gesetzt hat, erwartet, dass Programme sich
    // daran halten, ohne dass er es jedem einzeln beibringen muss.
    vorgabe: (umgebung) => (umgebung?.wenigerBewegung ? 'aus' : 'mittel'),
    wirkt: 'sofort',
    herkunft: 'S-0005, S-0032, S-0026',
  },
  {
    name: 'ansicht',
    werte: ['raeumlich', 'netz'],
    vorgabe: 'raeumlich',
    wirkt: '4T-0030',
    herkunft: 'F-0003',
  },
  {
    name: 'schriftgroesse',
    werte: ['klein', 'normal', 'gross', 'sehrGross'],
    vorgabe: 'normal',
    wirkt: 'sofort',
    herkunft: 'F-0012',
  },
  {
    name: 'inspektion',
    // **Katalogwerte und keine Zahlen.** Ein fremder Wert im Browserspeicher
    // fällt beim Laden auf die Vorgabe zurück, und das leistet `istGueltig`
    // allein über eine feste Werteliste; eine Dauer als Zahl ließe jede Zahl zu.
    // **Die Zuordnung zur Millisekundenzahl steht in der Verdrahtung**, dort,
    // wo auch die beiden Uhren der Zeitnahme entstehen.
    //
    // Die Namen tragen die Zahl und nicht ihre Wirkung: `kurz` und `lang`
    // verschwiegen, welche Dauer gemeint ist, und führten damit eine zweite
    // Wahrheit neben dem Katalog ein. Das führende `s` steht, weil ein
    // Bezeichner mit führender Ziffer in beiden Sprachbäumen als einziger in
    // Anführungszeichen stünde.
    werte: ['aus', 's15', 's30'],
    vorgabe: 's15',
    // **`sofort`, obwohl die Dauer erst beim nächsten Durchgang greift.**
    // Entschieden vom Product Owner am 2026-09-03: Der Vermerk daneben meldet
    // eine Einstellung, deren Ziel noch gar nicht gebaut ist; ihn hier zu
    // setzen nähme ihm seine Warnkraft für eine Selbstverständlichkeit. Ein
    // laufender Versuch, dessen Frist sich mitten im Ansehen änderte, wäre
    // ohnehin keine Messung mehr.
    wirkt: 'sofort',
    herkunft: 'S-0029',
  },
  {
    name: 'ton',
    werte: ['aus', 'an'],
    // **Der einzige Eintrag mit der Vorgabe «aus».** Abschnitt 3 des
    // Einstellungs-Katalogs begründet es: Ein Programm, das ungefragt Geräusche
    // macht, wird stummgeschaltet und nicht bedient.
    vorgabe: 'aus',
    wirkt: 'sofort',
    herkunft: 'F-0012',
  },
];

/** Die Vorgabewerte aller Einträge für eine Umgebung. */
export function vorgaben(umgebung = {}) {
  const werte = {};
  for (const eintrag of KATALOG) {
    werte[eintrag.name] =
      typeof eintrag.vorgabe === 'function' ? eintrag.vorgabe(umgebung) : eintrag.vorgabe;
  }
  return werte;
}

/** Gehört der Wert zum Wertebereich des Eintrags? */
export function istGueltig(name, wert) {
  const eintrag = KATALOG.find((e) => e.name === name);
  return Boolean(eintrag) && eintrag.werte.includes(wert);
}
