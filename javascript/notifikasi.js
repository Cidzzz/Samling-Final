
document.addEventListener('DOMContentLoaded', function () {
    const notificationListContainer = document.getElementById('notification-list-container');

    // Contoh data notifikasi
    const notifications = [
        {
            icon: 'fa-solid fa-truck',
            color: 'text-blue-500',
            title: 'Truk Sampah Sedang Dalam Perjalanan',
            message: 'Truk dengan nomor polisi AG 7788 KK sedang menuju TPS.',
            time: '25 menit yang lalu'
        },
        {
            icon: 'fa-solid fa-check-circle',
            color: 'text-green-500',
            title: 'Pengambilan Sampah Selesai',
            message: 'Pengambilan sampah di komplek Perumtas 4 Regency telah berhasil diselesaikan.',
            time: '4 jam yang lalu'
        },
        {
            icon: 'fa-solid fa-file-invoice',
            color: 'text-yellow-500',
            title: 'Laporan angkut sampah baru di kecamatan Glintung',
            message: 'Terdapat laporan angkut baru, segera kirimkan truk untuk pengambilan sampah.',
            time: '5 jam yang lalu'
        },
        {
            icon: 'fa-solid fa-triangle-exclamation',
            color: 'text-red-500',
            title: 'Jadwal Pengambilan Berubah',
            message: 'Jadwal pengambilan sampah untuk Desa Sudimoro diubah menjadi pukul 10:00.',
            time: '8 jam yang lalu'
        }
    ];

    if (notificationListContainer) {
        if (notifications.length > 0) {
            notifications.forEach(notif => {
                const notificationElement = `
                    <a href="#" class="flex items-start px-4 py-3 hover:bg-gray-100">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
                                <i class="${notif.icon} ${notif.color} text-xl"></i>
                            </div>
                        </div>
                        <div class="ml-3 w-0 flex-1">
                            <p class="text-sm font-medium text-gray-900">${notif.title}</p>
                            <p class="text-sm text-gray-600">${notif.message}</p>
                            <p class="text-xs text-gray-400 mt-1">${notif.time}</p>
                        </div>
                    </a>
                `;
                notificationListContainer.innerHTML += notificationElement;
            });
        } else {
            notificationListContainer.innerHTML = `
                <div class="px-4 py-3 text-center">
                    <p class="text-sm text-gray-500">Tidak ada notifikasi baru.</p>
                </div>
            `;
        }
    }
});
