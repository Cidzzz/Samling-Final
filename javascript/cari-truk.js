
// --- DATA MOCKUP ---
const tpsData = [
    { id: 1, name: "TPS Jambangan", city: "Surabaya", status: "Normal", type: "Organik & Non-Organik", capacity: 45, distance: 120 },
    { id: 2, name: "TPS Keputih", city: "Surabaya", status: "Penuh", type: "B3 & Residu", capacity: 90, distance: 450 },
    { id: 3, name: "TPS Bratang", city: "Surabaya", status: "Normal", type: "Organik", capacity: 20, distance: 800 },
    { id: 4, name: "TPS Gadang", city: "Malang", status: "Normal", type: "Campuran", capacity: 65, distance: 1200 },
    { id: 5, name: "TPS Sukorame", city: "Kediri", status: "Penuh", type: "Organik", capacity: 88, distance: 2500 },
    { id: 6, name: "TPS Karanglo", city: "Blitar", status: "Normal", type: "Residu", capacity: 30, distance: 3100 }
];

// Added distance_from_tps field
const truckData = [
    { id: 'T-01', driver: "Budi Santoso", plate: "AG 9021 XA", eta: "5 min", rating: 4.8, status: "available", distance_from_tps: 1.2 },
    { id: 'T-02', driver: "Asep Sunandar", plate: "N 1234 TF", eta: "8 min", rating: 4.9, status: "available", distance_from_tps: 2.5 },
    { id: 'T-03', driver: "Joko Anwar", plate: "L 5543 SS", eta: "15 min", rating: 4.5, status: "busy", distance_from_tps: 0.8 },
    { id: 'T-04', driver: "Rian Hidayat", plate: "AG 7788 KK", eta: "18 min", rating: 4.7, status: "available", distance_from_tps: 3.1 }
];

// --- STATE & DOM ---
let currentStep = 1;
let selectedTps = null;
let selectedCity = 'all';
let searchQuery = '';

const dom = {
    step1: document.getElementById('step-1-content'),
    step2: document.getElementById('step-2-content'),
    tpsList: document.getElementById('tps-list'),
    truckList: document.getElementById('truck-list'),
    headerTitle: document.getElementById('header-title'),
    headerSubtitle: document.getElementById('header-subtitle'),
    stepInd1: document.getElementById('step-ind-1'),
    stepInd2: document.getElementById('step-ind-2'),
    emptyState: document.getElementById('empty-state'),
    modal: document.getElementById('detail-modal')
};
let trendChart = null;


// --- INIT ---
renderTPS();

// --- MODAL LOGIC ---
function openModal(tpsId) {
    const tps = tpsData.find(t => t.id === tpsId);
    if (!tps) return;

    selectedTps = tps;

    // Populate Modal
    document.getElementById('modal-tps-name').innerText = tps.name;
    document.getElementById('modal-tps-location').innerText = tps.city;
    document.getElementById('modal-tps-jenis').innerText = tps.type;
    
    // Update Circular Progress
    const circle = document.getElementById('circle-progress');
    const percentageText = document.getElementById('modal-percentage');
    
    // Logika warna lingkaran berdasarkan kapasitas
    let strokeColor = '#22c55e'; // Green
    if(tps.capacity > 70) strokeColor = '#eab308'; // Yellow
    if(tps.capacity > 90) strokeColor = '#ef4444'; // Red

    circle.style.stroke = strokeColor;
    circle.style.strokeDasharray = `${tps.capacity}, 100`;
    percentageText.innerHTML = `${tps.capacity}%`;

    //Update Capacity Bar
    const capacityElement = document.querySelector('.persentase-kapasitas .persentase');
    if (capacityElement) {
        capacityElement.innerText = `${tps.capacity}%`;
    }
    
    // 7-day trend data (mock)
    const trendData = {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        data: Array.from({length: 7}, () => Math.floor(Math.random() * (tps.capacity - 10)) + 10) // Mock data based on capacity
    };
    trendData.data[6] = tps.capacity; // Ensure today's data is accurate

    // Render Trend Chart
    const ctx = document.getElementById('trendChart').getContext('2d');
    if (trendChart) {
        trendChart.destroy();
    }
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: trendData.labels,
            datasets: [{
                label: 'Kapasitas',
                data: trendData.data,
                borderColor: '#16A34A',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#16A34A',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true, 
                    max: 100,
                    ticks: {
                        stepSize: 25,
                        callback: value => `${value}%`
                    }
                },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Show Modal
    dom.modal.classList.remove('hidden');
    dom.modal.querySelector('.relative').classList.add('modal-enter-active');
    dom.modal.querySelector('.relative').classList.remove('modal-exit-active');
}

function closeModal() {
    const modalPanel = dom.modal.querySelector('.relative');
    modalPanel.classList.remove('modal-enter-active');
    modalPanel.classList.add('modal-exit-active');
    setTimeout(() => {
        dom.modal.classList.add('hidden');
    }, 200);
}

function requestPickup() {
    // Placeholder for what happens when a pickup is requested from the modal
    console.log("Pickup requested for:", selectedTps.name);
    closeModal();
    selectTPS(selectedTps.id); // Or directly go to the next step
}


// --- HANDLERS ---
document.getElementById('city-select').addEventListener('change', (e) => {
    selectedCity = e.target.value;
    renderTPS();
});

document.getElementById('tps-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderTPS();
});

function handleGlobalBack() {
    if (currentStep === 2) {
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
        const statusColor = isFull ? "red" : "green";
        const capacityColor = isFull ? "bg-red-500" : "bg-green-600";
        const statusBg = "bg-white";

        const item = document.createElement('div');
        item.className = "p-6 hover:bg-gray-50 transition-colors group";
        item.innerHTML = `
            <div class="flex flex-col md:flex-row gap-6">
                <div class="hidden md:block pt-1">
                     <div class="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400">
                        <i class="fas fa-trash-alt"></i>
                    </div>
                </div>

                <div class="flex-grow w-full">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-base font-bold text-gray-900">${tps.name}</h3>
                    </div>

                    <div class="flex items-center gap-3 mb-4">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-${statusColor}-500 text-${statusColor}-600 text-xs font-semibold ${statusBg}">
                            <span class="w-1.5 h-1.5 rounded-full bg-${statusColor}-500"></span>
                            ${tps.status}
                        </span>
                        <span class="text-sm text-gray-500">${tps.type}</span>
                    </div>

                    <div class="flex items-center gap-4 mb-5">
                        <div class="flex-grow h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full ${capacityColor} rounded-full" style="width: ${tps.capacity}%"></div>
                        </div>
                        <span class="text-sm font-bold text-gray-900 w-10 text-right">${tps.capacity}%</span>
                    </div>

                    <div class="flex items-center justify-between mt-auto">
                        <div class="flex items-center text-gray-500 text-sm">
                            <i class="fas fa-truck text-gray-400 mr-2"></i>
                            Jarak: ${tps.distance} m
                        </div>
                        <div class="flex gap-3">
                            <button onclick="openModal(${tps.id})" class="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                Lihat Rincian
                            </button>
                            <button onclick="selectTPS(${tps.id})" class="px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition shadow-sm hover:shadow-md">
                                Pilih
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        dom.tpsList.appendChild(item);
    });
}

function renderTrucks() {
    dom.truckList.innerHTML = '';
    
    const activities = JSON.parse(localStorage.getItem('truckActivities')) || [];
    const ongoingTruckIds = activities.filter(a => a.status === 'ongoing').map(a => a.truckId);

    // Sort: Available first, then by distance
    const sortedTrucks = [...truckData].sort((a, b) => {
        if (a.status === b.status) return a.distance_from_tps - b.distance_from_tps;
        return a.status === 'available' ? -1 : 1;
    });

    sortedTrucks.forEach(truck => {
        const isBusy = truck.status === 'busy';
        const isOngoing = ongoingTruckIds.includes(truck.id);
        const isUnavailable = isBusy || isOngoing;

        let statusText = "Tersedia";
        if (isBusy) {
            statusText = "Lagi Sibuk";
        } else if (isOngoing) {
            statusText = "Sedang Berangkat";
        }
        
        const statusClass = isUnavailable ? "text-yellow-500 bg-yellow-50 border-yellow-100" : "text-green-600 bg-green-50 border-green-100";
        
        const el = document.createElement('div');
        el.className = `bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all ${isUnavailable ? 'opacity-75' : 'hover:border-green-500 hover:shadow-md'}`;
        
        let buttonText = 'Panggil Truk';
        if (isBusy) {
            buttonText = 'Sedang Bertugas';
        } else if (isOngoing) {
            buttonText = 'Sedang Berangkat';
        }

        el.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full ${isUnavailable ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-600'} flex items-center justify-center text-xl shrink-0">
                        <i class="fas fa-truck-moving"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-lg text-gray-900">${truck.driver}</h4>
                        <p class="text-sm text-gray-500 font-mono">${truck.plate}</p>
                    </div>
                </div>
                <span class="text-xs font-bold border px-3 py-1 rounded-full ${statusClass}">
                    ${statusText}
                </span>
            </div>

            <div class="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-50">
                <div class="text-center">
                    <p class="text-xs text-gray-400 mb-1">Estimasi</p>
                    <p class="font-semibold text-gray-700 text-sm"><i class="fas fa-clock text-green-500 mr-1"></i> ${truck.eta}</p>
                </div>
                <div class="text-center border-l border-r border-gray-50">
                    <p class="text-xs text-gray-400 mb-1">Jarak Truk</p>
                    <p class="font-semibold text-gray-700 text-sm"><i class="fas fa-route text-blue-500 mr-1"></i> ${truck.distance_from_tps} km</p>
                </div>
                <div class="text-center">
                    <p class="text-xs text-gray-400 mb-1">Rating</p>
                    <p class="font-semibold text-gray-700 text-sm"><i class="fas fa-star text-yellow-400 mr-1"></i> ${truck.rating}</p>

                </div>
            </div>

            <button 
                onclick="requestTruck('${truck.id}')"
                ${isUnavailable ? 'disabled' : ''}
                class="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isUnavailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 active:scale-[0.98]'}"
            >
                <i class="fas fa-paper-plane"></i> ${buttonText}
            </button>
        `;
        dom.truckList.appendChild(el);
    });
}

function requestTruck(truckId) {
    const truck = truckData.find(t => t.id === truckId);
    if (!truck) return;

    const newActivity = {
        id: Date.now(),
        status: 'ongoing',
        truckId: truck.id,
        route: `${selectedTps.name} -> Lokasi Anda`,
        timestamp: new Date().toISOString()
    };

    let activities = JSON.parse(localStorage.getItem('truckActivities')) || [];
    activities.unshift(newActivity);
    localStorage.setItem('truckActivities', JSON.stringify(activities));

    window.location.href = 'aktivitas.html';
}

// --- NAVIGATION LOGIC ---

function selectTPS(id) {
    selectedTps = tpsData.find(t => t.id === id);
    
    // Update summary data
    document.getElementById('selected-tps-name').textContent = selectedTps.name;
    document.getElementById('selected-tps-capacity').textContent = `Kapasitas: ${selectedTps.capacity}%`;

    goToStep(2);
}

function goToStep(step) {
    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (step === 1) {
        // Tampilan Langkah 1
        dom.step1.classList.remove('hidden');
        dom.step2.classList.add('hidden');
        
        // Update Header Text Step 1
        dom.headerTitle.innerText = "Pantau TPS";
        dom.headerSubtitle.innerText = "Monitoring Kapasitas Real-time";
        
        // Indikator UI
        dom.stepInd1.className = "px-3 py-1 rounded-full bg-green-600 text-white font-medium transition-colors";
        dom.stepInd2.className = "px-3 py-1 rounded-full bg-gray-100 text-gray-400 font-medium transition-colors";
    } else {
        // Tampilan Langkah 2
        dom.step1.classList.add('hidden');
        dom.step2.classList.remove('hidden');
        
        // Update Header Text Step 2 (Sesuai Referensi Gambar)
        dom.headerTitle.innerText = "Minta Angkut";
        dom.headerSubtitle.innerText = "Cari Truk Sampah Terdekat";

        renderTrucks();

        // Indikator UI
        dom.stepInd1.className = "px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium transition-colors cursor-pointer";
        dom.stepInd1.onclick = () => goToStep(1);
        dom.stepInd2.className = "px-3 py-1 rounded-full bg-green-600 text-white font-medium transition-colors";
    }
}
