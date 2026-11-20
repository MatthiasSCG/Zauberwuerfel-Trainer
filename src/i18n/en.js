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
    uebergang: 'Transition',
    anfaengerverfahren: 'Beginner method',
    cfop: 'CFOP',
    training: 'Training',
    zeitnahme: 'Timing',
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
    einsteigen: 'Start here',
    einsteigenWirklich:
      'The lessons before this one that are still open will count as skipped, not as completed. What is already completed stays so. Start here?',
    eingestiegen: 'Skipped, as this lesson builds on them: {liste}. Practice is now open.',
    anwendungen: '{getan} of {verlangt} successful applications',
    abgeschlossen: 'This lesson is completed.',
    uebersprungen: 'This lesson was skipped. It can be taken up again at any time.',
    bisher: 'So far {stand}.',
    gesperrt: 'This lesson unlocks once the previous one is done, or right away with “Start here”.',
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

  // The flashcard training, 4T-0138. See the German file for why this is its
  // own branch and not an extension of `uebergang`.
  training: {
    stufeMarke: 'Which stage',
    formMarke: 'What to practise',
    form: {
      recognition: 'Recognise',
      execution: 'Execute',
    },
    frei: 'available',
    nochGesperrt: 'still locked',
    umfang: '{titel} · {faelle} cases available',
    aufgabeStellen: 'Set a task',
    andereAufgabe: 'Another task',
    naechsteAufgabe: 'Next task',
    frage: 'Which case is this?',
    auftrag: 'Execute the sequence for: {name}',
    aufgeben: 'Give up',
    richtig: 'Correct: {name}',
    falsch: 'Not this one. The answer was: {name}',
    geschafft: 'Solved: {name}',
    aufgegeben: 'Given up. The attempt counts as a miss: {name}',
    folgeMarke: 'The sequence',
    ausrichtungMarke: 'How to align beforehand',
    wiederholen: 'Try again',
    merkmal: {
      gesucht: 'The case in question: {name}',
      genannt: 'The answer given: {name}',
    },
    messwerteMarke: 'How well each case sits',
    messwerteErklaerung:
      'The first number gives the attempts, the second how many of them were missed. Giving up counts as a miss.',
    messwerteFall: 'Case',
    messwertGelesen: 'Attempts: {versuche}, missed: {fehler}',
    messwertLeer: 'not practised yet',
    zuruecksetzen: 'Reset the numbers',
    zuruecksetzenBereit: 'resets the numbers for this stage',
    zuruecksetzenLeer: 'nothing to reset, nothing has been practised here yet',
    zuruecksetzenWirklich:
      'The numbers for stage “{titel}” will be deleted for both practice modes. Your learning progress stays, that is which cases you have already solved. Continue?',
    gesperrt:
      'No stage is available for practice yet. The first one unlocks once the learning path is completed or skipped, or right away with “Start here” in the transition.',
    nurFaelle:
      'Practice draws on the stages that have cases. The others are ways of thinking and are practised on the cube.',
  },

  // Der Bereich der Zeitnahme, 4T-0147.
  zeitnahme: {
    // Der Punkt und nicht das Komma; das ist der Grund, aus dem das Zeichen im
    // Sprachbaum steht und nicht in der Rechnung.
    trenner: '.',
    weg: {
      screen: 'On screen',
      ownCube: 'On your own cube',
    },
    los: 'Go',
    jetzt: 'Start now',
    fertig: 'Done',
    abbrechen: 'Cancel',
    uhrWert: {
      verstrichen: '{zeit}',
      verbleibend: '{zeit} s',
    },
    uhrMarke: {
      verstrichen: 'Elapsed time',
      verbleibend: 'Remaining inspection time',
    },
    ergebnis: '{weg}: {zeit} s',
    // Britisches Englisch, wie die Oberfläche im Übrigen: Tag vor Monat.
    gebiet: 'en-GB',
    verlaufMarke: 'My times',
    verlaufErklaerung:
      'The two ways are kept apart. A time on screen and one on your own cube are not comparable.',
    verlaufLeer: 'No attempt has been timed on this way yet.',
    verlaufBestzeit: 'Best time',
    verlaufSchnitt: 'Average of {fenster}',
    verlaufKeinWert: 'too few attempts yet',
    verlaufZeit: '{zeit} s',
    verlaufSpalte: {
      nummer: 'Attempt',
      zeit: 'Time',
      zeitpunkt: 'When',
    },
    verlaufGelesen: 'Attempt {nummer}: {zeit} s, timed on {zeitpunkt}',
    verlaufBestzeitGelesen: 'Best time {zeit} s, attempt {nummer}, timed on {zeitpunkt}',
    verlaufMehr: 'Showing the last {gezeigt} of {gesamt} timed attempts.',
    verlaufVerwerfen: 'discard',
    verlaufVerwerfenGelesen: 'Discard attempt {nummer}',
    verlaufLoeschen: 'Delete all times',
    verlaufLoeschenWirklich:
      'Delete all timed attempts, on both ways? Best time and averages will be gone. Your learning progress stays.',
    verlaufLoeschenBereit: 'deletes the timed attempts of both ways',
    verlaufLoeschenLeer: 'disabled because no attempt has been timed yet',
    hinweis: {
      bereit: 'Choosing a way scrambles the cube and sets up the attempt.',
      fertig: 'A new attempt starts by choosing a way.',
      vorbereitet: {
        screen: 'The position is set. “Go” starts the clock.',
        ownCube:
          'The scramble is written out below the move keys. Reproduce it on your own cube first, then “Go”.',
      },
      inspektion: {
        screen: 'Look at the position. The clock starts by itself, “Start now” right away.',
        ownCube:
          'Pick up your cube and look at the position. The clock starts by itself, “Start now” right away.',
      },
      laeuft: {
        screen: 'The clock stops by itself once the cube is solved.',
        ownCube: '“Done” stops the clock.',
      },
    },
  },

  uebergang: {
    zaehlung: 'Stage {nummer}',
    stand: '{abgeschlossen} of {gesamt} completed',
    vorige: 'Previous stage',
    naechste: 'Next stage',
    ueben: 'Start practising',
    uebenNeu: 'New practice position',
    ueberspringen: 'Skip',
    einsteigen: 'Start here',
    abgeschlossen: 'This stage is completed.',
    uebersprungen: 'This stage was skipped. It can be taken up again at any time.',
    bisher: 'So far {stand}.',
    gesperrt: {
      lernpfad:
        'This stage unlocks once the learning path is completed or skipped, or right away with “Start here”.',
      stufe: 'This stage unlocks once the previous one is done, or right away with “Start here”.',
    },
    zustand: {
      abgeschlossen: 'completed',
      uebersprungen: 'skipped',
      offen: 'open',
      gesperrt: 'locked',
    },
    deckung: '{getan} of {verlangt} cases solved',
    anwendungen: '{getan} of {verlangt} successful applications',
    deckungMarke: 'The cases of this stage',
    fallGelungen: 'solved',
    fallFehlt: 'still missing',
    vorfuehren: 'Demonstrate: {folge}',
    vorfuehrenAlternative: 'Alternative: {folge}',
    ohneFall: 'This stage finds nothing to do in this position.',
    fassungMarke: 'The scope of this stage',
    verdeckt: 'While a practice task is running, the case stays hidden here.',
    ueberspringenWirklich:
      'The stage will not count as completed, but it does unlock the next one. Continue?',
    einsteigenWirklich:
      'Whatever is still open before this stage will count as skipped, not as completed, including lessons of the learning path. What is already completed stays so. Start here?',
    eingestiegen: 'Skipped, as this stage builds on them: {liste}. Practice is now open.',
    begonnen: 'The practice position is set. Turn the cube until the goal is reached.',
    geschafft: 'Well done. {getan} of {verlangt} applications.',
    fallGeschafft: 'Well done: {fall}. {getan} of {verlangt} cases solved.',
    fertig: 'Well done. This stage is completed.',
    wegFertig: 'Well done. The whole transition is complete.',
    freigegeben: 'Well done. Stage {nummer}, {name}, is now unlocked.',
    bautAufDiese: 'Built upon by: {liste}.',
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
    klartextErweitert: '{art}, {richtung}, seen from {bezug}',
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

  // Die drei neuen Zugarten und die sechs Blicke auf sie, siehe `de.js`.
  zugart: {
    mittel: 'middle slice',
    doppel: 'double layer',
    ganz: 'whole cube',
  },

  seiteAus: {
    U: 'the top',
    R: 'the right',
    F: 'the front',
    D: 'the bottom',
    L: 'the left',
    B: 'the back',
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
    inspektion: 'Inspection time',
    ton: 'Sound',
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
    inspektion:
      'While practising a waiting time is a nuisance; when rehearsing the contest routine it belongs.',
    ton: 'Two signals during timing: when the clock starts and when the cube is solved.',
  },

  wert: {
    palette: { kanonisch: 'Standard', alternativ: 'For colour deficiency' },
    kennzeichnung: { aus: 'Off', an: 'On' },
    bewegung: { aus: 'Off', langsam: 'Slow', mittel: 'Medium', schnell: 'Fast' },
    ansicht: { raeumlich: 'Three-dimensional', netz: 'Flat net' },
    schriftgroesse: { klein: 'Small', normal: 'Normal', gross: 'Large', sehrGross: 'Very large' },
    sprache: { de: 'Deutsch', en: 'English' },
    inspektion: { aus: 'Off', s15: '15 s', s30: '30 s' },
    ton: { aus: 'Off', an: 'On' },
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
    zuNeu:
      'The stored state comes from a newer version of this program. It is left untouched, and nothing will be saved during this session. Open the newer version, or load a saved state from a file.',
    dateiZuNeu:
      'This file comes from a newer version of this program and was not adopted. The existing state is unchanged.',
    ueberschreiben: 'The existing state will be replaced by the file. Continue?',
    loeschen: 'Delete progress',
    loeschenWirklich:
      'All progress will be lost: completed and skipped lessons and stages, the solved cases, the chosen scopes and the training numbers. The settings and the recorded times remain. Continue?',
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
        // «and this path needs no others» statt «and the cube knows no
        // others», siehe `de.js` und 4T-0101.
        'Six sides with three possibilities each make eighteen moves, and this path needs no others. All of them are on the keypad below the cube, each with its key. A second table in this place could drift away from it and is therefore not kept.\n\n' +
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
        'That is not a mistake, it is the method. Of the twenty movable pieces only two are in place at times in the middle of the sequence, and everything comes back once the last corner sits straight and the top layer has been turned back. This is exactly where most people give up, just before they are done. So that the eye does not get caught on the mess, the display shows only the working spot during this lesson; everything else steps back.',
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

  // Die Worte zu den Fällen von CFOP, angesprochen über `textKeyFor` in
  // `lessons/cases.js`. Der Baum ist derselbe wie auf Deutsch; die Begründung
  // der drei Bausteine steht dort.
  stufe: {
    orientLastLayer: {
      titel: 'Orienting in one look',
      einstieg:
        'The first stage of the transition rearranges the last layer. The beginner method solves it in four steps: first the cross on top, then placing the edges, then placing the corners, and finally twisting the corners. CFOP turns that into two working passes, first orienting and then placing, and this stage is the first of them.\n\n' +
        // Die einzige Auflösung des Namens im ganzen Programm, entschieden am
        // 2026-08-28 in 4T-0122. Sie nennt die englischen Wörter, weil die vier
        // Buchstaben sonst dunkel blieben, und von den Kurzbezeichnungen der
        // Wettkampfszene allein die eigene. Die der Stufen 2 und 3 stehen dort,
        // wo sie hingehören; eine zweite Nennung hier nähme sie ihnen weg.
        'The name CFOP names the four stages of the method by their initials: cross is the cross at the bottom, first two layers are the first two layers, orientation is the orienting of the last layer and permutation its placing. This stage is the third of them. Competition slang shortens it to OLL; here it is called orienting the last layer, and that is what it stays.',
      erklaerung:
        'Orienting means that every piece of the last layer shows its top colour upwards. Where it stands while doing so does not matter; the second pass sorts that out. In the beginner method this single task is spread over two lessons that lie far apart: lesson 5 aligns the edges, lesson 8 the corners, and between them stand the two lessons that place. Here they move together and become one pass.\n\n' +
        'The first look is at the edges, and it is familiar. They are the same three pictures that lesson 5 shows: the dot, the line and the angle. The only new thing is that each of them has its own sequence here and leads to the cross in a single run, instead of first producing the next picture. For the line it is the same sequence as there; for the dot and the angle one new sequence each is added.\n\n' +
        // Die Einstufung «gelernt» aus Abschnitt 11.4 wird hier ausgesprochen
        // und nicht umschrieben. Ein Text, der mehr behauptet, wäre eine
        // unwahre Aussage über das Verfahren.
        'The second look is at the corners, and it is learned rather than explained. What can be read off is which of them already show their top colour upwards and where the others point; the picture says no more, and no more is needed. Each picture has a sequence, and which one fits the position at hand is named by the display. Why this sequence twists these corners cannot be said in one sentence; anyone looking for the reason will not find it, and that is not a gap in this guide.\n\n' +
        'At one point a statement of the beginner method is taken back, and with reason. Lesson 8 explicitly rejects a short and widely used sequence of seven moves: it swaps three edges and all four corners of the top layer and thereby destroys the work of lessons 6 and 7. Here nothing stands on top yet that it could destroy, because placing comes afterwards. The same intervention is damage there and the task here, and two sequences of that build therefore solve one case each of this stage. The older statement remains correct, as it applies to a different order of the steps.\n\n' +
        'Anyone who knows this stage and nothing else of the transition still reaches the end. After it every piece of the last layer points upwards, and the two sequences from lessons 6 and 7 bring them to their places without flipping or twisting a single one of them again. Checked against the model this holds for both: neither of them flips an edge or twists a corner. The transition can therefore be walked stage by stage and need not be learned in one piece.\n\n' +
        'Two sequences it is, then, first the one for the edges and then the one for the corners, and each is applied exactly once. In the beginner method the same two tasks demand several applications of the same sequence: three from the dot and two from the angle, and two or four per corner when twisting. Therein lies what makes lesson 8 unpleasant: between its applications the cube looks wrecked, and one has to carry on regardless. Here every case is settled with a single application, and afterwards the first two layers stand again.',
      vorstellung:
        'First the edges, then the corners, and both times the picture on top alone says which sequence is due. The three pictures of the edges are those from lesson 5. With the corners what counts is which already show their top colour upwards and where the others point.',
      aufgabe:
        'The exercise sets up a position with the first two layers standing and the last layer not yet oriented. It is solved once a single colour is visible on top; where the pieces stand while doing so does not matter, and the program knows the difference.\n\n' +
        // **Keine Zahl im Wortlaut.** Wie viele Fälle die Stufe hat, rechnet
        // `casesOf` aus dem Bestand, und die Anzeige zeigt es. Eine geschriebene
        // Zahl liefe der gerechneten davon, sobald der Bestand wächst.
        'What is counted is not how often the exercise has been run, but which case has succeeded. The next stage is released once every case of this one has succeeded once; which are still missing is shown by the list below the text. The buttons at the case demonstrate its sequence, just as the cube lies at that moment.',
      // Die Wahl des Umfangs, seit 4T-0196 je Stufe. **Keine Fallzahl im
      // Wortlaut**, sondern ein Platzhalter, aus demselben Grund wie oben.
      fassung: {
        reduced: 'Guided: {anzahl} cases',
        full: 'Full scope: {anzahl} cases',
      },
      fassungGewinn:
        'In the full scope a single algorithm solves what the guided route needs two for. In exchange there are more cases to learn. Both routes stay available, and switching costs no progress.',
      rueckfall:
        'You have not practised this case yet. The guided scope solves the same position in two steps, using algorithms you already know; you can switch below under «The scope of this stage».',
      // Der Satz an einer Lage, zu der der geltende Umfang nichts führt,
      // 4T-0196. Er steht auch dort, wo er heute nicht auszulösen ist; die
      // Begründung steht bei der deutschen Fassung.
      ohneHinterlegtenFall:
        'The scope in force holds no algorithm for this position. The full scope covers it; you can switch below under «The scope of this stage».',
    },
    permuteLastLayer: {
      titel: 'Placing in one look',
      einstieg:
        'The second stage brings the pieces of the last layer to their places. What the previous one oriented is placed here, and afterwards the cube is solved. The beginner method needs two lessons for this, first the edges and then the corners; here both belong to one working pass.\n\n' +
        // Die Kurzbezeichnung dieser Stufe, einmal und mit Erklärung, nach der
        // Entscheidung vom 2026-08-28 in 4T-0122. Den Namen CFOP löst Stufe 1
        // auf; hier steht er nicht noch einmal.
        'The term is already there. Lessons 6 and 7 are called placing, and the same word now carries the second of the two stages. Competition slang shortens it to PLL; here it is called placing the last layer, and that is what it stays.',
      erklaerung:
        'After the first stage a single colour shows on top, and with that the question of orientation is settled. What remains is the question of place: every piece of the last layer belongs between the centres whose colours it carries. That is the same task the beginner method spreads over lessons 6 and 7, only without the step that would still have to twist something afterwards.\n\n' +
        'The work happens in two looks, first the corners and then the edges. This order is not habit but calculation: none of the four edge sequences touches a corner on top, while one of the two corner sequences takes the edges along. Whoever placed the edges first would undo that work with the next sequence.\n\n' +
        'The first look is at the corners, and there are two pictures. Either one of the four side faces shows the same colour at both of its top corners, or none does. In the first case that pair already stands correctly relative to each other and the sequence orders the rest around it; in the second nothing stands, and it is the rarer of the two.\n\n' +
        // Die Zahlen sind gemessen, nicht abgeschrieben: 9 gegen 19 Züge, und
        // die Suche bis elf Züge steht in 4T-0112.
        'For the second corner case there is no sequence of its own. It is solved by applying the sequence of the first one twice, with a quarter turn of the top face in between; after the first run the matched pair stands there, and the second run is the familiar case. That is not carelessness but a measurement: the move space has been searched exhaustively up to eleven moves and stayed empty. Nineteen moves it is, then, against nine, and still only one sequence has to be learned.\n\n' +
        'The second look is at the edges, and there are four pictures. If a side face shows three equal colours in its top row, its edge already stands and the other three travel in a ring; which way round is told by the edge opposite. If no side shows such a line, two pairs have to be swapped, either adjacent ones or opposite ones.\n\n' +
        'The work of the first stage stays untouched throughout. Checked against the model this holds for all six sequences: none of them flips an edge on top or twists a corner on top. What points upwards once keeps pointing there until the end.\n\n' +
        'With that the last layer is settled in two working passes instead of four steps. The gain does not lie in the number of sequences, as each of the two passes still needs two here, but in their reliability: each look is settled with exactly one application. In the beginner method the same layer takes up to eight, measured, because there the same sequence has to be applied again and again until the picture is right.',
      vorstellung:
        'Who already stands right, and what travels where. With the corners a side face with two equal colours tells you, with the edges a continuous line of three.',
      aufgabe:
        'The exercise sets up a position with the last layer already oriented and its pieces not yet in their places. It is solved once the cube is solved: the goal of this stage is also the goal of the whole.\n\n' +
        'What is counted is not how often the exercise has been run, but which case has succeeded. The next stage is released once every case of this one has succeeded once; which are still missing is shown by the list below the text. The buttons at the case demonstrate its sequence, just as the cube lies at that moment.',
      fassung: {
        reduced: 'Guided: {anzahl} cases',
        full: 'Full scope: {anzahl} cases',
      },
      fassungGewinn:
        'In the full scope a single algorithm solves what the guided route needs two for. In exchange there are more cases to learn. Both routes stay available, and switching costs no progress.',
      rueckfall:
        'You have not practised this case yet. The guided scope solves the same position in two steps, using algorithms you already know; you can switch below under «The scope of this stage».',
      ohneHinterlegtenFall:
        'The scope in force holds no algorithm for this position. The full scope covers it; you can switch below under «The scope of this stage».',
    },
    firstTwoLayers: {
      titel: 'Two layers at once',
      einstieg:
        'The third stage merges two steps of the beginner method into one. Lesson 3 places the corners of the first layer, lesson 4 the edges of the middle layer; here corner and edge travel to their place together. The bottom and the middle layer thus come about in one working pass instead of two.\n\n' +
        // Die Kurzbezeichnung dieser Stufe, einmal und mit Erklärung, nach der
        // Entscheidung vom 2026-08-28 in 4T-0122. Den Namen CFOP löst Stufe 1
        // auf; hier steht er nicht noch einmal.
        'The term is already there. Lesson 4 calls corner and edge a pair and says there that faster methods assemble this pair from the start. Competition slang shortens the stage to F2L, after the English words for the first two layers; here it is called the first two layers, and that is what it stays.',
      erklaerung:
        'A pair consists of a corner of the first layer and the edge that lies next to it. Both share two colours, and that settles which edge belongs to which corner: to the corner with white, blue and orange belongs the edge with blue and orange. Four corners, four edges, four pairs, and each has its own slot between two side centres.\n\n' +
        // Die Aussage ist gerechnet und nicht geschätzt: Über 2000 Lösungen
        // öffnen alle 7555 Anwendungen des dritten Schrittes eine Ecke, die
        // vorher an ihrem Platz stand. Die Rechnung steht in 4T-0124.
        'The beginner method takes hold of these corners a second time. Lesson 3 brings it to its place and closes the slot; when lesson 4 brings the matching edge, it has to lift that same corner up again to open the slot. Checked against the model over two thousand solutions this holds without exception: every single application of lesson 4 opens a corner that was already standing. Whoever inserts the pair together from the start saves that second journey.\n\n' +
        'The handling for it is the same one lessons 3 and 4 describe, only shorter. One move folds the side up and opens the slot, a turn of the top layer puts corner and edge side by side, and the counter move lays both in together and closes the slot. Three moves, if the pair already lies suitably on top. Checked against the model this handling leaves the cross at the bottom untouched and stirs, of the four pairs, only the one being worked on. For the other three slots it is the same handling, turned on by a quarter, exactly as in lessons 3 and 4.\n\n' +
        'Every slot lies between two sides, and either of them can open it. Which of the two is due is told by the position of the pair on top and not by a rule; that is the point at which this stage demands thinking rather than recall.\n\n' +
        'The same handling also takes out. If a corner or an edge sits in the wrong slot or the wrong way round in it, a single application brings both pieces into the top layer, and from there the way begins anew. Checked against the model the two pieces sitting there really do end up on top. So there is nothing second to learn, but one handling for two tasks.\n\n' +
        'The top layer is the workbench here and no longer merely the shelf. Corner and edge are assembled up there so that a single turn brings them together in front of the open slot. How many moves that costs depends on how the two of them lie, and therein lies the actual work of this stage.\n\n' +
        'What has to be learned is not a list of positions. There are collections that give a fixed sequence for every position, and they come later; whoever has the mental picture also solves a position that stands in no list. The gain of this stage is to be seen and not to be counted: the number of moves drops visibly, and by how much depends on the position. To promise a particular number would be dishonest.',
      vorstellung:
        'Open the slot, lay the pair in, close the slot. The top layer is the workbench on which corner and edge come together before they go down as one.',
      aufgabe:
        'The exercise sets up a scrambled cube. It is solved once the first two layers stand, that is the bottom complete and all four edges of the middle layer in their places. The cross belongs to it and comes first as before. The next stage is released after three successful applications from different starting positions; the count stands below the text.\n\n' +
        // Was das Programm nicht prüfen kann, steht hier und wird nicht
        // überspielt. Die Entscheidung dazu ist am 2026-08-28 in 4T-0124
        // gefallen, samt der Messung, die zwei Wegkriterien verworfen hat.
        'What is checked is the position on the cube and not the way there. Whoever carries out the two steps of the beginner method one after the other reaches the same goal, and the cube does not show it in the end. Whether the work was done in pairs is therefore known to the user alone.',
      // **Die einzige Stufe, deren beide Umfänge sich in der Art unterscheiden
      // und nicht in der Zahl**, 4T-0196. Die Begründung steht bei der
      // deutschen Fassung.
      fassung: {
        reduced: 'Insert it yourself',
        full: 'Full scope: {anzahl} cases',
      },
      fassungGewinn:
        'In the full scope a ready-made algorithm inserts the pair in few moves, for every position it can take. It shortens the way you go yourself, it does not replace it: whatever stands in no list you still solve with the handhold of this stage. In exchange there is a sequence to learn for every position, where your own route makes do with one handhold. Both routes stay available, and switching costs no progress.',
      rueckfall:
        'You have not practised this case yet. You can also insert the pair yourself, with the handhold of this stage; you can switch below under «The scope of this stage».',
      ohneHinterlegtenFall:
        'No algorithm is stored for this position, and that is deliberate: a piece of the pair is stuck in a slot here. Bring it up with the handhold of this stage, and you arrive at one of the positions for which a sequence stands ready.',
    },
    plannedCross: {
      titel: 'The planned cross',
      einstieg:
        'The fourth stage is the only one whose task stays unchanged. At the end there is the same white cross at the bottom that lesson 2 builds, with the same four edges in the same places. What changes is the procedure alone: the four edges are looked at together instead of being sought one after another.\n\n' +
        // Keine Kurzbezeichnung der Wettkampfszene. Abschnitt 6 des
        // Didaktik-Konzepts nennt genau drei, und cross ist keine davon,
        // sondern das englische Wort für das Kreuz. Entschieden in 4T-0122.
        'With it the transition is complete. Whoever knows the three previous stages already solves the cube by the new method; whoever plans the cross as well manages without a pause for thought between the start and what follows.',
      erklaerung:
        'Lesson 2 works edge by edge: find one, turn it over its place, pull it down, then the next. Each of these four rounds starts with a fresh look, and whatever happened along the way in the previous round does not count. That is exactly what gets lost, and exactly what this stage brings back.\n\n' +
        'Planning ahead means: look first, turn afterwards. Before the first move all four white edges are located and their positions laid side by side. Only then comes the decision in which order they go to their places.\n\n' +
        // Die vorgeführte Lage steht fest im Text und wird nicht gezogen,
        // entschieden am 2026-08-28 in 4T-0125. Alle Zahlen darin sind über
        // eine vollständige Breitensuche gerechnet, die Rechnung steht im Task.
        'An example on which this can be shown. The white and green edge already stands at the bottom front. The white and orange one lies at the top back, with white facing up. The white and red one is stuck in the middle layer, front right, with white facing forward. The white and blue one lies at the bottom right, that is on the place of the white and orange one, and the wrong way round there: blue points down and white to the side.\n\n' +
        'Whoever works edge by edge sees three separate tasks: pull the white and orange one down, get the white and red one out of the middle layer, free the white and blue one from its wrong position. Whoever looks at all four together sees one move that shifts three of them. A quarter turn on top puts the white and orange one over its place; the half turn of the right side that then pulls it down at the same time lifts the white and blue one out of its wrong position and pushes the white and red one from the front slot of the middle layer into the back one, from which it drops into its place three moves later. Four moves then remain, and the cross stands.\n\n' +
        'Six moves it is, then, on this position. Edge by edge the same cross on the same position takes eleven. The difference lies not in dexterity but in the fact that one way looks before the first move and the other does not.\n\n' +
        'How far this carries has been calculated. All positions the four white edges can take have been counted and worked through one by one; there are a good hundred and ninety thousand. Not a single one of them needs more than eight moves, and on average it is not quite six. Edge by edge it is fifteen on average and twenty-six in the worst case. The eight is a bound and not a promise: it says that it never has to be longer, not that the user finds the shortest way.\n\n' +
        'What this stage brings in is time and no new picture on the cube. In the end the cube looks exactly as it does after lesson 2, and whoever only looks at it notices no difference. That is why this stage comes last: its gain is the only one of the transition that cannot be seen, only measured.',
      vorstellung:
        'Look at four edges together instead of seeking them one after another. Look first, turn afterwards: whoever knows where all four lie finds the order in which one move shifts more than one edge.',
      aufgabe:
        'The exercise sets up a scrambled cube. It is solved once the white cross stands at the bottom, that is all four white edges in their places and the right way round, with their second colours at the centres of their sides. Nothing is released any more, as this is the last stage; three successful applications are required all the same, and the count stands below the text.\n\n' +
        // Zwei Grenzen der Prüfbarkeit, benannt und nicht überspielt. Die
        // zweite fällt mit der Zeitnahme in 2A-0020 weg.
        'Two things the program does not check here. Whether planning happened before the first move cannot be seen on the finished cube; it only shows that the cross stands. And the time that makes up the gain of this stage is measured by the timer only for the whole cube, not for the cross alone. Whoever wants to see the difference counts their own moves and compares them with the fifteen of the old way.',
    },
  },

  fall: {
    edgesAngle: {
      name: 'The angle',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another. Lesson 5 calls this picture the angle.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the right. That is the same hold lesson 5 describes from the other side: the two that already stand then point backwards and to the left.',
      erklaerung:
        'After the sequence all four top edges show the colour of the top face upwards, and the cross is there. It is not the sequence from lesson 5; that one first turns the angle into the line and needs a second run afterwards.\n\n' +
        'Where the edges end up is nothing this case promises, and where the top corners end up just as little. The three later looks order both. The alternative beside it grips the same two faces in a different order. The mirrored version for the left hand is not given here: it wants the angle in the other corner and would therefore be no choice of hand, but a second lining up.',
    },
    edgesLine: {
      name: 'The line',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another. Lesson 5 calls this picture the line.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and at the back. The line then lies across in front of you, from left to right. Lying lengthwise the same sequence leads back to the dot.',
      erklaerung:
        'It is the sequence from lesson 5, unchanged and in the same hold. After it all four top edges point upwards, and the cross is there. Of the sixteen cases of this version this is the only one whose sequence you already know.\n\n' +
        'Where the edges end up is nothing this case promises, and where the top corners end up just as little. The three later looks order both. The alternative beside it is the same movement for the left hand, and it wants the same hold.',
    },
    edgesDot: {
      name: 'The dot',
      bild:
        'None of the four top edges shows the colour of the top face upwards; the centre is all that shows. Lesson 5 calls this picture the dot.\n\n' +
        'There is nothing to line up here. The case looks the same from every hold, and the sequence works from every one.',
      erklaerung:
        'It is two sequences in one: first the one for the line, then a half turn of the top face, then the one for the angle. The first part turns the dot into an angle, the half turn puts it into the hold the second part wants, and that one closes the cross. No third sequence has to be learned for this case.\n\n' +
        'A shorter sequence of its own does not exist: the move space has been searched up to ten moves and stayed empty. The half turn in the middle is no ornament, as the second part is the reverse of the first; without it the two cancel out, and with a quarter turn instead of the half one just as much. The alternative beside it is the same movement for the left hand.',
    },
    cornersTwoUpFrontSplit: {
      name: 'Two corners at the front, colours to the sides',
      bild:
        'Two of the four top corners already show the colour of the top face upwards, and they lie next to one another. The other two show their top colour to the right and to the left, that is on two opposite side faces.\n\n' +
        'Turn the top layer until the two finished corners lie at the front. Neither the front nor the back face then shows the colour of the top face; if the finished corners lie at the back, it is the same picture in the wrong hold.',
      erklaerung:
        'After the sequence all four top corners show the colour of the top face upwards, and the layer is oriented. Where the corners end up is nothing this case promises; the two later looks order that.\n\n' +
        'The sequence leaves the four top edges alone. They stand afterwards exactly as before, and the work of the first look is thereby kept. The alternative beside it is the same movement for the left hand, with the same hold.',
    },
    cornersTwoUpFrontShared: {
      name: 'Two corners at the front, colours to the back',
      bild:
        'Two of the four top corners already show the colour of the top face upwards, and they lie next to one another. The other two show their top colour on one and the same side face: its top row carries the colour of the top face twice.\n\n' +
        'Turn the top layer until that one side face lies at the back. The two finished corners then lie at the front, and three of the four side faces show no colour of the top face in their top row.',
      erklaerung:
        'After the sequence all four top corners show the colour of the top face upwards, and the layer is oriented. Nine moves, and shorter is not possible: up to eight moves there is not a single sequence for this case, computed over the whole move space.\n\n' +
        'The sequence leaves the four top edges alone. It grips three faces and does so without the top one, which keeps it quiet despite its length; that holds for all three cases in which the edges stay put. The alternative beside it is the same movement for the left hand.',
    },
    cornersTwoUpDiagonal: {
      name: 'Two corners across the diagonal',
      bild:
        'Two of the four top corners already show the colour of the top face upwards, and they lie diagonally opposite one another. The other two show their top colour on two neighbouring side faces.\n\n' +
        'Turn the top layer until one of the two finished corners lies at the front right; the other then lies at the back left. Neither the right nor the front face shows the colour of the top face in its top row.',
      erklaerung:
        'After the sequence all four top corners show the colour of the top face upwards, and the layer is oriented. It leaves the four top edges alone.\n\n' +
        'The mirrored version for the left hand is not given here: it wants the finished corners on the other diagonal and would therefore be no choice of hand, but a second lining up. The alternative beside it grips the same hold with other faces.',
    },
    cornersOneUpFrontLeft: {
      name: 'One corner at the front left',
      bild:
        'Only one of the four top corners shows the colour of the top face upwards. Exactly one side face shows no top colour at all in its top row, the other three show one each.\n\n' +
        'Turn the top layer until that one side face lies at the front. The finished corner then lies at the front left. If it lies at the front right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'After the sequence all four top corners show the colour of the top face upwards, and the layer is oriented. Seven moves, and shorter is not possible.\n\n' +
        'In doing so the sequence swaps all four top corners and three of the top edges. In the beginner method that would be a step backwards, as there corners and edges on top are already placed by this time; here nothing is placed yet, and the two later looks place it. The mirrored version for the left hand is not given here, as it solves the case beside this one.',
    },
    cornersOneUpFrontRight: {
      name: 'One corner at the front right',
      bild:
        'Only one of the four top corners shows the colour of the top face upwards. Exactly one side face shows no top colour at all in its top row, the other three show one each.\n\n' +
        'Turn the top layer until that one side face lies at the front. The finished corner then lies at the front right. If it lies at the front left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'After the sequence all four top corners show the colour of the top face upwards, and the layer is oriented. Seven moves, and shorter is not possible. It makes do with the right and the top face.\n\n' +
        'In doing so the sequence swaps all four top corners and three of the top edges. In the beginner method that would be a step backwards, as there corners and edges on top are already placed by this time; here nothing is placed yet, and the two later looks place it. The mirrored version for the left hand is not given here, as it solves the case beside this one.',
    },
    cornersNoneUpBackPair: {
      name: 'No corner up, the pair at the back',
      bild:
        'None of the four top corners shows the colour of the top face upwards. Exactly one side face shows no top colour at all in its top row, one shows it twice, the other two once each.\n\n' +
        'Turn the top layer until the side face without a top colour lies at the front. The one with the two top colours then lies at the back.',
      erklaerung:
        'After the sequence all four top corners show the colour of the top face upwards, and the layer is oriented. Nine moves, and shorter is not possible.\n\n' +
        'The sequence grips only two faces and switches repeatedly between quarter and half turns. Where corners and edges on top end up is nothing this case promises; the two later looks order that. The alternative beside it is the same movement for the left hand, with the same hold.',
    },
    cornersNoneUpSidePairs: {
      name: 'No corner up, two pairs at the sides',
      bild:
        'None of the four top corners shows the colour of the top face upwards. Two opposite side faces show the top colour twice each in their top row, the other two not at all.\n\n' +
        'Turn the top layer until the two side faces without a top colour lie at the front and at the back. Which of the two lies at the front makes no difference: after a half turn the case looks exactly as it did before.',
      erklaerung:
        'After the sequence all four top corners show the colour of the top face upwards, and the layer is oriented. Eleven moves, and shorter is not possible: the move space has been searched up to ten moves and stayed empty. It is thereby the longest sequence of this look and at the same time the one made of just two faces.\n\n' +
        'None of the four top corners changes its place in doing so; they are only turned. Among the seven cases of this look it is thus the only one that turns the corners alone, without displacing a single one of them. The three top edges do travel along; the last look places them. The alternative beside it is the same movement for the left hand.',
    },
    cornersMatchedPair: {
      name: 'One matched corner pair',
      bild:
        'Exactly one of the four side faces shows the same colour at both corners of its top row. Competition slang calls this pair headlights; here it is the matched corner pair.\n\n' +
        'Turn the top layer until that face is at the front, and only then apply the sequence. The hold belongs to the case: with the pair elsewhere, the same sequence meets a different task.',
      erklaerung:
        'The sequence cycles three corners of the top layer and leaves the fourth, at the back left, in its place. It does not touch the four top edges; afterwards they stand exactly as before.\n\n' +
        'Because it only orders the corners relative to one another, the top layer as a whole may end up turned. If it is, one move of the top face sets it straight. The alternative beside it is the same movement for the left hand, with the same hold.',
    },
    cornersNoMatchedPair: {
      name: 'No matched corner pair',
      bild:
        'None of the four side faces shows the same colour at both corners of its top row.\n\n' +
        'There is nothing to line up here. The case looks the same from every hold, and the sequence works from every one.',
      erklaerung:
        'It is the sequence of the matched corner pair, applied twice, with a quarter turn of the top face in between. After the first run the matched pair is there, and the second run is therefore the familiar case. No second sequence has to be learned for this case.\n\n' +
        'Together the two runs swap the diagonally opposite corners at the front right and the back left. Unlike the first case, the four top edges travel along; the next look places them. The direction of the quarter turn is given in the sequence, and it is the other one in the version for the left hand.',
    },
    edgesCycleClockwise: {
      name: 'Three edges travel clockwise',
      bild:
        'Exactly one of the four side faces shows three equal colours in its top row, that is, an unbroken line. Its edge is already in place. Turn the top layer until that face is at the front.\n\n' +
        'Then look at the back edge: it shows the colour of the right-hand face. If it shows the colour of the left-hand face instead, the other of the two cycles is in front of you.',
      erklaerung:
        'The sequence leaves the front edge where it is and moves the other three on clockwise: the back one to the right, the right one to the left, the left one to the back. Across the front one, which is already in place. It does not touch the four top corners.\n\n' +
        'Because it only orders the edges relative to one another, the top layer as a whole may end up turned. If it is, one move of the top face sets it straight. Two alternatives stand beside it: the same movement for the left hand, and a shorter one of nine moves that grips four faces and asks for two opposing turns at once.',
    },
    edgesCycleCounterClockwise: {
      name: 'Three edges travel counter-clockwise',
      bild:
        'Exactly one of the four side faces shows three equal colours in its top row, that is, an unbroken line. Its edge is already in place. Turn the top layer until that face is at the front.\n\n' +
        'Then look at the back edge: it shows the colour of the left-hand face. If it shows the colour of the right-hand face instead, the other of the two cycles is in front of you.',
      erklaerung:
        'The sequence leaves the front edge where it is and moves the other three on counter-clockwise: the left one to the right, the back one to the left, the right one to the back. Across the front one, which is already in place. It does not touch the four top corners.\n\n' +
        'It is the reverse of the sequence for the other cycle, and both are the same length. Two alternatives stand beside it: the same movement for the left hand, and a shorter one of nine moves that grips four faces and asks for two opposing turns at once.',
    },
    edgesSwapNeighbours: {
      name: 'Two neighbouring edge pairs',
      bild:
        'No side face shows an unbroken line, so no edge is in place yet. Each of them shows the colour of one of its two neighbouring faces.\n\n' +
        'Two faces opposite each other carry an edge that belongs to the left. Turn the top layer until one of them is at the front: the front edge then belongs to the left.',
      erklaerung:
        'The sequence swaps two pairs of neighbouring edges, the front one with the left one and the right one with the back one. It does not touch the four top corners.\n\n' +
        'Twelve moves it is, and shorter is not possible: up to eleven moves there is no sequence at all for this case, computed across the whole move space. The alternative beside it is the same movement for the left hand.',
    },
    edgesSwapOpposite: {
      name: 'Two opposite edge pairs',
      bild:
        'No side face shows an unbroken line, so no edge is in place yet. Each of them shows the colour of the face opposite.\n\n' +
        'There is nothing to line up here. The case looks the same from every hold, and the sequence works from every one.',
      erklaerung:
        'The sequence swaps the front edge with the back one and the left one with the right one. It does not touch the four top corners.\n\n' +
        'There is also a sequence of nine moves for this case. It turns the bottom layer, and the top corners lose their place in doing so; that is why it is not the one here. The alternative beside it is the same movement for the left hand.',
    },
    matchedPairEdgesAlong: {
      name: 'A matched pair, the edges fit it',
      bild:
        'Exactly one of the four side faces shows the same colour at both corners of its top row, the matched corner pair. Turn the top layer until that face is at the front.\n\n' +
        'Then look at the four top edges: the edge in the colour of the matched pair lies at the front, the one in the opposite colour on the left.',
      erklaerung:
        'The edges already sit correctly relative to the corners; only the corners are left to place. Eleven moves, and it grips no more than the right, the back and the top face.\n\n' +
        'The sequence moves the corners and three of the top edges. The alternative beside it wants the same hold and grips the left face instead of the right one; it therefore lies closer to the left hand.',
    },
    matchedPairCycleCounterClockwiseRight: {
      name: 'A matched pair, edges cycle counter-clockwise around the right one',
      bild:
        'Exactly one of the four side faces shows the same colour at both corners of its top row, the matched corner pair. Turn the top layer until that face is at the front.\n\n' +
        'Then look at the four top edges: the edge in the colour of the matched pair lies on the left, the one in the opposite colour at the back.',
      erklaerung:
        'The right edge already sits correctly relative to the corners; the other three travel counter-clockwise around it. Thirteen moves.\n\n' +
        'The sequence moves the corners and three of the top edges. The alternative beside it wants the same hold and grips the left and the front face instead of the right and the back one.',
    },
    matchedPairCycleClockwiseRight: {
      name: 'A matched pair, edges cycle clockwise around the right one',
      bild:
        'Exactly one of the four side faces shows the same colour at both corners of its top row, the matched corner pair. Turn the top layer until that face is at the front.\n\n' +
        'Then look at the four top edges: the edge in the colour of the matched pair lies at the back, the one in the opposite colour at the front.',
      erklaerung:
        'The right edge already sits correctly relative to the corners; the other three travel clockwise around it. Fourteen moves, which makes it one of the longest of this look.\n\n' +
        'What else the sequence moves is nothing this case promises: at this point corners and edges on top are both still to be placed, and the sequence touches both. The alternative beside it wants the same hold and grips the back face instead of the front one.',
    },
    matchedPairSwapNeighboursRight: {
      name: 'A matched pair, front and right edge swapped',
      bild: 'As with the mirrored case beside it, exactly one side face carries a matched corner pair. Turn the top layer until that face is at the front.\n\nThe edge in the colour of the matched pair then lies on the right, the one in the opposite colour at the back.',
      erklaerung:
        'The front and the right edge belong swapped with one another, the back and the left one likewise. Thirteen moves.\n\n' +
        'It is the mirrored case of the counter-clockwise cycle around the right edge: whoever knows that sequence mirrors it and has this movement. The sequence moves the corners and three of the top edges.',
    },
    matchedPairCycleClockwiseLeft: {
      name: 'A matched pair, edges cycle clockwise around the left one',
      bild:
        'Exactly one of the four side faces shows the same colour at both corners of its top row, the matched corner pair. Turn the top layer until that face is at the front.\n\n' +
        'Then look at the four top edges: the edge in the colour of the matched pair lies on the right, the one in the opposite colour on the left.',
      erklaerung:
        'The left edge already sits correctly relative to the corners; the other three travel clockwise around it. Eleven moves, and it grips no more than the right, the back and the top face.\n\n' +
        'The sequence rearranges the corners, and the four top edges travel along. The alternative beside it wants the same hold and grips the left face instead of the right one.',
    },
    matchedPairCycleClockwiseBack: {
      name: 'A matched pair, edges cycle clockwise around the back one',
      bild:
        'Exactly one of the four side faces shows the same colour at both corners of its top row, the matched corner pair. Turn the top layer until that face is at the front.\n\n' +
        'Then look at the four top edges: the edge in the colour of the matched pair lies on the right, the one in the opposite colour at the front.',
      erklaerung:
        'The back edge already sits correctly relative to the corners; the other three travel clockwise around it. Fourteen moves.\n\n' +
        'The sequence moves the corners and three of the top edges. The alternative beside it wants the same hold and grips the back face instead of the front one.',
    },
    matchedPairCycleCounterClockwiseLeft: {
      name: 'A matched pair, edges cycle counter-clockwise around the left one',
      bild:
        'Exactly one of the four side faces shows the same colour at both corners of its top row, the matched corner pair. Turn the top layer until that face is at the front.\n\n' +
        'Then look at the four top edges: the edge in the colour of the matched pair lies at the back, the one in the opposite colour on the left.',
      erklaerung:
        'The left edge already sits correctly relative to the corners; the other three travel counter-clockwise around it. Fourteen moves.\n\n' +
        'What else the sequence moves is nothing this case promises: at this point corners and edges on top are both still to be placed, and the sequence touches both. The alternative beside it wants the same hold and grips the back face instead of the front one.',
    },
    matchedPairCycleCounterClockwiseFront: {
      name: 'A matched pair, edges cycle counter-clockwise around the front one',
      bild:
        'Exactly one of the four side faces shows the same colour at both corners of its top row, the matched corner pair. Turn the top layer until that face is at the front.\n\n' +
        'Then look at the four top edges: the edge in the colour of the matched pair lies at the front, the one in the opposite colour at the back.',
      erklaerung:
        'The front edge already sits correctly relative to the corners; the other three travel counter-clockwise around it. Fourteen moves.\n\n' +
        'The sequence rearranges the corners, and the four top edges travel along. The alternative beside it wants the same hold and grips the back face instead of the front one.',
    },
    matchedPairSwapNeighboursLeft: {
      name: 'A matched pair, front and left edge swapped',
      bild: 'As with the mirrored case beside it, exactly one side face carries a matched corner pair. Turn the top layer until that face is at the front.\n\nThe edge in the colour of the matched pair then lies on the left, the one in the opposite colour at the front.',
      erklaerung:
        'The front and the left edge belong swapped with one another, the back and the right one likewise. Fourteen moves.\n\n' +
        'It is the mirrored case of the clockwise cycle around the back edge: whoever knows that sequence mirrors it and has this movement. What else the sequence moves is nothing this case promises.',
    },
    matchedPairCycleCounterClockwiseBack: {
      name: 'A matched pair, edges cycle counter-clockwise around the back one',
      bild: 'As with the mirrored case beside it, exactly one side face carries a matched corner pair. Turn the top layer until that face is at the front.\n\nThe edge in the colour of the matched pair then lies on the left, the one in the opposite colour on the right.',
      erklaerung:
        'The back edge already sits correctly relative to the corners; the other three travel counter-clockwise around it. Eleven moves, which makes it one of the shortest of this look.\n\n' +
        'It is the mirrored case of the clockwise cycle around the left edge. The sequence rearranges the corners, and the four top edges travel along.',
    },
    matchedPairCycleClockwiseFront: {
      name: 'A matched pair, edges cycle clockwise around the front one',
      bild: 'As with the mirrored case beside it, exactly one side face carries a matched corner pair. Turn the top layer until that face is at the front.\n\nThe edge in the colour of the matched pair then lies at the front, the one in the opposite colour on the right.',
      erklaerung:
        'The front edge already sits correctly relative to the corners; the other three travel clockwise around it. Eleven moves.\n\n' +
        'It is the mirrored case of the one whose edges already fit the corners. The sequence moves the corners and three of the top edges.',
    },
    matchedPairSwapOpposite: {
      name: 'A matched pair, opposite edges swapped',
      bild: 'As with the mirrored case beside it, exactly one side face carries a matched corner pair. Turn the top layer until that face is at the front.\n\nThe edge in the colour of the matched pair then lies at the back, the one in the opposite colour on the right.',
      erklaerung:
        'The front and the back edge belong swapped with one another, the left and the right one likewise. Fourteen moves.\n\n' +
        'It is the mirrored case of the counter-clockwise cycle around the left edge. The sequence moves the corners and three of the top edges.',
    },
    noMatchedPairCycleCounterClockwise: {
      name: 'No matched pair, edges cycle counter-clockwise',
      bild:
        'None of the four side faces shows the same colour at both corners of its top row. Compare instead, on each side face, its top edge with the top left corner of the same face.\n\n' +
        'On exactly one face the two show the same colour; turn the top layer until it is at the front. The right edge then differs from its left corner by one quarter turn, the left one by two.',
      erklaerung:
        'The front edge already sits correctly relative to the corners; the other three travel counter-clockwise around it. Fourteen moves.\n\n' +
        'What else the sequence moves is nothing this case promises: at this point corners and edges on top are both still to be placed, and the sequence touches both. The alternative beside it wants the same hold and grips one face more.',
    },
    noMatchedPairCycleClockwise: {
      name: 'No matched pair, edges cycle clockwise',
      bild:
        'None of the four side faces shows the same colour at both corners of its top row. Compare instead, on each side face, its top edge with the top left corner of the same face.\n\n' +
        'On exactly one face the two show the same colour; turn the top layer until it is at the front. The right edge then differs from its left corner by two quarter turns, the left one by three.',
      erklaerung:
        'The front edge already sits correctly relative to the corners; the other three travel clockwise around it. Thirteen moves.\n\n' +
        'What else the sequence moves is nothing this case promises: at this point corners and edges on top are both still to be placed, and the sequence touches both. The alternative beside it wants the same hold and grips one face more.',
    },
    noMatchedPairEdgesAlong: {
      name: 'No matched pair, the edges fit the corners',
      bild:
        'None of the four side faces shows the same colour at both corners of its top row. Compare instead, on each side face, its top edge with the top left corner of the same face.\n\n' +
        'On all four faces the two show the same colour. There is nothing to line up here: the case looks the same from every hold, and the sequence works from every one.',
      erklaerung:
        'The edges already sit correctly relative to the corners; only the corners are left to place, and as no matched pair is present, not one of them is in its place. Thirteen moves.\n\n' +
        'In doing so the sequence swaps all four top corners, and the four top edges travel along. The alternative beside it wants the same hold and grips the back face instead of the front one.',
    },
    noMatchedPairSwapNeighbours: {
      name: 'No matched pair, neighbouring edges swapped',
      bild:
        'None of the four side faces shows the same colour at both corners of its top row. Compare instead, on each side face, its top edge with the top left corner of the same face.\n\n' +
        'On no face do the two show the same colour: two edges opposite each other differ by one quarter turn, the other two by three. Turn the top layer until one of the two with the smaller difference is at the front; which of them does not matter.',
      erklaerung:
        'Each two neighbouring edges belong swapped with one another. Fourteen moves.\n\n' +
        'In doing so the sequence displaces all four top corners, and the four top edges travel along. The alternative beside it wants the same hold and grips the back face instead of the front one.',
    },
    noMatchedPairSwapOpposite: {
      name: 'No matched pair, opposite edges swapped',
      bild:
        'No side face shows the same colour at both of its top corners, and no top edge shows the colour of the top left corner of its face; each differs by two quarter turns.\n\n' +
        'There is nothing to line up here. The case looks the same from every hold, and the sequence works from every one.',
      erklaerung:
        'The front and the back edge belong swapped with one another, the left and the right one likewise. Thirteen moves.\n\n' +
        'It is the mirrored case of the one whose edges already fit the corners. In doing so the sequence swaps all four top corners, and the four top edges travel along.',
    },
    crossTwoUpFrontSplit: {
      name: 'Cross, two corners at the front, colours to the sides',
      bild:
        'All four top edges show the colour of the top face upwards; the cross already stands. Two of the four top corners show it upwards as well, and they lie next to one another; the other two show their top colour to the right and to the left, that is on two opposite side faces.\n\n' +
        'Turn the top layer until the two finished corners lie at the front. Neither the front nor the back face then shows the colour of the top face; if the finished corners lie at the back, it is the same picture in the wrong hold.',
      erklaerung:
        'It is the same sequence as in the case «Two corners at the front, colours to the sides» of the guided path. Anyone who learned it there applies it here unchanged; once the cross stands, all that is left of the whole orientation is turning the corners.\n\n' +
        'The sequence leaves the four top edges alone, so the cross stands afterwards unchanged. After it all four top corners point upwards as well, and the layer is oriented in a single application. The alternative beside it is the same movement for the left hand.',
    },
    crossTwoUpFrontShared: {
      name: 'Cross, two corners at the front, colours to the back',
      bild:
        'All four top edges show the colour of the top face upwards; the cross already stands. Two of the four top corners show it upwards as well, and they lie next to one another; the other two show their top colour on one and the same side face, whose top row therefore carries the colour twice.\n\n' +
        'Turn the top layer until that one side face lies at the back. The two finished corners then lie at the front, and three of the four side faces show no colour of the top face in their top row.',
      erklaerung:
        'It is the same sequence as in the case «Two corners at the front, colours to the back» of the guided path. Anyone who learned it there applies it here unchanged; once the cross stands, all that is left of the whole orientation is turning the corners.\n\n' +
        'The sequence leaves the four top edges alone, so the cross stands afterwards unchanged. Nine moves, and shorter is not possible. The alternative beside it is the same movement for the left hand.',
    },
    crossTwoUpDiagonal: {
      name: 'Cross, two corners across the diagonal',
      bild:
        'All four top edges show the colour of the top face upwards; the cross already stands. Two of the four top corners show it upwards as well, and they lie diagonally opposite one another; the other two show their top colour on two neighbouring side faces.\n\n' +
        'Turn the top layer until one of the two finished corners lies at the front right; the other then lies at the back left. Neither the right nor the front face shows the colour of the top face in its top row.',
      erklaerung:
        'It is the same sequence as in the case «Two corners across the diagonal» of the guided path. Anyone who learned it there applies it here unchanged; once the cross stands, all that is left of the whole orientation is turning the corners.\n\n' +
        'The sequence leaves the four top edges alone, so the cross stands afterwards unchanged. The mirrored version for the left hand is not given here either: it wants the finished corners on the other diagonal. The alternative beside it grips the same hold with other faces.',
    },
    crossOneUpFrontLeft: {
      name: 'Cross, one corner at the front left',
      bild:
        'All four top edges show the colour of the top face upwards; the cross already stands. Only one of the four top corners shows it upwards as well, and exactly one side face shows no top colour at all in its top row, the other three show one each.\n\n' +
        'Turn the top layer until that one side face lies at the front. The finished corner then lies at the front left. If it lies at the front right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the same sequence as in the case «One corner at the front left» of the guided path. Anyone who learned it there applies it here unchanged; once the cross stands, all that is left of the whole orientation is turning the corners.\n\n' +
        'In doing so the sequence swaps all four top corners and three of the top edges. Not a single edge is flipped, so the cross stays standing, and where the pieces end up is ordered by the two later looks. The mirrored version for the left hand is not given here, as it solves the case beside this one.',
    },
    crossOneUpFrontRight: {
      name: 'Cross, one corner at the front right',
      bild:
        'All four top edges show the colour of the top face upwards; the cross already stands. Only one of the four top corners shows it upwards as well, and exactly one side face shows no top colour at all in its top row, the other three show one each.\n\n' +
        'Turn the top layer until that one side face lies at the front. The finished corner then lies at the front right. If it lies at the front left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case of the one with the finished corner at the front left, and it is the same sequence as in the case «One corner at the front right» of the guided path. Seven moves, and it makes do with the right and the top face.\n\n' +
        'In doing so the sequence swaps all four top corners and three of the top edges. Not a single edge is flipped, so the cross stays standing.',
    },
    crossNoneUpBackPair: {
      name: 'Cross, no corner up, the pair at the back',
      bild:
        'All four top edges show the colour of the top face upwards; the cross already stands. None of the four top corners shows it upwards. Exactly one side face shows no top colour at all in its top row, one shows it twice, the other two once each.\n\n' +
        'Turn the top layer until the side face without a top colour lies at the front. The one with the two top colours then lies at the back.',
      erklaerung:
        'It is the same sequence as in the case «No corner up, the pair at the back» of the guided path. Anyone who learned it there applies it here unchanged; once the cross stands, all that is left of the whole orientation is turning the corners.\n\n' +
        'Nine moves, and it grips only two faces. Where corners and edges on top end up is nothing this case promises; the two later looks order that. The alternative beside it is the same movement for the left hand.',
    },
    crossNoneUpSidePairs: {
      name: 'Cross, no corner up, two pairs at the sides',
      bild:
        'All four top edges show the colour of the top face upwards; the cross already stands. None of the four top corners shows it upwards. Two opposite side faces show the top colour twice each in their top row, the other two not at all.\n\n' +
        'Turn the top layer until the two side faces without a top colour lie at the front and at the back. Which of the two lies at the front makes no difference: after a half turn the case looks exactly as it did before.',
      erklaerung:
        'It is the same sequence as in the case «No corner up, two pairs at the sides» of the guided path. Eleven moves, which makes it the longest of these seven and at the same time the one made of just two faces.\n\n' +
        'None of the four top corners changes its place in doing so; they are only turned. The three top edges do travel along, yet not a single one is flipped, and the cross stays standing. The alternative beside it is the same movement for the left hand.',
    },
    lineAllUp: {
      name: 'Line, all four corners up',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. All four top corners, by contrast, already show the colour upwards. Two opposite side faces carry exactly one field in the colour of the top face in their top row, namely at their edge; the other two carry none there.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and at the back. The line then lies across in front of you, from left to right. Which of the two lies at the front does not matter: after a half turn the case looks the same, and the sequence works from either hold.',
      erklaerung:
        'Twelve moves over the front, the right and the top face. It is one of the three cases in which the edges alone are to be flipped, and the sequence from lesson 5 is out of the question for it: that one would twist the four corners which already stand here.\n\n' +
        'The four top corners stand before the sequence and stand again after it, travelling on the way; the four top edges travel along with them. Over all faces the sequence would come to ten moves, but then over four faces instead of three. The alternative beside it grips the same hold with the left hand.',
    },
    lineTwoUpFrontSplitCrosswise: {
      name: 'Line across, two corners at the front, colours to the sides',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour to the right and to the left, that is on two opposite side faces.\n\n' +
        'Turn the top layer until the two finished corners lie at the front. The line then lies across in front of you, from left to right, and each of the four side faces carries exactly one field in the colour of the top face in its top row. If the finished corners lie at the back, it is the same picture in the wrong hold.',
      erklaerung:
        'Eleven moves over the front, the right and the top face. The case beside it shows the same corner picture with the line lying lengthwise and wants a different sequence; the direction of the line is no trimming here, but the mark that tells them apart.\n\n' +
        'The sequence flips the two lying edges and twists the two lying corners in one go; the four top edges travel along with them. The alternative beside it grips the same hold with the left hand.',
    },
    lineTwoUpFrontShared: {
      name: 'Line across, two corners at the front, colours to the back',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour on one and the same side face, whose top row therefore carries the colour three times.\n\n' +
        'Turn the top layer until that one side face lies at the back. The two finished corners then lie at the front, and the line lies across in front of you, from left to right.',
      erklaerung:
        'Eight moves over the back, the right and the top face. It is one of the shortest sequences of the full version, and it works at the back rather than at the front: the side face with the two top colours on it is where the sequence takes hold.\n\n' +
        'The sequence displaces all four top corners and three of the top edges. The alternative beside it grips the same hold with the left hand.',
    },
    lineTwoUpDiagonalFrontRight: {
      name: 'Line across, two corners diagonal from the front right',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. Two of the four top corners already show the colour upwards, and they lie diagonally opposite one another; the other two show their top colour on two adjacent side faces.\n\n' +
        'Turn the top layer until one of the two finished corners lies at the front right; the other then lies at the back left. The line lies across in front of you, from left to right, and the top row on the right carries not a single field in the colour of the top face. If the finished corner lies at the front left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'Nine moves over the front, the right and the top face. The right hand grips, and that follows the case: the front one of the two finished corners lies on the right, and the mirrored case beside it is solved by the mirrored sequence.\n\n' +
        'About the edges and the corners this case promises nothing beyond its duty; where they end up is ordered by the two later looks. The alternative beside it grips the same hold with the left hand, held in place by two moves of the right.',
    },
    lineOneUpFrontLeftLengthwise: {
      name: 'Line lengthwise, one corner at the front left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. Only one of the four top corners shows the colour upwards as well, and exactly one side face shows no top colour at all in its top row.\n\n' +
        'Turn the top layer until that one side face lies at the front. The finished corner then lies at the front left, and the line lies lengthwise in front of you, from front to back. If the finished corner lies at the front right, it is the mirrored case and not this one.',
      erklaerung:
        'Ten moves over the front, the right and the top face, and it is at the same time the shortest sequence there is for this case at all.\n\n' +
        'About the edges and the corners this case promises nothing beyond its duty; where they end up is ordered by the two later looks. The alternative beside it grips the same hold with the left hand.',
    },
    lineTwoUpFrontSplitLengthwise: {
      name: 'Line lengthwise, two corners at the front, colours to the sides',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour to the right and to the left.\n\n' +
        'Turn the top layer until the two finished corners lie at the front. The line then lies lengthwise in front of you, from front to back. On the right and on the left the top row carries two fields each in the colour of the top face, at the front and at the back not a single one; that is how you know the right hold, for here no side face on its own tells you where to turn.',
      erklaerung:
        'Eight moves over the front, the right and the top face. It is the same corner case as the line lying across beside it, and still a different sequence: the line lies lengthwise here, and what it has to flip therefore lies on other faces.\n\n' +
        'The three top edges do travel along. The alternative beside it grips the same hold with the left hand.',
    },
    lineTwoUpRightShared: {
      name: 'Line across, two corners on the right, colours to the left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour on one and the same side face, whose top row therefore carries the colour twice.\n\n' +
        'Turn the top layer until that one side face lies on the left. The two finished corners then lie next to one another on the right, and the line lies across in front of you, from left to right.',
      erklaerung:
        'Six moves over the front, the right and the top face, and thereby the shortest sequence of the whole full version. It is also the only case of this group whose finished corners do not lie at the front; the guided path knows the same corner case with the corners at the front, and here the line does not allow it.\n\n' +
        'The sequence displaces all four top corners and three of the top edges. The alternative beside it is a second sequence of the same hold, over the back face instead of the front; it too grips the right hand, for a left-handed sequence would want the mirrored hold with the finished corners on the left.',
    },
    lineOneUpFrontRightCrosswise: {
      name: 'Line across, one corner at the front right',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. Only one of the four top corners shows the colour upwards as well, and exactly one side face shows the top colour twice in its top row, the other three once each.\n\n' +
        'Turn the top layer until the side face with the two top colours lies at the back. The finished corner then lies at the front right, and the line lies across in front of you, from left to right. If the finished corner lies at the front left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'Eleven moves over the front, the right and the top face. That is one move more than the shortest there is for this case, and in return the hand stays with three faces instead of four.\n\n' +
        'About the edges and the corners this case promises nothing beyond its duty; where they end up is ordered by the two later looks. The alternative beside it grips the same hold with the left hand and takes the back face along for it.',
    },
    lineOneUpFrontLeftCrosswise: {
      name: 'Line across, one corner at the front left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. Only one of the four top corners shows the colour upwards as well, and exactly one side face shows the top colour twice in its top row, the other three once each.\n\n' +
        'Turn the top layer until the side face with the two top colours lies at the back. The finished corner then lies at the front left, and the line lies across in front of you, from left to right. If the finished corner lies at the front right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case of the one with the finished corner at the front right, and the sequence is its mirror image: anyone who learned it there performs the same movement here with the left hand. Eleven moves over the front, the left and the top face.\n\n' +
        'The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    lineTwoUpDiagonalFrontLeft: {
      name: 'Line across, two corners diagonal from the front left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. Two of the four top corners already show the colour upwards, and they lie diagonally opposite one another; the other two show their top colour on two adjacent side faces.\n\n' +
        'Turn the top layer until one of the two finished corners lies at the front left; the other then lies at the back right. The line lies across in front of you, from left to right, and the top row on the left carries not a single field in the colour of the top face. If the finished corner lies at the front right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case of the one with the finished corner at the front right, and the sequence is its mirror image: whoever learned it there performs the same movement here with the left hand. Nine moves over the left, the front and the top face.\n\n' +
        'The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    lineNoneUpBackPairLengthwise: {
      name: 'Line lengthwise, no corner up, the pair at the back',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. None of the four top corners shows the colour upwards, and exactly one side face shows no top colour at all in its top row.\n\n' +
        'Turn the top layer until that one side face lies at the front. The line then lies lengthwise in front of you, from front to back, and at the back two top colours cling to the corners.',
      erklaerung:
        'Ten moves over the right, the back and the top face. It works at the back rather than at the front, for that is where the two corners lie whose top colour points at the same side face.\n\n' +
        'None of the four top corners changes its place in doing so; they are only turned. The three top edges do travel along. The alternative beside it is the same movement for the left hand.',
    },
    lineNoneUpSidePairsCrosswise: {
      name: 'Line across, no corner up, two pairs at the sides',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. None of the four top corners shows the colour upwards. Two opposite side faces show the top colour twice each in their top row, the other two once each.\n\n' +
        'Turn the top layer until the two side faces with one top colour each lie at the front and at the back. The line then lies across in front of you, from left to right. Which of the two lies at the front makes no difference: after a half turn the case looks exactly as it did before.',
      erklaerung:
        'Twelve moves over the front, the right and the top face, which makes it the longest sequence of this edge picture.\n\n' +
        'The three top edges do travel along, yet not a single one is flipped, and the line stays standing. Where the four top corners end up is ordered by the two later looks. The alternative beside it is the same movement for the left hand.',
    },
    lineNoneUpBackPairCrosswise: {
      name: 'Line across, no corner up, the pair at the back',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. None of the four top corners shows the colour upwards, and exactly one side face shows the top colour three times in its top row.\n\n' +
        'Turn the top layer until that one side face lies at the back. The line then lies across in front of you, from left to right.',
      erklaerung:
        'Ten moves over the front, the right and the top face, and it begins with the same grip as the shortest sequence of the whole full range.\n\n' +
        'The sequence swaps all four top corners. Where the top edges end up is nothing this case promises; the two later looks order that. The alternative beside it is the same movement for the left hand.',
    },
    lineOneUpFrontRightLengthwise: {
      name: 'Line lengthwise, one corner at the front right',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. Only one of the four top corners shows the colour upwards as well, and exactly one side face shows no top colour at all in its top row.\n\n' +
        'Turn the top layer until that one side face lies at the front. The finished corner then lies at the front right, and the line lies lengthwise in front of you, from front to back. If the finished corner lies at the front left, it is the mirrored case and not this one.',
      erklaerung:
        'It is the mirrored case of the one with the finished corner at the front left, and the sequence is its mirror image: anyone who learned it there performs the same movement here with the left hand. Ten moves over the front, the left and the top face.\n\n' +
        'The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    lineNoneUpSidePairsLengthwise: {
      name: 'Line lengthwise, no corner up, two pairs at the sides',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie opposite one another; lesson 5 calls this picture the line. None of the four top corners shows the colour upwards. Two opposite side faces show the top colour three times each in their top row, the other two not at all.\n\n' +
        'Turn the top layer until the two side faces without a top colour lie at the front and at the back. The line then lies lengthwise in front of you, from front to back. Which of the two lies at the front makes no difference: after a half turn the case looks exactly as it did before.',
      erklaerung:
        'Eleven moves over the front, the right and the top face.\n\n' +
        'The three top edges do travel along, yet not a single one is flipped, and the line stays standing. Where the four top corners end up is ordered by the two later looks. The alternative beside it is the same movement for the left hand.',
    },
    dotAllUp: {
      name: 'Dot, all four corners up',
      bild:
        'None of the four top edges shows the colour of the top face upwards; the centre is all that shows on top, and lesson 5 calls this picture the dot. All four top corners, by contrast, already show the colour upwards. Each of the four side faces carries the colour of the top face exactly once in its top row, namely at its edge.\n\n' +
        'There is nothing to line up here. The case looks the same from every hold, and the sequence works from every one.',
      erklaerung:
        'It is the only one of these eight cases in which the edges alone have to be flipped. The sequence for the dot from the guided path is still no help: it flips the edges and turns the corners in doing so, and here those already stand.\n\n' +
        'Thirteen moves, and it gets by with three faces; a twelve-move one exists, but it grips four faces and wants two opposing turns at once. It displaces all four top corners, and the four top edges travel along with them; where the pieces end up is put in order by the two views that follow. The alternative beside it is the same movement for the left hand.',
    },
    dotTwoUpFrontSplit: {
      name: 'Dot, two corners at the front, the colours to the side',
      bild:
        'None of the four top edges shows the colour of the top face upwards; the centre is all that shows on top, and lesson 5 calls this picture the dot. Two of the four top corners already show the colour upwards, and they lie next to each other; the other two show their top colour to the right and to the left, that is on two opposite side faces.\n\n' +
        'Turn the top layer until the two finished corners lie at the front. The top row then carries the colour of the top face twice on the right and on the left, and only once at the front and at the back, namely at the edge.',
      erklaerung:
        'Eleven moves over the right, the back and the top face. It flips the four edges and turns the two rear corners in a single pass; a second one need not be learned for this case.\n\n' +
        'The three top edges do travel along in doing so; where the pieces end up is put in order by the two views that follow. The alternative beside it grips the same hold with the left hand.',
    },
    dotTwoUpFrontShared: {
      name: 'Dot, two corners at the front, the colours to the back',
      bild:
        'None of the four top edges shows the colour of the top face upwards; the centre is all that shows on top, and lesson 5 calls this picture the dot. Two of the four top corners already show the colour upwards, and they lie next to each other; the other two show their top colour on one and the same side face.\n\n' +
        'Turn the top layer until that one side face lies at the back. Its top row then carries the colour of the top face three times, the other three once each.',
      erklaerung:
        'Twelve moves over the front, the right and the top face, one more than most of these eight take. Eleven moves do suffice for this case, but only out of a different hold, and that would mean a second alignment for the user and no gain at all.\n\n' +
        'What the sequence does to the corners and edges on top is not promised by this case; the two views that follow put it in order. The alternative beside it grips the same hold with the left hand.',
    },
    dotTwoUpDiagonal: {
      name: 'Dot, two corners diagonally',
      bild:
        'None of the four top edges shows the colour of the top face upwards; the centre is all that shows on top, and lesson 5 calls this picture the dot. Two of the four top corners already show the colour upwards, and they lie diagonally opposite each other; the other two show their top colour on two adjacent side faces.\n\n' +
        'Turn the top layer until one of the two finished corners lies at the front right; the other then lies at the back left. The top row carries the colour of the top face twice at the back and on the left, and only once at the front and on the right.',
      erklaerung:
        'Eleven moves over the right, the back and the top face. The mirrored version does not stand here as the alternative: it wants the finished corners on the other diagonal.\n\n' +
        'The three top edges do travel along in doing so; where the pieces end up is put in order by the two views that follow. The alternative beside it grips the same hold with the left and the front face.',
    },
    dotOneUpFrontLeft: {
      name: 'Dot, one corner at the front left',
      bild:
        'None of the four top edges shows the colour of the top face upwards; the centre is all that shows on top, and lesson 5 calls this picture the dot. Only one of the four top corners already shows the colour upwards, and exactly one side face carries nothing but the colour of its own edge in its top row; the other three carry a corner as well.\n\n' +
        'Turn the top layer until that one side face lies at the front. The finished corner then lies at the front left. If it lies at the front right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'Eleven moves over the left, the back and the top face. The left hand grips here, and that follows the case: the finished corner lies on the left, and the mirrored case beside it is solved by the mirrored sequence just the same.\n\n' +
        'The sequence displaces all four top corners, and the four top edges travel along with them. The alternative beside it grips the same hold with the right hand; the mirror image of this sequence it is not, as that one solves the case beside it.',
    },
    dotOneUpFrontRight: {
      name: 'Dot, one corner at the front right',
      bild:
        'None of the four top edges shows the colour of the top face upwards; the centre is all that shows on top, and lesson 5 calls this picture the dot. Only one of the four top corners already shows the colour upwards, and exactly one side face carries nothing but the colour of its own edge in its top row; the other three carry a corner as well.\n\n' +
        'Turn the top layer until that one side face lies at the front. The finished corner then lies at the front right. If it lies at the front left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case of the one with the finished corner at the front left, and the sequence is its mirror image: whoever learned it there performs the same movement here with the right hand. Eleven moves over the right, the back and the top face.\n\n' +
        'The sequence displaces all four top corners, and the four top edges travel along with them. The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    dotNoneUpBackPair: {
      name: 'Dot, no corner up, the pair at the back',
      bild:
        'None of the four top edges shows the colour of the top face upwards; the centre is all that shows on top, and lesson 5 calls this picture the dot. None of the four top corners shows the colour upwards either. Exactly one side face carries nothing but the colour of its own edge in its top row, one carries two corners as well, the other two one each.\n\n' +
        'Turn the top layer until the side face with the two corners lies at the back. At the front then lies the one that shows its edge alone.',
      erklaerung:
        'Eleven moves over the right, the back and the top face. It is the shortest one that solves this picture out of this hold.\n\n' +
        'In doing so the four top edges travel along; where corners and edges end up is put in order by the two views that follow. The alternative beside it is the same movement for the left hand.',
    },
    dotNoneUpSidePairs: {
      name: 'Dot, no corner up, two pairs at the sides',
      bild:
        'None of the four top edges shows the colour of the top face upwards; the centre is all that shows on top, and lesson 5 calls this picture the dot. None of the four top corners shows the colour upwards either. Two opposite side faces carry the colour of the top face three times in their top row, the other two only once, namely at their edge.\n\n' +
        'Turn the top layer until the two side faces with the single colour lie at the front and at the back. Which of the two lies at the front makes no difference: after a half turn the case looks exactly as it did before.',
      erklaerung:
        'Eleven moves over the right, the front and the top face. Because the case does not change under the half turn, its class holds half as many positions as those of the other seven.\n\n' +
        'In doing so the four top edges travel along; where the pieces end up is put in order by the two views that follow. The alternative beside it grips the same hold with the back face instead of the front one.',
    },
    angleAllUp: {
      name: 'Angle, all four corners up',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. All four top corners already show the colour upwards, and therefore no side face carries even a single field in the top colour at its corners.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the right. Exactly those two side faces then carry a single field in the colour of the top face in their top row, the left and the back none.',
      erklaerung:
        'Nine moves over the back, the right and the front face. It is the third and last case in which only the edges have to be flipped, and like the other two it needs a sequence of its own: the edge flipping sequence from lesson 5 would twist the corners here that already stand.\n\n' +
        'The three top edges do travel along. The alternative beside it grips with the left hand and takes two more moves for it.',
    },
    angleTwoUpBackSplitRight: {
      name: 'Angle at the front right, two corners at the back, colours to the sides',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour to the right and to the left, that is, away from each other. The corner where the two edges that do not stand yet meet is one of the two twisted ones.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the right. The two finished corners then lie at the back, the right carries two fields in the colour of the top face in its top row and the back not a single one. If the two edges lie at the front and on the left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'Nine moves over the back, the right and the top face, and it is at the same time the shortest sequence that exists for this case at all.\n\n' +
        'About the edges and the corners this case promises nothing beyond its duty; where they end up is put in order by the two views that follow. The alternative beside it grips the same hold with the left hand.',
    },
    angleTwoUpRightSharedLeft: {
      name: 'Angle at the front left, two corners on the right, colours to the left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour onto the same side face, whose top row therefore carries the colour three times. The corner where the two edges that do not stand yet meet is one of the two twisted ones.\n\n' +
        'Turn the top layer until that one side face lies on the left. The two finished corners then lie next to one another on the right, and the two edges that do not stand yet lie at the front and on the left.',
      erklaerung:
        'Six moves over the front, the left and the top face, and thus the shortest sequence of this edge picture. It is the mirror image of the sequence lesson 5 teaches for the angle, and it achieves more here than it does there: it sets the corners at the same time.\n\n' +
        'The sequence displaces all four top corners, and three of the top edges travel along with them. The alternative beside it grips the same hold with the right hand and takes two more moves for it.',
    },
    angleTwoUpDiagonalFrontLeftLeft: {
      name: 'Angle at the front left, two corners diagonally from the front left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie diagonally opposite one another; the other two show their top colour onto two neighbouring side faces. Each of the four side faces carries exactly one field in the colour of the top face on top, and the corner where the two edges that do not stand yet meet is one of the two finished ones.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the left. One of the two finished corners then lies at the front left, the other at the back right. If the two edges lie at the front and on the right, it is the same picture in the wrong hold.',
      erklaerung:
        'Nine moves over the back, the right and the top face, and it is at the same time the shortest sequence that exists for this case at all. It works on the side turned away from the angle, for that is where the second finished corner lies.\n\n' +
        'The sequence displaces all four top corners, and three of the top edges travel along with them. The alternative beside it grips the same hold with the left hand and takes one more move for it.',
    },
    angleOneUpBackLeftRight: {
      name: 'Angle at the front right, one corner at the back left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Only one of the four top corners shows the colour upwards as well. Of the four side faces one shows no field in the colour of the top face at all in its top row, the one beside it exactly one, and the two remaining ones two each. The finished corner lies between those first two.\n\n' +
        'Turn the top layer until the side face with the single field lies at the back. The empty side face then lies on the left, the finished corner at the back left, and the two edges that do not stand yet lie at the front and on the right. If the empty side face lies on the right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'Seven moves over the back, the front and the right face, and it is at the same time the shortest sequence that exists for this case at all.\n\n' +
        'The sequence displaces all four top corners. The alternative beside it grips the same hold with the left hand and takes one more move for it.',
    },
    angleTwoUpBackSplitLeft: {
      name: 'Angle at the front left, two corners at the back, colours to the sides',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour to the right and to the left, that is, away from each other. The corner where the two edges that do not stand yet meet is one of the two twisted ones.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the left. The two finished corners then lie at the back, the left carries two fields in the colour of the top face in its top row and the back not a single one. If the two edges lie at the front and on the right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case of the one with the angle at the front right, and the sequence is its mirror image: anyone who learned it there performs the same movement here with the left hand. Nine moves over the back, the left and the top face.\n\n' +
        'The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    angleTwoUpDiagonalFrontRightRight: {
      name: 'Angle at the front right, two corners diagonally from the front right',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie diagonally opposite one another; the other two show their top colour onto two opposite side faces. The corner where the two edges that do not stand yet meet is one of the two finished ones.\n\n' +
        'Here the picture does not say by itself which way to turn, and so it is stated outright: two neighbouring side faces carry two fields each in the colour of the top face in their top row, the other two not a single one. Turn the top layer until those two side faces lie on the right and at the front. The two edges that do not stand yet then lie at the front and on the right as well.',
      erklaerung:
        'Eight moves over the front, the right and the top face. It is the only one of the thirteen whose picture singles out no side face ahead of the others; all four are equally far from the goal, and the hold therefore stands in the recognition picture instead of in the cue.\n\n' +
        'The three top edges do travel along. The alternative beside it grips the same hold with the left hand and takes one more move for it.',
    },
    angleTwoUpLeftSharedRight: {
      name: 'Angle at the front right, two corners on the left, colours to the right',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour onto the same side face, whose top row therefore carries the colour three times. The corner where the two edges that do not stand yet meet is one of the two twisted ones.\n\n' +
        'Turn the top layer until that one side face lies on the right. The two finished corners then lie next to one another on the left, and the two edges that do not stand yet lie at the front and on the right.',
      erklaerung:
        'It is the mirrored case of the one with the angle at the front left, and the sequence is its mirror image. It is at the same time exactly the sequence lesson 5 teaches for the angle: anyone who knows it from there can apply it here unchanged and sets the corners at the same time. Six moves over the front, the right and the top face.\n\n' +
        'The sequence displaces all four top corners, and three of the top edges travel along with them. The alternative beside it is the mirror image of the alternative from there.',
    },
    angleOneUpBackRightLeft: {
      name: 'Angle at the front left, one corner at the back right',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Only one of the four top corners shows the colour upwards as well. Of the four side faces one shows no field in the colour of the top face at all in its top row, the one beside it exactly one, and the two remaining ones two each. The finished corner lies between those first two.\n\n' +
        'Turn the top layer until the side face with the single field lies at the back. The empty side face then lies on the right, the finished corner at the back right, and the two edges that do not stand yet lie at the front and on the left. If the empty side face lies on the left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case to the one with the angle at the front right, and the sequence is its mirror image: whoever learned it there carries out the same movement here with the left hand. Seven moves over the back, the front and the left face.\n\n' +
        'Here too the sequence displaces all four top corners. The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    angleTwoUpFrontSharedLeft: {
      name: 'Angle at the front left, two corners at the front, colours to the back',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour onto the same side face. The corner where the two edges that do not stand yet meet is one of the two finished ones.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the left. The two finished corners then lie at the front, and the back carries two fields in the colour of the top face in its top row, the right not a single one. If the two edges lie at the front and on the right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'Eleven moves over the front, the right and the top face, and it is at the same time the shortest sequence that exists for this case at all. It is the longest of the thirteen, and the reason lies in the case: the two twisted corners lie at the back, the edges to be flipped at the front and on the left.\n\n' +
        'About the edges and the corners this case promises nothing beyond its duty; where they end up is put in order by the two views that follow. The alternative beside it grips the same hold with the left hand, equally long.',
    },
    angleOneUpBackRightRight: {
      name: 'Angle at the front right, one corner at the back right',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Only one of the four top corners shows the colour upwards as well. Of the four side faces one shows no field in the colour of the top face at all in its top row, the one beside it exactly one, and the two remaining ones two each. The finished corner lies at the empty side face, at the end that points away from the one with the single field.\n\n' +
        'Turn the top layer until the empty side face lies at the back. The side face with the single field then lies on the left, the finished corner at the back right, and the two edges that do not stand yet lie at the front and on the right. If the finished corner lies at the back left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'Seven moves over the back, the front and the right face, and it is at the same time the shortest sequence that exists for this case at all.\n\n' +
        'The three top edges do travel along. The alternative beside it grips the same hold with the left hand and takes three more moves for it.',
    },
    angleTwoUpDiagonalFrontRightLeft: {
      name: 'Angle at the front left, two corners diagonally from the front right',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie diagonally opposite one another; the other two show their top colour onto two neighbouring side faces. The corner where the two edges that do not stand yet meet is one of the two twisted ones.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the left. One of the two finished corners then lies at the front right, the other at the back left, and the right carries not a single field in the colour of the top face in its top row. If the two edges lie at the front and on the right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'Ten moves over the front, the right and the top face, and it is at the same time the shortest sequence that exists for this case at all.\n\n' +
        'The sequence displaces all four top corners, and the four top edges travel along with them. The alternative beside it grips the same hold with the left hand, equally long.',
    },
    angleOneUpFrontLeftLeft: {
      name: 'Angle at the front left, one corner at the front left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Only one of the four top corners shows the colour upwards as well. No side face stays entirely without the colour of the top face in its top row: one carries it in the middle alone, a second one twice, the two remaining ones once each at a corner.\n\n' +
        'Turn the top layer until the side face with the single field in the middle lies at the front. The side face with the two fields then lies on the left, the finished corner at the front left, and the two edges that do not stand yet lie at the front and on the left. If the finished corner lies at the front right, it is the case beside this one and not this one.',
      erklaerung:
        'Ten moves over the front, the left and the top face, and it is at the same time the shortest sequence that exists for this case at all.\n\n' +
        'About the edges and the corners this case promises nothing beyond its duty; where they end up is ordered by the two later looks. The alternative beside it grips the same hold with the right hand and takes one more move for it.',
    },
    angleOneUpFrontLeftRight: {
      name: 'Angle at the front right, one corner at the front left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Only one of the four top corners shows the colour upwards as well. No side face stays entirely without the colour of the top face in its top row: one carries it in the middle alone, a second one twice, the two remaining ones once each at a corner.\n\n' +
        'Turn the top layer until the side face with the single field in the middle lies at the front. The side face with the two fields then lies on the right, the finished corner at the front left, and the two edges that do not stand yet lie at the front and on the right. If the finished corner lies at the front right, it is the case beside this one and not this one.',
      erklaerung:
        'Eleven moves over the front, the left and the top face, and it is at the same time the shortest sequence that exists for this case at all. Together with the mirrored case beside it, it is the longest of the eight, and the reason lies in the case: the finished corner lies at the angle, but not at its tip.\n\n' +
        'None of the four top corners changes its place while doing so. The alternative beside it grips the same hold with the right hand, takes one more move for it and works over the back face instead of the top one.',
    },
    angleNoneUpBackPairLeft: {
      name: 'Angle at the front left, no corner up, the pair at the back',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. None of the four top corners shows the colour upwards. Of the four side faces two show two fields each in the colour of the top face in their top row and two show one each; the two with the two fields border on one another.\n\n' +
        'Turn the top layer until the two side faces with two fields each lie at the back and on the left. The two edges that do not stand yet then lie at the front and on the left. If they lie at the front and on the right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'Ten moves over the left, the front and the top face, and it is at the same time the shortest sequence that exists for this case at all.\n\n' +
        'The three top edges do travel along. The alternative beside it grips the same hold with the right hand and takes two more moves for it; up to eleven moves there is not a single sequence for the right hand here.',
    },
    angleTwoUpFrontSplitRight: {
      name: 'Angle at the front right, two corners at the front, colours to the sides',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour to the right and to the left, that is, away from each other. The corner where the two edges that do not stand yet meet is one of the two finished ones.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the right. The two finished corners then lie at the front, the right carries two fields in the colour of the top face in its top row and the back not a single one. If the two edges lie at the front and on the left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'Ten moves over the front, the left and the top face. The left hand grips here, and that follows the case: the sequence works on the side opposite the angle, and the angle lies on the right.\n\n' +
        'The sequence displaces all four top corners, and the four top edges travel along with them. The alternative beside it grips the same hold with the right hand and takes one more move for it.',
    },
    angleNoneUpSidePairsRight: {
      name: 'Angle at the front right, no corner up, two pairs at the sides',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. None of the four top corners shows the colour upwards. Of the four side faces one shows three fields in the colour of the top face in its top row, one shows two, one shows one and one shows none at all; the one with the three fields and the empty one border on each other.\n\n' +
        'Turn the top layer until the side face with the three fields lies on the right. The empty one then lies at the back, the one with the two fields on the left, and the two edges that do not stand yet lie at the front and on the right.',
      erklaerung:
        'Eleven moves over the back, the right and the top face, and it is at the same time the shortest sequence that exists for this case at all.\n\n' +
        'The three top edges do travel along. The alternative beside it grips the same hold with the left hand and takes one more move for it.',
    },
    angleNoneUpFrontPairRight: {
      name: 'Angle at the front right, no corner up, the pair at the front',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. None of the four top corners shows the colour upwards. Of the four side faces one shows three fields in the colour of the top face in its top row, one shows two, one shows one and one shows none at all; the one with the three fields and the empty one lie opposite each other.\n\n' +
        'Turn the top layer until the side face with the three fields lies at the front. The empty one then lies at the back, the one with the two fields on the right, and the two edges that do not stand yet lie at the front and on the right.',
      erklaerung:
        'Nine moves over the front, the right and the top face, and it is at the same time the shortest sequence that exists for this case at all. Together with its mirror image it is the shortest of the six sequences of this group.\n\n' +
        'The sequence displaces all four top corners and three of the top edges. The alternative beside it grips the same hold with the left hand and is exactly as long.',
    },
    angleTwoUpFrontSplitLeft: {
      name: 'Angle at the front left, two corners at the front, colours to the sides',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour to the right and to the left, that is, away from each other. The corner where the two edges that do not stand yet meet is one of the two finished ones.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the left. The two finished corners then lie at the front, the left carries two fields in the colour of the top face in its top row and the back not a single one. If the two edges lie at the front and on the right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case of the one with the angle at the front right, and the sequence is its mirror image: anyone who learned it there performs the same movement here with the right hand. Ten moves over the front, the right and the top face.\n\n' +
        'The sequence displaces all four top corners, and the four top edges travel along with them, just as the mirrored one does. The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    angleTwoUpDiagonalFrontLeftRight: {
      name: 'Angle at the front right, two corners diagonally from the front left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie diagonally opposite one another; the other two show their top colour onto two neighbouring side faces. The corner where the two edges that do not stand yet meet is one of the two twisted ones.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the right. One of the two finished corners then lies at the front left, the other at the back right, and the left carries not a single field in the colour of the top face in its top row. If the two edges lie at the front and on the left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case of the one with the angle at the front left, and the sequence is its mirror image: anyone who learned it there performs the same movement here with the left hand. Ten moves over the front, the left and the top face.\n\n' +
        'The sequence displaces all four top corners, and the four top edges travel along with them, just as the mirrored one does. The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    angleOneUpFrontRightLeft: {
      name: 'Angle at the front left, one corner at the front right',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Only one of the four top corners shows the colour upwards as well. No side face stays entirely without the colour of the top face in its top row: one carries it in the middle alone, a second one twice, the two remaining ones once each at a corner.\n\n' +
        'Turn the top layer until the side face with the single field in the middle lies at the front. The side face with the two fields then lies on the left, the finished corner at the front right, and the two edges that do not stand yet lie at the front and on the left. If the finished corner lies at the front left, it is the case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case to the one with the angle at the front right, and the sequence is its mirror image: whoever learned it there carries out the same movement here with the right hand. Eleven moves over the front, the right and the top face.\n\n' +
        'None of the four top corners changes its place here either. The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    angleTwoUpFrontSharedRight: {
      name: 'Angle at the front right, two corners at the front, colours to the back',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Two of the four top corners already show the colour upwards, and they lie next to one another; the other two show their top colour onto the same side face. The corner where the two edges that do not stand yet meet is one of the two finished ones.\n\n' +
        'Turn the top layer until the two edges that do not stand yet lie at the front and on the right. The two finished corners then lie at the front, and the back carries two fields in the colour of the top face in its top row, the left not a single one. If the two edges lie at the front and on the left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case of the one with the angle at the front left, and the sequence is its mirror image: anyone who learned it there performs the same movement here with the left hand. Eleven moves over the front, the left and the top face.\n\n' +
        'The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    angleNoneUpBackPairRight: {
      name: 'Angle at the front right, no corner up, the pair at the back',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. None of the four top corners shows the colour upwards. Of the four side faces two show two fields each in the colour of the top face in their top row and two show one each; the two with the two fields border on one another.\n\n' +
        'Turn the top layer until the two side faces with two fields each lie at the back and on the right. The two edges that do not stand yet then lie at the front and on the right. If they lie at the front and on the left, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case to the one with the angle at the front left, and the sequence is its mirror image: whoever learned it there carries out the same movement here with the right hand. Ten moves over the right, the front and the top face.\n\n' +
        'Here too the three top edges do travel along. The alternative beside it is likewise the mirror image of the alternative from there and takes two more moves.',
    },
    angleNoneUpSidePairsLeft: {
      name: 'Angle at the front left, no corner up, two pairs at the sides',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. None of the four top corners shows the colour upwards. Of the four side faces one shows three fields in the colour of the top face in its top row, one shows two, one shows one and one shows none at all; the one with the three fields and the empty one border on each other.\n\n' +
        'Turn the top layer until the side face with the three fields lies on the left. The empty one then lies at the back, the one with the two fields on the right, and the two edges that do not stand yet lie at the front and on the left.',
      erklaerung:
        'It is the mirrored case to the one with the angle at the front right, and the sequence is its mirror image: whoever learned it there carries out the same movement here with the left hand. Eleven moves over the back, the left and the top face.\n\n' +
        'Here too the three top edges do travel along. The alternative beside it is likewise the mirror image of the alternative from there and takes one more move.',
    },
    angleOneUpFrontRightRight: {
      name: 'Angle at the front right, one corner at the front right',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Only one of the four top corners shows the colour upwards as well. No side face stays entirely without the colour of the top face in its top row: one carries it in the middle alone, a second one twice, the two remaining ones once each at a corner.\n\n' +
        'Turn the top layer until the side face with the single field in the middle lies at the front. The side face with the two fields then lies on the right, the finished corner at the front right, and the two edges that do not stand yet lie at the front and on the right. If the finished corner lies at the front left, it is the case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case to the one with the angle at the front left, and the sequence is its mirror image: whoever learned it there carries out the same movement here with the right hand. Ten moves over the front, the right and the top face.\n\n' +
        'The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    angleNoneUpFrontPairLeft: {
      name: 'Angle at the front left, no corner up, the pair at the front',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. None of the four top corners shows the colour upwards. Of the four side faces one shows three fields in the colour of the top face in its top row, one shows two, one shows one and one shows none at all; the one with the three fields and the empty one lie opposite each other.\n\n' +
        'Turn the top layer until the side face with the three fields lies at the front. The empty one then lies at the back, the one with the two fields on the left, and the two edges that do not stand yet lie at the front and on the left.',
      erklaerung:
        'It is the mirrored case to the one with the angle at the front right, and the sequence is its mirror image: whoever learned it there carries out the same movement here with the left hand. Nine moves over the front, the left and the top face.\n\n' +
        'Here too the sequence displaces all four top corners and three of the top edges. The alternative beside it is likewise the mirror image of the alternative from there and is exactly as long.',
    },
    angleOneUpBackLeftLeft: {
      name: 'Angle at the front left, one corner at the back left',
      bild:
        'Exactly two of the four top edges show the colour of the top face upwards, and they lie next to one another; lesson 5 calls this picture the angle. Only one of the four top corners shows the colour upwards as well. Of the four side faces one shows no field in the colour of the top face at all in its top row, the one beside it exactly one, and the two remaining ones two each. The finished corner lies at the empty side face, at the end that points away from the one with the single field.\n\n' +
        'Turn the top layer until the empty side face lies at the back. The side face with the single field then lies on the right, the finished corner at the back left, and the two edges that do not stand yet lie at the front and on the left. If the finished corner lies at the back right, it is the mirrored case beside this one and not this one.',
      erklaerung:
        'It is the mirrored case to the one with the angle at the front right, and the sequence is its mirror image: whoever learned it there carries out the same movement here with the left hand. Seven moves over the back, the front and the left face.\n\n' +
        'The three top edges do travel along here as well. The alternative beside it is likewise the mirror image of the alternative from there.',
    },
    cornerRightEdgeRightUp: {
      name: 'Corner to the right, edge on the right, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the right side face, neither upwards nor to the front. The edge then lies immediately beside it, at the top right, and the colour that belongs to the front in the slot points upwards on it.\n\n' +
        'You work from a different position than the one in which you recognise the case: turn the top layer on until the corner lies at the top back right, that is a quarter turn behind its slot.',
      erklaerung:
        'The pair lies together and still stands wrong to one another: the corner looks to the side while the edge turns its front colour upwards. In this position it does not go in with a single grip.\n\n' +
        'The sequence therefore reaches twice to the right face. The first grip prepares the pair, the second inserts it; seven moves over the right face and the top layer, and the hand stays in the same place throughout.\n\n' +
        'Without the case you would go the same way by hand: first insert the corner alone, then push the edge in with the sequence that the lesson on the second layer teaches. The case does not save you the moves, it saves you the thinking.',
    },
    cornerRightEdgeRightSide: {
      name: 'Corner to the right, edge on the right, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the right side face. The edge lies immediately beside it, at the top right, and the colour that belongs to the front in the slot does not point upwards on it but onto the side face.\n\n' +
        'You work from exactly this position: the corner stands above its slot, and the top layer is not turned on.',
      erklaerung:
        'Corner and edge lie next to one another, and both show their colours on the same side face. That looks like a finished pair and is none: the two colours belong on different sides of the slot.\n\n' +
        'The sequence therefore takes the two apart first. The grip to the right face sends the corner down and back up, the grip to the front face then inserts the ordered pair; seven moves, and both hands are involved.\n\n' +
        'Without the case you insert the corner alone first and push the edge in afterwards. The case makes a single pass out of that.',
    },
    cornerRightEdgeFrontUp: {
      name: 'Corner to the right, edge at the front, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the right side face. The edge lies at the top front, that is on the other side of the slot, and the colour that belongs to the front in the slot points upwards on it.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top front left, that is a quarter turn in front of its slot.',
      erklaerung:
        'Corner and edge lie on either side of the slot, and neither piece stands so that it would go in without preparation. The sequence therefore deals with the edge first and inserts the pair afterwards.\n\n' +
        'The grip to the front face prepares the edge, the grip to the right face inserts it; seven moves, both hands involved, and only one half turn among them. The alternative beside it is nine moves long and carries three half turns; it is a second way and not a second hand.\n\n' +
        'Without the case you first get the corner down and fetch the edge afterwards. What the case takes off your hands is the question in which order.',
    },
    cornerRightEdgeFrontSide: {
      name: 'Corner to the right, edge at the front, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the right side face. The edge lies at the top front, and the colour that belongs to the front in the slot does not point upwards on it but onto the side face.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back right. The pair then stands ready together, and the edge follows the corner.',
      erklaerung:
        'This is the shortest case of the whole stage: three moves. Corner and edge already stand right to one another, they only have to go in together. The front face opens, the top layer brings the pair along, the front face closes.\n\n' +
        'It is one of the two grips from which all the other cases of this group are put together; whoever knows it well recognises it again inside the longer sequences. The alternative beside it needs six moves and starts at the right face; it stands there because the same movement for the other hand is not to be had here.\n\n' +
        'Without the case this way too would be two grips long, for the corner would come down alone first.',
    },
    cornerRightEdgeLeftUp: {
      name: 'Corner to the right, edge on the left, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the right side face. The edge lies diagonally opposite the corner, at the top left, and the colour that belongs to the front in the slot points upwards on it.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back right.',
      erklaerung:
        'It is the same way as in the case «Corner to the right, edge on the right, colour up»: twice the same grip to the right face, with a turn of the top layer in between. Whoever knows that one carries out the same movement here with different turns between the grips.\n\n' +
        'The difference lies solely in where the edge waits. Seven moves, and the hand stays at the right face.',
    },
    cornerRightEdgeLeftSide: {
      name: 'Corner to the right, edge on the left, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the right side face. The edge lies diagonally opposite the corner, at the top left, and the colour that belongs to the front in the slot points onto the side face on it.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top front left, that is a quarter turn in front of its slot.',
      erklaerung:
        'The two pieces stand far apart, and the edge shows its colour to the wrong side. The sequence therefore reaches twice to the front face: the first grip brings the edge into the right tilt, the second inserts the pair.\n\n' +
        'Seven moves over the front face and the top layer, entirely without the right face. That is the left hand of this view; a version for the right hand does not exist for this case, and the alternative beside it is therefore a second way and not a second hand.\n\n' +
        'Without the case you would need two attempts here as well, and the second would only be recognisable after the first.',
    },
    cornerRightEdgeBackUp: {
      name: 'Corner to the right, edge at the back, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the right side face. The edge lies diagonally opposite the corner, at the top back, and the colour that belongs to the front in the slot points upwards on it.\n\n' +
        'You work from exactly this position: the corner stands above its slot, and the top layer is not turned on.',
      erklaerung:
        'Three moves, and it is the grip everyone learns first: the right face opens, the top layer brings the edge along, the right face closes. Corner and edge travel down together in doing so.\n\n' +
        'It is the second of the two grips from which all the other cases of this group are put together. The alternative beside it needs seven moves and reaches the same face; it is a second way and not the same movement for the other hand, for at this stage the case decides which hand inserts it and not you.\n\n' +
        'Without it you insert the corner alone first and push the edge in afterwards with the sequence from the lesson on the second layer; two grips instead of one.',
    },
    cornerRightEdgeBackSide: {
      name: 'Corner to the right, edge at the back, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the right side face. The edge lies diagonally opposite the corner, at the top back, and the colour that belongs to the front in the slot points onto the side face on it.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top front left.',
      erklaerung:
        'It is the same way as in the case «Corner to the right, edge on the left, colour to the side»: twice the same grip to the front face, with a turn of the top layer in between. Whoever knows that one carries out the same movement here with different turns between the grips.\n\n' +
        'The difference lies solely in where the edge waits. Seven moves over the front face and the top layer.',
    },
    cornerFrontEdgeRightUp: {
      name: 'Corner to the front, edge on the right, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the front side face, neither upwards nor to the right. The edge lies at the top right, and the colour that belongs to the front in the slot points upwards on it.\n\n' +
        'You work from a different position than the one in which you recognise the case: turn the top layer on until the corner lies at the top front left, that is a quarter turn before its slot.',
      erklaerung:
        'Three moves, and this case needs no more: the right face opens, the top layer brings the pair along, the right face closes. Corner and edge travel down together in doing so.\n\n' +
        'It is one of the two grips from which all the other cases of this group are put together; whoever knows it well recognises it again inside the longer sequences. The alternative beside it needs six moves and starts at the front face; it is a second way and not the same movement for the other hand, for at this stage the case decides which hand inserts it and not you.\n\n' +
        'Without the case you insert the corner alone first and push the edge in afterwards with the sequence from the lesson on the second layer; two grips instead of one.',
    },
    cornerFrontEdgeRightSide: {
      name: 'Corner to the front, edge on the right, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the front side face. The edge lies immediately beside it, at the top right, and the colour that belongs to the front in the slot does not point upwards on it but onto the side face.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back right, that is a quarter turn behind its slot.',
      erklaerung:
        'Corner and edge lie side by side and still stand wrong to one another: the corner turns its bottom colour to the front, the edge turns its front colour to the side. In this position the pair does not go in with a single grip.\n\n' +
        'The sequence therefore takes both faces. The grip to the right face prepares the pair, the grip to the front face inserts it; seven moves with only one half turn among them, and both hands are involved.\n\n' +
        'Without the case you insert the corner alone first and fetch the edge afterwards. The case does not save you the moves, it saves you the thinking about the order.',
    },
    cornerFrontEdgeFrontUp: {
      name: 'Corner to the front, edge at the front, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the front side face. The edge lies at the top front, that is on the other side of the slot, and the colour that belongs to the front in the slot points upwards on it.\n\n' +
        'You work from exactly this position: the corner stands above its slot, and the top layer is not turned on.',
      erklaerung:
        'Corner and edge lie on either side of the slot, and neither of the two pieces stands so that it would go in without preparation.\n\n' +
        'The sequence therefore starts at the front face and prepares the edge, and only the second grip to the right face inserts the pair; seven moves with one half turn among them. The alternative beside it is nine moves long and manages without any half turn at all.\n\n' +
        'Without the case you first get the corner down and fetch the edge afterwards. What the case takes off you is the question which of the two pieces comes first.',
    },
    cornerFrontEdgeFrontSide: {
      name: 'Corner to the front, edge at the front, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the front side face. The edge lies at the top front, and the colour that belongs to the front in the slot points onto the same side face as the bottom colour of the corner.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top front left, that is a quarter turn before its slot.',
      erklaerung:
        'Both pieces turn their colour to the same side face. That looks like a finished pair and is none: the two colours belong to different sides of the slot.\n\n' +
        'The sequence therefore reaches twice to the front face. The first grip takes the two apart, the second inserts them prepared; seven moves entirely without the right face and without a single half turn. This is the left hand of this view, and a version for the right one is not to be had in this case.\n\n' +
        'Without the case you would need two attempts, and the second would only be recognisable after the first.',
    },
    cornerFrontEdgeLeftUp: {
      name: 'Corner to the front, edge on the left, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the front side face. The edge lies diagonally opposite the corner, at the top left, and the colour that belongs to the front in the slot points upwards on it.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back right.',
      erklaerung:
        'The two pieces stand far apart, and the corner stands the wrong way round on top of that. The sequence therefore reaches twice with the same grip to the right face: the first turns the corner right, the second inserts the pair.\n\n' +
        'Seven moves over the right face and the top layer, and the hand stays in the same place throughout. Two of the turns are half turns, and that is the price for a sequence that manages without the front face.\n\n' +
        'Without the case you insert the corner alone first and push the edge in afterwards; the case makes a single pass out of that.',
    },
    cornerFrontEdgeLeftSide: {
      name: 'Corner to the front, edge on the left, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the front side face. The edge lies diagonally opposite the corner, at the top left, and the colour that belongs to the front in the slot points onto the side face on it.\n\n' +
        'You work from exactly this position: the corner stands above its slot, and the top layer is not turned on.',
      erklaerung:
        'Three moves, and it is the grip of the left hand: the front face opens, the top layer brings the edge along, the front face closes. Corner and edge travel down together in doing so.\n\n' +
        'It is the second of the two grips from which all the other cases of this group are put together. The alternative beside it needs seven moves and reaches the same face; it is a second way and not a second hand.\n\n' +
        'Without it this way too would be two grips long, for the corner would come down alone first.',
    },
    cornerFrontEdgeBackUp: {
      name: 'Corner to the front, edge at the back, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the front side face. The edge lies diagonally opposite the corner, at the top back, and the colour that belongs to the front in the slot points upwards on it.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back right.',
      erklaerung:
        'It is the same way as in the case «Corner to the front, edge on the left, colour up»: twice the same grip to the right face, with a turn of the top layer in between. Whoever knows that one carries out the same movement here with different turns between the grips.\n\n' +
        'The difference lies solely in where the edge waits. Seven moves, and there is only one half turn among them instead of two.',
    },
    cornerFrontEdgeBackSide: {
      name: 'Corner to the front, edge at the back, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face shows on the front side face. The edge lies diagonally opposite the corner, at the top back, and the colour that belongs to the front in the slot points onto the side face on it.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back right.',
      erklaerung:
        'It is the same way as in the case «Corner to the front, edge on the right, colour to the side»: first the grip to the right face that prepares the pair, then the grip to the front face that inserts it.\n\n' +
        'The difference lies solely in where the edge waits. Seven moves, and this version manages without any half turn at all.',
    },
    cornerUpEdgeRightUp: {
      name: 'Corner up, edge on the right, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face points upwards and onto neither of the two side faces. The edge lies immediately beside it, at the top right, and the colour that belongs to the front in the slot points upwards on it as well.\n\n' +
        'You work from exactly this position: the corner stands above its slot, and the top layer is not turned on.',
      erklaerung:
        'The corner looks upwards with its bottom colour, and that is the most awkward position it can be in: it has to turn before it fits, and the edge waits beside it.\n\n' +
        'The sequence therefore reaches twice with the same grip to the right face. The first turns the corner, the second inserts the pair; seven moves, the hand stays in the same place, and only one of the turns is a half turn.\n\n' +
        'Without the case you insert the corner alone first and push the edge in afterwards with the sequence from the lesson on the second layer; two grips instead of one.',
    },
    cornerUpEdgeRightSide: {
      name: 'Corner up, edge on the right, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face points upwards. The edge lies at the top right, and the colour that belongs to the front in the slot does not point upwards on it but onto the side face.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back left, that is opposite its slot.',
      erklaerung:
        'It is one of the two hardest cases of this stage, and the reason stands in the sequence itself: it cannot be taken apart into the four grips you know. It begins and ends with a half turn of the front face and moves the pair into place in between.\n\n' +
        'Seven moves, all over the front face and the top layer, three of them half turns. There is a way out of familiar grips here too, but it needs nine moves and a different position; the shorter sequence is worth the unfamiliar grip.\n\n' +
        'Without the case you first get the corner down and fetch the edge afterwards. The case saves you more here than elsewhere, for the corner stands particularly badly.',
    },
    cornerUpEdgeFrontUp: {
      name: 'Corner up, edge at the front, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face points upwards. The edge lies at the top front, that is on the other side of the slot, and the colour that belongs to the front in the slot points upwards on it as well.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back left, that is opposite its slot.',
      erklaerung:
        'It is the counterpart to the case «Corner up, edge on the right, colour to the side», only at the right face instead of the front one, and it is the second case whose sequence cannot be taken apart into the familiar grips.\n\n' +
        'Seven moves over the right face and the top layer, three of them half turns. Here too there would be a way out of familiar grips with nine moves and a different position; the shorter sequence stands first.\n\n' +
        'Without the case you insert the corner alone first and push the edge in afterwards. What the case takes off you is the second attempt.',
    },
    cornerUpEdgeFrontSide: {
      name: 'Corner up, edge at the front, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face points upwards. The edge lies at the top front, and the colour that belongs to the front in the slot does not point upwards on it but onto the side face.\n\n' +
        'You work from exactly this position: the corner stands above its slot, and the top layer is not turned on.',
      erklaerung:
        'The corner looks upwards, the edge turns its front colour to the side: both stand wrong, and neither of them goes in without preparation.\n\n' +
        'The sequence therefore reaches twice with the same grip to the front face. The first prepares, the second inserts; seven moves entirely without the right face, and only one of the turns is a half turn. This is the left hand of this view.\n\n' +
        'Without the case you would need two attempts, and the second would only be recognisable after the first.',
    },
    cornerUpEdgeLeftUp: {
      name: 'Corner up, edge on the left, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face points upwards. The edge lies diagonally opposite the corner, at the top left, and the colour that belongs to the front in the slot points upwards on it as well.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back left.',
      erklaerung:
        'It is the shortest case of this group, and it reads as two familiar grips one after the other: the grip to the front face brings the edge to its place, the grip to the right face inserts the pair.\n\n' +
        'Six moves, both hands involved, and not a single half turn among them. The alternative beside it is equally long and reaches to the right first; it is a second way and not a second hand.\n\n' +
        'Without the case you would go the same way in two attempts: first the corner, then the edge. The case draws both together.',
    },
    cornerUpEdgeLeftSide: {
      name: 'Corner up, edge on the left, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face points upwards. The edge lies diagonally opposite the corner, at the top left, and the colour that belongs to the front in the slot points onto the side face on it.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back right.',
      erklaerung:
        'It is the same way as in the case «Corner up, edge at the front, colour to the side»: twice the same grip to the front face, with a turn of the top layer in between. The difference lies solely in where the edge waits.\n\n' +
        'Seven moves. The alternative beside it is one move shorter, but it asks for a grip that this stage does not teach; whoever prefers the six moves finds them there.',
    },
    cornerUpEdgeBackUp: {
      name: 'Corner up, edge at the back, colour up',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face points upwards. The edge lies diagonally opposite the corner, at the top back, and the colour that belongs to the front in the slot points upwards on it as well.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top front left, that is a quarter turn before its slot.',
      erklaerung:
        'It is the same way as in the case «Corner up, edge on the right, colour up»: twice the same grip to the right face, with a turn of the top layer in between. The difference lies solely in where the edge waits.\n\n' +
        'Seven moves, the hand stays at the right face. The alternative beside it is one move shorter and asks in return for a grip that this stage does not teach.',
    },
    cornerUpEdgeBackSide: {
      name: 'Corner up, edge at the back, colour to the side',
      bild:
        'Both pieces of the pair lie in the top layer. Turn the corner above its slot and the colour of the bottom face points upwards. The edge lies diagonally opposite the corner, at the top back, and the colour that belongs to the front in the slot points onto the side face on it.\n\n' +
        'You work from a different position: turn the top layer on until the corner lies at the top back left.',
      erklaerung:
        'This case too reads as two familiar grips one after the other, only in the other order than the case with the edge on the left: the grip to the right face goes first, the grip to the front face inserts.\n\n' +
        'Six moves, both hands involved, no half turn. Together with that one it is thus the shortest case of this group; under six moves none of them goes.\n\n' +
        'Without the case there would be two attempts here as well. Whoever has learnt this group to the end knows, for every position of the top layer, the one grip that brings corner and edge down together.',
    },
  },
};
