// ═══════════════════════════════════
// LÄNDER-METADATEN — automatisch von RestCountries API
// ═══════════════════════════════════
let META = {};

async function loadMeta() {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,latlng,flag');
    const countries = await response.json();

    countries.forEach(c => {
        const name = c.name.common;
        META[name] = {
            flag: c.flag,
            capital: c.capital?.[0] ?? '—',
            lat: c.latlng?.[0] ?? 0,
            lng: c.latlng?.[1] ?? 0
        };
    });

    // Aliase — GeoJSON und RestCountries haben manchmal verschiedene Namen
    META['United States of America'] = META['United States'];
    META['Democratic Republic of the Congo'] = META['DR Congo'];
}

// ═══════════════════════════════════
// KONFIGURATION
// ═══════════════════════════════════
const LAND_COLOR = '#91872fb4';
const LAND_HOVER_COLOR = '#3a6a3a';
const LAND_SELECT_COLOR = '#00ad34';
const BORDER_COLOR = '#ffffff65';
const ZOOM_EXCEPTIONS = ['United States of America', 'Russia', 'France', 'Norway'];

let selectedLayer = null;

// ═══════════════════════════════════
// ÖL-ROUTEN
// Quellen: J.P. Morgan / Kpler Daten (Dezember 2025)
// ═══════════════════════════════════
const OIL_ROUTES = [
    {
        id: 'persian-gulf-europe',
        label: 'Persischer Golf → Europa',
        type: 'Rohöl (Brent)',
        origin: 'Saudi Aramco / ADNOC',
        volume: '~4 Mio. Barrel/Tag',
        color: '#cc2200',
        path: [[26,56],[24,53],[20,50],[15,47],[12,44],[11,43],[12,40],[13,37],[14,35],[14,33],[12,30],[8,25],[4,15],[0,5],[-5,-5],[-10,-15],[-15,-20],[-20,-18],[-28,-10],[-33,0],[-35,15],[-33,28],[-25,40],[-15,48],[-5,55],[5,58],[15,55],[25,45],[35,35],[42,20],[46,10],[49,3],[51,1],[53,4],[55,8],[55,12]]
    },
    {
        id: 'persian-gulf-china',
        label: 'Persischer Golf → China',
        type: 'Rohöl (Arab Light)',
        origin: 'Saudi Aramco / NIOC',
        volume: '~6 Mio. Barrel/Tag',
        color: '#cc2200',
        path: [[26,56],[22,62],[18,68],[12,72],[8,76],[5,82],[3,88],[4,95],[6,100],[8,104],[12,108],[18,112],[22,116],[28,119],[30,121]]
    },
    {
        id: 'persian-gulf-india',
        label: 'Persischer Golf → Indien',
        type: 'Rohöl (Arab Light)',
        origin: 'Saudi Aramco',
        volume: '~2 Mio. Barrel/Tag',
        color: '#cc2200',
        path: [[26,56],[24,60],[22,64],[20,68],[19,72]]
    },
    {
        id: 'russia-china',
        label: 'Russland → China',
        type: 'Rohöl (ESPO Blend)',
        origin: 'Rosneft',
        volume: '~2 Mio. Barrel/Tag',
        color: '#0055cc',
        path: [[52,58],[54,65],[55,73],[53,83],[50,90],[48,103],[45,110],[42,118],[38,121]]
    },
    {
        id: 'russia-europe',
        label: 'Russland → Europa (Druzhba)',
        type: 'Rohöl (Urals)',
        origin: 'Rosneft / Lukoil',
        volume: '~0.5 Mio. Barrel/Tag',
        color: '#0055cc',
        path: [[55,37],[52,30],[50,23],[50,19],[51,16],[52,13],[52,10]]
    },
    {
        id: 'us-europe',
        label: 'USA → Europa',
        type: 'Rohöl (WTI)',
        origin: 'US Shale Producers',
        volume: '~1.5 Mio. Barrel/Tag',
        color: '#cc6600',
        path: [[30,-90],[32,-82],[35,-75],[38,-68],[42,-55],[45,-40],[47,-25],[48,-12],[49,-5],[51,1]]
    },
    {
        id: 'west-africa-china',
        label: 'Westafrika → China',
        type: 'Rohöl (Bonny Light)',
        origin: 'Nigeria / Angola',
        volume: '~1 Mio. Barrel/Tag',
        color: '#006600',
        path: [[5,5],[0,2],[-5,-2],[-10,-5],[-15,-5],[-20,0],[-28,10],[-33,25],[-35,38],[-32,50],[-26,62],[-18,72],[-8,82],[2,90],[5,80],[8,76],[6,82],[4,88],[5,95],[8,100],[12,104],[15,108],[20,113],[25,118],[30,121]]
    }
];

let oilLayerGroup = null;
let oilActive = false;

function toggleOilRoutes() {
    oilActive = !oilActive;
    document.getElementById('btn-oil').classList.toggle('active', oilActive);

    if (!oilActive) {
        if (oilLayerGroup) {
            map.removeLayer(oilLayerGroup);
            oilLayerGroup = null;
        }
        return;
    }

    oilLayerGroup = L.layerGroup();

    OIL_ROUTES.forEach(route => {
        const line = L.polyline(route.path, {
            color: route.color,
            weight: 4,
            opacity: 0.8,
            smoothFactor: 3,
            dashArray: '6 4'
        });

        line.bindPopup(`
            <div style="font-family:'DM Mono',monospace; font-size:11px; min-width:200px">
                <div style="font-size:13px; font-weight:600; margin-bottom:8px">${route.label}</div>
                <div style="color:#8a8daa">Typ</div>
                <div style="margin-bottom:4px">${route.type}</div>
                <div style="color:#8a8daa">Produzent</div>
                <div style="margin-bottom:4px">${route.origin}</div>
                <div style="color:#8a8daa">Volumen</div>
                <div>${route.volume}</div>
            </div>
        `);

        oilLayerGroup.addLayer(line);
    });

    oilLayerGroup.addTo(map);
}

// ═══════════════════════════════════
// WELTBANK DATEN
// Lädt GDP, Schulden, Inflation etc. per Land
// Cache verhindert doppelte API Calls
// ═══════════════════════════════════
const WB_CACHE = {}; // gespeicherte Daten damit wir nicht doppelt laden

async function loadWorldBankData(isoCode) {
    // Schon im Cache? Direkt zurückgeben
    if (WB_CACHE[isoCode]) return WB_CACHE[isoCode];

    // Weltbank Indikatoren die wir wollen
    const indicators = {
        gdp: 'NY.GDP.MKTP.CD',   // GDP in USD
        gdp_cap: 'NY.GDP.PCAP.CD',   // GDP pro Kopf
        debt: 'GC.DOD.TOTL.GD.ZS', // Schulden % BIP
        inflation: 'FP.CPI.TOTL.ZG',   // Inflation %
        unemployment: 'SL.UEM.TOTL.ZS',   // Arbeitslosigkeit %
        population: 'SP.POP.TOTL'       // Bevölkerung
    };

    const result = {};

    // Alle Indikatoren gleichzeitig laden (Promise.all = parallel, nicht nacheinander)
    await Promise.all(Object.entries(indicators).map(async ([key, code]) => {
        const url = `https://api.worldbank.org/v2/country/${isoCode}/indicator/${code}?format=json&mrv=5`;
        const res = await fetch(url);
        const json = await res.json();
        const entries = json[1] ?? [];
        const latest = entries.find(e => e.value !== null);
        const value = latest?.value ?? null;
        const year = latest?.date ?? '—';
        result[key] = value ?? null;
        result[key + '_year'] = year ?? '—';
    }));

    WB_CACHE[isoCode] = result; // im Cache speichern
    return result;
}

// ═══════════════════════════════════
// KARTE INITIALISIEREN
// ═══════════════════════════════════
const map = L.map('map', {
    worldCopyJump: false,
    maxBounds: [[-60, -180], [90, 180]],
    maxBoundsViscosity: 1.0,
    minZoom: 3,
    maxZoom: 10,
}).setView([30, 10], 3);

// ═══════════════════════════════════
// LÄNDERGRENZEN LADEN
// ═══════════════════════════════════
loadMeta().then(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: {
                    color: BORDER_COLOR,
                    weight: 0.6,
                    fillColor: LAND_COLOR,
                    fillOpacity: 0.9
                },
                onEachFeature: function (feature, layer) {
                    const name = feature.properties.name;
                    const iso = feature.properties['ISO3166-1-Alpha-2'] || null;

                    // Antarktis ausblenden
                    if (name === 'Antarctica') {
                        layer.setStyle({ fillOpacity: 0, color: 'transparent' });
                        return;
                    }

                    layer.on({
                        // Hover → heller
                        mouseover: function (e) {
                            if (e.target !== selectedLayer) {
                                e.target.setStyle({ fillOpacity: 0.9, fillColor: LAND_HOVER_COLOR });
                            }
                        },

                        // Hover weg → zurück
                        mouseout: function (e) {
                            if (e.target !== selectedLayer) {
                                e.target.setStyle({ fillOpacity: 0.9, fillColor: LAND_COLOR });
                            }
                        },

                        // Klick → auswählen, Panel öffnen, zoomen
                        click: function (e) {
                            L.DomEvent.stopPropagation(e);

                            // Gleiches Land nochmal → zurückfliegen
                            if (selectedLayer === e.target) {
                                selectedLayer.setStyle({ fillOpacity: 0.9, fillColor: LAND_COLOR });
                                selectedLayer = null;
                                document.getElementById('panel').classList.remove('open');
                                document.getElementById('map').classList.remove('panel-open');
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

                            // Panel füllen und öffnen
                            const meta = META[name];
                            document.getElementById('p-flag').textContent = meta ? meta.flag : '🌐';
                            document.getElementById('p-name').textContent = name;
                            document.getElementById('p-cap').textContent = meta ? '◎ ' + meta.capital : '';
                            document.getElementById('panel').classList.add('open');
                            document.getElementById('map').classList.add('panel-open');

                            // Weltbank Daten laden
                            if (iso) {
                                document.getElementById('p-econ').innerHTML = '<div class="loading">Lädt...</div>';
                                loadWorldBankData(iso.toLowerCase()).then(data => {
                                    renderEcon(data);
                                });
                            }

                            // Warten bis CSS Transition fertig, dann zoomen
                            setTimeout(() => {
                                map.invalidateSize();
                                if (ZOOM_EXCEPTIONS.includes(name) && meta) {
                                    map.flyTo([meta.lat, meta.lng], 4, { duration: 1 });
                                } else {
                                    map.flyToBounds(layer.getBounds(), {
                                        padding: [50, 50],
                                        duration: 1,
                                        maxZoom: 6
                                    });
                                }
                            }, 300);
                        }
                    });
                }
            }).addTo(map);
        });

    // Ozean klick → Panel schließen
    map.on('click', function () {
        if (selectedLayer) {
            selectedLayer.setStyle({ fillOpacity: 0.9, fillColor: LAND_COLOR });
            selectedLayer = null;
        }
        document.getElementById('panel').classList.remove('open');
        document.getElementById('map').classList.remove('panel-open');
        map.flyTo([20, 0], 1, { duration: 1 });
    });

 // ═══════════════════════════════════
// WIRTSCHAFTSDATEN ANZEIGEN
// ═══════════════════════════════════
function renderEcon(data) {

    // Farbe basierend auf Wert — negativ=rot, positiv=grün
    const valColor = v => v == null ? 'var(--muted)' : v < 0 ? '#ff3d5a' : 'var(--green)';

    // GDP formatieren: T=Billionen, B=Milliarden, M=Millionen
    const fmtGdp = v => {
        if (v == null) return '—';
        if (v >= 1e12) return (v / 1e12).toFixed(1) + ' Bio. $';
        if (v >= 1e9)  return (v / 1e9).toFixed(1) + ' Mrd. $';
        return Math.round(v / 1e6) + ' Mio. $';
    };

    // BIP/Kopf formatieren: deutsche Zahlenformatierung
    const fmtPcap = v => {
        if (v == null) return '—';
        return Math.round(v).toLocaleString('de-DE') + ' $';
    };

    // Prozent formatieren
    const fmtPct = v => v == null ? '—' : v.toFixed(1) + '%';

    // Bevölkerung formatieren
    const fmtPop = v => {
        if (v == null) return '—';
        if (v >= 1e9) return (v / 1e9).toFixed(2) + ' Mrd.';
        if (v >= 1e6) return Math.round(v / 1e6) + ' Mio.';
        return Math.round(v / 1e3) + 'k';
    };

    // Schuldenfarbe: >100% rot, >60% gelb, sonst grün
    const debtColor = data.debt == null ? 'var(--muted)' :
        data.debt > 100 ? '#ff3d5a' :
        data.debt > 60  ? '#ffab00' : '#00e676';

    // Inflationsfarbe: >10% rot, >4% gelb, sonst grün
    const inflColor = data.inflation == null ? 'var(--muted)' :
        data.inflation > 10 ? '#ff3d5a' :
        data.inflation > 4  ? '#ffab00' : '#00e676';

    // Arbeitslosigkeitsfarbe: >10% rot, >5% gelb, sonst grün
    const unemplColor = data.unemployment == null ? 'var(--muted)' :
        data.unemployment > 10 ? '#ff3d5a' :
        data.unemployment > 5  ? '#ffab00' : '#00e676';

    document.getElementById('p-econ').innerHTML = `
        <div class="econ-section">
            <div class="econ-row">
                <span class="econ-label">BIP</span>
                <span class="econ-val" style="color:${valColor(data.gdp)}">${fmtGdp(data.gdp)}</span>
                <span class="econ-year">${data.gdp_year}</span>
            </div>
            <div class="econ-row">
                <span class="econ-label">BIP / Kopf</span>
                <span class="econ-val" style="color:${valColor(data.gdp_cap)}">${fmtPcap(data.gdp_cap)}</span>
                <span class="econ-year">${data.gdp_cap_year}</span>
            </div>
            <div class="econ-row">
                <span class="econ-label">Schuldenquote</span>
                <span class="econ-val" style="color:${debtColor}">${fmtPct(data.debt)} BIP</span>
                <span class="econ-year">${data.debt_year}</span>
            </div>
            <div class="econ-row">
                <span class="econ-label">Inflation</span>
                <span class="econ-val" style="color:${inflColor}">${fmtPct(data.inflation)}</span>
                <span class="econ-year">${data.inflation_year}</span>
            </div>
            <div class="econ-row">
                <span class="econ-label">Arbeitslosigkeit</span>
                <span class="econ-val" style="color:${unemplColor}">${fmtPct(data.unemployment)}</span>
                <span class="econ-year">${data.unemployment_year}</span>
            </div>
            <div class="econ-row">
                <span class="econ-label">Bevölkerung</span>
                <span class="econ-val">${fmtPop(data.population)}</span>
                <span class="econ-year">${data.population_year}</span>
            </div>
        </div>
    `;
}

});