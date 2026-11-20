// Die Abbildung vom Feld auf seinen Ort im Raum.
//
// Der Kern zählt 54 Felder, seitenweise in der Reihenfolge U R F D L B, je
// Seite zeilenweise von links oben nach rechts unten. Die Darstellung braucht
// dagegen 26 Steine mit ihrer Stellung im Gitter und je Feld die Richtung,
// in die es zeigt.
//
// **Diese Umrechnung ist der fehleranfällige Teil der Darstellung**, und sie
// ist reine Rechnung. Sie steht deshalb hier, getrennt von allem, was das
// Dokument anfasst, und wird über alle 54 Felder vollständig geprüft. Was
// danach kommt, setzt nur noch um, was hier herauskommt.
//
// Achsen: x nach rechts, y nach oben, z nach vorn. Jede Koordinate läuft von
// -1 bis 1, der Mittelpunkt (0,0,0) ist kein Stein.
//
// **Was ein Zug bewegt, sagt der Kern und nicht diese Datei.** Seit 4T-0099
// kommen Achse und Schichten aus `moveDescription`; hier wird daraus nur noch
// eine Richtung, ein Winkel und eine Auswahl von Steinen. Der Grund ist
// derselbe wie überall in dieser Datei: Eine zweite Rechnung über dieselbe
// Frage läuft der ersten davon, und zwar stillschweigend.

import { moveDescription, isFaceMove } from '../core/moves.js';

/** Die sechs Seiten in der Zählreihenfolge des Kerns. */
export const SEITEN = ['U', 'R', 'F', 'D', 'L', 'B'];

/** Die Richtung, in die jede Seite zeigt. */
export const NORMALEN = {
  U: [0, 1, 0],
  R: [1, 0, 0],
  F: [0, 0, 1],
  D: [0, -1, 0],
  L: [-1, 0, 0],
  B: [0, 0, -1],
};

/**
 * Stellung eines Feldes im Gitter.
 *
 * Der Kunstgriff steckt in der Wahl, welche Achse die Zeile und welche die
 * Spalte trägt, und in ihrem Vorzeichen. Sie folgt daraus, von wo man auf die
 * Seite blickt: Bei R liegt die erste Spalte vorn, bei L hinten, weil man in
 * die entgegengesetzte Richtung schaut. Wer das aus dem Kopf hinschreibt,
 * vertauscht zwei Seiten und merkt es erst am fertigen Bild.
 */
function stellung(seite, zeile, spalte) {
  switch (seite) {
    case 'U':
      return [spalte - 1, 1, zeile - 1];
    case 'D':
      return [spalte - 1, -1, 1 - zeile];
    case 'R':
      return [1, 1 - zeile, 1 - spalte];
    case 'L':
      return [-1, 1 - zeile, spalte - 1];
    case 'F':
      return [spalte - 1, 1 - zeile, 1];
    default:
      return [1 - spalte, 1 - zeile, -1];
  }
}

/**
 * Die lokalen Achsen einer Seitenfläche, in Weltkoordinaten.
 *
 * `rechts` und `unten` sind die Richtungen, in die Spalte und Zeile innerhalb
 * einer Seite wachsen. Sie sind damit zugleich die Richtungen, in die die
 * Kanten `rechts` und `unten` der Fläche im Dokument zeigen.
 *
 * **Hergeleitet aus `stellung` und nicht als Tabelle hingeschrieben.** Eine
 * zweite Tabelle neben `stellung` wäre eine zweite Wahrheit über dieselbe
 * Frage, und sie liefe ihr beim ersten Vorzeichenfehler davon. Dieselbe Falle
 * hat `stellung` selbst schon: Bei R liegt die erste Spalte vorn, bei L
 * hinten, weil man in die entgegengesetzte Richtung blickt.
 */
export function flaechenAchsen(seite) {
  const ursprung = stellung(seite, 0, 0);
  const minus = (a, b) => a.map((wert, i) => wert - b[i]);
  return {
    rechts: minus(stellung(seite, 0, 1), ursprung),
    unten: minus(stellung(seite, 1, 0), ursprung),
  };
}

/**
 * Die 54 Felder mit Seite, Stellung und Richtung.
 *
 * Der Index entspricht der Feldnummer des Kerns.
 */
export const FELDER = Array.from({ length: 54 }, (_, nummer) => {
  const seite = SEITEN[Math.floor(nummer / 9)];
  const innen = nummer % 9;
  return {
    nummer,
    seite,
    stellung: stellung(seite, Math.floor(innen / 3), innen % 3),
    normale: NORMALEN[seite],
  };
});

/**
 * Die Anordnung der Seiten im flachen Netz, als Zeile und Spalte.
 *
 * Die gebräuchliche Kreuzform: oben U, in der Mitte die vier Seitenflächen in
 * der Reihenfolge, in der man sie beim Drehen des Würfels nach links
 * durchläuft, unten D.
 *
 *        U
 *    L   F   R   B
 *        D
 *
 * B steht am Ende und nicht neben L, weil die Reihe dann von links nach
 * rechts derselben Drehung folgt. Wer den Würfel viermal nach links dreht,
 * sieht genau diese Folge.
 */
export const NETZ_ANORDNUNG = {
  U: [0, 1],
  L: [1, 0],
  F: [1, 1],
  R: [1, 2],
  B: [1, 3],
  D: [2, 1],
};

/**
 * Die Zahl der Augen, die eine Seite bei eingeschalteter Kennzeichnung trägt.
 *
 * Im Stilblatt ist sie eine Zeichnung aus Kreisen, hier eine Zahl. **Beide
 * Fassungen gehören zusammengehalten**, und eine Prüfung in
 * `test/oberflaeche.test.js` zählt die Kreise je Seite gegen diese Tabelle.
 *
 * Gebraucht wird sie für die Farbwahl der Zustandseingabe: Dort wählen die
 * Ziffern 1 bis 6 eine Farbe, und die Ziffer muss die sein, die der Anwender
 * auf dem Feldchen sieht. **Befund des Product Owners vom 2026-08-18**, an der
 * ersten Fassung von 4T-0067: Die naheliegende Reihenfolge `FACES` des Kerns,
 * also U R F D L B, hat mit der Augenzahl nichts zu tun. Die Taste 2 lieferte
 * dort Orange mit drei Augen und die Taste 6 Blau mit fünfen.
 *
 * **Die Augenzahl hängt an der Seite und nicht an der Farbe.** Damit gilt sie
 * unverändert für die alternative Palette, wo Grün und Rot als Türkis und
 * Magenta erscheinen.
 */
export const AUGENZAHL = { U: 1, F: 2, R: 3, L: 4, B: 5, D: 6 };

/**
 * Die sechs Seiten in der Reihenfolge ihrer Augenzahl.
 *
 * Die Stelle in dieser Liste ist zugleich die Taste, die sie wählt. Wer die
 * Farbwahl in dieser Reihenfolge aufreiht, braucht keine zweite Tabelle für die
 * Tastenbelegung: Der erste Knopf ist die 1.
 */
export const NACH_AUGENZAHL = Object.keys(AUGENZAHL).sort((a, b) => AUGENZAHL[a] - AUGENZAHL[b]);

/**
 * Die Stelle eines Feldes im flachen Netz, in Feldchen gezählt.
 *
 * Der Ursprung liegt oben links. Eine Seite ist drei Feldchen breit, deshalb
 * ist die Stelle das Dreifache ihrer Kachel plus die Zeile und Spalte
 * innerhalb der Seite. Das ist dieselbe Zeilen- und Spaltenrechnung wie in
 * der räumlichen Ansicht, hier aber ohne jede Drehung: Das Netz zeigt jede
 * Seite so, wie der Kern sie zählt.
 */
export function netzStelle(nummer) {
  const seite = SEITEN[Math.floor(nummer / 9)];
  const innen = nummer % 9;
  const [kachelZeile, kachelSpalte] = NETZ_ANORDNUNG[seite];
  return {
    seite,
    zeile: kachelZeile * 3 + Math.floor(innen / 3),
    spalte: kachelSpalte * 3 + (innen % 3),
  };
}

/** Alle 26 Steine mit ihrer Stellung und ihren Feldern. */
export const STEINE = (() => {
  const steine = new Map();
  for (const feld of FELDER) {
    const schluessel = feld.stellung.join(',');
    if (!steine.has(schluessel)) {
      steine.set(schluessel, { stellung: feld.stellung, felder: [] });
    }
    steine.get(schluessel).felder.push(feld);
  }
  return [...steine.values()];
})();

/**
 * Wieviele Felder trägt ein Stein an dieser Stellung?
 *
 * Genau so viele, wie er Koordinaten ungleich null hat: eine Ecke drei, eine
 * Kante zwei, ein Mittelstein eines.
 */
export function flaechenZahl(stellung_) {
  return stellung_.filter((wert) => wert !== 0).length;
}

/**
 * Die Feldnummern des Steins an dieser Stellung.
 *
 * Beide Ansichten brauchen sie: die räumliche, um seine Flächen auszuzeichnen,
 * das flache Netz, um dieselben Feldchen zu treffen. Gerechnet und nicht als
 * Liste hingeschrieben, denn eine Liste von Feldnummern ist genau die Art
 * Angabe, die niemand nachrechnet und die beim ersten Vorzeichenfehler in
 * `stellung` still falsch wird.
 */
export function felderDesSteins(stellung_) {
  const schluessel = stellung_.join(',');
  return FELDER.filter((feld) => feld.stellung.join(',') === schluessel).map((feld) => feld.nummer);
}

/**
 * Die Arbeitsstelle der Lektion 8: die Ecke oben vorn rechts.
 *
 * Dort dreht die Zugfolge `R' D' R D` die Ecke, und dorthin bringt der Anwender
 * die nächste. Die Stelle steht **hier** und nicht im Lektionskatalog, aus
 * demselben Grund wie der Blickwinkel: `lessons` läuft ohne Browser und trägt
 * deshalb Bezeichner, keine Koordinaten. Dass diese Stellung genau die Ecke
 * `URF` des Kerns trifft, ist nicht angenommen, sondern in
 * `test/view/geometrie.test.js` gegen den Kern gerechnet.
 */
export const ARBEITSECKE = [1, 1, 1];

/** Gehört die Stellung zu einer Schicht der Seite? */
export function inSchicht(stellung_, seite) {
  const [nx, ny, nz] = NORMALEN[seite];
  return stellung_[0] * nx + stellung_[1] * ny + stellung_[2] * nz === 1;
}

/**
 * Die drei Achsen des Zugraums als Richtung, in der Reihenfolge des Kerns.
 *
 * `moveDescription` zählt die Achsen als 0, 1 und 2. Welche Richtung dazu
 * gehört, sagt die positive Fläche der Achse: R für die erste, U für die
 * zweite, F für die dritte. Abgeleitet aus `NORMALEN` und nicht als Zahlen
 * hingeschrieben, damit hier keine zweite Tabelle neben jener steht.
 */
const ACHSEN = [NORMALEN.R, NORMALEN.U, NORMALEN.F];

/** Das Skalarprodukt zweier Richtungen. */
const punktprodukt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/**
 * Bewegt der Zug den Stein an dieser Stellung?
 *
 * **Die allgemeine Fassung von `inSchicht`.** Jene fragt nach einer Seite und
 * trifft damit genau eine Außenschicht; das reicht für die achtzehn
 * Flächendrehungen und für kein weiteres Zeichen der Notation. Diese hier
 * fragt nach einem Zug und liest aus seiner Beschreibung, welche Schichten
 * seiner Achse mitgehen.
 *
 * **`inSchicht` bleibt trotzdem.** Das flache Netz und die Lektionen fragen
 * nach einer Seite und nicht nach einem Zug; ihnen eine Zugnummer
 * abzuverlangen wäre ein Umweg über eine Angabe, die sie gar nicht haben.
 */
export function imZug(stellung_, zug) {
  const { achse, schichten } = drehungFuerZug(zug);
  return schichten.includes(punktprodukt(stellung_, achse));
}

/**
 * Die Drehung, die ein Zug an seinen Schichten vornimmt.
 *
 * Ein Zug dreht im Uhrzeigersinn, **von außen auf die positive Fläche seiner
 * Achse geblickt**. Nach der Rechte-Hand-Regel ist das eine Drehung um die
 * Achsrichtung mit negativem Winkel. Das ist die Stelle, an der ein Vorzeichen
 * die halbe Darstellung falsch macht, und deshalb wird sie gegen den Kern
 * geprüft und nicht aus dem Kopf gesetzt.
 *
 * **Achse und Schichten kommen aus dem Kern**, über `moveDescription`. Die
 * Darstellung leitet aus einem Zug-Index nicht selbst her, welche Schichten er
 * bewegt; das wäre eine zweite Wahrheit über dieselbe Frage.
 *
 * **`seite` gibt es nur noch bei den achtzehn Flächendrehungen**, sonst
 * `null`. Ein Zug, der zwei Schichten oder den ganzen Würfel dreht, hat keine
 * eine Seite, und ein Aufrufer, der eine erwartet, soll das an `null` merken
 * und nicht an einem stillschweigend falschen Buchstaben.
 *
 * `grad` ist negativ für eine Drehung in positiver Achsrichtung. Ein Zug, der
 * der negativen Fläche folgt, hat ein negatives `quarters` und damit ein
 * positives `grad`; das ist dieselbe Drehung, nur um die Gegenachse
 * beschrieben.
 */
export function drehungFuerZug(zug) {
  const { axis, layers, quarters } = moveDescription(zug);
  return {
    seite: isFaceMove(zug) ? SEITEN[Math.floor(zug / 3)] : null,
    achse: ACHSEN[axis],
    schichten: layers,
    grad: -90 * quarters,
  };
}

/**
 * Dieselbe Drehung in der Schreibweise des Browsers.
 *
 * Zwei Anpassungen sind nötig, und beide heben sich **nicht** auf:
 *
 * 1. Die senkrechte Achse zeigt im Browser nach unten. Die Achse wird
 *    deshalb an der waagerechten Ebene gespiegelt.
 * 2. Eine Spiegelung kehrt den Drehsinn um. Der Winkel wechselt daher das
 *    Vorzeichen.
 *
 * Wer nur eines von beidem macht, bekommt eine Schicht, die sich verkehrt
 * herum dreht und am Ende der Bewegung springt.
 */
export function cssDrehung(zug) {
  const { achse, grad } = drehungFuerZug(zug);
  const [ax, ay, az] = achse;
  return `rotate3d(${ax}, ${-ay}, ${az}, ${kurzerWeg(-grad)}deg)`;
}

/**
 * Der kürzeste Weg zu demselben Ergebnis, in Grad.
 *
 * Eine Dreivierteldrehung im einen Sinn endet dort, wo eine Vierteldrehung im
 * anderen endet. Für den Zustand ist das gleichgültig, für die Bewegung
 * nicht: Ohne diese Umrechnung dreht sich die Schicht bei jedem Zug mit
 * Gegenrichtung dreimal so weit und in die falsche Richtung. Der Zustand
 * stimmte am Ende trotzdem, und deshalb hätte keine Prüfung des Ergebnisses
 * es gefunden.
 */
function kurzerWeg(grad) {
  const rest = ((grad % 360) + 360) % 360;
  return rest > 180 ? rest - 360 : rest;
}

/** Die vier Kanten einer Fläche, so wie das Stilblatt sie anspricht. */
export const KANTEN = ['oben', 'rechts', 'unten', 'links'];

/**
 * Die Hervorhebung des anstehenden Zuges, als reine Rechnung.
 *
 * Sie beantwortet zwei Fragen mit zwei Mitteln. **Was sich dreht**, sagt der
 * Saum um alle 21 Flächen der Schicht. **Wohin es sich dreht**, sagt die Marke
 * an der vorauslaufenden Kante der zwölf Flächen des Rings.
 *
 * Die Arbeitsteilung folgt einer Messung: Die drehende Seite selbst ist in 51
 * Prozent der Blickwinkel verdeckt, der Ring aus den vier Nachbarseiten in
 * keinem. Wer von hinten auf den Würfel sieht, bekommt deshalb weiterhin die
 * vollständige Auskunft. Die neun Flächen der drehenden Seite bleiben ohne
 * Marke, weil ihre Bewegung dort ein Wirbel ist und je Fläche in eine andere
 * Richtung zeigte.
 *
 * **Bei der Halbdrehung stehen beide Kanten.** Das ist keine Notlösung,
 * sondern die richtige Aussage: Bei 180 Grad ist die Richtung tatsächlich
 * gleichgültig.
 *
 * Rückgabe: je Fläche der Schicht ihre Nummer und die Kanten als Zeichenkette,
 * durch Leerzeichen getrennt, oder leer.
 */
export function hervorhebung(zug) {
  const { achse, grad } = drehungFuerZug(zug);
  // Maßgeblich ist der kurze Weg und nicht die Zahl der Vierteldrehungen. Eine
  // Dreivierteldrehung sieht man als Vierteldrehung in die Gegenrichtung, und
  // genau die läuft auch in der Bewegung ab, siehe `cssDrehung`.
  const winkel = kurzerWeg(grad);
  const halb = Math.abs(winkel) === 180;
  // Die Drehachse mit Vorzeichen. Ein Zug im Uhrzeigersinn dreht nach der
  // Rechte-Hand-Regel negativ um die nach außen zeigende Richtung.
  const dreh = achse.map((wert) => wert * Math.sign(winkel));
  const kreuz = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const punkt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  const betroffene = new Set(
    STEINE.filter((stein) => imZug(stein.stellung, zug)).map((stein) => stein.stellung.join(',')),
  );

  return FELDER.filter((feld) => betroffene.has(feld.stellung.join(','))).map((feld) => {
    // Eine Fläche, deren Normale auf der Drehachse liegt, dreht sich um sich
    // selbst; ihre Bewegung ist dort ein Wirbel und zeigte je Fläche in eine
    // andere Richtung. Bei einer Flächendrehung ist das genau die drehende
    // Seite, bei einer Ganzdrehung sind es beide Flächen der Achse, bei einer
    // Mittelschicht keine. **Aus der Achse gerechnet und nicht an der Seite
    // festgemacht**, denn eine Seite hat nicht jeder Zug.
    if (Math.abs(punkt(feld.normale, achse)) === 1) return { nummer: feld.nummer, kanten: '' };
    // Die Bewegungsrichtung am Ort der Fläche. Das Kreuzprodukt liefert die
    // Tangente, nicht die Sehne: Wohin ein Feld am Ende landet, ist eine
    // andere Frage als die, in welche Richtung es losläuft, und gefragt ist
    // die zweite.
    const richtung = kreuz(dreh, feld.stellung);
    const { rechts, unten } = flaechenAchsen(feld.seite);
    const kanten = [];
    const nachRechts = punkt(richtung, rechts);
    const nachUnten = punkt(richtung, unten);
    // Genau eine der beiden Komponenten ist ungleich null, weil eine
    // Ringfläche sich entlang ihrer Reihe bewegt und nicht schräg.
    if (nachRechts > 0) kanten.push('rechts');
    if (nachRechts < 0) kanten.push('links');
    if (nachUnten > 0) kanten.push('unten');
    if (nachUnten < 0) kanten.push('oben');
    if (halb) {
      // Die Gegenkante dazu, damit die Marke beidseitig steht.
      const gegen = { oben: 'unten', unten: 'oben', links: 'rechts', rechts: 'links' };
      for (const kante of [...kanten]) kanten.push(gegen[kante]);
    }
    return { nummer: feld.nummer, kanten: kanten.join(' ') };
  });
}

/**
 * Dreht eine Stellung um eine der drei Achsen.
 *
 * Nur rechte Winkel, und die Achse ist immer eine Koordinatenachse. Damit
 * bleibt es bei ganzen Zahlen, und ein Rundungsfehler kann sich nicht
 * einschleichen.
 */
export function dreheStellung(stellung, achse, grad) {
  const schritte = ((Math.round(grad / 90) % 4) + 4) % 4;
  let [x, y, z] = stellung;
  const [ax, ay, az] = achse;
  for (let i = 0; i < schritte; i++) {
    // Drehung um 90 Grad im mathematisch positiven Sinn um die jeweilige
    // Achse, im Rechtssystem mit y nach oben.
    if (ax !== 0) [y, z] = ax > 0 ? [-z, y] : [z, -y];
    else if (ay !== 0) [x, z] = ay > 0 ? [z, -x] : [-z, x];
    else [x, y] = az > 0 ? [-y, x] : [y, -x];
  }
  // Das Vorzeichen der Null wird eingeebnet. Aus `-0` wird beim Negieren
  // einer Null nämlich tatsächlich `-0`, und ein strenger Vergleich hält das
  // für etwas anderes als `0`. Die Drehung wäre richtig und die Prüfung
  // trotzdem rot, ohne dass man den Grund im Zahlenwert sähe.
  return [x + 0, y + 0, z + 0];
}

/**
 * Wieviel Platz braucht der gedrehte Würfel?
 *
 * Liefert Breite und Höhe der Projektion in Kantenlängen. Ein Würfel aus drei
 * mal drei Steinen ist im Kasten drei Kanten breit, **auf dem Bildschirm aber
 * deutlich mehr**: Die Drehung stellt ihn auf die Diagonale, und die
 * Perspektive vergrößert die vordere Ecke zusätzlich.
 *
 * Das Layout merkt davon nichts, weil Transformationen den Textfluss nicht
 * anfassen. Wer die Bühne so groß macht wie den Kasten, bekommt einen Würfel,
 * der aus seinem Bereich herausragt. Genau das ist beim ersten Bau passiert,
 * und der Product Owner hat es im Bild gesehen.
 *
 * `perspektive` zählt in Kantenlängen, wie im Stilblatt.
 */
export function projizierteAusdehnung(blickX, blickY, perspektive) {
  const bogen = (grad) => (grad * Math.PI) / 180;
  const [sx, cx] = [Math.sin(bogen(blickX)), Math.cos(bogen(blickX))];
  const [sy, cy] = [Math.sin(bogen(blickY)), Math.cos(bogen(blickY))];
  let breite = 0;
  let hoehe = 0;
  // Die acht Ecken des Kastens, gemessen vom Mittelpunkt aus.
  for (const ex of [-1.5, 1.5]) {
    for (const ey of [-1.5, 1.5]) {
      for (const ez of [-1.5, 1.5]) {
        // Erst um die senkrechte, dann um die waagerechte Achse, wie der
        // Browser es tut.
        const x1 = ex * cy + ez * sy;
        const z1 = -ex * sy + ez * cy;
        const y2 = ey * cx - z1 * sx;
        const z2 = ey * sx + z1 * cx;
        // Perspektivische Verkleinerung mit der Entfernung. Die vordere Ecke
        // rückt näher und wird größer.
        const massstab = perspektive / (perspektive - z2);
        breite = Math.max(breite, Math.abs(x1 * massstab));
        hoehe = Math.max(hoehe, Math.abs(y2 * massstab));
      }
    }
  }
  return { breite: breite * 2, hoehe: hoehe * 2 };
}

/**
 * Welche Seiten zeigen bei diesem Blickwinkel zum Betrachter?
 *
 * Der Browser dreht erst um die waagerechte, dann um die senkrechte Achse.
 * Eine Seite ist sichtbar, wenn ihre gedrehte Richtung eine Komponente zum
 * Betrachter hin behält.
 *
 * Die Rechnung steht hier und nicht im Browser, weil sie sonst niemand prüfen
 * könnte: Ob wirklich drei Seiten zu sehen sind, ließe sich am fertigen Bild
 * nur mit dem Auge beurteilen, und ein um wenige Grad zu flacher Blick fällt
 * dabei nicht auf.
 */
export function sichtbareSeiten(blickX, blickY) {
  const bogen = (grad) => (grad * Math.PI) / 180;
  const [sx, cx] = [Math.sin(bogen(blickX)), Math.cos(bogen(blickX))];
  const [sy, cy] = [Math.sin(bogen(blickY)), Math.cos(bogen(blickY))];
  return SEITEN.filter((seite) => {
    const [x, y, z] = NORMALEN[seite];
    // In der Rechnung des Browsers zeigt die senkrechte Achse nach unten,
    // im Modell nach oben. Ohne dieses Vorzeichen kommt heraus, dass man von
    // unten auf den Würfel sieht, und die Ausgangsansicht wäre um zwei
    // Seiten falsch.
    const yCss = -y;
    // Der Browser wendet die Drehungen von rechts nach links an: erst um die
    // senkrechte Achse, dann um die waagerechte. Gefragt ist allein die
    // Tiefe des Ergebnisses.
    const zNachY = -x * sy + z * cy;
    const tiefe = yCss * sx + zNachY * cx;
    return tiefe > 1e-9;
  });
}

/**
 * Wo auf dem Bildschirm liegt jede sichtbare Seite?
 *
 * Aus 4T-0065. Die Erweiterung von `sichtbareSeiten` und **keine zweite
 * Wahrheit**: dieselben zwei Drehungen in derselben Reihenfolge, dieselbe
 * Umkehr der senkrechten Achse. Die Funktion darüber nimmt davon allein die
 * Tiefe; hier kommen die beiden anderen Komponenten dazu, also die Richtung in
 * der Bildebene. Eine eigene Tabelle im Anzeigecode wäre die Fehlerquelle, die
 * niemand bemerkt, denn sie bliebe stehen, wenn hier ein Vorzeichen kippt.
 *
 * **Die Länge der Richtung ist zugleich die Schrägheit der Seite:** null bei
 * frontalem Blick, eins bei streifendem. Das ist keine Randerscheinung,
 * sondern die Aussage. Wer eine Seite frontal ansieht, findet ihren Buchstaben
 * in der Mitte, und genau daran ist der zuerst gewählte Weg gescheitert, die
 * Marke außerhalb der Würfelfläche: In Richtung einer zugewandten Seite gibt
 * es kein Außerhalb.
 *
 * **Alle sechs Seiten, nicht nur die sichtbaren.** Das Vorzeichen der Tiefe
 * trennt sie: positiv heißt zugewandt, negativ abgewandt. Die Oberfläche
 * zeigt beide Gruppen, jede in einem eigenen Kreuz, denn eine abgewandte
 * Seite liegt punktsymmetrisch zu ihrer Gegenseite und fiele im selben Feld
 * mit ihr zusammen, sobald die Achse zum Betrachter zeigt. Am 2026-08-18
 * gemessen: In 46 Prozent aller Blickwinkel lägen zwei Buchstaben näher
 * beieinander als eine Buchstabenbreite. Getrennt sind es 22,8 px im engsten
 * Fall über 57 600 Winkel, gegen höchstens 14,4 px Schrift.
 *
 * `y` zählt wie im Browser nach unten.
 */
export function blickrichtungen(blickX, blickY) {
  const bogen = (grad) => (grad * Math.PI) / 180;
  const [sx, cx] = [Math.sin(bogen(blickX)), Math.cos(bogen(blickX))];
  const [sy, cy] = [Math.sin(bogen(blickY)), Math.cos(bogen(blickY))];
  const richtungen = [];
  for (const seite of SEITEN) {
    const [x, y, z] = NORMALEN[seite];
    const yCss = -y;
    const zNachY = -x * sy + z * cy;
    const tiefe = yCss * sx + zNachY * cx;
    richtungen.push({
      seite,
      x: x * cy + z * sy,
      y: yCss * cx - zNachY * sx,
      tiefe,
    });
  }
  return richtungen;
}
