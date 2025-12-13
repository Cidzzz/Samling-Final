document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('truck-list-container');

    function renderTrucks() {
        if (!truckData || truckData.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 col-span-full">Tidak ada data truk.</p>';
            return;
        }

        container.innerHTML = truckData.map(truck => createTruckCard(truck)).join('');
        
        // Add event listeners for the request buttons
        document.querySelectorAll('.request-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (button.hasAttribute('disabled')) return;

                // 1. Disable button
                button.setAttribute('disabled', true);

                // 2. Show loading state
                const btnContent = button.querySelector('.btn-content');
                if (btnContent) {
                    btnContent.innerHTML = `
                        <i class="fas fa-spinner fa-spin"></i>
                        <p class="font-medium">Mengirim Permintaan...</p>
                    `;
                }

                // 3. Simulate network delay
                setTimeout(() => {
                    // 4. Show success state
                    button.classList.remove('bg-green-100', 'hover:bg-green-600', 'dark:bg-green-900/50', 'dark:hover:bg-green-600', 'text-black');
                    button.classList.add('bg-green-500', 'dark:bg-green-600', 'text-white', 'cursor-not-allowed');
                    
                    if (btnContent) {
                        // Remove hover effect classes from the parent group
                        button.classList.remove('group');
                        
                        btnContent.innerHTML = `
                            <i class="fas fa-check-circle"></i>
                            <p class="font-medium">Permintaan telah dikirim</p>
                        `;
                    }
                }, 1500);
            });
        });
    }

    function createTruckCard(truck) {
        const isAvailable = truck.status === 'available';

        const statusText = {
            available: 'Tersedia',
            on_duty: 'Dalam Perjalanan',
            maintenance: 'Perawatan'
        };

        return `
            <section class="daftar-truk bg-white dark:bg-slate-800 flex flex-col justify-center items-start gap-8 w-[94%] mx-auto p-8 rounded-xl border border-gray-200 dark:border-slate-700">
                <main class="title-box flex flex-col gap-2">
                    <h2 class="text-lg text-black dark:text-white font-semibold">${truck.name}</h2>
                    <p class="text-gray-400 dark:text-gray-500">${truck.license_plate}</p>
                </main>
                <main class="flex flex-col w-full gap-8">
                    <main class="pengemudi flex flex-col gap-2 justify-center items-start border border-solid border-gray-200 dark:border-slate-600 p-4 w-full rounded-lg">
                        <main class="flex flex-row justify-center items-center gap-4">
                            <main class="icon-pengemudi block bg-green-50 dark:bg-green-900/20 text-gray-800 dark:text-gray-200 border border-green-300 dark:border-green-800 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                                        <circle cx="24" cy="12" r="8" />
                                        <path d="M42 44c0-9.941-8.059-18-18-18S6 34.059 6 44" />
                                    </g>
                                </svg>
                            </main>
                            <main class="flex flex-col">
                                <p class="text-gray-400 dark:text-gray-500 text-sm">Pengemudi</p>
                                <h1 class="text-lg font-semibold">${truck.driver}</h1>
                            </main>
                        </main>
                    </main>
                    <main class="flex flex-row justify-between items-center gap-8">
                        <main class="jarak flex flex-col gap-2 justify-center items-start border border-solid border-gray-200 dark:border-slate-600 p-4 w-1/2 rounded-lg">
                            <main class="flex flex-row justify-center items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 8h-2V6h2v2Zm-4 0h-2V6h2v2Zm-4 0H9V6h2v2Zm10-6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 16H5V4h14v14Z"/></svg>
                                <main class="flex flex-col">
                                    <p class="text-gray-400 dark:text-gray-500 text-sm">Kapasitas</p>
                                    <h1 class="text-lg font-semibold">${truck.capacity} kg</h1>
                                </main>
                            </main>
                        </main>
                        <main class="estimasi flex flex-col gap-2 justify-center items-start border border-solid border-gray-200 dark:border-slate-600 p-4 w-1/2 rounded-lg">
                            <main class="flex flex-row justify-center items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v-2h-2z"/></svg>
                                <main class="flex flex-col">
                                    <p class="text-gray-400 dark:text-gray-500 text-sm">Status</p>
                                    <h1 class="text-lg font-semibold">${statusText[truck.status] || 'N/A'}</h1>
                                </main>
                            </main>
                        </main>
                    </main>
                    
                    <button 
                        data-truck-id="${truck.id}"
                        class="request-btn truk-terdekat btn-transition active:scale-95 flex flex-row justify-between items-center w-full p-4 mx-auto rounded-xl group
                        ${isAvailable 
                            ? 'bg-green-100 hover:bg-green-600 text-black hover:text-white dark:bg-green-900/50 dark:hover:bg-green-600 dark:text-white' 
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}"
                        ${!isAvailable ? 'disabled' : ''}>
                        <main class="btn-content flex flex-row justify-center items-center gap-4 w-full">
                            <svg class="rotate-[140deg] group-hover:stroke-white transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-width="1.5" d="m19.503 20.835l-16.51-7.363c-1.324-.59-1.324-2.354 0-2.944l16.51-7.363c1.495-.667 3.047.814 2.306 2.202l-3.152 5.904c-.245.459-.245 1 0 1.458l3.152 5.904c.74 1.388-.81 2.87-2.306 2.202Z" />
                            </svg>
                            <p class="font-medium">${isAvailable ? 'Panggil Truk Angkut Sampah' : statusText[truck.status]}</p>
                        </main>
                    </button>
                </main>
            </section>
        `;
    }

    renderTrucks();
});

