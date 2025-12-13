// State to hold the current active time period and filtered data
let activePeriod = '3days';
let lastFilteredTransactions = [];

document.addEventListener('DOMContentLoaded', () => {
    // Load transactions on initial page load
    applyFilters(); 
});

function applyFilters(period = null) {
    // If a new period is passed (from button click), update the active period
    if (period) {
        activePeriod = period;
    }

    // Get filter values from the DOM
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const minKg = parseFloat(document.getElementById('minKg').value) || 0;
    const maxKg = parseFloat(document.getElementById('maxKg').value) || Infinity;

    // 1. Filter by Date Period
    const now = new Date();
    let startDate;
    if (activePeriod === 'all') {
        startDate = new Date(0); // The beginning of time
    } else {
        const tempDate = new Date();
        if (activePeriod === '3days') tempDate.setDate(tempDate.getDate() - 3);
        else if (activePeriod === 'week') tempDate.setDate(tempDate.getDate() - 7);
        else if (activePeriod === 'month') tempDate.setMonth(tempDate.getMonth() - 1);
        startDate = tempDate;
    }
    
    let filteredTransactions = allTransactions.filter(t => t.tanggal >= startDate);

    // 2. Filter by Search, Category, and Weight
    filteredTransactions = filteredTransactions.map(trx => {
        // Filter the 'sampah' items within each transaction
        const matchingSampah = trx.sampah.filter(item => {
            const matchesSearch = item.tipe.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || item.kategori === category;
            const matchesWeight = item.berat >= minKg && item.berat <= maxKg;
            return matchesSearch && matchesCategory && matchesWeight;
        });

        // If there are matching 'sampah' items, return a new transaction object with only those items
        if (matchingSampah.length > 0) {
            return { ...trx, sampah: matchingSampah };
        }
        return null;
    }).filter(Boolean); // Remove nulls (transactions with no matching sampah)

    lastFilteredTransactions = filteredTransactions; // Store for export
    renderTransactions(filteredTransactions);
    updateActiveButton();
}

function renderTransactions(transactions) {
    const container = document.getElementById('transactionsContainer');
    container.innerHTML = ''; // Clear previous content

    if (transactions.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-500 py-10">
            <i class="fa-solid fa-folder-open text-4xl mb-4"></i>
            <p>Tidak ada riwayat transaksi yang sesuai dengan filter.</p>
        </div>`;
        return;
    }

    transactions.forEach(trx => {
        const card = document.createElement('div');
        card.className = 'transaction-card';

        const totalBerat = trx.sampah.reduce((sum, item) => sum + item.berat, 0);

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-lg text-gray-900">${trx.nama}</h3>
                    <p class="text-xs text-gray-400">${trx.tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-green-600">${totalBerat.toFixed(1)} kg</p>
                    <p class="text-xs text-gray-400">Total Berat</p>
                </div>
            </div>
            <div class="mt-4 border-t border-gray-100 pt-4">
                <p class="text-xs font-bold text-gray-500 uppercase mb-2">Rincian Sampah (Sesuai Filter):</p>
                <ul class="space-y-2">
                    ${trx.sampah.map(item => `
                        <li class="flex justify-between items-center text-sm">
                            <span class="text-gray-700">${item.tipe} <span class="text-xs px-2 py-0.5 rounded ${item.kategori === 'organik' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">${item.kategori}</span></span>
                            <span class="font-medium text-gray-800">${item.berat} kg</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateActiveButton() {
    const periods = ['3days', 'week', 'month', 'all'];
    periods.forEach(period => {
        const button = document.getElementById(`filter-${period}`);
        if (button) {
            if (period === activePeriod) {
                button.classList.add('bg-green-600', 'text-white', 'shadow-sm');
                button.classList.remove('text-gray-400', 'hover:text-gray-900');
            } else {
                button.classList.remove('bg-green-600', 'text-white', 'shadow-sm');
                button.classList.add('text-gray-400', 'hover:text-gray-900');
            }
        }
    });
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('minKg').value = '';
    document.getElementById('maxKg').value = '';
    applyFilters('3days'); // Reset to default view
}

function exportHistoryToCSV() {
    if (lastFilteredTransactions.length === 0) {
        alert("Tidak ada data untuk diexport. Ubah filter Anda dan coba lagi.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    // Header
    csvContent += "Nama Mitra,Tanggal,Tipe Sampah,Kategori,Berat (kg)\r\n";

    // Rows
    lastFilteredTransactions.forEach(trx => {
        const date = trx.tanggal.toLocaleDateString('id-ID');
        trx.sampah.forEach(item => {
            const row = [
                `"${trx.nama}"`, 
                date,
                `"${item.tipe}"`, 
                item.kategori,
                item.berat
            ].join(",");
            csvContent += row + "\r\n";
        });
    });

    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "riwayat_transaksi_mitra.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
