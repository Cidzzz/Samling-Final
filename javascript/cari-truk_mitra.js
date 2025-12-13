// Gemini-generated file. A modified version of partner.js for cari-truk.html
// File: javascript/cari-truk_mitra.js

// --- VARIABLES ---
let mitra_appData = [];
const mitra_storageKey = 'samling_pro_sidoarjo_v1';
let mitra_currentState = { category: 'organik', search: '', sort: 'newest', selectedId: null };
let mitra_chartInstance = null;
let mitra_mapInstance = null;
let mitra_markerInstance = null;

// --- INIT & HELPER ---
function initMitraStep() {
    // Check if data is already loaded
    if (mitra_appData.length === 0) {
        if (localStorage.getItem(mitra_storageKey)) {
            mitra_appData = JSON.parse(localStorage.getItem(mitra_storageKey));
        } else {
            // Assuming defaultData is loaded from partner_data.js
            mitra_appData = defaultData; 
            localStorage.setItem(mitra_storageKey, JSON.stringify(mitra_appData));
        }
    }
    
    // Setup event listeners for controls
    document.getElementById('mitra-tab-organik').addEventListener('click', () => mitra_switchTab('organik'));
    document.getElementById('mitra-tab-non-organik').addEventListener('click', () => mitra_switchTab('non-organik'));
    document.getElementById('mitra-search').addEventListener('keyup', mitra_handleSearch);
    document.getElementById('mitra-sort-select').addEventListener('change', mitra_handleSort);

    // Initial render
    mitra_switchTab(mitra_currentState.category); // To set the active tab style
    mitra_renderApp();
}

function mitra_getCapacityValue(s) {
    const m = s.match(/\d+/g);
    return m ? (m.length > 1 ? (parseInt(m[0]) + parseInt(m[1])) / 2 : parseInt(m[0])) : 0;
}

// --- CORE RENDER ---
function mitra_renderApp() {
    const container = document.getElementById('mitra-list');
    if (!container) return; // Exit if the container is not on the page
    container.innerHTML = '';

    let filtered = mitra_appData.filter(p =>
        p.category === mitra_currentState.category &&
        p.name.toLowerCase().includes(mitra_currentState.search.toLowerCase())
    );

    if (mitra_currentState.sort === 'nearest') filtered.sort((a, b) => a.distance - b.distance);
    else if (mitra_currentState.sort === 'capacity') filtered.sort((a, b) => mitra_getCapacityValue(b.req) - mitra_getCapacityValue(a.req));
    else filtered.sort((a, b) => b.id - a.id);

    // Summary
    document.getElementById('mitra-result-count').textContent = `${filtered.length} Mitra`;
    document.getElementById('mitra-summary-count').textContent = filtered.length;
    const catEl = document.getElementById('mitra-summary-category');
    catEl.textContent = mitra_currentState.category;
    catEl.className = `text-sm font-bold uppercase ${mitra_currentState.category === 'organik' ? 'text-green-500' : 'text-cyan-500'}`;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-xl p-8 text-center border border-dashed border-gray-100 col-span-2">
                <i class="fas fa-search text-4xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">Tidak ada mitra ditemukan untuk kriteria ini.</p>
            </div>`;
    } else {
        filtered.forEach(p => {
            const isOrg = p.category === 'organik';
            const themeColor = isOrg ? 'text-green-500 bg-green-50/80' : 'text-cyan-500 bg-cyan-50/80';
            const borderColor = isOrg ? 'border-l-green-500' : 'border-l-cyan-500';
            const verifiedHtml = p.verified ? `<span class="verified-badge"><i class="fa-solid fa-check"></i></span>` : '';

            const html = `
            <div onclick="mitra_openDetail(${p.id})" class="partner-card bg-white rounded-xl p-4 shadow-sm border-l-4 ${borderColor} cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1 group">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-lg ${themeColor} flex items-center justify-center text-2xl shrink-0"><i class="fa-solid ${p.icon}"></i></div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-gray-800 text-md truncate flex items-center">${p.name} ${verifiedHtml}</h4>
                        <p class="text-gray-500 text-xs line-clamp-1 mb-2">${p.desc}</p>
                        <div class="flex items-center gap-3 text-xs font-medium text-gray-600">
                            <span class="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1.5"><i class="fa-solid fa-weight-hanging text-gray-400"></i> ${p.req}</span>
                            <span class="flex items-center gap-1.5"><i class="fa-solid fa-location-dot text-gray-400"></i> ${p.distance} km</span>
                        </div>
                    </div>
                    <div class="text-gray-300 group-hover:text-green-600 transition self-center"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </div>`;
            container.insertAdjacentHTML('beforeend', html);
        });
    }
    // mitra_renderChart(filtered); // The chart canvas is not in the base HTML yet.
}

/*
function mitra_renderChart(data) {
    const canvas = document.getElementById('mitraChart');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const labels = data.map(d => d.name.substring(0, 15) + '...');
    const values = data.map(d => mitra_getCapacityValue(d.req));
    const colors = data.map((d, i) => {
        const h = d.category === 'organik' ? 142 : 190;
        const l = 45 + (i * 8) % 30;
        return `hsl(${h}, 70%, ${l}%)`;
    });

    if (mitra_chartInstance) mitra_chartInstance.destroy();
    mitra_chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 1, borderColor: '#ffffff' }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '75%' }
    });
}
*/

// --- INTERACTION ---
function mitra_switchTab(cat) {
    mitra_currentState.category = cat;
    const tabOrganik = document.getElementById('mitra-tab-organik');
    const tabNonOrganik = document.getElementById('mitra-tab-non-organik');
    
    if (cat === 'organik') {
        tabOrganik.classList.add('bg-green-600', 'text-white', 'shadow-sm');
        tabOrganik.classList.remove('text-gray-400', 'hover:text-gray-900');
        tabNonOrganik.classList.remove('bg-green-600', 'text-white', 'shadow-sm');
        tabNonOrganik.classList.add('text-gray-400', 'hover:text-gray-900');
    } else {
        tabNonOrganik.classList.add('bg-green-600', 'text-white', 'shadow-sm');
        tabNonOrganik.classList.remove('text-gray-400', 'hover:text-gray-900');
        tabOrganik.classList.remove('bg-green-600', 'text-white', 'shadow-sm');
        tabOrganik.classList.add('text-gray-400', 'hover:text-gray-900');
    }
    mitra_renderApp();
}

function mitra_handleSearch() {
    mitra_currentState.search = document.getElementById('mitra-search').value;
    mitra_renderApp();
}

function mitra_handleSort() {
    mitra_currentState.sort = document.getElementById('mitra-sort-select').value;
    mitra_renderApp();
}

// --- DETAIL & SELECTION ---
function mitra_openDetail(id) {
    const partner = mitra_appData.find(x => x.id === id);
    if (!partner) return;
    
    // Call the selection function from cari-truk.js, passing the whole object
    if (typeof selectMitra === 'function') {
        selectMitra(partner);
    } else {
        console.error('selectMitra function is not defined in the global scope.');
    }
}
