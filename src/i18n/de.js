// Texte der Oberfläche, Deutsch.
//
// Der Baum ist in beiden Sprachdateien gleich; eine Prüfung weist das in
// beide Richtungen nach. Nachgeschlagen wird über den Bezeichner, niemals
// über den deutschen Text als Schlüssel: Sonst ändert jede Umformulierung
// zugleich den Schlüssel und bricht die andere Sprache.
//
// **Die Notation steht hier nicht.** Sie bleibt in beiden Sprachen
// international, weil sie die gemeinsame Sprache aller weiterführenden
// Quellen ist. Wer sie eingedeutscht lernt, kann später keine fremde
// Anleitung lesen.

export default {
  kopf: {
    // Der Produktname wird nicht übersetzt, bindend aus E-0002.
    titel: 'Zauberwuerfel-Trainer',
    unterzeile: 'Lernpfad und Löser',
  },

  // «Erklärung» stand hier bis 4T-0062 für den ganzen rechten Bereich. Der Name
  // meinte Lösungsweg und Lernpfad zugleich und traf damit keinen von beiden;
  // seit sie getrennte Bereiche sind, trägt jeder seinen eigenen.
  //
  // «Lösungsweg» und nicht «Lösung», weil die Bühne bereits eine Marke «Lösung»
  // über der Schaltfläche trägt: Der Knopf erzeugt eine Lösung, der Bereich
  // zeigt ihren Weg.
  bereich: {
    wuerfel: 'Würfel',
    loesungsweg: 'Lösungsweg',
    lernpfad: 'Lernpfad',
    bedienung: 'Bedienung',
  },

  ansicht: {
    zurueck: 'Ansicht zurücksetzen',
    hinweis: 'Ziehen dreht den Blick. Die Notation bleibt davon unberührt.',
  },

  // Die Legende der Zeichen, 4T-0041. Zwei Bänder, jedes an dem Ort, an dem
  // seine Zeichen gelten: die beiden am Würfel in der Bühne, die vier der
  // Zugfolge unter der Zugliste.
  //
  // **Sie ersetzen die beiden Erklärzeilen, aus denen sie entstanden sind**,
  // `anstehend.hinweis` aus 4T-0034 und `anstehend.zeichen` aus 4T-0040. Die
  // Aussagen sind vollständig übernommen, eine je Zeile; verloren geht keine.
  // Der Grund für den Umbau steht im Task: Ein Zeichen erklärt sich am Muster
  // und nicht im Satz.
  //
  // **Der Saum bekommt zum ersten Mal Worte.** Er ist seit 4T-0034 das
  // auffälligere der beiden Zeichen am Würfel und war bis 2026-08-18 das
  // einzige unbenannte; `anstehend.hinweis` nannte allein die helle Marke.
  //
  // **Jede Zeile benennt ihr Zeichen und beschreibt es zugleich**, obwohl das
  // Muster daneben steht. Das ist keine Doppelung, sondern die Bedingung
  // dafür, dass die Legende ohne Bild trägt: Das Muster ist mit `aria-hidden`
  // aus der Vorlesehilfe genommen, weil es rein grafisch ist, und ein Satz wie
  // «Diese Schicht dreht sich» sagte dort nicht, wovon die Rede ist.
  zeichen: {
    wuerfel: 'Zeichen am Würfel',
    saum: 'Ein Saum um die Felder zeigt, welche Schicht sich dreht.',
    lauf: 'Eine hellere Marke an einer Kante zeigt, in welche Richtung.',
    kreuz:
      'Zwei Kreuze in den Ecken benennen die Seiten: links die, die du siehst, rechts die verdeckten.',
    // Der Sonderfall passt in keine Legendenzeile, weil er von einem Zustand
    // spricht statt von einem Zeichen. Er steht deshalb als Nachsatz unter dem
    // Band und ist der zweite Satz des alten `anstehend.hinweis`.
    halb: 'Bei einer halben Umdrehung steht die Marke auf beiden Seiten, denn dann ist die Richtung gleichgültig.',
    zugfolge: 'Zeichen der Zugfolge',
    folge: 'Eine Linie unter einer Gruppe zeigt eine gelernte Zugfolge. Ihr Name steht davor.',
    griff:
      'Eine Klammer darüber fasst Drehungen derselben Seite zu einem Handgriff zusammen. Dahinter steht, wie weit du drehst.',
    hebtAuf: 'Ein Strich bedeutet, dass sich die Züge aufheben und du gar nicht drehst.',
    // Die vierte Zeile erklärt ein Zeichen, das der Task nicht führte. Die
    // Durchsicht des Bestands nach AK5 hat es am 2026-08-18 gefunden: Die
    // goldene Hinterlegung war neben dem Saum das zweite unbenannte Zeichen.
    jetzt: 'Golden hinterlegt ist die Stelle, an der die Wiedergabe steht.',
  },

  verlauf: {
    zurueck: 'Zurück · Strg+Z',
    wieder: 'Vor · Strg+Y',
    geloest: 'Gelöster Würfel',
    verwuerfeln: 'Verwürfeln',
    wirklich: 'Die geübten Züge gehen dabei verloren. Fortfahren?',
    // Die Beschriftung der Zugfolge unter der Reihe, 4T-0083. Sie steht in der
    // Zeile und nicht darüber: Eine eigene Marke kostete Höhe, und ohne jedes
    // Wort stünde dort für einen Einsteiger eine Reihe rätselhafter Buchstaben.
    // Der Doppelpunkt gehört zum Textbaustein, weil er im Englischen an
    // derselben Stelle steht, aber nicht in jeder Sprache stehen muss.
    verwuerfelungMarke: 'Verwürfelung:',
  },

  bewegung: {
    folge: 'Zehn zufällige Züge',
    hinweis:
      'Die Buchstaben der Notation drehen die Schichten. Umschalt kehrt die Richtung um, Alt dreht um eine halbe Umdrehung.',
  },

  // Die Zustandseingabe über das Netz, 4T-0067.
  //
  // **Die Farben werden über ihre Seite benannt und nicht über ihren Namen.**
  // Zwei der sechs heißen bei der alternativen Palette anders, und das Netz
  // trägt ohnehin die Seitenmarken U R F D L B. Wer «obere Seite» liest und
  // die Farbfläche daneben sieht, hat die Zuordnung; wer «Grün» liest und
  // Türkis sieht, hat sie nicht. Die Namen selbst kommen mit 4T-0069 hinzu,
  // wo sie sich nicht vermeiden lassen.
  eingabe: {
    marke: 'Zustand eingeben',
    grund:
      'Für einen Würfel, den das Programm nicht selbst verwürfelt hat: Übertragen Sie seinen Zustand Feldchen für Feldchen auf das Netz.',
    beginnen: 'Zustand eingeben',
    abbrechen: 'Eingabe abbrechen',
    zurueck: 'Zurücknehmen · Strg+Z',
    leeren: 'Alles leeren',
    geloest: 'Gelöster Würfel',
    // Angekündigt wird ein Verlust und nicht ein Tastendruck: Die Rückfrage
    // erscheint nur, wenn tatsächlich etwas gesetzt ist. Eine Rückfrage vor
    // einer leeren Eingabe erzieht dazu, sie ungelesen wegzuklicken.
    leerenWirklich: 'Die eingetragenen Feldchen gehen dabei verloren. Fortfahren?',
    geloestWirklich: 'Die eingetragenen Feldchen werden dabei überschrieben. Fortfahren?',
    hinweis:
      'Farbe wählen, dann auf die Feldchen tippen. Mit der Tastatur: Pfeiltasten bewegen, die Ziffern 1 bis 6 wählen die Farbe, die Leertaste setzt sie.',
    farbwahl: 'Farbe wählen',
    farbstand: '{seite}, Taste {taste}, {ist} von {soll} gesetzt',
    feld: '{seite}, Zeile {zeile}, Spalte {spalte}',
    feldFest: '{seite}, Mitte, unveränderlich',
    uebernehmen: 'Übernehmen',
  },

  // Der Befund der Lösbarkeitsprüfung in Worten, 4T-0069.
  //
  // **Die Schlüssel sind wörtlich die Gründe aus `CONDITIONS`** in
  // `core/validate.js`. Eine Umsetzungstabelle von Grund zu Bezeichner wäre
  // eine zweite Wahrheit über dieselbe Liste, und die Prüfstrecke könnte sie
  // nicht gegen den Kern stellen.
  //
  // **Sechs Sätze für sechs erreichbare Fälle.** `validateFacelets` kennt zwei
  // weitere, nämlich eine Feldzahl ungleich 54 und eine Farbe, die es am
  // Würfel nicht gibt. Beide sind über keine Bedienung erreichbar: Die Eingabe
  // führt immer 54 Felder und bietet allein die sechs Seiten an. **Auch die
  // Erfassung aus Fotos erzeugt sie nicht**, denn das in 4T-0010 gewählte
  // Verfahren ordnet die 54 Felder relativ zu den sechs Mitten und kennt keine
  // siebte Farbe. Sie bekommen deshalb keinen eigenen Satz, sondern fallen auf
  // `auffang`; Entscheid des Product Owners vom 2026-08-19.
  //
  // **Die drei letzten Sätze nennen die Ursache und nicht den Erhaltungssatz.**
  // Wer bei der Farbverteilung scheitert, soll hören, dass eine Farbe zu oft
  // vorkommt, und keinen Satz über Vertauschungs-Paritäten.
  befund: {
    farbverteilung:
      'Die Farben sind ungleich verteilt: {liste}. Jede der sechs Farben muss genau 9-mal vorkommen.',
    'unbekannter-stein':
      'Die Farben an dieser {art} treffen an keinem Stein des Würfels zusammen. Vermutlich ist eines der hervorgehobenen Feldchen falsch abgelesen.',
    'stein-doppelt':
      'Ein Stein kommt zweimal vor. Am Würfel gibt es jeden Stein nur einmal. An einer der beiden hervorgehobenen Stellen ist eine Farbe falsch.',
    'ecken-drehung':
      'Eine Ecke steht verdreht, ohne dass eine zweite es ausgleicht. An einem echten Würfel geht das nicht. Vermutlich sind an einer der hervorgehobenen Ecken zwei Farben vertauscht.',
    'kanten-kippung':
      'Eine Kante steht gekippt, ohne dass eine zweite es ausgleicht. An einem echten Würfel geht das nicht. Vermutlich sind an einer der hervorgehobenen Kanten die beiden Farben vertauscht.',
    vertauschung:
      'Zwei Steine sind gegeneinander vertauscht. Das lässt sich an einem echten Würfel nicht herstellen, ohne ihn auseinanderzunehmen. Irgendwo sind zwei Feldchen verwechselt.',
    // Der Ausgang für jeden Grund ohne eigenen Satz. Ohne ihn stünde im
    // Fehlerfall der rohe Bezeichner in der Oberfläche, denn `erzeugeTexte`
    // liefert bei einem fehlenden Baustein den Punktpfad zurück.
    auffang: 'Der eingegebene Zustand lässt sich nicht übernehmen.',
    teil: {
      // Ein Glied der Aufzählung bei ungleicher Farbverteilung. Genannt werden
      // alle abweichenden Farben und nicht nur die, bei der die Prüfung
      // anhält: Die häufigste Ursache ist die Verwechslung zweier Farben, und
      // dann steht die zweite gleich daneben.
      farbanzahl: '{name} {ist}-mal',
      ecke: 'Ecke',
      kante: 'Kante',
    },
  },

  // Der Lektionsbereich aus 4T-0045. Der Zweig heißt `pfad` und nicht
  // `lektion`, weil er die Bedienung des Pfades trägt und nicht seinen Inhalt.
  // Der Zweig `lektion` gehört den zehn Lektionen allein; die Prüfung auf
  // dynamische Pfade hielte sonst jeden Bedientext für verwendet, sobald eine
  // einzige Lektion angesprochen wird.
  pfad: {
    // Eine eigene Überschrift trägt der Zweig nicht. Der Bereich heißt
    // «Erklärung», und eine zweite Marke unmittelbar darunter sagte dasselbe
    // ein zweites Mal.
    zaehlung: 'Lektion {nummer}',
    stand: '{abgeschlossen} von {gesamt} abgeschlossen',
    vorige: 'Vorige Lektion',
    naechste: 'Nächste Lektion',
    vorfuehren: 'Vorführen: {name}',
    // Das Zeichen zuerst, der Klartext dahinter. Zu lernen ist das Zeichen; der
    // Klartext sagt nur, was es bedeutet, und wird nach einigen Malen überlesen.
    vorfuehrenZug: '{zug} — {seite}, {richtung}',
    ohneFolge: 'Diese Lektion kommt ohne gelernte Zugfolge aus.',
    ueben: 'Übung beginnen',
    uebenNeu: 'Neue Übungslage',
    // Für die beiden Lektionen ohne Würfelaufgabe. Das Programm kann an ihnen
    // nichts prüfen und behauptet es auch nicht; der Anwender gibt selbst frei.
    verstanden: 'Verstanden, weiter',
    ueberspringen: 'Überspringen',
    ueberspringenWirklich:
      'Die Lektion gilt danach nicht als abgeschlossen, gibt die folgende aber frei. Fortfahren?',
    anwendungen: '{getan} von {verlangt} gelungenen Anwendungen',
    abgeschlossen: 'Diese Lektion ist abgeschlossen.',
    uebersprungen: 'Diese Lektion ist übersprungen. Sie lässt sich jederzeit nachholen.',
    gesperrt: 'Diese Lektion wird frei, sobald die vorige steht.',
    // Die Zustände der Übersicht, angesprochen über pfad.zustand.${zustand}.
    zustand: {
      abgeschlossen: 'abgeschlossen',
      uebersprungen: 'übersprungen',
      offen: 'offen',
      gesperrt: 'gesperrt',
    },
    begonnen: 'Die Übungslage steht. Drehe den Würfel, bis das Ziel erreicht ist.',
    geschafft: 'Geschafft. {getan} von {verlangt} Anwendungen.',
    fertig: 'Geschafft. Diese Lektion ist abgeschlossen.',
    // Der Abschluss des ganzen Weges, aus 4T-0051. Er verdient einen eigenen
    // Satz: Es ist das Ziel des Programms und nicht das einer Lektion.
    wegFertig: 'Geschafft. Der ganze Weg ist abgeschlossen. Du kannst den Zauberwürfel lösen.',
    freigegeben: 'Geschafft. Frei ist jetzt Lektion {nummer}, {name}.',
    bautAufDiese: 'Darauf bauen auf: {liste}.',
    // Die Hilfe der Lektion 9. Sie nennt den Schritt und die Lektion, in der er
    // steht, und keine einzige Zugfolge; wer sie nachsehen will, geht dorthin
    // zurück. Der Verweis auf die Lektion ist deshalb der eigentliche Inhalt.
    hilfe: 'Was ist als Nächstes dran?',
    hilfeSchritt: 'Schritt {nummer} von {von}: {name}. Nachzulesen in Lektion {lektion}.',
    hilfeGeloest: 'Der Würfel ist gelöst. Es bleibt nichts zu tun.',
    hilfeMisslungen: 'Die Auskunft ist nicht zustande gekommen.',
    // Der Weg zurück aus einer Lektion in die Lösung, aus 4T-0052. Er steht in
    // der Reihe der Navigation und nennt kein Ziel: Zurück geht es dorthin, wo
    // der Sprung begann, und das ist der Schritt, den der Anwender gerade
    // nachgeschlagen hat.
    zurLoesung: 'Zurück zur Lösung',
  },

  // Die Wiedergabe einer Lösung. Die Beschriftungen sind Wörter und keine
  // Zeichen: Ein Symbolsatz für Anfang, Schritt und Zug wäre ohne Legende
  // nicht zu unterscheiden, und die Legende wäre der zweite Ort, an dem
  // dasselbe steht.
  wiedergabe: {
    marke: 'Lösung',
    erzeugen: 'Lösung erzeugen',
    beenden: 'Wiedergabe beenden',
    anfang: 'Anfang',
    schrittZurueck: 'Schritt zurück',
    // «Handgriff» und nicht «Zug», seit 4T-0040: Ein Druck führt aus, was der
    // Anwender in einer Bewegung dreht, und das sind zwei oder drei Züge der
    // Lösung, sobald sie dieselbe Seite betreffen.
    zugZurueck: 'Handgriff zurück',
    abspielen: 'Abspielen',
    anhalten: 'Anhalten',
    zugVor: 'Handgriff vor',
    schrittVor: 'Schritt vor',
    ende: 'Ende',
    stand: 'Zug {stelle} von {anzahl}',
    hinweis:
      'Leertaste spielt ab und hält an, die Pfeiltasten gehen einen Handgriff, Bild auf und Bild ab springen auf die Schrittgrenzen, Pos 1 und Ende an die Enden.',
    grund:
      'Der Übungswürfel ist während der Wiedergabe gesperrt. Ein eigener Zug machte die Zugfolge ungültig.',
    // Die kurze Lösung, 4T-0082. Der Fortschritt nennt die laufende Nummer und
    // keine Gesamtzahl: Wie viele Teile die Vorbereitung hat, weiß allein der
    // Löser, und eine hier zweitgeschriebene Zahl liefe ihm davon.
    kurz: 'Kurze Lösung',
    abbrechen: 'Abbrechen',
    rechnetVorbereitung: 'Der Löser wird vorbereitet, Schritt {nummer} …',
    rechnetSuche: 'Die Lösung wird gesucht …',
    rechnetMisslungen: 'Die kurze Lösung ließ sich nicht erzeugen.',
    rechnetAbgebrochen: 'Die Rechnung ist abgebrochen.',
    // Steht an der Stelle, an der sonst die Begründung des Schrittes steht.
    // Der Platz wird bei der kurzen Lösung frei, weil sie keine Schritte hat,
    // und F-0009 verlangt, dass das Programm den Unterschied ausspricht,
    // statt ihn den Anwender selbst herausfinden zu lassen.
    ohneSystematik:
      'Das ist die kürzeste Lösung, die das Programm findet. Sie folgt keiner menschlichen Systematik, ist deshalb nicht in Schritte gegliedert und wird nicht begründet.',
  },

  // Die Anzeige des anstehenden Zuges, 4T-0034. Der Klartext steht neben der
  // Notation, weil «R'» einem Einsteiger nichts über die Richtung sagt und
  // weil die Marke am Würfel einmal gedeutet werden muss.
  anstehend: {
    marke: 'Anstehender Zug',
    keiner: 'Die Lösung ist abgespielt.',
    klartext: '{seite}, {richtung}',
    schritt: 'Schritt {nummer} von {von}: {name}',
    fortschritt: 'Zug {getan} von {anzahl} in diesem Schritt',
    // Der Weg in die Lektion, aus 4T-0052. Der Name des Schrittes steht bereits
    // in der Zeile darüber, deshalb nennt die Schaltfläche allein die Nummer;
    // beides zusammen ergäbe denselben Namen zweimal untereinander.
    lektion: 'In Lektion {nummer} nachlesen',
    liste: 'Zugfolge',
    // Der Griff aus 4T-0040: zwei oder drei Drehungen derselben Seite sind für
    // die Hand eine einzige. Der zweite Text nennt den Fall, in dem sie sich
    // ganz aufheben; ohne ihn sähe eine leere Ansage wie ein Fehler aus.
    griff: 'Aus {anzahl} Zügen der Lösung: {zuege}',
    hebtAuf: 'Diese {anzahl} Züge heben einander auf. Du drehst nicht.',
    // Die Deutung der Kennzeichnungen stand bis 4T-0041 hier als `zeichen` und
    // steht seitdem im Zweig `zeichen` als Band unter der Liste. Der Ort ist
    // derselbe geblieben, die Form nicht: Ein Zeichen erklärt sich am Muster
    // und nicht im Satz.
  },

  // Die Zugliste. Die Marke über jeder Gruppe nennt Schritt und Lektion, die
  // Marke vor einer gelernten Zugfolge deren Namen. Der Name des Schrittes
  // kommt seit 4T-0052 aus `lektion.<kennung>.titel` und steht nicht hier.
  zugliste: {
    schritt: '{nummer}. {name} · Lektion {lektion}',
  },

  // Die sieben Einträge für die sechs gelernten Zugfolgen. Kurz gehalten, weil
  // sie in der Zugliste zwischen den Zügen stehen. Der ausführliche Name und
  // die Begründung stehen später in der Lektion, siehe 2A-0007.
  folge: {
    firstLayerCorner: 'Ecke einsetzen',
    secondLayerRight: 'Kante nach rechts',
    secondLayerLeft: 'Kante nach links',
    topCross: 'Kreuz oben',
    topEdges: 'Kanten tauschen',
    topCorners: 'Ecken tauschen',
    cornerTwist: 'Ecke drehen',
  },

  // Die sechs Seiten und die drei Drehrichtungen. Sie tragen den Klartext des
  // anstehenden Zuges und werden vom Lernpfad in 2A-0007 wieder gebraucht.
  seite: {
    U: 'obere Seite',
    R: 'rechte Seite',
    F: 'vordere Seite',
    D: 'untere Seite',
    L: 'linke Seite',
    B: 'hintere Seite',
  },

  // Die Farben beim Namen, je Palette, 4T-0069.
  //
  // **Das ist eine zweite Wahrheit über die Zuordnung von Seite zu Farbe**,
  // denn die erste steht als `--seite-u` bis `--seite-b` in `src/stil.css`.
  // Sie ist unvermeidbar, weil ein Farbwert keinen Namen trägt, und wer dort
  // eine Farbe tauscht, ändert sie hier mit.
  //
  // **Vermeiden ist hier kein Weg**, anders als bei der Farbwahl der Eingabe,
  // wo die Oberfläche die Seite benennt. Der Befund kann jede der sechs Farben
  // betreffen, und «die Farbe der linken Seite kommt zu oft vor» ist kein
  // Satz, mit dem jemand einen Würfel absucht.
  //
  // **Entschärft wird die zweite Wahrheit durch die Hervorhebung:** Die
  // betroffenen Feldchen leuchten am Netz auf, und damit zeigt die Meldung,
  // welche Farbe sie meint, auch wenn der Name einmal danebenläge.
  farbe: {
    kanonisch: { U: 'Gelb', R: 'Orange', F: 'Grün', D: 'Weiß', L: 'Rot', B: 'Blau' },
    alternativ: { U: 'Gelb', R: 'Orange', F: 'Türkis', D: 'Weiß', L: 'Magenta', B: 'Blau' },
  },

  richtung: {
    uhr: 'im Uhrzeigersinn',
    gegen: 'gegen den Uhrzeigersinn',
    halb: 'eine halbe Umdrehung',
  },

  // Die sieben Einstellungen des Katalogs. Die Begründung steht bei jeder,
  // weil der Katalog jede begründet; sie gehört an das Bedienelement und
  // nicht in ein Handbuch, das niemand liest.
  einstellung: {
    sprache: 'Sprache',
    palette: 'Würfelpalette',
    kennzeichnung: 'Kennzeichnung ohne Farbe',
    bewegung: 'Bewegung',
    ansicht: 'Ansicht',
    schriftgroesse: 'Schriftgröße',
    vorgabe: 'Vorgabe: {wert}',
    zuruecksetzen: 'Zurücksetzen',
    allesZuruecksetzen: 'Alle Einstellungen zurücksetzen',
    allesWirklich: 'Alle Einstellungen auf ihre Vorgabe zurücksetzen?',
    spaeter: 'Wirkt, sobald der Würfel steht.',
  },

  grund: {
    sprache: 'Zwei Zielsprachen sind zugesagt. Ohne Umschaltung wäre die zweite wertlos.',
    palette:
      'Ohne alternative Palette ist der Würfel bei Rot-Grün-Schwäche nicht lösbar, sondern nur zu erraten.',
    kennzeichnung:
      'Rückfallebene, wenn auch die alternative Palette nicht reicht. Getrennt schaltbar, weil die Zeichen die Anmutung stören.',
    bewegung:
      'Bewegtbilder bereiten manchen Anwendern Beschwerden. Zugleich Geschmacksfrage beim häufigen Üben.',
    ansicht: 'Rückfallebene für schwache Geräte und für alle, die die flache Übersicht bevorzugen.',
    schriftgroesse:
      'Der Lernpfad besteht überwiegend aus Text. Wer ihn nicht lesen kann, lernt nichts.',
  },

  wert: {
    palette: { kanonisch: 'Kanonisch', alternativ: 'Für Farbfehlsichtigkeit' },
    kennzeichnung: { aus: 'Aus', an: 'An' },
    bewegung: { aus: 'Aus', langsam: 'Langsam', mittel: 'Mittel', schnell: 'Schnell' },
    ansicht: { raeumlich: 'Räumlich', netz: 'Flaches Netz' },
    schriftgroesse: { klein: 'Klein', normal: 'Normal', gross: 'Groß', sehrGross: 'Sehr groß' },
    sprache: { de: 'Deutsch', en: 'English' },
  },

  ablage: {
    marke: 'Sichern',
    sichern: 'Als Datei sichern',
    holen: 'Aus Datei holen',
    grund:
      'Der Speicher des Browsers hängt am Ort der Datei. Wird sie verschoben oder auf einem anderen Gerät geöffnet, ist der Fortschritt verloren.',
    kein: 'Dieser Browser gibt keinen Speicher frei. Das Programm läuft weiter, vergisst die Einstellungen aber beim Schließen. Sichere sie als Datei.',
    ergaenzt: 'Ein älterer Stand wurde übernommen und um die neuen Einstellungen ergänzt.',
    geholt: 'Der gesicherte Stand ist übernommen.',
    abgewiesen:
      'Diese Datei gehört nicht zu diesem Programm oder ist beschädigt. Der vorhandene Stand bleibt unverändert.',
    ueberschreiben: 'Der vorhandene Stand wird durch die Datei ersetzt. Fortfahren?',
    // Das Löschen des Fortschritts, 4T-0084.
    //
    // **Die Rückfrage nennt beides**, was verloren geht und was bleibt. Das
    // Programm hält zwei Dinge ab, Einstellungen und Fortschritt, und eine
    // Schaltfläche für jedes; wer die eine drückt, soll nicht raten müssen, ob
    // sie auch das andere trifft.
    loeschen: 'Fortschritt löschen',
    loeschenWirklich:
      'Der gesamte Fortschritt im Lernpfad geht dabei verloren, also abgeschlossene und übersprungene Lektionen. Die Einstellungen bleiben. Fortfahren?',
    geloescht: 'Der Fortschritt ist gelöscht. Der Lernpfad steht wieder am Anfang.',
  },

  // Die zehn Lektionen des Lernpfads. Die Titel stammen aus Abschnitt 3 des
  // Didaktik-Konzepts und sind keine Platzhalter; sie stehen dort seit der
  // Freigabe des Lektionsschnitts. Erklärung, Vorstellung und Anweisung treten
  // mit 3E-0014 und 3E-0015 daneben, je Lektion unter derselben Kennung.
  //
  // **Der Titel ist zugleich der Name des Schrittes, der ihn anwendet.** Bis
  // 4T-0052 gab es dafür einen eigenen Zweig `schritt.*` mit sieben zweiten
  // Namen; fünf waren wortgleich mit dem Titel, zwei nicht, und der Anwender
  // hätte für dieselbe Sache zwei Namen gelesen. S-0023 verlangt in AK1 den
  // einen, und weil die Bezeichner der Schritte genau die der Lektionen 2 bis 8
  // sind, ist der Zugriff die Identität und keine Tabelle.
  //
  // **Die Zugfolge behält ihren eigenen Zweig.** «Kreuz oben» heißt hier eine
  // Lektion und in `folge` eine gelernte Zugfolge; das sind zwei Gegenstände,
  // und die Namen fallen nur zufällig zusammen. In der Zugliste stehen beide
  // nebeneinander, und der Zweig `folge` ist kurz gehalten, weil er zwischen
  // die Züge muss.
  //
  // **Die vier Bausteine je Lektion stehen in `view/lektion.js`**, samt ihrer
  // Reihenfolge und ihrer Begründung. Hier stehen die Worte. Mehrere Absätze
  // eines Bausteins sind durch eine Leerzeile getrennt, und beide Sprachen
  // tragen je Baustein gleich viele; die Prüfstrecke rechnet das nach, denn
  // eine abweichende Zahl ist das Anzeichen einer fehlenden Aussage.
  //
  // **Genannte Farben sind auf beide Paletten geprüft.** Weiß, Gelb, Blau und
  // Orange heißen in der alternativen Palette genauso, Grün und Rot nicht: Dort
  // treten Türkis und Magenta an ihre Stelle. Ein Beispiel mit Rot und Grün
  // stünde für einen Teil der Anwender neben einem Würfel, der diese Farben
  // nicht zeigt, und wäre gerade für die, denen die Palette hilft, unbrauchbar.
  lektion: {
    pieces: {
      titel: 'Der Würfel',
      einstieg:
        'Diese Lektion zeigt, woraus der Zauberwürfel besteht und warum sich seine Mitten nicht verschieben lassen. Ohne diese Einsicht bleibt jeder Lösungsschritt eine Vorschrift ohne Grund.',
      erklaerung:
        'Sichtbar sind sechsundzwanzig Steine, und sie sind von dreierlei Art. Sechs Mitten tragen eine einzige Farbe und sitzen in der Fläche einer Seite. Zwölf Kanten tragen zwei Farben und sitzen zwischen zwei Mitten. Acht Ecken tragen drei Farben und sitzen an den Ecken des Würfels. Sechs, zwölf und acht ergeben sechsundzwanzig; einen siebenundzwanzigsten Stein in der Mitte gibt es nicht, dort steckt die Mechanik.\n\n' +
        'Die Farben eines Steins lassen sich nicht trennen. Eine Kante mit Weiß und Blau bleibt eine Kante mit Weiß und Blau, gleich wohin sie wandert, und es gibt sie genau einmal. Wer eine weiße Fläche sucht, sucht deshalb immer einen ganz bestimmten Stein und nicht irgendeinen weißen.\n\n' +
        'Die sechs Mitten bewegen sich zueinander nie. Jede Drehung dreht eine Schicht um ihre Mitte, und die Mitte selbst bleibt, wo sie ist. Damit steht die Farbe jeder Seite von Anfang an fest: Weiß ist dort, wo die weiße Mitte sitzt, und nirgends sonst. Das lässt sich am Modell nachsehen. Ein beliebiger Zug über das Tastenfeld, danach ein Blick auf die sechs Mitten, und sie stehen einander gegenüber wie zuvor.\n\n' +
        'Daraus folgt die Arbeitsweise des ganzen Lernpfads. Sortiert werden nicht Farben, sondern Steine werden an ihren Platz gebracht, und wo dieser Platz liegt, sagen die Mitten.',
      vorstellung:
        'Der Zauberwürfel ist kein Haufen bunter Felder, sondern ein Gerüst aus sechs festen Mitten, um das sich zwanzig bewegliche Steine drehen.',
      aufgabe:
        'Zu jedem Stein der Anzeige gehört eine der drei Arten: Mitte, Kante oder Ecke. Wer sie an einigen Beispielen sicher benennt, meldet die Lektion als verstanden. Das Programm prüft hier nichts, denn eine Einsicht kann es nicht sehen.',
    },
    notation: {
      titel: 'Notation',
      einstieg:
        'Diese Lektion führt die Schreibweise ein, mit der sich Züge aufschreiben und lesen lassen. Sie ist der einzige Fachbegriff des Lernpfads und bleibt international: Jede weiterführende Anleitung verwendet dieselben sechs Buchstaben.',
      erklaerung:
        'Jeder Buchstabe steht für eine Seite des Würfels, gesehen von dem, der davor sitzt. U ist oben, D ist unten, R ist rechts, L ist links, F ist vorn, B ist hinten. Es sind die Anfangsbuchstaben der englischen Wörter, und genau deshalb sind sie in jeder Sprache dieselben.\n\n' +
        'Ein Buchstabe allein bedeutet eine Vierteldrehung dieser Seite im Uhrzeigersinn, von außen auf die Seite gesehen. Das «von außen» ist die Stelle, an der sich Einsteiger vertun: Bei D wird von unten auf den Würfel gesehen, und dieselbe Drehung läuft von oben betrachtet gegen den Uhrzeigersinn.\n\n' +
        // Der Strich ist der gerade Apostroph und nicht der typografische. Er
        // steht so auf dem Tastenfeld und in jeder Zugfolge des Programms; ein
        // anderes Zeichen im Text wäre ein zweites, das der Anwender vergeblich
        // sucht.
        "Ein Strich hinter dem Buchstaben kehrt die Richtung um. R' ist die Vierteldrehung der rechten Seite gegen den Uhrzeigersinn. Eine Zwei bedeutet eine halbe Umdrehung, also zwei Vierteldrehungen; bei ihr ist die Richtung gleichgültig, denn beide Wege führen auf dieselbe Lage.\n\n" +
        'Sechs Seiten mit je drei Möglichkeiten ergeben achtzehn Züge, und mehr kennt der Zauberwürfel nicht. Sie stehen vollständig auf dem Tastenfeld unter dem Würfel, jeder mit seiner Taste. Eine zweite Tabelle an dieser Stelle könnte davon abweichen und wird deshalb nicht geführt.\n\n' +
        'Die Schaltflächen unter diesem Text führen jedes Zeichen einzeln vor. Wer sie der Reihe nach drückt und dabei den Würfel ansieht, hat die Notation gesehen und muss sie nicht auswendig lernen.',
      vorstellung:
        'Ein Buchstabe benennt die Seite, ein Strich die Gegenrichtung, eine Zwei die halbe Umdrehung. Gedreht wird immer so, wie es aussähe, säße man vor genau dieser Seite.',
      aufgabe:
        'Die Übung beginnt am gelösten Würfel. Auszuführen ist die Folge {folge}, Zug für Zug über das Tastenfeld oder die Tastatur. Geprüft wird die erreichte Lage und nicht die Tastenfolge: Ein Vertippen lässt sich zurücknehmen oder mit dem Gegenzug beheben, und die Aufgabe gilt trotzdem als gelöst.',
    },
    cross: {
      titel: 'Weißes Kreuz',
      einstieg:
        'Diese Lektion baut das weiße Kreuz auf der Unterseite. Sie ist die einzige des ganzen Weges, die ohne eine gelernte Zugfolge auskommt: Vier Kanten werden gesucht, über ihren Platz gedreht und heruntergezogen.',
      erklaerung:
        'Die weiße Mitte sitzt unten, also entsteht das Kreuz unten. Der Würfel wird auf diesem Weg nie umgedreht; stattdessen kippt die Ansicht auf die Unterseite, sobald diese Lektion geöffnet wird. Vorn bleibt dabei vorn und rechts bleibt rechts, und jeder Buchstabe der Notation behält seine Bedeutung.\n\n' +
        'Gesucht sind die vier Kanten mit einer weißen Fläche. Jede von ihnen trägt eine zweite Farbe, und diese zweite Farbe bestimmt ihren Platz: Die Kante mit Weiß und Blau gehört zwischen die weiße Mitte unten und die blaue Mitte hinten, und nirgendwo sonst hin. Wer allein auf die weißen Flächen achtet, baut ein Kreuz, das nur von unten wie eines aussieht. Von der Seite betrachtet stünden die zweiten Farben dann quer zu ihren Mitten, und die erste Schicht ließe sich darauf nicht aufbauen.\n\n' +
        'Der Weg einer Kante hat drei Schritte. Zuerst wird sie in die obere Ebene gebracht, mit der weißen Fläche nach oben. Dann dreht die obere Seite sie über ihren Platz, also über die Mitte ihrer zweiten Farbe. Zuletzt zieht eine halbe Drehung dieser Seitenfläche sie nach unten; bei der blauen Mitte hinten ist das B2.\n\n' +
        'Zwei Fälle brauchen einen Umweg. Zeigt die weiße Fläche oben zur Seite statt nach oben, wird die Kante mit einem Zug in die mittlere Ebene geschoben und mit einem anderen wieder hochgeholt, wobei sie umkippt. Sitzt eine Kante bereits unten, gehört aber woanders hin oder liegt verkehrt herum, holt eine halbe Drehung ihrer Seitenfläche sie nach oben, und der Weg beginnt von vorn. Ausprobieren kostet hier nichts: In dieser Lektion ist jeder Zug erlaubt, und jeder lässt sich zurücknehmen.',
      vorstellung:
        'Kante suchen, über ihren Platz drehen, herunterziehen. Mehr ist das Kreuz nicht.',
      aufgabe:
        'Die Übung legt eine Lage auf, in der die vier weißen Kanten verstreut liegen. Sie ist gelöst, wenn alle vier unten stehen und ihre zweiten Farben zu den Mitten ihrer Seiten passen. Das Programm erkennt beides am Würfel und gibt die nächste Lektion frei.',
    },
    firstLayerCorners: {
      titel: 'Weiße Ecken',
      einstieg:
        'Zur ersten Schicht fehlen jetzt noch die vier Ecken. Hier steht die erste gelernte Zugfolge des Weges, und sie ist zugleich die meistgebrauchte: In keiner einzigen Lösung kommt sie ohne Anwendung aus.',
      erklaerung:
        'Eine Ecke trägt drei Farben, und damit liegt ihr Platz fest: Die Ecke mit Weiß, Blau und Orange gehört dorthin, wo die weiße, die blaue und die orangene Mitte zusammentreffen. Gesucht sind die vier Ecken mit einer weißen Fläche; die übrigen vier gehören nach oben und stören hier nicht.\n\n' +
        'Gearbeitet wird an einer einzigen Stelle, der Lücke unten vorn rechts. Die Ecke, die dorthin gehört, wird zuerst in die obere Ebene gebracht und dort mit Drehungen der oberen Seite genau über diese Lücke gestellt, also nach oben vorn rechts.\n\n' +
        'Von dort setzt die Zugfolge {firstLayerCorner} sie ein. Der erste Zug klappt die vordere Seite hoch und öffnet damit die Lücke, der zweite dreht die obere Ebene und legt die Ecke hinein, der dritte schließt die Lücke wieder, und der vierte stellt die obere Ebene zurück. Nach vier Zügen steht der Würfel wieder so da wie vorher, nur mit einer Ecke mehr an ihrem Platz.\n\n' +
        'Dieselbe Folge löst zwei weitere Fälle, ohne dass etwas Neues zu lernen wäre. Steht die Ecke schon in ihrer Lücke, aber verdreht, so dreht eine zweite und vierte Anwendung sie an Ort und Stelle. Sitzt eine falsche Ecke in der Lücke, so holt eine einzige Anwendung sie heraus nach oben. In beiden Fällen genügt es, die Folge zu wiederholen, bis die Ecke sitzt; gezählt werden muss nicht.\n\n' +
        'Die Folge ist für die Lücke vorn rechts aufgeschrieben, und es gibt vier Lücken. Wer ein eigenes Stück in der Hand hält, dreht dafür den ganzen Würfel, bis die richtige Lücke vorn rechts liegt. Am Bildschirm bleibt der Würfel liegen, und stattdessen wandern die Buchstaben um dieselbe Vierteldrehung mit: F wird R, R wird B, B wird L, L wird F. Oben und unten bleiben, wo sie sind, denn gedreht wird um die senkrechte Achse.',
      vorstellung:
        'Die Lücke wird geöffnet, die Ecke fällt hinein, die Lücke schließt sich wieder. Die obere Ebene ist dabei nur die Ablage, aus der die Ecke kommt.',
      aufgabe:
        'Die Übung legt eine Lage auf, in der das Kreuz steht und die weißen Ecken noch fehlen oder verdreht sind. Sie ist gelöst, wenn die erste Schicht vollständig steht, also alle vier Ecken an ihrem Platz und ungedreht. Die Schaltfläche unter dem Text führt die Zugfolge am Würfel vor, so wie er gerade liegt.',
    },
    secondLayer: {
      titel: 'Zweite Schicht',
      einstieg:
        'Mit der ersten Schicht steht der Boden, und es fehlen die vier Kanten der Mittelschicht. Diese Lektion trägt als einzige des Weges zwei Zugfolgen. Sie sind einander gespiegelt, und die Wahl zwischen ihnen ist nichts zum Auswendiglernen: Sie folgt daraus, auf welcher Seite die Lücke liegt.',
      erklaerung:
        'Jede Kante der Mittelschicht sitzt neben einer Ecke der ersten Schicht, und beide teilen sich zwei Farben. Die Kante mit Blau und Orange gehört zwischen die blaue Mitte hinten und die orangene Mitte rechts; unter ihr steht die Ecke mit Weiß, Blau und Orange, die in der vorigen Lektion gesetzt worden ist. Ecke und Kante bilden ein Paar, und das ist keine Redeweise: Die Zugfolge nimmt die Ecke kurz mit nach oben und legt beide gemeinsam wieder hinein. Schnellere Verfahren setzen dieses Paar von vornherein zusammen, statt die Ecke erst allein zu setzen. Wer hier in Paaren denkt, muss das dort nicht neu lernen.\n\n' +
        'Gesucht sind die vier Kanten ohne Gelb. Gelb liegt oben, und jede Kante mit einer gelben Fläche gehört deshalb in die letzte Schicht; sie stört hier nicht. Die übrigen vier gehören in die Mittelschicht, und wohin genau, sagen wie beim Kreuz ihre beiden Farben.\n\n' +
        'Gearbeitet wird an einer Kante, die oben liegt. Die obere Ebene wird gedreht, bis die seitliche Fläche der Kante zur Mitte darunter passt; die Kante steht dann über ihrer eigenen Seite, und diese Seite ist beim Anwenden die vordere. Ihre zweite Farbe zeigt jetzt nach oben, und sie entscheidet alles Weitere: Trägt sie die Farbe der rechten Mitte, gehört die Kante in die Lücke vorn rechts, trägt sie die der linken, in die Lücke vorn links.\n\n' +
        // Beide Platzhalter stehen in diesem Absatz. Der Wortlaut kommt aus
        // `SEQUENCES` des Lösers; abgeschrieben liefe er ihm davon, und zwar in
        // beiden Sprachen zugleich.
        'Für die rechte Lücke steht die Folge {secondLayerRight}, für die linke {secondLayerLeft}. Beide arbeiten gleich. Der erste Zug parkt die Kante zur Seite, damit sie nicht im Weg liegt. Die nächsten drei holen die Ecke der ersten Schicht nach oben und öffnen damit die Lücke; das Kreuz unten bleibt dabei unberührt. Die letzten vier stellen Kante und Ecke oben nebeneinander, und der achte Zug legt beide gemeinsam nach unten. Danach steht der Würfel wieder so da wie vorher, nur mit einem Paar mehr.\n\n' +
        'Oft liegt die gesuchte Kante gar nicht oben, sondern steckt bereits in einer Lücke der Mittelschicht, an der falschen Stelle oder verkehrt herum. In vier von fünf Lösungen kommt das mindestens einmal vor, und es braucht dafür nichts Neues: Eine einzige Anwendung der Folge, die zu dieser Lücke gehört, holt die Kante nach oben, und an ihre Stelle rutscht dabei eine Kante der oberen Ebene. Von oben aus beginnt der Weg dann von vorn. Das sieht aus, als arbeite das Verfahren gegen sich selbst, ist aber der kürzeste Weg: Mit den beiden gelernten Folgen führt keiner unmittelbar von einer Lücke in die andere.\n\n' +
        'Beide Folgen sind für die Lücken vorn rechts und vorn links aufgeschrieben, und es gibt vier Lücken. Wie bei den Ecken der ersten Schicht bleibt der Würfel am Bildschirm liegen, und stattdessen wandern die Buchstaben mit: F wird R, R wird B, B wird L, L wird F. Zwei Folgen in vier Haltungen ergeben acht Anwendungsfälle, und auf jede Lücke passen genau zwei davon, je einer für die beiden Lagen, in denen die Kante oben liegen kann.',
      vorstellung:
        'Die Kante wird geparkt, die Lücke geöffnet, die Kante mit ihrer Ecke hineingelegt. Die obere Ebene ist dabei die Werkbank, auf der Ecke und Kante zusammenfinden.',
      aufgabe:
        'Die Übung legt eine Lage auf, in der die erste Schicht steht und die Kanten der Mittelschicht noch fehlen. Sie ist gelöst, wenn beide Schichten vollständig stehen; das Programm erkennt es am Würfel und gibt die nächste Lektion frei. Die beiden Schaltflächen unter dem Text führen je eine der Folgen vor, so wie der Würfel gerade liegt.',
    },
    topCross: {
      titel: 'Kreuz oben',
      einstieg:
        'Zwei Schichten stehen, und die letzte ist in vier Lektionen gelöst. Diese hier ist die erste von ihnen und zugleich die erste, die gelernt statt erklärt wird: Ihre Zugfolge lässt sich nicht mehr auf einen einzelnen Handgriff zurückführen. An die Stelle der Erklärung tritt ein Bild, und es gibt genau drei davon.',
      erklaerung:
        'Gesucht ist das gelbe Kreuz auf der Oberseite, also die vier Kanten oben mit ihrer gelben Fläche nach oben. Wohin diese Kanten dabei zeigen, ist in dieser Lektion gleichgültig; sie an ihren Platz zu bringen ist die Aufgabe der nächsten. Dieser Schritt orientiert allein, er setzt nicht. Genau diese Trennung führen die schnellen Verfahren später weiter, und wer sie hier lernt, muss sie dort nicht neu fassen.\n\n' +
        'Wie viele der vier Kanten schon gelb nach oben zeigen, ist nicht beliebig: Es sind null, zwei oder vier, niemals eine und niemals drei. Der Grund liegt am Würfel selbst, denn jede Drehung ändert die Zahl der gekippten Kanten um eine gerade Zahl. Vier ist das Ziel, und für die übrigen Möglichkeiten bleiben drei Bilder. Beim Punkt zeigt keine Kante nach oben, sichtbar ist allein die gelbe Mitte. Bei der Linie sind es zwei einander gegenüberliegende, beim Winkel zwei benachbarte.\n\n' +
        'Die Zugfolge {topCross} führt ein Bild in das nächste: aus dem Punkt wird ein Winkel, aus dem Winkel eine Linie, aus der Linie das Kreuz. Aus dem Punkt sind es damit drei Anwendungen, aus dem Winkel zwei, aus der Linie eine. Dass dieselbe Folge mehrmals nacheinander nötig ist, gehört zur Sache und ist kein Zeichen eines Fehlers.\n\n' +
        'Entscheidend ist, wie das Bild dabei liegt. Die Linie muss quer vor dem Anwender liegen, also von links nach rechts; längs liegend führt dieselbe Folge zurück zum Punkt. Beim Winkel müssen die beiden gelben Kanten nach hinten und nach links zeigen. Aus dieser Haltung entsteht die Linie gleich quer, und die zweite Anwendung folgt ohne weiteres Drehen. Beim Punkt ist die Haltung gleichgültig, denn er sieht von allen vier Seiten gleich aus.\n\n' +
        'Ausgerichtet wird das Bild durch Drehen der oberen Ebene, mit U oder U2. Das ist die Erleichterung dieser Lektion gegenüber den beiden vorigen: Weil die Lage der Kanten hier noch nichts bedeutet, kostet eine Drehung oben nichts, und die Buchstaben der Zugfolge bleiben, wie sie aufgeschrieben sind. Wer falsch ausrichtet, verdirbt nichts; das Bild wechselt dann in ein anderes, und der Weg wird länger.',
      vorstellung:
        'Drei Bilder, und jedes wird zum nächsten: Punkt, Winkel, Linie, Kreuz. Die Folge ist immer dieselbe, und allein die Lage des Bildes entscheidet, welchen Schritt sie tut.',
      aufgabe:
        'Die Übung legt eine Lage auf, in der zwei Schichten stehen und oben eines der drei Bilder liegt. Sie ist gelöst, wenn alle vier Kanten oben gelb zeigen; das Programm erkennt es am Würfel. Verlangt sind mehrere gelungene Anwendungen aus verschiedenen Ausgangslagen, denn ein einziger Durchgang zeigt nur eines der drei Bilder; die Zählung steht unter dem Text.',
    },
    topEdges: {
      titel: 'Kanten setzen',
      einstieg:
        'Das gelbe Kreuz steht, und damit zeigen die vier Kanten oben, was sie zeigen sollen. Nur liegen sie meist an der falschen Stelle. Diese Lektion bringt sie an ihren Platz, ohne eine von ihnen wieder zu kippen. Das ist der zweite der beiden Begriffe, die die letzte Schicht gliedern: Nach dem Orientieren folgt das Setzen.',
      erklaerung:
        'Eine Kante steht an ihrem Platz, wenn ihre zweite Farbe zur Mitte darunter passt. Die Kante mit Gelb und Blau gehört zwischen die gelbe Mitte oben und die blaue Mitte hinten; liegt sie dort, ist sie fertig, und liegt sie irgendwo sonst oben, muss sie wandern. Weil das Kreuz steht, ist die Frage nach der Kippung erledigt, und es bleibt allein die Frage nach dem Platz.\n\n' +
        'Die Zugfolge {topEdges} vertauscht drei der vier Kanten oben ringförmig und lässt die vierte stehen, nämlich die hintere. Nachgerechnet rührt sie dabei keine einzige Ecke an und kippt keine Kante; das gelbe Kreuz und beide unteren Schichten bleiben unberührt. Die stehende Kante ist der Anker der ganzen Lektion.\n\n' +
        'Der Handgriff besteht deshalb darin, diesen Anker zu finden. Die obere Ebene wird gedreht, bis genau eine Kante zu ihrer Mitte passt. Passen dabei gleich alle vier, so war allein die obere Ebene verdreht, und der Schritt ist ohne eine einzige Anwendung erledigt. Sonst bleibt die passende Kante stehen, und die Zugfolge wird in der Haltung angewandt, in der sie hinten liegt. Wer ein eigenes Stück hält, dreht dafür den ganzen Würfel; am Bildschirm bleibt er liegen, und stattdessen wandern die Buchstaben um dieselbe Vierteldrehung mit: F wird R, R wird B, B wird L, L wird F.\n\n' +
        'Steht das Ziel nach einer Anwendung nicht, so genügt eine zweite. Der Grund ist die Bauart der Folge: Dreimal angewandt stellt sie den Ausgangszustand wieder her, und zweimal angewandt ergibt sie deshalb denselben Ringtausch in die Gegenrichtung. Damit sind beide Richtungen mit einer einzigen gelernten Folge zu erreichen, und die zweite Folge, die andere Anleitungen an dieser Stelle führen, wird nicht gebraucht.\n\n' +
        'Selten findet sich keine Drehlage, in der genau eine Kante passt. Dann stehen zwei zu tauschende Paare einander gegenüber, und es gibt keinen Anker. Auch dafür ist nichts Neues zu lernen: Die Folge wird einmal in beliebiger Haltung angewandt, und danach gibt es eine Drehlage mit genau einer passenden Kante. Von dort greift der Handgriff wie sonst.',
      vorstellung:
        'Eine Kante bleibt stehen, die anderen drei wandern im Ring. Wer die stehende zuerst sucht, hat die Lektion begriffen; alles Weitere ist die Folge selbst.',
      aufgabe:
        'Die Übung legt eine Lage auf, in der das gelbe Kreuz steht und die Kanten oben vertauscht sind. Sie ist gelöst, wenn alle vier Kanten oben zu den Mitten ihrer Seiten passen; das Programm erkennt es am Würfel. Verlangt sind mehrere gelungene Anwendungen aus verschiedenen Ausgangslagen, denn die Anordnung ist jedes Mal eine andere; die Zählung steht unter dem Text.',
    },
    topCorners: {
      titel: 'Ecken setzen',
      einstieg:
        'Die Kanten oben stehen, und mit ihnen beide unteren Schichten; es fehlen die vier Ecken. Diese Lektion bringt sie an ihren Platz und dreht sie nicht. Manche werden danach verdreht dastehen, und das ist kein Fehler, sondern genau die Lage, auf der die letzte Lektion aufbaut.',
      erklaerung:
        'Eine Ecke steht an ihrem Platz, wenn ihre drei Farben zu den drei Mitten passen, die dort zusammentreffen. Die Ecke mit Gelb, Blau und Orange gehört nach oben hinten rechts, wo die gelbe, die blaue und die orangene Mitte aneinanderstoßen. Wie sie dabei gedreht ist, spielt hier keine Rolle: Ob Gelb nach oben, nach hinten oder nach rechts zeigt, sie steht an ihrem Platz. Diese Unterscheidung ist die ganze Aussage der Lektion, und sie zu übersehen ist der häufigste Grund, an dieser Stelle zu suchen, was gar nicht fehlt.\n\n' +
        'Die Zugfolge {topCorners} vertauscht drei der vier Ecken oben ringförmig und lässt die vierte stehen, nämlich die hinten links. Nachgerechnet dreht sie keine der drei und rührt keine einzige Kante an. Wie bei den Kanten ist die stehende Ecke der Anker, und wie dort genügt eine zweite Anwendung für die Gegenrichtung, weil dreimal angewandt der Ausgangszustand wieder dasteht.\n\n' +
        'Gesucht ist deshalb die Ecke, die schon an ihrem Platz steht, gleich wie sie gedreht ist. Die Zugfolge wird in der Haltung angewandt, in der diese Ecke hinten links liegt; am Bildschirm wandern dafür wieder die Buchstaben mit, F wird R, R wird B, B wird L, L wird F. Anders als bei den Kanten wird hier oben nicht gedreht, und zwar nicht aus Vorsicht, sondern weil es nichts brächte: Die Kanten stehen bereits, und jede Drehung der oberen Ebene nähme sie von ihrem Platz.\n\n' +
        'Steht keine einzige Ecke an ihrem Platz, so sind zwei Paare zu tauschen, und es gibt keinen Anker. Die Folge wird dann einmal in beliebiger Haltung angewandt; danach steht genau eine Ecke, und der Handgriff greift wie sonst. Weil an dieser Stelle alle zwölf Kanten stehen, sind das die einzigen beiden Fälle, die es überhaupt gibt: drei Ecken im Ring, oder zwei Paare über Kreuz.\n\n' +
        'Für denselben Ringtausch gibt es eine kürzere und weiter verbreitete Folge aus acht Zügen. Sie ist hier nicht gewählt, obwohl sie handlicher ist, denn sie dreht die drei Ecken zusätzlich um je eine Drittelumdrehung. Damit wäre die Aussage dieses Schrittes falsch, dass er setzt und nicht dreht, und die Trennung zwischen Setzen und Drehen ginge verloren. Die hier gelernte Form kostet einen Zug mehr und hält die Aussage. In den schnellen Verfahren, die zuerst orientieren und danach setzen, ist die kurze Folge die richtige; welche von beiden passt, entscheidet die Reihenfolge der Schritte und nicht ihre Länge.',
      vorstellung:
        'Eine Ecke bleibt stehen, die anderen drei wandern im Ring. Gesucht ist die Ecke, die schon an ihrem Platz steht, und verdreht darf sie dabei sein.',
      aufgabe:
        'Die Übung legt eine Lage auf, in der die Kanten oben stehen und die Ecken vertauscht sind. Sie ist gelöst, wenn jede Ecke an ihrem Platz steht; verdrehte Ecken sind dabei erlaubt, und das Programm erkennt den Unterschied. Verlangt sind mehrere gelungene Anwendungen aus verschiedenen Ausgangslagen; die Zählung steht unter dem Text.',
    },
    cornerTwist: {
      titel: 'Ecken drehen',
      einstieg:
        'Die letzte Lektion des Weges, und die kürzeste zu beschreibende. Jeder Stein steht an seinem Platz, einige Ecken oben sind nur noch verdreht, und eine einzige Zugfolge dreht sie gerade. Vorweg gehört ein Satz, den keine andere Lektion braucht: Der Würfel sieht zwischendurch zerstört aus.\n\n' +
        'Das ist kein Fehler, sondern das Verfahren. Von den zwanzig beweglichen Steinen stehen zwischen den Anwendungen zeitweise nur noch zwei, und alles kehrt zurück, sobald die letzte Ecke gerade steht. Genau hier hören die meisten auf, kurz bevor sie fertig sind. Damit der Blick nicht an der Unordnung hängen bleibt, zeigt die Anzeige in dieser Lektion allein die Arbeitsstelle; alles Übrige tritt zurück.',
      erklaerung:
        'Zu suchen sind die Ecken oben, deren gelbe Fläche noch nicht nach oben zeigt. Ihre Zahl ist nicht beliebig: Es sind zwei, drei oder vier, niemals eine einzige. Dahinter steht derselbe Erhaltungssatz, aus dem sich später auch die Unordnung wieder auflöst, denn die Drehungen aller acht Ecken ergeben zusammen immer ein Vielfaches einer ganzen Umdrehung. Bei einem zufällig verwürfelten Würfel steht an dieser Stelle in gut einem Drittel der Fälle bereits alles; in der Übung ist immer etwas zu tun.\n\n' +
        'Gearbeitet wird an einer einzigen Stelle, der Ecke oben vorn rechts. Sie ist die, die in der Anzeige stehen bleibt. Die Zugfolge {cornerTwist} dreht die Ecke, die dort liegt, und rührt keine andere Ecke und keine Kante der oberen Schicht an. Zwei Anwendungen drehen sie um eine Drittelumdrehung, vier um zwei Drittel; angewandt wird, bis ihre gelbe Fläche nach oben zeigt. Nach einer ungeraden Zahl von Anwendungen steckt die Ecke unten, deshalb kommen nur gerade Zahlen in Betracht.\n\n' +
        'Wer die erste Schicht gebaut hat, kennt diese vier Züge bereits. Es ist dieselbe Folge wie in Lektion 3, an der waagerechten Achse gespiegelt. Dort öffnet die vordere Seite die Lücke unten, die obere Ebene legt die Ecke hinein, und beides schließt sich wieder. Hier öffnet die rechte Seite, und die untere Ebene ist die Ablage. Sie spielt damit die Rolle, die vorher die obere hatte: Sie ist die Werkbank, und auf einer Werkbank liegt es unordentlich.\n\n' +
        'Steht die Ecke richtig, wird die obere Ebene gedreht, bis die nächste verdrehte Ecke vorn rechts liegt, und die Folge beginnt von vorn. Sonst wird nichts gedreht. Diese eine Regel ist der ganze Handgriff, und wer sie befolgt, kann den Würfel mit dieser Folge nicht verlieren.\n\n' +
        'Zuletzt wird die obere Ebene so weit zurückgedreht, wie sie zwischendurch bewegt worden ist. Erst dieser eine Zug bringt den Würfel zurück: Vorher stehen zwölf der zwanzig Steine, danach alle zwanzig. Wer sich verzählt, verliert dabei nichts, denn sechs Anwendungen hintereinander führen genau auf die Ausgangslage zurück.\n\n' +
        'Andere Anleitungen führen an dieser Stelle eine kürzere Folge aus sieben Zügen, die nur die obere und die rechte Seite braucht und die unteren Schichten nie anfasst. Hier wäre sie trotzdem falsch, und der Grund ist nicht ihre Länge: Nachgerechnet vertauscht sie drei Kanten und alle vier Ecken der oberen Ebene. Auf diesem Weg stehen beide bereits, und sie zerstörte damit die Arbeit der zwei vorigen Lektionen. Die schnellen Verfahren drehen zuerst und setzen danach; dort steht noch nichts, was sie zerstören könnte, und dort ist sie die richtige Wahl. Welche Folge passt, entscheidet also die Reihenfolge der Schritte und nicht ihre Länge.',
      vorstellung:
        'Die obere Schicht wird nie gedreht, außer um die nächste Ecke an die Arbeitsstelle zu bringen. Alles Übrige heilt sich selbst.',
      aufgabe:
        'Die Übung legt eine Lage auf, in der jeder Stein an seinem Platz steht und zwei bis vier Ecken oben verdreht sind. Sie ist gelöst, wenn der Würfel gelöst ist. Zum ersten Mal auf diesem Weg ist das Ziel der Lektion zugleich das Ziel des Ganzen. Verlangt sind mehrere gelungene Anwendungen aus verschiedenen Ausgangslagen; die Zählung steht unter dem Text.',
    },
    solveAlone: {
      titel: 'Der ganze Weg',
      einstieg:
        'Die letzte Lektion bringt nichts Neues. Alle sechs Zugfolgen sind gelernt, alle sieben Schritte sind erklärt, und was hier hinzukommt, ist allein die Aufgabe, sie ohne Anleitung anzuwenden: drei verwürfelte Würfel nacheinander.\n\n' +
        'Die Schwierigkeit liegt jetzt woanders als in den Lektionen davor. Dort war der Schritt vorgegeben und die Ausgangslage dazu aufgelegt; hier steht ein beliebig verwürfelter Würfel, und die einzige Frage ist, welcher Schritt an der Reihe ist. Das Programm beantwortet sie nicht mehr von selbst. Eine Hilfe gibt es, aber nur auf Abruf, und sie nennt den Schritt und nicht die Züge.',
      erklaerung:
        'Der Weg besteht aus sieben Schritten in fester Reihenfolge: das weiße Kreuz unten aus Lektion 2, die vier weißen Ecken aus Lektion 3, die vier Kanten der Mittelschicht aus Lektion 4, das gelbe Kreuz oben aus Lektion 5, die Kanten der letzten Schicht an ihren Platz aus Lektion 6, die Ecken an ihren Platz aus Lektion 7, und zuletzt die Ecken gerade gedreht aus Lektion 8.\n\n' +
        'Diese Reihenfolge ist keine Gewohnheit, sondern eine Bedingung. Jeder Schritt setzt voraus, was der vorige hergestellt hat, und lässt es unangetastet: Die Folge der zweiten Schicht arbeitet über der fertigen ersten, die Folgen der letzten Schicht arbeiten über beiden. Wer einen Schritt vorzieht, zerlegt damit den, der ihm vorausgeht.\n\n' +
        'Zu erkennen, wo man steht, geht deshalb von unten nach oben, und zwar mit sechs Fragen. Steht das weiße Kreuz unten? Steht die erste Schicht vollständig, also auch ihre vier Ecken? Sitzen die vier Kanten der Mittelschicht an ihrem Platz? Zeigen alle vier Kanten oben ihre gelbe Fläche nach oben? Passen deren zweite Farben zu den Mitten darunter? Steht jede Ecke oben an ihrem Platz, gleich wie sie gedreht ist? Die erste Frage, die mit Nein zu beantworten ist, nennt den Schritt, der an der Reihe ist; wird keine mit Nein beantwortet, fehlt allein noch das Drehen der Ecken.\n\n' +
        'Genau diese Frage beantwortet auch die Hilfe unter dem Text. Sie nennt die Nummer des Schrittes, seinen Namen und die Lektion, in der er steht. Die Zugfolge selbst zeigt sie nicht, denn dort steht sie samt ihrer Erklärung, und wer sie hier vorgesetzt bekäme, hätte sie beim nächsten Würfel wieder vergessen. Ihre Antwort gilt für die Lage, die in diesem Augenblick auf dem Tisch liegt, und verschwindet deshalb beim nächsten Zug.\n\n' +
        'Verlieren lässt sich dabei nichts. Jeder Zug ist zurückzunehmen, und auch ein gründlich zerlegter Würfel bedeutet nur, dass ein früherer Schritt wieder an der Reihe ist; von jeder Lage aus führt derselbe Weg zum Ziel. Wer sich festgefahren hat, verlangt eine neue Lage und fängt diesen einen Durchgang von vorn an.\n\n' +
        'Ein Wort zum Umfang, damit die Zahl der Züge nicht erschreckt. Eine vollständige Lösung nach diesem Verfahren braucht im Mittel 107 Züge, im günstigsten gemessenen Fall 63 und im ungünstigsten 139. Wer zum ersten Mal allein löst, braucht mehr, weil er zwischendurch nachsieht und den einen oder anderen Zug zurücknimmt. Gezählt wird hier nicht die Zahl der Züge, sondern der gelöste Würfel.',
      vorstellung:
        'Nicht nach einer Lösung suchen, sondern fragen, welcher Schritt an der Reihe ist. Der Weg läuft immer von unten nach oben, und gelöst wird der Zauberwürfel nicht in einem Einfall, sondern in sieben Antworten auf dieselbe Frage.',
      aufgabe:
        'Die Übung verwürfelt den Würfel und tritt zurück. Sie ist gelöst, wenn der Würfel gelöst ist; das Programm erkennt es selbst und zählt den Durchgang. Verlangt sind drei gelöste Würfel nacheinander, und damit ist der Lernpfad zu Ende. Ein aufgegebener Durchgang zählt nicht mit, kostet aber auch nichts: Die bereits gelösten bleiben gezählt.\n\n' +
        'Wer ein eigenes Stück besitzt, sollte spätestens jetzt danach greifen. Am Bildschirm bleibt der Würfel liegen und die Buchstaben wandern mit der Haltung; in der Hand wird stattdessen der ganze Würfel gedreht, bis die Arbeitsstelle vorn rechts liegt. Das ist der einzige Unterschied zwischen beidem, und in der Hand ist er der leichtere Weg. Alles Übrige ist dasselbe.',
    },
  },
};
