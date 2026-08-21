// Prüfung, ob 54 Felder einen lösbaren Würfel ergeben.
//
// Ein Zustand, der an keinem echten Würfel vorkommt, ist nicht lösbar. Ohne
// diese Prüfung sucht der Löser vergeblich, und der Anwender sieht ein
// Programm, das sich aufhängt.
//
// Wichtiger noch ist der zweite Zweck: Sie verwandelt einen stillen Fehler
// der Erfassung in einen sichtbaren Hinweis. **Welche Bedingung dabei fällt,
// hängt an der Quelle.** Wer 54 Felder von Hand überträgt, verwechselt am
// häufigsten die beiden warmen Farben, und weil dabei niemand mitzählt,
// verletzt das fast immer die erste Bedingung.
//
// **Aus einem Foto kann die erste Bedingung nicht fallen.** Das in 4T-0010
// gewählte Verfahren teilt alle 54 Felder relativ zu den sechs Mitten auf und
// erzwingt dabei genau neun je Farbe; eine siebte Farbe kennt es nicht. Eine
// Verwechslung tauscht dort zwei Felder und trifft die zweite oder dritte
// Bedingung.
//
// Dieses Modul formuliert keine Meldung für den Anwender. Es liefert einen
// Befund als Datenwert; die Worte sind Sache der Oberfläche, siehe S-0021.

import { FACES, CORNERS, EDGES, CORNER_FACELETS, EDGE_FACELETS, fromFacelets } from './cube.js';

/**
 * Die sechs Bedingungen in der Reihenfolge, in der geprüft wird.
 *
 * Die Reihenfolge ist nicht beliebig: Sie steigt von der Bedingung, die sich
 * dem Anwender unmittelbar erklären lässt, zu der, die es nicht tut. Wer bei
 * der Farbverteilung scheitert, soll hören, dass eine Farbe zu oft vorkommt,
 * und keinen Satz über Vertauschungs-Paritäten.
 */
export const CONDITIONS = [
  'farbverteilung',
  'unbekannter-stein',
  'stein-doppelt',
  'ecken-drehung',
  'kanten-kippung',
  'vertauschung',
];

/** Anzahl der Vertauschungen einer Permutation, gerade oder ungerade. */
function parity(permutation) {
  let count = 0;
  for (let i = 0; i < permutation.length; i++) {
    for (let j = i + 1; j < permutation.length; j++) {
      if (permutation[i] > permutation[j]) count++;
    }
  }
  return count % 2;
}

/**
 * Prüft 54 Felder auf Lösbarkeit.
 *
 * Rückgabe bei Erfolg: `{ ok: true, cube }` mit dem Zustand auf Steinebene.
 * Rückgabe bei Misserfolg: `{ ok: false, grund, felder, daten }`, wobei
 * `grund` einer der Werte aus `CONDITIONS` ist, `felder` die betroffenen
 * Feldnummern nennt, soweit sie sich bestimmen lassen, und `daten` je nach
 * Grund weitere Angaben enthält.
 *
 * Die Prüfung endet bei der ersten verletzten Bedingung. Alles Weitere wäre
 * Folgefehler, und eine Liste von Folgefehlern hilft niemandem.
 */
export function validateFacelets(facelets) {
  if (!Array.isArray(facelets) || facelets.length !== 54) {
    return { ok: false, grund: 'form', felder: [], daten: { laenge: facelets?.length ?? 0 } };
  }

  // 1. Kommt jede Farbe genau neunmal vor?
  const counts = {};
  for (const face of FACES) counts[face] = 0;
  for (let i = 0; i < 54; i++) {
    const color = facelets[i];
    if (!(color in counts)) {
      return { ok: false, grund: 'farbverteilung', felder: [i], daten: { unbekannt: color } };
    }
    counts[color]++;
  }
  for (const face of FACES) {
    if (counts[face] !== 9) {
      const felder = [];
      for (let i = 0; i < 54; i++) if (facelets[i] === face) felder.push(i);
      return {
        ok: false,
        grund: 'farbverteilung',
        felder,
        daten: { farbe: face, anzahl: counts, soll: 9 },
      };
    }
  }

  // 2. Ergibt jedes Feldertripel und jedes Feldpaar einen Stein, den es gibt?
  //    `fromFacelets` beantwortet genau das, meldet aber nur, dass es
  //    gescheitert ist. Die Stelle wird hier eigens gesucht, weil der
  //    Anwender wissen muss, wo er nachsehen soll.
  const cube = fromFacelets(facelets);
  if (cube === null) {
    const stelle = findUnknownPiece(facelets);
    return { ok: false, grund: 'unbekannter-stein', felder: stelle.felder, daten: stelle.daten };
  }

  // 3. Kommt jeder Stein genau einmal vor?
  const doppelt = findDuplicate(cube.cp, CORNERS, CORNER_FACELETS);
  if (doppelt)
    return { ok: false, grund: 'stein-doppelt', felder: doppelt.felder, daten: doppelt.daten };
  const doppelteKante = findDuplicate(cube.ep, EDGES, EDGE_FACELETS);
  if (doppelteKante) {
    return {
      ok: false,
      grund: 'stein-doppelt',
      felder: doppelteKante.felder,
      daten: doppelteKante.daten,
    };
  }

  // 4. Summieren sich die Ecken-Drehungen auf ein Vielfaches von drei?
  const twist = cube.co.reduce((a, b) => a + b, 0);
  if (twist % 3 !== 0) {
    const felder = [];
    for (let i = 0; i < 8; i++) if (cube.co[i] !== 0) felder.push(...CORNER_FACELETS[i]);
    return { ok: false, grund: 'ecken-drehung', felder, daten: { summe: twist, rest: twist % 3 } };
  }

  // 5. Summieren sich die Kanten-Kippungen auf eine gerade Zahl?
  const flip = cube.eo.reduce((a, b) => a + b, 0);
  if (flip % 2 !== 0) {
    const felder = [];
    for (let i = 0; i < 12; i++) if (cube.eo[i] !== 0) felder.push(...EDGE_FACELETS[i]);
    return { ok: false, grund: 'kanten-kippung', felder, daten: { summe: flip } };
  }

  // 6. Stimmt die Vertauschungs-Parität von Ecken und Kanten überein?
  //    Anschaulich: Zwei vertauschte Ecken allein sind an einem echten Würfel
  //    nicht herstellbar, ohne auch zwei Kanten zu vertauschen.
  if (parity(cube.cp) !== parity(cube.ep)) {
    return {
      ok: false,
      grund: 'vertauschung',
      felder: [],
      daten: { ecken: parity(cube.cp), kanten: parity(cube.ep) },
    };
  }

  return { ok: true, cube };
}

/** Sucht die erste Stelle, an der die Felder keinen bekannten Stein ergeben. */
function findUnknownPiece(facelets) {
  const known = (names, colors) =>
    names.some((name) => {
      const letters = [...name];
      return letters.some((_, rotation) =>
        letters.every((letter, k) => letter === colors[(k + rotation) % letters.length]),
      );
    });

  for (let i = 0; i < 8; i++) {
    const colors = CORNER_FACELETS[i].map((f) => facelets[f]);
    if (!known(CORNERS, colors)) {
      return { felder: [...CORNER_FACELETS[i]], daten: { art: 'ecke', gesehen: colors.join('') } };
    }
  }
  for (let i = 0; i < 12; i++) {
    const colors = EDGE_FACELETS[i].map((f) => facelets[f]);
    if (!known(EDGES, colors)) {
      return { felder: [...EDGE_FACELETS[i]], daten: { art: 'kante', gesehen: colors.join('') } };
    }
  }
  return { felder: [], daten: {} };
}

/** Sucht den ersten Stein, der zweimal vorkommt, und nennt beide Stellen. */
function findDuplicate(permutation, names, faceletTable) {
  const seenAt = new Map();
  for (let position = 0; position < permutation.length; position++) {
    const piece = permutation[position];
    if (seenAt.has(piece)) {
      const first = seenAt.get(piece);
      return {
        felder: [...faceletTable[first], ...faceletTable[position]],
        daten: { stein: names[piece], stellen: [names[first], names[position]] },
      };
    }
    seenAt.set(piece, position);
  }
  return null;
}
