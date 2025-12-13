document.addEventListener('DOMContentLoaded', () => {
    // --- DATA & STATE ---
    let truckActivities = [];
    let currentView = 'truck'; // 'truck' or 'partner'
    
    const activityContainer = document.getElementById('activity-container');
    const partnerContainer = document.getElementById('partner-activity-container');
    const navTruck = document.getElementById('nav-truck');
    const navPartner = document.getElementById('nav-partner');

    // --- INITIALIZATION ---
    loadData();
    setupEventListeners();
    renderPage();

    // --- DATA HANDLING ---
    function loadData() {
        const storedActivities = JSON.parse(localStorage.getItem('truckActivities'));
        truckActivities = storedActivities ? storedActivities.map(activity => ({
            ...activity,
            timestamp: new Date(activity.timestamp)
        })) : [
            { id: 1, status: 'ongoing', truckId: 'T-01', route: 'Perumahan Griya Asri -> TPS Pusat', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
            { id: 2, status: 'ready', truckId: 'T-03', route: 'Kawasan Industri Candi -> TPS Barat', timestamp: new Date() },
            { id: 4, status: 'completed', truckId: 'T-01', route: 'Area Perkantoran -> TPS Timur', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
            { id: 5, status: 'completed', truckId: 'T-04', route: 'Cluster Melati -> TPS Utara', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
            { id: 6, status: 'completed', truckId: 'T-02', route: 'Desa Suko -> TPS Barat', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) }
        ];
    }

    function saveAndRerender() {
        const storableActivities = truckActivities.map(activity => ({
            ...activity,
            timestamp: activity.timestamp.toISOString()
        }));
        localStorage.setItem('truckActivities', JSON.stringify(storableActivities));
        renderPage();
        document.querySelectorAll('.card-menu').forEach(menu => menu.classList.add('hidden'));
    }
    
    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        navTruck.addEventListener('click', () => setView('truck'));
        navPartner.addEventListener('click', () => setView('partner'));
    }

    function setView(view) {
        currentView = view;
        updateNavStyles();
        if (view === 'truck') {
            activityContainer.classList.remove('hidden');
            partnerContainer.classList.add('hidden');
        } else {
            activityContainer.classList.add('hidden');
            partnerContainer.classList.remove('hidden');
        }
        renderPage();
    }

    function updateNavStyles() {
        if (currentView === 'truck') {
            navTruck.classList.add('bg-green-600', 'text-white', 'shadow');
            navTruck.classList.remove('text-gray-600');
            navPartner.classList.remove('bg-green-600', 'text-white', 'shadow');
            navPartner.classList.add('text-gray-600');
        } else {
            navPartner.classList.add('bg-green-600', 'text-white', 'shadow');
            navPartner.classList.remove('text-gray-600');
            navTruck.classList.remove('bg-green-600', 'text-white', 'shadow');
            navTruck.classList.add('text-gray-600');
        }
    }

    // --- MENU ACTIONS ---
    window.toggleMenu = (activityId) => {
        document.querySelectorAll('.card-menu').forEach(menu => {
            if (!menu.id.endsWith(activityId)) menu.classList.add('hidden');
        });
        const menu = document.getElementById(`menu-${activityId}`);
        if (menu) menu.classList.toggle('hidden');
    };

    window.cancelActivity = (activityId) => {
        truckActivities = truckActivities.filter(a => a.id !== activityId);
        saveAndRerender();
    };

    window.completeActivity = (activityId) => {
        const activity = truckActivities.find(a => a.id === activityId);
        if (activity) {
            activity.status = 'completed';
            activity.timestamp = new Date();
        }
        saveAndRerender();
    };

    // --- RENDER FUNCTIONS ---
    function renderPage() {
        if (currentView === 'truck') {
            renderTruckActivities();
        }
    }

    function renderTruckActivities() {
        activityContainer.innerHTML = '';
        const sortedActivities = [...truckActivities].sort((a, b) => b.timestamp - a.timestamp);

        if (sortedActivities.length === 0) {
             activityContainer.innerHTML = '<p class="text-center text-gray-500">Tidak ada aktivitas truk.</p>';
             return;
        }

        const truckHtml = `
            <div class="timeline-container">
                ${sortedActivities.map(createTruckActivityCard).join('')}
            </div>
        `;
        activityContainer.innerHTML = truckHtml;
    }

    function createTruckActivityCard(item) {
        const truck = truckData.find(t => t.id === item.truckId);
        if (!truck) return '';

        const statusMap = {
            ongoing: { text: 'Dalam Perjalanan', icon: 'fa-truck-fast', dotIcon: 'fa-solid fa-arrows-spin', statusClass: 'status-ongoing' },
            ready: { text: 'Siap Berangkat', icon: 'fa-clock', dotIcon: 'fa-solid fa-play', statusClass: 'status-ready' },
            completed: { text: 'Selesai', icon: 'fa-check-circle', dotIcon: 'fa-solid fa-check', statusClass: 'status-completed' }
        };

        const { text, icon, dotIcon, statusClass } = statusMap[item.status];
        
        const optionsMenu = item.status === 'ongoing' ? `
            <div class="relative">
                <button onclick="toggleMenu(${item.id})" class="card-menu-button p-2 rounded-full hover:bg-gray-100 focus:outline-none -mr-2">
                    <i class="fa-solid fa-ellipsis-vertical text-gray-500"></i>
                </button>
                <div id="menu-${item.id}" class="card-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-20">
                    <a href="#" onclick="event.preventDefault(); completeActivity(${item.id})" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i class="fa-solid fa-check w-4 text-center"></i>
                        <span>Selesaikan</span>
                    </a>
                    <a href="#" onclick="event.preventDefault(); cancelActivity(${item.id})" class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <i class="fa-solid fa-trash-can w-4 text-center"></i>
                        <span>Batalkan</span>
                    </a>
                </div>
            </div>
        ` : '';

        return `
            <div class="timeline-item ${statusClass}">
                <div class="timeline-dot">
                    <i class="${dotIcon}"></i>
                </div>
                <div class="timeline-content">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex-1">
                            <!-- Header -->
                            <div class="flex items-center gap-3 mb-2">
                                <i class="fa-solid ${icon} text-gray-400"></i>
                                <h3 class="font-bold text-gray-800">${truck.name} - ${truck.plate}</h3>
                            </div>
                            <!-- Details -->
                            <p class="text-sm text-gray-700 font-medium pl-7">${item.route}</p>
                            <p class="text-xs text-gray-500 mt-1 pl-7">${truck.driver}</p>
                            <!-- Footer -->
                            <div class="flex items-center justify-between mt-3 pl-7">
                                <p class="text-xs text-gray-400">${formatTime(item.timestamp)}</p>
                                <span class="text-xs font-semibold px-2 py-1 rounded-full ${statusClass}">${text}</span>
                            </div>
                        </div>
                        <div class="flex-shrink-0">
                           ${optionsMenu}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function formatTime(date) {
        if (!(date instanceof Date)) date = new Date(date);
        
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
});
