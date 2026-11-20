// Steine verteilen und drehen, ohne den Raum der lösbaren Würfel zu verlassen.
//
// ## Warum es dieses Modul gibt
//
// Eine Übungslage wird nicht verwürfelt, sondern gebaut: Was die Aufgabe lösen
// soll, wird aufgelöst, und nur das. Der Grund steht in `setup.js`, und er gilt
// für die Stufen von CFOP genauso. **Der Preis dieser Bauart ist die
// Lösbarkeit.** Wer Steine unmittelbar umsetzt, statt zu drehen, verlässt den
// Raum der echten Würfel, sobald er nicht aufpasst.
//
// Hier stehen die Handgriffe, die dabei aufpassen. Sie lagen bis 4T-0119 in
// `setup.js` und sind mit dem Erzeuger der Stufen dorthin gewandert, wo beide
// sie lesen können. **Eine zweite Fassung des Paritätsausgleichs liefe der
// ersten früher oder später davon**, und ein Fehler darin liefert eine Lage, die
// kein Würfel tragen kann.
//
// Dieses Modul läuft in jeder Umgebung: kein Browser, kein Node, keine globalen
// Namen. Die ESLint-Konfiguration erzwingt das.

/** Eine ganze Zahl aus der hereingereichten Quelle, auch bei entarteter Quelle. */
export function randomInt(random, n) {
  const wert = Math.floor(random() * n);
  return wert < 0 || Number.isNaN(wert) ? 0 : wert >= n ? n - 1 : wert;
}

/** Eine Kopie der Liste in zufälliger Reihenfolge, in fester Zahl von Ziehungen. */
export function shuffled(random, liste) {
  const werte = [...liste];
  for (let i = werte.length - 1; i > 0; i--) {
    const j = randomInt(random, i + 1);
    [werte[i], werte[j]] = [werte[j], werte[i]];
  }
  return werte;
}

/** Gerade Zahl von Vertauschungen? Entscheidet, welche Anordnungen möglich sind. */
export function parity(anordnung) {
  let count = 0;
  for (let i = 0; i < anordnung.length; i++) {
    for (let j = i + 1; j < anordnung.length; j++) {
      if (anordnung[i] > anordnung[j]) count++;
    }
  }
  return count % 2;
}

/**
 * Verteilt die Steine eines Pools neu und sorgt dafür, dass keiner der Plätze
 * aus `verlangtOffen` seinen eigenen Stein behält.
 *
 * Ein Tausch macht **beide** beteiligten Plätze zugleich fremd besetzt, denn an
 * jedem liegt danach der Stein des anderen. Deshalb genügt ein einziger
 * Durchgang über die Plätze, und eine Schleife, die auf den Zufall wartet,
 * entsteht gar nicht erst.
 *
 * **Gemischt werden die Steine, die dort liegen, und nicht die Nummern der
 * Plätze.** Bis 4T-0191 stand hier `shuffled(random, pool)`, also die
 * Platznummern als Steine, und das war richtig unter einer Voraussetzung, die
 * nirgends stand: dass an den Plätzen des Pools die Steine mit denselben
 * Nummern liegen. **Für die Blicke der letzten Schicht trifft sie zu**, denn
 * eine Folge dort lässt die oberen Steine oben; **für den Blick auf das Paar
 * trifft sie nicht zu**, weil ein Stein des Paares oben liegt und dafür ein
 * oberer Stein im Platz vorn rechts. Der Pool zählte dann vier obere Plätze und
 * legte vier obere Steine aus, während nur drei da waren.
 *
 * **Der Schaden war ein Würfel, den es nicht geben kann**, gemessen am
 * 2026-09-07 über acht Fälle mal 8000 Ziehungen mit `validateFacelets`: acht von
 * acht Fällen unlösbar, mit dem Befund «farbverteilung» und einmal
 * «stein-doppelt». Für die fünf bestehenden Blicke ist die berichtigte Fassung
 * mengengleich und nicht wertgleich: Sie erreicht dieselben Lagen, bei gleicher
 * Zufallsquelle aber eine andere; nachgerechnet ist, dass jede Zusage aus
 * 4T-0119 hält.
 */
export function verteile(permutation, pool, verlangtOffen, random) {
  const steine = shuffled(
    random,
    pool.map((stelle) => permutation[stelle]),
  );
  pool.forEach((stelle, index) => {
    permutation[stelle] = steine[index];
  });
  if (verlangtOffen.length === 0) return;
  if (pool.length < 2) {
    throw new RangeError('Ein Platz kann nicht fremd besetzt sein, wenn er allein steht');
  }
  for (const stelle of verlangtOffen) {
    if (permutation[stelle] !== stelle) continue;
    const partner =
      pool.find((andere) => andere !== stelle && permutation[andere] !== andere) ??
      pool.find((andere) => andere !== stelle);
    [permutation[stelle], permutation[partner]] = [permutation[partner], permutation[stelle]];
  }
}

/**
 * Stellt die gleiche Vertauschungs-Parität von Ecken und Kanten her.
 *
 * Zwei vertauschte Ecken allein sind an einem echten Würfel nicht herstellbar,
 * ohne dass auch zwei Kanten vertauscht sind. Der Ausgleich tauscht deshalb
 * zwei Plätze, die weder die Vorbedingung noch der Fall festlegt und die auch
 * nicht offen bleiben müssen; nur dort ist er folgenlos.
 *
 * **Für die Lektionen 7 und 8 gibt es keinen solchen Platz, und das ist keine
 * Lücke.** Dort stehen alle zwölf Kanten, ihre Anordnung ist also gerade, und
 * die Fallmenge führt aus demselben Grund nur gerade Anordnungen der Ecken. Der
 * Ausgleich ist damit schon erbracht; wäre er es nicht, wäre die Fallmenge
 * falsch, und der Wurf zeigt genau dorthin. **Bei den Stufen von CFOP gilt
 * dasselbe an den beiden Blicken auf die Lage**, deren Vertreter bereits aus
 * Zügen entstanden ist.
 */
export function gleicheParitaetAus(state, eckenTausch, kantenTausch) {
  if (parity(state.cp) === parity(state.ep)) return;
  const nutzeEcken = eckenTausch.length >= 2;
  const paar = nutzeEcken ? eckenTausch : kantenTausch;
  const permutation = nutzeEcken ? state.cp : state.ep;
  if (paar.length < 2) {
    throw new RangeError('Die Fallmenge liefert eine Anordnung, die kein Würfel tragen kann');
  }
  [permutation[paar[0]], permutation[paar[1]]] = [permutation[paar[1]], permutation[paar[0]]];
}

/**
 * Vergibt die freien Orientierungen und bringt ihre Summe auf ein Vielfaches
 * des Modulus, drei bei den Ecken und zwei bei den Kanten.
 *
 * Der Ausgleich sitzt auf dem letzten freien Platz. Gibt es keinen, muss die
 * Summe bereits stimmen: bei Lektion 5, deren drei Bilder alle eine gerade Zahl
 * gekippter Kanten tragen, und bei Lektion 8, deren Fallmenge nichts anderes
 * zulässt. Stimmt sie dann nicht, ist die Fallmenge falsch, und der Wurf sagt
 * das, statt eine unlösbare Lage auszuliefern.
 */
export function setzeOrientierung(werte, frei, modulus, random) {
  const ausgleich = frei.length > 0 ? frei[frei.length - 1] : null;
  for (let i = 0; i < frei.length - 1; i++) werte[frei[i]] = randomInt(random, modulus);
  if (ausgleich !== null) werte[ausgleich] = 0;
  const summe = werte.reduce((a, b) => a + b, 0);
  if (ausgleich === null) {
    if (summe % modulus !== 0) {
      throw new RangeError(`Die Orientierungen lassen sich nicht auf ${modulus} ausgleichen`);
    }
    return;
  }
  werte[ausgleich] = (modulus - (summe % modulus)) % modulus;
}
