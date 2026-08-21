// Der Blick auf den Würfel.
//
// **Die Maus dreht den Blick und niemals den Würfel.** Das ist der Punkt, an
// dem die naheliegende Lösung falsch wäre: Wer den Würfel selbst dreht,
// bekommt eine Ansicht, in der R nicht mehr die rechte Seite meint. Die
// Notation wäre damit unbrauchbar, und der Lernpfad stünde auf Sand.
//
// Der Zustand des Kerns wird hier nirgends berührt. Was dieses Modul führt,
// sind zwei Winkel, und die sind reine Rechnung.

/** Die Ausgangsansicht. Sie zeigt oben, rechts und vorn. */
export const AUSGANGSBLICK = { x: -22, y: -36 };

/**
 * Die Ansicht auf die Unterseite, für die Lektionen 2 und 3.
 *
 * **Verändert wird allein die Neigung.** Der Seitenwinkel bleibt der der
 * Ausgangsansicht; damit bleibt vorn vorn und rechts rechts, und die Notation
 * behält ihre Bedeutung. Ein gedrehter Seitenwinkel wäre das Umdrehen des
 * Würfels, das der Lernpfad gerade vermeidet.
 *
 * **Fünfzig Grad und nicht mehr**, gerechnet über die projizierten
 * Flächenanteile: Die Unterseite nimmt damit 0,766 ein, vorn bleibt bei 0,520
 * und rechts bei 0,378. Beide werden gebraucht, denn Lektion 2 erklärt das
 * Kreuz an der Übereinstimmung der Kantenfarben mit den Seitenmitten, und die
 * sitzen vorn und rechts. Bei siebzig Grad wäre die Unterseite größer und die
 * Erklärung unanschaulich.
 */
export const UNTERANSICHT = { x: 50, y: AUSGANGSBLICK.y };

/**
 * Schranke für die waagerechte Achse.
 *
 * Bei ±90 Grad blickt man genau auf die Ober- oder Unterseite; der Würfel
 * fällt dann zu einem Quadrat zusammen, und ein weiteres Ziehen kippt ihn auf
 * den Kopf. Achtzig Grad lassen jede Seite erreichbar, ohne dass es dazu
 * kommt.
 */
export const SCHRANKE = 80;

/** Wieviel Grad je gezogenem Bildpunkt. */
export const EMPFINDLICHKEIT = 0.5;

const begrenze = (wert, grenze) => Math.min(grenze, Math.max(-grenze, wert));

/**
 * Der neue Blick nach einer Ziehbewegung.
 *
 * Die Richtungen folgen dem Griff an den Gegenstand: Wer nach rechts zieht,
 * dreht die linke Seite nach vorn; wer nach unten zieht, kippt die Oberseite
 * zu sich. Andersherum fühlt es sich an, als schöbe man die Welt statt den
 * Würfel.
 *
 * Die senkrechte Achse läuft frei und wird auf den Bereich von 0 bis 360
 * geholt, damit die Zahl nicht ins Unendliche wächst.
 */
export function nachZug(blick, dx, dy, empfindlichkeit = EMPFINDLICHKEIT) {
  return {
    x: begrenze(blick.x - dy * empfindlichkeit, SCHRANKE),
    y: (((blick.y + dx * empfindlichkeit) % 360) + 360) % 360,
  };
}

/** Gleichheit zweier Blickwinkel, auf ein Grad genau. */
export function gleich(einer, anderer) {
  const rest = (wert) => ((wert % 360) + 360) % 360;
  return (
    Math.round(einer.x) === Math.round(anderer.x) &&
    Math.round(rest(einer.y)) === Math.round(rest(anderer.y))
  );
}
