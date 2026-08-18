'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface WargaData {
    id: number | string;
    nama: string;
    rt: string;
    idPelanggan: string;
    tagihanPln: number;
    admin: number;
    isLunas: boolean;
}

// Master Data Lengkap 86 Warga Balong
const initialData: WargaData[] = [
    // RT 04
    { id: 1, nama: 'ADIWIYONO', rt: 'RT 04', idPelanggan: '521.030.321.864', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 2, nama: 'ABDULLAH MUSRIFIN', rt: 'RT 04', idPelanggan: '521.032.262.154', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 3, nama: 'BADAR', rt: 'RT 04', idPelanggan: '521.031.404.705', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 4, nama: 'BARDOSOΝO', rt: 'RT 04', idPelanggan: '521.031.117.599', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 5, nama: 'DARMOWIYONO', rt: 'RT 04', idPelanggan: '521.030.328.709', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 6, nama: 'ENDRI KRISWANTO', rt: 'RT 04', idPelanggan: '521.031.665.203', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 7, nama: 'HARDI SUNARTO', rt: 'RT 04', idPelanggan: '521.030.242.833', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 8, nama: 'HARJO INANGUN', rt: 'RT 04', idPelanggan: '521.030.242.825', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 9, nama: 'IR SUJONO', rt: 'RT 04', idPelanggan: '521.031.579.365', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 10, nama: 'ISTIARJO', rt: 'RT 04', idPelanggan: '521.030.901.814', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 11, nama: 'ISTIARNO', rt: 'RT 04', idPelanggan: '521.031.130.645', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 12, nama: 'ISTIARTO', rt: 'RT 04', idPelanggan: '521.030.559.928', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 13, nama: 'JUMENO', rt: 'RT 04', idPelanggan: '521.030.242.882', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 14, nama: 'KEMAT RULIYANTO (RT04)', rt: 'RT 04', idPelanggan: '521.030.733.452', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 15, nama: 'KENDAR', rt: 'RT 04', idPelanggan: '521.030.456.015', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 16, nama: 'KUNDARTI', rt: 'RT 04', idPelanggan: '521.031.042.787', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 17, nama: 'LASIMAN', rt: 'RT 04', idPelanggan: '521.031.399.214', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 18, nama: 'MADI UTOMO', rt: 'RT 04', idPelanggan: '521.030.321.786', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 19, nama: 'MARJIYO', rt: 'RT 04', idPelanggan: '521.031.335.020', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 20, nama: 'MINTO DIMEJO', rt: 'RT 04', idPelanggan: '521.030.791.013', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 21, nama: 'MINTO DIMEJO', rt: 'RT 04', idPelanggan: '521.031.267.310', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 22, nama: 'MULYO RAHARJO', rt: 'RT 04', idPelanggan: '521.030.321.815', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 23, nama: 'NARNO', rt: 'RT 04', idPelanggan: '521.030.321.760', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 24, nama: 'NGADIMUN', rt: 'RT 04', idPelanggan: '521.030.328.695', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 25, nama: 'NURDI HARJONO', rt: 'RT 04', idPelanggan: '521.030.456.023', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 26, nama: 'NY AMINAH', rt: 'RT 04', idPelanggan: '521.031.012.403', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 27, nama: 'NY WARNO UTOMO', rt: 'RT 04', idPelanggan: '521.030.230.991', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 28, nama: 'NYOMADIHARJO', rt: 'RT 04', idPelanggan: '521.030.706.429', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 29, nama: 'PAIJAN', rt: 'RT 04', idPelanggan: '521.030.321.807', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 30, nama: 'PAIJO', rt: 'RT 04', idPelanggan: '521.031.050.998', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 31, nama: 'PAINEN', rt: 'RT 04', idPelanggan: '521.030.485.306', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 32, nama: 'RIYANTO', rt: 'RT 04', idPelanggan: '521.031.654.157', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 33, nama: 'SAPTA PRIYANA', rt: 'RT 04', idPelanggan: '521.031.093.983', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 34, nama: 'SIS SUHADI', rt: 'RT 04', idPelanggan: '521.031.405.749', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 35, nama: 'SOGIYONO', rt: 'RT 04', idPelanggan: '521.030.769.326', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 36, nama: 'SUDARMAN', rt: 'RT 04', idPelanggan: '521.031.542.778', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 37, nama: 'SUMARWAN', rt: 'RT 04', idPelanggan: '521.031.424.711', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 38, nama: 'SUMIDIARJO/MINGUN', rt: 'RT 04', idPelanggan: '521.031.004.595', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 39, nama: 'SUPRIYATI', rt: 'RT 04', idPelanggan: '521.031.346.175', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 40, nama: 'SURADI', rt: 'RT 04', idPelanggan: '521.031.399.206', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 41, nama: 'SUWARTI/NY MULYO HS', rt: 'RT 04', idPelanggan: '521.030.725.737', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 42, nama: 'TK PERTIWI', rt: 'RT 04', idPelanggan: '521.031.393.858', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 43, nama: 'TRISNOMUJIRAHARJO', rt: 'RT 04', idPelanggan: '521.030.321.778', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 44, nama: 'WAHINEN', rt: 'RT 04', idPelanggan: '521.031.249.038', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 45, nama: 'WANTINI', rt: 'RT 04', idPelanggan: '521.031.569.707', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 46, nama: 'WIDI UTOMO', rt: 'RT 04', idPelanggan: '521.030.321.856', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 47, nama: 'WAGIYO SUPRAPTO', rt: 'RT 04', idPelanggan: '521.030.812.435', tagihanPln: 0, admin: 6000, isLunas: false },

    // RT 05
    { id: 48, nama: 'BUDI UTOMO', rt: 'RT 05', idPelanggan: '521.031.149.119', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 49, nama: 'FINA WINDARTI', rt: 'RT 05', idPelanggan: '521.031.540.030', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 50, nama: 'KARDI UTOMO', rt: 'RT 05', idPelanggan: '521.030.363.370', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 51, nama: 'KARTONO', rt: 'RT 05', idPelanggan: '521.030.321.831', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 52, nama: 'KEMAT/RULIYANTO (RT05)', rt: 'RT 05', idPelanggan: '521.030.576.609', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 53, nama: 'MARDI UTOMO', rt: 'RT 05', idPelanggan: '521.030.321.823', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 54, nama: 'MARTO UTOMO', rt: 'RT 05', idPelanggan: '521.030.508.229', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 55, nama: 'MARYONO', rt: 'RT 05', idPelanggan: '521.030.799.116', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 56, nama: 'MASJID AN NUR', rt: 'RT 05', idPelanggan: '521.030.817.167', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 57, nama: 'MULYONO', rt: 'RT 05', idPelanggan: '521.030.576.617', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 58, nama: 'NY GITO SUWARNO', rt: 'RT 05', idPelanggan: '521.031.145.999', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 59, nama: 'NY PONIJAN', rt: 'RT 05', idPelanggan: '521.031.132.681', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 60, nama: 'NY SEDYO UTOMO', rt: 'RT 05', idPelanggan: '521.030.678.963', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 61, nama: 'PARJIYATI', rt: 'RT 05', idPelanggan: '521.031.537.308', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 62, nama: 'PARYONO', rt: 'RT 05', idPelanggan: '521.030.630.465', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 63, nama: 'SUMAR GINO', rt: 'RT 05', idPelanggan: '521.030.460.808', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 64, nama: 'SARJIMAN', rt: 'RT 05', idPelanggan: '521.031.401.326', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 65, nama: 'SLAMET', rt: 'RT 05', idPelanggan: '521.031.126.815', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 66, nama: 'SURATIJO', rt: 'RT 05', idPelanggan: '521.030.630.473', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 67, nama: 'YADI', rt: 'RT 05', idPelanggan: '521.031.476.806', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 68, nama: 'RUMIYATI', rt: 'RT 05', idPelanggan: '521.032.921.653', tagihanPln: 0, admin: 6000, isLunas: false },

    // RT 06
    { id: 69, nama: 'AGUS WARIYANTO', rt: 'RT 06', idPelanggan: '521.030.876.799', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 70, nama: 'ISTI PURWANTO', rt: 'RT 06', idPelanggan: '521.030.363.313', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 71, nama: 'MARDI UTOMO (RT06)', rt: 'RT 06', idPelanggan: '521.031.129.302', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 72, nama: 'MARGI UTOMO', rt: 'RT 06', idPelanggan: '521.030.452.448', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 73, nama: 'MUHADI', rt: 'RT 06', idPelanggan: '521.030.697.831', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 74, nama: 'MULYADI', rt: 'RT 06', idPelanggan: '521.031.126.864', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 75, nama: 'MURJIMAN', rt: 'RT 06', idPelanggan: '521.031.028.160', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 76, nama: 'NY JASMIDAH', rt: 'RT 06', idPelanggan: '521.031.063.389', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 77, nama: 'PARJAN', rt: 'RT 06', idPelanggan: '521.030.785.602', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 78, nama: 'PRIYOWIARJO', rt: 'RT 06', idPelanggan: '521.030.363.354', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 79, nama: 'SARIJO', rt: 'RT 06', idPelanggan: '521.030.878.155', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 80, nama: 'SOMODIHARJO', rt: 'RT 06', idPelanggan: '521.030.363.305', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 81, nama: 'SUDI', rt: 'RT 06', idPelanggan: '521.030.357.400', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 82, nama: 'SULIYO HADI', rt: 'RT 06', idPelanggan: '521.031.050.326', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 83, nama: 'SURATMAN', rt: 'RT 06', idPelanggan: '521.031.456.609', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 84, nama: 'WALIJO', rt: 'RT 06', idPelanggan: '521.031.163.105', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 85, nama: 'WARDI', rt: 'RT 06', idPelanggan: '521.030.607.649', tagihanPln: 0, admin: 6000, isLunas: false },
    { id: 86, nama: 'ALI SUBIYANTO', rt: 'RT 06', idPelanggan: '521.032.915.497', tagihanPln: 0, admin: 6000, isLunas: false },
];

export default function KasirPage() {
    const router = useRouter();
    const [wargaList, setWargaList] = useState<WargaData[]>(initialData);
    const [selectedRt, setSelectedRt] = useState<string>('SEMUA');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isSyncingSupabase, setIsSyncingSupabase] = useState<boolean>(false);

    // 1. Proteksi Halaman (Autentikasi User)
    useEffect(() => {
        const isAuth = localStorage.getItem('sigap_is_auth');
        if (!isAuth) {
            router.push('/');
        }
    }, [router]);

    // 2. Ambil data dari Supabase (dengan fallback ke LocalStorage/initialData)
    const fetchWargaData = async () => {
        setIsSyncingSupabase(true);
        try {
            const { data, error } = await supabase
                .from('pelanggan')
                .select('*')
                .order('nama', { ascending: true });

            if (!error && data && data.length > 0) {
                const mapped: WargaData[] = data.map((item: any, idx: number) => ({
                    id: item.id || idx + 1,
                    nama: item.nama || '',
                    rt: item.rt || 'RT 04',
                    idPelanggan: item.id_pelanggan || '',
                    tagihanPln: Number(item.tagihan_pln) || 0,
                    admin: Number(item.admin) || 6000,
                    isLunas: Boolean(item.is_lunas),
                }));
                setWargaList(mapped);
                localStorage.setItem('sigap_warga_balong_data', JSON.stringify(mapped));
            } else {
                // Fallback ke localStorage
                const savedData = localStorage.getItem('sigap_warga_balong_data');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed && parsed.length > 0) setWargaList(parsed);
                    } catch (e) {
                        setWargaList(initialData);
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching Supabase in kasir:', err);
        } finally {
            setIsSyncingSupabase(false);
        }
    };

    useEffect(() => {
        fetchWargaData();
    }, []);

    // Helper untuk menyimpan perubahan ke State, LocalStorage & Supabase
    const updateAndSaveData = async (newList: WargaData[]) => {
        setWargaList(newList);
        localStorage.setItem('sigap_warga_balong_data', JSON.stringify(newList));
    };

    // Handle Perubahan Tagihan PLN per Warga
    const handleTagihanChange = async (idPelanggan: string, val: number) => {
        const updated = wargaList.map(item =>
            item.idPelanggan === idPelanggan ? { ...item, tagihanPln: val } : item
        );
        updateAndSaveData(updated);

        // Update ke Supabase
        await supabase
            .from('pelanggan')
            .update({ tagihan_pln: val })
            .eq('id_pelanggan', idPelanggan);
    };

    // Handle Toggle Lunas per Warga
    const handleToggleLunas = async (idPelanggan: string) => {
        let newStatus = false;
        const updated = wargaList.map(item => {
            if (item.idPelanggan === idPelanggan) {
                newStatus = !item.isLunas;
                return { ...item, isLunas: newStatus };
            }
            return item;
        });
        updateAndSaveData(updated);

        // Update ke Supabase
        await supabase
            .from('pelanggan')
            .update({ is_lunas: newStatus })
            .eq('id_pelanggan', idPelanggan);
    };

    // Tandai Semua Lunas (sesuai filter aktif)
    const handleTandaiSemuaLunas = async (status: boolean) => {
        const targetIds = filteredData.map(w => w.idPelanggan);
        const updated = wargaList.map(item =>
            targetIds.includes(item.idPelanggan) ? { ...item, isLunas: status } : item
        );
        updateAndSaveData(updated);

        // Update batch ke Supabase
        for (const idPel of targetIds) {
            await supabase
                .from('pelanggan')
                .update({ is_lunas: status })
                .eq('id_pelanggan', idPel);
        }
    };

    // Reset Data Master
    const handleResetData = () => {
        if (confirm('Apakah Anda yakin ingin memuat ulang 86 data master warga?')) {
            setWargaList(initialData);
            localStorage.setItem('sigap_warga_balong_data', JSON.stringify(initialData));
        }
    };

    // Filter berdasarkan RT & Pencarian Nama/ID
    const filteredData = wargaList.filter(item => {
        const matchRt = selectedRt === 'SEMUA' || item.rt === selectedRt;
        const matchSearch =
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.idPelanggan.includes(searchQuery);
        return matchRt && matchSearch;
    });

    // Perhitungan Total & Statistik
    const totalPln = filteredData.reduce((sum, item) => sum + item.tagihanPln, 0);
    const totalAdmin = filteredData.reduce((sum, item) => sum + item.admin, 0);
    const totalKeseluruhan = totalPln + totalAdmin;
    const countLunas = filteredData.filter(item => item.isLunas).length;
    const countBelumLunas = filteredData.length - countLunas;

    const MIN_ROWS = 10;
    const emptyRowsCount = Math.max(0, MIN_ROWS - filteredData.length);
    const emptyRows = Array.from({ length: emptyRowsCount });

    return (
        <>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap"
            />

            <style jsx global>{`
        @media print {
          body {
            background: white !important;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-border {
            border: 1px solid black !important;
          }
          .print-border-b {
            border-bottom: 1px solid black !important;
          }
          * {
            color: black !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          th,
          td {
            border: 1px solid black !important;
            padding: 5px 6px !important;
          }
          tr {
            page-break-inside: avoid;
          }
          .print-bg-gray {
            background-color: #f3f4f6 !important;
          }
          .input-print-hide {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
          }
          .print-box-checked {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-weight: 900 !important;
            font-size: 14px !important;
            border: 1.5px solid black !important;
            width: 16px !important;
            height: 16px !important;
            line-height: 1 !important;
            border-radius: 2px !important;
          }
          .print-box-empty {
            display: inline-block !important;
            border: 1.5px solid black !important;
            width: 16px !important;
            height: 16px !important;
            border-radius: 2px !important;
          }
        }

        .material-symbols-outlined {
          vertical-align: middle;
          line-height: 1;
        }
      `}</style>

            <div className="bg-[#fbf9f5] text-[#1b1c1a] antialiased min-h-screen font-sans flex flex-col justify-between items-center py-6">

                {/* Top Navigation */}
                <header className="bg-white border-b border-[#c1c8c2]/30 shadow-sm flex flex-col w-full px-6 py-3 max-w-7xl mx-auto top-0 fixed no-print z-50">
                    <div className="flex items-center justify-between w-full max-w-[1024px] mx-auto gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="hover:bg-[#012d1d]/5 transition-colors px-3 py-1.5 rounded-lg text-sm font-semibold text-[#012d1d] flex items-center gap-1 border border-[#012d1d]/20"
                            >
                                ← Dashboard
                            </Link>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#012d1d] text-2xl">
                                    receipt_long
                                </span>
                                <h1 className="text-lg md:text-xl font-bold text-[#012d1d]">
                                    Lembar Rekap Kasir
                                </h1>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={fetchWargaData}
                                disabled={isSyncingSupabase}
                                title="Sinkronkan data status pembayaran terbaru dari database"
                                className="bg-[#012d1d]/10 hover:bg-[#012d1d]/20 text-[#012d1d] font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <span className={`material-symbols-outlined text-sm ${isSyncingSupabase ? 'animate-spin' : ''}`}>
                                    {isSyncingSupabase ? 'progress_activity' : 'cloud_sync'}
                                </span>
                                Sinkron Cloud
                            </button>

                            <button
                                onClick={() => handleTandaiSemuaLunas(true)}
                                title="Tandai semua warga di tabel ini sebagai LUNAS"
                                className="border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs px-2.5 py-1.5 rounded flex items-center gap-1 transition-all cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Centang Semua
                            </button>

                            <button
                                onClick={() => handleTandaiSemuaLunas(false)}
                                title="Batalkan status lunas untuk semua warga di tabel ini"
                                className="border border-zinc-400 text-zinc-600 hover:bg-zinc-100 font-bold text-xs px-2.5 py-1.5 rounded flex items-center gap-1 transition-all cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm">cancel</span>
                                Batal Semua
                            </button>

                            <div className="flex items-center gap-1">
                                <select
                                    value={selectedRt}
                                    onChange={(e) => setSelectedRt(e.target.value)}
                                    className="bg-white border border-[#717973] text-[#1b1c1a] text-xs font-semibold rounded-md pl-2 pr-6 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#012d1d] cursor-pointer"
                                >
                                    <option value="SEMUA">Semua RT ({wargaList.length})</option>
                                    <option value="RT 04">RT 04</option>
                                    <option value="RT 05">RT 05</option>
                                    <option value="RT 06">RT 06</option>
                                </select>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="bg-[#012d1d] text-white font-bold text-xs px-3.5 py-1.5 flex items-center gap-1.5 rounded hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm">print</span>
                                Cetak ({filteredData.length})
                            </button>
                        </div>
                    </div>

                    {/* Sub toolbar info */}
                    <div className="w-full max-w-[1024px] mx-auto mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600 flex-wrap gap-2">
                        <div className="flex items-center gap-3 font-medium">
                            <span>Total: <b>{filteredData.length}</b> Warga</span>
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                                ✓ Lunas: {countLunas}
                            </span>
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                                ⏳ Belum: {countBelumLunas}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Cari nama/ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white border border-zinc-300 text-xs px-2.5 py-1 rounded focus:outline-none focus:ring-1 focus:ring-[#012d1d] w-44"
                            />
                            <button
                                onClick={handleResetData}
                                title="Reset data ke master awal"
                                className="text-zinc-500 hover:text-zinc-800 text-[11px] underline cursor-pointer"
                            >
                                Reset Master
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Print Canvas */}
                <main className="w-full max-w-[1024px] bg-white mx-auto shadow-[0px_4px_12px_rgba(27,67,50,0.08)] p-8 md:p-12 mt-28 mb-12 print:mt-0 print:mb-0 print:shadow-none print:p-0 relative flex-1">

                    {/* Document Header */}
                    <div className="flex justify-between items-start border-b-2 border-[#012d1d] print-border-b pb-4 mb-5">
                        <div>
                            <h1 className="text-2xl font-bold text-[#012d1d] uppercase mb-1">
                                Sistem Manajemen Listrik Desa Balong
                            </h1>
                            <h2 className="text-lg font-semibold text-[#1b1c1a]">
                                Lembar Kontrol Pembayaran Kasir {selectedRt !== 'SEMUA' ? `— Wilayah ${selectedRt}` : '— Seluruh Wilayah'}
                            </h2>
                            <p className="text-xs text-[#717973] mt-1">
                                Total: {filteredData.length} Warga | Terbayar: {countLunas} Lunas ({countBelumLunas} Belum Bayar)
                            </p>
                        </div>
                        <div className="text-right flex flex-col gap-1.5 border border-[#717973] p-3 rounded-lg print-border min-w-[220px]">
                            <div className="flex justify-between gap-4 items-center">
                                <span className="text-xs font-bold text-[#414844] uppercase">
                                    Periode:
                                </span>
                                <span className="text-sm font-semibold text-[#1b1c1a]">
                                    Agustus 2026
                                </span>
                            </div>
                            <div className="flex justify-between gap-4 items-end mt-1">
                                <span className="text-xs font-bold text-[#414844] uppercase">
                                    Petugas Piket:
                                </span>
                                <div className="border-b border-[#1b1c1a] w-[110px] inline-block print-border-b"></div>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse border border-[#717973] print-border text-left">
                            <thead>
                                <tr className="bg-[#eae8e4] border-b-2 border-[#012d1d] print-border-b print-bg-gray">
                                    <th className="p-2 border border-[#717973] print-border font-bold text-xs uppercase text-[#1b1c1a] w-[35px] text-center">
                                        No
                                    </th>
                                    <th className="p-2 border border-[#717973] print-border font-bold text-xs uppercase text-[#1b1c1a] min-w-[170px]">
                                        Nama Warga (RT)
                                    </th>
                                    <th className="p-2 border border-[#717973] print-border font-bold text-xs uppercase text-[#1b1c1a] min-w-[125px]">
                                        ID Pelanggan
                                    </th>
                                    <th className="p-2 border border-[#717973] print-border font-bold text-xs uppercase text-[#1b1c1a] text-right w-[105px]">
                                        PLN
                                    </th>
                                    <th className="p-2 border border-[#717973] print-border font-bold text-xs uppercase text-[#1b1c1a] text-right w-[85px]">
                                        Admin
                                    </th>
                                    <th className="p-2 border border-[#717973] print-border font-bold text-xs uppercase text-[#1b1c1a] text-right w-[105px]">
                                        Total
                                    </th>
                                    <th className="p-2 border border-[#717973] print-border font-bold text-xs uppercase text-[#1b1c1a] text-center w-[65px]">
                                        Lunas?
                                    </th>
                                    <th className="p-2 border border-[#717973] print-border font-bold text-xs uppercase text-[#1b1c1a] text-center w-[100px]">
                                        Paraf / Ket.
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-[#1b1c1a]">
                                {filteredData.map((item, index) => {
                                    const total = item.tagihanPln + item.admin;
                                    return (
                                        <tr key={item.idPelanggan || index} className="border-b border-[#717973] print-border-b bg-white hover:bg-[#012d1d]/5 transition-colors">
                                            <td className="p-2 border-r border-[#717973] print-border text-center font-mono text-xs">{index + 1}</td>
                                            <td className="p-2 border-r border-[#717973] print-border font-medium text-xs md:text-sm">
                                                {item.nama} <span className="text-[10px] md:text-xs text-[#414844]">({item.rt})</span>
                                            </td>
                                            <td className="p-2 border-r border-[#717973] print-border font-mono text-xs text-[#414844]">{item.idPelanggan}</td>

                                            {/* Input / Display Nominal PLN */}
                                            <td className="p-1 border-r border-[#717973] print-border font-mono text-xs text-right">
                                                <div className="flex items-center justify-end gap-1 px-1">
                                                    <span className="text-[#414844] text-xs select-none">Rp</span>
                                                    <input
                                                        type="text"
                                                        value={item.tagihanPln === 0 ? '' : item.tagihanPln.toLocaleString('id-ID')}
                                                        placeholder="0"
                                                        onChange={(e) => {
                                                            const rawValue = e.target.value.replace(/\D/g, '');
                                                            handleTagihanChange(item.idPelanggan, Number(rawValue) || 0);
                                                        }}
                                                        className="w-full text-right p-0.5 bg-transparent border border-transparent focus:border-[#012d1d] focus:bg-white rounded outline-none input-print-hide font-mono text-xs"
                                                    />
                                                </div>
                                            </td>

                                            <td className="p-2 border-r border-[#717973] print-border font-mono text-xs text-right">
                                                Rp {item.admin.toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-2 border-r border-[#717973] print-border font-mono text-xs text-right font-bold text-[#012d1d]">
                                                Rp {total.toLocaleString('id-ID')}
                                            </td>

                                            {/* Checkbox Status Lunas (Interaktif di Layar & Cetak Otomatis di Kertas) */}
                                            <td className="p-2 border-r border-[#717973] print-border text-center">
                                                {/* Di Layar Browser */}
                                                <input
                                                    type="checkbox"
                                                    checked={item.isLunas}
                                                    onChange={() => handleToggleLunas(item.idPelanggan)}
                                                    className="cursor-pointer w-4 h-4 accent-[#012d1d] no-print"
                                                />
                                                {/* Di Kertas Cetak */}
                                                <div className="hidden print:block">
                                                    {item.isLunas ? (
                                                        <span className="print-box-checked">✓</span>
                                                    ) : (
                                                        <span className="print-box-empty"></span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Kolom Paraf / Keterangan Lunas */}
                                            <td className="p-2 border-r border-[#717973] print-border text-center text-xs font-semibold">
                                                {item.isLunas ? (
                                                    <span className="text-emerald-700 font-bold print:text-black">
                                                        LUNAS
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-400 print:text-transparent text-[10px]">
                                                        Belum Bayar
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {emptyRows.map((_, idx) => (
                                    <tr key={`empty-${idx}`} className="border-b border-[#717973] print-border-b bg-white h-8">
                                        <td className="p-2 border-r border-[#717973] print-border text-center font-mono text-xs text-[#717973]">
                                            {filteredData.length + idx + 1}
                                        </td>
                                        <td className="p-2 border-r border-[#717973] print-border"></td>
                                        <td className="p-2 border-r border-[#717973] print-border"></td>
                                        <td className="p-2 border-r border-[#717973] print-border"></td>
                                        <td className="p-2 border-r border-[#717973] print-border"></td>
                                        <td className="p-2 border-r border-[#717973] print-border bg-[#f5f3ef]/50 print-bg-gray"></td>
                                        <td className="p-2 border-r border-[#717973] print-border text-center">
                                            <span className="print-box-empty hidden print:inline-block"></span>
                                        </td>
                                        <td className="p-2 border-r border-[#717973] print-border"></td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr className="bg-[#eae8e4] border-t-2 border-[#012d1d] font-bold text-xs print-bg-gray">
                                    <td colSpan={3} className="p-2 border border-[#717973] print-border text-right uppercase">
                                        Total Akumulasi ({filteredData.length} Warga):
                                    </td>
                                    <td className="p-2 border border-[#717973] print-border text-right font-mono">
                                        Rp {totalPln.toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-2 border border-[#717973] print-border text-right font-mono">
                                        Rp {totalAdmin.toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-2 border border-[#717973] print-border text-right font-mono text-[#012d1d]">
                                        Rp {totalKeseluruhan.toLocaleString('id-ID')}
                                    </td>
                                    <td colSpan={2} className="p-2 border border-[#717973] print-border text-center text-[10px]">
                                        Terbayar: {countLunas}/{filteredData.length}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Signatures */}
                    <div className="mt-8 pt-4 flex justify-between items-end pb-4 print:break-inside-avoid">
                        <div className="text-center w-[200px]">
                            <p className="text-xs text-[#1b1c1a] mb-16 font-medium">Ketua Karang Taruna</p>
                            <div className="border-b border-[#1b1c1a] print-border-b w-full"></div>
                            <p className="text-xs text-[#414844] mt-1 font-semibold">( Dandi Pamungkas )</p>
                        </div>
                        <div className="text-center w-[200px]">
                            <p className="text-xs text-[#1b1c1a] mb-16 font-medium">Petugas Piket / Kasir</p>
                            <div className="border-b border-[#1b1c1a] print-border-b w-full"></div>
                            <p className="text-xs text-[#414844] mt-1 font-semibold">( Hilmy Alif Nurdzaki )</p>
                        </div>
                    </div>
                </main>

                <footer className="w-full px-6 py-4 flex flex-col items-center gap-2 text-center bg-[#f5f3ef] border-t border-[#c1c8c2]/20 no-print mt-auto">
                    <p className="text-xs font-bold text-[#012d1d]">
                        © 2026 Karang Taruna Balong — Sistem Administrasi & Kasir Listrik Desa
                    </p>
                </footer>
            </div>
        </>
    );
}