// Räumliche Darstellung des Würfels.
//
// Sechsundzwanzig Steine mit bis zu drei sichtbaren Flächen, gebaut aus den
// dreidimensionalen Transformationen des Browsers und ohne Fremdbibliothek,
// bindend aus E-0001.
//
// **Dieses Modul ist dünn.** Wohin ein Feld gehört, rechnet `geometrie.js`
// aus und ist dort vollständig geprüft; hier wird es nur noch hingestellt.
// Was der Würfel zeigt, kommt vom Kern über `toFacelets` und wird nicht
// zwischengespeichert: Eine zweite Wahrheit über den Zustand wäre der
// sicherste Weg, dass beide auseinanderlaufen.

import {
  FELDER,
  STEINE,
  SEITEN,
  flaechenZahl,
  felderDesSteins,
  drehungFuerZug,
  cssDrehung,
  inSchicht,
  hervorhebung,
  blickrichtungen,
} from './geometrie.js';
import { AUSGANGSBLICK, nachZug, gleich } from './blick.js';
import { erzeugeAblauf } from './ablauf.js';

/**
 * Dauer einer Vierteldrehung je Stufe des Einstellungs-Katalogs.
 *
 * «Aus» bedeutet null: Die Darstellung wechselt dann unmittelbar in den neuen
 * Zustand, ohne Zwischenschritt. Die Werte sind so gewählt, dass die
 * langsamste Stufe zum Mitzählen taugt und die schnellste beim Abspielen
 * einer Lernlösung nicht zur Geduldsprobe wird.
 */
export const DAUERN = { aus: 0, langsam: 520, mittel: 280, schnell: 150 };

/** Die Fläche in Richtung dieser Seite, als Drehung um den Steinmittelpunkt. */
const DREHUNG = {
  U: 'rotateX(90deg)',
  D: 'rotateX(-90deg)',
  R: 'rotateY(90deg)',
  L: 'rotateY(-90deg)',
  F: '',
  B: 'rotateY(180deg)',
};

/**
 * Baut den Würfel und liefert seine Bedienung.
 *
 * Das Dokument wird übergeben und nicht als globaler Name verwendet, damit
 * die Bauart derselben Prüfung offensteht wie der Rest.
 */
export function erzeugeWuerfel(dokument) {
  const buehne = dokument.createElement('div');
  buehne.className = 'wuerfel-buehne';

  const koerper = dokument.createElement('div');
  koerper.className = 'wuerfel';
  buehne.append(koerper);

  // Die Schicht nimmt während einer Bewegung die neun betroffenen Steine auf
  // und dreht sie gemeinsam. Danach kehren sie in den Körper zurück. Der
  // Umweg über eine eigene Gruppe erspart es, neun Steine einzeln zu drehen
  // und ihre Verschiebung dabei mitzurechnen.
  const schicht = dokument.createElement('div');
  schicht.className = 'schicht';
  koerper.append(schicht);

  const flaechen = new Map();
  const steinKnoten = new Map();

  for (const stein of STEINE) {
    const knoten = dokument.createElement('div');
    knoten.className = 'stein';
    steinKnoten.set(stein.stellung.join(','), knoten);
    const [x, y, z] = stein.stellung;
    // In CSS zeigt die senkrechte Achse nach unten, im Modell nach oben.
    // Genau hier das Vorzeichen zu vergessen, dreht den Würfel auf den Kopf,
    // ohne dass eine Prüfung anschlüge.
    knoten.style.setProperty('--x', x);
    knoten.style.setProperty('--y', -y);
    knoten.style.setProperty('--z', z);
    knoten.dataset.flaechen = flaechenZahl(stein.stellung);

    for (const feld of stein.felder) {
      const flaeche = dokument.createElement('div');
      flaeche.className = 'stein-flaeche';
      flaeche.style.transform = `${DREHUNG[feld.seite]} translateZ(calc(var(--kante) / 2))`;
      flaeche.dataset.feld = feld.nummer;
      flaeche.dataset.seite = feld.seite;
      knoten.append(flaeche);
      flaechen.set(feld.nummer, flaeche);
    }
    koerper.append(knoten);
  }

  /**
   * Färbt alle 54 Flächen nach dem übergebenen Zustand.
   *
   * Gesetzt wird die Hintergrundfarbe und nicht der Hintergrund als Ganzes:
   * Die Kennzeichnung ohne Farbe liegt als Bild darüber, und die kurze
   * Schreibweise löschte sie bei jedem Zug.
   */
  const zustandsZuhoerer = [];

  function zeigeFacelets(facelets) {
    for (const feld of FELDER) {
      const flaeche = flaechen.get(feld.nummer);
      const farbe = facelets[feld.nummer];
      flaeche.style.backgroundColor = `var(--seite-${farbe.toLowerCase()})`;
      // Die Kennzeichnung ohne Farbe hängt hieran und wandert damit mit dem
      // Stein. Sie an `data-seite` zu hängen wäre der eine Fehler, der die
      // ganze Rückfallebene wertlos macht: Auf welcher Seite ein Feld liegt,
      // sieht auch der Farbfehlsichtige; welche Farbe es hat, gerade nicht.
      flaeche.dataset.farbe = farbe;
    }
    // Wer denselben Zustand sonst noch zeigt, etwa das flache Netz, erfährt
    // es hier. So wechseln beide Ansichten im selben Augenblick, und zwar
    // erst nach der Bewegung und nicht schon beim Auslösen des Zuges.
    for (const rueckruf of zustandsZuhoerer) rueckruf(facelets);
  }

  // ------------------------------------------------------- Hervorhebung
  //
  // Sie zeigt den **anstehenden** Zug: welche Schicht sich dreht und wohin.
  // Wohin ein Feld läuft, rechnet `geometrie.js` und ist dort über alle
  // achtzehn Züge gegen den Kern geprüft; hier wird es nur noch angeschrieben.
  //
  // **Geführt wird sie hier und nicht in der Verdrahtung**, weil nur hier
  // bekannt ist, ob eine Bewegung läuft. Während einer Drehung erlischt sie,
  // denn was gerade läuft, zeigt die Bewegung selbst. Die Verdrahtung meldet
  // den gewünschten Zug an, die Darstellung entscheidet, wann sie ihn zeigt.
  // Andernfalls bräuchte es dort eine Laufkennung gegen überholte Rückrufe.

  let gewuenschteHervorhebung = null;
  // Kennung des jüngsten Wunsches. Ohne sie zeichnete ein überholter Wunsch
  // seine Schicht, sobald die Darstellung zur Ruhe kommt.
  let hervorLauf = 0;
  const markiert = [];
  const hervorZuhoerer = [];

  /** Zeichnet die Hervorhebung eines Zuges oder löscht sie bei `null`. */
  function setzeHervorhebung(zug) {
    while (markiert.length > 0) {
      const flaeche = markiert.pop();
      delete flaeche.dataset.saum;
      delete flaeche.dataset.lauf;
    }
    if (zug !== null) {
      for (const { nummer, kanten } of hervorhebung(zug)) {
        const flaeche = flaechen.get(nummer);
        flaeche.dataset.saum = '';
        // Auch die leere Angabe wird gesetzt, damit das Stilblatt Saum und
        // Marke an derselben Stelle behandelt und nicht zwei Regelwerke
        // braucht.
        flaeche.dataset.lauf = kanten;
        markiert.push(flaeche);
      }
    }
    // Wer dieselbe Schicht sonst noch zeigt, etwa das flache Netz, erfährt es
    // hier. Damit folgt es demselben Takt und nicht einem eigenen.
    for (const rueckruf of hervorZuhoerer) rueckruf(zug);
  }

  const loescheHervorhebung = () => setzeHervorhebung(null);
  const zeichneHervorhebung = () => setzeHervorhebung(gewuenschteHervorhebung);

  // -------------------------------------------------- Zurückgenommener Rest
  //
  // Die Umkehrung der Hervorhebung darüber, aus 4T-0050. Sie betont nicht,
  // sondern nimmt zurück: Ein einzelner Stein bleibt stehen, alles Übrige tritt
  // hinter einen Schleier. Gebraucht wird sie in Lektion 8, wo die untere
  // Schicht zwischendurch zerstört aussieht und der Anwender sie deshalb gerade
  // nicht ansehen soll.
  //
  // **Sie kennt keine Bewegung und keinen Takt.** Anders als die Hervorhebung
  // des Zuges gehört sie nicht zu einem Zug, sondern zur angezeigten Lektion;
  // sie muss deshalb nicht auf `ruhe` warten und bleibt während einer Drehung
  // einfach stehen.
  //
  // Ausgezeichnet wird der bleibende Stein und nicht die 51 zurückgenommenen
  // Flächen. Das ist nicht nur sparsamer, sondern die richtige Aussage: Das
  // Stilblatt sagt «alles außer dem Ziel tritt zurück», und wer die Stelle
  // ändert, ändert genau ein Merkmal.

  const zielflaechen = [];

  /** Lässt allein den Stein an dieser Stellung stehen. `null` hebt das auf. */
  function nimmZurueck(stellung) {
    while (zielflaechen.length > 0) delete zielflaechen.pop().dataset.ziel;
    if (stellung === null) {
      delete koerper.dataset.ruecknahme;
      return;
    }
    for (const nummer of felderDesSteins(stellung)) {
      const flaeche = flaechen.get(nummer);
      flaeche.dataset.ziel = '';
      zielflaechen.push(flaeche);
    }
    koerper.dataset.ruecknahme = '';
  }

  // ---------------------------------------------------------- Bewegung

  let dauer = DAUERN.mittel;
  let laufendeAnimation = null;

  /**
   * Zeigt einen Zug als Drehung der betroffenen Schicht.
   *
   * Die Zwischenstufen sind reine Anzeige. Der Zustand springt in einem
   * Schritt, wenn die Bewegung fertig ist: Alles andere erzeugte eine zweite
   * Wahrheit neben dem Kern, und die beiden liefen früher oder später
   * auseinander.
   */
  async function fuehreZugAus({ zug, facelets }, istVerworfen) {
    // Was gerade läuft, zeigt die Bewegung selbst. Eine Hervorhebung, die
    // dabei stehen bliebe, meinte bereits den übernächsten Zug und wanderte
    // mitten in der Drehung auf eine andere Schicht.
    loescheHervorhebung();
    const { seite } = drehungFuerZug(zug);
    const betroffene = STEINE.filter((s) => inSchicht(s.stellung, seite)).map((s) =>
      steinKnoten.get(s.stellung.join(',')),
    );

    if (dauer > 0) {
      for (const knoten of betroffene) schicht.append(knoten);
      // Eine halbe Drehung dauert länger als eine Vierteldrehung, aber nicht
      // doppelt so lang: Sie soll als ein Zug erkennbar bleiben.
      const vierteldrehungen = (zug % 3) + 1;
      laufendeAnimation = schicht.animate(
        [{ transform: 'rotate3d(0, 0, 1, 0deg)' }, { transform: cssDrehung(zug) }],
        {
          duration: dauer * (vierteldrehungen === 2 ? 1.5 : 1),
          // Sanft anlaufen und auslaufen, wie eine Hand es täte.
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
      );
      try {
        await laufendeAnimation.finished;
      } catch {
        // Abgebrochen, weil ein neuer Zustand gesetzt wurde. Die Steine
        // kehren trotzdem an ihren Platz zurück.
      }
      laufendeAnimation = null;
      schicht.style.transform = '';
    }

    for (const knoten of betroffene) koerper.append(knoten);

    // Ist zwischenzeitlich ein Zustand von außen gesetzt worden, gehört
    // dieses Ergebnis zu einem Würfel, den es nicht mehr gibt. Es würde den
    // gesetzten Zustand überschreiben; genau das ist beim ersten Bau
    // passiert, und der Würfel wurde beim Zurücksetzen mitten in einer Folge
    // nicht gelöst.
    if (!istVerworfen()) zeigeFacelets(facelets);
  }

  const ablauf = erzeugeAblauf(fuehreZugAus);

  // ------------------------------------------------------------- Blick
  //
  // Gedreht wird der Blick, niemals der Würfel. Alles, was hier geschieht,
  // ist das Setzen zweier Winkel; der Zustand des Kerns bleibt unberührt, und
  // R meint weiterhin die rechte Seite.

  // --------------------------------------------------------- Seitenkreuz
  //
  // Aus 4T-0065. Ein kleines Feld in der Ecke der Bühne, das benennt, welche
  // Seite gerade wo liegt. Es beantwortet die stille Frage vor jedem Tastenzug,
  // denn die Bezeichnungen bleiben fest, ihr Ort auf dem Bildschirm nicht.
  //
  // **Es steht neben dem Körper und nicht in ihm.** Nur so bleibt es von der
  // räumlichen Drehung unberührt und aufrecht; im Körper kippte es mit und wäre
  // bei flachem Blick unlesbar.
  //
  // **Warum kein Buchstabe am Würfel selbst.** Am 2026-08-18 gemessen: Eine
  // Marke außerhalb der Würfelfläche gibt es geometrisch nicht für jede Seite.
  // Wer eine Seite frontal ansieht, dem zeigt ihre Normale entgegen, und die
  // Projektion schrumpft auf einen Punkt in der Bildmitte. Selbst bei anderthalb
  // facher Verschiebung nach außen lagen 13 von 24 Marken noch auf dem Würfel.
  // Im eigenen Feld ist derselbe Fall kein Mangel, sondern die Aussage: Der
  // Buchstabe der zugewandten Seite steht in der Mitte.

  // **Zwei Kreuze und nicht eines.** Ein Gegenpaar liegt punktsymmetrisch und
  // fällt im selben Feld zusammen, sobald seine Achse zum Betrachter zeigt; am
  // 2026-08-18 gemessen lägen in 46 Prozent aller Blickwinkel zwei Buchstaben
  // näher beieinander als eine Buchstabenbreite. Getrennt nach zugewandt und
  // abgewandt bleiben im engsten Fall 22,8 px, gegen höchstens 14,4 px Schrift.
  //
  // Links die Seiten, die man sieht, rechts die verdeckten. Beide tragen
  // dieselbe gerechnete Richtung, denn eine abgewandte Seite liegt dort, wohin
  // ihre Normale zeigt, auch wenn niemand sie sieht.
  const kreuze = { vorn: null, hinten: null };
  const kreuzMarken = new Map();
  for (const lage of ['vorn', 'hinten']) {
    const feld = dokument.createElement('div');
    feld.className = `seitenkreuz seitenkreuz-${lage}`;
    // Aus der Vorlesehilfe genommen: Die Auskunft ist rein räumlich, und eine
    // Folge von sechs Buchstaben ohne Ort sagte dort nichts.
    feld.setAttribute('aria-hidden', 'true');
    buehne.append(feld);
    kreuze[lage] = feld;
  }
  for (const seite of SEITEN) {
    const marke = dokument.createElement('span');
    marke.className = 'seitenkreuz-marke notation';
    marke.textContent = seite;
    const strahl = dokument.createElement('span');
    strahl.className = 'seitenkreuz-strahl';
    kreuzMarken.set(seite, { marke, strahl, lage: null });
  }

  /** Setzt die sechs Buchstaben in ihr Kreuz und an ihren Ort. */
  function zeichneKreuz(blickJetzt) {
    for (const richtung of blickrichtungen(blickJetzt.x, blickJetzt.y)) {
      const eintrag = kreuzMarken.get(richtung.seite);
      // Eine streifende Seite hat die Tiefe null. Sie gehört nach hinten, denn
      // zu sehen ist sie nicht; `sichtbareSeiten` zählt sie ebenso wenig mit.
      const lage = richtung.tiefe > 1e-9 ? 'vorn' : 'hinten';
      if (eintrag.lage !== lage) {
        kreuze[lage].append(eintrag.strahl, eintrag.marke);
        eintrag.lage = lage;
      }
      // Der Buchstabe sitzt auf vierzig Prozent des Feldes, der Strahl reicht
      // vom Mittelpunkt bis kurz vor ihn. Beides in Prozent, damit das Kreuz
      // mit der Kantenlänge wächst.
      eintrag.marke.style.setProperty('--richtung-x', `${(richtung.x * 40).toFixed(2)}%`);
      eintrag.marke.style.setProperty('--richtung-y', `${(richtung.y * 40).toFixed(2)}%`);
      const laenge = Math.hypot(richtung.x, richtung.y);
      eintrag.strahl.style.setProperty('--laenge', `${(laenge * 30).toFixed(2)}%`);
      eintrag.strahl.style.setProperty(
        '--winkel',
        `${((Math.atan2(richtung.y, richtung.x) * 180) / Math.PI).toFixed(2)}deg`,
      );
    }
  }

  let blick = { ...AUSGANGSBLICK };
  const zuhoerer = [];

  const setzeBlick = (neu) => {
    blick = neu;
    koerper.style.setProperty('--blick-x', `${blick.x}deg`);
    koerper.style.setProperty('--blick-y', `${blick.y}deg`);
    // Hier und nicht in einem eigenen Takt: Das Kreuz sagt dasselbe wie die
    // beiden Winkel, nur in Buchstaben.
    zeichneKreuz(blick);
    for (const rueckruf of zuhoerer) rueckruf(blick);
  };

  let zeiger = null;
  let zuletzt = null;

  buehne.addEventListener('pointerdown', (ereignis) => {
    // Ein einziger Zeiger zur Zeit. Zwei Finger auf dem Würfel würden sonst
    // zwei Drehungen zugleich auslösen, die sich gegenseitig aufheben.
    if (zeiger !== null) return;
    zeiger = ereignis.pointerId;
    zuletzt = { x: ereignis.clientX, y: ereignis.clientY };
    // Der Zeiger wird eingefangen, damit das Ziehen weiterläuft, wenn er den
    // Würfel verlässt. Ohne das reißt die Drehung am Rand des Bereichs ab.
    buehne.setPointerCapture(zeiger);
    buehne.classList.add('greift');
  });

  buehne.addEventListener('pointermove', (ereignis) => {
    if (ereignis.pointerId !== zeiger) return;
    const dx = ereignis.clientX - zuletzt.x;
    const dy = ereignis.clientY - zuletzt.y;
    zuletzt = { x: ereignis.clientX, y: ereignis.clientY };
    setzeBlick(nachZug(blick, dx, dy));
  });

  const loslassen = (ereignis) => {
    if (ereignis.pointerId !== zeiger) return;
    zeiger = null;
    buehne.classList.remove('greift');
  };
  buehne.addEventListener('pointerup', loslassen);
  buehne.addEventListener('pointercancel', loslassen);

  setzeBlick(blick);

  return {
    knoten: buehne,

    /**
     * Zeigt einen Zustand, gegeben als die 54 Seitenbuchstaben des Kerns.
     *
     * Die Farbe steht als Verweis auf eine Variable des Stilblatts, nicht als
     * Wert. Damit wirkt ein Palettenwechsel ohne Zutun dieses Moduls und
     * fasst den Würfelzustand nicht an.
     */
    zeige: zeigeFacelets,

    /**
     * Spielt einen Zug als Bewegung ab.
     *
     * `facelets` ist der Zustand **nach** dem Zug, gerechnet vom Kern. Die
     * Darstellung rechnet nichts nach, sie zeigt.
     */
    spieleZug(zug, facelets) {
      ablauf.reiheEin({ zug, facelets });
    },

    /** Setzt die Dauer einer Vierteldrehung. Null schaltet die Bewegung ab. */
    setzeDauer(millisekunden) {
      dauer = Math.max(0, millisekunden);
    },

    /**
     * Hebt die Schicht des anstehenden Zuges hervor. `null` löscht sie.
     *
     * Angemeldet wird der Wunsch, gezeichnet wird er, sobald keine Bewegung
     * mehr aussteht. Bei abgeschalteter Bewegung ist das ein Herzschlag später
     * und für das Auge dasselbe.
     *
     * **Gewartet wird auf `ruhe` und nicht auf `laeuft` geprüft.** Am
     * laufenden Stand gemessen: Bei abgeschalteter Bewegung läuft die
     * Ausführung eines einzelnen Zuges vollständig durch, noch bevor die
     * Wiedergabe ihre Änderung meldet. Die Warteschlange gilt in diesem
     * Augenblick trotzdem als laufend, weil ihre Schleife erst einen
     * Herzschlag später endet. Eine Prüfung auf `laeuft` löschte die
     * Hervorhebung deshalb und niemand zeichnete sie wieder; bei einem
     * einzelnen Zug blieb sie aus, bei mehreren rasch hintereinander nicht.
     * Bleibt eine Bewegung offen, etwa in einem verborgenen Fenster, erfüllt
     * sich `ruhe` nicht, und die Hervorhebung bleibt aus. Das ist richtig so.
     */
    hebeHervor(zug) {
      gewuenschteHervorhebung = zug;
      loescheHervorhebung();
      const meiner = ++hervorLauf;
      ablauf.ruhe().then(() => {
        if (meiner === hervorLauf) zeichneHervorhebung();
      });
    },

    /**
     * Lässt allein den Stein an dieser Stellung stehen und nimmt den Rest
     * zurück. `null` hebt die Zurücknahme auf.
     */
    hebeSteinHervor: nimmZurueck,

    /** Die Flächen, die gerade eine Hervorhebung tragen. Für die Prüfung. */
    hervorgehoben: () => markiert.length,

    /** Die Flächen, die gerade stehen bleiben. Für die Prüfung. */
    stehengelassen: () => zielflaechen.length,

    /** Meldet jede gezeigte Hervorhebung, auch ihr Erlöschen. */
    aufHervorhebung(rueckruf) {
      hervorZuhoerer.push(rueckruf);
    },

    /** Ein Versprechen, das sich erfüllt, wenn keine Bewegung mehr aussteht. */
    ruhe: () => ablauf.ruhe(),

    /**
     * Verwirft wartende Bewegungen und bricht die laufende ab.
     *
     * Abgebrochen wird zur Ausgangslage zurück und nicht ans Ende der
     * Drehung: Wer anhält, setzt einen neuen Zustand, und eine Schicht, die
     * dabei noch schnell fertig dreht, zeigt einen Zwischenschritt, den es nie
     * gab.
     */
    haltAn() {
      ablauf.leere();
      laufendeAnimation?.cancel();
    },

    /**
     * Richtet den Blick aus.
     *
     * Von außen gesetzt wird er beim Zurückstellen und später beim Wechsel in
     * eine Lektion, die eine eigene Ausrichtung verlangt.
     */
    richteAus(grade) {
      setzeBlick({ ...grade });
    },

    /** Stellt die Ausgangsansicht wieder her. */
    zurueck() {
      setzeBlick({ ...AUSGANGSBLICK });
    },

    /** Steht der Würfel in der Ausgangsansicht? */
    istAusgangsansicht: () => gleich(blick, AUSGANGSBLICK),

    /** Meldet jede Änderung des Blicks. */
    aufBlickwechsel(rueckruf) {
      zuhoerer.push(rueckruf);
    },

    /** Meldet jeden gezeigten Zustand, auch den nach einer Bewegung. */
    aufZustand(rueckruf) {
      zustandsZuhoerer.push(rueckruf);
    },
  };
}
