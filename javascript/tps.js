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
                trend: [10, 15, 12, 18, 20, 19, 20]
            }
        ];

        let myChart = null; // Variabel global untuk Chart instance

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
        function renderTPSList() {
            const container = document.getElementById('tps-list-container');
            container.innerHTML = '';

            tpsData.forEach(tps => {
                const htmlItem = `
                <div class="flex flex-row items-start gap-5 w-full border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                    
                    <!-- Ikon Tong Sampah (Kiri) -->
                    <div class="pt-1">
                        <i class="fa-regular fa-trash-can text-gray-400 text-xl"></i>
                    </div>

                    <!-- Konten Utama -->
                    <div class="flex flex-col gap-4 w-full">
                        
                        <!-- Baris 1: Nama TPS -->
                        <h4 class="text-black font-medium text-lg leading-none">${tps.nama}</h4>

                        <!-- Baris 2: Status Badge & Jenis Sampah -->
                        <div class="flex flex-row items-center gap-3 text-sm mt-1">
                            <div class="flex items-center gap-2 px-4 py-1 rounded-full border ${getStatusColor(tps.status)}">
                                <span class="w-2 h-2 rounded-full ${getDotColor(tps.status)}"></span>
                                <span class="font-medium">${tps.status}</span>
                            </div>
                            <span class="text-gray-500 text-sm">${tps.jenis}</span>
                        </div>

                        <!-- Baris 3: Progress Bar Kapasitas (FULL WIDTH) -->
                        <!-- Saya hilangkan max-w-3xl, jadi sekarang dia w-full (mentok kanan) -->
                        <div class="flex items-center gap-4 w-full mt-2">
                            <div class="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                                <div class="h-full bg-green-600 rounded-full" style="width: ${tps.kapasitas}%"></div>
                            </div>
                            <span class="text-base font-bold text-black">${tps.kapasitas}%</span>
                        </div>

                        <!-- Baris 4: Jarak (Kiri) & Tombol (Mentok Kanan) -->
                        <!-- Saya hilangkan max-w-3xl, jadi sekarang dia w-full -->
                        <div class="flex flex-row items-center justify-between w-full mt-3">
                            
                            <!-- Info Jarak -->
                            <div class="flex items-center gap-2 text-gray-500 text-sm text-sm">
                                <i class="fa-solid fa-truck-fast"></i>
                                <span>Jarak: ${tps.jarak} m</span>
                            </div>

                            <!-- Grup Tombol -->
                            <div class="flex gap-3">
                                <!-- Tombol Pilih -->
                                <button onclick="pilihTPS('${tps.id}')" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Pilih
                                </button>
                                <!-- Tombol Rincian -->
                                <button onclick="showDetails(${tps.id})" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Lihat Rincian
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                `;
                container.insertAdjacentHTML('beforeend', htmlItem);
            });
        }

        // 4. LOGIKA INTERAKSI
        
        // A. Fungsi Pilih TPS (Redirect)
        function pilihTPS(id) {
            console.log("Mengalihkan ke cari-truk.html dari ID:", id);
            window.location.href = '/cari-truk.html'; 
        }

        // B. Fungsi Buka Modal Detail
        function showDetails(id) {
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

        document.addEventListener('DOMContentLoaded', renderTPSList);