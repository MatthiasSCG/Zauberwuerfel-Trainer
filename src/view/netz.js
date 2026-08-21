// Flaches Würfelnetz.
//
// Alle 54 Felder auf einen Blick, in der gebräuchlichen Kreuzform. Es hat drei
// Zwecke, die die räumliche Ansicht nicht erfüllt: den vollständigen Zustand
// beim Prüfen einer Eingabe, die Bedienfläche für das Setzen einzelner
// Feldchen und die Rückfallebene für schwache Geräte. **Der zweite ist seit
// 4T-0067 eingelöst**, nachdem er hier seit 4T-0030 als Absicht stand.
//
// **Das Netz führt keinen eigenen Zustand.** Es bekommt dieselben 54
// Seitenbuchstaben wie die räumliche Ansicht und zeigt sie. Zwei Ansichten mit
// zwei Wahrheiten wären der sichere Weg, dass eine von beiden falsch ist. Das
// gilt auch für die Eingabe: Ein Druck wird nach außen gemeldet, und was er
// bewirkt, entscheidet der Eingabezustand in `input` und nicht diese Datei.
//
// **Welche Felder fest sind, wird hereingereicht.** Die Mitten stehen in
// `input/eingabe.js`, und nach Grundsatz 3 der Architektur hängt kein Modul der
// Oberfläche von einem anderen ab; verdrahtet wird in `app`. Sie hier ein
// zweites Mal auszurechnen wäre der kurze Weg zu zwei Wahrheiten über die
// Feldordnung.

import { FELDER, netzStelle, NETZ_ANORDNUNG, hervorhebung, felderDesSteins } from './geometrie.js';

/** Die Ausdehnung des Netzes in Feldchen, aus der Kreuzform aus drei mal vier Kacheln. */
const ZEILEN = 9;
const SPALTEN = 12;

/** Die Tastenrichtungen, als Schritt in Zeile und Spalte. */
const RICHTUNGEN = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

/** Baut das Netz und liefert seine Bedienung. */
export function erzeugeNetz(dokument) {
  const knoten = dokument.createElement('div');
  knoten.className = 'netz';

  // Die Beschriftung jeder Seite. Ohne sie ist die Zuordnung zur räumlichen
  // Ansicht Ratesache, und das Netz taugt nicht zum Abgleichen.
  for (const [seite, [zeile, spalte]] of Object.entries(NETZ_ANORDNUNG)) {
    const marke = dokument.createElement('div');
    marke.className = 'netz-marke notation';
    marke.textContent = seite;
    // Die Marke überspannt ihre ganze Kachel und sitzt in deren linker oberer
    // Ecke. Eine eigene Zeile je Kachel machte das Netz um ein Drittel höher,
    // ohne mehr zu sagen.
    marke.style.gridRow = `${zeile * 3 + 1} / span 3`;
    marke.style.gridColumn = `${spalte * 3 + 1} / span 3`;
    knoten.append(marke);
  }

  const flaechen = new Map();
  /** Die Feldnummer je Stelle im Raster, als «zeile,spalte». Für die Pfeiltasten. */
  const anStelle = new Map();
  for (const feld of FELDER) {
    const stelle = netzStelle(feld.nummer);
    const kachel = dokument.createElement('div');
    kachel.className = 'netz-feld';
    kachel.dataset.feld = feld.nummer;
    kachel.dataset.seite = stelle.seite;
    // Das Gitter zählt ab eins.
    kachel.style.gridRow = String(stelle.zeile + 1);
    kachel.style.gridColumn = String(stelle.spalte + 1);
    knoten.append(kachel);
    flaechen.set(feld.nummer, kachel);
    anStelle.set(`${stelle.zeile},${stelle.spalte}`, feld.nummer);
  }

  const markiert = [];
  const zielfelder = [];
  const befundfelder = [];

  // ------------------------------------------------------------- Bedienung

  let bedienbar = false;
  let feste = new Set();
  let melde = null;
  /** Das Feld, das die Tabulatortaste erreicht. Es wandert mit den Pfeiltasten. */
  let stelle = 0;

  /**
   * Setzt die wandernde Fokusstelle.
   *
   * **Genau ein Feld trägt `tabindex="0"`, alle übrigen `-1`.** 54 einzelne
   * Tabstopps wären der naheliegende Weg und der falsche: Wer mit der
   * Tabulatortaste an der Eingabe vorbeiwill, drückte sie vierundfünfzigmal.
   */
  function setzeStelle(nummer, mitFokus) {
    stelle = nummer;
    for (const [feldnummer, kachel] of flaechen) {
      kachel.tabIndex = feldnummer === nummer ? 0 : -1;
    }
    if (mitFokus) flaechen.get(nummer).focus();
  }

  /**
   * Das nächste vorhandene Feld in einer Richtung, oder `null`.
   *
   * Geschritten wird, bis eine Stelle belegt ist oder das Raster endet. Die
   * Kreuzform hat Lücken, und ein Sprung über sie hinweg ist die Bewegung, die
   * der Anwender erwartet: Von der linken Seite nach oben liegt nichts, von der
   * vorderen sehr wohl.
   */
  function nachbar(nummer, [dz, ds]) {
    const { zeile, spalte } = netzStelle(nummer);
    let z = zeile + dz;
    let s = spalte + ds;
    while (z >= 0 && z < ZEILEN && s >= 0 && s < SPALTEN) {
      const treffer = anStelle.get(`${z},${s}`);
      if (treffer !== undefined) return treffer;
      z += dz;
      s += ds;
    }
    return null;
  }

  /** Meldet einen Druck auf ein Feld nach außen, wenn die Eingabe läuft. */
  function druecke(nummer) {
    if (!bedienbar || melde === null) return;
    setzeStelle(nummer, true);
    melde(nummer);
  }

  // Zeigen und Berühren sind derselbe Weg: `pointerdown` fasst beides, so wie
  // es die Ansichtsdrehung seit 4T-0028 hält. Ein eigener Zweig für Berührung
  // wäre eine zweite Behandlung derselben Geste.
  knoten.addEventListener('pointerdown', (ereignis) => {
    const kachel = ereignis.target.closest?.('.netz-feld');
    if (kachel === null || kachel === undefined) return;
    // Der voreingestellte Fokuswechsel entfällt, damit die Stelle dorthin
    // wandert, wo gedrückt wurde, und nicht auf den Container.
    ereignis.preventDefault();
    druecke(Number(kachel.dataset.feld));
  });

  knoten.addEventListener('keydown', (ereignis) => {
    if (!bedienbar) return;
    const richtung = RICHTUNGEN[ereignis.key];
    if (richtung !== undefined) {
      const ziel = nachbar(stelle, richtung);
      if (ziel === null) return;
      ereignis.preventDefault();
      setzeStelle(ziel, true);
      return;
    }
    if (ereignis.key === ' ' || ereignis.key === 'Enter') {
      ereignis.preventDefault();
      druecke(stelle);
    }
  });

  return {
    knoten,

    /**
     * Schaltet das Netz auf Bedienung um oder wieder ab.
     *
     * `feste` sind die Feldnummern, die keine Farbe annehmen. Sie bleiben
     * erreichbar und tragen `aria-disabled`: Ein Feld, das der Fokus überspringt,
     * lässt die Bewegung im Raster stolpern, und warum es nichts annimmt, sagt
     * erst die Beschriftung.
     */
    setzeBedienbar(an, { feste: festeFelder = [], melde: rueckmeldung = null } = {}) {
      bedienbar = an;
      feste = new Set(festeFelder);
      melde = rueckmeldung;
      if (an) knoten.dataset.bedienbar = '';
      else delete knoten.dataset.bedienbar;
      for (const [nummer, kachel] of flaechen) {
        if (an) {
          kachel.setAttribute('role', 'button');
          if (feste.has(nummer)) kachel.setAttribute('aria-disabled', 'true');
          else kachel.removeAttribute('aria-disabled');
        } else {
          kachel.removeAttribute('role');
          kachel.removeAttribute('aria-disabled');
          kachel.removeAttribute('tabindex');
        }
        if (feste.has(nummer)) kachel.dataset.fest = '';
        else delete kachel.dataset.fest;
      }
      if (an) {
        // Die Stelle beginnt am ersten Feld, das eine Farbe annimmt.
        const erstes = [...flaechen.keys()].find((nummer) => !feste.has(nummer)) ?? 0;
        setzeStelle(erstes, false);
      }
    },

    /** Setzt den Fokus auf die aktuelle Stelle. Für den Beginn einer Eingabe. */
    fasseFokus() {
      if (bedienbar) flaechen.get(stelle).focus();
    },

    /** Die Beschriftung eines Feldes, hereingereicht statt hier formuliert. */
    beschrifte(nummer, wortlaut) {
      flaechen.get(nummer).setAttribute('aria-label', wortlaut);
    },

    /**
     * Zeigt einen Zustand, gegeben als die 54 Seitenbuchstaben des Kerns.
     *
     * **Ein Feld darf `null` sein.** Das ist der Fall während einer Eingabe,
     * und er ist kein Fehler, sondern ihr Normalzustand: Wer 54 Felder
     * überträgt, hat die meiste Zeit weniger als 54 gesetzt. Ein leeres Feld
     * trägt kein `data-farbe` und bekommt damit auch kein Zeichen der
     * Kennzeichnung, denn es gibt keine Farbe zu kennzeichnen.
     */
    zeige(facelets) {
      for (const feld of FELDER) {
        const kachel = flaechen.get(feld.nummer);
        const farbe = facelets[feld.nummer];
        if (farbe === null || farbe === undefined) {
          kachel.style.backgroundColor = '';
          delete kachel.dataset.farbe;
          kachel.dataset.leer = '';
          continue;
        }
        kachel.style.backgroundColor = `var(--seite-${farbe.toLowerCase()})`;
        // Wie in der räumlichen Ansicht: Das Zeichen gehört zur Farbe und
        // nicht zur Stelle.
        kachel.dataset.farbe = farbe;
        delete kachel.dataset.leer;
      }
    },

    /**
     * Hebt die Schicht des anstehenden Zuges hervor. `null` löscht sie.
     *
     * **Hier nur der Saum, keine Laufkante.** Bei U und D liefe sie sauber
     * durch die mittlere Reihe, weil das Netz die vier Seitenflächen in der
     * Reihenfolge der Drehung aufklappt. Bei den vier anderen Seiten läuft der
     * Ring durch U und D und bricht an der Aufklappstelle: Die Richtung kehrte
     * sich dort um. Eine Richtungsangabe, die in vier von sechs Fällen falsch
     * herum zeigt, ist schlechter als keine.
     */
    hebeHervor(zug) {
      while (markiert.length > 0) delete markiert.pop().dataset.saum;
      if (zug === null) return;
      for (const { nummer } of hervorhebung(zug)) {
        const kachel = flaechen.get(nummer);
        kachel.dataset.saum = '';
        markiert.push(kachel);
      }
    },

    /**
     * Lässt allein die Felder des Steins an dieser Stellung stehen. `null` hebt
     * die Zurücknahme auf.
     *
     * **Anders als bei der Laufkante gibt es hier keinen Grund, das Netz
     * auszunehmen.** Die Marke des Zuges muss dort entfallen, weil ihre
     * Richtung an der Aufklappstelle umschlüge; eine Zurücknahme hat keine
     * Richtung. Sie trifft dieselben drei Feldchen und sagt dasselbe. Das Netz
     * ist die Rückfallebene für schwache Geräte, und gerade dort darf die
     * Lernhilfe nicht ausfallen.
     */
    hebeSteinHervor(stellung) {
      while (zielfelder.length > 0) delete zielfelder.pop().dataset.ziel;
      if (stellung === null) {
        delete knoten.dataset.ruecknahme;
        return;
      }
      for (const nummer of felderDesSteins(stellung)) {
        const kachel = flaechen.get(nummer);
        kachel.dataset.ziel = '';
        zielfelder.push(kachel);
      }
      knoten.dataset.ruecknahme = '';
    },

    /**
     * Hebt die Feldchen hervor, die ein Befund der Prüfung nennt. `null` oder
     * eine leere Liste löscht die Hervorhebung.
     *
     * **Ein dritter Datenwert neben `saum` und `ziel`, und das ist Absicht.**
     * Die beiden anderen gehören der Wiedergabe und können gleichzeitig
     * stehen; ein geteilter Wert ließe die eine Anzeige die andere löschen.
     *
     * Welche Feldchen es sind, entscheidet der Kern und nicht diese Datei. Sie
     * kommen als Feldnummern herein, so wie der Zustand auch. **Der Befund
     * nennt nicht immer welche**, die Paritätsverletzung etwa hat keinen Ort;
     * dann bleibt es beim Satz allein.
     */
    hebeBefundHervor(felder) {
      while (befundfelder.length > 0) delete befundfelder.pop().dataset.befund;
      if (felder === null || felder === undefined) return;
      for (const nummer of felder) {
        const kachel = flaechen.get(nummer);
        // Eine Feldnummer außerhalb des Netzes ist ein Fehlgriff des Aufrufers
        // und keine Ausnahme, wie beim Setzen eines Feldchens auch.
        if (kachel === undefined) continue;
        kachel.dataset.befund = '';
        befundfelder.push(kachel);
      }
    },
  };
}
