// Der Zeitverlauf: die abgelegten Versuche je Weg, mit ihrer Grenze.
//
// ## Der Ablauf liefert ab, dieser Bestand behält
//
// `stopwatch.js` liefert das Ergebnis eines Versuchs ab und hält es nicht; das
// war seit 4T-0146 die Zusage an dieses Modul. Hier landet es, in der Gestalt,
// in der es ankommt: `{ mode, duration, at }`. Ein zweites Gefäß für dieselbe
// Auskunft gibt es nicht, und der Zeitpunkt entsteht beim Beginn des Versuchs
// und nicht beim Ablegen.
//
// ## Beide Wege getrennt, vom Schlüssel an
//
// Eine Zeit am Bildschirm und eine am eigenen Würfel sind nicht vergleichbar,
// und F-0011 wie F-0015 verlangen die Trennung übereinstimmend. Sie ist hier
// keine Regel über die Rechnung, sondern die Form des Bestands: Je Weg eine
// Liste, und keine Auskunft dieses Moduls sieht über zwei Listen zugleich. Ein
// gemeinsamer Durchschnitt ist damit nicht einmal versehentlich zu rechnen.
//
// ## Die Grenze gehört zur Ablage und nicht zur Anzeige
//
// Der Verlauf ist der einzige Inhalt des Datensatzes, der mit dem Gebrauch
// wächst; alles andere ist durch den Bestand begrenzt. Eine Liste ohne Grenze
// wüchse im Browserspeicher, bis nichts mehr abgelegt werden kann, und das
// fiele dem Anwender als Verlust seines ganzen Fortschritts auf und nicht als
// volle Liste. Die Grenze wirkt beim Ablegen und beim Lesen, denn eine von Hand
// bearbeitete Datei kann eine längere Liste mitbringen.
//
// ## Die Bauform ist die des Fortschritts
//
// `createHistory` bekommt `load` und `save` hereingereicht wie `createPath`,
// kennt keinen Speicher und keine Einstellung, und `readHistory` wirft nie:
// Der Wert kommt aus einer Datei, die ein Anwender bearbeitet haben kann, und
// eine Abweisung kostete den ganzen übrigen Verlauf.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine globalen
// Namen. Es liest auch keine Uhr; der Zeitpunkt kommt mit dem Ergebnis herein.

import { TIMING_MODES } from './stopwatch.js';

/**
 * Wie viele Versuche je Weg gehalten werden.
 *
 * **Gerechnet und nicht geschätzt**, entschieden vom Product Owner am
 * 2026-09-03 aus einer Vorlage mit drei Werten. Ein Eintrag kostet im
 * eingerückt abgelegten Datensatz 86 Zeichen; beide Wege voll belegen damit
 * 172 000 Zeichen, gut drei Prozent der 5 MiB, die ein Browser einer Herkunft
 * üblicherweise gewährt. Tausend Versuche je Weg sind bei zehn Durchgängen am
 * Tag hundert Tage. **Verworfen sind 100**, weil die Bestzeit dann nach zehn
 * Tagen regelmäßigen Übens zu rollen beginnt, und **5000**, weil ein Sechstel
 * des Speichers für einen Fall stünde, den niemand erreicht.
 *
 * **Der Preis ist benannt:** Die Bestzeit wird über die gehaltenen Versuche
 * gerechnet und nicht als eigenes Feld geführt; fällt der älteste heraus und
 * war er der beste, gilt von da an die beste der gehaltenen.
 */
export const HISTORY_LIMIT = 1000;

/**
 * Die Fenster der Durchschnitte, seit 4T-0152: die letzten fünf und die
 * letzten zwölf Versuche, wie S-0049 sie nennt.
 *
 * **Als Daten und nicht als zwei Funktionen**, in der Bauart von `KATALOG` und
 * `ZEITSCHRITTE`: `averageOf` nimmt die Zahl, die Anzeige läuft über diese
 * Liste, und ein drittes Fenster wäre eine Zahl in einer Liste.
 */
export const AVERAGE_WINDOWS = [5, 12];

const MODE_VALUES = Object.values(TIMING_MODES);

/** Ein leerer Verlauf: je Weg eine leere Liste. */
const leererVerlauf = () => {
  const stand = new Map();
  for (const mode of MODE_VALUES) stand.set(mode, []);
  return stand;
};

/**
 * Eine Dauer, wie sie abgelegt wird: ganzzahlig in Millisekunden, oder `null`.
 *
 * Die monotone Uhr liefert Bruchteile von Millisekunden, und die sagen an einer
 * Zeit nichts aus. Alles, was keine endliche Zahl von null aufwärts ist, ist
 * keine Dauer; eine negative wäre keine Messung, sondern ein Fehler.
 */
function alsDauer(wert) {
  if (typeof wert !== 'number' || !Number.isFinite(wert) || wert < 0) return null;
  return Math.trunc(wert);
}

/** Ein Zeitpunkt, wie er abgelegt wird, oder `null`. */
const alsZeitpunkt = (wert) => (typeof wert === 'string' && wert !== '' ? wert : null);

/**
 * Ein Eintrag aus einem abgelegten Wert, oder `null`.
 *
 * **Ein Eintrag ohne Zeitpunkt wird nicht behalten.** Er ist der Bestandteil,
 * der einen Versuch von einer bloßen Zahl unterscheidet, und eine Liste, in der
 * manche Zeiten ein Datum tragen und manche nicht, ließe sich nicht mehr
 * ordnen.
 */
function liesEintrag(wert) {
  if (wert === null || typeof wert !== 'object') return null;
  const duration = alsDauer(wert.dauer);
  const at = alsZeitpunkt(wert.zeitpunkt);
  if (duration === null || at === null) return null;
  return { duration, at };
}

/** Die jüngsten Einträge einer Liste, höchstens `HISTORY_LIMIT`. */
const gekuerzt = (liste) => (liste.length > HISTORY_LIMIT ? liste.slice(-HISTORY_LIMIT) : liste);

/**
 * Liest einen abgelegten Verlauf.
 *
 * **Nichts hieran darf werfen**, wie bei `readProgress`. Ein unbrauchbarer
 * Eintrag fällt einzeln weg und kostet die übrigen nicht, ein unbekannter Weg
 * wird übergangen, und alles, was kein Verlauf ist, ergibt den leeren.
 *
 * **Der Weg wird geprüft, der Zeitpunkt nicht gedeutet.** Es gibt genau zwei
 * Wege, und ein dritter wäre ein Fehler des Programms, wie bei den Übungsformen
 * der Messwerte. Der Zeitpunkt dagegen wird durchgereicht, wie er kam: Er ist
 * eine Auskunft für den Anwender, und dieses Modul rechnet nicht mit ihm.
 */
export function readHistory(roh) {
  const stand = leererVerlauf();
  if (roh === null || typeof roh !== 'object') return stand;
  for (const mode of MODE_VALUES) {
    const liste = roh[mode];
    if (!Array.isArray(liste)) continue;
    const gelesen = liste.map(liesEintrag).filter((eintrag) => eintrag !== null);
    stand.set(mode, gekuerzt(gelesen));
  }
  return stand;
}

/**
 * Schreibt den Verlauf in die Form, die abgelegt wird.
 *
 * Ein Weg ohne Versuch wird weggelassen, wie eine leere Fallmenge im
 * Fortschritt. Abgelegt wird, was der Anwender gemessen hat, und nicht ein
 * Gerüst aus Leerstellen.
 */
export function writeHistory(stand) {
  const zeiten = {};
  for (const mode of MODE_VALUES) {
    const liste = stand.get(mode) ?? [];
    if (liste.length > 0) {
      zeiten[mode] = liste.map(({ duration, at }) => ({ dauer: duration, zeitpunkt: at }));
    }
  }
  return zeiten;
}

/**
 * Erzeugt die Verwaltung des Zeitverlaufs.
 *
 * `load()` liefert den abgelegten Verlauf, `save(wert)` nimmt ihn entgegen.
 * Fehlt eines von beiden, läuft der Verlauf im Gedächtnis und vergisst beim
 * Schließen; das ist die Haltung von `createPath`, und der Grund ist derselbe:
 * Das Gefäß aus 4T-0026 fängt einen Wurf der Ablage bereits und meldet ihn.
 */
export function createHistory({ load = null, save = null } = {}) {
  // Veränderlich seit 4T-0151, wie der Stand des Pfades: `reload` liest neu,
  // wenn eine Datei zurückgeholt worden ist.
  let stand = readHistory(load ? load() : null);

  const sichere = () => {
    if (save) save(writeHistory(stand));
  };

  const listeVon = (mode) => stand.get(mode) ?? null;

  return {
    /**
     * Legt das Ergebnis eines Versuchs ab, in der Gestalt, die der Ablauf
     * abliefert.
     *
     * Ein unbekannter Weg, eine Dauer, die keine ist, oder ein fehlender
     * Zeitpunkt werden mit `false` abgewiesen, und es wird nichts abgelegt;
     * das ist die Haltung von `begin` im Ablauf. **Ist der Weg voll, fällt der
     * älteste Versuch**, denn die Grenze schützt den ganzen Datensatz und nicht
     * den einzelnen Eintrag.
     */
    record(result) {
      if (result === null || typeof result !== 'object') return false;
      const liste = listeVon(result.mode);
      const duration = alsDauer(result.duration);
      const at = alsZeitpunkt(result.at);
      if (liste === null || duration === null || at === null) return false;
      liste.push({ duration, at });
      if (liste.length > HISTORY_LIMIT) liste.shift();
      sichere();
      return true;
    },

    /**
     * Die Versuche eines Weges, in der Reihenfolge des Entstehens.
     *
     * **Jeder trägt seine Stelle als `index`**, und über sie wird er verworfen.
     * Der Zeitpunkt taugte dafür nicht: Er ist sekundengenau, und am eigenen
     * Würfel greift «Fertig» unmittelbar nach «Los». Geliefert werden Kopien;
     * wer sie ändert, ändert den Bestand nicht.
     *
     * Für einen unbekannten Weg ist die Liste leer.
     */
    entries(mode) {
      return (listeVon(mode) ?? []).map((eintrag, index) => ({ index, ...eintrag }));
    },

    /** Wie viele Versuche ein Weg hält. */
    count: (mode) => listeVon(mode)?.length ?? 0,

    /**
     * Der schnellste Versuch eines Weges, oder `null`.
     *
     * **Der Versuch und nicht nur die Zahl**, denn die Anzeige will sagen,
     * wann die Bestzeit war, und mit dem `index` lässt sie sich verwerfen wie
     * jeder andere. **Bei gleicher Dauer gilt der frühere**: Er hat die Zeit
     * zuerst erreicht, der spätere hat sie nur wiederholt; deshalb `<` und
     * nicht `<=`.
     *
     * **Gerechnet über die gehaltenen Versuche und nicht als eigenes Feld
     * geführt.** Abgeleitetes gehört nicht in die Ablage; der Preis steht bei
     * `HISTORY_LIMIT`.
     */
    best(mode) {
      const liste = listeVon(mode);
      if (liste === null || liste.length === 0) return null;
      let bester = 0;
      for (let i = 1; i < liste.length; i += 1) {
        if (liste[i].duration < liste[bester].duration) bester = i;
      }
      return { index: bester, ...liste[bester] };
    },

    /**
     * Das arithmetische Mittel der Dauer über die letzten `n` Versuche eines
     * Weges, oder `null`.
     *
     * **`null`, solange weniger als `n` Versuche da sind**, entschieden vom
     * Product Owner am 2026-09-03: Ein Durchschnitt über zwölf bei vier
     * abgelegten Zeiten ist keine Zahl, die man kleiner rechnen darf. Die
     * Anzeige bekommt dafür einen eigenen Wortlaut, wie «noch nicht geübt» im
     * Training. **Verworfen ist der Durchschnitt über die vorhandenen mit
     * Kennzeichnung**, weil eine Zahl, die «Durchschnitt über zwölf» heißt und
     * etwas anderes ist, den Anwender belügt.
     *
     * **Das gewöhnliche Mittel und nicht die Wettkampfregel**, nach der bester
     * und schlechtester Versuch wegfallen; am selben Tag entschieden. S-0049
     * sagt «Durchschnitt», grenzt den Wettkampfablauf aus und begründet das
     * Verwerfen genau damit, dass ein verdorbener Versuch sonst jeden
     * Durchschnitt zieht.
     *
     * **Ungerundet.** Die Anzeige schneidet ab, wie sie es mit jeder Dauer tut,
     * und eine hier gerundete Zahl wäre danach zweimal gerundet. Ein `n`, das
     * keine ganze Zahl von eins aufwärts ist, ergibt `null`: Ein Mittel über
     * null Versuche ist keines.
     */
    averageOf(mode, n) {
      const liste = listeVon(mode);
      if (liste === null || !Number.isInteger(n) || n < 1 || liste.length < n) return null;
      let summe = 0;
      for (const { duration } of liste.slice(-n)) summe += duration;
      return summe / n;
    },

    /**
     * Verwirft genau einen Versuch, ohne die übrigen anzutasten.
     *
     * Die Ankündigung davor ist Sache der Oberfläche; hier steht allein die
     * Ausführung. Eine Stelle, die es nicht gibt, ändert nichts und fasst den
     * Speicher nicht an. Liefert `true`, wenn ein Versuch gefallen ist.
     */
    discard(mode, index) {
      const liste = listeVon(mode);
      if (liste === null || !Number.isInteger(index) || index < 0 || index >= liste.length) {
        return false;
      }
      liste.splice(index, 1);
      sichere();
      return true;
    },

    /**
     * Löscht den ganzen Verlauf, beide Wege.
     *
     * Wie `discard` ohne Rückfrage, und wie dort wird der Speicher nur
     * angefasst, wenn es etwas zu löschen gab. Liefert die Zahl der gelöschten
     * Versuche.
     */
    clear() {
      let geloescht = 0;
      for (const liste of stand.values()) {
        geloescht += liste.length;
        liste.length = 0;
      }
      if (geloescht > 0) sichere();
      return geloescht;
    },

    /**
     * Liest den Verlauf aus der Ablage neu, 4T-0151.
     *
     * Dieselbe Lücke wie beim Pfad und derselbe Griff: Nach «Aus Datei holen»
     * hielte dieser Verlauf sonst seinen alten Stand und schriebe ihn beim
     * nächsten Versuch über den geholten. Gesichert wird nicht; der Stand kommt
     * gerade aus dem Speicher.
     */
    reload: () => {
      stand = readHistory(load ? load() : null);
    },

    /** Der Verlauf in der Form, die abgelegt wird. Für Sicherung und Prüfung. */
    snapshot: () => writeHistory(stand),
  };
}
