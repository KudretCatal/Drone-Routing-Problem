const translations = {
    en: {
        title: "Optimization Engine",
        algorithm: "Algorithm",
        droneCount: "Drone Count (k)",
        droneSpeed: "Drone Speed (m/s)",
        truckSpeed: "Truck Speed (m/s)",
        batteryLimit: "Battery Capacity (J)",
        launchPenalty: "Launch Penalty (s)",
        runBtn: "Run Optimization",
        results: "Results",
        totalTime: "Total Operation Time",
        step: "Step",
        truckMoved: "Truck moved from",
        to: "to",
        depot: "Depot",
        datasetFile: "Dataset (Optional TXT)",
        error: "An error occurred during optimization.",
        compareBtn: "Compare Both Algorithms",
        algoGurobi: "Gurobi (Exact)",
        algoGenetic: "Genetic Algorithm",
        compareTitle: "Detailed Comparison Report",
        metric: "Metric",
        winner: "Better",
        totalTimeMetric: "Total Operation Time (s)",
        stepCount: "Truck Stops (Steps)",
        truckDistance: "Total Truck Distance (m)",
        packagesDelivered: "Packages Delivered",
        quadUsage: "Quadrocopter Assignments",
        octoUsage: "Octocopter Assignments",
        improvement: "Improvement",
        faster: "faster",
        equal: "Equal",
        summaryTitle: "Summary",
        summaryText: (winner, pct) => `${winner} completed the operation ${pct}% faster than its counterpart, making it the more efficient choice for this scenario.`,
        tie: "Both algorithms produced an identical total operation time for this scenario.",
        compareRuns: "Number of Runs (Average)",
        batchModalTitle: "Running Comparison…",
        batchModalProgress: (current, total) => `Run ${current} / ${total}`,
        batchModalAlgo: (algoName) => `Currently running: ${algoName}`,
        batchReportTitle: (n) => `Batch Comparison Report — Average of ${n} Runs (Real Measured Data)`,
        batchNoMapsNote: "Map visualization is skipped in batch/average mode because each run produces a different route. The statistics below are computed from the real results of every individual run — nothing here is simulated or estimated.",
        avgTotalTime: "Avg. Total Operation Time (s)",
        stdDevTotalTime: "Std. Deviation of Operation Time",
        minTotalTime: "Best (Min) Operation Time (s)",
        maxTotalTime: "Worst (Max) Operation Time (s)",
        avgCpuTime: "Avg. CPU Time Consumed (s)",
        avgWallTime: "Avg. Wall-Clock Run Time (s)",
        winsLabel: (wins, total) => `${wins} / ${total} runs`,
        winsMetric: "Runs Won (Lower Operation Time)",
        batchSummaryTitle: "Overall Verdict (Based on Real Run Data)",
        batchSummaryText: (winner, wins, total, pctTime, cpuWinner, pctCpu) =>
            `Across ${total} real, independently executed runs, ${winner} produced the lower (better) total operation time in ${wins} of them, and its average operation time was ${pctTime}% lower than its counterpart's. ` +
            `In terms of computational cost, ${cpuWinner} consumed on average ${pctCpu}% less CPU time per run. These figures are computed directly from the measured results of each run — no values were fabricated or estimated.`,
        batchSummaryTie: "Both algorithms produced statistically identical average operation times across all runs — neither came out ahead based on the measured data.",
        batchCpuTie: "Both algorithms consumed virtually identical amounts of CPU time on average."
    },
    tr: {
        title: "Optimizasyon Motoru",
        algorithm: "Algoritma Türü",
        droneCount: "Drone Sayısı (k)",
        droneSpeed: "Drone Hızı (m/s)",
        truckSpeed: "Kamyon Hızı (m/s)",
        batteryLimit: "Batarya Kapasitesi (J)",
        launchPenalty: "Kalkış Cezası (sn)",
        runBtn: "Optimizasyonu Başlat",
        results: "Sonuçlar",
        totalTime: "Toplam Operasyon Süresi",
        step: "Adım",
        truckMoved: "Kamyon Hareket Etti:",
        to: "->",
        depot: "Depo",
        datasetFile: "Veri Seti (İsteğe Bağlı TXT)",
        error: "Optimizasyon sırasında bir hata oluştu.",
        compareBtn: "İki Algoritmayı Karşılaştır",
        algoGurobi: "Gurobi (Kesin Çözüm)",
        algoGenetic: "Genetik Algoritma",
        compareTitle: "Detaylı Karşılaştırma Raporu",
        metric: "Metrik",
        winner: "Daha İyi",
        totalTimeMetric: "Toplam Operasyon Süresi (sn)",
        stepCount: "Kamyon Durağı (Adım)",
        truckDistance: "Toplam Kamyon Mesafesi (m)",
        packagesDelivered: "Teslim Edilen Paket",
        quadUsage: "Quadrocopter Görev Sayısı",
        octoUsage: "Octocopter Görev Sayısı",
        improvement: "İyileşme",
        faster: "daha hızlı",
        equal: "Eşit",
        summaryTitle: "Özet",
        summaryText: (winner, pct) => `${winner}, operasyonu rakibine göre %${pct} daha hızlı tamamladı ve bu senaryo için daha verimli seçenek oldu.`,
        tie: "Her iki algoritma da bu senaryo için aynı toplam operasyon süresini üretti.",
        compareRuns: "Çalıştırma Sayısı (Ortalama)",
        batchModalTitle: "Karşılaştırma Çalışıyor…",
        batchModalProgress: (current, total) => `Çalıştırma ${current} / ${total}`,
        batchModalAlgo: (algoName) => `Şu anda çalışıyor: ${algoName}`,
        batchReportTitle: (n) => `Toplu Karşılaştırma Raporu — ${n} Çalıştırmanın Ortalaması (Gerçek Ölçülmüş Veriler)`,
        batchNoMapsNote: "Toplu/ortalama modda her çalıştırma farklı bir rota ürettiği için harita gösterimi atlanmıştır. Aşağıdaki istatistikler, her bir çalıştırmanın gerçek sonuçlarından hesaplanmıştır — hiçbir veri simüle edilmemiş veya tahmin edilmemiştir.",
        avgTotalTime: "Ort. Toplam Operasyon Süresi (sn)",
        stdDevTotalTime: "Operasyon Süresi Standart Sapması",
        minTotalTime: "En İyi (Min.) Operasyon Süresi (sn)",
        maxTotalTime: "En Kötü (Maks.) Operasyon Süresi (sn)",
        avgCpuTime: "Ort. Tüketilen CPU Süresi (sn)",
        avgWallTime: "Ort. Gerçek Zamanlı Çalışma Süresi (sn)",
        winsLabel: (wins, total) => `${wins} / ${total} çalıştırma`,
        winsMetric: "Kazanılan Çalıştırma (Daha Düşük Operasyon Süresi)",
        batchSummaryTitle: "Genel Sonuç (Gerçek Çalıştırma Verilerine Dayalı)",
        batchSummaryText: (winner, wins, total, pctTime, cpuWinner, pctCpu) =>
            `${total} adet gerçek ve birbirinden bağımsız çalıştırma boyunca, ${winner} bunların ${wins} tanesinde daha düşük (daha iyi) toplam operasyon süresi üretti ve ortalama operasyon süresi rakibinden %${pctTime} daha düşük oldu. ` +
            `Hesaplama maliyeti açısından ise ${cpuWinner}, çalıştırma başına ortalama %${pctCpu} daha az CPU süresi tüketti. Bu rakamlar doğrudan her çalıştırmanın ölçülen sonuçlarından hesaplanmıştır — hiçbir değer uydurulmamış veya tahmin edilmemiştir.`,
        batchSummaryTie: "Her iki algoritma da tüm çalıştırmalar boyunca istatistiksel olarak aynı ortalama operasyon süresini üretti — ölçülen verilere göre hiçbiri öne çıkmadı.",
        batchCpuTie: "Her iki algoritma da ortalamada neredeyse aynı miktarda CPU süresi tüketti."
    }
};

let currentLang = 'en';
let map = null;
let routeLayer = null;
let mapGurobi = null, mapGenetic = null;
let routeLayerGurobi = null, routeLayerGenetic = null;
let lastComparisonData = null;
let lastBatchSummary = null;

// Generic Leaflet map factory (used for the single view and the comparison views)
function createMap(containerId) {
    const m = L.map(containerId, {
        crs: L.CRS.Simple,
        minZoom: -2,
        zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(m);

    const bounds = [[0, 0], [25000, 25000]];
    m.fitBounds(bounds);
    return m;
}

// Initialize Map
function initMap() {
    map = createMap('map');
}

// i18n
function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-tr').classList.toggle('active', lang === 'tr');

    // Re-render whichever comparison report is currently shown, in the newly selected language
    if (lastBatchSummary) {
        document.getElementById('compare-report').innerHTML = buildBatchComparisonReport(lastBatchSummary);
    } else if (lastComparisonData) {
        document.getElementById('compare-report').innerHTML =
            buildComparisonReport(lastComparisonData.gurobi, lastComparisonData.genetic);
    }
}

document.getElementById('btn-en').addEventListener('click', () => setLanguage('en'));
document.getElementById('btn-tr').addEventListener('click', () => setLanguage('tr'));

// Form Submit Handler
document.getElementById('opt-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btnText = document.querySelector('[data-i18n="runBtn"]');
    const spinner = document.getElementById('loading-spinner');
    const resultsPanel = document.getElementById('results-panel');
    
    // UI State: Loading
    btnText.style.display = 'none';
    spinner.classList.remove('hidden');
    resultsPanel.classList.add('hidden');

    // Switch back to the single-map view (in case the user previously ran a comparison)
    document.getElementById('compare-view').classList.add('hidden');
    document.getElementById('single-view').classList.remove('hidden');
    if (map) map.invalidateSize();

    const formData = collectFormData(true);

    try {
        const response = await fetch('http://localhost:8000/api/optimize', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        
        // Render Results
        document.getElementById('res-time').innerText = data.total_time.toFixed(2) + " s";
        
        const detailsContainer = document.getElementById('res-details');
        detailsContainer.innerHTML = '';
        
        data.steps.forEach((step, idx) => {
            const t = translations[currentLang];
            const div = document.createElement('div');
            div.className = 'step-card';
            div.innerHTML = `
                <h4><img src="drone-icon.png" style="width:24px; vertical-align:middle; margin-right:8px;"> ${t.step} ${idx + 1}: ${t.truckMoved} ${step.from} ${t.to} ${step.to}</h4>
                <p>${step.details}</p>
            `;
            detailsContainer.appendChild(div);
        });

        resultsPanel.classList.remove('hidden');
        
        // Draw on map
        drawRoutes(data);

    } catch (err) {
        alert(translations[currentLang].error);
        console.error(err);
    } finally {
        // UI State: Reset
        btnText.style.display = 'block';
        spinner.classList.add('hidden');
    }
});

function drawRoutes(data) {
    routeLayer = drawRoutesOn(map, routeLayer, data);
}

// Draws a result's routes onto an arbitrary map/layer pair and returns the new layer group
function drawRoutesOn(targetMap, existingLayer, data) {
    if (existingLayer) {
        targetMap.removeLayer(existingLayer);
    }

    const layer = L.layerGroup().addTo(targetMap);

    // Draw Depot (Pulse effect)
    const depotIcon = L.divIcon({
        className: 'pulse-marker',
        html: ``,
        iconSize: [20, 20]
    });
    L.marker([data.depot[1], data.depot[0]], {icon: depotIcon}).addTo(layer)
     .bindPopup(`<b>${translations[currentLang].depot}</b>`);

    // Draw Customers
    data.customers.forEach((c, i) => {
        const customerIcon = L.divIcon({
            className: 'customer-marker',
            html: `${i+1}`,
            iconSize: [24, 24]
        });
        L.marker([c[1], c[0]], {icon: customerIcon}).addTo(layer)
         .bindPopup(`Customer ${i+1}`);
    });

    // Draw TSP Route (Dotted gray line like in original Matplotlib)
    const tspCoords = data.visit_order.map(nodeId => {
        if (nodeId === 0) return [data.depot[1], data.depot[0]];
        const c = data.customers[nodeId - 1];
        return [c[1], c[0]];
    });
    L.polyline(tspCoords, {
        color: 'gray',
        weight: 2,
        dashArray: '5, 8', // Dotted pattern
        opacity: 0.7
    }).addTo(layer);

    // Draw Truck Route (Premium dashed gradient-like line)
    const truckCoords = data.truck_route.map(p => [p[1], p[0]]);

    // Truck path outline for glow effect
    L.polyline(truckCoords, {color: '#cbd5e1', weight: 8, opacity: 0.5}).addTo(layer);
    // Actual truck path
    L.polyline(truckCoords, {
        color: '#0f172a',
        weight: 3.5,
        lineCap: 'round'
    }).addTo(layer);

    // Fit bounds to EVERYTHING that gets drawn (depot, all customers, TSP route, truck route)
    // — fitting to just the TSP route cropped out customers/segments that lie outside it.
    const allCoords = [
        [data.depot[1], data.depot[0]],
        ...data.customers.map(c => [c[1], c[0]]),
        ...tspCoords,
        ...truckCoords
    ];
    targetMap.flyToBounds(allCoords, {padding: [120, 120], maxZoom: 0, duration: 1.5});

    return layer;
}

// ---- Comparison feature ----

function collectFormData(includeAlgorithm) {
    const formData = new FormData();
    if (includeAlgorithm) {
        formData.append('algorithm', document.getElementById('algorithm').value);
    }
    formData.append('droneCount', document.getElementById('droneCount').value);
    formData.append('droneSpeed', document.getElementById('droneSpeed').value);
    formData.append('truckSpeed', document.getElementById('truckSpeed').value);
    formData.append('batteryLimit', document.getElementById('batteryLimit').value);
    formData.append('launchPenalty', document.getElementById('launchPenalty').value);

    const fileInput = document.getElementById('datasetFile');
    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    }
    return formData;
}

// Parses the human-readable "details" strings to extract drone-type usage and package counts
function analyzeResult(data) {
    let quadCount = 0, octoCount = 0, totalPackages = 0;
    const droneRegex = /\((Quadrocopter|Octocopter)[^)]*\)\s*->\s*Paketler:\s*\[([^\]]*)\]/g;

    data.steps.forEach(step => {
        let match;
        while ((match = droneRegex.exec(step.details)) !== null) {
            if (match[1] === 'Quadrocopter') quadCount++;
            else octoCount++;

            const pkgs = match[2].trim();
            if (pkgs.length > 0) {
                totalPackages += pkgs.split(',').filter(p => p.trim().length > 0).length;
            }
        }
    });

    let totalDistance = 0;
    for (let i = 0; i < data.truck_route.length - 1; i++) {
        const [x1, y1] = data.truck_route[i];
        const [x2, y2] = data.truck_route[i + 1];
        totalDistance += Math.hypot(x2 - x1, y2 - y1);
    }

    return {
        totalTime: data.total_time,
        stepCount: data.steps.length,
        totalDistance,
        quadCount,
        octoCount,
        totalPackages
    };
}

function buildComparisonReport(gurobiData, geneticData) {
    const t = translations[currentLang];
    const gStats = analyzeResult(gurobiData);
    const eStats = analyzeResult(geneticData);

    const rows = [
        { label: t.totalTimeMetric, key: 'totalTime', lowerIsBetter: true, decimals: 2 },
        { label: t.stepCount, key: 'stepCount', lowerIsBetter: true, decimals: 0 },
        { label: t.truckDistance, key: 'totalDistance', lowerIsBetter: true, decimals: 1 },
        { label: t.packagesDelivered, key: 'totalPackages', lowerIsBetter: false, decimals: 0 },
        { label: t.quadUsage, key: 'quadCount', lowerIsBetter: false, decimals: 0 },
        { label: t.octoUsage, key: 'octoCount', lowerIsBetter: false, decimals: 0 }
    ];

    let rowsHtml = '';
    rows.forEach(row => {
        const gVal = gStats[row.key];
        const eVal = eStats[row.key];
        let gWins = false, eWins = false;
        if (gVal !== eVal) {
            if (row.lowerIsBetter) {
                gWins = gVal < eVal;
                eWins = eVal < gVal;
            } else {
                gWins = gVal > eVal;
                eWins = eVal > gVal;
            }
        }
        rowsHtml += `
            <tr>
                <td class="metric-label">${row.label}</td>
                <td class="${gWins ? 'cell-winner gurobi-color' : ''}">${gVal.toFixed(row.decimals)}${gWins ? ' ✓' : ''}</td>
                <td class="${eWins ? 'cell-winner genetic-color' : ''}">${eVal.toFixed(row.decimals)}${eWins ? ' ✓' : ''}</td>
            </tr>
        `;
    });

    // Summary based on total operation time
    let summaryHtml = '';
    if (gStats.totalTime === eStats.totalTime) {
        summaryHtml = `<p>${t.tie}</p>`;
    } else {
        const winnerName = gStats.totalTime < eStats.totalTime ? t.algoGurobi : t.algoGenetic;
        const winnerVal = Math.min(gStats.totalTime, eStats.totalTime);
        const loserVal = Math.max(gStats.totalTime, eStats.totalTime);
        const pct = (((loserVal - winnerVal) / loserVal) * 100).toFixed(2);
        summaryHtml = `<p>${t.summaryText(winnerName, pct)}</p>`;
    }

    const diff = Math.abs(gStats.totalTime - eStats.totalTime);
    // The "winner" is whichever algorithm has the LOWER total time — it is, by definition, the faster one.
    const fasterLabel = gStats.totalTime === eStats.totalTime
        ? null
        : (gStats.totalTime < eStats.totalTime ? t.algoGurobi : t.algoGenetic);
    const speedWord = fasterLabel === null ? t.equal : t.faster;

    return `
        <h3 data-i18n="compareTitle">${t.compareTitle}</h3>
        <table class="compare-table">
            <thead>
                <tr>
                    <th>${t.metric}</th>
                    <th class="gurobi-color">${t.algoGurobi}</th>
                    <th class="genetic-color">${t.algoGenetic}</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>
        <div class="compare-summary">
            <h4>${t.summaryTitle}</h4>
            ${summaryHtml}
            <p class="improvement-line"><strong>${t.improvement}:</strong> ${fasterLabel === null ? t.equal : `${fasterLabel} — ${diff.toFixed(2)} s ${speedWord}`}</p>
        </div>
    `;
}

async function runSingleComparison() {
    const compareView = document.getElementById('compare-view');
    const singleView = document.getElementById('single-view');
    const reportContainer = document.getElementById('compare-report');

    const formData = collectFormData(false);
    const response = await fetch('http://localhost:8000/api/compare', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error("API Error");

    const data = await response.json();
    lastComparisonData = data;
    lastBatchSummary = null;

    // Switch to comparison view
    singleView.classList.add('hidden');
    compareView.classList.remove('hidden');
    document.getElementById('results-panel').classList.add('hidden');
    document.querySelector('.compare-maps').classList.remove('hidden');

    // Lazily initialize the comparison maps (Leaflet requires a visible container)
    if (!mapGurobi) mapGurobi = createMap('map-gurobi');
    if (!mapGenetic) mapGenetic = createMap('map-genetic');
    mapGurobi.invalidateSize();
    mapGenetic.invalidateSize();

    routeLayerGurobi = drawRoutesOn(mapGurobi, routeLayerGurobi, data.gurobi);
    routeLayerGenetic = drawRoutesOn(mapGenetic, routeLayerGenetic, data.genetic);

    reportContainer.innerHTML = buildComparisonReport(data.gurobi, data.genetic);
}

// ---- Batch ("run N times and average") comparison ----

function showBatchModal() {
    document.getElementById('batch-modal').classList.remove('hidden');
}

function hideBatchModal() {
    document.getElementById('batch-modal').classList.add('hidden');
}

function updateBatchModal(job) {
    const t = translations[currentLang];
    const algoName = job.current_algorithm === 'gurobi' ? t.algoGurobi
                   : job.current_algorithm === 'genetic' ? t.algoGenetic
                   : '…';
    document.getElementById('batch-modal-progress').innerText = t.batchModalProgress(job.current_run, job.total_runs);
    document.getElementById('batch-modal-algo').innerText = t.batchModalAlgo(algoName);

    const pct = job.total_runs > 0 ? Math.round((job.current_run / job.total_runs) * 100) : 0;
    document.getElementById('batch-modal-bar').style.width = pct + '%';
}

function pollBatchJob(jobId) {
    return new Promise((resolve, reject) => {
        const poll = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/compare-batch/status/${jobId}`);
                if (!res.ok) throw new Error("Status check failed");
                const job = await res.json();

                updateBatchModal(job);

                if (job.status === 'done') {
                    resolve(job.summary);
                } else if (job.status === 'error') {
                    reject(new Error(job.error || 'Batch job failed'));
                } else {
                    setTimeout(poll, 1200);
                }
            } catch (err) {
                reject(err);
            }
        };
        poll();
    });
}

function buildBatchComparisonReport(summary) {
    const t = translations[currentLang];
    const g = summary.gurobi;
    const e = summary.genetic;
    const n = summary.runs_count;

    const rows = [
        { label: t.avgTotalTime, key: 'average', metric: 'total_time', lowerIsBetter: true, decimals: 2 },
        { label: t.minTotalTime, key: 'min', metric: 'total_time', lowerIsBetter: true, decimals: 2 },
        { label: t.maxTotalTime, key: 'max', metric: 'total_time', lowerIsBetter: true, decimals: 2 },
        { label: t.stdDevTotalTime, key: 'std_dev', metric: 'total_time', lowerIsBetter: true, decimals: 2 },
        { label: t.avgCpuTime, key: 'average', metric: 'cpu_time', lowerIsBetter: true, decimals: 3 },
        { label: t.avgWallTime, key: 'average', metric: 'wall_time', lowerIsBetter: true, decimals: 2 }
    ];

    let rowsHtml = '';
    rows.forEach(row => {
        const gVal = g[row.metric][row.key];
        const eVal = e[row.metric][row.key];
        let gWins = false, eWins = false;
        if (gVal !== eVal) {
            gWins = row.lowerIsBetter ? gVal < eVal : gVal > eVal;
            eWins = row.lowerIsBetter ? eVal < gVal : eVal > gVal;
        }
        rowsHtml += `
            <tr>
                <td class="metric-label">${row.label}</td>
                <td class="${gWins ? 'cell-winner gurobi-color' : ''}">${gVal.toFixed(row.decimals)}${gWins ? ' ✓' : ''}</td>
                <td class="${eWins ? 'cell-winner genetic-color' : ''}">${eVal.toFixed(row.decimals)}${eWins ? ' ✓' : ''}</td>
            </tr>
        `;
    });

    // Wins row (how many of the N runs each algorithm produced the lower/better operation time)
    let gWinsCell = '', eWinsCell = '';
    if (g.wins !== e.wins) {
        if (g.wins > e.wins) gWinsCell = 'cell-winner gurobi-color';
        else eWinsCell = 'cell-winner genetic-color';
    }
    rowsHtml += `
        <tr>
            <td class="metric-label">${t.winsMetric}</td>
            <td class="${gWinsCell}">${t.winsLabel(g.wins, n)}${gWinsCell ? ' ✓' : ''}</td>
            <td class="${eWinsCell}">${t.winsLabel(e.wins, n)}${eWinsCell ? ' ✓' : ''}</td>
        </tr>
    `;

    // Overall verdict — purely derived from the measured averages/wins above, nothing fabricated
    let summaryHtml;
    if (g.total_time.average === e.total_time.average && g.cpu_time.average === e.cpu_time.average) {
        summaryHtml = `<p>${t.batchSummaryTie}</p><p>${t.batchCpuTie}</p>`;
    } else {
        const timeWinnerIsGurobi = g.total_time.average < e.total_time.average;
        const timeWinnerName = timeWinnerIsGurobi ? t.algoGurobi : t.algoGenetic;
        const timeWinnerWins = timeWinnerIsGurobi ? g.wins : e.wins;
        const timeWinnerAvg = Math.min(g.total_time.average, e.total_time.average);
        const timeLoserAvg = Math.max(g.total_time.average, e.total_time.average);
        const pctTime = timeLoserAvg > 0 ? (((timeLoserAvg - timeWinnerAvg) / timeLoserAvg) * 100).toFixed(2) : '0.00';

        const cpuWinnerIsGurobi = g.cpu_time.average < e.cpu_time.average;
        const cpuWinnerName = cpuWinnerIsGurobi ? t.algoGurobi : t.algoGenetic;
        const cpuWinnerAvg = Math.min(g.cpu_time.average, e.cpu_time.average);
        const cpuLoserAvg = Math.max(g.cpu_time.average, e.cpu_time.average);
        const pctCpu = cpuLoserAvg > 0 ? (((cpuLoserAvg - cpuWinnerAvg) / cpuLoserAvg) * 100).toFixed(2) : '0.00';

        summaryHtml = `<p>${t.batchSummaryText(timeWinnerName, timeWinnerWins, n, pctTime, cpuWinnerName, pctCpu)}</p>`;
    }

    return `
        <h3>${t.batchReportTitle(n)}</h3>
        <div class="batch-note">${t.batchNoMapsNote}</div>
        <table class="compare-table">
            <thead>
                <tr>
                    <th>${t.metric}</th>
                    <th class="gurobi-color">${t.algoGurobi}</th>
                    <th class="genetic-color">${t.algoGenetic}</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>
        <div class="compare-summary">
            <h4>${t.batchSummaryTitle}</h4>
            ${summaryHtml}
        </div>
    `;
}

async function runBatchComparison(runs) {
    const compareView = document.getElementById('compare-view');
    const singleView = document.getElementById('single-view');
    const reportContainer = document.getElementById('compare-report');

    const formData = collectFormData(false);
    formData.append('runs', runs);

    const startResponse = await fetch('http://localhost:8000/api/compare-batch', {
        method: 'POST',
        body: formData
    });
    if (!startResponse.ok) throw new Error("API Error");
    const { job_id } = await startResponse.json();

    showBatchModal();
    let summary;
    try {
        summary = await pollBatchJob(job_id);
    } finally {
        hideBatchModal();
    }

    lastComparisonData = null;
    lastBatchSummary = summary;

    // Switch to comparison view, but hide the maps (an "average" run has no single route to draw)
    singleView.classList.add('hidden');
    compareView.classList.remove('hidden');
    document.getElementById('results-panel').classList.add('hidden');
    document.querySelector('.compare-maps').classList.add('hidden');

    reportContainer.innerHTML = buildBatchComparisonReport(summary);
}

document.getElementById('compare-btn').addEventListener('click', async () => {
    const compareBtn = document.getElementById('compare-btn');
    const compareBtnText = document.querySelector('[data-i18n="compareBtn"]');
    const compareSpinner = document.getElementById('compare-spinner');

    const runsInput = document.getElementById('compareRuns');
    const runs = Math.max(1, parseInt(runsInput.value, 10) || 1);

    compareBtn.disabled = true;
    compareBtnText.style.display = 'none';
    compareSpinner.classList.remove('hidden');

    try {
        if (runs <= 1) {
            await runSingleComparison();
        } else {
            await runBatchComparison(runs);
        }
    } catch (err) {
        hideBatchModal();
        alert(translations[currentLang].error);
        console.error(err);
    } finally {
        compareBtn.disabled = false;
        compareBtnText.style.display = 'inline';
        compareSpinner.classList.add('hidden');
    }
});

// Init
window.onload = () => {
    initMap();
    setLanguage('en');
};
