// Texte der Oberfläche, Englisch.
//
// Derselbe Baum wie in `de.js`. Für den Gegenstand gilt die gattungsübliche
// Bezeichnung «cube», niemals der geschützte Markenbegriff, bindend aus
// E-0002.

export default {
  kopf: {
    titel: 'Zauberwuerfel-Trainer',
    unterzeile: 'Learning path and solver',
  },

  bereich: {
    wuerfel: 'Cube',
    loesungsweg: 'Solution path',
    lernpfad: 'Learning path',
    bedienung: 'Controls',
  },

  ansicht: {
    zurueck: 'Reset view',
    hinweis: 'Dragging turns the view. The notation is unaffected.',
  },

  zeichen: {
    wuerfel: 'Markings on the cube',
    saum: 'A border around the facelets shows which layer turns.',
    lauf: 'A brighter mark on one edge shows which way.',
    kreuz:
      'Two crosses in the corners name the faces: on the left the ones you see, on the right the hidden ones.',
    halb: 'For a half turn the mark appears on both sides, because then the direction does not matter.',
    zugfolge: 'Markings in the move sequence',
    folge: 'A line beneath a group marks a sequence you have learned. Its name stands in front.',
    griff:
      'A bracket above joins turns of the same face into one grip. Behind it stands how far you turn.',
    hebtAuf: 'A dash means the moves cancel out and you turn nothing at all.',
    jetzt: 'The golden highlight marks where playback stands.',
  },

  verlauf: {
    zurueck: 'Undo · Ctrl+Z',
    wieder: 'Redo · Ctrl+Y',
    geloest: 'Solved cube',
    verwuerfeln: 'Scramble',
    wirklich: 'The practised moves will be lost. Continue?',
    verwuerfelungMarke: 'Scramble:',
  },

  bewegung: {
    folge: 'Ten random moves',
    hinweis:
      'The letters of the notation turn the layers. Shift reverses the direction, Alt turns by a half rotation.',
  },

  eingabe: {
    marke: 'Enter a state',
    grund:
      'For a cube the program did not scramble itself: transfer its state to the net, one facelet at a time.',
    beginnen: 'Enter a state',
    abbrechen: 'Cancel entry',
    zurueck: 'Undo · Ctrl+Z',
    leeren: 'Clear all',
    geloest: 'Solved cube',
    leerenWirklich: 'The facelets you have entered will be lost. Continue?',
    geloestWirklich: 'The facelets you have entered will be overwritten. Continue?',
    hinweis:
      'Choose a colour, then tap the facelets. With the keyboard: the arrow keys move, the digits 1 to 6 choose the colour, the space bar sets it.',
    farbwahl: 'Choose a colour',
    farbstand: '{seite}, key {taste}, {ist} of {soll} set',
    feld: '{seite}, row {zeile}, column {spalte}',
    feldFest: '{seite}, centre, fixed',
    uebernehmen: 'Apply',
  },

  // Die Begründung des Aufbaus steht in `de.js` und wird hier nicht wiederholt.
  befund: {
    farbverteilung:
      'The colours are unevenly distributed: {liste}. Each of the six colours must appear exactly 9 times.',
    'unbekannter-stein':
      'The colours at this {art} do not meet at any piece of the cube. One of the highlighted facelets was probably read wrong.',
    'stein-doppelt':
      'One piece appears twice. Every piece exists only once on the cube. At one of the two highlighted places a colour is wrong.',
    'ecken-drehung':
      'One corner is twisted without a second one balancing it. That cannot happen on a real cube. Two colours at one of the highlighted corners are probably swapped.',
    'kanten-kippung':
      'One edge is flipped without a second one balancing it. That cannot happen on a real cube. The two colours at one of the highlighted edges are probably swapped.',
    vertauschung:
      'Two pieces are swapped with each other. That cannot be produced on a real cube without taking it apart. Two facelets have been mixed up somewhere.',
    auffang: 'The state you entered cannot be applied.',
    teil: {
      farbanzahl: '{name} {ist} times',
      ecke: 'corner',
      kante: 'edge',
    },
  },

  pfad: {
    zaehlung: 'Lesson {nummer}',
    stand: '{abgeschlossen} of {gesamt} completed',
    vorige: 'Previous lesson',
    naechste: 'Next lesson',
    vorfuehren: 'Demonstrate: {name}',
    vorfuehrenZug: '{zug} — {seite}, {richtung}',
    ohneFolge: 'This lesson needs no learned sequence.',
    ueben: 'Start practising',
    uebenNeu: 'New practice position',
    verstanden: 'Understood, carry on',
    ueberspringen: 'Skip',
    ueberspringenWirklich:
      'The lesson will not count as completed, but it does unlock the next one. Continue?',
    anwendungen: '{getan} of {verlangt} successful applications',
    abgeschlossen: 'This lesson is completed.',
    uebersprungen: 'This lesson was skipped. It can be taken up again at any time.',
    gesperrt: 'This lesson unlocks once the previous one is done.',
    zustand: {
      abgeschlossen: 'completed',
      uebersprungen: 'skipped',
      offen: 'open',
      gesperrt: 'locked',
    },
    begonnen: 'The practice position is set. Turn the cube until the goal is reached.',
    geschafft: 'Well done. {getan} of {verlangt} applications.',
    fertig: 'Well done. This lesson is completed.',
    wegFertig: 'Well done. The whole path is complete. You can solve the cube.',
    freigegeben: 'Well done. Lesson {nummer}, {name}, is now unlocked.',
    bautAufDiese: 'Built upon by: {liste}.',
    hilfe: 'What comes next?',
    hilfeSchritt: 'Step {nummer} of {von}: {name}. Look it up in lesson {lektion}.',
    hilfeGeloest: 'The cube is solved. There is nothing left to do.',
    hilfeMisslungen: 'The answer could not be worked out.',
    zurLoesung: 'Back to the solution',
  },

  wiedergabe: {
    marke: 'Solution',
    erzeugen: 'Create solution',
    beenden: 'End playback',
    anfang: 'Start',
    schrittZurueck: 'Previous step',
    zugZurueck: 'Previous grip',
    abspielen: 'Play',
    anhalten: 'Pause',
    zugVor: 'Next grip',
    schrittVor: 'Next step',
    ende: 'End',
    stand: 'Move {stelle} of {anzahl}',
    hinweis:
      'Space plays and pauses, the arrow keys move one grip, Page Up and Page Down jump to the step boundaries, Home and End to the ends.',
    grund:
      'The practice cube is locked during playback. A move of your own would invalidate the sequence.',
    kurz: 'Short solution',
    abbrechen: 'Cancel',
    rechnetVorbereitung: 'Preparing the solver, step {nummer} …',
    rechnetSuche: 'Searching for the solution …',
    rechnetMisslungen: 'The short solution could not be created.',
    rechnetAbgebrochen: 'The computation was cancelled.',
    ohneSystematik:
      'This is the shortest solution the program can find. It follows no human system, is therefore not divided into steps, and is not explained.',
  },

  anstehend: {
    marke: 'Next move',
    keiner: 'The solution has been played to the end.',
    klartext: '{seite}, {richtung}',
    schritt: 'Step {nummer} of {von}: {name}',
    fortschritt: 'Move {getan} of {anzahl} in this step',
    lektion: 'Look it up in lesson {nummer}',
    liste: 'Move sequence',
    griff: 'From {anzahl} moves of the solution: {zuege}',
    hebtAuf: 'These {anzahl} moves cancel each other out. Nothing to turn.',
  },

  zugliste: {
    schritt: '{nummer}. {name} · Lesson {lektion}',
  },

  folge: {
    firstLayerCorner: 'Insert corner',
    secondLayerRight: 'Edge to the right',
    secondLayerLeft: 'Edge to the left',
    topCross: 'Top cross',
    topEdges: 'Swap edges',
    topCorners: 'Swap corners',
    cornerTwist: 'Twist corner',
  },

  seite: {
    U: 'top face',
    R: 'right face',
    F: 'front face',
    D: 'bottom face',
    L: 'left face',
    B: 'back face',
  },

  // Zweite Wahrheit über die Zuordnung von Seite zu Farbe, siehe `de.js`.
  farbe: {
    kanonisch: { U: 'yellow', R: 'orange', F: 'green', D: 'white', L: 'red', B: 'blue' },
    alternativ: { U: 'yellow', R: 'orange', F: 'turquoise', D: 'white', L: 'magenta', B: 'blue' },
  },

  richtung: {
    uhr: 'clockwise',
    gegen: 'anticlockwise',
    halb: 'a half turn',
  },

  einstellung: {
    sprache: 'Language',
    palette: 'Cube colours',
    kennzeichnung: 'Marking without colour',
    bewegung: 'Motion',
    ansicht: 'View',
    schriftgroesse: 'Text size',
    vorgabe: 'Default: {wert}',
    zuruecksetzen: 'Reset',
    allesZuruecksetzen: 'Reset all settings',
    allesWirklich: 'Reset all settings to their defaults?',
    spaeter: 'Takes effect once the cube is there.',
  },

  grund: {
    sprache: 'Two languages are promised. Without a switch the second one is worthless.',
    palette:
      'Without the alternative palette the cube cannot be solved with red-green deficiency, only guessed.',
    kennzeichnung:
      'A fallback for when even the alternative palette is not enough. Separate, because the marks disturb the look.',
    bewegung:
      'Moving images make some people unwell. It is also a matter of taste when practising.',
    ansicht: 'A fallback for weaker devices and for anyone who prefers the flat overview.',
    schriftgroesse: 'The learning path is mostly text. Whoever cannot read it learns nothing.',
  },

  wert: {
    palette: { kanonisch: 'Standard', alternativ: 'For colour deficiency' },
    kennzeichnung: { aus: 'Off', an: 'On' },
    bewegung: { aus: 'Off', langsam: 'Slow', mittel: 'Medium', schnell: 'Fast' },
    ansicht: { raeumlich: 'Three-dimensional', netz: 'Flat net' },
    schriftgroesse: { klein: 'Small', normal: 'Normal', gross: 'Large', sehrGross: 'Very large' },
    sprache: { de: 'Deutsch', en: 'English' },
  },

  ablage: {
    marke: 'Backup',
    sichern: 'Save to file',
    holen: 'Load from file',
    grund:
      'Browser storage is tied to where the file lives. Move it or open it on another device and the progress is gone.',
    kein: 'This browser grants no storage. The program keeps running but forgets the settings when it closes. Save them to a file.',
    ergaenzt: 'An older state was adopted and extended with the new settings.',
    geholt: 'The saved state has been adopted.',
    abgewiesen:
      'This file does not belong to this program or is damaged. The existing state is unchanged.',
    ueberschreiben: 'The existing state will be replaced by the file. Continue?',
    loeschen: 'Delete progress',
    loeschenWirklich:
      'All progress in the learning path will be lost, including completed and skipped lessons. The settings remain. Continue?',
    geloescht: 'The progress has been deleted. The learning path starts from the beginning again.',
  },

  lektion: {
    pieces: {
      titel: 'The cube',
      einstieg:
        'This lesson shows what the cube is made of and why its centres cannot be shifted. Without that insight every solving step remains a rule without a reason.',
      erklaerung:
        'Twenty-six pieces are visible, and they come in three kinds. Six centres carry a single colour and sit in the face of a side. Twelve edges carry two colours and sit between two centres. Eight corners carry three colours and sit at the corners of the cube. Six, twelve and eight make twenty-six; there is no twenty-seventh piece in the middle, that is where the mechanism sits.\n\n' +
        'The colours of a piece cannot be separated. An edge with white and blue remains an edge with white and blue wherever it travels, and it exists exactly once. Looking for a white face therefore always means looking for one particular piece and not for any white one.\n\n' +
        'The six centres never move relative to one another. Every turn rotates a layer around its centre, and the centre itself stays where it is. The colour of each side is therefore settled from the outset: white is where the white centre sits, and nowhere else. This can be verified on the model. Any move on the keypad, then a look at the six centres, and they face one another just as before.\n\n' +
        'From this follows the way the whole path works. Colours are not sorted; pieces are brought to their place, and where that place lies is what the centres say.',
      vorstellung:
        'The cube is not a heap of coloured squares but a frame of six fixed centres, around which twenty movable pieces turn.',
      aufgabe:
        'Every piece on the display belongs to one of the three kinds: centre, edge or corner. Naming them confidently on a few examples is enough to report the lesson as understood. The program checks nothing here, as an insight is not something it can see.',
    },
    notation: {
      titel: 'Notation',
      einstieg:
        'This lesson introduces the way moves are written down and read. It is the only technical term of the path and stays international: every further guide uses the same six letters.',
      erklaerung:
        'Each letter stands for a side of the cube, seen from where one sits in front of it. U is up, D is down, R is right, L is left, F is front, B is back. They are the initials of the English words, and that is precisely why they are the same in every language.\n\n' +
        'A letter on its own means a quarter turn of that side clockwise, seen from outside onto the side. That «from outside» is where beginners go wrong: with D the cube is seen from below, and the very same turn runs anticlockwise when watched from above.\n\n' +
        "A prime after the letter reverses the direction. R' is the quarter turn of the right side anticlockwise. A two means a half turn, that is two quarter turns; there the direction makes no difference, because both ways lead to the same position.\n\n" +
        'Six sides with three possibilities each make eighteen moves, and the cube knows no others. All of them are on the keypad below the cube, each with its key. A second table in this place could drift away from it and is therefore not kept.\n\n' +
        'The buttons below this text demonstrate each sign on its own. Pressing them one after another while watching the cube shows the notation, so there is nothing to memorise.',
      vorstellung:
        'A letter names the side, a prime the opposite direction, a two the half turn. The turn always goes the way it would look from a seat in front of that very side.',
      aufgabe:
        'The exercise starts from the solved cube. The sequence to carry out is {folge}, move by move on the keypad or the keyboard. What is checked is the position reached and not the keys pressed: a slip can be taken back or undone with the reverse move, and the task still counts as solved.',
    },
    cross: {
      titel: 'White cross',
      einstieg:
        'This lesson builds the white cross on the bottom face. It is the only one on the whole path that needs no learned sequence: four edges are found, turned above their place and pulled down.',
      erklaerung:
        'The white centre sits at the bottom, so that is where the cross grows. The cube is never turned over on this path; instead the view tilts onto the bottom face as soon as this lesson is opened. Front stays front and right stays right, and every letter of the notation keeps its meaning.\n\n' +
        'Wanted are the four edges with a white face. Each of them carries a second colour, and that second colour settles where it belongs: the edge with white and blue goes between the white centre at the bottom and the blue centre at the back, and nowhere else. Watching only the white faces builds a cross that looks like one from below and from nowhere else. Seen from the side the second colours would sit across from their centres, and the first layer could not be built on top of that.\n\n' +
        'The route of a single edge has three steps. First it is brought into the top layer, with its white face pointing up. Then the top side turns it above its place, that is above the centre of its second colour. Finally a half turn of that side face pulls it down; with the blue centre at the back that turn is B2.\n\n' +
        'Two cases need a detour. If the white face points sideways instead of up, one move pushes the edge into the middle layer and another brings it back up, which flips it over. If an edge already sits at the bottom but belongs elsewhere or lies the wrong way round, a half turn of its side face lifts it up, and the route starts again. Trying costs nothing here: every move is allowed in this lesson, and every move can be taken back.',
      vorstellung:
        'Find the edge, turn it above its place, pull it down. The cross is nothing more than that.',
      aufgabe:
        'The exercise sets up a position with the four white edges scattered. It is solved once all four stand at the bottom and their second colours match the centres of their sides. The program recognises both on the cube and unlocks the next lesson.',
    },
    firstLayerCorners: {
      titel: 'White corners',
      einstieg:
        'The first layer is now missing only its four corners. Here stands the first learned sequence of the path, and it is also the most used one: not a single solution manages without it.',
      erklaerung:
        'A corner carries three colours, and that settles its place: the corner with white, blue and orange belongs where the white, the blue and the orange centre meet. Wanted are the four corners with a white face; the other four belong on top and are no bother here.\n\n' +
        'The work happens at a single spot, the gap at the bottom front right. The corner that belongs there is first brought into the top layer and placed exactly above that gap with turns of the top side, that is to the top front right.\n\n' +
        'From there the sequence {firstLayerCorner} puts it in. The first move folds the front side up and thereby opens the gap, the second turns the top layer and lays the corner in, the third closes the gap again, and the fourth puts the top layer back. After four moves the cube stands as it did before, with one corner more in its place.\n\n' +
        'The same sequence settles two further cases with nothing new to learn. If the corner already sits in its gap but twisted, a second and a fourth application turn it on the spot. If a wrong corner sits in the gap, a single application lifts it out to the top. In both cases it is enough to repeat the sequence until the corner sits; there is no need to count.\n\n' +
        'The sequence is written down for the gap at the front right, and there are four gaps. Anyone holding a cube of their own turns the whole cube until the right gap lies at the front right. On screen the cube stays put, and the letters move along by that same quarter turn instead: F becomes R, R becomes B, B becomes L, L becomes F. Up and down stay where they are, because the turn goes around the vertical axis.',
      vorstellung:
        'The gap is opened, the corner drops in, the gap closes again. The top layer is merely the shelf the corner comes from.',
      aufgabe:
        'The exercise sets up a position with the cross standing and the white corners missing or twisted. It is solved once the first layer is complete, that is all four corners in place and untwisted. The button below the text demonstrates the sequence on the cube as it currently stands.',
    },
    secondLayer: {
      titel: 'Second layer',
      einstieg:
        'With the first layer the floor is done, and the four edges of the middle layer are missing. This lesson is the only one on the path that carries two sequences. They are mirror images of each other, and choosing between them is nothing to memorise: it follows from which side the gap lies on.',
      erklaerung:
        'Every edge of the middle layer sits next to a corner of the first layer, and the two share two colours. The edge with blue and orange belongs between the blue centre at the back and the orange centre on the right; below it stands the corner with white, blue and orange that was placed in the previous lesson. Corner and edge form a pair, and that is not a manner of speaking: the sequence takes the corner up for a moment and puts both back in together. Faster methods place this pair as one from the outset instead of setting the corner on its own first. Thinking in pairs here means not having to learn it again there.\n\n' +
        'Wanted are the four edges without yellow. Yellow is on top, so every edge with a yellow face belongs to the last layer and is no bother here. The other four belong in the middle layer, and where exactly is settled by their two colours, as it was with the cross.\n\n' +
        'The work is done on an edge lying on top. The top layer is turned until the sideways face of the edge matches the centre below it; the edge then stands above its own side, and while the sequence runs that side is the front one. Its second colour now points up, and it settles everything else: if it carries the colour of the right-hand centre, the edge belongs in the gap at the front right; if it carries the colour of the left-hand one, in the gap at the front left.\n\n' +
        'For the right gap there is the sequence {secondLayerRight}, for the left one {secondLayerLeft}. Both work the same way. The first move parks the edge aside so that it is out of the way. The next three lift the corner of the first layer up and thereby open the gap; the cross at the bottom stays untouched. The last four place edge and corner side by side on top, and the eighth move lays both down together. After that the cube stands as it did before, with one pair more.\n\n' +
        'Often the wanted edge is not on top at all but already stuck in a gap of the middle layer, in the wrong place or the wrong way round. In four out of five solutions this happens at least once, and nothing new is needed for it: a single application of the sequence belonging to that gap lifts the edge out to the top, and an edge from the top layer slides into its place. From above the route then starts again. It looks as if the method were working against itself, yet it is the shortest way: with the two learned sequences none leads straight from one gap into the other.\n\n' +
        'Both sequences are written down for the gaps at the front right and the front left, and there are four gaps. As with the corners of the first layer the cube stays put on screen, and the letters move along instead: F becomes R, R becomes B, B becomes L, L becomes F. Two sequences in four holds make eight cases, and exactly two of them fit each gap, one for each of the two ways the edge can lie on top.',
      vorstellung:
        'The edge is parked, the gap is opened, the edge is laid in together with its corner. The top layer is the workbench on which corner and edge come together.',
      aufgabe:
        'The exercise sets up a position with the first layer standing and the edges of the middle layer still missing. It is solved once both layers are complete; the program recognises it on the cube and unlocks the next lesson. The two buttons below the text demonstrate one sequence each, on the cube as it currently stands.',
    },
    topCross: {
      titel: 'Top cross',
      einstieg:
        'Two layers are standing, and the last one is done in four lessons. This is the first of them and also the first to be learned rather than explained: its sequence can no longer be traced back to a single handling. A picture takes the place of the explanation, and there are exactly three of them.',
      erklaerung:
        'Wanted is the yellow cross on the top face, that is the four edges on top with their yellow face pointing up. Where those edges point sideways does not matter in this lesson; bringing them to their place is the task of the next one. This step only orients, it does not place. That very distinction is what the faster methods carry on later, and learning it here means not having to grasp it again there.\n\n' +
        'How many of the four edges already show yellow on top is not arbitrary: it is none, two or four, never one and never three. The reason lies in the cube itself, as every turn changes the number of flipped edges by an even number. Four is the goal, and for the remaining possibilities three pictures are left. With the dot no edge points up, and the yellow centre is all that shows. With the line there are two opposite ones, with the angle two adjacent ones.\n\n' +
        'The sequence {topCross} leads one picture into the next: the dot becomes an angle, the angle becomes a line, the line becomes the cross. From the dot that makes three applications, from the angle two, from the line one. That the same sequence is needed several times in a row belongs to the matter and is no sign of a mistake.\n\n' +
        'What decides is how the picture lies while it runs. The line has to lie across in front of you, that is from left to right; lying lengthwise the same sequence leads back to the dot. With the angle the two yellow edges have to point backwards and to the left. From that hold the line comes out lying across, and the second application follows with no further turning. With the dot the hold makes no difference, as it looks the same from all four sides.\n\n' +
        'The picture is lined up by turning the top layer, with U or U2. That is what makes this lesson easier than the two before it: because the place of the edges means nothing yet, a turn on top costs nothing, and the letters of the sequence stay as they are written down. Lining it up wrongly spoils nothing; the picture then changes into another one, and the way gets longer.',
      vorstellung:
        'Three pictures, and each becomes the next: dot, angle, line, cross. The sequence is always the same, and how the picture lies is the only thing that decides which step it takes.',
      aufgabe:
        'The exercise sets up a position with two layers standing and one of the three pictures on top. It is solved once all four edges on top show yellow; the program recognises it on the cube. Several successful applications from different starting positions are required, as a single run shows only one of the three pictures; the count stands below the text.',
    },
    topEdges: {
      titel: 'Placing the edges',
      einstieg:
        'The yellow cross is standing, so the four edges on top show what they ought to show. They are merely in the wrong spot. This lesson brings them to their place without flipping any of them again. That is the second of the two terms which divide the last layer: after orienting comes placing.',
      erklaerung:
        'An edge stands in its place once its second colour matches the centre below it. The edge with yellow and blue belongs between the yellow centre on top and the blue centre at the back; lying there it is finished, and lying anywhere else on top it has to travel. Because the cross is standing, the question of the flip is settled, and only the question of the place is left.\n\n' +
        'The sequence {topEdges} swaps three of the four edges on top in a ring and leaves the fourth standing, namely the one at the back. It has been checked against the model that it touches not a single corner and flips no edge; the yellow cross and both lower layers stay untouched. That standing edge is the anchor of the whole lesson.\n\n' +
        'The handling therefore consists in finding that anchor. The top layer is turned until exactly one edge matches its centre. If all four match at once, then only the top layer had been turned, and the step is done without a single application. Otherwise the matching edge is the one that stays put, and the sequence is applied in the hold in which it lies at the back. Anyone holding a cube of their own turns the whole cube for that; on screen it stays put, and the letters move along by that same quarter turn instead: F becomes R, R becomes B, B becomes L, L becomes F.\n\n' +
        'If the goal is not reached after one application, a second one is enough. The reason is how the sequence is built: applied three times it restores the starting position, so applied twice it yields the same ring swap in the opposite direction. Both directions are thus within reach of one single learned sequence, and the second sequence that other guides carry at this point is not needed.\n\n' +
        'Rarely there is no turn of the top layer in which exactly one edge matches. Two pairs waiting to be swapped then face each other, and there is no anchor. Nothing new is needed for that either: the sequence is applied once in any hold, and afterwards there is a turn with exactly one matching edge. From there the handling works as it otherwise does.',
      vorstellung:
        'One edge stays standing, the other three travel in a ring. Whoever looks for the standing one first has grasped the lesson; everything else is the sequence itself.',
      aufgabe:
        'The exercise sets up a position with the yellow cross standing and the edges on top swapped. It is solved once all four edges on top match the centres of their sides; the program recognises it on the cube. Several successful applications from different starting positions are required, as the arrangement is a different one each time; the count stands below the text.',
    },
    topCorners: {
      titel: 'Placing the corners',
      einstieg:
        'The edges on top are standing, and with them both lower layers; the four corners are missing. This lesson brings them to their place and does not twist them. Some will stand there twisted afterwards, and that is no mistake but exactly the position the last lesson builds on.',
      erklaerung:
        'A corner stands in its place once its three colours match the three centres that meet there. The corner with yellow, blue and orange belongs to the top back right, where the yellow, the blue and the orange centre come together. How it is twisted plays no part here: whether yellow points up, backwards or to the right, it stands in its place. That distinction is the whole point of the lesson, and overlooking it is the commonest reason for hunting at this stage after something that is not missing at all.\n\n' +
        'The sequence {topCorners} swaps three of the four corners on top in a ring and leaves the fourth standing, namely the one at the back left. It has been checked against the model that it twists none of the three and touches not a single edge. As with the edges the standing corner is the anchor, and as there a second application covers the opposite direction, because applied three times the starting position is back.\n\n' +
        'What is wanted is therefore the corner that already stands in its place, however it may be twisted. The sequence is applied in the hold in which that corner lies at the back left; on screen the letters move along again for that, F becomes R, R becomes B, B becomes L, L becomes F. Unlike with the edges there is no turning on top here, and not out of caution but because it would gain nothing: the edges are already standing, and every turn of the top layer would take them off their place.\n\n' +
        'If not a single corner stands in its place, then two pairs are to be swapped, and there is no anchor. The sequence is then applied once in any hold; afterwards exactly one corner stands, and the handling works as it otherwise does. Because all twelve edges are standing at this point, those are the only two cases there are at all: three corners in a ring, or two pairs crosswise.\n\n' +
        'For the same ring swap there is a shorter and more widespread sequence of eight moves. It is not the one chosen here, handier though it is, because it twists the three corners by a third of a turn each as well. That would make the point of this step wrong, that it places and does not twist, and the separation between placing and twisting would be lost. The form learned here costs one move more and keeps the point. In the faster methods, which orient first and place afterwards, the short sequence is the right one; which of the two fits is decided by the order of the steps and not by their length.',
      vorstellung:
        'One corner stays standing, the other three travel in a ring. What is wanted is the corner that already stands in its place, and twisted it may well be.',
      aufgabe:
        'The exercise sets up a position with the edges on top standing and the corners swapped. It is solved once every corner stands in its place; twisted corners are allowed there, and the program knows the difference. Several successful applications from different starting positions are required; the count stands below the text.',
    },
    cornerTwist: {
      titel: 'Twisting the corners',
      einstieg:
        'The last lesson of the path, and the shortest one to describe. Every piece stands in its place, some corners on top are merely twisted, and a single sequence turns them straight. One sentence has to come first, one that no other lesson needs: the cube looks wrecked along the way.\n\n' +
        'That is not a mistake, it is the method. Of the twenty movable pieces only two are in place at times between applications, and everything comes back as soon as the last corner sits straight. This is exactly where most people give up, just before they are done. So that the eye does not get caught on the mess, the display shows only the working spot during this lesson; everything else steps back.',
      erklaerung:
        'What to look for are the corners on top whose yellow face does not yet point up. How many there are is not arbitrary: two, three or four, never a single one. Behind that stands the same conservation law from which the mess later dissolves again, as the twists of all eight corners always add up to a multiple of a full turn. On a randomly scrambled cube everything is already in order at this point in a good third of the cases; in the exercise there is always something to do.\n\n' +
        'The work happens at a single spot, the corner at the top front right. That is the one the display leaves standing. The sequence {cornerTwist} twists whichever corner lies there and touches no other corner and no edge of the top layer. Two applications turn it by a third, four by two thirds; it is applied until the yellow face points up. After an odd number of applications the corner sits at the bottom, which is why only even numbers come into question.\n\n' +
        'Anyone who has built the first layer already knows these four moves. It is the same sequence as in lesson 3, mirrored along the horizontal axis. There the front side opens the gap below, the top layer lays the corner in, and both close again. Here the right side opens, and the bottom layer is the shelf. It thereby plays the part the top layer had before: it is the workbench, and a workbench is an untidy place.\n\n' +
        'Once the corner sits right, the top layer is turned until the next twisted corner lies at the front right, and the sequence starts again. Nothing else is turned. That one rule is the whole handling, and whoever follows it cannot lose the cube with this sequence.\n\n' +
        'At the end the top layer is turned back as far as it was moved along the way. Only that one move brings the cube back: before it twelve of the twenty pieces stand, after it all twenty. Losing count costs nothing, as six applications in a row lead exactly back to the starting position.\n\n' +
        'Other guides carry a shorter sequence of seven moves at this point, one that needs only the top and the right side and never touches the lower layers. Here it would be wrong all the same, and the reason is not its length: checked against the model, it swaps three edges and all four corners of the top layer. On this path both are already standing, and it would thus destroy the work of the two previous lessons. The faster methods twist first and place afterwards; there nothing stands that it could destroy, and there it is the right choice. Which sequence fits is therefore decided by the order of the steps and not by their length.',
      vorstellung:
        'The top layer is never turned except to bring the next corner to the working spot. Everything else heals itself.',
      aufgabe:
        'The exercise sets up a position with every piece in its place and two to four corners on top twisted. It is solved once the cube is solved. For the first time on this path the goal of the lesson is also the goal of the whole. Several successful applications from different starting positions are required; the count stands below the text.',
    },
    solveAlone: {
      titel: 'The whole path',
      einstieg:
        'The last lesson brings nothing new. All six sequences have been learned, all seven steps have been explained, and what is added here is only the task of applying them without guidance: three scrambled cubes one after another.\n\n' +
        'The difficulty now lies elsewhere than in the lessons before. There the step was given and the starting position set up for it; here stands a cube scrambled at random, and the only question is which step is due. The program no longer answers it by itself. There is help, but on request only, and it names the step and not the moves.',
      erklaerung:
        'The path consists of seven steps in a fixed order: the white cross at the bottom from lesson 2, the four white corners from lesson 3, the four edges of the middle layer from lesson 4, the yellow cross on top from lesson 5, the edges of the last layer into their places from lesson 6, the corners into their places from lesson 7, and finally the corners turned straight from lesson 8.\n\n' +
        'That order is not a habit but a condition. Every step presupposes what the previous one has built, and leaves it untouched: the sequence of the middle layer works above the finished first one, the sequences of the last layer work above both. Bringing a step forward takes apart the one that comes before it.\n\n' +
        'Recognising where one stands therefore goes from the bottom upwards, with six questions. Is the white cross at the bottom standing? Is the first layer complete, its four corners included? Do the four edges of the middle layer sit in their places? Do all four edges on top show their yellow face upwards? Do their second colours match the centres below them? Does every corner on top stand in its place, however it may be twisted? The first question to be answered with no names the step that is due; if none is answered with no, all that is left is twisting the corners.\n\n' +
        'That very question is what the help below the text answers as well. It names the number of the step, its name and the lesson in which it stands. The sequence itself it does not show, for there it stands along with its explanation, and whoever were handed it here would have forgotten it again by the next cube. Its answer holds for the position on the table at that moment, and it therefore disappears with the next move.\n\n' +
        'Nothing can be lost along the way. Every move can be taken back, and even a thoroughly dismantled cube only means that an earlier step is due again; from every position the same path leads to the goal. Anyone who has got stuck asks for a new position and starts that one run afresh.\n\n' +
        'A word on the extent, so that the number of moves comes as no shock. A complete solution by this method takes 107 moves on average, 63 in the best measured case and 139 in the worst. Whoever solves alone for the first time needs more, because of looking things up and taking the odd move back. What is counted here is not the number of moves but the solved cube.',
      vorstellung:
        'Do not look for a solution, ask which step is due. The path always runs from the bottom upwards, and the cube is solved not by one idea but by seven answers to the same question.',
      aufgabe:
        'The exercise scrambles the cube and steps back. It is solved once the cube is solved; the program recognises it itself and counts the run. Three solved cubes in a row are required, and with them the learning path is at an end. An abandoned run does not count, but it costs nothing either: the ones already solved stay counted.\n\n' +
        'Anyone who owns a cube should reach for it now at the latest. On screen the cube stays put and the letters move along with the hold; in the hand the whole cube is turned instead, until the working spot lies at the front right. That is the only difference between the two, and in the hand it is the easier way. Everything else is the same.',
    },
  },
};
