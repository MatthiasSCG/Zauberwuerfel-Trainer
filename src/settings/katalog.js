// Der Katalog der Einstellungen, als Daten und nicht als Programmablauf.
//
// Jeder Eintrag ist im Einstellungs-Katalog der Konzeptphase hergeleitet und
// dort begründet. Weil er hier als Datenwert steht, lässt sich maschinell
// prüfen, dass Katalog und Umsetzung übereinstimmen, in beide Richtungen.
//
// **Zwei Einträge des Katalogs fehlen absichtlich.** Inspektionszeit und Ton
// hätten zum jetzigen Zeitpunkt keine Wirkung, weil die Zeitnahme aus S-0029
// noch nicht gebaut ist, und eine Einstellung ohne Wirkung verletzt S-0030,
// AK2. Entscheid des Product Owners vom 2026-08-13.
//
// **Die Tastenbelegung ist am 2026-08-13 aus dem Katalog gestrichen worden.**
// Ihre Begründung, die Zugtasten lägen für eine Hand verdreht, trifft auf die
// sechs Buchstaben der Notation nicht zu: Sie sind über die Tastatur verteilt
// und werden mit beiden Händen getippt. Damit hatte die Einstellung keinen
// Gegenstand. Begründet im Einstellungs-Katalog, Abschnitt 2.
//
// Dieses Modul verwendet keinen globalen Namen. Vorgaben, die von der
// Umgebung abhängen, sind Funktionen über eine hereingereichte Umgebung.

/** Fassung des Datensatzes. Wird bei jeder Änderung am Katalog erhöht. */
export const FASSUNG = 1;

/** Schlüssel im Browserspeicher. */
export const SCHLUESSEL = 'zauberwuerfel-trainer';

/**
 * Die sechs Einträge in der Reihenfolge des Katalogs.
 *
 * Der Katalog des Konzepts führt acht; die Inspektionszeit und der Ton stehen
 * seit dem 2026-08-13 zurück und kommen mit der Zeitnahme in Release 2.
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
