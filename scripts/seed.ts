// scripts/seed.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const dataWarga = [
    // RT 04
    { id: 1, nama: 'ADIWIYONO', rt: 'RT 04', id_pelanggan: '521.030.321.864', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 2, nama: 'ABDULLAH MUSRIFIN', rt: 'RT 04', id_pelanggan: '521.032.262.154', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 3, nama: 'BADAR', rt: 'RT 04', id_pelanggan: '521.031.404.705', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 4, nama: 'BARDOSOΝO', rt: 'RT 04', id_pelanggan: '521.031.117.599', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 5, nama: 'DARMOWIYONO', rt: 'RT 04', id_pelanggan: '521.030.328.709', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 6, nama: 'ENDRI KRISWANTO', rt: 'RT 04', id_pelanggan: '521.031.665.203', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 7, nama: 'HARDI SUNARTO', rt: 'RT 04', id_pelanggan: '521.030.242.833', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 8, nama: 'HARJO INANGUN', rt: 'RT 04', id_pelanggan: '521.030.242.825', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 9, nama: 'IR SUJONO', rt: 'RT 04', id_pelanggan: '521.031.579.365', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 10, nama: 'ISTIARJO', rt: 'RT 04', id_pelanggan: '521.030.901.814', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 11, nama: 'ISTIARNO', rt: 'RT 04', id_pelanggan: '521.031.130.645', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 12, nama: 'ISTIARTO', rt: 'RT 04', id_pelanggan: '521.030.559.928', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 13, nama: 'JUMENO', rt: 'RT 04', id_pelanggan: '521.030.242.882', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 14, nama: 'KEMAT RULIYANTO', rt: 'RT 04', id_pelanggan: '521.030.733.452', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 15, nama: 'KENDAR', rt: 'RT 04', id_pelanggan: '521.030.456.015', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 16, nama: 'KUNDARTI', rt: 'RT 04', id_pelanggan: '521.031.042.787', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 17, nama: 'LASIMAN', rt: 'RT 04', id_pelanggan: '521.031.399.214', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 18, nama: 'MADI UTOMO', rt: 'RT 04', id_pelanggan: '521.030.321.786', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 19, nama: 'MARJIYO', rt: 'RT 04', id_pelanggan: '521.031.335.020', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 20, nama: 'MINTO DIMEJO', rt: 'RT 04', id_pelanggan: '521.030.791.013', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 21, nama: 'MINTO DIMEJO', rt: 'RT 04', id_pelanggan: '521.031.267.310', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 22, nama: 'MULYO RAHARJO', rt: 'RT 04', id_pelanggan: '521.030.321.815', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 23, nama: 'NARNO', rt: 'RT 04', id_pelanggan: '521.030.321.760', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 24, nama: 'NGADIMUN', rt: 'RT 04', id_pelanggan: '521.030.328.695', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 25, nama: 'NURDI HARJONO', rt: 'RT 04', id_pelanggan: '521.030.456.023', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 26, nama: 'NY AMINAH', rt: 'RT 04', id_pelanggan: '521.031.012.403', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 27, nama: 'NY WARNO UTOMO', rt: 'RT 04', id_pelanggan: '521.030.230.991', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 28, nama: 'NYOMADIHARJO', rt: 'RT 04', id_pelanggan: '521.030.706.429', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 29, nama: 'PAIJAN', rt: 'RT 04', id_pelanggan: '521.030.321.807', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 30, nama: 'PAIJO', rt: 'RT 04', id_pelanggan: '521.031.050.998', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 31, nama: 'PAINEN', rt: 'RT 04', id_pelanggan: '521.030.485.306', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 32, nama: 'RIYANTO', rt: 'RT 04', id_pelanggan: '521.031.654.157', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 33, nama: 'SAPTA PRIYANA', rt: 'RT 04', id_pelanggan: '521.031.093.983', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 34, nama: 'SIS SUHADI', rt: 'RT 04', id_pelanggan: '521.031.405.749', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 35, nama: 'SOGIYONO', rt: 'RT 04', id_pelanggan: '521.030.769.326', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 36, nama: 'SUDARMAN', rt: 'RT 04', id_pelanggan: '521.031.542.778', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 37, nama: 'SUMARWAN', rt: 'RT 04', id_pelanggan: '521.031.424.711', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 38, nama: 'SUMIDIARJO/MINGUN', rt: 'RT 04', id_pelanggan: '521.031.004.595', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 39, nama: 'SUPRIYATI', rt: 'RT 04', id_pelanggan: '521.031.346.175', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 40, nama: 'SURADI', rt: 'RT 04', id_pelanggan: '521.031.399.206', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 41, nama: 'SUWARTI/NY MULYO HS', rt: 'RT 04', id_pelanggan: '521.030.725.737', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 42, nama: 'TK PERTIWI', rt: 'RT 04', id_pelanggan: '521.031.393.858', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 43, nama: 'TRISNOMUJIRAHARJO', rt: 'RT 04', id_pelanggan: '521.030.321.778', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 44, nama: 'WAHINEN', rt: 'RT 04', id_pelanggan: '521.031.249.038', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 45, nama: 'WANTINI', rt: 'RT 04', id_pelanggan: '521.031.569.707', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 46, nama: 'WIDI UTOMO', rt: 'RT 04', id_pelanggan: '521.030.321.856', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 47, nama: 'WAGIYO SUPRAPTO', rt: 'RT 04', id_pelanggan: '521.030.812.435', tagihan_pln: 0, admin: 6000, is_lunas: false },

    // RT 05
    { id: 48, nama: 'BUDI UTOMO', rt: 'RT 05', id_pelanggan: '521.031.149.119', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 49, nama: 'FINA WINDARTI', rt: 'RT 05', id_pelanggan: '521.031.540.030', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 50, nama: 'KARDI UTOMO', rt: 'RT 05', id_pelanggan: '521.030.363.370', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 51, nama: 'KARTONO', rt: 'RT 05', id_pelanggan: '521.030.321.831', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 52, nama: 'KEMAT/RULIYANTO (RT05)', rt: 'RT 05', id_pelanggan: '521.030.576.609', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 53, nama: 'MARDI UTOMO', rt: 'RT 05', id_pelanggan: '521.030.321.823', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 54, nama: 'MARTO UTOMO', rt: 'RT 05', id_pelanggan: '521.030.508.229', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 55, nama: 'MARYONO', rt: 'RT 05', id_pelanggan: '521.030.799.116', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 56, nama: 'MASJID AN NUR', rt: 'RT 05', id_pelanggan: '521.030.817.167', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 57, nama: 'MULYONO', rt: 'RT 05', id_pelanggan: '521.030.576.617', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 58, nama: 'NY GITO SUWARNO', rt: 'RT 05', id_pelanggan: '521.031.145.999', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 59, nama: 'NY PONIJAN', rt: 'RT 05', id_pelanggan: '521.031.132.681', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 60, nama: 'NY SEDYO UTOMO', rt: 'RT 05', id_pelanggan: '521.030.678.963', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 61, nama: 'PARJIYATI', rt: 'RT 05', id_pelanggan: '521.031.537.308', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 62, nama: 'PARYONO', rt: 'RT 05', id_pelanggan: '521.030.630.465', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 63, nama: 'SUMAR GINO', rt: 'RT 05', id_pelanggan: '521.030.460.808', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 64, nama: 'SARJIMAN', rt: 'RT 05', id_pelanggan: '521.031.401.326', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 65, nama: 'SLAMET', rt: 'RT 05', id_pelanggan: '521.031.126.815', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 66, nama: 'SURATIJO', rt: 'RT 05', id_pelanggan: '521.030.630.473', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 67, nama: 'YADI', rt: 'RT 05', id_pelanggan: '521.031.476.806', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 68, nama: 'RUMIYATI', rt: 'RT 05', id_pelanggan: '521.032.921.653', tagihan_pln: 0, admin: 6000, is_lunas: false },

    // RT 06
    { id: 69, nama: 'AGUS WARIYANTO', rt: 'RT 06', id_pelanggan: '521.030.876.799', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 70, nama: 'ISTI PURWANTO', rt: 'RT 06', id_pelanggan: '521.030.363.313', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 71, nama: 'MARDI UTOMO (RT06)', rt: 'RT 06', id_pelanggan: '521.031.129.302', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 72, nama: 'MARGI UTOMO', rt: 'RT 06', id_pelanggan: '521.030.452.448', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 73, nama: 'MUHADI', rt: 'RT 06', id_pelanggan: '521.030.697.831', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 74, nama: 'MULYADI', rt: 'RT 06', id_pelanggan: '521.031.126.864', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 75, nama: 'MURJIMAN', rt: 'RT 06', id_pelanggan: '521.031.028.160', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 76, nama: 'NY JASMIDAH', rt: 'RT 06', id_pelanggan: '521.031.063.389', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 77, nama: 'PARJAN', rt: 'RT 06', id_pelanggan: '521.030.785.602', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 78, nama: 'PRIYOWIARJO', rt: 'RT 06', id_pelanggan: '521.030.363.354', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 79, nama: 'SARIJO', rt: 'RT 06', id_pelanggan: '521.030.878.155', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 80, nama: 'SOMODIHARJO', rt: 'RT 06', id_pelanggan: '521.030.363.305', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 81, nama: 'SUDI', rt: 'RT 06', id_pelanggan: '521.030.357.400', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 82, nama: 'SULIYO HADI', rt: 'RT 06', id_pelanggan: '521.031.050.326', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 83, nama: 'SURATMAN', rt: 'RT 06', id_pelanggan: '521.031.456.609', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 84, nama: 'WALIJO', rt: 'RT 06', id_pelanggan: '521.031.163.105', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 85, nama: 'WARDI', rt: 'RT 06', id_pelanggan: '521.030.607.649', tagihan_pln: 0, admin: 6000, is_lunas: false },
    { id: 86, nama: 'ALI SUBIYANTO', rt: 'RT 06', id_pelanggan: '521.032.915.497', tagihan_pln: 0, admin: 6000, is_lunas: false },
];

async function seedData() {
    console.log('Mengirim data ke Supabase...');
    const { error } = await supabase.from('pelanggan').insert(dataWarga);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Data berhasil dimasukkan!');
    }
}

seedData();