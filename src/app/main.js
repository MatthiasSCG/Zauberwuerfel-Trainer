// Verdrahtung der Anwendung.
//
// Nach Grundsatz 3 der Architektur hängt kein Modul der Oberfläche von einem
// anderen ab; zusammengesteckt wird ausschließlich hier. Das ist die einzige
// Datei, die den Browserspeicher, die Sprachliste und die Systemvorgaben
// anfasst. Alle Module bekommen sie hereingereicht und bleiben damit ohne
// Browser prüfbar.

import { solvedCube, toFacelets, applyMoves, MOVE_COUNT, FACES } from '../core/cube.js';
import { formatMove, formatMoves, parseMovesOrThrow } from '../core/notation.js';
import { scramble } from '../core/scramble.js';
import { erzeugeVerlauf } from '../input/verlauf.js';
import { erzeugeEingabe, MITTEN } from '../input/eingabe.js';
import { waehleSprache, erzeugeTexte } from '../i18n/texte.js';
import { KATALOG, SCHLUESSEL, vorgaben } from '../settings/katalog.js';
import { erzeugeEinstellungen } from '../settings/einstellungen.js';
import { erzeugeWuerfel, DAUERN } from '../view/wuerfel.js';
import { erzeugeNetz } from '../view/netz.js';
import { erzeugeWiedergabe } from '../view/wiedergabe.js';
import { erzeugeLektionsbereich, bereichsstand } from '../view/lektion.js';
import { zugFuerTaste } from '../input/tasten.js';
import { erzeugeTastenfeld } from '../input/tastenfeld.js';
import { solveBeginner, nextStep, SEQUENCES, STEPS } from '../solver/beginner.js';
import { createRunner, BEGINNER, TWO_PHASE } from '../solver/runner.js';
import {
  demosFor,
  drillFor,
  focusFor,
  helpFor,
  lessonFor,
  sequencesFor,
  viewFor,
  FOCUS,
  HELP,
  VIEW,
} from '../lessons/catalog.js';
import { UNTERANSICHT } from '../view/blick.js';
import { ARBEITSECKE, NACH_AUGENZAHL } from '../view/geometrie.js';
import { createPath } from '../lessons/progress.js';
import { createSetup } from '../lessons/setup.js';

// ------------------------------------------------------------- Umgebung

/**
 * Der Browserspeicher als Ablage, oder `null`.
 *
 * Der Zugriff steht in einer Fallunterscheidung, weil ein Browser ihn
 * verweigern kann, statt nur nichts zu liefern. Beides ist derselbe Fall:
 * kein Speicher.
 */
function browserAblage() {
  try {
    const probe = '__probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return {
      lies: () => localStorage.getItem(SCHLUESSEL),
      schreibe: (text) => localStorage.setItem(SCHLUESSEL, text),
    };
  } catch {
    return null;
  }
}

// Die Umgebung wird hier ermittelt und nach unten gereicht. Die Zuordnung der
// Browserangaben zu einer Sprache leistet `i18n`, die Bewertung der
// Systemvorgabe der Katalog; `app` bringt beides zusammen.
const umgebung = {
  sprache: waehleSprache(navigator.languages ?? [navigator.language]),
  wenigerBewegung: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
};

const einstellungen = erzeugeEinstellungen({ ablage: browserAblage(), umgebung });
let text = erzeugeTexte(einstellungen.wert('sprache'));

// --------------------------------------------------------------- Texte

/** Füllt alle Knoten mit Bezeichner aus der gewählten Sprache. */
export function wendeTexteAn(wurzel, uebersetze) {
  for (const knoten of wurzel.querySelectorAll('[data-text]')) {
    knoten.textContent = uebersetze(knoten.dataset.text);
  }
}

// ------------------------------------------------------- Bedienelemente

/** Beschriftung eines Wertes, etwa «Für Farbfehlsichtigkeit». */
const wertText = (name, wert) => text(`wert.${name}.${wert}`);

/**
 * Baut das Bedienelement eines Feldes aus dem Katalog.
 *
 * Die Werte stehen nicht im Dokument, sondern kommen von hier. Zwei
 * Wahrheiten über den Wertebereich wären eine zu viel, und der Katalog ist
 * die, die geprüft wird.
 */
function baueBedienelement(feld, eintrag) {
  const art = feld.dataset.art;
  const beschriftung = feld.querySelector('label');

  if (art === 'auswahl') {
    const auswahl = document.createElement('select');
    auswahl.id = `e-${eintrag.name}`;
    for (const wert of eintrag.werte) {
      const eintragKnoten = document.createElement('option');
      eintragKnoten.value = wert;
      auswahl.append(eintragKnoten);
    }
    auswahl.addEventListener('change', () => einstellungen.setze(eintrag.name, auswahl.value));
    beschriftung.htmlFor = auswahl.id;
    beschriftung.after(auswahl);
    return auswahl;
  }

  if (art === 'segmente') {
    const gruppe = document.createElement('div');
    gruppe.className = 'segmente';
    gruppe.id = `e-${eintrag.name}`;
    gruppe.role = 'group';
    for (const wert of eintrag.werte) {
      const schalter = document.createElement('button');
      schalter.type = 'button';
      schalter.dataset.wert = wert;
      schalter.addEventListener('click', () => einstellungen.setze(eintrag.name, wert));
      gruppe.append(schalter);
    }
    beschriftung.after(gruppe);
    return gruppe;
  }

  // Kippschalter. Er trägt zwei Werte und steht deshalb neben seiner
  // Beschriftung statt darunter.
  const schalter = document.createElement('input');
  schalter.type = 'checkbox';
  schalter.className = 'kippschalter';
  schalter.id = `e-${eintrag.name}`;
  schalter.addEventListener('change', () =>
    einstellungen.setze(eintrag.name, schalter.checked ? 'an' : 'aus'),
  );
  feld.classList.add('feld-waagerecht');
  beschriftung.htmlFor = schalter.id;
  beschriftung.after(schalter);
  return schalter;
}

/**
 * Die Fußzeile mit Vorgabewert und Rückweg.
 *
 * S-0030 verlangt in AK3, dass jede Einstellung ihren Vorgabewert nennt und
 * sich einzeln darauf zurücksetzen lässt. Die Schaltfläche erscheint nur bei
 * abweichendem Wert: Ein Rücksetzen, das nichts zurücksetzt, ist Ballast in
 * jeder Zeile.
 */
function baueFuss(feld, eintrag) {
  const fuss = document.createElement('div');
  fuss.className = 'feld-fuss';
  const vorgabe = document.createElement('span');
  vorgabe.className = 'leise';
  const zurueck = document.createElement('button');
  zurueck.type = 'button';
  zurueck.className = 'zuruecksetzen';
  zurueck.hidden = true;
  zurueck.addEventListener('click', () => einstellungen.setzeZurueck(eintrag.name));
  fuss.append(vorgabe, zurueck);
  feld.append(fuss);
  return { vorgabe, zurueck };
}

const felder = new Map();
for (const eintrag of KATALOG) {
  const feld = document.querySelector(`[data-einstellung="${eintrag.name}"]`);
  if (!feld) continue;
  felder.set(eintrag.name, {
    eintrag,
    element: baueBedienelement(feld, eintrag),
    ...baueFuss(feld, eintrag),
  });
}

/** Zeigt den aktuellen Wert einer Einstellung in ihrem Bedienelement. */
function zeigeWert(name) {
  const feld = felder.get(name);
  if (!feld) return;
  const wert = einstellungen.wert(name);
  const { element, eintrag } = feld;

  if (element.tagName === 'SELECT') {
    for (const knoten of element.options) knoten.textContent = wertText(name, knoten.value);
    element.value = wert;
  } else if (element.classList.contains('segmente')) {
    for (const schalter of element.children) {
      schalter.textContent = wertText(name, schalter.dataset.wert);
      schalter.setAttribute('aria-pressed', String(schalter.dataset.wert === wert));
    }
  } else {
    element.checked = wert === 'an';
  }

  const vorgabewert = vorgaben(umgebung)[name];
  feld.vorgabe.textContent = text('einstellung.vorgabe', { wert: wertText(name, vorgabewert) });
  feld.zurueck.textContent = text('einstellung.zuruecksetzen');
  feld.zurueck.hidden = wert === vorgabewert;

  // Einstellungen, deren Ziel noch nicht gebaut ist, sagen das. Ein Regler
  // ohne erkennbare Wirkung wird sonst für kaputt gehalten.
  if (eintrag.wirkt !== 'sofort') {
    feld.vorgabe.textContent += ` · ${text('einstellung.spaeter')}`;
  }
}

// ------------------------------------------------------------- Wirkung

/**
 * Wendet eine Einstellung auf das Dokument an.
 *
 * Palette und Schriftgröße stehen als Merkmal am Wurzelknoten; das Stilblatt
 * liest sie und setzt die Farbwerte beziehungsweise die Grundgröße. Damit
 * bleibt die Zuordnung von Seite zu Farbe eine Frage der Anzeige und fasst
 * den Würfelzustand nicht an.
 */
function wirke(name) {
  const wert = einstellungen.wert(name);
  if (name === 'sprache') {
    text = erzeugeTexte(wert);
    document.documentElement.lang = wert;
    wendeTexteAn(document, text);
    for (const anderer of felder.keys()) zeigeWert(anderer);
    // Zähler, Abspieltaste und die Anzeige des anstehenden Zuges tragen keinen
    // festen Bezeichner, weil ihr Text vom Zustand abhängt. Sie werden deshalb
    // eigens nachgezogen, die Zugliste samt ihrer Schrittnamen ebenso.
    if (wiedergabeLaeuft()) baueZugliste();
    zeigeWiedergabestand();
    zeigeLektion();
    // Dasselbe gilt für die Eingabe: Ihre Zählung und die vorgelesenen
    // Beschriftungen sind Sätze über einen Zustand und tragen deshalb keinen
    // festen Bezeichner. Am 2026-08-18 in der Prüfung am Dokument gefunden;
    // die sichtbaren Texte gingen mit, die vorgelesenen blieben deutsch.
    zeigeEingabe();
    if (eingabeOffen) beschrifteFelder();
    // Und dasselbe für die Hinweiszeile, 4T-0084. Sie meldet ein Ereignis, das
    // nach dem Wechsel weiter gilt, und muss deshalb mitgehen statt zu weichen.
    if (hinweisStand !== null) hinweisZeile.textContent = text(hinweisStand);
    return;
  }
  if (name === 'palette' || name === 'schriftgroesse' || name === 'kennzeichnung') {
    document.documentElement.dataset[name] = wert;
    // **Der Befund der Prüfung nennt Farben beim Namen**, und zwei der sechs
    // heißen in der anderen Palette anders. Ohne dieses Nachziehen spräche der
    // Satz von Grün, während am Netz Türkis leuchtet. Derselbe Fall wie beim
    // Sprachwechsel darüber, nur eine Einstellung weiter.
    if (name === 'palette') zeigeBefundstand();
    return;
  }
  if (name === 'bewegung') {
    wuerfel.setzeDauer(DAUERN[wert]);
    return;
  }
  if (name === 'ansicht') {
    // Sichtbar ist immer genau eine der beiden Ansichten. Beide zugleich
    // zu zeigen hieße, denselben Zustand zweimal zu erklären.
    //
    // **Eine laufende Eingabe überstimmt die Einstellung, ohne sie zu ändern.**
    // Sie findet auf dem Netz statt, und wer währenddessen auf «räumlich»
    // stellt, bekäme sonst einen Würfel zu sehen, während er ein Feldchen
    // sucht. Weil allein die Anzeige überstimmt wird und nicht der gespeicherte
    // Wert, genügt derselbe Aufruf zum Zurückstellen, und ein Abbruch mitten in
    // der Eingabe hinterlässt nichts.
    const raeumlich = wert === 'raeumlich' && !eingabeOffen;
    wuerfelHalter.hidden = !raeumlich;
    netzHalter.hidden = raeumlich;
    // Der Blick lässt sich nur am Würfel drehen.
    ansichtZurueck.hidden = !raeumlich;
  }
}

einstellungen.aufAenderung((name) => {
  wirke(name);
  zeigeWert(name);
});

// ------------------------------------------------------ Sichern und Holen

const hinweisZeile = document.getElementById('hinweis');

/**
 * Der Bezeichner der stehenden Hinweiszeile, oder `null`.
 *
 * **Gehalten wird der Bezeichner und nicht der fertige Satz**, wie bei der
 * Rückmeldung des Pfades, der Auskunft der Hilfe und dem Fortschritt der
 * kurzen Lösung. Ein fertiger Satz bliebe beim Sprachwechsel in der alten
 * Sprache stehen, und zwar mitten in einer Anzeige, die sonst umgeschaltet
 * hat; S-0033 verlangt in AK2 ausdrücklich, dass kein Text zurückbleibt.
 *
 * **Am 2026-08-20 mit 4T-0084 nachgezogen.** Bis dahin traf es alle vier
 * Meldungen dieser Zeile, den fehlenden Speicher, den ergänzten Stand und die
 * beiden Antworten auf «Aus Datei holen». Aufgefallen ist es beim Prüfen der
 * fünften, der Meldung über den gelöschten Fortschritt.
 */
let hinweisStand = null;

function zeigeHinweis(bezeichner) {
  hinweisStand = bezeichner;
  hinweisZeile.textContent = text(bezeichner);
  hinweisZeile.hidden = false;
}

document.getElementById('alles-zuruecksetzen').addEventListener('click', () => {
  if (window.confirm(text('einstellung.allesWirklich'))) einstellungen.setzeAllesZurueck();
});

document.getElementById('sichern').addEventListener('click', () => {
  // Als lesbarer Text, damit ein Anwender die Datei öffnen und verstehen
  // kann, was er da in der Hand hält.
  const blob = new Blob([einstellungen.alsText()], { type: 'application/json' });
  const adresse = URL.createObjectURL(blob);
  const verweis = document.createElement('a');
  verweis.href = adresse;
  verweis.download = `${SCHLUESSEL}.json`;
  verweis.click();
  URL.revokeObjectURL(adresse);
});

const dateiFeld = document.getElementById('datei');
document.getElementById('holen').addEventListener('click', () => {
  if (window.confirm(text('ablage.ueberschreiben'))) dateiFeld.click();
});

dateiFeld.addEventListener('change', async () => {
  const datei = dateiFeld.files?.[0];
  if (!datei) return;
  const ergebnis = einstellungen.uebernimm(await datei.text());
  // Das Feld wird geleert, damit dieselbe Datei ein zweites Mal ausgewählt
  // werden kann. Ohne das bleibt der Wert stehen und die Änderung bleibt aus.
  dateiFeld.value = '';
  zeigeHinweis(ergebnis.ok ? 'ablage.geholt' : 'ablage.abgewiesen');
});

// --------------------------------------------------------------- Würfel

// Der Zustand liegt im Kern, die Darstellung zeigt ihn. Ab hier gibt es kein
// Lebenszeichen mehr: Dass die Modulkette trägt, sieht man am Würfel.
const wuerfel = erzeugeWuerfel(document);
const netz = erzeugeNetz(document);
const wuerfelHalter = document.getElementById('wuerfel-halter');
const netzHalter = document.getElementById('netz-halter');
wuerfelHalter.append(wuerfel.knoten);
netzHalter.append(netz.knoten);

// Das Netz zeigt denselben Zustand und folgt der räumlichen Ansicht
// unmittelbar. Es hängt sich an deren Meldung, damit es nach einer Bewegung
// im selben Augenblick wechselt und nicht schon beim Auslösen des Zuges.
wuerfel.aufZustand((facelets) => netz.zeige(facelets));

// Dasselbe für die Hervorhebung des anstehenden Zuges: Das Netz folgt der
// räumlichen Ansicht und führt keinen eigenen Takt. Damit erlischt sie dort im
// selben Augenblick, in dem eine Bewegung anläuft.
wuerfel.aufHervorhebung((zug) => netz.hebeHervor(zug));

// Der Zustand liegt im Verlauf, nicht in der Darstellung. Sie bekommt nach
// jedem Zug das fertige Ergebnis und rechnet selbst nichts nach; zwei
// Wahrheiten über den Würfel liefen früher oder später auseinander.
//
// Der Verlauf lebt hier und nicht in einer der beiden Ansichten. Deshalb
// übersteht er den Wechsel zwischen räumlicher Darstellung und Netz, wie
// S-0008 in AK5 verlangt.
const verlauf = erzeugeVerlauf();
wuerfel.zeige(toFacelets(verlauf.zustand()));

/**
 * Läuft gerade eine Zustandseingabe über das Netz?
 *
 * Steht hier oben und nicht im Abschnitt der Eingabe, weil die Sperrung der
 * übrigen Bedienung sie liest und vor ihm läuft. Der Abschnitt selbst steht
 * unten, denn er braucht den Lektionsbereich.
 *
 * **Eingabe und Wiedergabe schließen einander aus.** Die Schaltfläche zum
 * Beginnen wird während einer Wiedergabe gesperrt, und damit gibt es keinen
 * Zustand, in dem beide laufen. Das erspart die Frage, was eine Eingabe mit
 * einer halb abgespielten Lösung anstellt.
 */
let eingabeOffen = false;

// Nach jedem Zug am Übungswürfel wird geprüft, ob das Ziel der laufenden
// Lektion steht. Das Rückwärtsgehen zählt mit: Es ist der Zustand des Würfels,
// der entscheidet, und nicht der Weg dorthin.
function spiele(zug) {
  verlauf.fuehreAus(zug);
  wuerfel.spieleZug(zug, toFacelets(verlauf.zustand()));
  zeigeVerlaufsstand();
  verwirfHilfe();
  pruefeUebung();
}

/** Nimmt den letzten Zug zurück und zeigt die Rückdrehung. */
function nimmZurueck() {
  const gegenzug = verlauf.nimmZurueck();
  if (gegenzug === null) return;
  wuerfel.spieleZug(gegenzug, toFacelets(verlauf.zustand()));
  zeigeVerlaufsstand();
  verwirfHilfe();
  pruefeUebung();
}

/** Stellt den nächsten zurückgenommenen Zug wieder her. */
function stelleWieder() {
  const zug = verlauf.stelleWieder();
  if (zug === null) return;
  wuerfel.spieleZug(zug, toFacelets(verlauf.zustand()));
  zeigeVerlaufsstand();
  verwirfHilfe();
  pruefeUebung();
}

/**
 * Setzt den Würfel auf einen Zustand.
 *
 * Wartende Bewegungen werden verworfen: Eine Drehung, die nach dem Setzen
 * eintrifft, gehörte zu einem Würfel, den es nicht mehr gibt.
 *
 * **Eine laufende Übung endet hier, ohne zu zählen.** Sie lief auf einer Lage,
 * die es nach dem Setzen nicht mehr gibt. Ohne diesen Abbruch erfüllte ein
 * gesetzter gelöster Würfel beim nächsten Zug jedes Ziel des Pfades, und die
 * Prüfung am Würfel wäre mit zwei Klicks zu umgehen. Wer eine Übung auflegt,
 * beginnt sie unmittelbar danach neu; die Reihenfolge in `beginneUebung` ist
 * genau deshalb setzen und dann beginnen.
 */
function setze(neu) {
  return uebernimmZustand(() => verlauf.setze(neu));
}

/**
 * Setzt den Würfel aus einer Eingabe über das Netz, gegeben als die 54
 * Seitenbuchstaben. Liefert den Befund der Prüfung.
 *
 * Der zweite Eingang aus 4T-0070. Er ist nötig, weil eine Eingabe, die die
 * Prüfung nicht besteht, gar keinen Zustand auf Steinebene ergibt.
 */
function setzeAusFeldern(facelets) {
  return uebernimmZustand(() => verlauf.setzeAusFeldern(facelets));
}

/**
 * Führt eine Setzung aus und zieht die Anzeige nach, wenn sie bestanden hat.
 *
 * **Die Nebenwirkungen laufen erst nach bestandener Prüfung**, seit 4T-0070.
 * Bis dahin liefen sie immer, weil hier ausschließlich Zustände ankamen, für
 * die die Prüfung eine Formsache ist. Mit der Eingabe von Hand kommt der erste
 * an, der sie nicht besteht, und ein abgewiesener Zustand darf nicht abbrechen,
 * was noch gilt: Der Anwender verlöre seine laufende Übung für einen Druck,
 * der gar nichts bewirkt hat.
 *
 * Geprüft wird nicht hier, sondern in `verlauf`. Diese Stelle wertet nur den
 * Befund aus, den sie ohnehin zurückbekommt.
 */
function uebernimmZustand(setzung) {
  const befund = setzung();
  if (!befund.ok) return befund;
  wuerfel.haltAn();
  wuerfel.zeige(toFacelets(verlauf.zustand()));
  zeigeVerlaufsstand();
  pfad.abort();
  // Die Meldung geht mit der Übung. Am 2026-08-16 im Handtest gefunden: Sie
  // blieb nach dem Abbruch stehen und sagte «die Übungslage steht», während
  // eine ganz andere Lage auf dem Tisch lag. Eine Meldung, die einen Zustand
  // behauptet, den es nicht mehr gibt, ist schlimmer als keine.
  rueckmeldung = null;
  // Aus demselben Grund geht auch die Auskunft der Hilfe. Sie nennt den
  // nächsten Schritt für eine Lage, die es nach dem Setzen nicht mehr gibt.
  hilfe = null;
  hilfeNummer++;
  // Und aus demselben Grund der Rückweg in die Lösung: Sie ist zu diesem Würfel
  // gerechnet worden, und den gibt es nach dem Setzen nicht mehr. Der Weg führt
  // über `knopfBeenden` und über `beginneUebung` hierher, also über beide
  // Stellen, an denen eine Lösung endet.
  rueckweg = null;
  // Und aus demselben Grund die Verwürfelung in Notation, 4T-0083: Sie
  // beschreibt den Zustand, auf dem der Verlauf bis eben aufsetzte. Sie steht
  // hier und nicht an den fünf Stellen, die setzen; die Anzeige entscheidet
  // selbst über ihre Gültigkeit, siehe `zeigeVerwuerfelung`.
  zeigeVerwuerfelung();
  zeigeLektion();
  return befund;
}

// Die Rückstellung ist nicht Beiwerk: Eine verdrehte Ansicht macht die
// Notation unbrauchbar, weil der Anwender nicht mehr weiß, welche Seite vorn
// ist. Die Schaltfläche bleibt stehen und wird nur untätig, damit das Layout
// beim Drehen nicht springt.
const ansichtZurueck = document.getElementById('ansicht-zurueck');
ansichtZurueck.addEventListener('click', () => wuerfel.zurueck());
wuerfel.aufBlickwechsel(() => {
  ansichtZurueck.disabled = wuerfel.istAusgangsansicht();
});
ansichtZurueck.disabled = wuerfel.istAusgangsansicht();

// Das Tastenfeld aus 4T-0031. Achtzehn Drucktasten, jede mit ihrer
// Tastenkombination beschriftet, und damit zugleich die Übersicht der
// Belegung.
//
// **Zeigen hebt hervor, 4T-0065.** Wer auf eine Taste zeigt oder sie mit der
// Tastatur ansteuert, sieht am Würfel, welche Schicht sie dreht und wohin.
// Beim Verlassen fällt die Hervorhebung auf den Stand der Wiedergabe zurück
// und nicht einfach auf nichts; sonst löschte ein Streifen über das Tastenfeld
// den anstehenden Zug.
const tastenfeld = erzeugeTastenfeld(document, spiele, (zug) =>
  wuerfel.hebeHervor(zug ?? hervorhebungDerWiedergabe()),
);
document.getElementById('tastenfeld-halter').append(tastenfeld.knoten);

// Die Tastatur ist der schnelle Weg. Sie hört am Dokument, damit sie überall
// greift, und hält sich von Eingabefeldern fern: Wer in ein Textfeld tippt,
// will keinen Würfel drehen.
document.addEventListener('keydown', (ereignis) => {
  // Während einer Wiedergabe ist der Übungswürfel gesperrt. Ein eigener Zug
  // machte die abgespielte Zugfolge ungültig, und der Zähler nennte danach
  // eine Stelle in einer Folge, die zu diesem Würfel nicht mehr passt.
  //
  // Während einer Eingabe ebenso, und dort aus einem zweiten Grund: Die
  // Notationsbuchstaben lägen sonst über der Bedienung des Netzes, und ein
  // Druck auf F drehte den Übungswürfel, während der Anwender ein Feldchen
  // sucht.
  if (wiedergabeLaeuft() || eingabeOffen) return;
  // Geprüft wird über die Fähigkeit und nicht über den Typ: Das Ziel eines
  // Tastendrucks ist nicht in jedem Fall ein Element.
  const ziel = ereignis.target;
  if (ziel?.matches?.('input, select, textarea, [contenteditable]')) return;
  // Die Steuerungstaste bleibt dem Browser. Alle sechs Kombinationen sind
  // dort belegt, von der Quelltextanzeige bis zum Lesezeichen.
  if (ereignis.ctrlKey || ereignis.metaKey) return;

  const zug = zugFuerTaste({
    taste: ereignis.key,
    lage: ereignis.code,
    umschalt: ereignis.shiftKey,
    alt: ereignis.altKey,
  });
  if (zug === null) return;
  // Erst hier unterdrückt, nicht vorher: Tasten ohne Bedeutung sollen ihre
  // gewohnte Wirkung behalten.
  ereignis.preventDefault();
  spiele(zug);
  tastenfeld.melde(zug);
});

document.getElementById('vorfuehr-folge').addEventListener('click', () => {
  // Zehn Züge in einem Wimpernschlag: Sie müssen sich einreihen, statt sich
  // gegenseitig zu überschreiben.
  for (let i = 0; i < 10; i++) spiele(Math.floor(Math.random() * MOVE_COUNT));
});

// --------------------------------------------------------------- Verlauf

const knopfZurueck = document.getElementById('verlauf-zurueck');
const knopfWieder = document.getElementById('verlauf-wieder');

/** Zeigt an, was zurückgenommen und was wiederhergestellt werden kann. */
function zeigeVerlaufsstand() {
  knopfZurueck.disabled = !verlauf.kannZurueck();
  knopfWieder.disabled = !verlauf.kannWieder();
}

knopfZurueck.addEventListener('click', nimmZurueck);
knopfWieder.addEventListener('click', stelleWieder);

/**
 * Fragt vor einem Zurücksetzen, wenn seit dem letzten Setzen geübt wurde.
 *
 * Ohne die Frage verliert ein Fehlgriff eine halbe Übungsstunde. Mit ihr
 * kostet er einen Tastendruck.
 */
function setzeMitRueckfrage(neu) {
  if (verlauf.stelle() > 0 && !window.confirm(text('verlauf.wirklich'))) return false;
  // Der Befund kommt zurück, damit der Aufrufer weiß, ob wirklich gesetzt
  // wurde. Die Verwürfelung braucht das: Ihre Anzeige darf erst entstehen,
  // nachdem der Zustand steht, sonst löschte eine abgelehnte Rückfrage die
  // Folge, die noch am Bildschirm gilt.
  return setze(neu).ok;
}

document
  .getElementById('verlauf-geloest')
  .addEventListener('click', () => setzeMitRueckfrage(solvedCube()));

// --------------------------- Die Verwürfelung in Notation, aus 4T-0083

const verwuerfelungZeile = document.getElementById('verwuerfelung');
const verwuerfelungZuege = document.getElementById('verwuerfelung-zuege');

/**
 * Die zuletzt erzeugte Verwürfelung, oder `null`.
 *
 * Geführt werden die Zugfolge und die 54 Felder des Zustands, den sie erzeugt
 * hat. Beide entstehen an derselben Stelle und im selben Augenblick; die
 * Felder ein zweites Mal auszurechnen hieße, die Annahme «eine Verwürfelung
 * beginnt am gelösten Würfel» ein zweites Mal aufzuschreiben.
 */
let verwuerfelung = null;

/**
 * Zeigt die Verwürfelung, solange sie den Würfel beschreibt.
 *
 * **Sichtbar oder nicht wird gerechnet und nicht mitgeführt.** Die Folge gilt
 * genau so lange, wie der Verlauf auf dem Zustand aufsetzt, den sie erzeugt
 * hat. Damit ist AK3 nicht eine Zusage, sondern eine Eigenschaft: Sie
 * verschwindet bei jedem der vier Fälle, die der Product Owner am 2026-08-20
 * benannt hat, also beim gelösten Würfel, bei einer neuen Verwürfelung, bei
 * einer übernommenen Eingabe und bei einer Übungslage aus dem Lernpfad. Eine
 * eigene Angabe wäre an fünf Stellen zurückzusetzen, und die vergessene sechste
 * ließe eine Folge stehen, die nichts mehr beschreibt.
 *
 * **Eigene Züge nehmen sie nicht fort**, denn sie ändern den Ausgangszustand
 * nicht. Das ist die erste Festlegung des Product Owners: Wer die Folge auf
 * seinen eigenen Würfel überträgt, dreht dabei am Bildschirm mit, und eine
 * Anzeige, die beim ersten Zug verschwindet, ist genau dann fort, wenn sie
 * gebraucht wird. «Zehn zufällige Züge» führt aus demselben Grund weder zum
 * Löschen noch zum Füllen.
 *
 * **Der fünfte Fall ist «Wiedergabe beenden»**, und er ist der Grund für den
 * Vergleich statt eines schlichten Löschens. Dort wird der gezeigte Stand
 * übernommen; hat der Anwender die Lösung abgespielt, ist es ein anderer
 * Würfel und die Folge geht, hat er sie nur erzeugt und sofort beendet, steht
 * derselbe Würfel und die Folge bleibt.
 */
function zeigeVerwuerfelung() {
  const gilt =
    verwuerfelung !== null &&
    verwuerfelung.felder === toFacelets(verlauf.ausgangszustand()).join('');
  verwuerfelungZeile.hidden = !gilt;
  verwuerfelungZuege.textContent = gilt ? formatMoves(verwuerfelung.zuege) : '';
}

document.getElementById('verlauf-verwuerfeln').addEventListener('click', () => {
  // Die Verwürfelung kommt aus dem Kern und hält dessen zwei Regeln ein.
  const zuege = scramble();
  const neu = applyMoves(solvedCube(), zuege);
  // Erst setzen, dann festhalten. Andersherum verlöre eine abgelehnte
  // Rückfrage die Folge, die bis dahin galt.
  if (!setzeMitRueckfrage(neu)) return;
  verwuerfelung = { zuege, felder: toFacelets(neu).join('') };
  zeigeVerwuerfelung();
});

// Zurücknehmen und Wiederherstellen auch über die Tastatur, mit den
// Kombinationen, die jeder kennt. Außerhalb von Eingabefeldern sind sie im
// Browser frei; die Prüfung darauf steht oben in derselben Behandlung.
document.addEventListener('keydown', (ereignis) => {
  if (!ereignis.ctrlKey && !ereignis.metaKey) return;
  if (ereignis.target?.matches?.('input, select, textarea, [contenteditable]')) return;
  const taste = ereignis.key.toLowerCase();
  if (taste !== 'z' && taste !== 'y') return;
  ereignis.preventDefault();
  // **Während einer Eingabe gehört die Rücknahme ihr**, 4T-0068. Ohne diese
  // Weiche drehte Strg+Z den Übungswürfel zurück, während die Schaltfläche
  // dafür gesperrt ist und das Netz die Eingabe zeigt: Der Anwender sähe die
  // Wirkung erst nach dem Beenden, an einem Würfel, den er nicht angefasst
  // hat. Am 2026-08-18 an der laufenden Seite gemessen.
  //
  // Ein Wiederherstellen gibt es in der Eingabe nicht. Sie kennt nur die
  // Rücknahme, und eine Taste ohne Gegenstand tut hier besser nichts.
  if (eingabeOffen) {
    if (taste === 'z' && !ereignis.shiftKey) nimmSetzungZurueck();
    return;
  }
  if (taste === 'y' || ereignis.shiftKey) stelleWieder();
  else nimmZurueck();
});

zeigeVerlaufsstand();

// ----------------------------------------------------------- Wiedergabe

// Die Wiedergabe kennt weder Löser noch Einstellung. Sie bekommt die
// Darstellung, die Uhr und den Takt hereingereicht; verdrahtet wird hier.
const wiedergabe = erzeugeWiedergabe({
  darstellung: wuerfel,
  warte: (millisekunden) => new Promise((fertig) => window.setTimeout(fertig, millisekunden)),
  // Bei abgeschalteter Bewegung ruht die Darstellung sofort, und ohne Takt
  // liefen hundertfünfzig Züge in einem Wimpernschlag durch. «Aus» bedeutet
  // keine Bewegung, nicht keine Zeit; deshalb gilt dann die mittlere Stufe.
  // Läuft eine Bewegung, ist sie selbst der Takt.
  pause: () => (einstellungen.wert('bewegung') === 'aus' ? DAUERN.mittel : 0),
});

/**
 * Woher die geladene Zugfolge stammt, oder `null`.
 *
 * Beide Arten sperren den Übungswürfel, denn ein eigener Zug machte die
 * abgespielte Folge in beiden Fällen ungültig. Sie unterscheiden sich allein
 * beim Beenden, siehe `knopfBeenden`.
 */
const WIEDERGABE = { LOESUNG: 'loesung', VORFUEHRUNG: 'vorfuehrung' };
let wiedergabeArt = null;
const wiedergabeLaeuft = () => wiedergabeArt !== null;

const standZeile = document.getElementById('wiedergabe-stand');
const knopfAbspielen = document.getElementById('wg-abspielen');
const knopfBeenden = document.getElementById('wiedergabe-beenden');
// Die beiden Schaltflächen, die zwischen Eingabe und Wiedergabe vermitteln.
// Sie stehen hier, weil `zeigeWiedergabestand` sie sperrt und vor dem
// Abschnitt der Eingabe läuft.
const knopfEingabe = document.getElementById('eingabe-beginnen');
const knopfLoesen = document.getElementById('loesung-erzeugen');
const knopfKurz = document.getElementById('loesung-kurz');
const knopfAbbrechen = document.getElementById('loesung-abbrechen');
const kurzFortschritt = document.getElementById('loesung-fortschritt');

/**
 * Der Stand der kurzen Lösung, 4T-0082.
 *
 * `kurzStand` hält den Bezeichner und seine Werte statt des fertigen Satzes,
 * aus demselben Grund wie bei der Hilfe: Ein fertiger Satz bliebe beim
 * Sprachwechsel in der alten Sprache stehen.
 *
 * `kurzNummer` zählt die Anfragen. Eine Antwort, die eintrifft, nachdem der
 * Würfel sich weitergedreht hat, gehört zu einer Lage, die es nicht mehr gibt.
 * Der Läufer weiß davon nichts; er rechnet die Anfrage zu Ende.
 */
let kurzStand = null;
let kurzNummer = 0;
let kurzLaeuft = false;
let kurzAbbruch = null;
/**
 * Ob die laufende Wiedergabe die kurze Lösung zeigt.
 *
 * **Abgeleitet und nicht mitgeführt.** Die kurze Lösung ist die einzige
 * Wiedergabe, die eine Lösung ist und keine Gliederung trägt: Eine Vorführung
 * ist keine Lösung, und die Lernlösung hat immer Schritte. Eine eigene Angabe
 * müsste an vier Stellen zurückgesetzt werden, an denen die Art wechselt, und
 * die vergessene fünfte ließe den Satz über die kurze Lösung neben einer
 * Lernlösung stehen.
 *
 * Keine dritte Art in `WIEDERGABE`, denn die kurze Lösung **ist** eine Lösung
 * und verhält sich überall so: beim Beenden, beim Rückweg aus der Lektion und
 * beim Übernehmen des gezeigten Standes.
 */
const zeigtKurzloesung = () => wiedergabeArt === WIEDERGABE.LOESUNG && !wiedergabe.hatGliederung();
const uebungsknoepfe = [
  knopfZurueck,
  knopfWieder,
  document.getElementById('verlauf-geloest'),
  document.getElementById('verlauf-verwuerfeln'),
  document.getElementById('vorfuehr-folge'),
];
const steuerknoepfe = [
  ['wg-anfang', () => wiedergabe.zumAnfang()],
  ['wg-schritt-zurueck', () => wiedergabe.vorigerSchritt()],
  ['wg-zug-zurueck', () => wiedergabe.zurueck()],
  ['wg-zug-vor', () => wiedergabe.vor()],
  ['wg-schritt-vor', () => wiedergabe.naechsterSchritt()],
  ['wg-ende', () => wiedergabe.zumEnde()],
].map(([kennung, handlung]) => {
  const knopf = document.getElementById(kennung);
  knopf.addEventListener('click', handlung);
  return knopf;
});

// ------------------------------------------- Anstehender Zug, aus 4T-0034

const anstehendBereich = document.getElementById('anstehend');
const anstehendNotation = document.getElementById('anstehend-notation');
const anstehendKlartext = document.getElementById('anstehend-klartext');
const anstehendGriff = document.getElementById('anstehend-griff');
const anstehendSchritt = document.getElementById('anstehend-schritt');
const anstehendFortschritt = document.getElementById('anstehend-fortschritt');
const anstehendBegruendung = document.getElementById('anstehend-begruendung');
const anstehendLektion = document.getElementById('anstehend-lektion');
const zuglisteKnoten = document.getElementById('zugliste');

/** Die Zug-Indizes der Zugliste, in der Reihenfolge ihrer Elemente. */
const zuglisteFelder = new Map();

/**
 * Der Zug in Worten, etwa «rechte Seite, gegen den Uhrzeigersinn».
 *
 * Der Zug-Index zählt Seitenindex mal drei plus Anzahl der Vierteldrehungen
 * minus eins, wie im Kern. Eine, zwei und drei Vierteldrehungen sind damit
 * Uhrzeigersinn, halbe Umdrehung und Gegenrichtung.
 */
function klartext(zug) {
  const arten = ['uhr', 'halb', 'gegen'];
  return text('anstehend.klartext', {
    seite: text(`seite.${FACES[Math.floor(zug / 3)]}`),
    richtung: text(`richtung.${arten[zug % 3]}`),
  });
}

/** Wo eine Stelle innerhalb eines Bereichs liegt. Für die beiden Kennzeichnungen. */
const lage = (n, von, anzahl) => {
  if (anzahl === 1) return 'einzeln';
  if (n === von) return 'anfang';
  return n === von + anzahl - 1 ? 'ende' : 'mitte';
};

/**
 * Baut die Zugliste neu auf, nach Schritten gegliedert.
 *
 * **Gegliedert und nicht flach.** Bei gemessen 108 Zügen im Median ist eine
 * flache Liste eine Wand aus Buchstaben, in der man die Stelle sucht statt sie
 * zu finden. Eine Zugfolge ohne Gliederung, also die Kurzlösung, bleibt eine
 * einzige Gruppe ohne Überschrift.
 *
 * **Zwei Kennzeichnungen, die einander überlappen**, aus 4T-0040: die gelernte
 * Zugfolge und der Griff. Gemessen berühren 12 590 von 17 173 mehrzügigen
 * Griffen eine gelernte Folge an ihrem Rand und 4 583 sogar zwei; keiner liegt
 * in ihrem Inneren. Beide hängen deshalb an den **einzelnen Zügen** und nicht an einem
 * umschließenden Element: Ein Element, das die Folge umschlösse, könnte den
 * Griff nicht mehr aufnehmen, und umgekehrt.
 *
 * Sie entsteht nur beim Laden und beim Sprachwechsel neu. Bei jeder Änderung
 * der Stelle wandert allein die Markierung; ein Neuaufbau setzte den Bildlauf
 * jedes Mal zurück.
 */
function baueZugliste() {
  zuglisteKnoten.textContent = '';
  zuglisteFelder.clear();
  const zuege = wiedergabe.zuege();
  const schritte = wiedergabe.schritte();
  // Leere Schritte bekommen keine Überschrift: Eine Gruppe ohne Züge sagt
  // nichts und macht die Liste nur länger.
  const gruppen = wiedergabe.hatGliederung()
    ? schritte.filter((schritt) => schritt.count > 0)
    : [{ from: 0, count: zuege.length, number: null, key: null, lesson: null, blocks: [] }];

  for (const gruppe of gruppen) {
    if (gruppe.number !== null) {
      const marke = document.createElement('p');
      marke.className = 'zugliste-marke leise';
      // Der Name kommt aus der Lektion, seit 4T-0052. Der Bezeichner des
      // Schrittes ist genau der ihre, die Zuordnung also die Identität und
      // keine Tabelle, die auseinanderlaufen könnte.
      marke.textContent = text('zugliste.schritt', {
        nummer: gruppe.number,
        name: text(`lektion.${gruppe.key}.titel`),
        lektion: gruppe.lesson,
      });
      zuglisteKnoten.append(marke);
    }

    // Die gelernten Zugfolgen des Schrittes, je Stelle nachschlagbar.
    const blockAn = new Map();
    for (const block of gruppe.blocks ?? []) {
      for (let n = block.from; n < block.from + block.count; n++) blockAn.set(n, block);
    }

    // Die Griffe des Schrittes. Nur die mehrzügigen werden gekennzeichnet;
    // ein einzelner Zug ist ohnehin ein Griff und braucht keine Klammer.
    const griffAn = new Map();
    const griffzug = new Map();
    for (let n = gruppe.from; n < gruppe.from + gruppe.count;) {
      const griff = wiedergabe.griffAb(n);
      if (griff.anzahl > 1) {
        for (let k = 0; k < griff.anzahl; k++) {
          griffAn.set(n + k, lage(n + k, griff.von, griff.anzahl));
        }
        // Ein Griff, der sich aufhebt, trägt keinen Zug. Der Strich sagt das,
        // und der Klartext beim anstehenden Zug erklärt es.
        griffzug.set(n + griff.anzahl - 1, griff.zug === null ? '–' : formatMove(griff.zug));
      }
      n += griff.anzahl;
    }

    const reihe = document.createElement('p');
    reihe.className = 'zugliste-reihe';
    for (let n = gruppe.from; n < gruppe.from + gruppe.count; n++) {
      const block = blockAn.get(n);
      if (block && block.from === n) {
        // **Vor jeder Folge und nicht nur beim Wechsel.** Die erste Fassung
        // nannte den Namen nur, wenn er sich änderte, um die Liste kurz zu
        // halten. Der Product Owner hat am 2026-08-14 daran gesehen, was das
        // kostet: Eine unterstrichene Gruppe ohne Namen ist ein Strich und
        // sagt nichts. Der Name ist die eigentliche Erklärung der Linie.
        const folgenmarke = document.createElement('span');
        folgenmarke.className = 'zugliste-folgemarke leise';
        // **Steht der Name mitten in einem Griff, läuft dessen Klammer über
        // ihn hinweg.** Sonst zerrisse er sie, und aus einer Klammer würden
        // zwei Striche, die nichts mehr zusammenhalten. Der Fall ist der
        // Regelfall und nicht die Ausnahme: Gemessen beginnt ein Drittel der
        // gelernten Folgen mit einem Zug, der mit dem davorstehenden zu einem
        // Handgriff verschmilzt.
        if (griffAn.has(n) && griffAn.get(n) !== 'anfang') folgenmarke.dataset.griff = 'mitte';
        folgenmarke.textContent = text(`folge.${block.sequence}`);
        reihe.append(folgenmarke);
      }

      const feld = document.createElement('span');
      feld.className = 'zugliste-zug';
      feld.dataset.stelle = String(n);
      if (block) feld.dataset.folge = lage(n, block.from, block.count);
      if (griffAn.has(n)) feld.dataset.griff = griffAn.get(n);
      feld.textContent = formatMove(zuege[n]);
      reihe.append(feld);
      zuglisteFelder.set(n, feld);

      if (griffzug.has(n)) {
        const zeichen = document.createElement('span');
        zeichen.className = 'zugliste-griffzug';
        zeichen.textContent = `= ${griffzug.get(n)}`;
        reihe.append(zeichen);
      }
    }
    zuglisteKnoten.append(reihe);
  }
}

/** Zeigt den anstehenden Griff, den laufenden Schritt und die Stelle in der Liste. */
function zeigeAnstehendes() {
  anstehendBereich.hidden = !wiedergabeLaeuft();
  if (!wiedergabeLaeuft()) return;

  // Angesagt wird der Griff und nicht der Einzelzug, aus 4T-0040. Wer den
  // Würfel in der Hand hält, folgt dieser Anzeige; eine Zusammenfassung, die
  // nur in der Liste stünde, wiese die Ersparnis aus, ohne sie zu geben.
  const griff = wiedergabe.naechsterGriff();
  const zug = griff === null ? null : griff.zug;
  anstehendNotation.textContent = griff === null ? '' : zug === null ? '–' : formatMove(zug);
  if (griff === null) anstehendKlartext.textContent = text('anstehend.keiner');
  else if (zug === null) {
    anstehendKlartext.textContent = text('anstehend.hebtAuf', { anzahl: griff.anzahl });
  } else anstehendKlartext.textContent = klartext(zug);

  // Woraus der Griff entsteht. Nur bei mehr als einem Zug: Sonst stünde dort
  // dieselbe Notation ein zweites Mal.
  anstehendGriff.hidden = griff === null || griff.anzahl < 2;
  if (!anstehendGriff.hidden) {
    anstehendGriff.textContent = text('anstehend.griff', {
      anzahl: griff.anzahl,
      zuege: formatMoves(wiedergabe.zuege().slice(griff.von, griff.von + griff.anzahl)),
    });
  }

  // Vier Anzeigen zum laufenden Schritt, und alle vier verschwinden zusammen:
  // Eine Vorführung trägt keine Gliederung, und dann läuft auch kein Schritt.
  //
  // **Die Begründung ist die Ausnahme, seit 4T-0082.** Bei der kurzen Lösung
  // wird ihr Platz frei, und F-0009 verlangt, dass das Programm dort
  // ausspricht, warum es hier nichts zu begründen gibt. Der Satz steht damit
  // genau dann, wenn er gilt, und kostet keine zusätzliche Höhe. Eine
  // Vorführung bekommt ihn nicht: Sie zeigt eine Zugfolge und behauptet nicht,
  // eine Lösung zu sein.
  const schritt = wiedergabe.aktuellerSchritt();
  anstehendSchritt.hidden = schritt === null;
  anstehendFortschritt.hidden = schritt === null;
  anstehendBegruendung.hidden = schritt === null && !zeigtKurzloesung();
  anstehendLektion.hidden = schritt === null;
  if (schritt === null && zeigtKurzloesung()) {
    anstehendBegruendung.textContent = text('wiedergabe.ohneSystematik');
  }
  if (schritt !== null) {
    anstehendSchritt.textContent = text('anstehend.schritt', {
      nummer: schritt.nummer,
      von: schritt.von,
      name: text(`lektion.${schritt.kennung}.titel`),
    });
    anstehendFortschritt.textContent = text('anstehend.fortschritt', {
      getan: schritt.getan,
      anzahl: schritt.anzahl,
    });
    // Die Begründung wird geholt und nicht zweitgeschrieben, aus 4T-0052. Es
    // ist die Vorstellung der Lektion und nicht ihre Erklärung: Jene ist der
    // eine Satz, an dem der Anwender den Schritt wiedererkennt, diese trägt
    // zwischen 1834 und 3974 Zeichen und stünde hier neben der Zugliste.
    anstehendBegruendung.textContent = text(`lektion.${schritt.kennung}.vorstellung`);
    anstehendLektion.textContent = text('anstehend.lektion', { nummer: schritt.lektion });
  }

  // Die Markierung wandert, die Liste bleibt stehen. Markiert ist der ganze
  // anstehende Griff und nicht nur sein erster Zug: Er ist das, was der
  // Anwender als Nächstes in einer Bewegung dreht.
  for (const [stelle, feld] of zuglisteFelder) {
    const jetzt = griff !== null && stelle >= griff.von && stelle < griff.von + griff.anzahl;
    feld.classList.toggle('jetzt', jetzt);
    // Am Ende der Folge gibt es keine anstehende Stelle mehr; dann bleibt die
    // Liste unmarkiert und der Klartext sagt, dass sie abgespielt ist.
    if (jetzt && stelle === griff.von) feld.scrollIntoView({ block: 'nearest' });
  }
}

// Der Weg in die Lektion, aus 4T-0052. Gefragt wird beim Druck und nicht beim
// Einrichten: Welcher Schritt läuft, entscheidet sich erst dann. Was der Sprung
// alles mitnimmt, steht bei `springeZurLektion` im Abschnitt Lernpfad.
anstehendLektion.addEventListener('click', () => {
  const schritt = wiedergabe.aktuellerSchritt();
  if (schritt !== null) springeZurLektion(schritt.kennung);
});

/** Zeigt Stelle, Beschriftung und Verfügbarkeit der Wiedergabe. */
function zeigeWiedergabestand() {
  standZeile.hidden = !wiedergabeLaeuft();
  if (wiedergabeLaeuft()) {
    standZeile.textContent = text('wiedergabe.stand', {
      stelle: wiedergabe.stelle(),
      anzahl: wiedergabe.anzahl(),
    });
  }
  // Die Beschriftung wechselt mit dem Zustand. Ein Knopf, der «Abspielen»
  // sagt, während abgespielt wird, ist schlimmer als gar keiner.
  knopfAbspielen.textContent = text(
    wiedergabe.spielt() ? 'wiedergabe.anhalten' : 'wiedergabe.abspielen',
  );
  knopfAbspielen.disabled = !wiedergabeLaeuft() || (!wiedergabe.spielt() && !wiedergabe.kannVor());
  for (const knopf of steuerknoepfe) knopf.disabled = !wiedergabeLaeuft();
  knopfBeenden.disabled = !wiedergabeLaeuft();

  // Der Übungswürfel ist während der Wiedergabe gesperrt, sichtbar und nicht
  // stumm: Ein Bedienelement, das ohne erkennbaren Grund nichts tut, wird für
  // kaputt gehalten.
  //
  // **Dasselbe gilt während einer Eingabe**, und die Sperrung ist dieselbe.
  // Der Unterschied liegt allein beim Erzeugen einer Lösung: Es bleibt während
  // der Wiedergabe erreichbar, denn eine neue Lösung ersetzt die alte; während
  // einer Eingabe ist es gesperrt, weil der Zustand, zu dem gelöst würde, erst
  // im Entstehen ist.
  //
  // **Der Einstieg in die Eingabe bleibt stehen und wird untätig**, wie jede
  // gesperrte Schaltfläche seit 4T-0063. Ihn zu verbergen ließe die Reihe der
  // Zustände beim Öffnen um einen Knopf schrumpfen und die übrigen springen.
  const ruhend = wiedergabeLaeuft() || eingabeOffen;
  tastenfeld.sperre(ruhend);
  for (const knopf of uebungsknoepfe) knopf.disabled = ruhend;
  knopfEingabe.disabled = ruhend;
  knopfLoesen.disabled = eingabeOffen;
  // Beide Arten der Lösung teilen dieselbe Sperre: Der Zustand, zu dem gelöst
  // würde, ist während einer Eingabe erst im Entstehen.
  knopfKurz.disabled = eingabeOffen;
  // Zieht die Reihe nach. Steht hier, weil diese Funktion auch beim
  // Sprachwechsel läuft und der Fortschritt keinen festen Bezeichner trägt.
  zeigeLoesungsstand();
  if (!ruhend) zeigeVerlaufsstand();

  // Die Hervorhebung meldet nur den Wunsch an. Wann sie erscheint, entscheidet
  // die Darstellung: Läuft noch eine Bewegung, gehört sie zu einem Zug, der
  // schon zwei Drehungen weiter liegt. Hervorgehoben wird die Schicht des
  // Griffs; hebt er sich auf, gibt es nichts hervorzuheben.
  wuerfel.hebeHervor(hervorhebungDerWiedergabe());
  zeigeAnstehendes();
}

/**
 * Welche Schicht die Wiedergabe gerade hervorgehoben haben will.
 *
 * Eigens benannt seit 4T-0065, weil es dafür jetzt zwei Aufrufer gibt: den
 * Takt der Wiedergabe und das Verlassen einer Zugtaste. Zweimal geschrieben
 * liefe die eine Fassung der anderen davon.
 */
function hervorhebungDerWiedergabe() {
  return wiedergabeLaeuft() ? (wiedergabe.naechsterGriff()?.zug ?? null) : null;
}

wiedergabe.aufAenderung(zeigeWiedergabestand);

knopfLoesen.addEventListener('click', () => {
  // Der Anschluss an den Löser sitzt hier und nicht in der Wiedergabe: Sie
  // bekommt eine fertige Zugfolge übergeben und weiß nicht, woher sie stammt.
  //
  // **Hier wird unmittelbar gerechnet und nicht über den Läufer**, anders als
  // bei der Hilfe der Lektion 9. Der Grund ist nicht die Dauer, denn die ist
  // dieselbe: Die Lernlösung braucht gemessen im Mittel 8,6 ms, Median 8,2,
  // über 2000 Verwürfelungen am 2026-08-17. Der Grund ist, dass dieser Druck
  // die Anzeige ohnehin ersetzt, während die Hilfe mitten in eine laufende
  // Übung fällt und sie nicht anhalten darf.
  //
  // **Die Zahl stand bis zum 2026-08-17 mit 0,22 ms hier** und stammte aus der
  // Zeit vor 4T-0039. Seitdem wählt der Löser die Reihenfolge der Teilaufgaben
  // und rechnet dafür mehrere durch. Eine gemessene Zahl im Kommentar altert
  // mit dem Code, den sie beschreibt.
  loescheKurzmeldung();
  const ausgang = verlauf.zustand();
  const { moves, steps } = solveBeginner(ausgang);
  wiedergabe.lade({ ausgang, zuege: moves, schritte: steps });
  wiedergabeArt = WIEDERGABE.LOESUNG;
  // Eine neue Lösung macht den Rückweg in die alte gegenstandslos. Er bliebe
  // sonst als Schaltfläche stehen und führte in eine Lösung, die niemand mehr
  // sieht.
  rueckweg = null;
  baueZugliste();
  zeigeWiedergabestand();
  zeigeLektion();
  // Der Lernpfad tritt zurück, 4T-0061. Wer eine Lösung abarbeitet, lernt
  // nicht, und der Druck auf diese Schaltfläche ist der Wechsel der Tätigkeit.
  // Der Fokus bleibt hier, wo er ist: Er liegt auf dieser Schaltfläche und
  // damit außerhalb des Bereichs, der sich schließt.
  lektionsbereich.klappe(false);
});

// ------------------------------------------------ Die kurze Lösung, 4T-0082

/**
 * Zeigt die Reihe im Zustand, der zur Rechnung passt.
 *
 * Während der Rechnung treten Fortschritt und Abbruch an die Stelle der beiden
 * Erzeugen-Schaltflächen. Die Zeile bleibt dieselbe, und damit bleibt die Höhe
 * der Bühne unverändert.
 *
 * **Der Fortschritt bleibt nach dem Ende stehen, wenn er etwas zu sagen hat**,
 * also bei Fehlschlag und Abbruch. Eine Meldung, die mit dem Ende der Rechnung
 * verschwindet, ist keine.
 */
function zeigeLoesungsstand() {
  knopfLoesen.hidden = kurzLaeuft;
  knopfKurz.hidden = kurzLaeuft;
  knopfAbbrechen.hidden = !kurzLaeuft;
  kurzFortschritt.hidden = kurzStand === null;
  if (kurzStand !== null) {
    kurzFortschritt.textContent = text(kurzStand.bezeichner, kurzStand.werte);
  }
}

/** Löscht eine stehende Meldung der Kurzlösung, sobald sie nicht mehr gilt. */
function loescheKurzmeldung() {
  if (kurzLaeuft || kurzStand === null) return;
  kurzStand = null;
  zeigeLoesungsstand();
}

knopfKurz.addEventListener('click', () => {
  // Der Läufer bedient einen Vorgang zur Zeit, und die Hilfe der Lektion 9
  // benutzt denselben. Ohne diese Sperre wirft `solve` «Es läuft bereits ein
  // Vorgang», und der Anwender sähe einen Fehler, wo er nur zu früh war.
  if (kurzLaeuft || hilfeLaeuft) return;

  const ausgang = verlauf.zustand();
  const meine = ++kurzNummer;
  let teile = 0;
  kurzLaeuft = true;
  kurzStand = { bezeichner: 'wiedergabe.rechnetVorbereitung', werte: { nummer: 1 } };
  zeigeLoesungsstand();

  // Der Aufruf geht über den Läufer und nicht unmittelbar, anders als bei der
  // Lernlösung. Der Grund ist die Dauer: Der erste Aufruf baut die Tabellen
  // auf und braucht dafür am 2026-08-20 gemessene 1553 bis 2744 ms im Browser,
  // gegen 8,6 ms der Lernlösung. Davon entfallen 94 bis 96 Prozent auf die
  // Vorbereitung; ab dem zweiten Aufruf bleiben 82 ms.
  const { promise, cancel } = laeufer.solve(TWO_PHASE, ausgang, {
    onProgress: (meldung) => {
      if (meine !== kurzNummer) return;
      if (meldung.stage === 'preparation') {
        teile += 1;
        // Gezeigt wird die laufende Nummer und nicht der Name des Teils. Die
        // Namen des Lösers heißen «Abschätzung Drehung mal Lage» und sagen der
        // Zielgruppe nichts; die steigende Zahl sagt ihr das Wesentliche,
        // nämlich dass es vorangeht.
        kurzStand = {
          bezeichner: 'wiedergabe.rechnetVorbereitung',
          werte: { nummer: teile + 1 },
        };
      } else {
        kurzStand = { bezeichner: 'wiedergabe.rechnetSuche', werte: {} };
      }
      zeigeLoesungsstand();
    },
  });
  kurzAbbruch = cancel;

  promise.then((ergebnis) => {
    if (meine !== kurzNummer) return;
    kurzLaeuft = false;
    kurzAbbruch = null;
    if (!ergebnis.ok) {
      // Der Läufer meldet den Abbruch als eigenen Grund. Ihn wie einen
      // Fehlschlag zu melden hieße, dem Anwender ein Misslingen anzuzeigen,
      // das er selbst ausgelöst hat.
      const abgebrochen = ergebnis.grund === 'abgebrochen';
      kurzStand = {
        bezeichner: abgebrochen ? 'wiedergabe.rechnetAbgebrochen' : 'wiedergabe.rechnetMisslungen',
        werte: {},
      };
      zeigeLoesungsstand();
      return;
    }
    kurzStand = null;
    // Ohne `schritte`: Die kurze Lösung hat keine Gliederung, und die
    // Wiedergabe nimmt den Wert deshalb wahlfrei. Die Zugliste bleibt damit
    // eine einzige Gruppe ohne Überschrift.
    wiedergabe.lade({ ausgang, zuege: ergebnis.ergebnis.moves });
    wiedergabeArt = WIEDERGABE.LOESUNG;
    rueckweg = null;
    baueZugliste();
    zeigeWiedergabestand();
    zeigeLektion();
    lektionsbereich.klappe(false);
  });
});

knopfAbbrechen.addEventListener('click', () => {
  if (kurzAbbruch !== null) kurzAbbruch();
});

knopfBeenden.addEventListener('click', () => {
  wiedergabe.halteAn();
  // **Die beiden Arten enden verschieden, und das ist der ganze Unterschied
  // zwischen ihnen.** Bei der Lösung übernimmt der Übungswürfel den gezeigten
  // Stand: Wer bis zum dritten Schritt mitgespielt hat und selbst weitermachen
  // will, findet den Würfel dort vor. Bei einer Vorführung kehrt er auf den
  // Ausgangszustand zurück, denn Vorführen ist ein Zeigen und kein Üben; sonst
  // wäre die Übungslage nach einmal Zusehen verbraucht.
  //
  // Der Weg über `setze` lässt beide die Prüfung der Lösbarkeit passieren und
  // beginnt den Verlauf leer.
  const stand =
    wiedergabeArt === WIEDERGABE.VORFUEHRUNG ? wiedergabe.ausgangszustand() : wiedergabe.zustand();
  wiedergabeArt = null;
  // `setze` zieht den Lektionsbereich selbst nach, weil es die laufende Übung
  // beendet.
  setze(stand);
  zeigeWiedergabestand();
});

/**
 * Die Tastenbelegung der Wiedergabe.
 *
 * Sie greift nur, solange eine Lösung geladen ist. Die Notationsbuchstaben
 * bleiben davon unberührt, denn keiner von ihnen steht hier.
 */
const WIEDERGABE_TASTEN = {
  ' ': () => (wiedergabe.spielt() ? wiedergabe.halteAn() : wiedergabe.spieleAb()),
  ArrowRight: () => wiedergabe.vor(),
  ArrowLeft: () => wiedergabe.zurueck(),
  PageDown: () => wiedergabe.naechsterSchritt(),
  PageUp: () => wiedergabe.vorigerSchritt(),
  Home: () => wiedergabe.zumAnfang(),
  End: () => wiedergabe.zumEnde(),
};

knopfAbspielen.addEventListener('click', WIEDERGABE_TASTEN[' ']);

document.addEventListener('keydown', (ereignis) => {
  if (!wiedergabeLaeuft()) return;
  if (ereignis.ctrlKey || ereignis.metaKey || ereignis.altKey) return;
  // Schaltflächen stehen hier ausdrücklich mit in der Liste, anders als bei
  // den Zugtasten. Sonst löste die Leertaste zugleich die zuletzt angeklickte
  // Schaltfläche und diese Belegung aus, und ein Anhalten wäre ein Anhalten
  // mit sofortigem Wiederanlauf.
  if (ereignis.target?.matches?.('input, select, textarea, [contenteditable], button')) return;
  const handlung = WIEDERGABE_TASTEN[ereignis.key];
  if (!handlung) return;
  // Erst hier unterdrückt: Leertaste und Pfeiltasten rollen sonst die Seite,
  // und ohne geladene Lösung sollen sie das weiterhin tun.
  ereignis.preventDefault();
  handlung();
});

// Ein verborgenes Fenster zeichnet keine Bilder, und eine Bewegung, die dort
// läuft, löst ihr Versprechen nicht ein: Am laufenden Stand gemessen war eine
// Animation über 200 Millisekunden auch nach 1000 noch offen. Das fortlaufende
// Abspielen wartet aber auf die Bewegung, und bliebe es dabei einfach stehen,
// sähe das nach einem Fehler aus. Angehalten ist es ein Zustand, den der
// Anwender kennt und mit einem Druck aufhebt.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) wiedergabe.halteAn();
});

zeigeWiedergabestand();

// -------------------------------------------------- Lernpfad, aus 4T-0045

// Der Pfad bekommt den Fortschritt hereingereicht und kennt die Einstellungen
// nicht. Das Gefäß entsteht hier nicht neu: Datensatz, Fassung, Datei-Sicherung
// und der Fall ohne Speicher stehen seit 4T-0026, hierher gehört allein die
// Verdrahtung der beiden Enden.
const pfad = createPath({
  load: () => einstellungen.fortschritt(),
  save: (wert) => einstellungen.setzeFortschritt(wert),
});

/** Die angezeigte Lektion. Beim Start die, an der zuletzt gearbeitet wurde. */
let laufendeLektion = pfad.resume().key;

/**
 * Die letzte Meldung des Pfades, oder `null`.
 *
 * Gehalten werden Bezeichner und Kennungen, nicht der fertige Satz. Ein
 * fertiger Satz bliebe beim Sprachwechsel in der alten Sprache stehen, und
 * zwar mitten in einer Anzeige, die sonst umgeschaltet hat.
 */
let rueckmeldung = null;

/**
 * Woher der nebenläufige Strang kommt, und als was er zu starten ist.
 *
 * **Zwei Stände, zwei Wege, aus 4T-0078.** Über den Entwicklungsserver liegt
 * `loeser-strang.js` als Datei daneben und wird als Modul geladen. In der
 * Auslieferungsdatei gibt es keine zweite Adresse, die sich laden ließe; dort
 * steht das Löser-Bündel als Textblock im Dokument, und daraus entsteht hier
 * eine `blob:`-Adresse.
 *
 * **Der Textblock trägt ein klassisches Bündel und keinen Modulbaum**, deshalb
 * ohne `type: 'module'`. Ein klassischer Strang aus einem Blob läuft in jedem
 * Browser, der Stränge überhaupt kennt; Modul-Stränge sind jünger. Das
 * Ergebnis ist eine Datei, die weitergegeben wird, und in welchem Browser sie
 * landet, weiß niemand. Genau diesen Weg hat der Spike aus 4T-0011 erprobt.
 *
 * **Die Fallunterscheidung hängt am Dokument und nicht an einer Kennung des
 * Baus.** Fehlt der Block, gilt der Weg über die Datei. Damit bleibt `src/`
 * unverändert lauffähig, ohne dass der Bau etwas in den Quellcode schreiben
 * müsste.
 *
 * **Die Adresse wird nicht wieder freigegeben.** Der Läufer startet den Strang
 * erst bei der ersten Anfrage, und eine freigegebene Adresse ließe sich dann
 * nicht mehr laden. Es bleibt eine je Sitzung.
 */
function strangQuelle() {
  const block = document.getElementById('loeser-strang');
  if (!block) {
    return {
      adresse: new URL('./loeser-strang.js', import.meta.url).href,
      optionen: { type: 'module' },
    };
  }
  const blob = new Blob([block.textContent], { type: 'text/javascript' });
  return { adresse: URL.createObjectURL(blob), optionen: {} };
}

const strang = strangQuelle();

/**
 * Der Läufer für die Hilfe der Lektion 9, aus 4T-0021.
 *
 * **Er bekommt die Umgebung von hier und sucht sie sich nicht.** Derselbe
 * Quelltext läuft im nebenläufigen Strang, wo es weder Fenster noch Dokument
 * gibt; welcher Weg möglich ist, entscheidet allein, was hier hereingereicht
 * wird. Läuft der Strang nicht an, wechselt der Läufer dauerhaft in den
 * Hauptstrang und rechnet dort stückweise mit einer Freigabe zwischen den
 * Schritten.
 *
 * **Wann das eintritt, entscheidet der Versuch und keine Annahme.** Eine lokal
 * geöffnete Datei ist der Fall, für den die Rückfallebene gebaut wurde; ob der
 * Strang dort aus einem Blob doch anläuft, ist Gegenstand der Messung in
 * 4T-0079 und hier bewusst nicht vorweggenommen.
 */
const laeufer = createRunner({
  startWorker: (quelle) => new Worker(quelle, strang.optionen),
  setTimer: (handlung, dauer) => window.setTimeout(handlung, dauer),
  clearTimer: (kennung) => window.clearTimeout(kennung),
  workerSource: strang.adresse,
});

/**
 * Die letzte Auskunft der Hilfe, oder `null`.
 *
 * Gehalten wird der Schritt und nicht der fertige Satz, aus demselben Grund wie
 * bei der Rückmeldung: Ein fertiger Satz bliebe beim Sprachwechsel stehen.
 *
 * `hilfeNummer` zählt die Anfragen. Eine Antwort, die eintrifft, nachdem der
 * Würfel sich weitergedreht hat, gehört zu einer Lage, die es nicht mehr gibt,
 * und wird verworfen. Ohne diese Nummer stünde sie da und nennte einen Schritt,
 * der längst ein anderer ist.
 */
let hilfe = null;
let hilfeNummer = 0;
let hilfeLaeuft = false;

/**
 * Der Weg zurück aus einer Lektion in die Lösung, oder `null`.
 *
 * Er entsteht allein beim Sprung von einem Schritt der Lösung in die Lektion,
 * die ihn lehrt, und trägt zweierlei: die Lektion, die vorher angezeigt wurde,
 * und einen Stand der Wiedergabe für den Fall, dass sie verdrängt wird.
 *
 * **Gehalten wird die Lektion und nicht nur die Rollstelle.** Der Sprung
 * verändert mehr als den Bildausschnitt: Er richtet den Blick neu aus und nimmt
 * in Lektion 8 alles außer der Arbeitsstelle zurück. Ein Rückweg, der das
 * stehen ließe, gäbe einen Würfel unter einem Schleier zurück, den an dieser
 * Stelle kein Text mehr erklärt.
 */
let rueckweg = null;

const lektionHalter = document.getElementById('lektion-halter');
const lektionsbereich = erzeugeLektionsbereich(document, {
  waehle: waehleLektion,
  fuehreVor: fuehreFolgeVor,
  fuehreZugVor: fuehreNotationVor,
  beginneUebung,
  melde: meldeAnwendung,
  ueberspringe: ueberspringeLektion,
  hilf: holeHilfe,
  kehreZurueck: kehreZurLoesungZurueck,
});
lektionHalter.append(lektionsbereich.knoten);

/** Setzt die gehaltene Meldung in die Werte der laufenden Sprache um. */
function rueckmeldungFuerAnzeige() {
  if (rueckmeldung === null) return null;
  const werte = { ...(rueckmeldung.werte ?? {}) };
  if (rueckmeldung.lektion) {
    werte.nummer = lessonFor(rueckmeldung.lektion).number;
    werte.name = text(`lektion.${rueckmeldung.lektion}.titel`);
  }
  if (rueckmeldung.lektionen) {
    werte.liste = rueckmeldung.lektionen
      .map((kennung) => text(`lektion.${kennung}.titel`))
      .join(', ');
  }
  return { bezeichner: rueckmeldung.bezeichner, art: rueckmeldung.art, werte };
}

/** Setzt die gehaltene Auskunft in die Worte der laufenden Sprache um. */
function hilfeFuerAnzeige() {
  if (hilfe === null) return null;
  if (hilfe.grund !== null) return { bezeichner: hilfe.grund };
  return {
    bezeichner: 'pfad.hilfeSchritt',
    werte: {
      nummer: hilfe.schritt.number,
      von: STEPS.length,
      // Derselbe Name wie in der Zugliste und in der Schrittanzeige, seit
      // 4T-0052 der der Lektion. Die Auskunft verweist auf sie, und sie mit
      // einem anderen Namen zu nennen als dem, der dort über dem Text steht,
      // hieße den Anwender zweimal suchen zu lassen.
      name: text(`lektion.${hilfe.schritt.key}.titel`),
      lektion: hilfe.schritt.lesson,
    },
  };
}

/**
 * Nimmt eine stehende Auskunft zurück, sobald sich der Würfel gedreht hat.
 *
 * Die Anzeige wird nur dann neu gebaut, wenn wirklich eine stand. Ein
 * Neuaufbau nach jedem Zug wäre bei einem Text aus zehn Absätzen Verschwendung,
 * und er setzte nebenbei den Bildlauf zurück.
 */
function verwirfHilfe() {
  hilfeNummer++;
  if (hilfe === null) return;
  hilfe = null;
  zeigeLektion();
}

/**
 * Holt die Auskunft, welcher Schritt als Nächstes dran ist.
 *
 * **Sie nennt den Schritt und nicht die Züge.** `nextStep` liefert dafür eine
 * Kopie aus Nummer, Bezeichner und Lektionsnummer; die Zugfolge steht in der
 * Lektion, auf die die Auskunft verweist, und wird hier nicht wiederholt. Wer
 * bei jedem Zögern die Lösung vorgesetzt bekommt, lernt sie nie selbst.
 *
 * **Der Anschluss an den Löser sitzt hier**, wie bei der Vorführung und bei der
 * Wiedergabe: Nach dem Modulschnitt der Architektur kennt `lessons` den
 * `solver` nicht, und die Lektion verlangt eine Auskunft, ohne zu wissen, wer
 * sie rechnet.
 */
function holeHilfe() {
  // Auch hier die gemeinsame Sperre des Läufers, 4T-0082: Er bedient einen
  // Vorgang zur Zeit, und die Kurzlösung benutzt denselben.
  if (hilfeLaeuft || kurzLaeuft) return;
  const meine = ++hilfeNummer;
  hilfeLaeuft = true;
  hilfe = null;
  zeigeLektion();

  laeufer.solve(BEGINNER, verlauf.zustand()).promise.then((ergebnis) => {
    hilfeLaeuft = false;
    // Eine Antwort zu einer Lage, die es nicht mehr gibt, wird verworfen. Der
    // Läufer selbst weiß davon nichts; er rechnet die Anfrage zu Ende.
    if (meine !== hilfeNummer) return;
    if (!ergebnis.ok) {
      hilfe = { grund: 'pfad.hilfeMisslungen', schritt: null };
    } else {
      const schritt = nextStep(ergebnis.ergebnis.steps);
      hilfe =
        schritt === null ? { grund: 'pfad.hilfeGeloest', schritt: null } : { grund: null, schritt };
    }
    zeigeLektion();
  });
}

/**
 * Die einzeln vorgeführten Züge einer Lektion, zerlegt für die Anzeige.
 *
 * Der Lektionsbereich bekommt Seite und Richtung getrennt und nicht «R'». Die
 * Zerlegung ist Notationswissen, und der Bereich hängt nach AK8 aus 4T-0045 von
 * keinem anderen Modul ab. Die Rechnung ist dieselbe wie in `klartext`.
 */
function zuegeDerLektion(kennung) {
  const arten = ['uhr', 'halb', 'gegen'];
  return parseMovesOrThrow(demosFor(kennung)).map((zug) => ({
    notation: formatMove(zug),
    seite: FACES[Math.floor(zug / 3)],
    art: arten[zug % 3],
  }));
}

/**
 * Die Werte, die in den Text einer Lektion eingesetzt werden.
 *
 * Zwei Arten von Zugfolge, und beide kommen über einen Platzhalter in den Text
 * statt abgeschrieben zu werden: die vorgegebene Übungsfolge unter `folge`, die
 * gelernten Zugfolgen unter ihrer eigenen Kennung. Eine Änderung am Wortlaut
 * machte den Text sonst stillschweigend falsch, und zwar in beiden Sprachen
 * zugleich.
 *
 * **Die Kennung als Platzhaltername und nicht eine Nummer.** Lektion 4 trägt
 * zwei Folgen; `{secondLayerRight}` sagt im Text, welche gemeint ist, eine Zwei
 * dagegen nicht.
 */
function textwerteDerLektion(kennung) {
  const werte = {};
  const drill = drillFor(kennung);
  if (drill !== null) werte.folge = drill;
  for (const name of sequencesFor(kennung)) werte[name] = SEQUENCES[name];
  return Object.keys(werte).length === 0 ? null : werte;
}

/**
 * Richtet den Blick auf das aus, was die Lektion zeigen will.
 *
 * Die Lektionen 2 und 3 sehen auf die Unterseite, weil dort die erste Schicht
 * entsteht; alle anderen auf die Ausgangsansicht. **Verändert wird allein die
 * Neigung**, der Würfel bleibt liegen und die Notation unangetastet.
 *
 * Der Blick wird beim Wechsel gesetzt und danach nicht mehr festgehalten. Wer
 * weiterdreht, behält seine Ansicht bis zum nächsten Wechsel; eine Ansicht, die
 * sich gegen den Anwender zurückstellt, wäre eine Bevormundung.
 */
function richteBlickAus(kennung) {
  if (viewFor(kennung) === VIEW.BOTTOM) wuerfel.richteAus(UNTERANSICHT);
  else wuerfel.zurueck();
}

/**
 * Nimmt alles außer der Arbeitsstelle zurück, wo die Lektion es verlangt.
 *
 * Beide Ansichten bekommen dieselbe Stellung, denn beide zeigen denselben
 * Würfel. Das Netz folgt hier ausnahmsweise nicht der räumlichen Ansicht wie
 * bei der Hervorhebung des Zuges: Diese Auszeichnung hängt an keiner Bewegung
 * und braucht deshalb keinen gemeinsamen Takt.
 *
 * **Sie steht, solange die Lektion angezeigt wird, und nicht nur während der
 * Übung.** Der Lektionstext spricht von ihr, und ein Anwender, der ihn liest,
 * soll sehen, wovon die Rede ist. Entscheid des Product Owners vom 2026-08-17.
 *
 * Der Anschluss sitzt hier und nicht im Lektionsbereich: Der Katalog nennt
 * einen Bezeichner, die Geometrie kennt die Stellung, und zusammen kommen beide
 * allein in der Verdrahtung.
 */
function hebeArbeitsstelleHervor(kennung) {
  const stellung = focusFor(kennung) === FOCUS.WORKING_CORNER ? ARBEITSECKE : null;
  wuerfel.hebeSteinHervor(stellung);
  netz.hebeSteinHervor(stellung);
}

function zeigeLektion() {
  lektionsbereich.zeige({
    stand: bereichsstand({
      uebersicht: pfad.overview(),
      laufend: laufendeLektion,
      folgen: sequencesFor(laufendeLektion),
      zuege: zuegeDerLektion(laufendeLektion),
      textwerte: textwerteDerLektion(laufendeLektion),
      hilfe: helpFor(laufendeLektion) !== HELP.NONE,
    }),
    text,
    laeuft: pfad.running() === laufendeLektion,
    rueckmeldung: rueckmeldungFuerAnzeige(),
    hilfe: hilfeFuerAnzeige(),
    hilfeLaeuft,
    rueckweg: rueckweg !== null,
  });
}

/**
 * Wechselt die angezeigte Lektion.
 *
 * **Der Fortschritt bleibt dabei unberührt**, auch die zuletzt bearbeitete
 * Lektion. Blättern ist kein Arbeiten; wer sich umsieht und den Browser
 * schließt, soll beim nächsten Start dort weitermachen, wo er zuletzt geübt
 * hat, und nicht dort, wo er zuletzt hingesehen hat.
 *
 * `abstecherVon` nennt die Lektion, die vorher angezeigt wurde, und macht den
 * Wechsel damit zu einem Abstecher mit Rückweg. Ohne die Angabe ist er ein
 * Blättern, und ein etwaiger Rückweg verfällt: Wer von Hand weiterwählt, hat
 * den Abstecher verlassen, und eine Schaltfläche, die ihn weiter anböte,
 * führte an eine Stelle, an die niemand mehr zurückwill.
 */
function waehleLektion(kennung, abstecherVon = null) {
  rueckweg = abstecherVon === null ? null : { lektion: abstecherVon, stand: null };
  if (kennung !== laufendeLektion) {
    laufendeLektion = kennung;
    rueckmeldung = null;
    // Die Auskunft gehört zur Lektion, in der sie geholt wurde, und keine
    // andere bietet sie überhaupt an.
    hilfe = null;
    hilfeNummer++;
    richteBlickAus(kennung);
    hebeArbeitsstelleHervor(kennung);
  }
  // Auch bei gleicher Lektion, denn der Rückweg hat sich in jedem Fall
  // geändert. Vorher endete die Funktion hier ohne jede Wirkung.
  zeigeLektion();
}

/**
 * Springt vom laufenden Schritt der Lösung in die Lektion, die ihn lehrt.
 *
 * **Auch eine gesperrte Lektion wird gezeigt.** Wer zuerst den Löser benutzt,
 * hat den Pfad noch nicht gegangen, und ein Verweis, der bei ihm ins Leere
 * liefe, wäre keiner. Verschenkt wird dabei nichts: Die Sperre regelt das
 * Weiterkommen und nicht das Lesen, und der Fortschritt bleibt unberührt.
 *
 * Der Bildausschnitt wandert mit. Der Lektionsbereich steht über der Anzeige
 * des anstehenden Zuges, und ein Text, der sich lautlos oberhalb des Bildrandes
 * ändert, sieht aus, als sei nichts geschehen.
 */
function springeZurLektion(kennung) {
  waehleLektion(kennung, laufendeLektion);
  // Der Bereich kann seit 4T-0061 eingeklappt sein, und dann führte dieser Weg
  // ins Leere: Der Sprung landete auf einer Marke, hinter der die Lektion
  // steckt, die er zeigen soll.
  lektionsbereich.klappe(true);
  lektionHalter.scrollIntoView({ block: 'start' });
}

/** Der Stand der Wiedergabe als Kopie, für den Rückweg. */
function standDerWiedergabe() {
  return {
    ausgang: wiedergabe.ausgangszustand(),
    zuege: wiedergabe.zuege(),
    schritte: wiedergabe.schritte(),
    stelle: wiedergabe.stelle(),
  };
}

/**
 * Kehrt aus der Lektion in die Lösung zurück.
 *
 * Drei Dinge in einem Zug: die vorher angezeigte Lektion, die Lösung und der
 * Bildausschnitt.
 *
 * **Die Wiedergabe wird nur angefasst, wenn sie die Lösung nicht mehr trägt.**
 * Wer währenddessen selbst weitergegangen ist, behält seine Stelle; ein
 * Rückweg, der sie zurückdrehte, wäre schlimmer als keiner. Angefasst wird sie
 * genau dann, wenn eine Vorführung dazwischengekommen ist, und das ist der
 * häufige Fall: Die Lektion lädt mit ihrer Schaltfläche dazu ein.
 */
function kehreZurLoesungZurueck() {
  const ziel = rueckweg;
  if (ziel === null) return;
  // **Zuerst gefragt und erst am Ende beantwortet**, 4T-0061. Die Schaltfläche,
  // die hierher geführt hat, steht im Aufklapper und verschwindet weiter unten
  // in `waehleLektion`, weil es danach keinen Rückweg mehr gibt; mit ihr fällt
  // der Fokus auf das Dokument. Gemessen am 2026-08-17: Wer erst beim Zuklappen
  // fragt, bekommt in jedem Fall «nein» und lässt den Fokus liegen.
  const fokusImLernpfad = lektionsbereich.enthaeltFokus();
  if (ziel.stand !== null && wiedergabeArt !== WIEDERGABE.LOESUNG) {
    const { ausgang, zuege, schritte, stelle } = ziel.stand;
    wiedergabe.lade({ ausgang, zuege, schritte });
    wiedergabe.springeZu(stelle);
    wiedergabeArt = WIEDERGABE.LOESUNG;
    baueZugliste();
    zeigeWiedergabestand();
  }
  // Ohne `abstecherVon`, denn der Abstecher ist hiermit zu Ende. Der Aufruf
  // setzt den Rückweg damit selbst zurück.
  waehleLektion(ziel.lektion);
  // Der Gegenzug zum Aufklappen in `springeZurLektion`, 4T-0061: Wer hier
  // drückt, erklärt, dass er wieder löst. Ziel des Fokus ist «Abspielen», weil
  // es die Haupthandlung dessen ist, wohin der Weg führt.
  lektionsbereich.klappe(false);
  if (fokusImLernpfad) knopfAbspielen.focus();
  anstehendBereich.scrollIntoView({ block: 'start' });
}

/**
 * Führt eine gelernte Zugfolge vor.
 *
 * Der Anschluss an den Löser sitzt hier und nicht im Lektionsbereich: Die
 * Wiedergabe bekommt eine fertige Zugfolge und weiß nicht, woher sie stammt,
 * und der Lektionskatalog nennt die Folge, ohne ihren Wortlaut zu kennen.
 * Zusammen kommen beide Seiten allein an dieser Stelle.
 *
 * **Vorgeführt wird auf der Lage, die gerade auf dem Tisch liegt.** Eine eigene
 * Musterlage wäre die zweite Antwort auf die Frage, wie die Folge wirkt, und
 * der Anwender müsste sie auf seine übertragen.
 */
function fuehreFolgeVor(folge) {
  fuehreNotationVor(SEQUENCES[folge]);
}

/**
 * Führt Notation vor, gleich ob ein Zug oder eine ganze Folge.
 *
 * Der Einzelzug der Lektion 1 nimmt bewusst denselben Weg: Ein Zug ist eine
 * Folge der Länge eins, und ein eigener Abspielweg für ihn wäre ein zweiter
 * Ort für dieselbe Sache.
 */
function fuehreNotationVor(notation) {
  // **Verdrängt die Vorführung eine Lösung, zu der ein Rückweg offen ist, so
  // wird deren Stand gehalten.** Ohne das endete der Abstecher genau dort,
  // wohin die Lektion einlädt: bei der Schaltfläche «Vorführen». Gehalten wird
  // erst hier und nicht schon beim Sprung, damit der Stand der ist, den die
  // Wiedergabe unmittelbar vor dem Verdrängen hatte.
  if (rueckweg !== null && wiedergabeArt === WIEDERGABE.LOESUNG) {
    rueckweg.stand = standDerWiedergabe();
  }
  const ausgang = verlauf.zustand();
  wiedergabe.lade({ ausgang, zuege: parseMovesOrThrow(notation) });
  wiedergabeArt = WIEDERGABE.VORFUEHRUNG;
  baueZugliste();
  zeigeWiedergabestand();
  zeigeLektion();
}

/** Legt die Übungslage der laufenden Lektion auf und beginnt die Übung. */
function beginneUebung() {
  const lage = createSetup(laufendeLektion);
  // Lektion 0 kommt hier nicht an; ihr Bedienelement ist ein anderes. `null`
  // heißt genau das und ist kein Fehler.
  if (lage === null) return;
  // Eine laufende Wiedergabe hielte den Übungswürfel gesperrt und schriebe
  // ihren nächsten Zug über die frische Lage.
  wiedergabe.halteAn();
  wiedergabeArt = null;
  setze(lage.state);
  pfad.begin(laufendeLektion);
  rueckmeldung = { bezeichner: 'pfad.begonnen', art: 'hinweis' };
  zeigeWiedergabestand();
  zeigeLektion();
}

/**
 * Wertet eine gezählte Anwendung aus.
 *
 * Drei Meldungen, in dieser Reihenfolge: Eine Freigabe schließt den Abschluss
 * ein, und ein Abschluss schließt die gezählte Anwendung ein. Umgekehrt gelesen
 * bliebe die stärkste Nachricht ungesagt.
 */
function verarbeiteAnwendung(ergebnis) {
  if (!ergebnis.counted) return;
  if (ergebnis.unlocked !== null) {
    rueckmeldung = { bezeichner: 'pfad.freigegeben', art: 'erfolg', lektion: ergebnis.unlocked };
  } else if (ergebnis.completed) {
    // **Der Abschluss des ganzen Weges ist eine eigene Nachricht**, denn er ist
    // das Quality-Gate von Release 1: Wer hier ankommt, kann den Zauberwürfel
    // lösen. Verlangt sind beide Bedingungen, die letzte Lektion und ein
    // lückenlos abgeschlossener Pfad; wer Lektionen übersprungen hat, bekommt
    // die gewöhnliche Meldung, denn an einer übersprungenen ist nichts geprüft.
    const alleFertig = pfad.overview().every((eintrag) => eintrag.completed);
    rueckmeldung = { bezeichner: alleFertig ? 'pfad.wegFertig' : 'pfad.fertig', art: 'erfolg' };
  } else {
    rueckmeldung = {
      bezeichner: 'pfad.geschafft',
      art: 'erfolg',
      werte: { getan: ergebnis.applications, verlangt: lessonFor(laufendeLektion).applications },
    };
  }
  zeigeLektion();
}

/**
 * Nimmt die Selbstauskunft der Lektion 0 entgegen.
 *
 * `begin` und `report` in einem Zug: An ihr gibt es nichts aufzulegen, was ein
 * Beginnen sichtbar machte, und der Pfad verlangt trotzdem eine laufende Übung.
 * Er tut das aus gutem Grund, denn sonst ließe sich die Prüfung am Würfel
 * umgehen.
 */
function meldeAnwendung() {
  pfad.begin(laufendeLektion);
  verarbeiteAnwendung(pfad.report(laufendeLektion));
}

function ueberspringeLektion() {
  if (!window.confirm(text('pfad.ueberspringenWirklich'))) return;
  const ergebnis = pfad.skip(laufendeLektion);
  if (!ergebnis.ok) return;
  const betroffen = ergebnis.affects;
  // Der Pfad rückt beim Überspringen selbst auf die folgende Lektion vor; die
  // Anzeige folgt ihm, statt eine zweite Meinung darüber zu haben.
  laufendeLektion = pfad.resume().key;
  rueckmeldung =
    betroffen.length > 0
      ? { bezeichner: 'pfad.bautAufDiese', art: 'hinweis', lektionen: betroffen }
      : null;
  zeigeLektion();
}

/**
 * Löscht den Fortschritt, 4T-0084.
 *
 * **Die Verdrahtung steht hier und nicht beim Bereich «Sichern»**, obwohl die
 * Schaltfläche dort sitzt. Der Vorgang gehört dem Pfad: Er räumt den
 * Fortschritt, und die Anzeige der Lektion muss ihm folgen. Beides lebt in
 * diesem Abschnitt, die Ablage-Schaltflächen weiter oben kennen weder `pfad`
 * noch `zeigeLektion`.
 *
 * **Die Rückfrage folgt dem Muster der vier anderen Verlustfälle**, über
 * `window.confirm` mit eigenem Textbaustein. Sie ist der gewichtigste von
 * ihnen: Was hier verloren geht, ist nicht in einem Zug wiederherzustellen.
 *
 * **Die Rückmeldung steht in der Hinweiszeile und nicht im Lernpfad.** Der
 * Anwender hat im aufgeklappten Bereich «Bedienung» gedrückt, und dort liegt
 * sein Blick; die Zeile steht ausdrücklich außerhalb des Aufklappers und trägt
 * bereits die Antwort auf «Aus Datei holen». Der Lernpfad kann zudem
 * eingeklappt sein, dann bliebe eine Meldung in ihm ungesehen.
 */
function loescheFortschritt() {
  if (!window.confirm(text('ablage.loeschenWirklich'))) return;
  pfad.clear();
  // Der Pfad steht danach am Anfang; die Anzeige folgt ihm, statt eine zweite
  // Meinung darüber zu haben. Dieselbe Zeile wie beim Überspringen.
  laufendeLektion = pfad.resume().key;
  // Die alte Meldung geht mit dem alten Stand. Sie spräche sonst von einem
  // Fortschritt, den es nicht mehr gibt, und das ist schlimmer als keine
  // Meldung.
  rueckmeldung = null;
  zeigeLektion();
  zeigeHinweis('ablage.geloescht');
}

document.getElementById('fortschritt-loeschen').addEventListener('click', loescheFortschritt);

/**
 * Prüft nach jedem Zug am Übungswürfel, ob das Ziel der Lektion steht.
 *
 * **Geprüft wird nur, was auch angezeigt wird.** Wer die Lektion wechselt, ohne
 * die begonnene Übung zu beenden, soll nicht in einer Lektion vorankommen, die
 * er gerade nicht vor Augen hat; er sähe die Meldung dazu nie.
 *
 * Nach einer gezählten Anwendung läuft keine Übung mehr, dafür sorgt der Pfad.
 * Ohne das zählte derselbe erfüllte Zustand bei jedem weiteren Zug erneut, und
 * drei verlangte Anwendungen wären mit einer einzigen Lage erfüllt.
 */
function pruefeUebung() {
  const uebung = pfad.running();
  if (uebung === null || uebung !== laufendeLektion) return;
  verarbeiteAnwendung(pfad.check(uebung, verlauf.zustand()));
}

// Auch beim Start, denn der Pfad nimmt die zuletzt bearbeitete Lektion wieder
// auf. Wer bei Lektion 2 aufgehört hat, sähe sonst beim nächsten Start auf die
// Oberseite, während der Text von der unteren spricht. Dasselbe gilt für die
// Zurücknahme: Wer in Lektion 8 aufgehört hat, findet sie beim nächsten Start
// vor, statt sie erst durch einen Lektionswechsel auszulösen.
richteBlickAus(laufendeLektion);
hebeArbeitsstelleHervor(laufendeLektion);
zeigeLektion();

// --------------------------------------- Zustandseingabe, aus 4T-0067

// Der Eingang für einen Würfel, den das Programm nicht selbst verwürfelt hat.
// Der Zustand lebt in `input/eingabe.js`, das Netz zeigt ihn und meldet die
// Drücke; hier wird beides zusammengesteckt.
//
// **Der Bereich ist kein zweiter Modus der Anzeige.** Er stellt die Ansicht auf
// das Netz, klappt den Lernpfad ein und sperrt die übrige Bedienung, so wie es
// 4T-0061 für den Lernpfad tut. Entschieden am 2026-08-18, siehe 2A-0012.

const eingabe = erzeugeEingabe();
const eingabeFlaeche = document.getElementById('eingabe-flaeche');
const knopfEingabeAus = document.getElementById('eingabe-abbrechen');
const farbwahlKnoten = document.getElementById('eingabe-farben');
const knopfUebernehmen = document.getElementById('eingabe-uebernehmen');
const befundZeile = document.getElementById('eingabe-befund');

/** Der letzte abgewiesene Befund der Übernahme, oder `null`. */
let eingabeBefund = null;

/** Die Farbe, die ein Druck auf ein Feldchen überträgt. */
let gewaehlteFarbe = FACES[0];

// **Es gibt keine Merkvariable für die vorige Ansicht**, und das ist Absicht.
// Die Einstellung wird während der Eingabe nicht verstellt, sondern in `wirke`
// überstimmt; damit stellt derselbe Aufruf sie hinterher wieder her, und es
// gibt keinen zweiten Zustand, der mit dem ersten auseinanderlaufen könnte.
// Ein Abbruch mitten in der Eingabe, auch durch Neuladen, hinterlässt nichts.

/**
 * Die sechs Farbschaltflächen, je Seite eine.
 *
 * **Aufgereiht nach der Augenzahl und nicht nach der Seitenordnung des Kerns.**
 * Die Stelle in der Reihe ist die Taste, die die Farbe wählt, und die Augen auf
 * dem Feldchen zeigen dieselbe Zahl. Befund des Product Owners vom 2026-08-18:
 * Nach `FACES` aufgereiht lieferte die Taste 2 Orange mit drei Augen.
 */
const farbknoepfe = NACH_AUGENZAHL.map((seite, stelle) => {
  const knopf = document.createElement('button');
  knopf.type = 'button';
  knopf.className = 'farbwahl';
  knopf.dataset.seite = seite;
  const taste = stelle + 1;

  // Die Fläche trägt `data-farbe` und bekommt damit dieselbe Farbe und dasselbe
  // Zeichen wie ein Feldchen am Würfel, ohne dass die Zuordnung hier ein
  // zweites Mal stünde. `--feldmass` ist das Maß, an dem sich die Zeichen der
  // Kennzeichnung bemessen.
  const flaeche = document.createElement('span');
  flaeche.className = 'farbwahl-feld';
  flaeche.dataset.farbe = seite;
  flaeche.style.backgroundColor = `var(--seite-${seite.toLowerCase()})`;

  const marke = document.createElement('span');
  marke.className = 'notation';
  marke.textContent = seite;

  // Die Taste steht am Knopf, wie am Tastenfeld seit 4T-0031 die
  // Tastenkombination an jeder Zugtaste steht. Damit ist die Reihe zugleich
  // die Übersicht der Belegung, und es gibt keine getrennte Legende, die von
  // ihr abweichen könnte.
  const kuerzel = document.createElement('span');
  kuerzel.className = 'farbwahl-kuerzel';
  kuerzel.textContent = String(taste);

  const zahl = document.createElement('span');
  zahl.className = 'farbwahl-zahl';

  knopf.append(flaeche, marke, kuerzel, zahl);
  knopf.addEventListener('click', () => waehleFarbe(seite));
  farbwahlKnoten.append(knopf);
  return { seite, taste, knopf, zahl };
});

/** Wählt die Farbe, die ein Druck überträgt. */
function waehleFarbe(seite) {
  gewaehlteFarbe = seite;
  zeigeEingabe();
}

/**
 * Zeigt den Eingabezustand: Netz, Zählung und gewählte Farbe.
 *
 * Läuft nach jeder Setzung. Das Netz bekommt die 54 Werte fertig übergeben und
 * rechnet nichts nach, genau wie bei einem Zug am Übungswürfel.
 */
function zeigeEingabe() {
  // Das Netz nur, solange die Eingabe läuft. Sonst gehört es dem Übungswürfel,
  // und ein Aufruf beim Aufbau überschriebe ihn mit einer leeren Eingabe.
  if (eingabeOffen) netz.zeige(eingabe.felder());
  // «Zurücknehmen» bleibt stehen und wird untätig, wie im Verlauf und wie jede
  // gesperrte Schaltfläche seit 4T-0063. Das Layout darf beim Bedienen nicht
  // springen.
  knopfEingabeZurueck.disabled = !eingabe.kannZurueck();
  const anzahl = eingabe.zaehlung();
  for (const { seite, taste, knopf, zahl } of farbknoepfe) {
    // «4/9» ist sprachneutral und braucht keinen Textbaustein. Der
    // vorgelesene Wortlaut braucht ihn sehr wohl, denn dort steht ein Satz.
    zahl.textContent = `${anzahl[seite]}/9`;
    knopf.setAttribute('aria-pressed', String(seite === gewaehlteFarbe));
    knopf.setAttribute(
      'aria-label',
      text('eingabe.farbstand', {
        seite: text(`seite.${seite}`),
        taste,
        ist: anzahl[seite],
        soll: 9,
      }),
    );
  }
  // «Übernehmen» bleibt stehen und wird untätig, solange nicht alle 54 Felder
  // belegt sind. Damit ist der Zeitpunkt der Prüfung entschieden: Die Zählung
  // läuft mit, die Lösbarkeitsprüfung läuft auf Druck.
  knopfUebernehmen.disabled = !eingabe.istVollstaendig();
  zeigeBefundstand();
}

/**
 * Zeigt den letzten Befund der Übernahme, oder verbirgt die Zeile.
 *
 * **Gehalten wird der Befund und nicht der fertige Satz**, wie bei der
 * Rückmeldung des Lernpfads seit 4T-0045. Ein fertiger Satz bliebe beim
 * Sprachwechsel in der alten Sprache stehen, und beim Palettenwechsel nennte
 * er die Farbe, die vorhin eingestellt war.
 */
function zeigeBefundstand() {
  befundZeile.hidden = eingabeBefund === null;
  if (eingabeBefund !== null) befundZeile.textContent = befundInWorten(eingabeBefund);
  netz.hebeBefundHervor(eingabeBefund === null ? null : eingabeBefund.felder);
}

/**
 * Setzt den Befund und zieht die Anzeige nach. `null` nimmt ihn zurück.
 *
 * **Er erlischt mit jeder Änderung der Eingabe**, AK4 von 4T-0069. Ein
 * stehengebliebener Hinweis behauptet einen Zustand, den es nicht mehr gibt,
 * und die hervorgehobenen Feldchen zeigten auf eine Prüfung von vorhin.
 */
function zeigeBefund(neu) {
  eingabeBefund = neu;
  zeigeEingabe();
}

/**
 * Setzt einen Befund der Prüfung in einen Satz um.
 *
 * **Der Bezeichner ist der Grund selbst**, ohne Umsetzungstabelle; die
 * Begründung steht im Sprachbaum. Zwei der acht Fälle haben keinen eigenen
 * Satz und fallen auf `befund.auffang`, und derselbe Rückfall fängt jeden
 * Grund, den der Kern später hinzubekommt: `erzeugeTexte` liefert bei einem
 * fehlenden Baustein den Punktpfad zurück, und der gehört nicht in die
 * Oberfläche.
 */
function befundInWorten(befund) {
  // Die unbekannte Farbe teilt sich den Grund mit der ungleichen Verteilung
  // und ist an dieser Angabe zu unterscheiden. Sie ist über keine Bedienung
  // erreichbar, so wie eine Feldzahl ungleich 54.
  if (befund.grund === 'form' || befund.daten?.unbekannt !== undefined) {
    return text('befund.auffang');
  }
  const bezeichner = `befund.${befund.grund}`;
  const satz = text(bezeichner, werteZumBefund(befund));
  return satz === bezeichner ? text('befund.auffang') : satz;
}

/** Die Angaben, die ein Befund in seinen Satz einsetzt, oder `null`. */
function werteZumBefund(befund) {
  const daten = befund.daten ?? {};
  if (befund.grund === 'farbverteilung') {
    // **Genannt werden alle abweichenden Farben und nicht nur die, bei der die
    // Prüfung anhält.** Die häufigste Ursache ist die Verwechslung zweier
    // Farben, und dann steht die zweite gleich daneben; der Kern zählt sie
    // ohnehin alle. Entschieden am 2026-08-19.
    const liste = FACES.filter((seite) => daten.anzahl?.[seite] !== daten.soll)
      .map((seite) =>
        text('befund.teil.farbanzahl', { name: farbname(seite), ist: daten.anzahl[seite] }),
      )
      .join(', ');
    return { liste };
  }
  if (befund.grund === 'unbekannter-stein') {
    return { art: text(`befund.teil.${daten.art === 'kante' ? 'kante' : 'ecke'}`) };
  }
  return null;
}

/**
 * Der Name einer Farbe in der eingestellten Palette.
 *
 * Zwei der sechs heißen dort anders, und der Befund kann jede treffen. Die
 * zweite Wahrheit über die Zuordnung von Seite zu Farbe ist im Sprachbaum und
 * im Stilblatt kommentiert.
 */
function farbname(seite) {
  return text(`farbe.${einstellungen.wert('palette')}.${seite}`);
}

/** Beschriftet die 54 Feldchen für die Bedienhilfen. */
function beschrifteFelder() {
  for (let nummer = 0; nummer < 54; nummer++) {
    const seite = text(`seite.${FACES[Math.floor(nummer / 9)]}`);
    const innen = nummer % 9;
    netz.beschrifte(
      nummer,
      MITTEN.includes(nummer)
        ? text('eingabe.feldFest', { seite })
        : text('eingabe.feld', {
            seite,
            zeile: Math.floor(innen / 3) + 1,
            spalte: (innen % 3) + 1,
          }),
    );
  }
}

/** Beginnt eine Eingabe und räumt dafür die Bühne frei. */
function beginneEingabe() {
  eingabeOffen = true;
  // Derselbe Schalter wie für die Einstellung, nur überstimmt er jetzt. Die
  // Halter hier von Hand zu setzen wäre eine zweite Fassung derselben Regel.
  wirke('ansicht');

  eingabeFlaeche.hidden = false;
  // Der Lernpfad tritt zurück, wie beim Erzeugen einer Lösung: Wer einen
  // Zustand abtippt, lernt nicht.
  lektionsbereich.klappe(false);

  netz.setzeBedienbar(true, { feste: MITTEN, melde: setzeFeldchen });
  beschrifteFelder();
  // Ohne Befund beginnen. Ein Satz aus einem früheren Anlauf gälte einer
  // Prüfung, die der Anwender längst vergessen hat.
  zeigeBefund(null);
  zeigeWiedergabestand();
  netz.fasseFokus();
}

/** Beendet die Eingabe und stellt die Bühne zurück. */
function beendeEingabe() {
  eingabeOffen = false;
  netz.setzeBedienbar(false);
  eingabeFlaeche.hidden = true;
  // Der Befund geht mit der Eingabe. Ohne diese Zeile bliebe die Hervorhebung
  // am Netz stehen, das gleich darauf den Übungswürfel zeigt, und leuchtete
  // dort auf Feldchen einer Prüfung, die diesen Würfel nie betroffen hat.
  zeigeBefund(null);

  // Die eingestellte Ansicht kehrt zurück, samt allem, was an ihr hängt. Sie
  // war nie verstellt, nur überstimmt.
  wirke('ansicht');

  // Das Netz zeigt wieder den Übungswürfel und nicht die Eingabe. Ohne das
  // bliebe eine halbfertige Eingabe stehen, während die Bedienung längst
  // wieder den Würfel meint.
  netz.zeige(toFacelets(verlauf.zustand()));
  zeigeWiedergabestand();
  knopfEingabe.focus();
}

/** Überträgt die gewählte Farbe auf ein Feldchen. */
function setzeFeldchen(nummer) {
  if (!eingabe.setze(nummer, gewaehlteFarbe)) return;
  zeigeBefund(null);
}

/**
 * Übernimmt die Eingabe auf den Übungswürfel, 4T-0070.
 *
 * **Der Schritt, für den das ganze Arbeitspaket da ist.** Erst hier wird aus
 * 54 eingegebenen Feldern ein Würfelzustand, an dem der Löser arbeiten kann.
 *
 * **Keine Rückfrage, anders als bei «Gelöster Würfel» und «Verwürfeln».** Jene
 * kosten einen Klick und können aus Versehen geschehen; 54 Feldchen zu
 * übertragen und dann zu übernehmen kann das nicht. Entschieden am 2026-08-19.
 *
 * **Die Eingabe bleibt erhalten**, bindend aus Abschnitt 3 der Architektur:
 * Der Übungswürfel lässt sich aus dem erfassten Zustand setzen, überschreibt
 * ihn aber nie. Wer nach der Übernahme einen Zug übt und die Eingabe wieder
 * öffnet, findet sie vor, wie er sie verlassen hat.
 */
function uebernimmEingabe() {
  const befund = setzeAusFeldern(eingabe.felder());
  if (!befund.ok) {
    // Die Eingabe bleibt offen und unverändert. Der Satz sagt, was nicht
    // stimmt, die hervorgehobenen Feldchen sagen, wo.
    zeigeBefund(befund);
    return;
  }
  beendeEingabe();
}

// --------------------------------- Verwerfen und Vorbelegen, aus 4T-0068

const knopfEingabeZurueck = document.getElementById('eingabe-zurueck');

/** Nimmt die letzte Setzung zurück. Für die Schaltfläche und für Strg+Z. */
function nimmSetzungZurueck() {
  if (eingabe.nimmZurueck()) zeigeBefund(null);
}

/**
 * Fragt vor einem Sprung zurück, wenn dabei etwas verloren geht.
 *
 * **Angekündigt wird ein Verlust und nicht ein Tastendruck.** Ist noch nichts
 * gesetzt, gibt es nichts zu verlieren, und eine Rückfrage darüber erzöge den
 * Anwender dazu, sie ungelesen wegzuklicken. Sinngemäß gelesenes AK4 von
 * S-0019; denselben Weg geht `setzeMitRueckfrage` beim Übungswürfel.
 *
 * Ein Sprung ist nicht umkehrbar, denn er verwirft die Rücknahme. Genau das
 * macht die Rückfrage nötig.
 */
function springeInEingabe(handlung, bezeichner) {
  const gesetzt = Object.values(eingabe.zaehlung()).reduce((a, b) => a + b, 0) > MITTEN.length;
  if (gesetzt && !window.confirm(text(bezeichner))) return;
  handlung();
  zeigeBefund(null);
}

knopfEingabe.addEventListener('click', beginneEingabe);
knopfEingabeAus.addEventListener('click', beendeEingabe);
knopfUebernehmen.addEventListener('click', uebernimmEingabe);
knopfEingabeZurueck.addEventListener('click', nimmSetzungZurueck);
document
  .getElementById('eingabe-leeren')
  .addEventListener('click', () =>
    springeInEingabe(() => eingabe.leere(), 'eingabe.leerenWirklich'),
  );
document
  .getElementById('eingabe-geloest')
  .addEventListener('click', () =>
    springeInEingabe(() => eingabe.belegeGeloest(), 'eingabe.geloestWirklich'),
  );

// Die Ziffern wählen die Farbe. Sie stehen hier und nicht im Netz, weil die
// Farbwahl der Verdrahtung gehört: Das Netz kennt keine gewählte Farbe, es
// meldet nur, wo gedrückt wurde.
document.addEventListener('keydown', (ereignis) => {
  if (!eingabeOffen) return;
  if (ereignis.ctrlKey || ereignis.metaKey || ereignis.altKey) return;
  if (ereignis.target?.matches?.('input, select, textarea, [contenteditable]')) return;
  const stelle = Number(ereignis.key);
  if (!Number.isInteger(stelle) || stelle < 1 || stelle > NACH_AUGENZAHL.length) return;
  ereignis.preventDefault();
  waehleFarbe(NACH_AUGENZAHL[stelle - 1]);
});

farbwahlKnoten.setAttribute('aria-label', text('eingabe.farbwahl'));
zeigeEingabe();

// ------------------------------------------------------------- Aufbau

for (const name of felder.keys()) {
  wirke(name);
  zeigeWert(name);
}
wendeTexteAn(document, text);
document.documentElement.lang = einstellungen.wert('sprache');

if (einstellungen.speicherFehlt()) zeigeHinweis('ablage.kein');
else if (einstellungen.wurdeErgaenzt()) zeigeHinweis('ablage.ergaenzt');
