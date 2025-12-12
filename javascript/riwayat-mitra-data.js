// Mock Data for Mitra Transactions

const allTransactions = [
    {
        nama: "Plastik Reborn Krian",
        tanggal: new Date(new Date().setDate(new Date().getDate() - 1)), // Kemarin
        sampah: [
            { tipe: "Botol Plastik PET", berat: 150, kategori: "non-organik" },
            { tipe: "Gelas Plastik PP", berat: 75, kategori: "non-organik" }
        ]
    },
    {
        nama: "GreenCompost Sidoarjo",
        tanggal: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 hari lalu
        sampah: [
            { tipe: "Sisa Makanan", berat: 300, kategori: "organik" },
        ]
    },
    {
        nama: "BioEnergy Candi",
        tanggal: new Date(new Date().setDate(new Date().getDate() - 4)), // 4 hari lalu
        sampah: [
            { tipe: "Limbah Organik Industri", berat: 500, kategori: "organik" },
            { tipe: "Jerami", berat: 120, kategori: "organik" }
        ]
    },
    {
        nama: "Plastik Reborn Krian",
        tanggal: new Date(new Date().setDate(new Date().getDate() - 8)), // 8 hari lalu
        sampah: [
            { tipe: "Botol Plastik PET", berat: 180, kategori: "non-organik" },
        ]
    },
    {
        nama: "Urban Farming Porong",
        tanggal: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 hari lalu
        sampah: [
            { tipe: "Daun Kering", berat: 250, kategori: "organik" },
            { tipe: "Ranting", berat: 100, kategori: "organik" }
        ]
    },
    {
        nama: "EcoFarm Waru",
        tanggal: new Date(new Date().setDate(new Date().getDate() - 15)), // 15 hari lalu
        sampah: [
            { tipe: "Kotoran Hewan", berat: 50, kategori: "organik" },
        ]
    },
    {
        nama: "GreenCompost Sidoarjo",
        tanggal: new Date(new Date().setDate(new Date().getDate() - 25)), // 25 hari lalu
        sampah: [
            { tipe: "Sisa Sayuran", berat: 400, kategori: "organik" },
        ]
    },
    {
        nama: "Plastik Reborn Krian",
        tanggal: new Date(new Date().setDate(new Date().getDate() - 28)), // 28 hari lalu
        sampah: [
            { tipe: "Ember Plastik Bekas", berat: 90, kategori: "non-organik" },
        ]
    },
];
