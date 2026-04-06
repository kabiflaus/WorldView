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
const map = L.map('map').setView([20, 0], 2);

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
        map.flyTo([20, 0], 2, { duration: 1 });
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