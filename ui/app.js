const translations = {
    en: {
        title: "Optimization Engine",
        algorithm: "Algorithm",
        droneCount: "Drone Count (k)",
        droneSpeed: "Drone Speed (m/s)",
        truckSpeed: "Truck Speed (m/s)",
        batteryLimit: "Battery Capacity (J)",
        runBtn: "Run Optimization",
        results: "Results",
        totalTime: "Total Operation Time",
        step: "Step",
        truckMoved: "Truck moved from",
        to: "to",
        depot: "Depot",
        datasetFile: "Dataset (Optional TXT)",
        error: "An error occurred during optimization."
    },
    tr: {
        title: "Optimizasyon Motoru",
        algorithm: "Algoritma Türü",
        droneCount: "Drone Sayısı (k)",
        droneSpeed: "Drone Hızı (m/s)",
        truckSpeed: "Kamyon Hızı (m/s)",
        batteryLimit: "Batarya Kapasitesi (J)",
        runBtn: "Optimizasyonu Başlat",
        results: "Sonuçlar",
        totalTime: "Toplam Operasyon Süresi",
        step: "Adım",
        truckMoved: "Kamyon Hareket Etti:",
        to: "->",
        depot: "Depo",
        datasetFile: "Veri Seti (İsteğe Bağlı TXT)",
        error: "Optimizasyon sırasında bir hata oluştu."
    }
};

let currentLang = 'en';
let map = null;
let routeLayer = null;

// Initialize Map
function initMap() {
    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        zoomControl: false // Disable default zoom to add it nicely later or keep it clean
    });
    
    // Add zoom control to top right
    L.control.zoom({
        position: 'topright'
    }).addTo(map);
    
    const bounds = [[0, 0], [25000, 25000]];
    map.fitBounds(bounds);
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

    const formData = new FormData();
    formData.append('algorithm', document.getElementById('algorithm').value);
    formData.append('droneCount', document.getElementById('droneCount').value);
    formData.append('droneSpeed', document.getElementById('droneSpeed').value);
    formData.append('truckSpeed', document.getElementById('truckSpeed').value);
    formData.append('batteryLimit', document.getElementById('batteryLimit').value);
    
    const fileInput = document.getElementById('datasetFile');
    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    }

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
    if (routeLayer) {
        map.removeLayer(routeLayer);
    }
    
    routeLayer = L.layerGroup().addTo(map);

    // Draw Depot (Pulse effect)
    const depotIcon = L.divIcon({
        className: 'pulse-marker',
        html: ``,
        iconSize: [20, 20]
    });
    L.marker([data.depot[1], data.depot[0]], {icon: depotIcon}).addTo(routeLayer)
     .bindPopup(`<b>${translations[currentLang].depot}</b>`);

    // Draw Customers
    data.customers.forEach((c, i) => {
        const customerIcon = L.divIcon({
            className: 'customer-marker',
            html: `${i+1}`,
            iconSize: [24, 24]
        });
        L.marker([c[1], c[0]], {icon: customerIcon}).addTo(routeLayer)
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
    }).addTo(routeLayer);

    // Draw Truck Route (Premium dashed gradient-like line)
    const truckCoords = data.truck_route.map(p => [p[1], p[0]]);
    
    // Truck path outline for glow effect
    L.polyline(truckCoords, {color: '#cbd5e1', weight: 8, opacity: 0.5}).addTo(routeLayer);
    // Actual truck path
    L.polyline(truckCoords, {
        color: '#0f172a', 
        weight: 3.5, 
        lineCap: 'round'
    }).addTo(routeLayer);
    
    // Fit bounds smoothly to the generated points
    map.flyToBounds(tspCoords, {padding: [50, 50], duration: 1.5});
}

// Init
window.onload = () => {
    initMap();
    setLanguage('en');
};
