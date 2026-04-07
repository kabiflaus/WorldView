const FINNHUB_KEY = 'd7akrm9r01qmvlmgbtdgd7akrm9r01qmvlmgbte0';

const CHAINS = [
    {
        id: 'chips',
        titel: '🔷 Halbleiter & KI',
        nodes: [
            { symbol: 'NVDA', name: 'NVIDIA', rolle: 'KI-Chips Design' },
            { symbol: 'TSM', name: 'TSMC', rolle: 'Chip-Produktion' },
            { symbol: 'ASML', name: 'ASML', rolle: 'EUV-Maschinen' },
            { symbol: 'AMD', name: 'AMD', rolle: 'KI-Chips Design' },
        ]
    },
    {
        id: 'oel',
        titel: '🛢️ Öl & Energie',
        nodes: [
            { symbol: 'XOM', name: 'ExxonMobil', rolle: 'Förderung & Raffinerie' },
            { symbol: 'CVX', name: 'Chevron', rolle: 'Förderung & Raffinerie' },
            { symbol: 'BP', name: 'BP', rolle: 'Förderung & Raffinerie' },
            { symbol: 'SLB', name: 'Schlumberger', rolle: 'Bohrtechnik' },
        ]
    },
    {
        id: 'ev',
        titel: '🔋 Batterien & EVs',
        nodes: [
            { symbol: 'TSLA', name: 'Tesla', rolle: 'EV Hersteller' },
            { symbol: 'ALB', name: 'Albemarle', rolle: 'Lithium Förderung' },
            { symbol: 'LTHM', name: 'Livent', rolle: 'Lithium Verarbeitung' },
            { symbol: 'MP', name: 'MP Materials', rolle: 'Seltene Erden' },
        ]
    }
];

async function loadQuote(symbol) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

async function renderStonks() {
    const container = document.getElementById('stonks-list');
    container.innerHTML = '<div class="stonks-loading">Lädt Kurse...</div>';

    let html = '';

    for (const chain of CHAINS) {
        html += `<div class="chain-titel">${chain.titel}</div>`;
        html += `<div class="chain-nodes">`;

        for (const node of chain.nodes) {
            const quote = await loadQuote(node.symbol);
            const preis = quote.c?.toFixed(2) ?? '—';
            const change = quote.dp?.toFixed(2) ?? null;
            const changeColor = change == null ? 'var(--muted)' : change >= 0 ? '#00e676' : '#ff3d5a';
            const changePrefix = change >= 0 ? '▲' : '▼';

            html += `
                <div class="chain-node">
                    <div class="node-symbol">${node.symbol}</div>
                    <div class="node-name">${node.name}</div>
                    <div class="node-rolle">${node.rolle}</div>
                    <div class="node-preis">$${preis} <span style="color:${changeColor}">${change != null ? changePrefix + Math.abs(change) + '%' : ''}</span></div>
                </div>
            `;
        }

        html += `</div>`;
    }

    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderStonks);
