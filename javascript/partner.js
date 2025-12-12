
        // --- 2. VARIABLES ---
        let appData = [];
        const storageKey = 'samling_pro_sidoarjo_v1';
        let currentState = { category: 'organik', search: '', sort: 'newest', selectedId: null };
        let chartInstance = null;
        let mapInstance = null;
        let markerInstance = null;

        // --- 3. INIT & HELPER ---
        function init() {
            if (localStorage.getItem(storageKey)) appData = JSON.parse(localStorage.getItem(storageKey));
            else { appData = defaultData; saveData(); }
            renderApp();
        }
        function saveData() { localStorage.setItem(storageKey, JSON.stringify(appData)); }
        function getCapacityValue(s) { const m = s.match(/\d+/g); return m ? (m.length > 1 ? (parseInt(m[0])+parseInt(m[1]))/2 : parseInt(m[0])) : 0; }

        // --- 4. TOAST NOTIFICATION ---
        function showToast(msg, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type === 'error' ? 'error' : ''}`;
            toast.innerHTML = `
                <i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation text-red-500' : 'fa-circle-check text-green-500'}"></i>
                <span>${msg}</span>
            `;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // --- 5. NEW FEATURE: EXPORT TO CSV ---
        function exportToCSV() {
            // 1. Header CSV
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "ID,Nama Mitra,Kategori,Deskripsi,Kebutuhan,Jarak(km),No.HP,Verified\n";

            // 2. Isi Data
            appData.forEach(row => {
                const cleanName = row.name.replace(/,/g, " "); // Hindari koma merusak CSV
                const cleanDesc = row.desc.replace(/,/g, " ");
                const verified = row.verified ? "Yes" : "No";
                const phone = row.phone ? `'${row.phone}` : "-"; // Tambah kutip biar jadi string di excel
                
                let rowString = `${row.id},${cleanName},${row.category},${cleanDesc},${row.req},${row.distance},${phone},${verified}`;
                csvContent += rowString + "\n";
            });

            // 3. Trigger Download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "data_mitra_samling.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast("Data berhasil diunduh!", "success");
        }

        // --- 6. CORE RENDER ---
        function renderApp() {
            const container = document.getElementById('partnersContainer');
            container.innerHTML = '';

            let filtered = appData.filter(p => 
                p.category === currentState.category && 
                p.name.toLowerCase().includes(currentState.search.toLowerCase())
            );

            if (currentState.sort === 'nearest') filtered.sort((a, b) => a.distance - b.distance);
            else if (currentState.sort === 'capacity') filtered.sort((a, b) => getCapacityValue(b.req) - getCapacityValue(a.req));
            else filtered.sort((a, b) => b.id - a.id);

            // Summary
            document.getElementById('resultCount').textContent = `${filtered.length} Mitra`;
            document.getElementById('summaryCount').textContent = filtered.length;
            const catEl = document.getElementById('summaryCategory');
            catEl.textContent = currentState.category;
            catEl.className = currentState.category === 'organik' ? 'text-sm font-bold text-green-400 uppercase' : 'text-sm font-bold text-cyan-400 uppercase';
            
            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="bg-white rounded-xl p-8 text-center border border-dashed border-gray-100">
                        <i class="fa-solid fa-magnifying-glass text-4xl text-gray-600 mb-3"></i>
                        <p class="text-gray-400">Tidak ada mitra ditemukan.</p>
                        <button onclick="resetFilter()" class="text-green-500 text-sm font-semibold mt-2 hover:underline">Reset Filter</button>
                    </div>`;
            } else {
                filtered.forEach(p => {
                    const isOrg = p.category === 'organik';
                    const themeColor = isOrg ? 'text-green-500 bg-green-500/10' : 'text-cyan-500 bg-cyan-500/10';
                    const borderColor = isOrg ? 'border-l-green-500' : 'border-l-cyan-500';
                    const verifiedHtml = p.verified ? `<span class="verified-badge"><i class="fa-solid fa-check"></i></span>` : '';

                    const html = `
                    <div onclick="openDetail(${p.id})" class="partner-card bg-white rounded-xl p-4 shadow-sm border-l-4 ${borderColor} cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group relative overflow-hidden">
                        <div class="flex items-start gap-4 relative z-10">
                            <div class="w-12 h-12 rounded-xl ${themeColor} flex items-center justify-center text-2xl shrink-0"><i class="fa-solid ${p.icon}"></i></div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-gray-900 text-lg truncate flex items-center">${p.name} ${verifiedHtml}</h4>
                                <p class="text-gray-500 text-xs line-clamp-1 mb-2">${p.desc}</p>
                                <div class="flex items-center gap-3 text-xs font-medium text-gray-600">
                                    <span class="bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><i class="fa-solid fa-weight-hanging text-gray-400"></i> ${p.req}</span>
                                    <span class="flex items-center gap-1"><i class="fa-solid fa-location-dot text-gray-400"></i> ${p.distance} km</span>
                                </div>
                            </div>
                            <div class="text-gray-300 group-hover:text-green-600 transition self-center"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>
                        <button onclick="openMap(event, ${p.id})" class="absolute bottom-0 right-0 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 px-3 py-1 rounded-tl-xl text-xs font-bold transition z-20">
                            <i class="fa-solid fa-map-location-dot"></i> PETA
                        </button>
                    </div>`;
                    container.insertAdjacentHTML('beforeend', html);
                });
            }
            renderChart(filtered);
        }

        function renderChart(data) {
            const ctx = document.getElementById('partnersChart').getContext('2d');
            const labels = data.map(d => d.name.substring(0, 15) + '...');
            const values = data.map(d => getCapacityValue(d.req));
            const colors = data.map((d, i) => {
                const h = d.category === 'organik' ? 142 : 190;
                const l = 45 + (i * 8) % 30;
                return `hsl(${h}, 70%, ${l}%)`;
            });

            if (chartInstance) chartInstance.destroy();
            chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 1, borderColor: '#ffffff' }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '75%' }
            });
        }

        // --- 7. INTERACTION ---
        function switchTab(cat) {
            currentState.category = cat;
            document.getElementById('tabOrganik').className = cat === 'organik' ? "px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white shadow-lg transition" : "px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition";
            document.getElementById('tabNonOrganik').className = cat === 'non-organik' ? "px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white shadow-lg transition" : "px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition";
            renderApp();
        }
        function handleSearch() { currentState.search = document.getElementById('searchInput').value; renderApp(); }
        function handleSort() { currentState.sort = document.getElementById('sortSelect').value; renderApp(); }
        function resetFilter() { document.getElementById('searchInput').value = ''; currentState.search = ''; renderApp(); }
        function openMap(e, id) { e.stopPropagation(); openDetail(id); }

        // --- 8. DETAIL & MAP ---
        function openDetail(id) {
            const p = appData.find(x => x.id === id);
            if (!p) return;
            currentState.selectedId = id;

            document.getElementById('detailName').textContent = p.name;
            document.getElementById('detailDesc').textContent = p.desc;
            document.getElementById('detailDist').textContent = p.distance + ' km';
            document.getElementById('detailReq').textContent = p.req;
            const catLabel = document.getElementById('detailCategory');
            catLabel.textContent = p.category;
            catLabel.className = `px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-1 inline-block ${p.category === 'organik' ? 'bg-green-100 text-green-700' : 'bg-cyan-100 text-cyan-700'}`;
            const verEl = document.getElementById('detailVerified');
            if(p.verified) verEl.classList.remove('hidden'); else verEl.classList.add('hidden');

            document.getElementById('btnDeleteAction').onclick = () => performDelete(id);
            document.getElementById('btnEditAction').onclick = () => openEditMode(id);

            toggleDetail(true);

            setTimeout(() => {
                const targetLat = p.lat || -7.4478;
                const targetLng = p.lng || 112.7183;

                if (!mapInstance) {
                    mapInstance = L.map('mapContainer').setView([targetLat, targetLng], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(mapInstance);
                } else {
                    mapInstance.invalidateSize();
                    mapInstance.setView([targetLat, targetLng], 13);
                }

                if (markerInstance) mapInstance.removeLayer(markerInstance);
                markerInstance = L.marker([targetLat, targetLng]).addTo(mapInstance)
                    .bindPopup(`<b>${p.name}</b><br>${p.distance} km`).openPopup();
            }, 300);
        }

        function toggleDetail(show) {
            const el = document.getElementById('modalDetail');
            if (show) el.classList.remove('hidden'); else el.classList.add('hidden');
        }

        function performDelete(id) {
            if(confirm('Hapus mitra ini?')) {
                appData = appData.filter(x => x.id !== id);
                saveData();
                toggleDetail(false);
                renderApp();
                showToast('Mitra berhasil dihapus', 'success');
            }
        }

        function handleCall() {
            const p = appData.find(x => x.id === currentState.selectedId);
            if (!p || !p.phone) return showToast("Nomor telepon tidak tersedia", "error");
            let num = p.phone.toString().replace(/^0/, '');
            if(!num.startsWith('62')) num = '62' + num;
            window.open(`https://wa.me/${num}?text=Halo ${p.name}, saya ingin kerjasama.`, '_blank');
        }

        // --- 9. FORM ACTIONS ---
        function toggleModal(show) {
            const modal = document.getElementById('modalAdd');
            if (show) {
                document.getElementById('formAddPartner').reset();
                currentState.selectedId = null; 
                document.querySelector('#modalAdd h3').textContent = "Tambah Mitra Baru";
                modal.classList.remove('hidden');
            } else {
                modal.classList.add('hidden');
            }
        }

        function openEditMode(id) {
            const p = appData.find(x => x.id === id);
            if (!p) return;
            toggleDetail(false);
            toggleModal(true);
            currentState.selectedId = id;

            document.querySelector('#modalAdd h3').textContent = "Edit Mitra";
            document.getElementById('inputName').value = p.name;
            document.getElementById('inputDesc').value = p.desc;
            document.getElementById('inputCategory').value = p.category;
            document.getElementById('inputDist').value = p.distance;
            document.getElementById('inputReq').value = p.req;
            let ph = p.phone ? p.phone.toString() : "";
            if(ph.startsWith('62')) ph = ph.substring(2); if(ph.startsWith('0')) ph = ph.substring(1);
            document.getElementById('inputPhone').value = ph;
            document.getElementById('inputVerified').checked = !!p.verified;
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('inputName').value;
            const desc = document.getElementById('inputDesc').value;
            const cat = document.getElementById('inputCategory').value;
            const dist = parseFloat(document.getElementById('inputDist').value);
            const req = document.getElementById('inputReq').value;
            const phoneRaw = document.getElementById('inputPhone').value;
            const isVerified = document.getElementById('inputVerified').checked;
            const phone = '62' + phoneRaw;
            const icon = cat === 'organik' ? 'fa-leaf' : 'fa-industry';
            
            // Sidoarjo LatLong
            const lat = -7.4478 + (Math.random() * 0.1 - 0.05);
            const lng = 112.7183 + (Math.random() * 0.1 - 0.05);

            if (currentState.selectedId) {
                const idx = appData.findIndex(x => x.id === currentState.selectedId);
                if (idx !== -1) {
                    const oldLat = appData[idx].lat || lat;
                    const oldLng = appData[idx].lng || lng;
                    appData[idx] = { ...appData[idx], name, desc, category: cat, distance: dist, req, phone, icon, verified: isVerified, lat: oldLat, lng: oldLng };
                    showToast('Data mitra berhasil diperbarui');
                }
            } else {
                appData.push({ id: Date.now(), name, desc, category: cat, distance: dist, req, phone, icon, verified: isVerified, lat, lng });
                showToast('Mitra baru berhasil ditambahkan');
            }

            saveData();
            toggleModal(false);
            if (cat !== currentState.category) switchTab(cat); else renderApp();
        }

        init();