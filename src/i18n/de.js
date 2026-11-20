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
    uebergang: 'Übergang',
    anfaengerverfahren: 'Anfängerverfahren',
    cfop: 'CFOP',
    training: 'Training',
    zeitnahme: 'Zeitnahme',
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
      'Für einen Würfel, den das Programm nicht selbst verwürfelt hat: Sein Zustand wird Feldchen für Feldchen auf das Netz übertragen.',
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
    // Der freie Einstieg, 4T-0207. **Die Rückfrage nennt die Folge für den
    // Fortschritt**, denn genau sie unterscheidet den Einstieg vom Blättern:
    // Übersprungen ist nicht abgeschlossen, und der Anwender soll das vorher
    // wissen und nicht erst an der Zählung bemerken.
    einsteigen: 'Hier einsteigen',
    einsteigenWirklich:
      'Die noch offenen Lektionen vor dieser gelten danach als übersprungen und nicht als abgeschlossen. Was schon abgeschlossen ist, bleibt es. Hier einsteigen?',
    eingestiegen: 'Übersprungen, worauf diese Lektion aufbaut: {liste}. Die Übung ist jetzt frei.',
    anwendungen: '{getan} von {verlangt} gelungenen Anwendungen',
    abgeschlossen: 'Diese Lektion ist abgeschlossen.',
    uebersprungen: 'Diese Lektion ist übersprungen. Sie lässt sich jederzeit nachholen.',
    bisher: 'Bisher {stand}.',
    // **Der Satz nennt den Weg**, seit 4T-0207. Er sagte bis dahin nur, wann die
    // Lektion frei wird, und an einer gesperrten Stelle war keine Bedienung zu
    // sehen, die das änderte.
    gesperrt:
      'Diese Lektion wird frei, sobald die vorige steht, oder sofort mit «Hier einsteigen».',
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
  // Die Bedienung des Übergangs zum Verfahren CFOP, aus 4T-0120.
  //
  // **Ein eigener Zweig neben `pfad` und nicht darin.** Gemessen nennen elf der
  // 31 Bausteine von `pfad` das Wort Lektion, in beiden Sprachen dieselben elf,
  // darunter die Zählung, beide Nachbarn und alle drei Zustandssätze. Sie so zu
  // weiten, dass eine Stufe hindurchpasst, machte sie unbestimmter, ohne einen
  // einzigen Baustein zu sparen.
  //
  // Der Zweig trägt allein die Bedienung. Was eine Stufe inhaltlich ist, steht
  // in `stufe`, und was ein Fall ist, in `fall`. Dieselbe Trennung wie zwischen
  // `pfad` und `lektion`, und aus demselben Grund: Ein Bedientext unter einem
  // dynamisch angesprochenen Zweig könnte unbemerkt verwaisen.
  // Das Karteikarten-Training, 4T-0138. Ein eigener Zweig und keine Erweiterung
  // von `uebergang`: Dort geht es um den Weg durch die vier Stufen, hier um das
  // Üben an ihren Fällen. Geliehen wird allein `uebergang.zaehlung` für den
  // vorgelesenen Namen eines Segments, weil «Stufe 1» dort schon steht.
  training: {
    stufeMarke: 'Aus welcher Stufe',
    formMarke: 'Was geübt wird',
    // Die beiden Übungsformen aus `lessons/exercise.js`, angesprochen über
    // training.form.${kennung}. **Die Trennung ist eine Anforderung der Phase**
    // und keine Verfeinerung: Ein Übungsmodus, der beides in einem Durchgang
    // prüft, sagt bei einem Fehler nicht, woran es lag.
    form: {
      recognition: 'Erkennen',
      execution: 'Ausführen',
    },
    // Der Zustand steht im vorgelesenen Namen und nicht nur in der Darstellung.
    // Ein abgeschaltetes Segment ist für die Vorlesehilfe sonst nur ein
    // Segment, das sich nicht drücken lässt, und der Grund bliebe offen.
    frei: 'frei',
    nochGesperrt: 'noch gesperrt',
    // Was die Wahl bewirkt, bevor der erste Druck fällt. Die Übung darunter
    // ist seit 4T-0139 ihre zweite Wirkung.
    umfang: '{titel} · {faelle} Fälle hinterlegt',
    // Die Erkennungsübung, 4T-0139. **Drei Beschriftungen für eine
    // Schaltfläche**, weil sie drei Sachen tut: anfangen, überspringen,
    // weitermachen.
    aufgabeStellen: 'Aufgabe stellen',
    andereAufgabe: 'Andere Aufgabe',
    naechsteAufgabe: 'Nächste Aufgabe',
    // Die Frage steht über den Namen und wird zugleich der vorgelesene Name
    // ihrer Gruppe. Ohne sie wären die Schaltflächen eine Liste ohne Anlass.
    frage: 'Welcher Fall liegt vor?',
    // Die Ausführungsübung, 4T-0141. **Die Aufforderung nennt den Fall**, denn
    // wer eine Zugfolge ausführen soll, muss wissen, welche. Sie steht an
    // derselben Stelle wie die Frage der Erkennung: Beide sagen, was zu tun
    // ist, und zwei Stellen dafür liefen einander davon.
    auftrag: 'Führe die Zugfolge aus für: {name}',
    // **Die Schaltfläche sagt, was sie tut, und nicht, was danach kommt.**
    // «Lösung zeigen» wäre der falsche Name: Sie bucht einen Fehlversuch, und
    // die Folge zeigt sie erst mit dem nächsten Task.
    aufgeben: 'Aufgeben',
    // **Der Name steht in jedem Urteil.** Bei einem Fehler ist er die
    // Auskunft, die zählt; bei einem Treffer bestätigt er, worauf der Anwender
    // getippt hat.
    richtig: 'Richtig: {name}',
    falsch: 'Nicht getroffen. Richtig war: {name}',
    // Die beiden Urteile der Ausführung, 4T-0141. Sie sind eigene Bausteine
    // und keine Wiederverwendung der beiden darüber: «Nicht getroffen» spräche
    // von einer Benennung, die hier niemand vorgenommen hat, und der Fall war
    // von Anfang an genannt.
    geschafft: 'Geschafft: {name}',
    aufgegeben: 'Aufgegeben. Der Versuch zählt als Fehlversuch: {name}',
    // Die Auskunft nach einem aufgegebenen Versuch, 4T-0142. **Zwei Marken und
    // keine Sätze**, denn was folgt, ist die Sache selbst: erst die Zugfolge in
    // Notation, dann der Absatz, der die Ausrichtung davor beschreibt.
    folgeMarke: 'Die Zugfolge',
    ausrichtungMarke: 'So wird vorher ausgerichtet',
    // **Die Schaltfläche sagt, was sie tut.** Sie legt dieselbe Lage noch einmal
    // auf und zählt einen neuen Versuch; «Wiederherstellen» spräche von der Lage
    // und verschwiege den Versuch.
    wiederholen: 'Noch einmal versuchen',
    // Die Merkmale nach einem Fehler, 4T-0140, angesprochen über
    // training.merkmal.${rolle}. **Beide nennen den Namen mit**, obwohl das
    // Urteil darüber den gesuchten schon nennt: Ohne ihn wären es zwei Absätze
    // ohne Zuordnung, und gerade ihre Gegenüberstellung ist der Nutzen.
    //
    // **Anredefrei**, wie der Bestand es überwiegend hält. «Die gegebene
    // Antwort» sagt dasselbe wie «Ihre Antwort» und passt zu beiden Anreden,
    // die im Sprachbaum je zweimal vorkommen.
    merkmal: {
      gesucht: 'Der gesuchte Fall: {name}',
      genannt: 'Die gegebene Antwort: {name}',
    },
    // Die Messwerte je Fall, 4T-0143. **Die Marke fragt nach dem Stand und
    // nennt nicht die Größe**, denn danach sucht der Anwender: Er will wissen,
    // wo er steht, und nicht, welche Zahl das Programm führt.
    messwerteMarke: 'Wie sicher sitzt jeder Fall',
    // **Die Erklärung ist nötig, weil die Zelle kurz ist.** Zwei Zahlen mit
    // einem Schrägstrich sind ohne sie eine Schreibweise zum Erraten.
    messwerteErklaerung:
      'Die erste Zahl nennt die Versuche, die zweite davon die Fehlversuche. Aufgeben zählt als Fehlversuch.',
    messwerteFall: 'Fall',
    // Der vorgelesene Name einer Zelle, denn «3 / 1» liest die Vorlesehilfe
    // als drei Schrägstrich eins.
    //
    // **Der Wortlaut steht vor der Zahl und nicht dahinter**, und das ist keine
    // Geschmacksfrage: Nachgestellt verlangte er den richtigen Numerus, und
    // «1 Versuche, davon 1 Fehlversuche» ist der häufigste Fall überhaupt, denn
    // jeder Fall geht einmal durch ihn hindurch. Vier Bausteine für die vier
    // Kombinationen wären der Preis; vorangestellt stellt sich die Frage nicht.
    messwertGelesen: 'Versuche: {versuche}, Fehlversuche: {fehler}',
    // **Ein nie geübter Fall trägt einen eigenen Wortlaut und keine zwei
    // Nullen**, entschieden vom Product Owner am 2026-09-02: «nie angefasst»
    // und «zweimal versucht, nie gescheitert» sind zwei Zustände.
    messwertLeer: 'noch nicht geübt',
    // Das Zurücksetzen, 4T-0144. **Die Schaltfläche sagt, was sie tut, und
    // nennt den Gegenstand**: «Zurücksetzen» allein ließe offen, ob es die
    // Zahlen sind oder der Lernfortschritt.
    zuruecksetzen: 'Messwerte zurücksetzen',
    // Der Zustand steht im vorgelesenen Namen, wie bei den Segmenten der
    // Stufenwahl. Eine gesperrte Schaltfläche sagt für sich nicht, warum.
    zuruecksetzenBereit: 'setzt die Zahlen dieser Stufe zurück',
    zuruecksetzenLeer: 'nichts zurückzusetzen, hier ist noch nichts geübt',
    // **Die Rückfrage nennt den Umfang und die Zusage.** Sie nennt die Stufe,
    // damit niemand die Zahlen einer anderen verliert, und sie sagt zu, dass
    // der Lernfortschritt bleibt; sonst wäre sie von «Fortschritt löschen»
    // nicht zu unterscheiden.
    zuruecksetzenWirklich:
      'Die Messwerte der Stufe «{titel}» werden für beide Übungsformen gelöscht. Der Lernfortschritt bleibt erhalten, also welche Fälle bereits gelungen sind. Fortfahren?',
    gesperrt:
      'Zum Üben ist noch keine Stufe frei. Die erste wird frei, sobald der Lernpfad abgeschlossen oder übersprungen ist, oder sofort mit «Hier einsteigen» im Übergang.',
    // Warum hier zwei Stufen stehen und im Übergang vier. Der Satz sagt
    // zugleich etwas Richtiges über die beiden anderen und nicht nur, dass sie
    // fehlen.
    nurFaelle:
      'Geübt wird aus den Stufen, für die Fälle hinterlegt sind. Die übrigen sind Denkweisen und werden am Würfel geübt.',
  },

  // Der Bereich der Zeitnahme, 4T-0147.
  zeitnahme: {
    // Das Zeichen zwischen Sekunde und Bruchteil. **Es steht im Sprachbaum und
    // nicht in der Rechnung**, denn es ist eine Sprachfrage: Im Deutschen
    // trennt das Komma, im Englischen der Punkt.
    trenner: ',',
    // Die beiden Wege, benannt nach dem Stück, an dem gemessen wird. **Ein
    // Wortlaut für beide Stellen**, die Schaltfläche und die Marke über der
    // laufenden Uhr; ein zweiter liefe dem ersten davon.
    weg: {
      screen: 'Am Bildschirm',
      ownCube: 'Am eigenen Würfel',
    },
    los: 'Los',
    // **Nicht «Los»**, denn der steht schon für den Beginn des Durchgangs. Zwei
    // Griffe mit demselben Wort an derselben Stelle wären eine Bedienung, die
    // man ausprobieren muss.
    jetzt: 'Jetzt starten',
    fertig: 'Fertig',
    abbrechen: 'Abbrechen',
    // Was im großen Zahlenfeld steht. **Die verstrichene Zeit nackt, die
    // verbleibende mit ihrer Einheit**: Jene wächst und ist als Uhr zu lesen,
    // diese ist eine Frist, und «15» allein ließe offen, worin sie zählt.
    uhrWert: {
      verstrichen: '{zeit}',
      verbleibend: '{zeit} s',
    },
    // Der vorgelesene Name des Feldes. Es zeigt eine nackte Zahl, und ohne ihn
    // sagte die Vorlesehilfe beim Anspringen «12,3» und sonst nichts. **Er
    // wechselt mit der Art**, denn dieselbe Stelle zeigt in der Inspektion die
    // verbleibende Frist, und «Verstrichene Zeit» wäre dort das Gegenteil.
    uhrMarke: {
      verstrichen: 'Verstrichene Zeit',
      verbleibend: 'Verbleibende Inspektionszeit',
    },
    // **Die Zeit nennt ihren Weg**, und das verlangt AK6 von S-0029: Zeiten am
    // Bildschirm und am eigenen Würfel werden getrennt ausgewiesen. Eine nackte
    // Zahl ließe zwei Durchgänge nebeneinander stehen, als wären sie
    // vergleichbar.
    //
    // **Keine Numerusform.** Die Zeit ist eine Dezimalzahl mit fester Einheit;
    // damit fällt der Fall, der im Bestand am häufigsten war, hier gar nicht
    // erst an.
    ergebnis: '{weg}: {zeit} s',
    // Das Gebietskennzeichen für Datum und Uhrzeit, 4T-0153. **Es steht hier
    // und nicht in der Rechnung**, aus demselben Grund wie der Trenner
    // darüber: Wie ein Datum geschrieben wird, ist eine Sprachfrage.
    gebiet: 'de-DE',
    // Der Verlauf, 4T-0153. **«Meine Zeiten» und nicht «Verlauf»**, denn
    // «Verlauf» trägt in diesem Programm schon die Folge der Züge mit
    // Zurücknehmen und Wiederherstellen.
    verlaufMarke: 'Meine Zeiten',
    // **Die Erklärung sagt, warum getrennt gerechnet wird**, und nicht, was
    // eine Bestzeit ist. Ohne sie sähe die Aufteilung nach zwei Listen
    // desselben Gegenstands aus.
    verlaufErklaerung:
      'Beide Wege werden getrennt geführt. Eine Zeit am Bildschirm und eine am eigenen Würfel sind nicht vergleichbar.',
    verlaufLeer: 'Auf diesem Weg ist noch kein Versuch gemessen.',
    verlaufBestzeit: 'Bestzeit',
    verlaufSchnitt: 'Schnitt aus {fenster}',
    // **Ein Durchschnitt mit zu wenigen Versuchen ist kein Wert.** Das Vorbild
    // ist «noch nicht geübt» im Training, und der Grund ist derselbe: Eine
    // Zahl, die «Schnitt aus 12» heißt und über vier Versuche läuft, belügt den
    // Anwender.
    verlaufKeinWert: 'noch zu wenige Versuche',
    // Eine abgelegte Zeit mit ihrer Einheit. **Derselbe Baustein für die
    // Kennzahlen und die Liste**; ein zweiter liefe dem ersten davon.
    verlaufZeit: '{zeit} s',
    verlaufSpalte: {
      nummer: 'Versuch',
      zeit: 'Zeit',
      zeitpunkt: 'Zeitpunkt',
    },
    // Der vorgelesene Name einer Zeile. **Er steht an der Zelle mit der Zeit**,
    // wie bei den Messwerten je Fall: Eine Reihe aus drei Zahlen liest die
    // Vorlesehilfe sonst als drei Zahlenkolonnen.
    verlaufGelesen: 'Versuch {nummer}: {zeit} s, gemessen am {zeitpunkt}',
    // Der vorgelesene Name der Bestzeit. **Sie nennt ihren Durchgang**, denn
    // sie wird über alle abgelegten Versuche gerechnet und kann älter sein als
    // die Liste darunter.
    verlaufBestzeitGelesen: 'Bestzeit {zeit} s, Versuch {nummer}, gemessen am {zeitpunkt}',
    // **Die Gesamtzahl und nicht die Differenz.** Wer zwölf Zeilen sieht und
    // vierzig gemessen hat, will die vierzig wissen und nicht die
    // achtundzwanzig, die fehlen.
    verlaufMehr: 'Angezeigt sind die letzten {gezeigt} von {gesamt} gemessenen Versuchen.',
    // Das Verwerfen, 4T-0154. **Ein Wort und kein Satz**, denn der Griff steht
    // zwölfmal untereinander; welchen Versuch er trifft, sagt der vorgelesene
    // Name darunter.
    verlaufVerwerfen: 'verwerfen',
    verlaufVerwerfenGelesen: 'Versuch {nummer} verwerfen',
    // **Kein Numerus im Wortlaut.** «Alle Zeiten» spricht vom Bestand und
    // nicht von einer Zahl; damit fällt der Fall gar nicht erst an.
    verlaufLoeschen: 'Alle Zeiten löschen',
    // Die Ankündigung nennt ihren Gegenstand beim Namen, wie beim Löschen des
    // Fortschritts und beim Zurücksetzen der Messwerte. **Sie nennt auch, was
    // bleibt**, denn der Lernfortschritt hängt nicht an den Zeiten.
    verlaufLoeschenWirklich:
      'Alle gemessenen Zeiten löschen, auf beiden Wegen? Bestzeit und Durchschnitte sind danach fort. Der Lernfortschritt bleibt.',
    verlaufLoeschenBereit: 'löscht die gemessenen Zeiten beider Wege',
    verlaufLoeschenLeer: 'gesperrt, weil noch kein Versuch gemessen ist',
    // Der Hinweis hängt am Schritt und am Weg. **Die beiden Wege verlangen
    // Verschiedenes:** Am Bildschirm hält die Uhr von selbst an, am eigenen
    // Würfel drückt der Anwender. Ein Hinweis für beide träfe keinen.
    hinweis: {
      bereit: 'Die Wahl des Weges verwürfelt den Würfel und stellt den Durchgang bereit.',
      fertig: 'Ein neuer Durchgang beginnt mit der Wahl des Weges.',
      vorbereitet: {
        screen: 'Die Lage steht. «Los» startet die Uhr.',
        ownCube:
          'Die Verwürfelung steht in Notation unter den Zugtasten. Erst am eigenen Würfel nachstellen, dann «Los».',
      },
      // Die Inspektionszeit, 4T-0148. **Keine Zahl im Satz**, obwohl die Frist
      // eine ist: Sie steht im Zahlenfeld darüber, und ein Satz mit Zahl
      // verlangte vier Bausteine je Sprache oder eine falsche Numerusform.
      inspektion: {
        screen: 'Sieh dir die Lage an. Die Uhr startet von selbst, «Jetzt starten» sofort.',
        ownCube:
          'Nimm den Würfel in die Hand und sieh dir die Lage an. Die Uhr startet von selbst, «Jetzt starten» sofort.',
      },
      laeuft: {
        screen: 'Die Uhr hält von selbst an, sobald der Würfel gelöst ist.',
        ownCube: '«Fertig» hält die Uhr an.',
      },
    },
  },

  uebergang: {
    zaehlung: 'Stufe {nummer}',
    stand: '{abgeschlossen} von {gesamt} abgeschlossen',
    vorige: 'Vorige Stufe',
    naechste: 'Nächste Stufe',
    ueben: 'Übung beginnen',
    uebenNeu: 'Neue Übungslage',
    ueberspringen: 'Überspringen',
    einsteigen: 'Hier einsteigen',
    abgeschlossen: 'Diese Stufe ist abgeschlossen.',
    uebersprungen: 'Diese Stufe ist übersprungen. Sie lässt sich jederzeit nachholen.',
    bisher: 'Bisher {stand}.',
    // **Zwei Sätze und nicht einer**, seit 4T-0207. Die erste Stufe baut auf dem
    // Lernpfad auf und nicht auf einer vorigen Stufe, und ihr den gemeinsamen
    // Satz zu geben hieß, auf etwas zu verweisen, das es nicht gibt. Gefunden
    // im Abnahmelauf vom 2026-09-08. Angesprochen über
    // uebergang.gesperrt.${gesperrtDurch}.
    gesperrt: {
      lernpfad:
        'Diese Stufe wird frei, sobald der Lernpfad abgeschlossen oder übersprungen ist, oder sofort mit «Hier einsteigen».',
      stufe: 'Diese Stufe wird frei, sobald die vorige steht, oder sofort mit «Hier einsteigen».',
    },
    // Die Zustände der Übersicht, angesprochen über uebergang.zustand.${zustand}.
    zustand: {
      abgeschlossen: 'abgeschlossen',
      uebersprungen: 'übersprungen',
      offen: 'offen',
      gesperrt: 'gesperrt',
    },
    // Die beiden Maße aus Abschnitt 11.7 des Didaktik-Konzepts, nebeneinander,
    // weil sie Verschiedenes zählen: Fälle sind Bilder, die man erkennt,
    // Anwendungen sind Durchgänge, die man übt.
    deckung: '{getan} von {verlangt} Fällen gelungen',
    anwendungen: '{getan} von {verlangt} gelungenen Anwendungen',
    deckungMarke: 'Die Fälle dieser Stufe',
    // Der Stand je Fall steht im vorgelesenen Namen und nicht nur in der
    // Darstellung. Ohne ihn wäre die Liste für eine Vorlesehilfe eine Liste aus
    // Namen und sonst nichts.
    fallGelungen: 'gelungen',
    fallFehlt: 'fehlt noch',
    // Die Zugfolge steht auf der Schaltfläche und nicht dahinter. Zu lernen ist
    // sie selbst, und wer sie erst nach einem Druck zu sehen bekäme, lernte den
    // Druck und nicht die Folge.
    vorfuehren: 'Vorführen: {folge}',
    vorfuehrenAlternative: 'Alternative: {folge}',
    ohneFall: 'An dieser Lage findet diese Stufe nichts zu tun.',
    // Die Wahl der Fassung, 4T-0171. **Die Marke steht hier und die Wahl bei
    // der Stufe**, seit 4T-0196: Dass es einen Umfang gibt, gilt allen Stufen;
    // was die beiden Umfänge sind, ist je Stufe verschieden. Die Bausteine
    // `fassung`, `fassungGewinn` und `rueckfall` stehen deshalb unter
    // `stufe.<Bezeichner>`.
    fassungMarke: 'Der Umfang dieser Stufe',
    // Der Fall wird zurückgehalten, solange im Training eine Erkennungsübung
    // läuft, 4T-0139. **Ein anderer Satz als der darüber**, denn hier gibt es
    // sehr wohl einen Fall; er wird nur nicht genannt.
    verdeckt: 'Während einer Übungsaufgabe bleibt der Fall hier verborgen.',
    // Die Rückmeldungen der Bedienung, 4T-0121. Sie stehen hier und werden
    // nicht aus `pfad` geliehen: Jede von jenen spricht von einer Lektion, und
    // elf der 28 Bausteine dort nennen das Wort ausdrücklich.
    ueberspringenWirklich:
      'Die Stufe gilt danach nicht als abgeschlossen, gibt die folgende aber frei. Fortfahren?',
    // Der freie Einstieg, 4T-0207. **Die Rückfrage nennt den Lernpfad
    // ausdrücklich**, denn wer bei einer Stufe einsteigt, überspringt auch die
    // noch offenen Lektionen, und das ist aus dem Bereich des Übergangs heraus
    // nicht zu sehen.
    einsteigenWirklich:
      'Was vor dieser Stufe noch offen ist, gilt danach als übersprungen und nicht als abgeschlossen, auch Lektionen des Lernpfads. Was schon abgeschlossen ist, bleibt es. Hier einsteigen?',
    eingestiegen: 'Übersprungen, worauf diese Stufe aufbaut: {liste}. Die Übung ist jetzt frei.',
    begonnen: 'Die Übungslage steht. Drehe den Würfel, bis das Ziel erreicht ist.',
    geschafft: 'Geschafft. {getan} von {verlangt} Anwendungen.',
    // **Der einzige ohne Vorbild im Lernpfad.** Bei einer Fallmenge zählt nicht
    // der wievielte Durchgang es war, sondern welcher Fall dazugekommen ist;
    // eine Zahl allein sagte dem Anwender nicht, was er als Nächstes üben soll.
    fallGeschafft: 'Geschafft: {fall}. {getan} von {verlangt} Fällen gelungen.',
    fertig: 'Geschafft. Diese Stufe ist abgeschlossen.',
    wegFertig: 'Geschafft. Der ganze Übergang ist abgeschlossen.',
    freigegeben: 'Geschafft. Frei ist jetzt Stufe {nummer}, {name}.',
    bautAufDiese: 'Darauf bauen auf: {liste}.',
  },

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
    // Der Satz für die sechsunddreißig Züge aus 2A-0016, seit 4T-0100. Sie
    // haben keine einzelne Seite, deshalb nennt er die Art der Schicht und die
    // Fläche, von der aus die Drehung gesehen wird. Ohne diese Angabe bliebe
    // «im Uhrzeigersinn» bei einer Mittelschicht ohne Bezug.
    klartextErweitert: '{art}, {richtung}, gesehen von {bezug}',
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

  // Die drei Zugarten jenseits der Flächendrehung und die sechs Blicke auf
  // sie, seit 4T-0100. Sie stehen neben `seite` und nicht darin: Eine mittlere
  // Schicht ist keine Seite, und «obere Seite» wäre für sie schlicht falsch.
  zugart: {
    mittel: 'mittlere Schicht',
    doppel: 'Doppelschicht',
    ganz: 'ganzer Würfel',
  },

  // Dieselben sechs Flächen als Blickrichtung. Der Satz lautet «gesehen von
  // links», und «gesehen von der linken Seite» wäre dieselbe Aussage in
  // umständlicher.
  seiteAus: {
    U: 'oben',
    R: 'rechts',
    F: 'vorn',
    D: 'unten',
    L: 'links',
    B: 'hinten',
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
    inspektion: 'Inspektionszeit',
    ton: 'Ton',
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
    inspektion:
      'Beim Üben stört eine Wartezeit, beim Nachstellen des Wettkampfablaufs gehört sie dazu.',
    // Der Wortlaut nennt beide Signale. Wer nicht weiß, wann es klingt, schaltet
    // einen Ton nicht ein, dessen Vorgabe «aus» ist.
    ton: 'Zwei Signale bei der Zeitnahme: wenn die Uhr zu laufen beginnt und wenn der Würfel gelöst ist.',
  },

  wert: {
    palette: { kanonisch: 'Kanonisch', alternativ: 'Für Farbfehlsichtigkeit' },
    kennzeichnung: { aus: 'Aus', an: 'An' },
    bewegung: { aus: 'Aus', langsam: 'Langsam', mittel: 'Mittel', schnell: 'Schnell' },
    ansicht: { raeumlich: 'Räumlich', netz: 'Flaches Netz' },
    schriftgroesse: { klein: 'Klein', normal: 'Normal', gross: 'Groß', sehrGross: 'Sehr groß' },
    sprache: { de: 'Deutsch', en: 'English' },
    // **Kurz und mit Einheitszeichen**, und das ist gemessen: Ausgeschrieben
    // läuft die Segmentreihe im schmalen Fenster um 22 px über und wird
    // zweizeilig. Worin gezählt wird, sagt der Name des Feldes darüber.
    inspektion: { aus: 'Aus', s15: '15 s', s30: '30 s' },
    ton: { aus: 'Aus', an: 'An' },
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
    // Die beiden Hinweise zur neueren Fassung, 4T-0118.
    //
    // **Sie sagen verschiedene Dinge, weil verschieden gehandelt wird.** Im
    // Speicher wird der Stand gelesen und geschont, die Datei wird abgewiesen.
    // Beide nennen ausdrücklich, was mit dem vorhandenen Stand geschieht; das
    // ist die Frage, die der Anwender in diesem Augenblick hat.
    zuNeu:
      'Der gespeicherte Stand stammt aus einer neueren Fassung dieses Programms. Er bleibt unangetastet, dafür wird in dieser Sitzung nichts gespeichert. Öffne die neuere Fassung, oder hole einen gesicherten Stand aus einer Datei.',
    dateiZuNeu:
      'Diese Datei stammt aus einer neueren Fassung dieses Programms und wurde nicht übernommen. Der vorhandene Stand bleibt unverändert.',
    ueberschreiben: 'Der vorhandene Stand wird durch die Datei ersetzt. Fortfahren?',
    // Das Löschen des Fortschritts, 4T-0084.
    //
    // **Die Rückfrage nennt beides**, was verloren geht und was bleibt. Das
    // Programm hält zwei Dinge ab, Einstellungen und Fortschritt, und eine
    // Schaltfläche für jedes; wer die eine drückt, soll nicht raten müssen, ob
    // sie auch das andere trifft.
    loeschen: 'Fortschritt löschen',
    //
    // **Die gemessenen Zeiten bleiben, und der Satz sagt es**, seit 4T-0150.
    // Entschieden vom Product Owner am 2026-09-03: Zeiten sind kein
    // Lernfortschritt, sondern gemessene Leistung, und der Verlauf bekommt sein
    // eigenes Löschen mit eigener Ankündigung.
    loeschenWirklich:
      'Der gesamte Fortschritt geht dabei verloren: abgeschlossene und übersprungene Lektionen und Stufen, die gelungenen Fälle, die gewählten Fassungen und die Messwerte des Trainings. Die Einstellungen und die gemessenen Zeiten bleiben. Fortfahren?',
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
        // **«und mehr braucht dieser Weg nicht» und nicht «und mehr kennt der
        // Würfel nicht»**, seit 4T-0101. Der frühere Halbsatz war eine Aussage
        // über den Gegenstand und mit dem erweiterten Zugraum unwahr geworden.
        // Die neue Fassung sagt dasselbe über den Weg, bleibt wahr und behält
        // die Wirkung: Der Anfänger soll wissen, dass die Liste vor ihm
        // abgeschlossen ist. Ein Wächter in `test/i18n.test.js` hält die alte
        // Behauptung fern.
        'Sechs Seiten mit je drei Möglichkeiten ergeben achtzehn Züge, und mehr braucht dieser Weg nicht. Sie stehen vollständig auf dem Tastenfeld unter dem Würfel, jeder mit seiner Taste. Eine zweite Tabelle an dieser Stelle könnte davon abweichen und wird deshalb nicht geführt.\n\n' +
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
        'Das ist kein Fehler, sondern das Verfahren. Von den zwanzig beweglichen Steinen stehen mitten in der Zugfolge zeitweise nur noch zwei, und alles kehrt zurück, sobald die letzte Ecke gerade steht und die obere Ebene zurückgedreht ist. Genau hier hören die meisten auf, kurz bevor sie fertig sind. Damit der Blick nicht an der Unordnung hängen bleibt, zeigt die Anzeige in dieser Lektion allein die Arbeitsstelle; alles Übrige tritt zurück.',
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

  // Die Worte zu den Fällen von CFOP, angesprochen über `textKeyFor` in
  // `lessons/cases.js`. Drei Bausteine je Fall, festgelegt in 4T-0112 und dort
  // begründet; die Liste steht in `CASE_TEXTS` und nicht hier.
  //
  // **Das Erkennungsbild nennt keine Farbe, sondern zwei gleiche.** Damit
  // trägt es in beiden Paletten, und es trägt in jeder Haltung: Gemessen ist
  // die Zahl der gleichfarbigen Seiten über alle 288 Lagen des Blicks je Fall
  // konstant, während jede Aussage über die Anordnung der Ecken es nicht ist.
  //
  // **Die Kurzbezeichnung der Wettkampfszene wird einmal genannt und erklärt**,
  // wie Abschnitt 11.5 des Didaktik-Konzepts es vorsieht, und danach wird
  // deutsch weitergesprochen.
  // Die vier Stufen des Übergangs, aus 4T-0120.
  //
  // **Heute allein ihre Titel.** Die vier Textbausteine je Stufe entstehen in
  // 3E-0039 und 3E-0040 und werden an der Anzeige geschrieben, die 4T-0120
  // aufstellt. Der Titel steht schon hier, weil der Bereich ohne ihn seinen
  // eigenen Bezeichner anzeigte.
  //
  // **Die Titel nennen Orientieren und Setzen**, wie AK3 von S-0037 es
  // verlangt, und stellen keine zweite Begriffswelt daneben. Die Zahl der
  // Blicke gehört dabei in den Titel und nicht erst in den Text: Sie ist der
  // Gewinn, um den es in diesem Abschnitt des Lernwegs geht.
  stufe: {
    orientLastLayer: {
      titel: 'Orientieren in einem Blick',
      einstieg:
        'Die erste Stufe des Übergangs ordnet die letzte Schicht neu. Das Anfängerverfahren löst sie in vier Schritten: erst das Kreuz oben, dann die Kanten setzen, dann die Ecken setzen, zuletzt die Ecken drehen. CFOP macht daraus zwei Arbeitsgänge, erst orientieren und dann setzen, und diese Stufe ist der erste davon.\n\n' +
        // Die einzige Auflösung des Namens im ganzen Programm, entschieden am
        // 2026-08-28 in 4T-0122. Sie nennt die englischen Wörter, weil die vier
        // Buchstaben sonst dunkel blieben, und von den Kurzbezeichnungen der
        // Wettkampfszene allein die eigene. Die der Stufen 2 und 3 stehen dort,
        // wo sie hingehören; eine zweite Nennung hier nähme sie ihnen weg.
        'Der Name CFOP nennt die vier Stufen des Verfahrens mit ihren englischen Anfangsbuchstaben: cross ist das Kreuz unten, first two layers sind die ersten beiden Schichten, orientation steht für das Orientieren der letzten Schicht und permutation ihr Setzen. Diese Stufe ist die dritte davon. Die Wettkampfszene kürzt sie OLL ab; hier heißt sie das Orientieren der letzten Schicht, und dabei bleibt es.',
      erklaerung:
        'Orientieren heißt, dass jeder Stein der letzten Schicht seine Oberfarbe nach oben zeigt. Wo er dabei steht, ist gleichgültig; das ordnet der zweite Arbeitsgang. Im Anfängerverfahren ist diese eine Aufgabe auf zwei Lektionen verteilt, die weit auseinanderliegen: Lektion 5 richtet die Kanten aus, Lektion 8 die Ecken, und dazwischen stehen die beiden Lektionen, die setzen. Hier rücken sie zusammen und werden ein Arbeitsgang.\n\n' +
        'Der erste Blick gilt den Kanten, und er ist bekannt. Es sind dieselben drei Bilder, die Lektion 5 zeigt: der Punkt, die Linie und der Winkel. Neu ist allein, dass jedes von ihnen hier seine eigene Zugfolge hat und in einem einzigen Durchgang zum Kreuz führt, statt zunächst das nächste Bild zu erzeugen. Bei der Linie ist es dieselbe Folge wie dort; für den Punkt und den Winkel kommt je eine neue dazu.\n\n' +
        // Die Einstufung «gelernt» aus Abschnitt 11.4 wird hier ausgesprochen
        // und nicht umschrieben. Ein Text, der mehr behauptet, wäre eine
        // unwahre Aussage über das Verfahren.
        'Der zweite Blick gilt den Ecken, und er wird gelernt und nicht erklärt. Abzulesen ist, welche von ihnen ihre Oberfarbe schon nach oben zeigen und wohin die übrigen weisen; mehr sagt das Bild nicht, und mehr braucht es auch nicht. Zu jedem Bild gehört eine Zugfolge, und welche zur vorliegenden Lage passt, nennt die Anzeige. Warum diese Folge diese Ecken dreht, lässt sich nicht in einem Satz sagen; wer den Grund sucht, findet ihn nicht, und das ist keine Lücke dieser Anleitung.\n\n' +
        'An einer Stelle wird eine Aussage des Anfängerverfahrens zurückgenommen, und zwar mit Grund. Lektion 8 verwirft eine kurze und weit verbreitete Folge aus sieben Zügen ausdrücklich: Sie vertauscht drei Kanten und alle vier Ecken der oberen Ebene und macht damit die Arbeit der Lektionen 6 und 7 zunichte. Hier steht oben noch nichts, was sie zerstören könnte, denn gesetzt wird erst danach. Derselbe Eingriff ist dort Schaden und hier Aufgabe, und zwei Folgen dieser Bauart lösen deshalb je einen Fall dieser Stufe. Die ältere Aussage bleibt richtig, denn sie gilt einer anderen Reihenfolge der Schritte.\n\n' +
        'Wer diese Stufe kann und sonst nichts vom Übergang, kommt trotzdem zum Ende. Nach ihr zeigt jeder Stein der letzten Schicht nach oben, und die beiden Folgen aus Lektion 6 und 7 bringen sie an ihren Platz, ohne eine einzige davon wieder zu kippen oder zu drehen. Nachgerechnet gilt das für beide: Keine von ihnen kippt eine Kante oder dreht eine Ecke. Der Übergang lässt sich deshalb Stufe für Stufe gehen und muss nicht am Stück gelernt werden.\n\n' +
        'Zwei Zugfolgen sind es also, erst die für die Kanten und dann die für die Ecken, und jede wird genau einmal angewandt. Im Anfängerverfahren verlangen dieselben beiden Aufgaben mehrere Anwendungen derselben Folge: aus dem Punkt drei und aus dem Winkel zwei, und beim Drehen zwei oder vier je Ecke. Darin liegt auch, was Lektion 8 unangenehm macht: Zwischen ihren Anwendungen sieht der Würfel zerstört aus, und weitermachen muss man trotzdem. Hier ist jeder Fall mit einer einzigen Anwendung erledigt, und danach stehen die ersten beiden Schichten wieder.',
      vorstellung:
        'Zuerst die Kanten, dann die Ecken, und beide Male sagt allein das Bild oben, welche Folge dran ist. Die drei Bilder der Kanten sind die aus Lektion 5. Bei den Ecken zählt, welche ihre Oberfarbe schon nach oben zeigen und wohin die übrigen weisen.',
      aufgabe:
        'Die Übung legt eine Lage auf, in der die ersten beiden Schichten stehen und die letzte Schicht noch nicht orientiert ist. Sie ist gelöst, wenn oben eine einzige Farbe zu sehen ist; wo die Steine dabei stehen, spielt keine Rolle, und das Programm erkennt den Unterschied.\n\n' +
        // **Keine Zahl im Wortlaut.** Wie viele Fälle die Stufe hat, rechnet
        // `casesOf` aus dem Bestand, und die Anzeige zeigt es. Eine geschriebene
        // Zahl liefe der gerechneten davon, sobald der Bestand wächst.
        'Gezählt wird nicht, wie oft geübt worden ist, sondern welcher Fall gelungen ist. Frei wird die nächste Stufe, sobald jeder Fall dieser einmal gelungen ist; welche noch fehlen, zeigt die Liste unter dem Text. Die Schaltflächen beim Fall führen seine Zugfolge vor, so wie der Würfel gerade liegt.',
      // Die Wahl des Umfangs, seit 4T-0196 je Stufe. **Keine Fallzahl im
      // Wortlaut**, sondern ein Platzhalter: Wie viele Fälle eine Fassung
      // trägt, rechnet `casesOf` aus dem Bestand, und eine geschriebene Zahl
      // liefe der gerechneten davon.
      fassung: {
        reduced: 'Geführt: {anzahl} Fälle',
        full: 'Voller Umfang: {anzahl} Fälle',
      },
      fassungGewinn:
        'Im vollen Umfang löst eine einzige Zugfolge, wofür der geführte Weg zwei braucht. Dafür sind mehr Fälle zu lernen. Beide Wege bleiben offen, und der Wechsel kostet keinen Fortschritt.',
      // Der Hinweis auf den Rückfall, 4T-0172. **Er nennt den Weg und geht ihn
      // nicht**, und das ist die Grenze zur Bevormundung: Dieselbe Grenze zieht
      // S-0041 in ihrer Abgrenzung für den automatischen Wechsel.
      //
      // **Er verspricht keine kürzere Lösung**, denn der geführte Weg spart
      // keine Züge, er verteilt sie auf zwei Folgen, die der Anwender bereits
      // kennt.
      rueckfall:
        'Dieser Fall ist noch nicht geübt. Der geführte Umfang löst dieselbe Lage in zwei Schritten mit Folgen, die schon gelernt sind; umschalten lässt sich das unten bei «Der Umfang dieser Stufe».',
      // Der Satz an einer Lage, zu der der geltende Umfang nichts führt,
      // 4T-0196. **Er steht auch dort, wo er heute nicht auszulösen ist**, denn
      // ob eine Fassung jede Lage deckt, hängt am Fallbestand und kann sich
      // ändern; ein fehlender Baustein zeigte dann einen Punktpfad.
      ohneHinterlegtenFall:
        'Zu dieser Lage führt der geltende Umfang keine Zugfolge. Der volle Umfang deckt sie ab; umschalten lässt sich das unten bei «Der Umfang dieser Stufe».',
    },
    permuteLastLayer: {
      titel: 'Setzen in einem Blick',
      einstieg:
        'Die zweite Stufe bringt die Steine der letzten Schicht an ihren Platz. Was die vorige orientiert hat, wird hier gesetzt, und danach ist der Würfel gelöst. Das Anfängerverfahren braucht dafür zwei Lektionen, erst die Kanten und dann die Ecken; hier gehören beide zu einem Arbeitsgang.\n\n' +
        // Die Kurzbezeichnung dieser Stufe, einmal und mit Erklärung, nach der
        // Entscheidung vom 2026-08-28 in 4T-0122. Den Namen CFOP löst Stufe 1
        // auf; hier steht er nicht noch einmal.
        'Der Begriff steht schon. Lektion 6 und 7 heißen Setzen, und dasselbe Wort trägt jetzt die zweite der beiden Stufen. Die Wettkampfszene kürzt sie PLL ab; hier heißt sie das Setzen der letzten Schicht, und dabei bleibt es.',
      erklaerung:
        'Nach der ersten Stufe zeigt oben eine einzige Farbe, und damit ist die Frage nach der Orientierung erledigt. Offen ist allein die Frage nach dem Platz: Jeder Stein der letzten Schicht gehört zwischen die Mitten, deren Farben er trägt. Das ist dieselbe Aufgabe, die im Anfängerverfahren auf Lektion 6 und 7 verteilt ist, nur ohne den Schritt, der danach noch etwas drehen müsste.\n\n' +
        'Gearbeitet wird in zwei Blicken, erst die Ecken und dann die Kanten. Diese Reihenfolge ist keine Gewohnheit, sondern nachgerechnet: Keine der vier Kantenfolgen rührt eine Ecke oben an, wohl aber nimmt eine der beiden Eckenfolgen die Kanten mit. Wer zuerst die Kanten setzte, machte sich die Arbeit mit der nächsten Folge wieder zunichte.\n\n' +
        'Der erste Blick gilt den Ecken, und es gibt zwei Bilder. Entweder zeigt eine der vier Seitenflächen an ihren beiden oberen Ecken dieselbe Farbe, oder keine tut es. Im ersten Fall steht dieses Paar bereits richtig zueinander, und die Folge ordnet die übrigen darum herum; im zweiten steht nichts, und es ist der seltenere der beiden.\n\n' +
        // Die Zahlen sind gemessen, nicht abgeschrieben: 9 gegen 19 Züge, und
        // die Suche bis elf Züge steht in 4T-0112.
        'Für den zweiten Eckenfall gibt es keine eigene Folge. Er wird gelöst, indem die Folge des ersten zweimal angewandt wird, mit einer Vierteldrehung der oberen Seite dazwischen; nach dem ersten Durchgang steht das gleichfarbige Paar da, und der zweite ist der bekannte Fall. Das ist keine Nachlässigkeit, sondern eine Messung: Der Zugraum ist bis elf Züge vollständig durchsucht und leer geblieben. Neunzehn Züge sind es damit gegen neun, und zu lernen ist trotzdem nur eine Folge.\n\n' +
        'Der zweite Blick gilt den Kanten, und es gibt vier Bilder. Zeigt eine Seitenfläche in ihrer obersten Reihe drei gleiche Farben, so steht ihre Kante bereits, und die drei anderen wandern im Ring; welche Richtung, sagt die Kante gegenüber. Zeigt keine Seite eine solche Linie, so sind zwei Paare zu tauschen, entweder benachbarte oder gegenüberliegende.\n\n' +
        'Die Arbeit der ersten Stufe bleibt dabei unangetastet. Nachgerechnet gilt das für alle sechs Folgen: Keine von ihnen kippt eine Kante oben oder dreht eine Ecke oben. Was oben einmal nach oben zeigt, zeigt bis zum Ende dorthin.\n\n' +
        'Damit ist die letzte Schicht in zwei Arbeitsgängen erledigt statt in vier Schritten. Der Gewinn liegt dabei nicht in der Zahl der Zugfolgen, denn jeder der beiden Arbeitsgänge braucht hier noch zwei, sondern in ihrer Verlässlichkeit: Jeder Blick ist mit genau einer Anwendung erledigt. Im Anfängerverfahren sind es für dieselbe Schicht gemessen bis zu acht, weil dort dieselbe Folge mehrfach anzuwenden ist, bis das Bild stimmt.',
      vorstellung:
        'Wer steht schon richtig, und was wandert wohin. Bei den Ecken sagt es eine Seitenfläche mit zwei gleichen Farben, bei den Kanten eine durchgehende Linie aus dreien.',
      aufgabe:
        'Die Übung legt eine Lage auf, in der die letzte Schicht bereits orientiert ist und ihre Steine noch nicht an ihrem Platz stehen. Sie ist gelöst, wenn der Würfel gelöst ist: Das Ziel dieser Stufe ist zugleich das Ziel des Ganzen.\n\n' +
        'Gezählt wird nicht, wie oft geübt worden ist, sondern welcher Fall gelungen ist. Frei wird die nächste Stufe, sobald jeder Fall dieser einmal gelungen ist; welche noch fehlen, zeigt die Liste unter dem Text. Die Schaltflächen beim Fall führen seine Zugfolge vor, so wie der Würfel gerade liegt.',
      fassung: {
        reduced: 'Geführt: {anzahl} Fälle',
        full: 'Voller Umfang: {anzahl} Fälle',
      },
      fassungGewinn:
        'Im vollen Umfang löst eine einzige Zugfolge, wofür der geführte Weg zwei braucht. Dafür sind mehr Fälle zu lernen. Beide Wege bleiben offen, und der Wechsel kostet keinen Fortschritt.',
      rueckfall:
        'Dieser Fall ist noch nicht geübt. Der geführte Umfang löst dieselbe Lage in zwei Schritten mit Folgen, die schon gelernt sind; umschalten lässt sich das unten bei «Der Umfang dieser Stufe».',
      ohneHinterlegtenFall:
        'Zu dieser Lage führt der geltende Umfang keine Zugfolge. Der volle Umfang deckt sie ab; umschalten lässt sich das unten bei «Der Umfang dieser Stufe».',
    },
    firstTwoLayers: {
      titel: 'Zwei Schichten auf einmal',
      einstieg:
        'Die dritte Stufe fasst zwei Schritte des Anfängerverfahrens zu einem zusammen. Lektion 3 setzt die Ecken der ersten Schicht, Lektion 4 die Kanten der Mittelschicht; hier gehen Ecke und Kante gemeinsam an ihren Platz. Der Boden und die Mittelschicht entstehen damit in einem Arbeitsgang statt in zweien.\n\n' +
        // Die Kurzbezeichnung dieser Stufe, einmal und mit Erklärung, nach der
        // Entscheidung vom 2026-08-28 in 4T-0122. Den Namen CFOP löst Stufe 1
        // auf; hier steht er nicht noch einmal.
        'Der Begriff steht schon. Lektion 4 nennt Ecke und Kante ein Paar und sagt dort bereits, dass schnellere Verfahren dieses Paar von vornherein zusammensetzen. Die Wettkampfszene kürzt die Stufe F2L ab, nach den englischen Wörtern für die ersten beiden Schichten; hier heißt sie die ersten beiden Schichten, und dabei bleibt es.',
      erklaerung:
        'Ein Paar besteht aus einer Ecke der ersten Schicht und der Kante, die neben ihr liegt. Beide teilen sich zwei Farben, und damit steht fest, welche Kante zu welcher Ecke gehört: Zur Ecke mit Weiß, Blau und Orange gehört die Kante mit Blau und Orange. Vier Ecken, vier Kanten, vier Paare, und jedes hat seine eigene Lücke zwischen zwei Seitenmitten.\n\n' +
        // Die Aussage ist gerechnet und nicht geschätzt: Über 2000 Lösungen
        // öffnen alle 7555 Anwendungen des dritten Schrittes eine Ecke, die
        // vorher an ihrem Platz stand. Die Rechnung steht in 4T-0124.
        'Das Anfängerverfahren fasst diese Ecken ein zweites Mal an. Lektion 3 bringt sie an ihren Platz und schließt die Lücke; wenn Lektion 4 die zugehörige Kante bringt, muss sie dieselbe Ecke wieder nach oben holen, um die Lücke zu öffnen. Nachgerechnet über zweitausend Lösungen gilt das ausnahmslos: Jede einzelne Anwendung der Lektion 4 öffnet eine Ecke, die bereits stand. Wer das Paar von Anfang an gemeinsam einsetzt, spart diesen zweiten Weg.\n\n' +
        'Der Handgriff dafür ist derselbe, den Lektion 3 und 4 beschreiben, nur kürzer. Ein Zug klappt die Seite hoch und öffnet die Lücke, eine Drehung der oberen Ebene stellt Ecke und Kante nebeneinander, und der Gegenzug legt beide gemeinsam hinein und schließt die Lücke. Drei Züge, wenn das Paar oben bereits passend liegt. Nachgerechnet lässt dieser Handgriff das Kreuz unten unberührt und rührt von den vier Paaren allein das an, an dem gerade gearbeitet wird. Für die anderen drei Lücken ist es derselbe Handgriff, um eine Vierteldrehung weitergedreht, genau wie in Lektion 3 und 4.\n\n' +
        'Jede Lücke liegt zwischen zwei Seiten, und beide können sie öffnen. Welche der beiden dran ist, sagt die Lage des Paares oben und nicht eine Regel; das ist der Punkt, an dem diese Stufe zu denken verlangt und nicht abzurufen.\n\n' +
        'Derselbe Handgriff holt auch heraus. Steckt eine Ecke oder eine Kante in der falschen Lücke oder verkehrt herum darin, so bringt eine einzige Anwendung beide Steine in die obere Ebene, und von dort beginnt der Weg von vorn. Nachgerechnet landen die beiden Steine, die dort stecken, tatsächlich oben. Es ist also nichts Zweites zu lernen, sondern ein Handgriff für zwei Aufgaben.\n\n' +
        'Die obere Ebene ist dabei die Werkbank und nicht mehr nur die Ablage. Ecke und Kante werden dort so zusammengestellt, dass eine einzige Drehung sie gemeinsam vor die offene Lücke bringt. Wie viele Züge das kostet, hängt davon ab, wie die beiden liegen, und darin besteht die eigentliche Arbeit dieser Stufe.\n\n' +
        'Zu lernen ist keine Liste von Lagen. Es gibt Sammlungen, die für jede Lage eine feste Folge angeben, und sie kommen später; wer die Vorstellung hat, löst auch eine Lage, die in keiner Liste steht. Der Gewinn dieser Stufe ist zu sehen und nicht zu zählen: Die Zahl der Züge sinkt sichtbar, und um wie viel, hängt von der Lage ab. Eine bestimmte Zahl zu versprechen wäre unredlich.',
      vorstellung:
        'Die Lücke öffnen, das Paar hineinlegen, die Lücke schließen. Die obere Ebene ist die Werkbank, auf der Ecke und Kante zusammenfinden, bevor sie gemeinsam nach unten gehen.',
      aufgabe:
        'Die Übung legt einen verwürfelten Würfel auf. Sie ist gelöst, wenn die ersten beiden Schichten stehen, also der Boden vollständig und alle vier Kanten der Mittelschicht an ihrem Platz. Das Kreuz gehört dazu und entsteht wie bisher zuerst. Frei wird die nächste Stufe nach drei gelungenen Anwendungen aus verschiedenen Ausgangslagen; der Stand steht unter dem Text.\n\n' +
        // Was das Programm nicht prüfen kann, steht hier und wird nicht
        // überspielt. Die Entscheidung dazu ist am 2026-08-28 in 4T-0124
        // gefallen, samt der Messung, die zwei Wegkriterien verworfen hat.
        'Geprüft wird die Lage am Würfel und nicht der Weg dorthin. Wer die beiden Schritte des Anfängerverfahrens nacheinander ausführt, erreicht dasselbe Ziel, und der Würfel sieht es ihm am Ende nicht an. Ob paarweise gearbeitet worden ist, weiß deshalb nur der Anwender selbst.',
      // **Die einzige Stufe, deren beide Umfänge sich in der Art unterscheiden
      // und nicht in der Zahl**, 4T-0196. Der geführte Weg trägt hier keinen
      // einzigen Fall, und «Geführt: 0 Fälle» läse sich als Mangel, wo in
      // Wahrheit der Handgriff dieser Stufe steht. Der Satz über den Gewinn
      // nennt deshalb nicht eine Zugfolge statt zweier, sondern die kürzere
      // Einlage, und er sagt ausdrücklich, dass sie abkürzt und nicht ersetzt.
      // Das ist die Anforderung von AK5 und AK6 aus S-0043, an der Bedienung.
      fassung: {
        reduced: 'Selbst einlegen',
        full: 'Voller Umfang: {anzahl} Fälle',
      },
      fassungGewinn:
        'Im vollen Umfang legt für jede Lage des Paares eine fertige Zugfolge es in wenigen Zügen ein. Sie kürzt den eigenen Weg ab und ersetzt ihn nicht: Was in keiner Liste steht, löst weiterhin der Handgriff dieser Stufe. Dafür ist für jede Lage eine eigene Folge zu lernen, wo der eigene Weg mit einem Handgriff auskommt. Beide Wege bleiben offen, und der Wechsel kostet keinen Fortschritt.',
      rueckfall:
        'Dieser Fall ist noch nicht geübt. Das Paar lässt sich auch selbst einlegen, mit dem Handgriff dieser Stufe; umschalten lässt sich das unten bei «Der Umfang dieser Stufe».',
      // Der Satz für die siebzehn Lagen, in denen ein Stein des Paares in einer
      // Lücke steckt. **Der Product Owner hat sie am 2026-09-06 bewusst nicht
      // hinterlegt**, weil gerade sie das Überlegen verlangen, das diese Stufe
      // erhalten soll; der Satz nennt deshalb den Weg und keine Zugfolge.
      ohneHinterlegtenFall:
        'Zu dieser Lage ist keine Zugfolge hinterlegt, und das mit Absicht: Hier steckt ein Stein des Paares in einer Lücke. Der Handgriff dieser Stufe holt ihn nach oben, und danach liegt eine der Lagen vor, für die eine Folge bereitsteht.',
    },
    plannedCross: {
      titel: 'Das geplante Kreuz',
      einstieg:
        'Die vierte Stufe ist die einzige, deren Aufgabe unverändert bleibt. Am Ende steht dasselbe weiße Kreuz unten, das Lektion 2 baut, mit denselben vier Kanten an denselben Plätzen. Was sich ändert, ist allein das Vorgehen: Die vier Kanten werden zugleich betrachtet und nicht nacheinander gesucht.\n\n' +
        // Keine Kurzbezeichnung der Wettkampfszene. Abschnitt 6 des
        // Didaktik-Konzepts nennt genau drei, und cross ist keine davon,
        // sondern das englische Wort für das Kreuz. Entschieden in 4T-0122.
        'Mit ihr ist der Übergang vollständig. Wer die drei vorigen Stufen kann, löst den Zauberwürfel bereits nach dem neuen Verfahren; wer zusätzlich das Kreuz plant, kommt ohne Denkpause zwischen Anfang und Fortsetzung aus.',
      erklaerung:
        'Lektion 2 arbeitet Kante für Kante: eine suchen, über ihren Platz drehen, herunterziehen, dann die nächste. Jede dieser vier Runden beginnt mit einem frischen Blick, und was in der vorigen Runde nebenbei geschehen ist, zählt dabei nicht mit. Genau das geht verloren, und genau das holt diese Stufe zurück.\n\n' +
        'Vorausschauend heißt: erst schauen, dann drehen. Vor dem ersten Zug werden alle vier weißen Kanten gesucht und ihre Lagen nebeneinandergelegt. Erst danach fällt die Entscheidung, in welcher Reihenfolge sie an ihren Platz gehen.\n\n' +
        // Die vorgeführte Lage steht fest im Text und wird nicht gezogen,
        // entschieden am 2026-08-28 in 4T-0125. Alle Zahlen darin sind über
        // eine vollständige Breitensuche gerechnet, die Rechnung steht im Task.
        'Ein Beispiel, an dem sich das zeigen lässt. Die weiß-grüne Kante steht bereits unten vorn. Die weiß-orangene liegt oben hinten, mit Weiß nach oben. Die weiß-rote steckt in der Mittelschicht, vorn rechts, mit Weiß nach vorn. Die weiß-blaue liegt unten rechts, also auf dem Platz der weiß-orangenen, und dort verkehrt herum: Blau zeigt nach unten und Weiß zur Seite.\n\n' +
        'Wer Kante für Kante arbeitet, sieht drei getrennte Aufgaben: die weiß-orangene herunterziehen, die weiß-rote aus der Mittelschicht holen, die weiß-blaue aus ihrer falschen Lage befreien. Wer alle vier zugleich betrachtet, sieht einen Zug, der drei davon bewegt. Eine Vierteldrehung oben stellt die weiß-orangene über ihren Platz; die halbe Drehung der rechten Seite, die sie danach hinunterzieht, hebt zugleich die weiß-blaue aus ihrer falschen Lage nach oben und schiebt die weiß-rote von der vorderen Lücke der Mittelschicht in die hintere, aus der sie drei Züge später an ihren Platz fällt. Vier Züge fehlen dann noch, und das Kreuz steht.\n\n' +
        'Sechs Züge sind es damit an dieser Lage. Kante für Kante gerechnet braucht dasselbe Kreuz an derselben Lage elf. Der Unterschied liegt nicht in der Geschicklichkeit, sondern darin, dass der eine Weg vor dem ersten Zug hinsieht und der andere nicht.\n\n' +
        'Wie weit das trägt, ist gerechnet. Alle Lagen, die die vier weißen Kanten einnehmen können, sind durchgezählt und einzeln durchgerechnet worden; es sind gut hundertneunzigtausend. Keine einzige davon braucht mehr als acht Züge, und im Mittel sind es nicht ganz sechs. Kante für Kante gerechnet sind es im Mittel fünfzehn und im schlechtesten Fall sechsundzwanzig. Die acht ist dabei eine Schranke und keine Zusage: Sie sagt, dass es nie länger sein muss, und nicht, dass der Anwender den kürzesten Weg findet.\n\n' +
        'Was diese Stufe einbringt, ist Zeit und kein neues Bild auf dem Würfel. Am Ende sieht der Würfel genauso aus wie nach Lektion 2, und wer nur auf ihn schaut, merkt keinen Unterschied. Deshalb steht diese Stufe zuletzt: Ihr Gewinn ist der einzige des Übergangs, den man nicht sehen, sondern nur messen kann.',
      vorstellung:
        'Vier Kanten zugleich betrachten statt sie nacheinander zu suchen. Erst schauen, dann drehen: Wer weiß, wo alle vier liegen, findet die Reihenfolge, in der ein Zug mehr als eine Kante bewegt.',
      aufgabe:
        'Die Übung legt einen verwürfelten Würfel auf. Sie ist gelöst, wenn das weiße Kreuz unten steht, also alle vier weißen Kanten an ihrem Platz und richtig herum, mit ihren zweiten Farben an den Mitten ihrer Seiten. Frei wird nichts mehr, denn dies ist die letzte Stufe; verlangt sind trotzdem drei gelungene Anwendungen, und der Stand steht unter dem Text.\n\n' +
        // Zwei Grenzen der Prüfbarkeit, benannt und nicht überspielt. Die
        // zweite fällt mit der Zeitnahme in 2A-0020 weg.
        'Zwei Dinge prüft das Programm hier nicht. Ob vor dem ersten Zug geplant worden ist, sieht der fertige Würfel nicht an; er zeigt nur, dass das Kreuz steht. Und die Zeit, die den Gewinn dieser Stufe ausmacht, misst die Zeitnahme nur über den ganzen Würfel und nicht für das Kreuz allein. Wer den Unterschied sehen will, zählt seine Züge selbst und vergleicht sie mit den fünfzehn des alten Weges.',
    },
  },

  fall: {
    edgesAngle: {
      name: 'Der Winkel',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander. Lektion 5 nennt dieses Bild den Winkel.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und rechts liegen. Das ist dieselbe Haltung, die Lektion 5 von der anderen Seite beschreibt: Die beiden, die schon stehen, zeigen dann nach hinten und nach links.',
      erklaerung:
        'Nach der Folge zeigen alle vier oberen Kanten die Farbe der Oberseite nach oben, und das Kreuz steht. Es ist nicht dieselbe Folge wie in Lektion 5; jene führt den Winkel erst in die Linie und braucht danach einen zweiten Durchgang.\n\n' +
        'Wo die Kanten dabei landen, sagt dieser Fall nicht zu, und über die Ecken oben ebenso wenig. Beides ordnen die drei folgenden Blicke. Die Alternative daneben greift dieselben zwei Seiten in anderer Reihenfolge. Die gespiegelte Fassung für die linke Hand steht hier nicht: Sie verlangt den Winkel in der anderen Ecke und wäre damit keine Wahl der Hand, sondern eine zweite Ausrichtung.',
    },
    edgesLine: {
      name: 'Die Linie',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber. Lektion 5 nennt dieses Bild die Linie.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und hinten liegen. Die Linie liegt dann quer vor dir, von links nach rechts. Längs liegend führt dieselbe Folge zurück zum Punkt.',
      erklaerung:
        'Es ist die Folge aus Lektion 5, unverändert und in derselben Haltung. Nach ihr zeigen alle vier oberen Kanten nach oben, und das Kreuz steht. Von den sechzehn Fällen dieser Fassung ist dies der einzige, für den der Anwender die Folge bereits kennt.\n\n' +
        'Wo die Kanten dabei landen, sagt dieser Fall nicht zu, und über die Ecken oben ebenso wenig. Beides ordnen die drei folgenden Blicke. Die Alternative daneben ist dieselbe Bewegung für die linke Hand, und sie verlangt dieselbe Haltung.',
    },
    edgesDot: {
      name: 'Der Punkt',
      bild:
        'Keine der vier oberen Kanten zeigt die Farbe der Oberseite nach oben; sichtbar ist allein die Mitte. Lektion 5 nennt dieses Bild den Punkt.\n\n' +
        'Hier ist nichts auszurichten. Der Fall sieht aus jeder Haltung gleich aus, und die Folge wirkt aus jeder.',
      erklaerung:
        'Es sind zwei Folgen in einer: erst die der Linie, dann eine halbe Drehung der oberen Seite, dann die des Winkels. Der erste Teil macht aus dem Punkt einen Winkel, die halbe Drehung legt ihn in die Haltung, die der zweite Teil verlangt, und dieser schließt das Kreuz. Eine dritte Folge ist für diesen Fall nicht zu lernen.\n\n' +
        'Eine eigene, kürzere Folge gibt es nicht: Bis zehn Züge ist der Zugraum durchsucht und leer geblieben. Die halbe Drehung in der Mitte ist kein Schmuck, denn der zweite Teil ist die Umkehrung des ersten; ohne sie heben sich beide auf, und mit einer Vierteldrehung statt der halben ebenso wenig. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    cornersTwoUpFrontSplit: {
      name: 'Zwei Ecken vorn, die Farben zur Seite',
      bild:
        'Zwei der vier oberen Ecken zeigen die Farbe der Oberseite bereits nach oben, und sie liegen nebeneinander. Die beiden anderen zeigen ihre Oberfarbe nach rechts und nach links, also an zwei einander gegenüberliegende Seitenflächen.\n\n' +
        'Drehe die obere Ebene, bis die beiden fertigen Ecken vorn liegen. Vorn und hinten zeigt dann keine Seitenfläche die Farbe der Oberseite; liegen die fertigen Ecken hinten, ist es dasselbe Bild in der falschen Haltung.',
      erklaerung:
        'Nach der Folge zeigen alle vier oberen Ecken die Farbe der Oberseite nach oben, und die Ebene ist orientiert. Wo die Ecken dabei landen, sagt dieser Fall nicht zu; das ordnen die beiden folgenden Blicke.\n\n' +
        'Die vier Kanten oben rührt die Folge nicht an. Sie stehen danach genau so wie zuvor, und die Arbeit des ersten Blicks bleibt damit erhalten. Die Alternative daneben ist dieselbe Bewegung für die linke Hand, mit derselben Haltung.',
    },
    cornersTwoUpFrontShared: {
      name: 'Zwei Ecken vorn, die Farben nach hinten',
      bild:
        'Zwei der vier oberen Ecken zeigen die Farbe der Oberseite bereits nach oben, und sie liegen nebeneinander. Die beiden anderen zeigen ihre Oberfarbe auf dieselbe Seitenfläche: Deren oberste Reihe trägt die Farbe der Oberseite gleich zweimal.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche hinten liegt. Die beiden fertigen Ecken liegen dann vorn, und drei der vier Seitenflächen zeigen oben keine Farbe der Oberseite.',
      erklaerung:
        'Nach der Folge zeigen alle vier oberen Ecken die Farbe der Oberseite nach oben, und die Ebene ist orientiert. Neun Züge sind es, und kürzer geht es nicht: Bis acht Züge gibt es für diesen Fall keine einzige Folge, nachgerechnet über den ganzen Zugraum.\n\n' +
        'Die vier Kanten oben rührt die Folge nicht an. Sie greift drei Seiten und kommt dabei ohne die obere aus, was sie trotz ihrer Länge ruhig macht; das gilt für alle drei Fälle, bei denen die Kanten stehen bleiben. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    cornersTwoUpDiagonal: {
      name: 'Zwei Ecken über Eck',
      bild:
        'Zwei der vier oberen Ecken zeigen die Farbe der Oberseite bereits nach oben, und sie liegen einander diagonal gegenüber. Die beiden anderen zeigen ihre Oberfarbe an zwei benachbarte Seitenflächen.\n\n' +
        'Drehe die obere Ebene, bis eine der beiden fertigen Ecken vorn rechts liegt; die andere liegt dann hinten links. Rechts und vorn zeigt keine Seitenfläche oben die Farbe der Oberseite.',
      erklaerung:
        'Nach der Folge zeigen alle vier oberen Ecken die Farbe der Oberseite nach oben, und die Ebene ist orientiert. Die vier Kanten oben rührt sie nicht an.\n\n' +
        'Die gespiegelte Fassung für die linke Hand steht hier nicht: Sie verlangt die fertigen Ecken in der anderen Diagonale und wäre damit keine Wahl der Hand, sondern eine zweite Ausrichtung. Die Alternative daneben greift dieselbe Haltung mit anderen Seiten.',
    },
    cornersOneUpFrontLeft: {
      name: 'Eine Ecke vorn links',
      bild:
        'Nur eine der vier oberen Ecken zeigt die Farbe der Oberseite nach oben. Genau eine Seitenfläche zeigt in ihrer obersten Reihe gar keine Oberfarbe, die drei anderen je eine.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche vorn liegt. Die fertige Ecke liegt dann vorn links. Liegt sie vorn rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Nach der Folge zeigen alle vier oberen Ecken die Farbe der Oberseite nach oben, und die Ebene ist orientiert. Sieben Züge, und kürzer geht es nicht.\n\n' +
        'Die Folge vertauscht dabei die vier oberen Ecken und drei der oberen Kanten. Im Anfängerverfahren wäre das ein Rückschritt, denn dort sind Ecken und Kanten oben zu diesem Zeitpunkt bereits gesetzt; hier ist noch nichts gesetzt, und die beiden folgenden Blicke setzen es. Die gespiegelte Fassung für die linke Hand steht hier nicht, denn sie löst den Fall daneben.',
    },
    cornersOneUpFrontRight: {
      name: 'Eine Ecke vorn rechts',
      bild:
        'Nur eine der vier oberen Ecken zeigt die Farbe der Oberseite nach oben. Genau eine Seitenfläche zeigt in ihrer obersten Reihe gar keine Oberfarbe, die drei anderen je eine.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche vorn liegt. Die fertige Ecke liegt dann vorn rechts. Liegt sie vorn links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Nach der Folge zeigen alle vier oberen Ecken die Farbe der Oberseite nach oben, und die Ebene ist orientiert. Sieben Züge, und kürzer geht es nicht. Sie kommt mit der rechten und der oberen Seite aus.\n\n' +
        'Die Folge vertauscht dabei die vier oberen Ecken und drei der oberen Kanten. Im Anfängerverfahren wäre das ein Rückschritt, denn dort sind Ecken und Kanten oben zu diesem Zeitpunkt bereits gesetzt; hier ist noch nichts gesetzt, und die beiden folgenden Blicke setzen es. Die gespiegelte Fassung für die linke Hand steht hier nicht, denn sie löst den Fall daneben.',
    },
    cornersNoneUpBackPair: {
      name: 'Keine Ecke oben, das Paar hinten',
      bild:
        'Keine der vier oberen Ecken zeigt die Farbe der Oberseite nach oben. Genau eine Seitenfläche zeigt in ihrer obersten Reihe gar keine Oberfarbe, eine zeigt sie zweimal, die beiden anderen je einmal.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche ohne Oberfarbe vorn liegt. Die mit den beiden Oberfarben liegt dann hinten.',
      erklaerung:
        'Nach der Folge zeigen alle vier oberen Ecken die Farbe der Oberseite nach oben, und die Ebene ist orientiert. Neun Züge, und kürzer geht es nicht.\n\n' +
        'Die Folge greift nur zwei Seiten und wechselt dabei mehrfach zwischen Viertel- und Halbdrehungen. Wo Ecken und Kanten oben danach liegen, sagt dieser Fall nicht zu; das ordnen die beiden folgenden Blicke. Die Alternative daneben ist dieselbe Bewegung für die linke Hand, mit derselben Haltung.',
    },
    cornersNoneUpSidePairs: {
      name: 'Keine Ecke oben, zwei Paare seitlich',
      bild:
        'Keine der vier oberen Ecken zeigt die Farbe der Oberseite nach oben. Zwei einander gegenüberliegende Seitenflächen zeigen in ihrer obersten Reihe die Oberfarbe gleich zweimal, die beiden anderen gar nicht.\n\n' +
        'Drehe die obere Ebene, bis die beiden Seitenflächen ohne Oberfarbe vorn und hinten liegen. Welche von beiden vorn liegt, spielt keine Rolle: Der Fall sieht nach einer halben Drehung genau so aus wie zuvor.',
      erklaerung:
        'Nach der Folge zeigen alle vier oberen Ecken die Farbe der Oberseite nach oben, und die Ebene ist orientiert. Elf Züge, und kürzer geht es nicht: Bis zehn Züge ist der Zugraum durchsucht und leer geblieben. Sie ist damit die längste Folge dieses Blicks und zugleich die aus nur zwei Seiten.\n\n' +
        'Keine der vier oberen Ecken wechselt dabei ihren Platz; sie werden allein gedreht. Unter den sieben Fällen dieses Blicks ist er damit der einzige, der die Ecken allein dreht, ohne eine einzige von ihnen zu versetzen. Die drei oberen Kanten wandern dagegen mit; der letzte Blick setzt sie. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    cornersMatchedPair: {
      name: 'Ein gleichfarbiges Eckenpaar',
      bild:
        'Genau eine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe. Die Wettkampfszene nennt dieses Paar headlights; hier heißt es das gleichfarbige Eckenpaar.\n\n' +
        'Drehe die obere Ebene, bis diese Seite vorn liegt, und wende die Folge erst dann an. Die Haltung gehört zum Fall: Dieselbe Folge trifft mit dem Paar an anderer Stelle eine andere Aufgabe.',
      erklaerung:
        'Die Folge bewegt drei Ecken der obersten Ebene im Ring und lässt die vierte, hinten links, an ihrem Platz. Die vier Kanten oben rührt sie nicht an; sie stehen danach genau so wie zuvor.\n\n' +
        'Weil sie die Ecken nur zueinander ordnet, kann die obere Ebene am Ende als Ganzes verdreht sein. Ist sie es, bringt ein Zug der oberen Seite sie zurecht. Die Alternative daneben ist dieselbe Bewegung für die linke Hand, mit derselben Haltung.',
    },
    cornersNoMatchedPair: {
      name: 'Kein gleichfarbiges Eckenpaar',
      bild:
        'Keine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe.\n\n' +
        'Hier ist nichts auszurichten. Der Fall sieht aus jeder Haltung gleich aus, und die Folge wirkt aus jeder.',
      erklaerung:
        'Es ist die Folge des gleichfarbigen Eckenpaars, zweimal angewandt, mit einer Vierteldrehung der oberen Seite dazwischen. Nach dem ersten Durchgang steht das gleichfarbige Paar da, und der zweite Durchgang ist damit der bekannte Fall. Eine zweite Folge ist für diesen Fall nicht zu lernen.\n\n' +
        'Zusammen vertauschen die beiden Durchgänge die einander gegenüberliegenden Ecken vorn rechts und hinten links. Anders als beim ersten Fall wandern die vier Kanten oben dabei mit; der nächste Blick setzt sie. Die Richtung der Vierteldrehung steht in der Zugfolge und ist bei der Fassung für die linke Hand die andere.',
    },
    edgesCycleClockwise: {
      name: 'Drei Kanten wandern im Uhrzeigersinn',
      bild:
        'Genau eine der vier Seitenflächen zeigt in ihrer obersten Reihe drei gleiche Farben, also eine durchgehende Linie. Deren Kante steht bereits an ihrem Platz. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\n' +
        'Sieh dann die hintere Kante an: Sie zeigt die Farbe der rechten Seite. Zeigt sie stattdessen die Farbe der linken, liegt der andere der beiden Ringtausche vor.',
      erklaerung:
        'Die Folge lässt die vordere Kante liegen und schiebt die drei anderen im Uhrzeigersinn weiter: die hintere nach rechts, die rechte nach links, die linke nach hinten. Über die vordere hinweg, denn die ist schon am Platz. Die vier Ecken oben rührt sie nicht an.\n\n' +
        'Weil sie die Kanten nur zueinander ordnet, kann die obere Ebene am Ende als Ganzes verdreht sein. Ist sie es, bringt ein Zug der oberen Seite sie zurecht. Daneben stehen zwei Alternativen: dieselbe Bewegung für die linke Hand und eine kürzere mit neun Zügen, die dafür vier Seiten greift und zwei Gegengriffe zugleich verlangt.',
    },
    edgesCycleCounterClockwise: {
      name: 'Drei Kanten wandern gegen den Uhrzeigersinn',
      bild:
        'Genau eine der vier Seitenflächen zeigt in ihrer obersten Reihe drei gleiche Farben, also eine durchgehende Linie. Deren Kante steht bereits an ihrem Platz. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\n' +
        'Sieh dann die hintere Kante an: Sie zeigt die Farbe der linken Seite. Zeigt sie stattdessen die Farbe der rechten, liegt der andere der beiden Ringtausche vor.',
      erklaerung:
        'Die Folge lässt die vordere Kante liegen und schiebt die drei anderen gegen den Uhrzeigersinn weiter: die linke nach rechts, die hintere nach links, die rechte nach hinten. Über die vordere hinweg, denn die ist schon am Platz. Die vier Ecken oben rührt sie nicht an.\n\n' +
        'Sie ist die Umkehrung der Folge des anderen Ringtauschs, und beide sind gleich lang. Daneben stehen zwei Alternativen: dieselbe Bewegung für die linke Hand und eine kürzere mit neun Zügen, die dafür vier Seiten greift und zwei Gegengriffe zugleich verlangt.',
    },
    edgesSwapNeighbours: {
      name: 'Zwei benachbarte Kantenpaare',
      bild:
        'Keine Seitenfläche zeigt eine durchgehende Linie, keine Kante steht also schon. Jede von ihnen zeigt die Farbe einer ihrer beiden Nachbarseiten.\n\n' +
        'Zwei einander gegenüberliegende Seiten tragen eine Kante, die nach links gehört. Drehe die obere Ebene, bis eine davon vorn liegt: Die vordere Kante gehört dann nach links.',
      erklaerung:
        'Die Folge tauscht zwei Paare benachbarter Kanten, die vordere mit der linken und die rechte mit der hinteren. Die vier Ecken oben rührt sie nicht an.\n\n' +
        'Zwölf Züge sind es, und kürzer geht es nicht: Bis elf Züge gibt es für diesen Fall keine einzige Folge, nachgerechnet über den ganzen Zugraum. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    edgesSwapOpposite: {
      name: 'Zwei gegenüberliegende Kantenpaare',
      bild:
        'Keine Seitenfläche zeigt eine durchgehende Linie, keine Kante steht also schon. Jede von ihnen zeigt die Farbe der gegenüberliegenden Seite.\n\n' +
        'Hier ist nichts auszurichten. Der Fall sieht aus jeder Haltung gleich aus, und die Folge wirkt aus jeder.',
      erklaerung:
        'Die Folge tauscht die vordere Kante mit der hinteren und die linke mit der rechten. Die vier Ecken oben rührt sie nicht an.\n\n' +
        'Für diesen Fall gibt es auch eine Folge mit neun Zügen. Sie dreht die untere Schicht, und die Ecken oben verlieren dabei ihren Platz; deshalb steht sie hier nicht. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    matchedPairEdgesAlong: {
      name: 'Ein Eckenpaar, die Kanten stehen dazu',
      bild:
        'Genau eine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe, das gleichfarbige Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\n' +
        'Sieh dann die vier oberen Kanten an: Die Kante in der Farbe des Eckenpaars liegt vorn, die in der Gegenfarbe liegt links.',
      erklaerung:
        'Die Kanten stehen bereits richtig zu den Ecken; allein die Ecken sind noch zu setzen. Elf Züge, und sie greift nur die rechte, die hintere und die obere Seite.\n\n' +
        'Die Folge versetzt dabei die Ecken und drei der oberen Kanten. Die Alternative daneben verlangt dieselbe Haltung und greift statt der rechten die linke Seite; sie liegt damit der linken Hand näher.',
    },
    matchedPairCycleCounterClockwiseRight: {
      name: 'Ein Eckenpaar, Ringtausch gegen den Uhrzeigersinn um rechts',
      bild:
        'Genau eine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe, das gleichfarbige Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\n' +
        'Sieh dann die vier oberen Kanten an: Die Kante in der Farbe des Eckenpaars liegt links, die in der Gegenfarbe liegt hinten.',
      erklaerung:
        'Die rechte Kante steht bereits richtig zu den Ecken, die drei anderen wandern gegen den Uhrzeigersinn um sie herum. Dreizehn Züge.\n\n' +
        'Die Folge versetzt dabei die Ecken und drei der oberen Kanten. Die Alternative daneben verlangt dieselbe Haltung und greift statt der rechten und der hinteren die linke und die vordere Seite.',
    },
    matchedPairCycleClockwiseRight: {
      name: 'Ein Eckenpaar, Ringtausch im Uhrzeigersinn um rechts',
      bild:
        'Genau eine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe, das gleichfarbige Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\n' +
        'Sieh dann die vier oberen Kanten an: Die Kante in der Farbe des Eckenpaars liegt hinten, die in der Gegenfarbe liegt vorn.',
      erklaerung:
        'Die rechte Kante steht bereits richtig zu den Ecken, die drei anderen wandern im Uhrzeigersinn um sie herum. Vierzehn Züge, und damit ist er einer der längsten dieses Blicks.\n\n' +
        'Was die Folge sonst noch bewegt, sagt dieser Fall nicht zu: Zu diesem Zeitpunkt sind Ecken und Kanten oben beide noch zu setzen, und die Folge fasst beide an. Die Alternative daneben verlangt dieselbe Haltung und greift statt der vorderen die hintere Seite.',
    },
    matchedPairSwapNeighboursRight: {
      name: 'Ein Eckenpaar, vordere und rechte Kante getauscht',
      bild: 'Wie beim gespiegelten Fall daneben liegt an genau einer Seitenfläche ein gleichfarbiges Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\nDie Kante in der Farbe des Eckenpaars liegt dann rechts, die in der Gegenfarbe hinten.',
      erklaerung:
        'Die vordere und die rechte Kante gehören zueinander vertauscht, die hintere und die linke ebenso. Dreizehn Züge.\n\n' +
        'Es ist der gespiegelte Fall zum Ringtausch gegen den Uhrzeigersinn um rechts: Wer dessen Folge kennt, spiegelt sie und hat die Bewegung. Die Folge versetzt dabei die Ecken und drei der oberen Kanten.',
    },
    matchedPairCycleClockwiseLeft: {
      name: 'Ein Eckenpaar, Ringtausch im Uhrzeigersinn um links',
      bild:
        'Genau eine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe, das gleichfarbige Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\n' +
        'Sieh dann die vier oberen Kanten an: Die Kante in der Farbe des Eckenpaars liegt rechts, die in der Gegenfarbe liegt links.',
      erklaerung:
        'Die linke Kante steht bereits richtig zu den Ecken, die drei anderen wandern im Uhrzeigersinn um sie herum. Elf Züge, und sie greift nur die rechte, die hintere und die obere Seite.\n\n' +
        'Die Folge setzt die Ecken um, und es wandern die vier Kanten oben dabei mit. Die Alternative daneben verlangt dieselbe Haltung und greift statt der rechten die linke Seite.',
    },
    matchedPairCycleClockwiseBack: {
      name: 'Ein Eckenpaar, Ringtausch im Uhrzeigersinn um hinten',
      bild:
        'Genau eine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe, das gleichfarbige Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\n' +
        'Sieh dann die vier oberen Kanten an: Die Kante in der Farbe des Eckenpaars liegt rechts, die in der Gegenfarbe liegt vorn.',
      erklaerung:
        'Die hintere Kante steht bereits richtig zu den Ecken, die drei anderen wandern im Uhrzeigersinn um sie herum. Vierzehn Züge.\n\n' +
        'Die Folge versetzt dabei die Ecken und drei der oberen Kanten. Die Alternative daneben verlangt dieselbe Haltung und greift statt der vorderen die hintere Seite.',
    },
    matchedPairCycleCounterClockwiseLeft: {
      name: 'Ein Eckenpaar, Ringtausch gegen den Uhrzeigersinn um links',
      bild:
        'Genau eine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe, das gleichfarbige Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\n' +
        'Sieh dann die vier oberen Kanten an: Die Kante in der Farbe des Eckenpaars liegt hinten, die in der Gegenfarbe liegt links.',
      erklaerung:
        'Die linke Kante steht bereits richtig zu den Ecken, die drei anderen wandern gegen den Uhrzeigersinn um sie herum. Vierzehn Züge.\n\n' +
        'Was die Folge sonst noch bewegt, sagt dieser Fall nicht zu: Zu diesem Zeitpunkt sind Ecken und Kanten oben beide noch zu setzen, und die Folge fasst beide an. Die Alternative daneben verlangt dieselbe Haltung und greift statt der vorderen die hintere Seite.',
    },
    matchedPairCycleCounterClockwiseFront: {
      name: 'Ein Eckenpaar, Ringtausch gegen den Uhrzeigersinn um vorn',
      bild:
        'Genau eine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe, das gleichfarbige Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\n' +
        'Sieh dann die vier oberen Kanten an: Die Kante in der Farbe des Eckenpaars liegt vorn, die in der Gegenfarbe liegt hinten.',
      erklaerung:
        'Die vordere Kante steht bereits richtig zu den Ecken, die drei anderen wandern gegen den Uhrzeigersinn um sie herum. Vierzehn Züge.\n\n' +
        'Die Folge setzt die Ecken um, und es wandern die vier Kanten oben dabei mit. Die Alternative daneben verlangt dieselbe Haltung und greift statt der vorderen die hintere Seite.',
    },
    matchedPairSwapNeighboursLeft: {
      name: 'Ein Eckenpaar, vordere und linke Kante getauscht',
      bild: 'Wie beim gespiegelten Fall daneben liegt an genau einer Seitenfläche ein gleichfarbiges Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\nDie Kante in der Farbe des Eckenpaars liegt dann links, die in der Gegenfarbe vorn.',
      erklaerung:
        'Die vordere und die linke Kante gehören zueinander vertauscht, die hintere und die rechte ebenso. Vierzehn Züge.\n\n' +
        'Es ist der gespiegelte Fall zum Ringtausch im Uhrzeigersinn um hinten: Wer dessen Folge kennt, spiegelt sie und hat die Bewegung. Was die Folge sonst noch bewegt, sagt dieser Fall nicht zu.',
    },
    matchedPairCycleCounterClockwiseBack: {
      name: 'Ein Eckenpaar, Ringtausch gegen den Uhrzeigersinn um hinten',
      bild: 'Wie beim gespiegelten Fall daneben liegt an genau einer Seitenfläche ein gleichfarbiges Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\nDie Kante in der Farbe des Eckenpaars liegt dann links, die in der Gegenfarbe rechts.',
      erklaerung:
        'Die hintere Kante steht bereits richtig zu den Ecken, die drei anderen wandern gegen den Uhrzeigersinn um sie herum. Elf Züge, und damit ist er einer der kürzesten dieses Blicks.\n\n' +
        'Es ist der gespiegelte Fall zum Ringtausch im Uhrzeigersinn um links. Die Folge setzt die Ecken um, und es wandern die vier Kanten oben dabei mit.',
    },
    matchedPairCycleClockwiseFront: {
      name: 'Ein Eckenpaar, Ringtausch im Uhrzeigersinn um vorn',
      bild: 'Wie beim gespiegelten Fall daneben liegt an genau einer Seitenfläche ein gleichfarbiges Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\nDie Kante in der Farbe des Eckenpaars liegt dann vorn, die in der Gegenfarbe rechts.',
      erklaerung:
        'Die vordere Kante steht bereits richtig zu den Ecken, die drei anderen wandern im Uhrzeigersinn um sie herum. Elf Züge.\n\n' +
        'Es ist der gespiegelte Fall zu dem, bei dem die Kanten schon zu den Ecken stehen. Die Folge versetzt dabei die Ecken und drei der oberen Kanten.',
    },
    matchedPairSwapOpposite: {
      name: 'Ein Eckenpaar, gegenüberliegende Kanten getauscht',
      bild: 'Wie beim gespiegelten Fall daneben liegt an genau einer Seitenfläche ein gleichfarbiges Eckenpaar. Drehe die obere Ebene, bis diese Seite vorn liegt.\n\nDie Kante in der Farbe des Eckenpaars liegt dann hinten, die in der Gegenfarbe rechts.',
      erklaerung:
        'Die vordere und die hintere Kante gehören zueinander vertauscht, die linke und die rechte ebenso. Vierzehn Züge.\n\n' +
        'Es ist der gespiegelte Fall zum Ringtausch gegen den Uhrzeigersinn um links. Die Folge versetzt dabei die Ecken und drei der oberen Kanten.',
    },
    noMatchedPairCycleCounterClockwise: {
      name: 'Kein Eckenpaar, Ringtausch gegen den Uhrzeigersinn',
      bild:
        'Keine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe. Vergleiche stattdessen an jeder Seitenfläche die obere Kante mit der oberen linken Ecke derselben Fläche.\n\n' +
        'An genau einer Fläche zeigen beide dieselbe Farbe; drehe die obere Ebene, bis sie vorn liegt. Die rechte Kante weicht dann um eine Vierteldrehung von ihrer linken Ecke ab, die linke um zwei.',
      erklaerung:
        'Die vordere Kante steht bereits richtig zu den Ecken, die drei anderen wandern gegen den Uhrzeigersinn um sie herum. Vierzehn Züge.\n\n' +
        'Was die Folge sonst noch bewegt, sagt dieser Fall nicht zu: Zu diesem Zeitpunkt sind Ecken und Kanten oben beide noch zu setzen, und die Folge fasst beide an. Die Alternative daneben verlangt dieselbe Haltung und greift eine Seite mehr.',
    },
    noMatchedPairCycleClockwise: {
      name: 'Kein Eckenpaar, Ringtausch im Uhrzeigersinn',
      bild:
        'Keine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe. Vergleiche stattdessen an jeder Seitenfläche die obere Kante mit der oberen linken Ecke derselben Fläche.\n\n' +
        'An genau einer Fläche zeigen beide dieselbe Farbe; drehe die obere Ebene, bis sie vorn liegt. Die rechte Kante weicht dann um zwei Vierteldrehungen von ihrer linken Ecke ab, die linke um drei.',
      erklaerung:
        'Die vordere Kante steht bereits richtig zu den Ecken, die drei anderen wandern im Uhrzeigersinn um sie herum. Dreizehn Züge.\n\n' +
        'Was die Folge sonst noch bewegt, sagt dieser Fall nicht zu: Zu diesem Zeitpunkt sind Ecken und Kanten oben beide noch zu setzen, und die Folge fasst beide an. Die Alternative daneben verlangt dieselbe Haltung und greift eine Seite mehr.',
    },
    noMatchedPairEdgesAlong: {
      name: 'Kein Eckenpaar, die Kanten stehen dazu',
      bild:
        'Keine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe. Vergleiche stattdessen an jeder Seitenfläche die obere Kante mit der oberen linken Ecke derselben Fläche.\n\n' +
        'An allen vier Flächen zeigen beide dieselbe Farbe. Hier ist nichts auszurichten: Der Fall sieht aus jeder Haltung gleich aus, und die Folge wirkt aus jeder.',
      erklaerung:
        'Die Kanten stehen bereits richtig zu den Ecken; allein die Ecken sind noch zu setzen, und weil kein gleichfarbiges Paar vorliegt, ist keine von ihnen an ihrem Platz. Dreizehn Züge.\n\n' +
        'Die Folge vertauscht dabei die vier oberen Ecken, und es wandern die vier Kanten oben dabei mit. Die Alternative daneben verlangt dieselbe Haltung und greift statt der vorderen die hintere Seite.',
    },
    noMatchedPairSwapNeighbours: {
      name: 'Kein Eckenpaar, benachbarte Kanten getauscht',
      bild:
        'Keine der vier Seitenflächen zeigt in ihrer obersten Reihe an beiden Ecken dieselbe Farbe. Vergleiche stattdessen an jeder Seitenfläche die obere Kante mit der oberen linken Ecke derselben Fläche.\n\n' +
        'An keiner Fläche zeigen beide dieselbe Farbe: Zwei einander gegenüberliegende Kanten weichen um eine Vierteldrehung ab, die beiden anderen um drei. Drehe die obere Ebene, bis eine der beiden mit der kleineren Abweichung vorn liegt; welche von ihnen, spielt keine Rolle.',
      erklaerung:
        'Je zwei benachbarte Kanten gehören zueinander vertauscht. Vierzehn Züge.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken, und es wandern die vier Kanten oben dabei mit. Die Alternative daneben verlangt dieselbe Haltung und greift statt der vorderen die hintere Seite.',
    },
    noMatchedPairSwapOpposite: {
      name: 'Kein Eckenpaar, gegenüberliegende Kanten getauscht',
      bild:
        'Keine der vier Seitenflächen zeigt an beiden oberen Ecken dieselbe Farbe, und keine obere Kante zeigt die Farbe der oberen linken Ecke ihrer Fläche; jede weicht um zwei Vierteldrehungen ab.\n\n' +
        'Hier ist nichts auszurichten. Der Fall sieht aus jeder Haltung gleich aus, und die Folge wirkt aus jeder.',
      erklaerung:
        'Die vordere und die hintere Kante gehören zueinander vertauscht, die linke und die rechte ebenso. Dreizehn Züge.\n\n' +
        'Es ist der gespiegelte Fall zu dem, bei dem die Kanten schon zu den Ecken stehen. Die Folge vertauscht dabei die vier oberen Ecken, und es wandern die vier Kanten oben dabei mit.',
    },
    crossTwoUpFrontSplit: {
      name: 'Kreuz, zwei Ecken vorn, die Farben zur Seite',
      bild:
        'Alle vier oberen Kanten zeigen die Farbe der Oberseite nach oben; das Kreuz steht bereits. Zwei der vier oberen Ecken zeigen sie ebenfalls schon nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe nach rechts und nach links, also an zwei einander gegenüberliegende Seitenflächen.\n\n' +
        'Drehe die obere Ebene, bis die beiden fertigen Ecken vorn liegen. Vorn und hinten zeigt dann keine Seitenfläche die Farbe der Oberseite; liegen die fertigen Ecken hinten, ist es dasselbe Bild in der falschen Haltung.',
      erklaerung:
        'Es ist dieselbe Folge wie beim Fall «Zwei Ecken vorn, die Farben zur Seite» des geführten Weges. Wer sie dort gelernt hat, wendet sie hier unverändert an; steht das Kreuz bereits, bleibt von der ganzen Orientierung nur noch das Drehen der Ecken übrig.\n\n' +
        'Die vier Kanten oben rührt die Folge nicht an, das Kreuz steht danach also unverändert. Nach ihr zeigen auch alle vier oberen Ecken nach oben, und die Ebene ist in einer einzigen Anwendung orientiert. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    crossTwoUpFrontShared: {
      name: 'Kreuz, zwei Ecken vorn, die Farben nach hinten',
      bild:
        'Alle vier oberen Kanten zeigen die Farbe der Oberseite nach oben; das Kreuz steht bereits. Zwei der vier oberen Ecken zeigen sie ebenfalls schon nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe auf dieselbe Seitenfläche, deren oberste Reihe die Farbe damit zweimal trägt.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche hinten liegt. Die beiden fertigen Ecken liegen dann vorn, und drei der vier Seitenflächen zeigen oben keine Farbe der Oberseite.',
      erklaerung:
        'Es ist dieselbe Folge wie beim Fall «Zwei Ecken vorn, die Farben nach hinten» des geführten Weges. Wer sie dort gelernt hat, wendet sie hier unverändert an; steht das Kreuz bereits, bleibt von der ganzen Orientierung nur noch das Drehen der Ecken übrig.\n\n' +
        'Die vier Kanten oben rührt die Folge nicht an, das Kreuz steht danach also unverändert. Neun Züge, und kürzer geht es nicht. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    crossTwoUpDiagonal: {
      name: 'Kreuz, zwei Ecken über Eck',
      bild:
        'Alle vier oberen Kanten zeigen die Farbe der Oberseite nach oben; das Kreuz steht bereits. Zwei der vier oberen Ecken zeigen sie ebenfalls schon nach oben, und sie liegen einander diagonal gegenüber; die beiden anderen zeigen ihre Oberfarbe an zwei benachbarte Seitenflächen.\n\n' +
        'Drehe die obere Ebene, bis eine der beiden fertigen Ecken vorn rechts liegt; die andere liegt dann hinten links. Rechts und vorn zeigt keine Seitenfläche oben die Farbe der Oberseite.',
      erklaerung:
        'Es ist dieselbe Folge wie beim Fall «Zwei Ecken über Eck» des geführten Weges. Wer sie dort gelernt hat, wendet sie hier unverändert an; steht das Kreuz bereits, bleibt von der ganzen Orientierung nur noch das Drehen der Ecken übrig.\n\n' +
        'Die vier Kanten oben rührt die Folge nicht an, das Kreuz steht danach also unverändert. Die gespiegelte Fassung für die linke Hand steht auch hier nicht: Sie verlangt die fertigen Ecken in der anderen Diagonale. Die Alternative daneben greift dieselbe Haltung mit anderen Seiten.',
    },
    crossOneUpFrontLeft: {
      name: 'Kreuz, eine Ecke vorn links',
      bild:
        'Alle vier oberen Kanten zeigen die Farbe der Oberseite nach oben; das Kreuz steht bereits. Nur eine der vier oberen Ecken zeigt sie ebenfalls nach oben, und genau eine Seitenfläche zeigt in ihrer obersten Reihe gar keine Oberfarbe, die drei anderen je eine.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche vorn liegt. Die fertige Ecke liegt dann vorn links. Liegt sie vorn rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist dieselbe Folge wie beim Fall «Eine Ecke vorn links» des geführten Weges. Wer sie dort gelernt hat, wendet sie hier unverändert an; steht das Kreuz bereits, bleibt von der ganzen Orientierung nur noch das Drehen der Ecken übrig.\n\n' +
        'Die Folge vertauscht dabei die vier oberen Ecken und drei der oberen Kanten. Gekippt wird dabei keine einzige Kante, das Kreuz bleibt also stehen, und wo die Steine liegen, ordnen die beiden folgenden Blicke. Die gespiegelte Fassung für die linke Hand steht hier nicht, denn sie löst den Fall daneben.',
    },
    crossOneUpFrontRight: {
      name: 'Kreuz, eine Ecke vorn rechts',
      bild:
        'Alle vier oberen Kanten zeigen die Farbe der Oberseite nach oben; das Kreuz steht bereits. Nur eine der vier oberen Ecken zeigt sie ebenfalls nach oben, und genau eine Seitenfläche zeigt in ihrer obersten Reihe gar keine Oberfarbe, die drei anderen je eine.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche vorn liegt. Die fertige Ecke liegt dann vorn rechts. Liegt sie vorn links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit der fertigen Ecke vorn links, und es ist dieselbe Folge wie beim Fall «Eine Ecke vorn rechts» des geführten Weges. Sieben Züge, und sie kommt mit der rechten und der oberen Seite aus.\n\n' +
        'Die Folge vertauscht dabei die vier oberen Ecken und drei der oberen Kanten. Gekippt wird dabei keine einzige Kante, das Kreuz bleibt also stehen.',
    },
    crossNoneUpBackPair: {
      name: 'Kreuz, keine Ecke oben, das Paar hinten',
      bild:
        'Alle vier oberen Kanten zeigen die Farbe der Oberseite nach oben; das Kreuz steht bereits. Keine der vier oberen Ecken zeigt sie nach oben. Genau eine Seitenfläche zeigt in ihrer obersten Reihe gar keine Oberfarbe, eine zeigt sie zweimal, die beiden anderen je einmal.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche ohne Oberfarbe vorn liegt. Die mit den beiden Oberfarben liegt dann hinten.',
      erklaerung:
        'Es ist dieselbe Folge wie beim Fall «Keine Ecke oben, das Paar hinten» des geführten Weges. Wer sie dort gelernt hat, wendet sie hier unverändert an; steht das Kreuz bereits, bleibt von der ganzen Orientierung nur noch das Drehen der Ecken übrig.\n\n' +
        'Neun Züge, und sie greift nur zwei Seiten. Wo Ecken und Kanten oben danach liegen, sagt dieser Fall nicht zu; das ordnen die beiden folgenden Blicke. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    crossNoneUpSidePairs: {
      name: 'Kreuz, keine Ecke oben, zwei Paare seitlich',
      bild:
        'Alle vier oberen Kanten zeigen die Farbe der Oberseite nach oben; das Kreuz steht bereits. Keine der vier oberen Ecken zeigt sie nach oben. Zwei einander gegenüberliegende Seitenflächen zeigen in ihrer obersten Reihe die Oberfarbe gleich zweimal, die beiden anderen gar nicht.\n\n' +
        'Drehe die obere Ebene, bis die beiden Seitenflächen ohne Oberfarbe vorn und hinten liegen. Welche von beiden vorn liegt, spielt keine Rolle: Der Fall sieht nach einer halben Drehung genau so aus wie zuvor.',
      erklaerung:
        'Es ist dieselbe Folge wie beim Fall «Keine Ecke oben, zwei Paare seitlich» des geführten Weges. Elf Züge, und sie ist damit die längste dieser sieben und zugleich die aus nur zwei Seiten.\n\n' +
        'Keine der vier oberen Ecken wechselt dabei ihren Platz; sie werden allein gedreht. Die drei oberen Kanten wandern dagegen mit, gekippt wird jedoch keine, und das Kreuz bleibt stehen. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    lineAllUp: {
      name: 'Linie, alle vier Ecken stehen',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Alle vier oberen Ecken zeigen die Farbe dagegen bereits nach oben. Zwei einander gegenüberliegende Seitenflächen tragen in ihrer obersten Reihe genau ein Feld in der Farbe der Oberseite, nämlich an ihrer Kante; die beiden anderen tragen dort keines.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und hinten liegen. Die Linie liegt dann quer vor dir, von links nach rechts. Welche der beiden vorn liegt, ist gleichgültig: Der Fall sieht nach einer halben Drehung gleich aus, und die Folge wirkt aus beiden Haltungen.',
      erklaerung:
        'Zwölf Züge über die vordere, die rechte und die obere Seite. Es ist einer der drei Fälle, bei denen allein die Kanten zu kippen sind, und die Folge aus Lektion 5 kommt dafür nicht in Frage: Sie verdrehte die vier Ecken, die hier bereits stehen.\n\n' +
        'Die vier oberen Ecken stehen vor der Folge und stehen danach wieder, unterwegs wandern sie; die Folge nimmt die vier Kanten oben dabei mit. Über alle Seiten gäbe es sie mit zehn Zügen, dann aber über vier Seiten statt über drei. Die Alternative daneben greift dieselbe Haltung mit der linken Hand.',
    },
    lineTwoUpFrontSplitCrosswise: {
      name: 'Linie quer, zwei Ecken vorn, die Farben zur Seite',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe nach rechts und nach links, also an zwei einander gegenüberliegende Seitenflächen.\n\n' +
        'Drehe die obere Ebene, bis die beiden fertigen Ecken vorn liegen. Die Linie liegt dann quer vor dir, von links nach rechts, und jede der vier Seitenflächen trägt oben genau ein Feld in der Farbe der Oberseite. Liegen die fertigen Ecken hinten, ist es dasselbe Bild in der falschen Haltung.',
      erklaerung:
        'Elf Züge über die vordere, die rechte und die obere Seite. Der Fall daneben zeigt dasselbe Eckenbild mit längs liegender Linie und verlangt eine andere Folge; die Richtung der Linie ist hier also kein Beiwerk, sondern das Unterscheidungsmerkmal.\n\n' +
        'Die Folge kippt die beiden liegenden Kanten und dreht die beiden liegenden Ecken in einem Zug; sie nimmt die vier Kanten oben dabei mit. Die Alternative daneben greift dieselbe Haltung mit der linken Hand.',
    },
    lineTwoUpFrontShared: {
      name: 'Linie quer, zwei Ecken vorn, die Farben nach hinten',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe auf dieselbe Seitenfläche, deren oberste Reihe die Farbe damit dreimal trägt.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche hinten liegt. Die beiden fertigen Ecken liegen dann vorn, und die Linie liegt quer vor dir, von links nach rechts.',
      erklaerung:
        'Acht Züge über die hintere, die rechte und die obere Seite. Es ist eine der kürzesten Folgen des vollen Umfangs, und sie arbeitet hinten statt vorn: Die Seitenfläche mit den beiden Oberfarben ist die, an der die Folge ansetzt.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken und drei der oberen Kanten. Die Alternative daneben greift dieselbe Haltung mit der linken Hand.',
    },
    lineTwoUpDiagonalFrontRight: {
      name: 'Linie quer, zwei Ecken über Eck ab vorn rechts',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen einander diagonal gegenüber; die beiden anderen zeigen ihre Oberfarbe an zwei benachbarte Seitenflächen.\n\n' +
        'Drehe die obere Ebene, bis eine der beiden fertigen Ecken vorn rechts liegt; die andere liegt dann hinten links. Die Linie liegt quer vor dir, von links nach rechts, und rechts trägt die oberste Reihe kein einziges Feld in der Farbe der Oberseite. Liegt die fertige Ecke vorn links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Neun Züge über die vordere, die rechte und die obere Seite. Die rechte Hand greift, und das folgt dem Fall: Die vordere der beiden fertigen Ecken liegt rechts, und der gespiegelte Fall daneben wird von der gespiegelten Folge gelöst.\n\n' +
        'Über die Kanten und die Ecken sagt dieser Fall nichts zu, was über seine Pflicht hinausginge; wo sie danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben greift dieselbe Haltung mit der linken Hand, gehalten von zwei Zügen der rechten.',
    },
    lineOneUpFrontLeftLengthwise: {
      name: 'Linie längs, eine Ecke vorn links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben, und genau eine Seitenfläche zeigt in ihrer obersten Reihe gar keine Oberfarbe.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche vorn liegt. Die fertige Ecke liegt dann vorn links, und die Linie liegt längs vor dir, von vorn nach hinten. Liegt die fertige Ecke vorn rechts, ist es der gespiegelte Fall und nicht dieser.',
      erklaerung:
        'Zehn Züge über die vordere, die rechte und die obere Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt.\n\n' +
        'Über die Kanten und die Ecken sagt dieser Fall nichts zu, was über seine Pflicht hinausginge; wo sie danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben greift dieselbe Haltung mit der linken Hand.',
    },
    lineTwoUpFrontSplitLengthwise: {
      name: 'Linie längs, zwei Ecken vorn, die Farben zur Seite',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe nach rechts und nach links.\n\n' +
        'Drehe die obere Ebene, bis die beiden fertigen Ecken vorn liegen. Die Linie liegt dann längs vor dir, von vorn nach hinten. Rechts und links trägt die oberste Reihe je zwei Felder in der Farbe der Oberseite, vorn und hinten kein einziges; daran erkennst du die richtige Haltung, denn hier zeigt keine Seitenfläche allein für sich, wohin zu drehen ist.',
      erklaerung:
        'Acht Züge über die vordere, die rechte und die obere Seite. Es ist derselbe Eckenfall wie bei der quer liegenden Linie daneben, und trotzdem eine andere Folge: Die Linie liegt hier längs, und was sie zu kippen hat, liegt damit an anderen Seiten.\n\n' +
        'Die drei oberen Kanten wandern dabei mit. Die Alternative daneben greift dieselbe Haltung mit der linken Hand.',
    },
    lineTwoUpRightShared: {
      name: 'Linie quer, zwei Ecken rechts, die Farben nach links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe auf dieselbe Seitenfläche, deren oberste Reihe die Farbe damit zweimal trägt.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche links liegt. Die beiden fertigen Ecken liegen dann rechts nebeneinander, und die Linie liegt quer vor dir, von links nach rechts.',
      erklaerung:
        'Sechs Züge über die vordere, die rechte und die obere Seite, und damit die kürzeste Folge des ganzen vollen Umfangs. Sie ist zugleich der einzige Fall dieser Gruppe, bei dem die fertigen Ecken nicht vorn liegen; der geführte Weg kennt denselben Eckenfall mit den Ecken vorn, hier lässt die Linie das nicht zu.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken und drei der oberen Kanten. Die Alternative daneben ist eine zweite Folge derselben Haltung über die hintere statt die vordere Seite; auch sie greift die rechte Hand, denn eine linkshändige Folge verlangte hier die gespiegelte Haltung mit den fertigen Ecken links.',
    },
    lineOneUpFrontRightCrosswise: {
      name: 'Linie quer, eine Ecke vorn rechts',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben, und genau eine Seitenfläche zeigt in ihrer obersten Reihe die Oberfarbe zweimal, die drei anderen je einmal.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit den beiden Oberfarben hinten liegt. Die fertige Ecke liegt dann vorn rechts, und die Linie liegt quer vor dir, von links nach rechts. Liegt die fertige Ecke vorn links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Elf Züge über die vordere, die rechte und die obere Seite. Es ist ein Zug mehr als die kürzeste, die es für diesen Fall gibt, und dafür bleibt die Hand bei drei Seiten statt vier.\n\n' +
        'Über die Kanten und die Ecken sagt dieser Fall nichts zu, was über seine Pflicht hinausginge; wo sie danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben greift dieselbe Haltung mit der linken Hand und nimmt dafür die hintere Seite dazu.',
    },
    lineOneUpFrontLeftCrosswise: {
      name: 'Linie quer, eine Ecke vorn links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben, und genau eine Seitenfläche zeigt in ihrer obersten Reihe die Oberfarbe zweimal, die drei anderen je einmal.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit den beiden Oberfarben hinten liegt. Die fertige Ecke liegt dann vorn links, und die Linie liegt quer vor dir, von links nach rechts. Liegt die fertige Ecke vorn rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit der fertigen Ecke vorn rechts, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der linken Hand aus. Elf Züge über die vordere, die linke und die obere Seite.\n\n' +
        'Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    lineTwoUpDiagonalFrontLeft: {
      name: 'Linie quer, zwei Ecken über Eck ab vorn links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen einander diagonal gegenüber; die beiden anderen zeigen ihre Oberfarbe an zwei benachbarte Seitenflächen.\n\n' +
        'Drehe die obere Ebene, bis eine der beiden fertigen Ecken vorn links liegt; die andere liegt dann hinten rechts. Die Linie liegt quer vor dir, von links nach rechts, und links trägt die oberste Reihe kein einziges Feld in der Farbe der Oberseite. Liegt die fertige Ecke vorn rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit der fertigen Ecke vorn rechts, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der linken Hand aus. Neun Züge über die linke, die vordere und die obere Seite.\n\n' +
        'Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    lineNoneUpBackPairLengthwise: {
      name: 'Linie längs, keine Ecke oben, das Paar hinten',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Keine der vier oberen Ecken zeigt die Farbe nach oben, und genau eine Seitenfläche zeigt in ihrer obersten Reihe gar keine Oberfarbe.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche vorn liegt. Die Linie liegt dann längs vor dir, von vorn nach hinten, und hinten kleben zwei Oberfarben an den Ecken.',
      erklaerung:
        'Zehn Züge über die rechte, die hintere und die obere Seite. Sie arbeitet hinten statt vorn, denn dort liegen die beiden Ecken, deren Oberfarbe auf dieselbe Seitenfläche zeigt.\n\n' +
        'Keine der vier oberen Ecken wechselt dabei ihren Platz; sie werden allein gedreht. Die drei oberen Kanten wandern dagegen mit. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    lineNoneUpSidePairsCrosswise: {
      name: 'Linie quer, keine Ecke oben, zwei Paare seitlich',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Keine der vier oberen Ecken zeigt die Farbe nach oben. Zwei einander gegenüberliegende Seitenflächen zeigen in ihrer obersten Reihe die Oberfarbe zweimal, die beiden anderen je einmal.\n\n' +
        'Drehe die obere Ebene, bis die beiden Seitenflächen mit je einer Oberfarbe vorn und hinten liegen. Die Linie liegt dann quer vor dir, von links nach rechts. Welche der beiden vorn liegt, spielt keine Rolle: Der Fall sieht nach einer halben Drehung genau so aus wie zuvor.',
      erklaerung:
        'Zwölf Züge über die vordere, die rechte und die obere Seite, und damit die längste Folge dieses Kantenbildes.\n\n' +
        'Die drei oberen Kanten wandern dabei mit, gekippt wird jedoch keine, und die Linie bleibt stehen. Wo die vier oberen Ecken danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    lineNoneUpBackPairCrosswise: {
      name: 'Linie quer, keine Ecke oben, das Paar hinten',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Keine der vier oberen Ecken zeigt die Farbe nach oben, und genau eine Seitenfläche zeigt in ihrer obersten Reihe die Oberfarbe gleich dreimal.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche hinten liegt. Die Linie liegt dann quer vor dir, von links nach rechts.',
      erklaerung:
        'Zehn Züge über die vordere, die rechte und die obere Seite, und sie beginnt mit demselben Griff wie die kürzeste Folge des ganzen vollen Umfangs.\n\n' +
        'Die Folge vertauscht dabei die vier oberen Ecken. Wie die oberen Kanten danach liegen, sagt dieser Fall nicht zu; das ordnen die beiden folgenden Blicke. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    lineOneUpFrontRightLengthwise: {
      name: 'Linie längs, eine Ecke vorn rechts',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben, und genau eine Seitenfläche zeigt in ihrer obersten Reihe gar keine Oberfarbe.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche vorn liegt. Die fertige Ecke liegt dann vorn rechts, und die Linie liegt längs vor dir, von vorn nach hinten. Liegt die fertige Ecke vorn links, ist es der gespiegelte Fall und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit der fertigen Ecke vorn links, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der linken Hand aus. Zehn Züge über die vordere, die linke und die obere Seite.\n\n' +
        'Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    lineNoneUpSidePairsLengthwise: {
      name: 'Linie längs, keine Ecke oben, zwei Paare seitlich',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen einander gegenüber; Lektion 5 nennt dieses Bild die Linie. Keine der vier oberen Ecken zeigt die Farbe nach oben. Zwei einander gegenüberliegende Seitenflächen zeigen in ihrer obersten Reihe die Oberfarbe gleich dreimal, die beiden anderen gar nicht.\n\n' +
        'Drehe die obere Ebene, bis die beiden Seitenflächen ohne Oberfarbe vorn und hinten liegen. Die Linie liegt dann längs vor dir, von vorn nach hinten. Welche der beiden vorn liegt, spielt keine Rolle: Der Fall sieht nach einer halben Drehung genau so aus wie zuvor.',
      erklaerung:
        'Elf Züge über die vordere, die rechte und die obere Seite.\n\n' +
        'Die drei oberen Kanten wandern dabei mit, gekippt wird jedoch keine, und die Linie bleibt stehen. Wo die vier oberen Ecken danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    dotAllUp: {
      name: 'Punkt, alle vier Ecken stehen',
      bild:
        'Keine der vier oberen Kanten zeigt die Farbe der Oberseite nach oben; sichtbar ist oben allein die Mitte, und Lektion 5 nennt dieses Bild den Punkt. Alle vier oberen Ecken zeigen die Farbe dagegen bereits nach oben. Jede der vier Seitenflächen trägt in ihrer obersten Reihe genau einmal die Farbe der Oberseite, nämlich an ihrer Kante.\n\n' +
        'Hier ist nichts auszurichten. Der Fall sieht aus jeder Haltung gleich aus, und die Folge wirkt aus jeder.',
      erklaerung:
        'Es ist der einzige dieser acht Fälle, bei dem allein die Kanten zu kippen sind. Die Folge des Punktes aus dem geführten Weg hilft hier trotzdem nicht: Sie kippt die Kanten und verdreht dabei die Ecken, und die stehen hier bereits.\n\n' +
        'Dreizehn Züge, und sie kommt mit drei Seiten aus; eine zwölfzügige gibt es, die greift vier Seiten und verlangt zwei Gegengriffe zugleich. Sie versetzt alle vier oberen Ecken und nimmt die vier Kanten oben dabei mit; wo die Steine danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    dotTwoUpFrontSplit: {
      name: 'Punkt, zwei Ecken vorn, die Farben zur Seite',
      bild:
        'Keine der vier oberen Kanten zeigt die Farbe der Oberseite nach oben; sichtbar ist oben allein die Mitte, und Lektion 5 nennt dieses Bild den Punkt. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe nach rechts und nach links, also an zwei einander gegenüberliegende Seitenflächen.\n\n' +
        'Drehe die obere Ebene, bis die beiden fertigen Ecken vorn liegen. Rechts und links trägt die oberste Reihe dann zweimal die Farbe der Oberseite, vorn und hinten nur einmal, nämlich an der Kante.',
      erklaerung:
        'Elf Züge über die rechte, die hintere und die obere Seite. Sie kippt die vier Kanten und dreht die beiden hinteren Ecken in einem Durchgang; ein zweiter ist für diesen Fall nicht zu lernen.\n\n' +
        'Die drei oberen Kanten wandern dabei mit; wo die Steine danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben greift dieselbe Haltung mit der linken Hand.',
    },
    dotTwoUpFrontShared: {
      name: 'Punkt, zwei Ecken vorn, die Farben nach hinten',
      bild:
        'Keine der vier oberen Kanten zeigt die Farbe der Oberseite nach oben; sichtbar ist oben allein die Mitte, und Lektion 5 nennt dieses Bild den Punkt. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe auf dieselbe Seitenfläche.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche hinten liegt. Ihre oberste Reihe trägt dann dreimal die Farbe der Oberseite, die drei anderen je einmal.',
      erklaerung:
        'Zwölf Züge über die vordere, die rechte und die obere Seite, und damit einer mehr als bei den meisten dieser acht. Elf Züge reichen bei diesem Fall nur aus einer anderen Haltung heraus, und die wäre für den Anwender eine zweite Ausrichtung und kein Gewinn.\n\n' +
        'Was die Folge mit den Ecken und Kanten oben anstellt, sagt dieser Fall nicht zu; das ordnen die beiden folgenden Blicke. Die Alternative daneben greift dieselbe Haltung mit der linken Hand.',
    },
    dotTwoUpDiagonal: {
      name: 'Punkt, zwei Ecken über Eck',
      bild:
        'Keine der vier oberen Kanten zeigt die Farbe der Oberseite nach oben; sichtbar ist oben allein die Mitte, und Lektion 5 nennt dieses Bild den Punkt. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen einander diagonal gegenüber; die beiden anderen zeigen ihre Oberfarbe an zwei benachbarte Seitenflächen.\n\n' +
        'Drehe die obere Ebene, bis eine der beiden fertigen Ecken vorn rechts liegt; die andere liegt dann hinten links. Hinten und links trägt die oberste Reihe zweimal die Farbe der Oberseite, vorn und rechts nur einmal.',
      erklaerung:
        'Elf Züge über die rechte, die hintere und die obere Seite. Die gespiegelte Fassung steht hier nicht als Alternative: Sie verlangt die fertigen Ecken in der anderen Diagonale.\n\n' +
        'Die drei oberen Kanten wandern dabei mit; wo die Steine danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben greift dieselbe Haltung mit der linken und der vorderen Seite.',
    },
    dotOneUpFrontLeft: {
      name: 'Punkt, eine Ecke vorn links',
      bild:
        'Keine der vier oberen Kanten zeigt die Farbe der Oberseite nach oben; sichtbar ist oben allein die Mitte, und Lektion 5 nennt dieses Bild den Punkt. Nur eine der vier oberen Ecken zeigt die Farbe bereits nach oben, und genau eine Seitenfläche trägt in ihrer obersten Reihe nichts als die Farbe ihrer Kante; die drei anderen tragen eine Ecke dazu.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche vorn liegt. Die fertige Ecke liegt dann vorn links. Liegt sie vorn rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Elf Züge über die linke, die hintere und die obere Seite. Hier greift die linke Hand, und das folgt dem Fall: Die fertige Ecke liegt links, und der gespiegelte Fall daneben wird ebenso von der gespiegelten Folge gelöst.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken und nimmt die vier Kanten oben dabei mit. Die Alternative daneben greift dieselbe Haltung mit der rechten Hand; die Spiegelung dieser Folge ist sie nicht, denn die löst den Fall daneben.',
    },
    dotOneUpFrontRight: {
      name: 'Punkt, eine Ecke vorn rechts',
      bild:
        'Keine der vier oberen Kanten zeigt die Farbe der Oberseite nach oben; sichtbar ist oben allein die Mitte, und Lektion 5 nennt dieses Bild den Punkt. Nur eine der vier oberen Ecken zeigt die Farbe bereits nach oben, und genau eine Seitenfläche trägt in ihrer obersten Reihe nichts als die Farbe ihrer Kante; die drei anderen tragen eine Ecke dazu.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche vorn liegt. Die fertige Ecke liegt dann vorn rechts. Liegt sie vorn links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit der fertigen Ecke vorn links, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der rechten Hand aus. Elf Züge über die rechte, die hintere und die obere Seite.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken und nimmt die vier Kanten oben dabei mit. Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    dotNoneUpBackPair: {
      name: 'Punkt, keine Ecke oben, das Paar hinten',
      bild:
        'Keine der vier oberen Kanten zeigt die Farbe der Oberseite nach oben; sichtbar ist oben allein die Mitte, und Lektion 5 nennt dieses Bild den Punkt. Auch keine der vier oberen Ecken zeigt die Farbe nach oben. Genau eine Seitenfläche trägt in ihrer obersten Reihe nichts als die Farbe ihrer Kante, eine trägt zwei Ecken dazu, die beiden anderen je eine.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit den beiden Ecken hinten liegt. Vorn liegt dann die, die allein ihre Kante zeigt.',
      erklaerung:
        'Elf Züge über die rechte, die hintere und die obere Seite. Sie ist die kürzeste, die dieses Bild aus dieser Haltung löst.\n\n' +
        'Die Folge nimmt die vier Kanten oben dabei mit; wo Ecken und Kanten danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben ist dieselbe Bewegung für die linke Hand.',
    },
    dotNoneUpSidePairs: {
      name: 'Punkt, keine Ecke oben, zwei Paare seitlich',
      bild:
        'Keine der vier oberen Kanten zeigt die Farbe der Oberseite nach oben; sichtbar ist oben allein die Mitte, und Lektion 5 nennt dieses Bild den Punkt. Auch keine der vier oberen Ecken zeigt die Farbe nach oben. Zwei einander gegenüberliegende Seitenflächen tragen in ihrer obersten Reihe dreimal die Farbe der Oberseite, die beiden anderen nur einmal, nämlich an ihrer Kante.\n\n' +
        'Drehe die obere Ebene, bis die beiden Seitenflächen mit der einen Farbe vorn und hinten liegen. Welche von beiden vorn liegt, spielt keine Rolle: Der Fall sieht nach einer halben Drehung genau so aus wie zuvor.',
      erklaerung:
        'Elf Züge über die rechte, die vordere und die obere Seite. Weil der Fall sich unter der halben Drehung nicht ändert, trägt seine Klasse halb so viele Lagen wie die der übrigen sieben.\n\n' +
        'Die Folge nimmt die vier Kanten oben dabei mit; wo die Steine danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben greift dieselbe Haltung mit der hinteren statt der vorderen Seite.',
    },
    angleAllUp: {
      name: 'Winkel, alle vier Ecken oben',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Alle vier oberen Ecken zeigen die Farbe bereits nach oben, und deshalb trägt keine Seitenfläche an ihren Ecken auch nur ein Feld in der Oberfarbe.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und rechts liegen. Genau diese beiden Seitenflächen tragen dann in ihrer obersten Reihe je ein einziges Feld in der Farbe der Oberseite, links und hinten keines.',
      erklaerung:
        'Neun Züge über die hintere, die rechte und die vordere Seite. Es ist der dritte und letzte Fall, bei dem allein die Kanten zu kippen sind, und wie die beiden anderen braucht er eine eigene Folge: Die Folge des Kantenkippens aus Lektion 5 verdrehte hier die Ecken, die bereits stehen.\n\n' +
        'Die drei oberen Kanten wandern dabei mit. Die Alternative daneben greift mit der linken Hand und nimmt dafür zwei Züge mehr.',
    },
    angleTwoUpBackSplitRight: {
      name: 'Winkel vorn rechts, zwei Ecken hinten, die Farben zur Seite',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe nach rechts und nach links, also voneinander weg. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden gedrehten.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und rechts liegen. Die beiden fertigen Ecken liegen dann hinten, rechts trägt die oberste Reihe zwei Felder in der Farbe der Oberseite und hinten kein einziges. Liegen die beiden Kanten vorn und links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Neun Züge über die hintere, die rechte und die obere Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt.\n\n' +
        'Über die Kanten und die Ecken sagt dieser Fall nichts zu, was über seine Pflicht hinausginge; wo sie danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben greift dieselbe Haltung mit der linken Hand.',
    },
    angleTwoUpRightSharedLeft: {
      name: 'Winkel vorn links, zwei Ecken rechts, die Farben nach links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe auf dieselbe Seitenfläche, deren oberste Reihe die Farbe damit dreimal trägt. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden gedrehten.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche links liegt. Die beiden fertigen Ecken liegen dann rechts nebeneinander, und die beiden Kanten, die noch nicht stehen, liegen vorn und links.',
      erklaerung:
        'Sechs Züge über die vordere, die linke und die obere Seite, und damit die kürzeste Folge dieses Kantenbildes. Sie ist die Spiegelung der Folge, die Lektion 5 für den Winkel lehrt, und sie leistet hier mehr als dort: Sie stellt die Ecken gleich mit.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken, und drei der oberen Kanten wandern dabei mit. Die Alternative daneben greift dieselbe Haltung mit der rechten Hand und nimmt dafür zwei Züge mehr.',
    },
    angleTwoUpDiagonalFrontLeftLeft: {
      name: 'Winkel vorn links, zwei Ecken über Eck ab vorn links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen einander diagonal gegenüber; die beiden anderen zeigen ihre Oberfarbe an zwei benachbarte Seitenflächen. Jede der vier Seitenflächen trägt oben genau ein Feld in der Farbe der Oberseite, und die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden fertigen.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und links liegen. Eine der beiden fertigen Ecken liegt dann vorn links, die andere hinten rechts. Liegen die beiden Kanten vorn und rechts, ist es dasselbe Bild in der falschen Haltung.',
      erklaerung:
        'Neun Züge über die hintere, die rechte und die obere Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt. Sie arbeitet auf der dem Winkel abgewandten Seite, denn dort liegt die zweite fertige Ecke.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken, und drei der oberen Kanten wandern dabei mit. Die Alternative daneben greift dieselbe Haltung mit der linken Hand und nimmt dafür einen Zug mehr.',
    },
    angleOneUpBackLeftRight: {
      name: 'Winkel vorn rechts, eine Ecke hinten links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben. Von den vier Seitenflächen zeigt eine in ihrer obersten Reihe gar kein Feld in der Farbe der Oberseite, die daneben genau eines, und die beiden übrigen je zwei. Die fertige Ecke liegt zwischen den beiden erstgenannten.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit dem einen Feld hinten liegt. Die leere Seitenfläche liegt dann links, die fertige Ecke hinten links, und die beiden Kanten, die noch nicht stehen, liegen vorn und rechts. Liegt die leere Seitenfläche rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Sieben Züge über die hintere, die vordere und die rechte Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken. Die Alternative daneben greift dieselbe Haltung mit der linken Hand und nimmt dafür einen Zug mehr.',
    },
    angleTwoUpBackSplitLeft: {
      name: 'Winkel vorn links, zwei Ecken hinten, die Farben zur Seite',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe nach rechts und nach links, also voneinander weg. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden gedrehten.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und links liegen. Die beiden fertigen Ecken liegen dann hinten, links trägt die oberste Reihe zwei Felder in der Farbe der Oberseite und hinten kein einziges. Liegen die beiden Kanten vorn und rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn rechts, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der linken Hand aus. Neun Züge über die hintere, die linke und die obere Seite.\n\n' +
        'Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    angleTwoUpDiagonalFrontRightRight: {
      name: 'Winkel vorn rechts, zwei Ecken über Eck ab vorn rechts',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen einander diagonal gegenüber; die beiden anderen zeigen ihre Oberfarbe an zwei einander gegenüberliegende Seitenflächen. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden fertigen.\n\n' +
        'Hier sagt das Bild von sich aus nicht, wohin zu drehen ist, und deshalb steht es hier ausdrücklich: Zwei benachbarte Seitenflächen tragen in ihrer obersten Reihe je zwei Felder in der Farbe der Oberseite, die beiden anderen kein einziges. Drehe die obere Ebene, bis diese beiden Seitenflächen rechts und vorn liegen. Die beiden Kanten, die noch nicht stehen, liegen dann ebenfalls vorn und rechts.',
      erklaerung:
        'Acht Züge über die vordere, die rechte und die obere Seite. Er ist der einzige der dreizehn, dessen Bild keine Seitenfläche vor den anderen auszeichnet; alle vier sind gleich weit vom Ziel entfernt, und die Haltung steht deshalb im Erkennungsbild statt in der Ansage.\n\n' +
        'Die drei oberen Kanten wandern dabei mit. Die Alternative daneben greift dieselbe Haltung mit der linken Hand und nimmt dafür einen Zug mehr.',
    },
    angleTwoUpLeftSharedRight: {
      name: 'Winkel vorn rechts, zwei Ecken links, die Farben nach rechts',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe auf dieselbe Seitenfläche, deren oberste Reihe die Farbe damit dreimal trägt. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden gedrehten.\n\n' +
        'Drehe die obere Ebene, bis diese eine Seitenfläche rechts liegt. Die beiden fertigen Ecken liegen dann links nebeneinander, und die beiden Kanten, die noch nicht stehen, liegen vorn und rechts.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn links, und die Folge ist dessen Spiegelung. Sie ist zugleich genau die Folge, die Lektion 5 für den Winkel lehrt: Wer sie von dort kennt, kann sie hier unverändert anwenden und stellt die Ecken gleich mit. Sechs Züge über die vordere, die rechte und die obere Seite.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken, und drei der oberen Kanten wandern dabei mit. Die Alternative daneben ist die Spiegelung der Alternative von dort.',
    },
    angleOneUpBackRightLeft: {
      name: 'Winkel vorn links, eine Ecke hinten rechts',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben. Von den vier Seitenflächen zeigt eine in ihrer obersten Reihe gar kein Feld in der Farbe der Oberseite, die daneben genau eines, und die beiden übrigen je zwei. Die fertige Ecke liegt zwischen den beiden erstgenannten.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit dem einen Feld hinten liegt. Die leere Seitenfläche liegt dann rechts, die fertige Ecke hinten rechts, und die beiden Kanten, die noch nicht stehen, liegen vorn und links. Liegt die leere Seitenfläche links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn rechts, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der linken Hand aus. Sieben Züge über die hintere, die vordere und die linke Seite.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken auch hier. Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    angleTwoUpFrontSharedLeft: {
      name: 'Winkel vorn links, zwei Ecken vorn, die Farben nach hinten',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe auf dieselbe Seitenfläche. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden fertigen.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und links liegen. Die beiden fertigen Ecken liegen dann vorn, und hinten trägt die oberste Reihe zwei Felder in der Farbe der Oberseite, rechts kein einziges. Liegen die beiden Kanten vorn und rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Elf Züge über die vordere, die rechte und die obere Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt. Sie ist die längste der dreizehn, und der Grund liegt am Fall: Die beiden gedrehten Ecken liegen hinten, die zu kippenden Kanten vorn und links.\n\n' +
        'Über die Kanten und die Ecken sagt dieser Fall nichts zu, was über seine Pflicht hinausginge; wo sie danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben greift dieselbe Haltung mit der linken Hand, gleich lang.',
    },
    angleOneUpBackRightRight: {
      name: 'Winkel vorn rechts, eine Ecke hinten rechts',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben. Von den vier Seitenflächen zeigt eine in ihrer obersten Reihe gar kein Feld in der Farbe der Oberseite, die daneben genau eines, und die beiden übrigen je zwei. Die fertige Ecke liegt an der leeren Seitenfläche, und zwar an dem Ende, das von der mit dem einen Feld weg zeigt.\n\n' +
        'Drehe die obere Ebene, bis die leere Seitenfläche hinten liegt. Die Seitenfläche mit dem einen Feld liegt dann links, die fertige Ecke hinten rechts, und die beiden Kanten, die noch nicht stehen, liegen vorn und rechts. Liegt die fertige Ecke hinten links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Sieben Züge über die hintere, die vordere und die rechte Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt.\n\n' +
        'Die drei oberen Kanten wandern dabei mit. Die Alternative daneben greift dieselbe Haltung mit der linken Hand und nimmt dafür drei Züge mehr.',
    },
    angleTwoUpDiagonalFrontRightLeft: {
      name: 'Winkel vorn links, zwei Ecken über Eck ab vorn rechts',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen einander diagonal gegenüber; die beiden anderen zeigen ihre Oberfarbe an zwei benachbarte Seitenflächen. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden gedrehten.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und links liegen. Eine der beiden fertigen Ecken liegt dann vorn rechts, die andere hinten links, und rechts trägt die oberste Reihe kein einziges Feld in der Farbe der Oberseite. Liegen die beiden Kanten vorn und rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Zehn Züge über die vordere, die rechte und die obere Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken und nimmt die vier Kanten oben dabei mit. Die Alternative daneben greift dieselbe Haltung mit der linken Hand, gleich lang.',
    },
    angleOneUpFrontLeftLeft: {
      name: 'Winkel vorn links, eine Ecke vorn links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben. Keine Seitenfläche bleibt in ihrer obersten Reihe ganz ohne die Farbe der Oberseite: Eine trägt sie allein in der Mitte, eine zweite zweimal, die beiden übrigen je einmal an einer Ecke.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit dem einzelnen Feld in der Mitte vorn liegt. Die Seitenfläche mit den beiden Feldern liegt dann links, die fertige Ecke vorn links, und die beiden Kanten, die noch nicht stehen, liegen vorn und links. Liegt die fertige Ecke vorn rechts, ist es der Fall daneben und nicht dieser.',
      erklaerung:
        'Zehn Züge über die vordere, die linke und die obere Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt.\n\n' +
        'Über die Kanten und die Ecken sagt dieser Fall nichts zu, was über seine Pflicht hinausginge; wo sie danach liegen, ordnen die beiden folgenden Blicke. Die Alternative daneben greift dieselbe Haltung mit der rechten Hand und nimmt dafür einen Zug mehr.',
    },
    angleOneUpFrontLeftRight: {
      name: 'Winkel vorn rechts, eine Ecke vorn links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben. Keine Seitenfläche bleibt in ihrer obersten Reihe ganz ohne die Farbe der Oberseite: Eine trägt sie allein in der Mitte, eine zweite zweimal, die beiden übrigen je einmal an einer Ecke.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit dem einzelnen Feld in der Mitte vorn liegt. Die Seitenfläche mit den beiden Feldern liegt dann rechts, die fertige Ecke vorn links, und die beiden Kanten, die noch nicht stehen, liegen vorn und rechts. Liegt die fertige Ecke vorn rechts, ist es der Fall daneben und nicht dieser.',
      erklaerung:
        'Elf Züge über die vordere, die linke und die obere Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt. Sie ist mit dem gespiegelten Fall daneben die längste der acht, und der Grund liegt am Fall: Die fertige Ecke liegt am Winkel, aber nicht an seiner Spitze.\n\n' +
        'Keine der vier oberen Ecken wechselt dabei ihren Platz. Die Alternative daneben greift dieselbe Haltung mit der rechten Hand, nimmt dafür einen Zug mehr und arbeitet über die hintere Seite statt über die obere.',
    },
    angleNoneUpBackPairLeft: {
      name: 'Winkel vorn links, keine Ecke oben, das Paar hinten',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Keine der vier oberen Ecken zeigt die Farbe nach oben. Von den vier Seitenflächen zeigen zwei in ihrer obersten Reihe je zwei Felder in der Farbe der Oberseite und zwei je eines; die beiden mit den zwei Feldern grenzen aneinander.\n\n' +
        'Drehe die obere Ebene, bis die beiden Seitenflächen mit je zwei Feldern hinten und links liegen. Die beiden Kanten, die noch nicht stehen, liegen dann vorn und links. Liegen sie vorn und rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Zehn Züge über die linke, die vordere und die obere Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt.\n\n' +
        'Die drei oberen Kanten wandern dabei mit. Die Alternative daneben greift dieselbe Haltung mit der rechten Hand und nimmt dafür zwei Züge mehr; bis elf Züge gibt es für die rechte Hand hier keine einzige Folge.',
    },
    angleTwoUpFrontSplitRight: {
      name: 'Winkel vorn rechts, zwei Ecken vorn, die Farben zur Seite',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe nach rechts und nach links, also voneinander weg. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden fertigen.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und rechts liegen. Die beiden fertigen Ecken liegen dann vorn, rechts trägt die oberste Reihe zwei Felder in der Farbe der Oberseite und hinten kein einziges. Liegen die beiden Kanten vorn und links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Zehn Züge über die vordere, die linke und die obere Seite. Hier greift die linke Hand, und das folgt dem Fall: Die Folge arbeitet auf der Seite, die dem Winkel gegenüberliegt, und der Winkel liegt rechts.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken und nimmt die vier Kanten oben dabei mit. Die Alternative daneben greift dieselbe Haltung mit der rechten Hand und nimmt dafür einen Zug mehr.',
    },
    angleNoneUpSidePairsRight: {
      name: 'Winkel vorn rechts, keine Ecke oben, zwei Paare seitlich',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Keine der vier oberen Ecken zeigt die Farbe nach oben. Von den vier Seitenflächen zeigt eine in ihrer obersten Reihe drei Felder in der Farbe der Oberseite, eine zwei, eine eines und eine gar keines; die mit den drei Feldern und die leere grenzen aneinander.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit den drei Feldern rechts liegt. Die leere liegt dann hinten, die mit den zwei Feldern links, und die beiden Kanten, die noch nicht stehen, liegen vorn und rechts.',
      erklaerung:
        'Elf Züge über die hintere, die rechte und die obere Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt.\n\n' +
        'Die drei oberen Kanten wandern dabei mit. Die Alternative daneben greift dieselbe Haltung mit der linken Hand und nimmt dafür einen Zug mehr.',
    },
    angleNoneUpFrontPairRight: {
      name: 'Winkel vorn rechts, keine Ecke oben, das Paar vorn',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Keine der vier oberen Ecken zeigt die Farbe nach oben. Von den vier Seitenflächen zeigt eine in ihrer obersten Reihe drei Felder in der Farbe der Oberseite, eine zwei, eine eines und eine gar keines; die mit den drei Feldern und die leere liegen einander gegenüber.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit den drei Feldern vorn liegt. Die leere liegt dann hinten, die mit den zwei Feldern rechts, und die beiden Kanten, die noch nicht stehen, liegen vorn und rechts.',
      erklaerung:
        'Neun Züge über die vordere, die rechte und die obere Seite, und es ist zugleich die kürzeste Folge, die es für diesen Fall überhaupt gibt. Sie ist mit ihrem Spiegelbild die kürzeste der sechs Folgen dieser Gruppe.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken und drei der oberen Kanten. Die Alternative daneben greift dieselbe Haltung mit der linken Hand und ist genauso lang.',
    },
    angleTwoUpFrontSplitLeft: {
      name: 'Winkel vorn links, zwei Ecken vorn, die Farben zur Seite',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe nach rechts und nach links, also voneinander weg. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden fertigen.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und links liegen. Die beiden fertigen Ecken liegen dann vorn, links trägt die oberste Reihe zwei Felder in der Farbe der Oberseite und hinten kein einziges. Liegen die beiden Kanten vorn und rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn rechts, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der rechten Hand aus. Zehn Züge über die vordere, die rechte und die obere Seite.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken und nimmt die vier Kanten oben dabei mit, wie die gespiegelte auch. Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    angleTwoUpDiagonalFrontLeftRight: {
      name: 'Winkel vorn rechts, zwei Ecken über Eck ab vorn links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen einander diagonal gegenüber; die beiden anderen zeigen ihre Oberfarbe an zwei benachbarte Seitenflächen. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden gedrehten.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und rechts liegen. Eine der beiden fertigen Ecken liegt dann vorn links, die andere hinten rechts, und links trägt die oberste Reihe kein einziges Feld in der Farbe der Oberseite. Liegen die beiden Kanten vorn und links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn links, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der linken Hand aus. Zehn Züge über die vordere, die linke und die obere Seite.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken und nimmt die vier Kanten oben dabei mit, wie die gespiegelte auch. Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    angleOneUpFrontRightLeft: {
      name: 'Winkel vorn links, eine Ecke vorn rechts',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben. Keine Seitenfläche bleibt in ihrer obersten Reihe ganz ohne die Farbe der Oberseite: Eine trägt sie allein in der Mitte, eine zweite zweimal, die beiden übrigen je einmal an einer Ecke.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit dem einzelnen Feld in der Mitte vorn liegt. Die Seitenfläche mit den beiden Feldern liegt dann links, die fertige Ecke vorn rechts, und die beiden Kanten, die noch nicht stehen, liegen vorn und links. Liegt die fertige Ecke vorn links, ist es der Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn rechts, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der rechten Hand aus. Elf Züge über die vordere, die rechte und die obere Seite.\n\n' +
        'Keine der vier oberen Ecken wechselt auch hier ihren Platz. Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    angleTwoUpFrontSharedRight: {
      name: 'Winkel vorn rechts, zwei Ecken vorn, die Farben nach hinten',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Zwei der vier oberen Ecken zeigen die Farbe bereits nach oben, und sie liegen nebeneinander; die beiden anderen zeigen ihre Oberfarbe auf dieselbe Seitenfläche. Die Ecke, an der die beiden noch nicht stehenden Kanten zusammenstoßen, ist eine der beiden fertigen.\n\n' +
        'Drehe die obere Ebene, bis die beiden Kanten, die noch nicht stehen, vorn und rechts liegen. Die beiden fertigen Ecken liegen dann vorn, und hinten trägt die oberste Reihe zwei Felder in der Farbe der Oberseite, links kein einziges. Liegen die beiden Kanten vorn und links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn links, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der linken Hand aus. Elf Züge über die vordere, die linke und die obere Seite.\n\n' +
        'Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    angleNoneUpBackPairRight: {
      name: 'Winkel vorn rechts, keine Ecke oben, das Paar hinten',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Keine der vier oberen Ecken zeigt die Farbe nach oben. Von den vier Seitenflächen zeigen zwei in ihrer obersten Reihe je zwei Felder in der Farbe der Oberseite und zwei je eines; die beiden mit den zwei Feldern grenzen aneinander.\n\n' +
        'Drehe die obere Ebene, bis die beiden Seitenflächen mit je zwei Feldern hinten und rechts liegen. Die beiden Kanten, die noch nicht stehen, liegen dann vorn und rechts. Liegen sie vorn und links, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn links, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der rechten Hand aus. Zehn Züge über die rechte, die vordere und die obere Seite.\n\n' +
        'Die drei oberen Kanten wandern dabei auch hier mit. Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort und nimmt zwei Züge mehr.',
    },
    angleNoneUpSidePairsLeft: {
      name: 'Winkel vorn links, keine Ecke oben, zwei Paare seitlich',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Keine der vier oberen Ecken zeigt die Farbe nach oben. Von den vier Seitenflächen zeigt eine in ihrer obersten Reihe drei Felder in der Farbe der Oberseite, eine zwei, eine eines und eine gar keines; die mit den drei Feldern und die leere grenzen aneinander.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit den drei Feldern links liegt. Die leere liegt dann hinten, die mit den zwei Feldern rechts, und die beiden Kanten, die noch nicht stehen, liegen vorn und links.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn rechts, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der linken Hand aus. Elf Züge über die hintere, die linke und die obere Seite.\n\n' +
        'Die drei oberen Kanten wandern dabei auch hier mit. Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort und nimmt einen Zug mehr.',
    },
    angleOneUpFrontRightRight: {
      name: 'Winkel vorn rechts, eine Ecke vorn rechts',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben. Keine Seitenfläche bleibt in ihrer obersten Reihe ganz ohne die Farbe der Oberseite: Eine trägt sie allein in der Mitte, eine zweite zweimal, die beiden übrigen je einmal an einer Ecke.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit dem einzelnen Feld in der Mitte vorn liegt. Die Seitenfläche mit den beiden Feldern liegt dann rechts, die fertige Ecke vorn rechts, und die beiden Kanten, die noch nicht stehen, liegen vorn und rechts. Liegt die fertige Ecke vorn links, ist es der Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn links, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der rechten Hand aus. Zehn Züge über die vordere, die rechte und die obere Seite.\n\n' +
        'Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    angleNoneUpFrontPairLeft: {
      name: 'Winkel vorn links, keine Ecke oben, das Paar vorn',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Keine der vier oberen Ecken zeigt die Farbe nach oben. Von den vier Seitenflächen zeigt eine in ihrer obersten Reihe drei Felder in der Farbe der Oberseite, eine zwei, eine eines und eine gar keines; die mit den drei Feldern und die leere liegen einander gegenüber.\n\n' +
        'Drehe die obere Ebene, bis die Seitenfläche mit den drei Feldern vorn liegt. Die leere liegt dann hinten, die mit den zwei Feldern links, und die beiden Kanten, die noch nicht stehen, liegen vorn und links.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn rechts, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der linken Hand aus. Neun Züge über die vordere, die linke und die obere Seite.\n\n' +
        'Die Folge versetzt alle vier oberen Ecken und drei der oberen Kanten auch hier. Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort und ist genauso lang.',
    },
    angleOneUpBackLeftLeft: {
      name: 'Winkel vorn links, eine Ecke hinten links',
      bild:
        'Genau zwei der vier oberen Kanten zeigen die Farbe der Oberseite nach oben, und sie liegen nebeneinander; Lektion 5 nennt dieses Bild den Winkel. Nur eine der vier oberen Ecken zeigt die Farbe ebenfalls nach oben. Von den vier Seitenflächen zeigt eine in ihrer obersten Reihe gar kein Feld in der Farbe der Oberseite, die daneben genau eines, und die beiden übrigen je zwei. Die fertige Ecke liegt an der leeren Seitenfläche, und zwar an dem Ende, das von der mit dem einen Feld weg zeigt.\n\n' +
        'Drehe die obere Ebene, bis die leere Seitenfläche hinten liegt. Die Seitenfläche mit dem einen Feld liegt dann rechts, die fertige Ecke hinten links, und die beiden Kanten, die noch nicht stehen, liegen vorn und links. Liegt die fertige Ecke hinten rechts, ist es der gespiegelte Fall daneben und nicht dieser.',
      erklaerung:
        'Es ist der gespiegelte Fall zu dem mit dem Winkel vorn rechts, und die Folge ist dessen Spiegelung: Wer sie dort gelernt hat, führt hier dieselbe Bewegung mit der linken Hand aus. Sieben Züge über die hintere, die vordere und die linke Seite.\n\n' +
        'Die drei oberen Kanten wandern auch hier mit. Die Alternative daneben ist ebenso die Spiegelung der Alternative von dort.',
    },
    cornerRightEdgeRightUp: {
      name: 'Ecke nach rechts, Kante rechts, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der rechten Seitenfläche und weder nach oben noch nach vorn. Die Kante liegt dann unmittelbar daneben, oben rechts, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nach oben.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung als der, in der du den Fall erkennst: Drehe die obere Ebene weiter, bis die Ecke oben hinten rechts liegt, also eine Vierteldrehung hinter ihrer Lücke.',
      erklaerung:
        'Das Paar liegt beisammen und steht doch falsch zueinander: Die Ecke schaut zur Seite, die Kante kehrt ihre vordere Farbe nach oben. In dieser Stellung geht es nicht in einem Griff hinein.\n\n' +
        'Die Folge greift deshalb zweimal zur rechten Seite. Der erste Griff richtet das Paar her, der zweite legt es ein; sieben Züge über die rechte Seite und die obere Ebene, und die Hand bleibt die ganze Zeit an derselben Stelle.\n\n' +
        'Ohne den Fall gingst du denselben Weg von Hand: erst die Ecke allein einsetzen, dann die Kante mit der Folge nachschieben, die die Lektion über die zweite Schicht lehrt. Der Fall spart dir nicht die Züge, sondern das Überlegen.',
    },
    cornerRightEdgeRightSide: {
      name: 'Ecke nach rechts, Kante rechts, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der rechten Seitenfläche. Die Kante liegt unmittelbar daneben, oben rechts, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nicht nach oben, sondern an die Seitenfläche.\n\n' +
        'Aus genau dieser Stellung wird gearbeitet: Die Ecke steht über ihrer Lücke, und die obere Ebene wird nicht weitergedreht.',
      erklaerung:
        'Ecke und Kante liegen nebeneinander, und beide zeigen ihre Farben an dieselbe Seitenfläche. Das sieht nach einem fertigen Paar aus und ist keines: Die beiden Farben gehören an verschiedene Seiten der Lücke.\n\n' +
        'Die Folge nimmt die beiden deshalb zuerst auseinander. Der Griff zur rechten Seite schickt die Ecke nach unten und wieder hoch, der Griff zur Vorderseite legt danach das gerichtete Paar ein; sieben Züge, und beide Hände sind beteiligt.\n\n' +
        'Ohne den Fall setzt du die Ecke zuerst allein ein und schiebst die Kante hinterher nach. Der Fall macht daraus einen einzigen Durchgang.',
    },
    cornerRightEdgeFrontUp: {
      name: 'Ecke nach rechts, Kante vorn, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der rechten Seitenfläche. Die Kante liegt oben vorn, also an der anderen Seite der Lücke, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nach oben.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben vorn links liegt, also eine Vierteldrehung vor ihrer Lücke.',
      erklaerung:
        'Ecke und Kante liegen zu beiden Seiten der Lücke, und keiner der beiden Steine steht so, dass er ohne Vorbereitung hineinginge. Die Folge nimmt sich deshalb erst die Kante vor und legt danach das Paar ein.\n\n' +
        'Der Griff zur Vorderseite richtet die Kante her, der Griff zur rechten Seite legt ein; sieben Züge, beide Hände beteiligt, und nur eine halbe Drehung darin. Die Alternative daneben ist neun Züge lang und trägt drei halbe Drehungen; sie ist ein zweiter Weg und keine zweite Hand.\n\n' +
        'Ohne den Fall bringst du erst die Ecke unter und holst die Kante danach nach. Was der Fall dir abnimmt, ist die Frage, in welcher Reihenfolge.',
    },
    cornerRightEdgeFrontSide: {
      name: 'Ecke nach rechts, Kante vorn, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der rechten Seitenfläche. Die Kante liegt oben vorn, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nicht nach oben, sondern an die Seitenfläche.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten rechts liegt. Das Paar steht dann fertig beisammen, und die Kante folgt der Ecke.',
      erklaerung:
        'Das ist der kürzeste Fall der ganzen Stufe: drei Züge. Ecke und Kante stehen bereits richtig zueinander, sie müssen nur noch gemeinsam hinein. Die Vorderseite geht auf, die obere Ebene bringt das Paar nach, die Vorderseite geht zu.\n\n' +
        'Er ist einer der beiden Griffe, aus denen sich alle übrigen Fälle dieser Gruppe zusammensetzen; wer ihn sicher kann, erkennt ihn in den längeren Folgen wieder. Die Alternative daneben braucht sechs Züge und beginnt an der rechten Seite; sie steht da, weil dieselbe Bewegung mit der anderen Hand hier nicht zu haben ist.\n\n' +
        'Ohne den Fall wäre auch dieser Weg zwei Griffe lang, denn die Ecke käme zuerst allein hinunter.',
    },
    cornerRightEdgeLeftUp: {
      name: 'Ecke nach rechts, Kante links, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der rechten Seitenfläche. Die Kante liegt der Ecke schräg gegenüber, oben links, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nach oben.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten rechts liegt.',
      erklaerung:
        'Es ist derselbe Weg wie beim Fall «Ecke nach rechts, Kante rechts, Farbe oben»: zweimal derselbe Griff zur rechten Seite, dazwischen eine Drehung der oberen Ebene. Wer jenen kann, führt hier dieselbe Bewegung mit anderen Drehungen dazwischen aus.\n\n' +
        'Der Unterschied liegt allein darin, wo die Kante wartet. Sieben Züge, die Hand bleibt an der rechten Seite.',
    },
    cornerRightEdgeLeftSide: {
      name: 'Ecke nach rechts, Kante links, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der rechten Seitenfläche. Die Kante liegt der Ecke schräg gegenüber, oben links, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr an die Seitenfläche.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben vorn links liegt, also eine Vierteldrehung vor ihrer Lücke.',
      erklaerung:
        'Die beiden Steine stehen weit auseinander, und die Kante zeigt ihre Farbe zur falschen Seite. Die Folge greift deshalb zweimal zur Vorderseite: Der erste Griff bringt die Kante in die richtige Kippung, der zweite legt das Paar ein.\n\n' +
        'Sieben Züge über die Vorderseite und die obere Ebene, ganz ohne die rechte Seite. Das ist die linke Hand dieses Blicks; eine Fassung für die rechte gibt es bei diesem Fall nicht, und die Alternative daneben ist deshalb ein zweiter Weg und keine zweite Hand.\n\n' +
        'Ohne den Fall bräuchtest du auch hier zwei Anläufe, und der zweite wäre erst nach dem ersten zu erkennen.',
    },
    cornerRightEdgeBackUp: {
      name: 'Ecke nach rechts, Kante hinten, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der rechten Seitenfläche. Die Kante liegt der Ecke schräg gegenüber, oben hinten, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nach oben.\n\n' +
        'Aus genau dieser Stellung wird gearbeitet: Die Ecke steht über ihrer Lücke, und die obere Ebene wird nicht weitergedreht.',
      erklaerung:
        'Drei Züge, und es ist der Griff, den jeder zuerst lernt: Die rechte Seite geht auf, die obere Ebene bringt die Kante nach, die rechte Seite geht zu. Ecke und Kante fahren dabei gemeinsam hinunter.\n\n' +
        'Er ist der zweite der beiden Griffe, aus denen sich alle übrigen Fälle dieser Gruppe zusammensetzen. Die Alternative daneben braucht sieben Züge und greift dieselbe Seite; sie ist ein zweiter Weg und nicht dieselbe Bewegung für die andere Hand, denn welche Hand einen Fall einlegt, entscheidet bei dieser Stufe der Fall und nicht du.\n\n' +
        'Ohne ihn setzt du die Ecke zuerst allein ein und schiebst die Kante danach mit der Folge aus der Lektion über die zweite Schicht nach; zwei Griffe statt eines.',
    },
    cornerRightEdgeBackSide: {
      name: 'Ecke nach rechts, Kante hinten, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der rechten Seitenfläche. Die Kante liegt der Ecke schräg gegenüber, oben hinten, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr an die Seitenfläche.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben vorn links liegt.',
      erklaerung:
        'Es ist derselbe Weg wie beim Fall «Ecke nach rechts, Kante links, Farbe zur Seite»: zweimal derselbe Griff zur Vorderseite, dazwischen eine Drehung der oberen Ebene. Wer jenen kann, führt hier dieselbe Bewegung mit anderen Drehungen dazwischen aus.\n\n' +
        'Der Unterschied liegt allein darin, wo die Kante wartet. Sieben Züge über die Vorderseite und die obere Ebene.',
    },
    cornerFrontEdgeRightUp: {
      name: 'Ecke nach vorn, Kante rechts, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der vorderen Seitenfläche und weder nach oben noch nach rechts. Die Kante liegt oben rechts, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nach oben.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung als der, in der du den Fall erkennst: Drehe die obere Ebene weiter, bis die Ecke oben vorn links liegt, also eine Vierteldrehung vor ihrer Lücke.',
      erklaerung:
        'Drei Züge, und mehr braucht dieser Fall nicht: Die rechte Seite geht auf, die obere Ebene bringt das Paar nach, die rechte Seite geht zu. Ecke und Kante fahren dabei gemeinsam hinunter.\n\n' +
        'Er ist einer der beiden Griffe, aus denen sich alle übrigen Fälle dieser Gruppe zusammensetzen; wer ihn sicher kann, erkennt ihn in den längeren Folgen wieder. Die Alternative daneben braucht sechs Züge und beginnt an der Vorderseite; sie ist ein zweiter Weg und nicht dieselbe Bewegung für die andere Hand, denn welche Hand einen Fall einlegt, entscheidet bei dieser Stufe der Fall und nicht du.\n\n' +
        'Ohne den Fall setzt du die Ecke zuerst allein ein und schiebst die Kante danach mit der Folge aus der Lektion über die zweite Schicht nach; zwei Griffe statt eines.',
    },
    cornerFrontEdgeRightSide: {
      name: 'Ecke nach vorn, Kante rechts, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der vorderen Seitenfläche. Die Kante liegt unmittelbar daneben, oben rechts, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nicht nach oben, sondern an die Seitenfläche.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten rechts liegt, also eine Vierteldrehung hinter ihrer Lücke.',
      erklaerung:
        'Ecke und Kante liegen nebeneinander und stehen doch falsch zueinander: Die Ecke kehrt ihre untere Farbe nach vorn, die Kante ihre vordere zur Seite. In dieser Stellung geht das Paar nicht in einem Griff hinein.\n\n' +
        'Die Folge nimmt deshalb beide Seiten. Der Griff zur rechten Seite richtet das Paar her, der Griff zur Vorderseite legt es ein; sieben Züge und darin nur eine halbe Drehung, beide Hände beteiligt.\n\n' +
        'Ohne den Fall setzt du die Ecke zuerst allein ein und holst die Kante hinterher nach. Der Fall spart dir nicht die Züge, sondern das Überlegen, in welcher Reihenfolge.',
    },
    cornerFrontEdgeFrontUp: {
      name: 'Ecke nach vorn, Kante vorn, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der vorderen Seitenfläche. Die Kante liegt oben vorn, also an der anderen Seite der Lücke, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nach oben.\n\n' +
        'Aus genau dieser Stellung wird gearbeitet: Die Ecke steht über ihrer Lücke, und die obere Ebene wird nicht weitergedreht.',
      erklaerung:
        'Ecke und Kante liegen zu beiden Seiten der Lücke, und keiner der beiden Steine steht so, dass er ohne Vorbereitung hineinginge.\n\n' +
        'Die Folge beginnt deshalb an der Vorderseite und richtet die Kante her, und erst der zweite Griff zur rechten Seite legt das Paar ein; sieben Züge mit einer halben Drehung darin. Die Alternative daneben ist neun Züge lang und kommt ohne jede halbe Drehung aus.\n\n' +
        'Ohne den Fall bringst du erst die Ecke unter und holst die Kante danach nach. Was der Fall dir abnimmt, ist die Frage, welcher der beiden Steine zuerst an die Reihe kommt.',
    },
    cornerFrontEdgeFrontSide: {
      name: 'Ecke nach vorn, Kante vorn, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der vorderen Seitenfläche. Die Kante liegt oben vorn, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr an dieselbe Seitenfläche wie die untere Farbe der Ecke.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben vorn links liegt, also eine Vierteldrehung vor ihrer Lücke.',
      erklaerung:
        'Beide Steine kehren ihre Farbe derselben Seitenfläche zu. Das sieht nach einem fertigen Paar aus und ist keines: Die beiden Farben gehören an verschiedene Seiten der Lücke.\n\n' +
        'Die Folge greift deshalb zweimal zur Vorderseite. Der erste Griff nimmt die beiden auseinander, der zweite legt sie gerichtet ein; sieben Züge ganz ohne die rechte Seite und ohne eine einzige halbe Drehung. Das ist die linke Hand dieses Blicks, und eine Fassung für die rechte gibt es bei diesem Fall nicht.\n\n' +
        'Ohne den Fall bräuchtest du zwei Anläufe, und der zweite wäre erst nach dem ersten zu erkennen.',
    },
    cornerFrontEdgeLeftUp: {
      name: 'Ecke nach vorn, Kante links, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der vorderen Seitenfläche. Die Kante liegt der Ecke schräg gegenüber, oben links, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nach oben.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten rechts liegt.',
      erklaerung:
        'Die beiden Steine stehen weit auseinander, und die Ecke steht dazu verkehrt. Die Folge greift deshalb zweimal denselben Griff zur rechten Seite: Der erste dreht die Ecke zurecht, der zweite legt das Paar ein.\n\n' +
        'Sieben Züge über die rechte Seite und die obere Ebene, die Hand bleibt die ganze Zeit an derselben Stelle. Zwei der Drehungen sind halbe, und das ist der Preis dafür, dass die Folge ohne die Vorderseite auskommt.\n\n' +
        'Ohne den Fall setzt du die Ecke zuerst allein ein und schiebst die Kante danach nach; der Fall macht daraus einen einzigen Durchgang.',
    },
    cornerFrontEdgeLeftSide: {
      name: 'Ecke nach vorn, Kante links, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der vorderen Seitenfläche. Die Kante liegt der Ecke schräg gegenüber, oben links, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr an die Seitenfläche.\n\n' +
        'Aus genau dieser Stellung wird gearbeitet: Die Ecke steht über ihrer Lücke, und die obere Ebene wird nicht weitergedreht.',
      erklaerung:
        'Drei Züge, und es ist der Griff der linken Hand: Die Vorderseite geht auf, die obere Ebene bringt die Kante nach, die Vorderseite geht zu. Ecke und Kante fahren dabei gemeinsam hinunter.\n\n' +
        'Er ist der zweite der beiden Griffe, aus denen sich alle übrigen Fälle dieser Gruppe zusammensetzen. Die Alternative daneben braucht sieben Züge und greift dieselbe Seite; sie ist ein zweiter Weg und keine zweite Hand.\n\n' +
        'Ohne ihn wäre auch dieser Weg zwei Griffe lang, denn die Ecke käme zuerst allein hinunter.',
    },
    cornerFrontEdgeBackUp: {
      name: 'Ecke nach vorn, Kante hinten, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der vorderen Seitenfläche. Die Kante liegt der Ecke schräg gegenüber, oben hinten, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nach oben.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten rechts liegt.',
      erklaerung:
        'Es ist derselbe Weg wie beim Fall «Ecke nach vorn, Kante links, Farbe oben»: zweimal derselbe Griff zur rechten Seite, dazwischen eine Drehung der oberen Ebene. Wer jenen kann, führt hier dieselbe Bewegung mit anderen Drehungen dazwischen aus.\n\n' +
        'Der Unterschied liegt allein darin, wo die Kante wartet. Sieben Züge, und es ist nur eine halbe Drehung darin statt zweier.',
    },
    cornerFrontEdgeBackSide: {
      name: 'Ecke nach vorn, Kante hinten, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite an der vorderen Seitenfläche. Die Kante liegt der Ecke schräg gegenüber, oben hinten, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr an die Seitenfläche.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten rechts liegt.',
      erklaerung:
        'Es ist derselbe Weg wie beim Fall «Ecke nach vorn, Kante rechts, Farbe zur Seite»: erst der Griff zur rechten Seite, der das Paar herrichtet, dann der Griff zur Vorderseite, der es einlegt.\n\n' +
        'Der Unterschied liegt allein darin, wo die Kante wartet. Sieben Züge, und diese Fassung kommt ohne jede halbe Drehung aus.',
    },
    cornerUpEdgeRightUp: {
      name: 'Ecke nach oben, Kante rechts, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite nach oben und an keiner der beiden Seitenflächen. Die Kante liegt unmittelbar daneben, oben rechts, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr ebenfalls nach oben.\n\n' +
        'Aus genau dieser Stellung wird gearbeitet: Die Ecke steht über ihrer Lücke, und die obere Ebene wird nicht weitergedreht.',
      erklaerung:
        'Die Ecke schaut mit ihrer unteren Farbe nach oben, und das ist die unbequemste Lage, die sie haben kann: Sie muss sich drehen, bevor sie hineinpasst, und die Kante wartet daneben.\n\n' +
        'Die Folge greift deshalb zweimal denselben Griff zur rechten Seite. Der erste dreht die Ecke, der zweite legt das Paar ein; sieben Züge, die Hand bleibt an derselben Stelle, und nur eine der Drehungen ist eine halbe.\n\n' +
        'Ohne den Fall setzt du die Ecke zuerst allein ein und schiebst die Kante danach mit der Folge aus der Lektion über die zweite Schicht nach; zwei Griffe statt eines.',
    },
    cornerUpEdgeRightSide: {
      name: 'Ecke nach oben, Kante rechts, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite nach oben. Die Kante liegt oben rechts, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nicht nach oben, sondern an die Seitenfläche.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten links liegt, also ihrer Lücke gegenüber.',
      erklaerung:
        'Es ist einer der beiden schwersten Fälle dieser Stufe, und der Grund steht in der Folge selbst: Sie lässt sich nicht in die vier Griffe zerlegen, die du kennst. Sie beginnt und endet mit einer halben Drehung der Vorderseite und schiebt das Paar dazwischen zurecht.\n\n' +
        'Sieben Züge, alle über die Vorderseite und die obere Ebene, drei davon halbe Drehungen. Es gibt auch hier einen Weg aus bekannten Griffen, doch er braucht neun Züge und eine andere Stellung; die kürzere Folge ist den fremden Griff wert.\n\n' +
        'Ohne den Fall bringst du erst die Ecke unter und holst die Kante danach nach. Der Fall spart dir dabei mehr als bei den anderen, denn die Ecke steht hier besonders ungünstig.',
    },
    cornerUpEdgeFrontUp: {
      name: 'Ecke nach oben, Kante vorn, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite nach oben. Die Kante liegt oben vorn, also an der anderen Seite der Lücke, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr ebenfalls nach oben.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten links liegt, also ihrer Lücke gegenüber.',
      erklaerung:
        'Es ist das Gegenstück zum Fall «Ecke nach oben, Kante rechts, Farbe zur Seite», nur an der rechten Seite statt an der Vorderseite, und es ist der zweite Fall, dessen Folge sich nicht in die bekannten Griffe zerlegen lässt.\n\n' +
        'Sieben Züge über die rechte Seite und die obere Ebene, davon drei halbe Drehungen. Auch hier gäbe es einen Weg aus bekannten Griffen mit neun Zügen und anderer Stellung; die kürzere Folge steht vorn.\n\n' +
        'Ohne den Fall setzt du die Ecke zuerst allein und schiebst die Kante hinterher nach. Was der Fall dir abnimmt, ist der zweite Anlauf.',
    },
    cornerUpEdgeFrontSide: {
      name: 'Ecke nach oben, Kante vorn, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite nach oben. Die Kante liegt oben vorn, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr nicht nach oben, sondern an die Seitenfläche.\n\n' +
        'Aus genau dieser Stellung wird gearbeitet: Die Ecke steht über ihrer Lücke, und die obere Ebene wird nicht weitergedreht.',
      erklaerung:
        'Die Ecke schaut nach oben, die Kante kehrt ihre vordere Farbe zur Seite: Beide stehen falsch, und keiner der beiden geht ohne Vorbereitung hinein.\n\n' +
        'Die Folge greift deshalb zweimal denselben Griff zur Vorderseite. Der erste richtet her, der zweite legt ein; sieben Züge ganz ohne die rechte Seite, und nur eine der Drehungen ist eine halbe. Das ist die linke Hand dieses Blicks.\n\n' +
        'Ohne den Fall bräuchtest du zwei Anläufe, und der zweite wäre erst nach dem ersten zu erkennen.',
    },
    cornerUpEdgeLeftUp: {
      name: 'Ecke nach oben, Kante links, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite nach oben. Die Kante liegt der Ecke schräg gegenüber, oben links, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr ebenfalls nach oben.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten links liegt.',
      erklaerung:
        'Es ist der kürzeste Fall dieser Gruppe, und er liest sich als zwei bekannte Griffe hintereinander: Der Griff zur Vorderseite bringt die Kante an ihren Platz, der Griff zur rechten Seite legt das Paar ein.\n\n' +
        'Sechs Züge, beide Hände beteiligt, und keine einzige halbe Drehung darin. Die Alternative daneben ist gleich lang und greift zuerst rechts; sie ist ein zweiter Weg und keine zweite Hand.\n\n' +
        'Ohne den Fall gingst du denselben Weg in zwei Anläufen: erst die Ecke, dann die Kante. Der Fall zieht beides zusammen.',
    },
    cornerUpEdgeLeftSide: {
      name: 'Ecke nach oben, Kante links, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite nach oben. Die Kante liegt der Ecke schräg gegenüber, oben links, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr an die Seitenfläche.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten rechts liegt.',
      erklaerung:
        'Es ist derselbe Weg wie beim Fall «Ecke nach oben, Kante vorn, Farbe zur Seite»: zweimal derselbe Griff zur Vorderseite, dazwischen eine Drehung der oberen Ebene. Der Unterschied liegt allein darin, wo die Kante wartet.\n\n' +
        'Sieben Züge. Die Alternative daneben ist einen Zug kürzer, verlangt dafür aber einen Griff, den diese Stufe nicht lehrt; wer die sechs Züge lieber nimmt, findet sie dort.',
    },
    cornerUpEdgeBackUp: {
      name: 'Ecke nach oben, Kante hinten, Farbe oben',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite nach oben. Die Kante liegt der Ecke schräg gegenüber, oben hinten, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr ebenfalls nach oben.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben vorn links liegt, also eine Vierteldrehung vor ihrer Lücke.',
      erklaerung:
        'Es ist derselbe Weg wie beim Fall «Ecke nach oben, Kante rechts, Farbe oben»: zweimal derselbe Griff zur rechten Seite, dazwischen eine Drehung der oberen Ebene. Der Unterschied liegt allein darin, wo die Kante wartet.\n\n' +
        'Sieben Züge, die Hand bleibt an der rechten Seite. Die Alternative daneben ist einen Zug kürzer und verlangt dafür einen Griff, den diese Stufe nicht lehrt.',
    },
    cornerUpEdgeBackSide: {
      name: 'Ecke nach oben, Kante hinten, Farbe zur Seite',
      bild:
        'Beide Steine des Paares liegen in der oberen Ebene. Drehst du die Ecke über ihre Lücke, so zeigt die Farbe der Unterseite nach oben. Die Kante liegt der Ecke schräg gegenüber, oben hinten, und die Farbe, die im Platz nach vorn gehört, zeigt bei ihr an die Seitenfläche.\n\n' +
        'Gearbeitet wird aus einer anderen Stellung: Drehe die obere Ebene weiter, bis die Ecke oben hinten links liegt.',
      erklaerung:
        'Auch dieser Fall liest sich als zwei bekannte Griffe hintereinander, nur in der anderen Reihenfolge als der Fall mit der Kante links: Der Griff zur rechten Seite geht voran, der Griff zur Vorderseite legt ein.\n\n' +
        'Sechs Züge, beide Hände beteiligt, keine halbe Drehung. Damit ist er zusammen mit jenem der kürzeste Fall dieser Gruppe; unter sechs Zügen geht hier keiner.\n\n' +
        'Ohne den Fall wären es auch hier zwei Anläufe. Wer die Gruppe zu Ende gelernt hat, kennt für jede Lage der oberen Ebene den einen Griff, der Ecke und Kante gemeinsam hinunterbringt.',
    },
  },
};
