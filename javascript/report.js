document.addEventListener('DOMContentLoaded', () => {
    const laporButton = document.getElementById('laporButton');
    const toastPopup = document.getElementById('notificationPopup');
    const NOTIFICATIONS_KEY = 'samling_notifications';
    const LAST_REPORT_KEY = 'lastReportTimestamp';
    const COOLDOWN_MINUTES = 2;
    const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

    if (!laporButton) {
        return;
    }

    let countdownInterval = null; // Untuk menyimpan referensi ke interval

    // --- Helper Functions ---
    const showToast = () => {
        if (toastPopup) {
            toastPopup.classList.remove('hidden', 'toast-hide');
            toastPopup.classList.add('toast-show');
            const closeButton = toastPopup.querySelector('button');
            if (closeButton) {
                closeButton.removeEventListener('click', hideToast);
                closeButton.addEventListener('click', hideToast);
            }
            setTimeout(hideToast, 5000);
        }
    };

    const hideToast = () => {
        if (toastPopup) {
            toastPopup.classList.remove('toast-show');
            toastPopup.classList.add('toast-hide');
            setTimeout(() => toastPopup.classList.add('hidden'), 500);
        }
    };

    const enableButton = () => {
        laporButton.disabled = false;
        const span = laporButton.querySelector('span');
        if (span) span.textContent = 'Lapor Angkut Sampah';
        laporButton.classList.remove('bg-gray-400', 'cursor-not-allowed', 'opacity-70');
        laporButton.classList.add('bg-brand', 'hover:bg-brand-strong', 'hover:-translate-y-1');
    };

    const startCooldown = (endTime) => {
        laporButton.disabled = true;
        laporButton.classList.add('bg-gray-400', 'cursor-not-allowed', 'opacity-70');
        laporButton.classList.remove('bg-brand', 'hover:bg-brand-strong', 'hover:-translate-y-1');
        const span = laporButton.querySelector('span');

        // Hentikan interval sebelumnya jika ada
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                enableButton();
                return;
            }

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            if(span) {
                span.textContent = `Tunggu ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    };

    // --- Main Logic ---

    // 1. Cek status cooldown saat halaman dimuat
    const lastReportTime = parseInt(localStorage.getItem(LAST_REPORT_KEY) || '0');
    const now = new Date().getTime();
    const timeSinceLastReport = now - lastReportTime;

    if (timeSinceLastReport < COOLDOWN_MS) {
        // Jika masih dalam masa cooldown, mulai countdown
        const cooldownEndTime = lastReportTime + COOLDOWN_MS;
        startCooldown(cooldownEndTime);
    } else {
        // Jika sudah selesai, pastikan tombol aktif
        enableButton();
    }

    // 2. Tambahkan event listener ke tombol lapor
    laporButton.addEventListener('click', () => {
        const reportTime = new Date();
        const cooldownEndTime = reportTime.getTime() + COOLDOWN_MS;

        // Simpan waktu laporan baru
        localStorage.setItem(LAST_REPORT_KEY, reportTime.getTime());

        // Buat notifikasi baru untuk dashboard
        const newNotification = {
            id: reportTime.getTime(),
            icon: 'fa-solid fa-truck-fast',
            iconColor: 'text-blue-500',
            title: 'Laporan Sampah Diterima',
            message: 'Permintaan pengangkutan sampah dari warga telah diterima.',
            time: reportTime.toISOString(),
            read: false
        };

        try {
            const existingNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
            existingNotifications.unshift(newNotification);
            localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(existingNotifications));
        } catch (e) {
            console.error("Gagal menyimpan notifikasi:", e);
        }
        
        // Tampilkan konfirmasi dan mulai cooldown
        showToast();
        startCooldown(cooldownEndTime);
    });
});