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
//
// ## Nach unten ergänzen, nach oben nicht schreiben
//
// Die Gegenrichtung ist seit 4T-0118 gebaut, und sie ist **nicht** die
// spiegelbildliche Abweisung. Ein Stand aus einer neueren Fassung wird gelesen
// wie jeder andere, aber von diesem Augenblick an nichts mehr abgelegt. Der
// Grund ist gemessen: Der Schaden entsteht beim Schreiben. Ein älteres
// Programm, das einen neueren Stand liest und einmal schreibt, wirft alles
// weg, was es nicht kennt, und setzt die Fassung dabei herab.
//
// **Für eine Datei gilt das Umgekehrte, und das ist kein Widerspruch.** Sie
// wird abgewiesen. Eine Datei ist eine von mehreren und lässt sich mit der
// neueren Fassung öffnen; der Browserspeicher ist der einzige Stand, den der
// Anwender hat, und eine Abweisung schnitte ihn davon ab.

import { FASSUNG, KATALOG, istGueltig, vorgaben } from './katalog.js';

/** Ergebnis des Einlesens eines fremden Datensatzes. */
const ABGEWIESEN = { ok: false };

/**
 * Ergebnis des Einlesens einer Datei aus einer neueren Fassung.
 *
 * **Getrennt von `ABGEWIESEN`, weil der Anwender etwas anderes hört.** «Diese
 * Datei gehört nicht zu diesem Programm» wäre bei einer eigenen Sicherung aus
 * einer neueren Fassung schlicht falsch und schickte ihn auf die Suche nach
 * einem Fehler, den er nicht gemacht hat.
 */
const ZU_NEU = { ok: false, zuNeu: true };

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
    // Der Zeitverlauf, seit 4T-0150 das dritte Feld der Hülle. **Durchgereicht
    // und nicht gedeutet**, wie der Fortschritt: Was darin steht, liest
    // `timing/history.js`, und ein Stand ohne das Feld bekommt den leeren.
    zeiten: roh.zeiten !== null && typeof roh.zeiten === 'object' ? roh.zeiten : {},
    // Ein älterer Datensatz ist erkannt worden und wurde ergänzt. Die
    // Oberfläche kann darauf hinweisen, muss aber nicht.
    ergaenzt: roh.fassung < FASSUNG,
    // Und die Gegenrichtung: Der Datensatz stammt aus einer Fassung, die
    // dieses Programm nicht kennt. **Gelesen wird er trotzdem**, denn alles,
    // was hier gedeutet wird, ist gegen den heutigen Katalog geprüft; ein
    // unbekanntes Feld wird durchgereicht und nicht gedeutet. Was aus dieser
    // Flagge folgt, entscheidet der Aufrufer, und er entscheidet es
    // unterschiedlich: Der Browserspeicher wird gelesen und nicht mehr
    // beschrieben, eine Datei wird abgewiesen. Begründet in 4T-0118.
    zuNeu: roh.fassung > FASSUNG,
  };
}

/** Schreibt einen Datensatz als lesbaren Text. */
export function schreibeDatensatz(datensatz) {
  return `${JSON.stringify(
    {
      fassung: FASSUNG,
      einstellungen: datensatz.einstellungen,
      fortschritt: datensatz.fortschritt,
      zeiten: datensatz.zeiten,
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
    zeiten: {},
    ergaenzt: false,
    zuNeu: false,
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
    // **Die Schreibsperre, und sie ist die eigentliche Sicherung.** Im
    // Speicher liegt ein Stand aus einer Fassung, die dieses Programm nicht
    // kennt. Gemessen entsteht der Schaden nicht beim Lesen, sondern hier:
    // Ein Datensatz der Fassung 2 durch ein Programm der Fassung 1 gelesen und
    // einmal geschrieben, und alle Fallkennungen sind fort, weil das ältere
    // `writeProgress` nur schreibt, was es kennt. Vor dem Lesen abzuweisen
    // machte es schlimmer: Der Anwender käme an seinen Stand nicht mehr heran,
    // und die erste Änderung überschriebe ihn endgültig.
    //
    // `fehlt` wird dabei ausdrücklich **nicht** gesetzt. Der Speicher fehlt
    // nicht, er ist belegt, und der Anwender bekommt dazu einen eigenen
    // Hinweis. Aufgehoben wird die Sperre allein durch `uebernimm`.
    if (datensatz.zuNeu) return;
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

    /**
     * Der Zeitverlauf, seit 4T-0150. Gefüllt und gelesen wird er in
     * `timing/history.js`; hier steht allein das Gefäß, wie beim Fortschritt.
     */
    zeiten: () => datensatz.zeiten,
    setzeZeiten: (neu) => {
      datensatz.zeiten = neu;
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
      // Eine Datei aus einer neueren Fassung wird abgewiesen, und hier ist das
      // richtig: Sie ist nur eine von mehreren, der vorhandene Stand bleibt
      // unangetastet, und der Anwender kann sie mit der neueren Fassung des
      // Programms öffnen. Der Browserspeicher hat diese Wahl nicht, deshalb
      // wird er anders behandelt. S-0050, AK7.
      if (gelesen.zuNeu) return ZU_NEU;
      datensatz.einstellungen = gelesen.einstellungen;
      datensatz.fortschritt = gelesen.fortschritt;
      datensatz.zeiten = gelesen.zeiten;
      // **Der Ausweg aus der Schreibsperre.** Wer eine Datei zurückholt, sagt
      // ausdrücklich «ersetze meinen Stand»; von da an gibt es keinen fremden
      // Stand mehr zu schützen. Das Löschen des Fortschritts leistet das
      // bewusst nicht: Es läuft über denselben Weg wie jedes gewöhnliche
      // Speichern und unterliefe die Sperre damit unbemerkt.
      datensatz.zuNeu = false;
      sichereAb();
      for (const [name, wert] of Object.entries(datensatz.einstellungen)) melde(name, wert);
      return { ok: true, ergaenzt: gelesen.ergaenzt };
    },

    /** Wurde ein älterer Datensatz ergänzt? */
    wurdeErgaenzt: () => datensatz.ergaenzt === true,

    /**
     * Stammt der Stand im Speicher aus einer neueren Fassung?
     *
     * Solange das gilt, wird nichts abgelegt. Die Oberfläche muss darauf
     * hinweisen, denn sonst arbeitet der Anwender eine Sitzung lang umsonst.
     */
    istZuNeu: () => datensatz.zuNeu === true,

    /** Fehlt der Speicher? Erst nach dem ersten Zugriff aussagekräftig. */
    speicherFehlt: () => fehlt,

    /** Meldet jede Änderung mit Name und neuem Wert. */
    aufAenderung: (rueckruf) => zuhoerer.push(rueckruf),
  };
}
