document.addEventListener('DOMContentLoaded', () => {
    // --- DUMMY DATA ---
    // Note: truckData comes from truck_data.js
    // Note: defaultData (partners) comes from partner_data.js

    const truckActivities = [
        { id: 1, status: 'ongoing', truckId: 'T-01', route: 'Perumahan Griya Asri -> TPS Pusat', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
        { id: 2, status: 'ready', truckId: 'T-03', route: 'Kawasan Industri Candi -> TPS Barat', timestamp: new Date() },
        { id: 4, status: 'completed', truckId: 'T-01', route: 'Area Perkantoran -> TPS Timur', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { id: 5, status: 'completed', truckId: 'T-04', route: 'Cluster Melati -> TPS Utara', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
        { id: 6, status: 'completed', truckId: 'T-02', route: 'Desa Suko -> TPS Barat', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) }
    ];

    const partnerHistory = [
        { id: 1, partnerId: 5, weight: 750, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }, // Plastik Reborn Krian
        { id: 2, partnerId: 4, weight: 250, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }, // Urban Farming Porong
        { id: 3, partnerId: 3, weight: 1000, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // BioEnergy Candi
    ];

    const container = document.getElementById('activity-container');

    // --- RENDER FUNCTIONS ---
    
    function renderPage() {
        renderTruckActivities();
        renderPartnerHistory();
    }

    function renderTruckActivities() {
        const ongoing = truckActivities.filter(a => a.status === 'ongoing');
        const ready = truckActivities.filter(a => a.status === 'ready');
        const completed = truckActivities.filter(a => a.status === 'completed');

        const truckHtml = `
            ${createSection('Truk Sedang Berangkat', ongoing, createTruckActivityCard)}
            ${createSection('Siap Berangkat', ready, createTruckActivityCard)}
            ${createSection('Riwayat Perjalanan Truk', completed, createTruckActivityCard)}
        `;
        container.innerHTML = truckHtml;
    }

    function renderPartnerHistory() {
        const partnerHtml = createSection('Riwayat Transaksi Mitra', partnerHistory, createPartnerHistoryCard);
        container.insertAdjacentHTML('beforeend', partnerHtml);
    }

    function createSection(title, items, cardCreator) {
        if (items.length === 0) return '';
        
        const statusClassMap = {
            'Truk Sedang Berangkat': 'status-ongoing',
            'Siap Berangkat': 'status-ready',
            'Riwayat Perjalanan Truk': 'status-completed',
            'Riwayat Transaksi Mitra': 'status-partner'
        };
        const sectionClass = statusClassMap[title] || '';

        return `
            <section>
                <h2 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">${title}</h2>
                <div class="space-y-4">
                    ${items.map(item => cardCreator(item, sectionClass)).join('')}
                </div>
            </section>
        `;
    }

    function createTruckActivityCard(item, statusClass) {
        const truck = truckData.find(t => t.id === item.truckId);
        if (!truck) return ''; // Skip if truck not found

        const statusMap = {
            ongoing: { text: 'Dalam Perjalanan', icon: 'fa-truck-fast' },
            ready: { text: 'Siap Berangkat', icon: 'fa-clock' },
            completed: { text: 'Selesai', icon: 'fa-check-circle' }
        };

        const { text, icon } = statusMap[item.status];

        return `
            <div class="activity-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm ${statusClass}">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-700 text-lg">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center mb-1">
                            <h3 class="font-bold text-gray-900 dark:text-white">${truck.name}</h3>
                            <span class="status-badge ${statusClass}">${text}</span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">${truck.driver}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">${item.route}</p>
                    </div>
                </div>
                <div class="text-right text-xs text-gray-400 dark:text-gray-500 mt-2">
                    ${formatTime(item.timestamp)}
                </div>
            </div>
        `;
    }

    function createPartnerHistoryCard(item, statusClass) {
        const partner = defaultData.find(p => p.id === item.partnerId);
        if (!partner) return ''; // Skip if partner not found

        const typeClass = partner.category === 'organik' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50' : 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/50';
        return `
            <div class="activity-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm ${statusClass}">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-700 text-lg">
                        <i class="fa-solid fa-handshake"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center mb-1">
                            <h3 class="font-bold text-gray-900 dark:text-white">${partner.name}</h3>
                            <span class="font-bold text-gray-800 dark:text-gray-200">${item.weight} kg</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-medium px-2 py-1 rounded-full ${typeClass}">${partner.category}</span>
                            <span class="text-xs text-gray-400 dark:text-gray-500">${formatTime(item.timestamp)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function formatTime(date) {
        const now = new Date();
        const diffSeconds = Math.round((now - date) / 1000);
        const diffMinutes = Math.round(diffSeconds / 60);
        const diffHours = Math.round(diffMinutes / 60);
        const diffDays = Math.round(diffHours / 24);

        if (diffSeconds < 60) return `beberapa detik yang lalu`;
        if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
        if (diffHours < 24) return `${diffHours} jam yang lalu`;
        if (diffDays <= 30) return `${diffDays} hari yang lalu`;
        
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // --- INITIAL RENDER ---
    renderPage();
});
