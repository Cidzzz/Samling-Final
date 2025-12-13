document.addEventListener('DOMContentLoaded', function() {
    // --- Utility Functions ---
    function timeAgo(date) {
        if (!date) return '';
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (isNaN(seconds)) return '';
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return "Baru saja";
    }

    // --- Guard Clause: Only run dashboard-specific code on the dashboard page ---
    const isDashboardPage = document.getElementById('displayProfileName');
    if (!isDashboardPage) {
        return; // Do not execute the rest of the script on non-dashboard pages
    }

    // --- Page Load Functions (for dashboard) ---
    function loadProfileData() {
        const savedDisplayName = localStorage.getItem('userDisplayName');
        const profileAvatar = document.getElementById("profileAvatar");
        const displayProfileName = document.getElementById("displayProfileName");

        if (displayProfileName) {
            displayProfileName.textContent = savedDisplayName || "Gregorius Olvans";
        }
        if (profileAvatar) {
            // Avatar logic can be added here if needed
        }
    }

    function loadDashboardStats() {
        const mitraCountElement = document.getElementById("jumlahMitraCount");
        if (mitraCountElement && typeof defaultData !== 'undefined') {
            mitraCountElement.textContent = defaultData.length;
        } else if (mitraCountElement) {
            mitraCountElement.textContent = '0';
        }
    }

    // --- Notification System (for dashboard) ---
    const NOTIFICATIONS_KEY = 'samling_notifications';
    const notificationButton = document.getElementById('notification-button');
    const notificationListContainer = document.getElementById('notification-list-container');
    const notificationDot = notificationButton ? notificationButton.querySelector('span') : null;

    function loadNotifications() {
        if (!notificationListContainer) return;

        let notifications = [];
        try {
            notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
        } catch (e) {
            console.error("Gagal memuat notifikasi:", e);
            notifications = [];
        }
        
        if (notifications.length === 0) {
            notificationListContainer.innerHTML = `
                <div class="text-center py-10 px-4">
                    <i class="fa-solid fa-check-circle text-3xl text-gray-300"></i>
                    <p class="text-sm text-gray-500 mt-2">Tidak ada notifikasi baru.</p>
                </div>`;
            if (notificationDot) notificationDot.classList.add('hidden');
        } else {
            notificationListContainer.innerHTML = notifications.map(notif => `
                <a href="#" class="flex items-start px-4 py-3 hover:bg-gray-50">
                    <div class="flex-shrink-0"><i class="${notif.icon || 'fa-solid fa-bell'} ${notif.iconColor || 'text-gray-500'} w-6 text-center"></i></div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-800">${notif.title || 'Notifikasi'}</p>
                        <p class="text-xs text-gray-500">${notif.message || ''}</p>
                        <p class="text-xs text-gray-400 mt-1">${timeAgo(notif.time)}</p>
                    </div>
                </a>`).join('');
            
            const hasUnread = notifications.some(n => !n.read);
            if (notificationDot) {
                notificationDot.classList.toggle('hidden', !hasUnread);
            }
        }
    }

    // Setup listeners only if the button exists
    if (notificationButton) {
        // Add a listener for marking notifications as read.
        // The popup toggle is now handled by Flowbite's data-dropdown-toggle attribute.
        notificationButton.addEventListener('click', () => {
            // Use a small timeout to ensure this runs after Flowbite's logic
            setTimeout(() => {
                let notifications = [];
                try {
                    notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
                } catch(e) {
                    notifications = [];
                }
                
                // If there are any unread notifications, update them
                if (notifications.some(n => !n.read)) {
                    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
                    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
                    // Hide the dot visually
                    if (notificationDot) notificationDot.classList.add('hidden');
                }
            }, 100);
        });
    }

    // --- Initial Execution ---
    loadProfileData();
    loadDashboardStats();
    loadNotifications();
});
