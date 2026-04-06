// ═══════════════════════════════════
// LÄNDER-METADATEN (Flagge, Hauptstadt, Koordinaten)
// ═══════════════════════════════════
const META = {
    "Germany":                      { flag: "🇩🇪", capital: "Berlin",          lat: 51.16, lng: 10.45  },
    "United States of America":     { flag: "🇺🇸", capital: "Washington D.C.", lat: 37.09, lng: -95.71 },
    "China":                        { flag: "🇨🇳", capital: "Peking",           lat: 35.86, lng: 104.2  },
    "Russia":                       { flag: "🇷🇺", capital: "Moskau",           lat: 61.52, lng: 105.32 },
    "France":                       { flag: "🇫🇷", capital: "Paris",            lat: 46.23, lng: 2.21   },
    "United Kingdom":               { flag: "🇬🇧", capital: "London",           lat: 55.38, lng: -3.44  },
    "Japan":                        { flag: "🇯🇵", capital: "Tokio",            lat: 36.2,  lng: 138.25 },
    "Canada":                       { flag: "🇨🇦", capital: "Ottawa",           lat: 56.13, lng: -106.35},
    "Italy":                        { flag: "🇮🇹", capital: "Rom",              lat: 41.87, lng: 12.57  },
    "Brazil":                       { flag: "🇧🇷", capital: "Brasília",         lat: -14.24,lng: -51.93 },
    "India":                        { flag: "🇮🇳", capital: "Neu-Delhi",        lat: 20.59, lng: 78.96  },
    "Australia":                    { flag: "🇦🇺", capital: "Canberra",         lat: -25.27,lng: 133.78 },
    "Saudi Arabia":                 { flag: "🇸🇦", capital: "Riad",             lat: 23.89, lng: 45.08  },
    "South Korea":                  { flag: "🇰🇷", capital: "Seoul",            lat: 35.91, lng: 127.77 },
    "Turkey":                       { flag: "🇹🇷", capital: "Ankara",           lat: 38.96, lng: 35.24  },
    "Mexico":                       { flag: "🇲🇽", capital: "Mexiko-Stadt",     lat: 23.63, lng: -102.55},
    "Indonesia":                    { flag: "🇮🇩", capital: "Jakarta",          lat: -0.79, lng: 113.92 },
    "South Africa":                 { flag: "🇿🇦", capital: "Pretoria",         lat: -30.56,lng: 22.94  },
    "Poland":                       { flag: "🇵🇱", capital: "Warschau",         lat: 51.92, lng: 19.15  },
    "Netherlands":                  { flag: "🇳🇱", capital: "Amsterdam",        lat: 52.13, lng: 5.29   },
    "Spain":                        { flag: "🇪🇸", capital: "Madrid",           lat: 40.46, lng: -3.75  },
    "Argentina":                    { flag: "🇦🇷", capital: "Buenos Aires",     lat: -38.42,lng: -63.62 },
    "Nigeria":                      { flag: "🇳🇬", capital: "Abuja",            lat: 9.08,  lng: 8.68   },
    "Pakistan":                     { flag: "🇵🇰", capital: "Islamabad",        lat: 30.38, lng: 69.35  },
    "Ukraine":                      { flag: "🇺🇦", capital: "Kiew",             lat: 48.38, lng: 31.17  },
    "Iran":                         { flag: "🇮🇷", capital: "Teheran",          lat: 32.43, lng: 53.69  },
    "Sweden":                       { flag: "🇸🇪", capital: "Stockholm",        lat: 60.13, lng: 18.64  },
    "Switzerland":                  { flag: "🇨🇭", capital: "Bern",             lat: 46.82, lng: 8.23   },
    "Norway":                       { flag: "🇳🇴", capital: "Oslo",             lat: 60.47, lng: 8.47   },
    "Israel":                       { flag: "🇮🇱", capital: "Jerusalem",        lat: 31.05, lng: 34.85  },
    "North Korea":                  { flag: "🇰🇵", capital: "Pjöngjang",        lat: 40.34, lng: 127.51 },
    "Egypt":                        { flag: "🇪🇬", capital: "Kairo",            lat: 26.82, lng: 30.80  },
    "Ethiopia":                     { flag: "🇪🇹", capital: "Addis Abeba",      lat: 9.15,  lng: 40.49  },
    "Democratic Republic of the Congo": { flag: "🇨🇩", capital: "Kinshasa",    lat: -4.04, lng: 21.76  },
    "Tanzania":                     { flag: "🇹🇿", capital: "Dodoma",           lat: -6.37, lng: 34.89  },
    "Kenya":                        { flag: "🇰🇪", capital: "Nairobi",          lat: 0.02,  lng: 37.91  },
    "Morocco":                      { flag: "🇲🇦", capital: "Rabat",            lat: 31.79, lng: -7.09  },
    "Ghana":                        { flag: "🇬🇭", capital: "Accra",            lat: 7.95,  lng: -1.02  },
    "Colombia":                     { flag: "🇨🇴", capital: "Bogotá",           lat: 4.57,  lng: -74.30 },
    "Chile":                        { flag: "🇨🇱", capital: "Santiago",         lat: -35.68,lng: -71.54 },
    "Peru":                         { flag: "🇵🇪", capital: "Lima",             lat: -9.19, lng: -75.02 },
    "Venezuela":                    { flag: "🇻🇪", capital: "Caracas",          lat: 6.42,  lng: -66.59 },
    "Thailand":                     { flag: "🇹🇭", capital: "Bangkok",          lat: 15.87, lng: 100.99 },
    "Vietnam":                      { flag: "🇻🇳", capital: "Hanoi",            lat: 14.06, lng: 108.28 },
    "Malaysia":                     { flag: "🇲🇾", capital: "Kuala Lumpur",     lat: 4.21,  lng: 109.45 },
    "Philippines":                  { flag: "🇵🇭", capital: "Manila",           lat: 12.88, lng: 121.77 },
    "Bangladesh":                   { flag: "🇧🇩", capital: "Dhaka",            lat: 23.68, lng: 90.36  },
    "Iraq":                         { flag: "🇮🇶", capital: "Bagdad",           lat: 33.22, lng: 43.68  },
    "Afghanistan":                  { flag: "🇦🇫", capital: "Kabul",            lat: 33.94, lng: 67.71  },
    "Uzbekistan":                   { flag: "🇺🇿", capital: "Taschkent",        lat: 41.38, lng: 64.59  },
    "Kazakhstan":                   { flag: "🇰🇿", capital: "Astana",           lat: 48.02, lng: 66.92  },
    "Greece":                       { flag: "🇬🇷", capital: "Athen",            lat: 39.07, lng: 21.82  },
    "Portugal":                     { flag: "🇵🇹", capital: "Lissabon",         lat: 39.40, lng: -8.22  },
    "Belgium":                      { flag: "🇧🇪", capital: "Brüssel",          lat: 50.50, lng: 4.47   },
    "Austria":                      { flag: "🇦🇹", capital: "Wien",             lat: 47.52, lng: 14.55  },
    "Czech Republic":               { flag: "🇨🇿", capital: "Prag",             lat: 49.82, lng: 15.47  },
    "Hungary":                      { flag: "🇭🇺", capital: "Budapest",         lat: 47.16, lng: 19.50  },
    "Romania":                      { flag: "🇷🇴", capital: "Bukarest",         lat: 45.94, lng: 24.97  },
    "Finland":                      { flag: "🇫🇮", capital: "Helsinki",         lat: 61.92, lng: 25.75  },
    "Denmark":                      { flag: "🇩🇰", capital: "Kopenhagen",       lat: 56.26, lng: 9.50   },
    "New Zealand":                  { flag: "🇳🇿", capital: "Wellington",       lat: -40.90,lng: 174.89 },
    "Cuba":                         { flag: "🇨🇺", capital: "Havanna",          lat: 21.52, lng: -77.78 },
    "Bolivia":                      { flag: "🇧🇴", capital: "Sucre",            lat: -16.29,lng: -63.59 },
    "Ecuador":                      { flag: "🇪🇨", capital: "Quito",            lat: -1.83, lng: -78.18 },
    "Somalia":                      { flag: "🇸🇴", capital: "Mogadischu",       lat: 5.15,  lng: 46.20  },
    "Sudan":                        { flag: "🇸🇩", capital: "Khartum",          lat: 12.86, lng: 30.22  },
    "Libya":                        { flag: "🇱🇾", capital: "Tripolis",         lat: 26.34, lng: 17.23  },
    "Algeria":                      { flag: "🇩🇿", capital: "Algier",           lat: 28.03, lng: 1.66   },
    "Angola":                       { flag: "🇦🇴", capital: "Luanda",           lat: -11.20,lng: 17.87  },
    "Mozambique":                   { flag: "🇲🇿", capital: "Maputo",           lat: -18.67,lng: 35.53  },
    "Zimbabwe":                     { flag: "🇿🇼", capital: "Harare",           lat: -19.02,lng: 29.15  },
    "Cameroon":                     { flag: "🇨🇲", capital: "Yaoundé",          lat: 7.37,  lng: 12.35  },
    "Ivory Coast":                  { flag: "🇨🇮", capital: "Yamoussoukro",     lat: 7.54,  lng: -5.55  },
    "Madagascar":                   { flag: "🇲🇬", capital: "Antananarivo",     lat: -18.77,lng: 46.87  },
    "Myanmar":                      { flag: "🇲🇲", capital: "Naypyidaw",        lat: 21.92, lng: 95.96  },
    "Sri Lanka":                    { flag: "🇱🇰", capital: "Colombo",          lat: 7.87,  lng: 80.77  },
    "Nepal":                        { flag: "🇳🇵", capital: "Kathmandu",        lat: 28.39, lng: 84.12  },
    "Syria":                        { flag: "🇸🇾", capital: "Damaskus",         lat: 34.80, lng: 38.99  },
    "Jordan":                       { flag: "🇯🇴", capital: "Amman",            lat: 30.59, lng: 36.24  },
    "United Arab Emirates":         { flag: "🇦🇪", capital: "Abu Dhabi",        lat: 23.42, lng: 53.85  },
    "Qatar":                        { flag: "🇶🇦", capital: "Doha",             lat: 25.35, lng: 51.18  },
    "Kuwait":                       { flag: "🇰🇼", capital: "Kuwait-Stadt",     lat: 29.31, lng: 47.48  },
    "Ireland":                      { flag: "🇮🇪", capital: "Dublin",            lat: 53.41, lng: -8.24  },
    "Iceland":                      { flag: "🇮🇸", capital: "Reykjavik",         lat: 64.96, lng: -19.02 },
    "Greenland":                    { flag: "🇬🇱", capital: "Nuuk",              lat: 71.71, lng: -42.60 },
};

// ═══════════════════════════════════
// KONFIGURATION
// Farben und State hier ändern, nicht unten im Code
// ═══════════════════════════════════
const LAND_COLOR        = '#2a4a2a';  // Grundfarbe aller Länder
const LAND_HOVER_COLOR  = '#3a6a3a';  // Farbe beim Hover
const LAND_SELECT_COLOR = '#00e676';  // Farbe beim Klick (ausgewählt)
const BORDER_COLOR      = '#3a5a3a';  // Farbe der Ländergrenzen

let selectedLayer = null; // merkt sich welches Land gerade ausgewählt ist

// ═══════════════════════════════════
// KARTE INITIALISIEREN
// setView([lat, lng], zoom) — Startposition und Zoomstufe
// ═══════════════════════════════════
const map = L.map('map').setView([20, 0], 2);

// ═══════════════════════════════════
// LÄNDERGRENZEN LADEN (GeoJSON)
// Holt die Ländergrenzen von GitHub und zeichnet sie auf die Karte
// ═══════════════════════════════════
fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {

            // Aussehen jedes Landes
            style: {
                color:       BORDER_COLOR,  // Grenzlinien-Farbe
                weight:      0.6,           // Grenzlinien-Dicke
                fillColor:   LAND_COLOR,    // Füllfarbe
                fillOpacity: 0.9            // Füll-Transparenz (0=unsichtbar, 1=voll)
            },

            // Wird für jedes Land einmal aufgerufen
            onEachFeature: function(feature, layer) {
                const name = feature.properties.name;

                // Antarktis ausblenden — irrelevant und stört das Design
                if (name === 'Antarctica') {
                    layer.setStyle({ fillOpacity: 0, color: 'transparent' });
                    return;
                }

                // Maus-Events für interaktive Länder
                layer.on({

                    // Maus drüber → heller werden
                    mouseover: function(e) {
                        if (e.target !== selectedLayer) {
                            e.target.setStyle({ fillOpacity: 0.9, fillColor: LAND_HOVER_COLOR });
                        }
                    },

                    // Maus weg → zurück zur Grundfarbe
                    mouseout: function(e) {
                        if (e.target !== selectedLayer) {
                            e.target.setStyle({ fillOpacity: 0.9, fillColor: LAND_COLOR });
                        }
                    },

                    // Klick → Land auswählen und Panel öffnen
                    click: function(e) {
        L.DomEvent.stopPropagation(e);

    // Gleiches Land nochmal geklickt → zurückfliegen
    if (selectedLayer === e.target) {
        selectedLayer.setStyle({ fillOpacity: 0.9, fillColor: LAND_COLOR });
        selectedLayer = null;
        document.getElementById('panel').classList.remove('open');
        map.flyTo([20, 0], 2, { duration: 1 });
        return;
    }

    // Vorheriges Land zurücksetzen
    if (selectedLayer) {
        selectedLayer.setStyle({ fillOpacity: 0.9, fillColor: LAND_COLOR });
    }

    // Neues Land markieren
    selectedLayer = e.target;
    e.target.setStyle({ fillOpacity: 0.9, fillColor: LAND_SELECT_COLOR });

// Ausnahmen für Länder mit weit entfernten Territorien
const ZOOM_EXCEPTIONS = ['United States of America', 'Russia', 'France'];
const meta = META[name];

if (ZOOM_EXCEPTIONS.includes(name) && meta) {
    map.flyTo([meta.lat, meta.lng], 4, { duration: 1 });
} else {
    map.flyToBounds(layer.getBounds(), {
        padding: [50, 50],
        duration: 1,
        maxZoom: 6
    });
}

    // Panel füllen
    document.getElementById('p-flag').textContent = meta ? meta.flag : '🌐';
    document.getElementById('p-name').textContent = name;
    document.getElementById('p-cap').textContent  = meta ? '◎ ' + meta.capital : '';
    document.getElementById('panel').classList.add('open');

                    }
                });
            }
        }).addTo(map);
    });

// ═══════════════════════════════════
// KLICK AUF OZEAN → Panel schließen
// ═══════════════════════════════════
map.on('click', function() {
    if (selectedLayer) {
        selectedLayer.setStyle({ fillOpacity: 0.9, fillColor: LAND_COLOR });
        selectedLayer = null;
    }
    document.getElementById('panel').classList.remove('open');
    map.flyTo([20, 0], 2, { duration: 1 });
});