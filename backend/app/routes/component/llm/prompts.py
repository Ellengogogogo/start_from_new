BESCHREIBUNG_PROMPT_DE = """

###Anleitung###

Erstelle einen eleganten, professionellen und verkaufsfördernden Beschreibungstext auf Deutsch 
für eine Immobilie, basierend auf den folgenden Parametern:  

- Immobilientyp: {property_type}   (z. B. Wohnung, Einfamilienhaus, Villa)  
- Zimmeranzahl: {rooms}  
- Wohnfläche: {area_sqm} m²  
- Grundstücksfläche: {grundstuecksflaeche} m²  
- Etage / Stockwerk: {floor}  
- Baujahr: {year_built}
- Zustand: {condition}  (z. B. frisch renoviert, gepflegt, sanierungsbedürftig)  
- Ausstattung: {equipment}  (z. B. Einbauküche, Balkon, Terrasse, Fußbodenheizung, Kamin)  
- Besonderheiten: {features}  (z. B. lichtdurchflutet, barrierefrei, energieeffizient)  
- Energieeffizienzklasse: {energy_class}  

👉 Anforderungen an den Text:  
1. Umfang: 120–180 Wörter.  
2. Stil: Hochwertig, positiv, emotional ansprechend (wie in einem Premium-Exposé).  
3. Keine Aufzählungen, sondern flüssiger Text.  
4. Fokus auf Wohnkomfort, Atmosphäre und Besonderheiten.  

"""


LOCATION_PROMPT_DE = """

###Anleitung###

Rolle:
Du bist ein erfahrener Immobilien-Texter. Deine Aufgabe ist es, eine ansprechende Lagebeschreibung für ein Immobilien-Exposé zu verfassen.

Input (vom Backend):

Stadt: {city}
Straße: {address}
Keywords: {location_keywords}

Output (dein Text): Erstelle eine fließende, professionelle Lagebeschreibung auf Deutsch (ca. 150–200 Wörter).
Der Text soll Folgendes beinhalten:

Beschreibung der Wohngegend und Atmosphäre.
- Verkehrsanbindung (ÖPNV, Autobahn, Flughafen falls relevant).
- Einkaufsmöglichkeiten (Supermärkte, Shopping-Center, Wochenmarkt).
- Bildung (Kindergarten, Schulen, Hochschulen).
- Gesundheit (Ärzte, Apotheken, Krankenhäuser).
- Freizeit, Sport und Natur (Parks, Fitness, Joggingmöglichkeiten).
- Gastronomie & Lifestyle (Cafés, Restaurants, Bars).

Schreibe in einem ansprechenden, aber seriösen Stil, so wie es in deutschen Immobilien-Exposés üblich ist. Vermeide zu viele Wiederholungen und achte auf elegante Formulierungen.
"""