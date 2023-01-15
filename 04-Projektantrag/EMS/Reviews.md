# Review 21.11.22 (Schröder)

- Projektantrag in Unterordner `EMS` übersiedeln
- Originalzustand im Ordner `04-Projektantrag` wiederherstellen

## Ausgangslage

- Wenn ich das richtig mitbekommen habe, haben zwei aus dem Team eine Infrastruktur zu Hause, die Sie mit diesem Projekt aufwerten wollen
  - Dann beschreiben Sie bitte genau, welche Komponenten von welchen Herstellern das sind und welche Funktion sie haben
  - Beschreiben Sie auch genau, wie momentan das UI aussieht, dass zur Steuerung bzw. zur Visualisierung der Funktionskomponenten zur Verfügung stehen
  - Dann erst wissen wir genau wie die Ausgangslage aussieht

**Hintergrund**:

- Die Inkompatibilität zwischen mehreren Herstellern durch dieses Projekt zu beheben/auszugleichen halte ich für ein sehr ambitioniertes Ziel, praktikabler finde ich es, wenn Sie ein Visualisierungssystem für exakt das Setup, das Sie zu Hause haben, bauen
  - ist dann auch besser testbar
  - aber halt möglicherweise gar nicht herstellerunabhängig sondern sehr maßgeschneidert => besser als gar nichts ;-)

## Zielsetzung

- Was ich auch noch nicht verstehe: Wollen Sie auch ein Steuerungssystem bauen? Siehe "Selbsterzeugten Strom bestmöglich zu verwenden und erst dann die überschüssige Energie ins Netz einzuspeisen." - was soll man sich darunter vorstellen?

- Ebenso: "Es gibt zwei Möglichkeiten um die überschüssige Energie selbst zu verwenden, je nach Priorisierung wird zuerst der Haus interne Speicher zur Ladung verwendet oder das E-Auto über die Ladestation."

  - Soll Ihr System hier Einfluß nehmen und die Prio konfigurieren? Oder wie hängt das mit Ihrem neuen Projekt zusammen?

- Mindmap
  - Layout ist kein Feature => rauslassen
  - Darkmode passt nicht zu "Stromverbrauch hinzufügen"
  - Was heißt "Stomverbrauch hinzufügen"?
  - Welche Konfigurationseingaben => das erscheint mir ein zentrales feature zu sein => genauer!
  - Wieso heißt die Gruppe rechts unten "Features" - sind die anderen Teilbäume keine Features?
  - Steuerung der zur Verfügung stehenden Energie und Energiezufuhrpriorisierung => Kernfeatures? Genauer! Wie soll das gehen?
  - Wechselrichter-Schnittstelle - wie schaut die aus, was kann die?
  - Visualisierung der Daten und Statistik sind getrennte Teilbäume, ich glaube das sollte man zusammenziehen bzw. genauer beschreiben welche daten visualisiert werden

## SWOT-Analyse

Neu erarbeiten:

- Stärken: Warum ist es unbedingt notwendig, dieses Projekt zu machen
- Schwächen: Warum ist die Projektidee vlt. keine gute Idee
- Chancen: Was bringt's dem Team, wenn dieses Projekt genehmigt wird?
- Herausforderungen: Welche Schwierigkeiten könnten bei der Umsetzung des Projekts entstehen?

## 4. Projektablauf => Planung

Die zentrale Aufgabe dieses Punktes ist einer Zerlegung der Kernfeatures des Systems in eine zeitliche Reihenfolge nach Wichtigkeit. Das ist mir derzeit viel zu ungenau. Aber arbeiten Sie dazu zuerst die Zielsetzung in 2 genauer heraus, dann ersten planen.
