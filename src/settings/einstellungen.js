// Einstellungen, Fortschritt und ihre Ablage.
//
// ## Warum die Ablage hereingereicht wird
//
// Dieses Modul verwendet keinen globalen Namen, insbesondere nicht den
// Browserspeicher. Es bekommt eine Ablage mit `lies` und `schreibe` von
// außen, wie der Läufer des Lösers seine Umgebung bekommt.
//
// Das ist keine Formalie. Die drei fehleranfälligen Fälle sind die
// Vorgabewerte beim ersten Start, die Ergänzung eines älteren Datensatzes und
// das Verhalten, wenn es gar keinen Speicher gibt. Alle drei lassen sich so
// ohne Browser durchrechnen, und der letzte ist der, den man im eigenen
// Browser nie zu Gesicht bekommt.
//
// ## Ein Datensatz für alles
//
// Einstellungen und Fortschritt stehen zusammen unter einem Schlüssel, mit
// einem Feld für die Fassung. Die Fassung ist keine Förmlichkeit: Sobald
// Release 2 neue Einstellungen mitbringt, muss ein älterer Datensatz erkannt
// und ergänzt werden können, ohne den Fortschritt zu verlieren.

import { FASSUNG, KATALOG, istGueltig, vorgaben } from './katalog.js';

/** Ergebnis des Einlesens eines fremden Datensatzes. */
const ABGEWIESEN = { ok: false };

/**
 * Liest einen Datensatz aus Text und ergänzt ihn auf den heutigen Stand.
 *
 * Liefert `null`, wenn der Text keinen Datensatz dieses Programms darstellt.
 * Die Unterscheidung ist wichtig: Ein fehlender Datensatz ist der Normalfall
 * beim ersten Start, ein fremder ist ein Fehler des Anwenders, und beide
 * dürfen nicht gleich behandelt werden.
 */
export function liesDatensatz(text, umgebung = {}) {
  if (typeof text !== 'string' || text.trim() === '') return null;
  let roh;
  try {
    roh = JSON.parse(text);
  } catch {
    return null;
  }
  if (roh === null || typeof roh !== 'object' || typeof roh.fassung !== 'number') return null;

  const werte = vorgaben(umgebung);
  const gelesen = roh.einstellungen;
  if (gelesen !== null && typeof gelesen === 'object') {
    for (const { name } of KATALOG) {
      // Ein unbekannter oder ungültiger Wert fällt auf die Vorgabe zurück,
      // statt die Oberfläche in einen Zustand zu bringen, den sie nicht
      // kennt. Das deckt zugleich den Fall ab, dass eine Einstellung in einer
      // späteren Fassung andere Werte trägt.
      if (istGueltig(name, gelesen[name])) werte[name] = gelesen[name];
    }
  }

  return {
    fassung: FASSUNG,
    einstellungen: werte,
    fortschritt:
      roh.fortschritt !== null && typeof roh.fortschritt === 'object' ? roh.fortschritt : {},
    // Ein älterer Datensatz ist erkannt worden und wurde ergänzt. Die
    // Oberfläche kann darauf hinweisen, muss aber nicht.
    ergaenzt: roh.fassung < FASSUNG,
  };
}

/** Schreibt einen Datensatz als lesbaren Text. */
export function schreibeDatensatz(datensatz) {
  return `${JSON.stringify(
    {
      fassung: FASSUNG,
      einstellungen: datensatz.einstellungen,
      fortschritt: datensatz.fortschritt,
    },
    null,
    2,
  )}\n`;
}

/**
 * Erzeugt die Verwaltung der Einstellungen.
 *
 * `ablage` trägt `lies()` und `schreibe(text)`. Fehlt sie oder wirft sie,
 * läuft das Programm weiter und vergisst beim Schließen; `speicherFehlt()`
 * meldet das, damit die Oberfläche einmalig darauf hinweisen kann.
 */
export function erzeugeEinstellungen({ ablage = null, umgebung = {} } = {}) {
  let fehlt = false;

  const vomSpeicher = () => {
    if (!ablage) {
      fehlt = true;
      return null;
    }
    try {
      return liesDatensatz(ablage.lies(), umgebung);
    } catch {
      // Ein Browser kann den Zugriff verweigern, statt nur nichts zu
      // liefern. Beides ist derselbe Fall: kein Speicher.
      fehlt = true;
      return null;
    }
  };

  const datensatz = vomSpeicher() ?? {
    fassung: FASSUNG,
    einstellungen: vorgaben(umgebung),
    fortschritt: {},
    ergaenzt: false,
  };

  const zuhoerer = [];
  const melde = (name, wert) => {
    for (const rueckruf of zuhoerer) rueckruf(name, wert);
  };

  const sichereAb = () => {
    if (!ablage) {
      fehlt = true;
      return;
    }
    try {
      ablage.schreibe(schreibeDatensatz(datensatz));
    } catch {
      fehlt = true;
    }
  };

  const setze = (name, wert) => {
    if (!istGueltig(name, wert)) return false;
    if (datensatz.einstellungen[name] === wert) return true;
    datensatz.einstellungen[name] = wert;
    // Sofort ablegen, nicht erst beim Schließen. Ein Browser wird nicht
    // ordentlich beendet, er wird weggeklickt.
    sichereAb();
    melde(name, wert);
    return true;
  };

  return {
    /** Wert einer Einstellung. */
    wert: (name) => datensatz.einstellungen[name],

    /** Alle Werte als eigene Abbildung. */
    alle: () => ({ ...datensatz.einstellungen }),

    setze,

    /** Setzt eine Einstellung auf ihren Vorgabewert. */
    setzeZurueck: (name) => setze(name, vorgaben(umgebung)[name]),

    /** Setzt alle Einstellungen zurück. Der Fortschritt bleibt. */
    setzeAllesZurueck: () => {
      for (const [name, wert] of Object.entries(vorgaben(umgebung))) setze(name, wert);
    },

    /** Der Fortschritt im Lernpfad. Gefüllt wird er in 2A-0007. */
    fortschritt: () => datensatz.fortschritt,
    setzeFortschritt: (neu) => {
      datensatz.fortschritt = neu;
      sichereAb();
    },

    /** Der Datensatz als Text, für die Sicherung in eine Datei. */
    alsText: () => schreibeDatensatz(datensatz),

    /**
     * Übernimmt einen gesicherten Datensatz aus Text.
     *
     * Eine fremde oder beschädigte Datei wird abgewiesen, **ohne den
     * vorhandenen Stand zu zerstören**. Das ist die Stelle, an der ein Fehler
     * am teuersten wäre: Der Anwender greift zur Sicherung, weil ihm etwas
     * wichtig ist.
     */
    uebernimm: (text) => {
      const gelesen = liesDatensatz(text, umgebung);
      if (!gelesen) return ABGEWIESEN;
      datensatz.einstellungen = gelesen.einstellungen;
      datensatz.fortschritt = gelesen.fortschritt;
      sichereAb();
      for (const [name, wert] of Object.entries(datensatz.einstellungen)) melde(name, wert);
      return { ok: true, ergaenzt: gelesen.ergaenzt };
    },

    /** Wurde ein älterer Datensatz ergänzt? */
    wurdeErgaenzt: () => datensatz.ergaenzt === true,

    /** Fehlt der Speicher? Erst nach dem ersten Zugriff aussagekräftig. */
    speicherFehlt: () => fehlt,

    /** Meldet jede Änderung mit Name und neuem Wert. */
    aufAenderung: (rueckruf) => zuhoerer.push(rueckruf),
  };
}
