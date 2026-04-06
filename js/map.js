// Karte initialisieren
const map = L.map('map').setView([20, 0], 2);

// Hintergrund (Tile Layer)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB',
    maxZoom: 10,
    minZoom: 2
}).addTo(map);

// Ländergrenzen laden und anzeigen
fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: {
                color: '#ffffff',
                weight: 0.5,
                fillOpacity: 0
            },
            onEachFeature: function(feature, layer) {
                layer.on({
                    mouseover: function(e) {
                        e.target.setStyle({ fillOpacity: 0.8, fillColor: '#268636' });
                    },
                    mouseout: function(e) {
                        e.target.setStyle({ fillOpacity: 0, fillColor: '#ffffff' });
                    },
                    click: function(e) {
                    L.DomEvent.stopPropagation(e);
                    const name = feature.properties.name;
                    document.getElementById('panel-name').textContent = name;
                    document.getElementById('panel').classList.add('open');
                    }
                });
            }
        }).addTo(map);
    });

    // Panel schließen wenn man auf die Karte klickt
    map.on('click', function() {
    document.getElementById('panel').classList.remove('open');
});