document.addEventListener('DOMContentLoaded', () => {
    const navTruck = document.getElementById('nav-truck');
    const navPartner = document.getElementById('nav-partner');
    const activityContainer = document.getElementById('activity-container');
    const partnerActivityContainer = document.getElementById('partner-activity-container');
    const mitraRequestsContainer = document.getElementById('mitra-requests');
    const mitraHistoryContainer = document.getElementById('mitra-history');

    const partners = window.partners;
    const wasteTypes = ['organik', 'non-organik', 'organik dan non-organik'];

    // Function to toggle between truck and partner views
    const showTruckView = () => {
        activityContainer.classList.remove('hidden');
        partnerActivityContainer.classList.add('hidden');
        navTruck.classList.add('bg-green-600', 'text-white', 'shadow');
        navTruck.classList.remove('text-gray-600');
        navPartner.classList.remove('bg-green-600', 'text-white', 'shadow');
        navPartner.classList.add('text-gray-600');
    };

    const showPartnerView = () => {
        activityContainer.classList.add('hidden');
        partnerActivityContainer.classList.remove('hidden');
        navPartner.classList.add('bg-green-600', 'text-white', 'shadow');
        navPartner.classList.remove('text-gray-600');
        navTruck.classList.remove('bg-green-600', 'text-white', 'shadow');
        navTruck.classList.add('text-gray-600');
    };

    navTruck.addEventListener('click', showTruckView);
    navPartner.addEventListener('click', showPartnerView);

    // Function to generate a random partner request
    const generateRandomRequest = () => {
        if (partners.length === 0) return;

        const randomPartner = partners[Math.floor(Math.random() * partners.length)];
        const randomKg = Math.floor(Math.random() * 100) + 1;
        const randomWasteType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + Math.floor(Math.random() * 5) + 1);

        const requestId = `req-${Date.now()}`;

        const requestElement = document.createElement('div');
        requestElement.classList.add('mitra-card');
        requestElement.id = requestId;
        requestElement.innerHTML = `
            <div class="mitra-info">
                <span class="font-bold">${randomPartner.name}</span>
                <span>Butuh ${randomWasteType} ${randomKg} kg - Tenggat: ${deadline.toLocaleTimeString()}</span>
            </div>
            <div class="mitra-actions">
                <button class="text-gray-500 hover:text-gray-700" onclick="toggleDropdown('${requestId}')">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div id="dropdown-${requestId}" class="dropdown-menu hidden">
                    <button onclick="completeRequest('${requestId}', '${randomPartner.name}', '${randomKg}', '${randomWasteType}', '${deadline.toLocaleTimeString()}')">Selesaikan</button>
                    <button onclick="cancelRequest('${requestId}')">Batalkan</button>
                </div>
            </div>
        `;

        mitraRequestsContainer.appendChild(requestElement);
    };

    // Generate a new request every 2 minutes (120000 ms)
    setInterval(generateRandomRequest, 120000);

    // Initial request generation for demonstration
    generateRandomRequest();
});

function toggleDropdown(requestId) {
    const dropdown = document.getElementById(`dropdown-${requestId}`);
    dropdown.classList.toggle('hidden');
}

function completeRequest(requestId, name, kg, wasteType, time) {
    const requestElement = document.getElementById(requestId);
    requestElement.remove();

    const historyElement = document.createElement('div');
    historyElement.classList.add('mitra-card');
    historyElement.innerHTML = `
        <div class="mitra-info">
            <span class="font-bold">${name}</span>
            <span>${kg} kg ${wasteType} - Selesai pada: ${new Date().toLocaleTimeString()}</span>
        </div>
    `;

    document.getElementById('mitra-history').appendChild(historyElement);
}

function cancelRequest(requestId) {
    const requestElement = document.getElementById(requestId);
    requestElement.remove();
}
