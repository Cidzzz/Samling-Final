const progressData = [
    { cls: "organic-progress", percent: 58 },
    { cls: "nonorganic-progress", percent: 78 }
];

document.addEventListener("DOMContentLoaded", () => {
    progressData.forEach(item => {
        const circle = document.querySelector("." + item.cls);
        if (!circle) return;

        const radius = 80;
        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        const offset = circumference - (item.percent / 100) * circumference;

        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
            circle.style.transition = "stroke-dashoffset 1s ease";
        }, 100);
    });
});

 // 1. DATA TPS
        const tpsData = [
            {
                id: 1,
                nama: "TPS Jambangan",
                lokasi: "Jl. Jambangan Kebon Agung",
                status: "Normal",
                jenis: "Organik & Non-Organik",
                kapasitas: 45,
                jarak: 120,
                city: "Surabaya",
                trend: [30, 35, 40, 38, 42, 44, 45] // Data dummy grafik
            },
            {
                id: 2,
                nama: "TPS Keputih",
                lokasi: "Jl. Keputih Tegal",
                status: "Penuh",
                jenis: "B3 & Residu",
                kapasitas: 90,
                jarak: 450,
                city: "Surabaya",
                trend: [70, 75, 80, 85, 88, 89, 90]
            },
            {
                id: 3,
                nama: "TPS Bratang",
                lokasi: "Jl. Bratang Binangun",
                status: "Normal",
                jenis: "Organik",
                kapasitas: 20,
                jarak: 800,
                city: "Surabaya",
                trend: [10, 15, 12, 18, 20, 19, 20]
            },
            { 
                id: 4, 
                nama: "TPS Gadang", 
                lokasi: "Jl. Gadang",
                city: "Malang", 
                status: "Normal", 
                jenis: "Campuran", 
                kapasitas: 65, 
                jarak: 1200,
                trend: [50, 55, 60, 58, 62, 64, 65]
            },
            { 
                id: 5, 
                nama: "TPS Sukorame", 
                lokasi: "Jl. Sukorame",
                city: "Kediri", 
                status: "Penuh", 
                jenis: "Organik", 
                kapasitas: 88, 
                jarak: 2500,
                trend: [70, 75, 80, 82, 85, 87, 88]
            },
            { 
                id: 6, 
                nama: "TPS Karanglo", 
                lokasi: "Jl. Karanglo",
                city: "Blitar", 
                status: "Normal", 
                jenis: "Residu", 
                kapasitas: 30, 
                jarak: 3100,
                trend: [20, 22, 25, 24, 28, 29, 30]
            }
        ];

        let myChart = null; // Variabel global untuk Chart instance
        let selectedCity = 'all';
        let searchQuery = '';

        // 2. Helper Warna
        function getStatusColor(status) {
            if (status === 'Normal') return 'text-green-700 border-green-600 bg-white';
            if (status === 'Waspada') return 'text-yellow-700 border-yellow-600 bg-white';
            if (status === 'Penuh') return 'text-red-700 border-red-600 bg-white';
            return 'text-gray-700 border-gray-600 bg-white';
        }

        function getDotColor(status) {
            if (status === 'Normal') return 'bg-green-600';
            if (status === 'Waspada') return 'bg-yellow-600';
            if (status === 'Penuh') return 'bg-red-600';
            return 'bg-gray-600';
        }

        // 3. RENDER LIST TPS
        function renderTPS() {
            const container = document.getElementById('tps-list');
            const emptyState = document.getElementById('empty-state');
            container.innerHTML = '';
            
            const filtered = tpsData.filter(tps => {
                const cityMatch = selectedCity === 'all' || tps.city === selectedCity;
                const searchMatch = tps.nama.toLowerCase().includes(searchQuery);
                return cityMatch && searchMatch;
            });

            if (filtered.length === 0) {
                emptyState.classList.remove('hidden');
                return;
            }
            emptyState.classList.add('hidden');

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
                                <h3 class="text-base font-bold text-gray-900">${tps.nama}</h3>
                            </div>

                            <div class="flex items-center gap-3 mb-4">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-${statusColor}-500 text-${statusColor}-600 text-xs font-semibold ${statusBg}">
                                    <span class="w-1.5 h-1.5 rounded-full bg-${statusColor}-500"></span>
                                    ${tps.status}
                                </span>
                                <span class="text-sm text-gray-500">${tps.jenis}</span>
                            </div>

                            <div class="flex items-center gap-4 mb-5">
                                <div class="flex-grow h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full ${capacityColor} rounded-full" style="width: ${tps.kapasitas}%"></div>
                                </div>
                                <span class="text-sm font-bold text-gray-900 w-10 text-right">${tps.kapasitas}%</span>
                            </div>

                            <div class="flex items-center justify-between mt-auto">
                                <div class="flex items-center text-gray-500 text-sm">
                                    <i class="fas fa-truck text-gray-400 mr-2"></i>
                                    Jarak: ${tps.jarak} m
                                </div>
                                <div class="flex gap-3">
                                    <button onclick="openModal(${tps.id})" class="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                        Lihat Rincian
                                    </button>
                                    <button onclick="pilihTPS(${tps.id})" class="px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition shadow-sm hover:shadow-md">
                                        Pilih
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(item);
            });
        }

        // 4. LOGIKA INTERAKSI
        document.getElementById('city-select').addEventListener('change', (e) => {
            selectedCity = e.target.value;
            renderTPS();
        });

        document.getElementById('tps-search').addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderTPS();
        });
        
        // A. Fungsi Pilih TPS (Redirect)
        function pilihTPS(id) {
            console.log("Mengalihkan ke cari-truk.html dari ID:", id);
            window.location.href = '/cari-truk.html'; 
        }

        // B. Fungsi Buka Modal Detail
        function openModal(id) {
            const tps = tpsData.find(t => t.id === id);
            if (!tps) return;

            // Isi Data Modal
            document.getElementById('modal-tps-name').innerText = tps.nama;
            document.getElementById('modal-tps-location').innerHTML = `<i class="fa-solid fa-location-dot mr-1"></i> ${tps.lokasi}`;
            document.getElementById('modal-tps-jenis').innerText = tps.jenis;
            
            // Update Circular Progress
            const circle = document.getElementById('circle-progress');
            const percentageText = document.getElementById('modal-percentage');
            
            // Logika warna lingkaran berdasarkan kapasitas
            let strokeColor = '#22c55e'; // Green
            if(tps.kapasitas > 70) strokeColor = '#eab308'; // Yellow
            if(tps.kapasitas > 90) strokeColor = '#ef4444'; // Red

            circle.style.stroke = strokeColor;
            circle.style.strokeDasharray = `${tps.kapasitas}, 100`;
            percentageText.innerHTML = `${tps.kapasitas}%`;

            // Render Chart
            renderChart(tps.trend);

            // Tampilkan Modal
            document.getElementById('detail-modal').classList.remove('hidden');
        }

        // C. Fungsi Tutup Modal
        function closeModal() {
            document.getElementById('detail-modal').classList.add('hidden');
        }

        // D. Fungsi Request Pickup (Redirect ke cari-truk.html)
        function requestPickup() {
            console.log("Request pickup diklik, redirecting...");
            window.location.href = '/cari-truk.html';
        }

        // E. Setup Chart.js
        function renderChart(dataTrend) {
            const ctx = document.getElementById('trendChart').getContext('2d');
            
            // Hancurkan chart lama jika ada (agar tidak menumpuk)
            if (myChart) {
                myChart.destroy();
            }

            // Buat Chart Baru
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                    datasets: [{
                        label: 'Kapasitas (%)',
                        data: dataTrend,
                        borderColor: '#22c55e', // Green line
                        backgroundColor: 'rgba(34, 197, 94, 0.1)', // Light green area
                        borderWidth: 2,
                        tension: 0.4, // Garis melengkung halus
                        fill: true,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#22c55e',
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { borderDash: [5, 5], color: '#f3f4f6' }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }

        document.addEventListener('DOMContentLoaded', renderTPS);