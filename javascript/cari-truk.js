// --- DATA MOCKUP ---
const tpsData = [
    { id: 1, name: "TPS Jambangan", city: "Surabaya", status: "Normal", type: "Organik & Non-Organik", capacity: 45, distance: 120, trend: [30, 32, 35, 33, 40, 42, 45] },
    { id: 2, name: "TPS Keputih", city: "Surabaya", status: "Penuh", type: "B3 & Residu", capacity: 90, distance: 450, trend: [80, 82, 85, 83, 88, 89, 90] },
    { id: 3, name: "TPS Bratang", city: "Surabaya", status: "Normal", type: "Organik", capacity: 20, distance: 800, trend: [10, 12, 15, 13, 18, 19, 20] },
    { id: 4, name: "TPS Gadang", city: "Malang", status: "Normal", type: "Campuran", capacity: 65, distance: 1200, trend: [50, 52, 55, 53, 60, 62, 65] },
    { id: 5, name: "TPS Sukorame", city: "Kediri", status: "Penuh", type: "Organik", capacity: 88, distance: 2500, trend: [78, 80, 82, 81, 85, 87, 88] },
    { id: 6, name: "TPS Karanglo", city: "Blitar", status: "Normal", type: "Residu", capacity: 30, distance: 3100, trend: [20, 22, 25, 23, 28, 29, 30] }
];

const truckData = [
    { id: 'T-01', driver: "Budi Santoso", plate: "AG 9021 XA", eta: "5 min", rating: 4.8, status: "available", distance_from_tps: 1.2 },
    { id: 'T-02', driver: "Asep Sunandar", plate: "N 1234 TF", eta: "8 min", rating: 4.9, status: "available", distance_from_tps: 2.5 },
    { id: 'T-03', driver: "Joko Anwar", plate: "L 5543 SS", eta: "15 min", rating: 4.5, status: "busy", distance_from_tps: 0.8 },
    { id: 'T-04', driver: "Rian Hidayat", plate: "AG 7788 KK", eta: "18 min", rating: 4.7, status: "available", distance_from_tps: 3.1 }
];

const destinationData = [
    { id: 'tpa', name: "Kirim ke TPA", description: "Buang sampah langsung ke Tempat Pembuangan Akhir.", icon: 'fa-dumpster' },
    { id: 'mitra', name: "Kirim ke Mitra", description: "Kirim sampah ke mitra untuk diolah lebih lanjut.", icon: 'fa-hands-helping' }
];

// --- STATE & DOM ---
let currentStep = 1;
let selectedTps = null;
let destinationType = null; // 'tpa' or 'mitra'
let finalDestination = null; // The specific TPA or Mitra object

// Step 1 state
let selectedCity = 'all';
let searchQuery = '';

// Step 3 state
let tpaSelectedCity = 'all';
let tpaSearchQuery = '';

const dom = {
    step1: document.getElementById('step-1-content'),
    step2: document.getElementById('step-2-content'),
    step3: document.getElementById('step-3-content'),
    step4: document.getElementById('step-4-content'),
    step5: document.getElementById('step-5-content'),
    tpsList: document.getElementById('tps-list'),
    destinationList: document.getElementById('destination-list'),
    tpaList: document.getElementById('tpa-list'),
    truckList: document.getElementById('truck-list'),
    headerTitle: document.getElementById('header-title'),
    headerSubtitle: document.getElementById('header-subtitle'),
    stepInd1: document.getElementById('step-ind-1'),
    stepInd2: document.getElementById('step-ind-2'),
    stepInd3: document.getElementById('step-ind-3'),
    stepInd4: document.getElementById('step-ind-4'),
    emptyState: document.getElementById('empty-state'),
    tpaEmptyState: document.getElementById('tpa-empty-state'),
    modal: document.getElementById('detail-modal'),
};
let trendChart = null;
let compositionChartInstance = null;


// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    renderTPS();

    // --- HANDLERS ---
    // Step 1
    document.getElementById('city-select').addEventListener('change', (e) => {
        selectedCity = e.target.value;
        renderTPS();
    });
    document.getElementById('tps-search').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderTPS();
    });

    // Step 3
    document.getElementById('tpa-city-select').addEventListener('change', (e) => {
        tpaSelectedCity = e.target.value;
        renderTpaOptions();
    });
    document.getElementById('tpa-search').addEventListener('input', (e) => {
        tpaSearchQuery = e.target.value.toLowerCase();
        renderTpaOptions();
    });
});


// --- MODAL LOGIC ---

function renderTrendChart(targetCanvas, trendData, capacity) {
    if (!targetCanvas) return;
    if (trendChart) trendChart.destroy();

    const labels = ['6hr lalu', '5hr lalu', '4hr lalu', '3hr lalu', '2hr lalu', '1hr lalu', 'Saat Ini'];
    
    let pointBgColor = '#22c55e'; // Green
    if (capacity > 70) pointBgColor = '#eab308'; // Yellow
    if (capacity > 90) pointBgColor = '#ef4444'; // Red
    
    trendChart = new Chart(targetCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Kapasitas (%)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                fill: true,
                data: trendData,
                tension: 0.4,
                pointBackgroundColor: pointBgColor,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100, ticks: { stepSize: 25, callback: (value) => value + '%' } } }
        }
    });
}

function renderCompositionChart(targetCanvas, compositionData) {
    if (!targetCanvas) return;
    if (compositionChartInstance) compositionChartInstance.destroy();

    compositionChartInstance = new Chart(targetCanvas, {
        type: 'doughnut',
        data: {
            labels: ['Organik', 'Anorganik', 'B3'],
            datasets: [{
                data: [compositionData.organic, compositionData.nonOrganic, compositionData.b3],
                backgroundColor: ['#16a34a', '#0ea5e9', '#f97316'],
                borderColor: '#ffffff',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'rectRounded'
                    }
                }
            }
        }
    });
}

function openModal(tpsId) {
    const tps = tpsData.find(t => t.id === tpsId);
    if (!tps) return;
    
    const modalBody = document.getElementById('modal-body-content');
    const tpsModalHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center col-span-1 md:col-span-1 relative overflow-hidden">
                <h4 class="text-sm font-semibold text-gray-500 mb-4 w-full text-left">Status Saat Ini</h4>
                <svg viewBox="0 0 36 36" class="circular-chart w-40 h-40">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path id="circle-progress" class="circle" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" class="percentage" id="modal-percentage">0%</text>
                    <text x="18" y="25" class="label">Kapasitas</text>
                </svg>
            </div>
            <div class="col-span-1 md:col-span-2 flex flex-col gap-6">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div><p class="text-sm text-gray-500 mb-1">Kesehatan Sensor</p><span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"><span class="w-2 h-2 bg-green-600 rounded-full mr-2"></span>Bagus</span></div>
                    <div class="text-right"><p class="text-sm text-gray-500 mb-1">Terakhir Diupdate</p><p class="font-semibold text-gray-900">5 menit lalu</p></div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1"><p class="text-sm text-gray-500 mb-3">Kategori Sampah</p><div class="flex items-center gap-3"><div class="p-3 bg-green-50 rounded-lg text-green-600"><i class="fa-solid fa-recycle text-xl"></i></div><div><h5 class="font-bold text-gray-900">${tps.type}</h5><p class="text-xs text-gray-400">Terdeteksi otomatis</p></div></div></div>
            </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div class="flex justify-between items-center mb-4"><h4 class="text-sm font-semibold text-gray-500">Tren Kapasitas (7 Periode Terakhir)</h4><i class="fa-solid fa-chart-line text-gray-400"></i></div>
            <div class="h-64 w-full"><canvas id="trendChart"></canvas></div>
        </div>
        <div class="grid grid-cols-1 gap-3"><button id="modal-select-button" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm flex justify-center items-center gap-2"><i class="fa-solid fa-truck"></i> Pilih TPS Ini</button></div>
    `;
    modalBody.innerHTML = tpsModalHTML;

    document.getElementById('modal-tps-name').innerText = tps.name;
    document.getElementById('modal-tps-location').innerHTML = `<i class="fa-solid fa-location-dot mr-1"></i> ${tps.city}`;
    
    const circle = document.getElementById('circle-progress');
    const percentageText = document.getElementById('modal-percentage');
    let strokeColor = tps.capacity > 90 ? '#ef4444' : tps.capacity > 70 ? '#facc15' : '#22c55e';
    circle.style.stroke = strokeColor;
    percentageText.style.fill = strokeColor;

    let currentPercent = 0;
    const interval = setInterval(() => {
        if (currentPercent >= tps.capacity) {
            clearInterval(interval);
        } else {
            currentPercent++;
            percentageText.innerHTML = `${Math.ceil(currentPercent)}%`;
            circle.style.strokeDasharray = `${currentPercent}, 100`;
        }
    }, 10);

    document.getElementById('modal-select-button').onclick = () => { closeModal(); selectTPS(tps.id); };
    renderTrendChart(document.getElementById('trendChart'), tps.trend, tps.capacity);
    dom.modal.classList.remove('hidden');
}

function openTpaModal(tpaId) {
    const tpa = tpaData.find(t => t.id === tpaId);
    if (!tpa) return;

    const modalBody = document.getElementById('modal-body-content');
    const tpaModalHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p class="text-sm text-gray-500 mb-1">Volume Harian</p>
                <p class="text-2xl font-bold text-gray-800">${tpa.dailyVolume.toLocaleString('id-ID')}</p>
                <p class="text-xs text-gray-400">ton/hari</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p class="text-sm text-gray-500 mb-1">Status Kapasitas</p>
                <p class="text-2xl font-bold ${tpa.kapasitas > 80 ? 'text-red-500' : 'text-green-500'}">${tpa.kapasitas}%</p>
                <p class="text-xs text-gray-400">${tpa.status}</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p class="text-sm text-gray-500 mb-1">Sisa Umur TPA</p>
                <p class="text-2xl font-bold text-gray-800">${tpa.lifespan}</p>
                <p class="text-xs text-gray-400">tahun</p>
            </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h4 class="text-sm font-semibold text-gray-500 mb-4">Komposisi Rata-rata Sampah</h4>
            <div class="h-64 w-full flex items-center justify-center">
                <canvas id="tpa-composition-chart"></canvas>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-3">
            <button id="modal-select-button" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm flex justify-center items-center gap-2">
                <i class="fa-solid fa-truck"></i> Pilih TPA Ini
            </button>
        </div>
    `;
    modalBody.innerHTML = tpaModalHTML;

    document.getElementById('modal-tps-name').innerText = tpa.nama;
    document.getElementById('modal-tps-location').innerHTML = `<i class="fa-solid fa-location-dot mr-1"></i> ${tpa.lokasi}`;
    
    document.getElementById('modal-select-button').onclick = () => { closeModal(); selectTpa(tpa.id); };
    
    renderCompositionChart(document.getElementById('tpa-composition-chart'), tpa.wasteComposition);
    dom.modal.classList.remove('hidden');
}

function closeModal() {
    dom.modal.classList.add('hidden');
}

// --- GLOBAL BACK HANDLER ---
function handleGlobalBack() {
    if (currentStep === 5) {
        goToStep(destinationType === 'tpa' ? 3 : 4);
    } else if (currentStep === 3 || currentStep === 4) {
        goToStep(2);
    } else if (currentStep === 2) {
        goToStep(1);
    } else {
        window.location.href = 'beranda.html';
    }
}

// --- RENDER LOGIC ---

function renderTPS() {
    dom.tpsList.innerHTML = '';
    
    const filtered = tpsData.filter(tps => {
        const cityMatch = selectedCity === 'all' || tps.city === selectedCity;
        const searchMatch = tps.name.toLowerCase().includes(searchQuery);
        return cityMatch && searchMatch;
    });

    if (filtered.length === 0) {
        dom.emptyState.classList.remove('hidden');
        return;
    }
    dom.emptyState.classList.add('hidden');

    filtered.forEach(tps => {
        const isFull = tps.status === "Penuh";
        let statusColor, statusBg, capacityBg;

        if (tps.capacity >= 90) {
            statusColor = "text-red-600";
            statusBg = "bg-red-50";
            capacityBg = "bg-gradient-to-r from-red-400 to-red-600";
        } else if (tps.capacity >= 70) {
            statusColor = "text-yellow-600";
            statusBg = "bg-yellow-50";
            capacityBg = "bg-gradient-to-r from-yellow-400 to-yellow-500";
        } else {
            statusColor = "text-green-600";
            statusBg = "bg-green-50";
            capacityBg = "bg-gradient-to-r from-green-400 to-green-600";
        }
        
        const distanceStr = tps.distance >= 1000 
            ? `${(tps.distance / 1000).toFixed(1)} km` 
            : `${tps.distance} m`;

        const item = document.createElement('div');
        item.className = "p-6 hover:bg-green-50/50 transition-colors group cursor-pointer";
        item.onclick = () => openModal(tps.id);

        item.innerHTML = `
            <div class="flex flex-col md:flex-row gap-5">
                <div class="flex-shrink-0">
                    <div class="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-green-100 text-gray-400 group-hover:text-green-600 flex items-center justify-center transition-all">
                        <i class="fas fa-recycle text-2xl"></i>
                    </div>
                </div>
                <div class="flex-grow w-full">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-base font-bold text-gray-800 group-hover:text-green-800">${tps.name}</h3>
                        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusBg} ${statusColor}">
                            <span class="w-2 h-2 rounded-full ${capacityBg.split(' ')[1]}"></span>
                            ${tps.status}
                        </span>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span><i class="fa-solid fa-tag mr-1.5 opacity-60"></i>${tps.type}</span>
                        <span><i class="fa-solid fa-map-pin mr-1.5 opacity-60"></i>${tps.city}</span>
                        <span><i class="fa-solid fa-truck-arrow-right mr-1.5 opacity-60"></i>${distanceStr}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex-grow h-2.5 bg-gray-200/70 rounded-full overflow-hidden">
                            <div class="h-full rounded-full ${capacityBg}" style="width: ${tps.capacity}%"></div>
                        </div>
                        <span class="text-sm font-bold text-gray-700 w-12 text-right">${tps.capacity}%</span>
                    </div>
                </div>
                <div class="hidden lg:flex items-center justify-center pl-4">
                     <button onclick="event.stopPropagation(); selectTPS(${tps.id})" class="w-full md:w-auto px-6 py-3 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition shadow-sm hover:shadow-md">Pilih</button>
                </div>
            </div>
            <div class="lg:hidden mt-4">
                 <button onclick="event.stopPropagation(); selectTPS(${tps.id})" class="w-full md:w-auto px-6 py-3 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition shadow-sm hover:shadow-md">Pilih</button>
            </div>
        `;
        dom.tpsList.appendChild(item);
    });
}

function renderDestinationOptions() {
    dom.destinationList.innerHTML = '';
    destinationData.forEach(dest => {
        const el = document.createElement('div');
        el.className = 'bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all hover:border-green-500 hover:shadow-md';
        el.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl shrink-0"><i class="fas ${dest.icon}"></i></div>
                    <div>
                        <h4 class="font-bold text-lg text-gray-900">${dest.name}</h4>
                        <p class="text-sm text-gray-500">${dest.description}</p>
                    </div>
                </div>
            </div>
            <button onclick="selectDestination('${dest.id}')" class="mt-auto w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 active:scale-[0.98]"><i class="fas fa-arrow-right"></i> Lanjutkan</button>
        `;
        dom.destinationList.appendChild(el);
    });
}

function renderTpaOptions() {
    dom.tpaList.innerHTML = '';
    
    const filtered = tpaData.filter(tpa => {
        const cityMatch = tpaSelectedCity === 'all' || tpa.city === tpaSelectedCity;
        const searchMatch = tpa.nama.toLowerCase().includes(tpaSearchQuery);
        return cityMatch && searchMatch;
    });

    if (filtered.length === 0) {
        dom.tpaEmptyState.classList.remove('hidden');
        return;
    }
    dom.tpaEmptyState.classList.add('hidden');

    filtered.forEach(tpa => {
        let statusColor, statusBg, capacityBg;

        if (tpa.kapasitas >= 80) {
            statusColor = "text-red-600";
            statusBg = "bg-red-50";
            capacityBg = "bg-gradient-to-r from-red-400 to-red-600";
        } else if (tpa.kapasitas >= 60) {
            statusColor = "text-yellow-600";
            statusBg = "bg-yellow-50";
            capacityBg = "bg-gradient-to-r from-yellow-400 to-yellow-500";
        } else {
            statusColor = "text-green-600";
            statusBg = "bg-green-50";
            capacityBg = "bg-gradient-to-r from-green-400 to-green-600";
        }

        const distanceKm = (tpa.jarak / 1000).toFixed(1);

        const item = document.createElement('div');
        item.className = "p-6 hover:bg-blue-50/50 transition-colors group cursor-pointer border-b border-gray-100";
        item.onclick = () => openTpaModal(tpa.id);

        item.innerHTML = `
            <div class="flex items-center gap-5">
                <div class="flex-shrink-0">
                    <div class="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-100 text-gray-400 group-hover:text-blue-600 flex items-center justify-center transition-all">
                        <i class="fas fa-dumpster-fire text-2xl"></i>
                    </div>
                </div>
                <div class="flex-grow w-full">
                     <div class="flex items-center justify-between mb-2">
                        <h3 class="text-base font-bold text-gray-800 group-hover:text-blue-800">${tpa.nama}</h3>
                        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusBg} ${statusColor}">
                            <span class="w-2 h-2 rounded-full ${capacityBg.split(' ')[1]}"></span>
                            ${tpa.status}
                        </span>
                    </div>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
                        <span><i class="fa-solid fa-building-shield mr-1.5 opacity-60"></i>${tpa.jenis}</span>
                        <span><i class="fa-solid fa-map-pin mr-1.5 opacity-60"></i>${tpa.city}</span>
                        <span><i class="fa-solid fa-truck-arrow-right mr-1.5 opacity-60"></i>${distanceKm} km</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex-grow h-2.5 bg-gray-200/70 rounded-full overflow-hidden">
                            <div class="h-full rounded-full ${capacityBg}" style="width: ${tpa.kapasitas}%"></div>
                        </div>
                        <span class="text-sm font-bold text-gray-700 w-12 text-right">${tpa.kapasitas}%</span>
                    </div>
                </div>
                 <div class="flex items-center text-gray-300 group-hover:text-blue-600 transition">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
        dom.tpaList.appendChild(item);
    });
}

function renderTrucks() {
    dom.truckList.innerHTML = '';
    
    const activities = JSON.parse(localStorage.getItem('truckActivities')) || [];
    const busyTruckIds = activities.filter(act => act.status === 'ongoing').map(act => act.truckId);

    truckData.forEach(truck => {
        const isBusy = busyTruckIds.includes(truck.id);
        const isAvailable = truck.status === 'available' && !isBusy;

        const el = document.createElement('div');
        el.className = `bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all ${!isAvailable ? 'opacity-60' : 'hover:border-green-500 hover:shadow-md'}`;
        
        el.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full ${!isAvailable ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-600'} flex items-center justify-center text-xl shrink-0"><i class="fas fa-truck-moving"></i></div>
                    <div>
                        <h4 class="font-bold text-lg text-gray-900">${truck.driver}</h4>
                        <p class="text-sm text-gray-500 font-mono">${truck.plate}</p>
                    </div>
                </div>
                <span class="text-xs font-bold border px-3 py-1 rounded-full ${!isAvailable ? 'text-yellow-500 bg-yellow-50 border-yellow-100' : 'text-green-600 bg-green-50 border-green-100'}">${isAvailable ? 'Tersedia' : 'Sibuk'}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-50">
                <div class="text-center"><p class="text-xs text-gray-400 mb-1">Estimasi</p><p class="font-semibold text-gray-700 text-sm"><i class="fas fa-clock text-green-500 mr-1"></i> ${truck.eta}</p></div>
                <div class="text-center border-l border-r border-gray-50"><p class="text-xs text-gray-400 mb-1">Jarak Truk</p><p class="font-semibold text-gray-700 text-sm"><i class="fas fa-route text-blue-500 mr-1"></i> ${truck.distance_from_tps} km</p></div>
                <div class="text-center"><p class="text-xs text-gray-400 mb-1">Rating</p><p class="font-semibold text-gray-700 text-sm"><i class="fas fa-star text-yellow-400 mr-1"></i> ${truck.rating}</p></div>
            </div>
            <button onclick="requestTruck('${truck.id}')" ${!isAvailable ? 'disabled' : ''} class="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 active:scale-[0.98]'}"><i class="fas fa-paper-plane"></i> ${isAvailable ? 'Panggil Truk' : 'Sedang Bertugas'}</button>
        `;
        dom.truckList.appendChild(el);
    });
}

function requestTruck(truckId) {
    const activities = JSON.parse(localStorage.getItem('truckActivities')) || [];
    const isBusy = activities.some(act => act.status === 'ongoing' && act.truckId === truckId);

    if (isBusy) {
        alert("Truk ini sedang dalam perjalanan dan tidak bisa dipanggil.");
        return;
    }

    const truck = truckData.find(t => t.id === truckId);
    if (!truck || !selectedTps || !finalDestination) return;

    const newActivity = {
        id: Date.now(),
        status: 'ongoing',
        truckId: truck.id,
        route: `${selectedTps.name} -> ${finalDestination.name || finalDestination.nama}`,
        timestamp: new Date().toISOString()
    };

    activities.unshift(newActivity);
    localStorage.setItem('truckActivities', JSON.stringify(activities));

    window.location.href = 'aktivitas.html';
}

// --- NAVIGATION LOGIC ---

function goToStep(step) {
    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide all steps
    [dom.step1, dom.step2, dom.step3, dom.step4, dom.step5].forEach(s => s.classList.add('hidden'));
    
    // Reset indicators
    [dom.stepInd1, dom.stepInd2, dom.stepInd3, dom.stepInd4].forEach(ind => {
        ind.className = "px-3 py-1 rounded-full bg-gray-100 text-gray-400 font-medium transition-colors whitespace-nowrap";
        ind.onclick = null;
    });

    const setActive = (el) => {
        el.className = "px-3 py-1 rounded-full bg-green-600 text-white font-medium transition-colors whitespace-nowrap";
    };
    const setDone = (el, targetStep) => {
        el.className = "px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium transition-colors cursor-pointer whitespace-nowrap";
        el.onclick = () => goToStep(targetStep);
    };

    if (step === 1) {
        dom.step1.classList.remove('hidden');
        dom.headerTitle.innerText = "Pantau TPS";
        dom.headerSubtitle.innerText = "Monitoring Kapasitas Real-time";
        setActive(dom.stepInd1);
    } else if (step === 2) {
        dom.step2.classList.remove('hidden');
        dom.headerTitle.innerText = "Pilih Tipe Tujuan";
        dom.headerSubtitle.innerText = "Kirim sampah ke TPA atau Mitra Pengolah";
        document.getElementById('selected-tps-name-step2').textContent = selectedTps.name;
        renderDestinationOptions();
        setDone(dom.stepInd1, 1);
        setActive(dom.stepInd2);
    } else if (step === 3) { // TPA
        dom.step3.classList.remove('hidden');
        dom.headerTitle.innerText = "Pilih TPA Tujuan";
        dom.headerSubtitle.innerText = "Pilih dari daftar TPA yang tersedia";
        renderTpaOptions();
        setDone(dom.stepInd1, 1);
        setDone(dom.stepInd2, 2);
        setActive(dom.stepInd3);
    } else if (step === 4) { // Mitra
        dom.step4.classList.remove('hidden');
        dom.headerTitle.innerText = "Pilih Mitra Pengolah";
        dom.headerSubtitle.innerText = "Pilih dari daftar mitra terverifikasi";
        document.getElementById('selected-tps-name-step4').textContent = selectedTps.name;
        if(typeof initMitraStep === 'function') {
            initMitraStep();
        }
        setDone(dom.stepInd1, 1);
        setDone(dom.stepInd2, 2);
        setActive(dom.stepInd3);
    } else if (step === 5) { // Armada
        dom.step5.classList.remove('hidden');
        dom.headerTitle.innerText = "Minta Angkut";
        dom.headerSubtitle.innerText = "Cari Truk Sampah Terdekat";
        document.getElementById('selected-tps-name').textContent = selectedTps.name;
        document.getElementById('selected-destination-name').textContent = finalDestination.name || finalDestination.nama;
        document.getElementById('selected-tps-capacity').textContent = `Kapasitas: ${selectedTps.capacity}%`;
        renderTrucks();
        setDone(dom.stepInd1, 1);
        setDone(dom.stepInd2, 2);
        setDone(dom.stepInd3, destinationType === 'tpa' ? 3 : 4);
        setActive(dom.stepInd4);
    }
}

function selectTPS(id) {
    selectedTps = tpsData.find(t => t.id === id);
    goToStep(2);
}

function selectDestination(type) { // type is 'tpa' or 'mitra'
    destinationType = type;
    if (type === 'tpa') {
        goToStep(3);
    } else if (type === 'mitra') {
        goToStep(4);
    }
}

function selectTpa(id) {
    finalDestination = tpaData.find(t => t.id === id);
    if(finalDestination) {
        goToStep(5);
    }
}

function selectMitra(mitraObject) {
    finalDestination = mitraObject;
    if (finalDestination) {
        goToStep(5);
    }
}
