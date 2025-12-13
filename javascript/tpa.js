const tpaData = [
    {
        id: 1,
        nama: "TPA Benowo",
        lokasi: "Jl. Raya Benowo, Surabaya",
        status: "Normal",
        jenis: "Pembangkit Listrik Tenaga Sampah",
        kapasitas: 60,
        jarak: 15000, // 15km
        city: "Surabaya",
        trend: [50, 55, 58, 56, 60, 61, 60],
        dailyVolume: 1600, // ton
        lifespan: 10, // years
        wasteComposition: { organic: 55, nonOrganic: 35, b3: 10 }
    },
    {
        id: 2,
        nama: "TPA Supit Urang",
        lokasi: "Jl. Supit Urang, Malang",
        status: "Normal",
        jenis: "Sanitary Landfill",
        kapasitas: 55,
        jarak: 12000, // 12km
        city: "Malang",
        trend: [45, 48, 50, 52, 55, 54, 55],
        dailyVolume: 450, // ton
        lifespan: 8, // years
        wasteComposition: { organic: 65, nonOrganic: 30, b3: 5 }
    },
    {
        id: 3,
        nama: "TPA Jabon",
        lokasi: "Jl. Raya Jabon, Sidoarjo",
        status: "Waspada",
        jenis: "Sanitary Landfill",
        kapasitas: 80,
        jarak: 25000, // 25km
        city: "Sidoarjo",
        trend: [70, 72, 75, 78, 77, 79, 80],
        dailyVolume: 800, // ton
        lifespan: 3, // years
        wasteComposition: { organic: 40, nonOrganic: 45, b3: 15 }
    },
    {
        id: 4,
        nama: "TPA Griyo Mulyo",
        lokasi: "Jl. Griyo Mulyo, Gresik",
        status: "Normal",
        jenis: "Controlled Landfill",
        kapasitas: 40,
        jarak: 30000, // 30km
        city: "Gresik",
        trend: [30, 32, 35, 33, 38, 39, 40],
        dailyVolume: 350, // ton
        lifespan: 15, // years
        wasteComposition: { organic: 60, nonOrganic: 35, b3: 5 }
    }
];
