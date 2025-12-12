document.addEventListener('DOMContentLoaded', function() {
    // --- Load Profile Data ---
    function loadProfileData() {
        const savedDisplayName = localStorage.getItem('userDisplayName');
        const savedAvatar = localStorage.getItem('userAvatarUrl');

        const profileAvatar = document.getElementById("profileAvatar");
        const displayProfileName = document.getElementById("displayProfileName");

        if (displayProfileName) {
            if (savedDisplayName) {
                displayProfileName.textContent = savedDisplayName;
            } else {
                displayProfileName.textContent = "Gregorius Olvans";
            }
        }

        if (profileAvatar) {
            if (savedAvatar) {
                profileAvatar.src = savedAvatar;
            } else {
                profileAvatar.src = "https://api.dicebear.com/9.x/avataaars/svg?seed=Greg";
            }
        }
    }
    loadProfileData();

    // --- Load Dashboard Stats ---
    function loadDashboardStats() {
        const mitraCountElement = document.getElementById("jumlahMitraCount");

        // Pastikan elemen ada dan data dari partner_data.js sudah termuat
        if (mitraCountElement && typeof defaultData !== 'undefined') {
            mitraCountElement.textContent = defaultData.length;
        } else if (mitraCountElement) {
            // Jika data tidak ditemukan, tampilkan pesan error atau 0
            mitraCountElement.textContent = '0';
        }
    }
    loadDashboardStats(); // Panggil fungsi untuk mengisi data statistik
});