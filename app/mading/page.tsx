'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface WargaMading {
    id: number | string;
    nama: string;
    rt: string;
    idPelanggan: string;
    tagihanPln: number;
    admin: number;
    isLunas: boolean;
}

// Master Data Lengkap 86 Warga Balong (Sinkron dengan Kasir & Dashboard)
const initialData: WargaMading[] = [
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

export default function LembarKontrolPage() {
    const router = useRouter();
    const [wargaList, setWargaList] = useState<WargaMading[]>(initialData);
    const [selectedRt, setSelectedRt] = useState<string>('SEMUA');
    const [petugasPiket, setPetugasPiket] = useState<string>('Hilmy Alif Nurdzaki');
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    // 1. Proteksi Akses (Auth Guard)
    useEffect(() => {
        const isAuth = localStorage.getItem('sigap_is_auth');
        if (!isAuth) {
            router.push('/');
        }
    }, [router]);

    // 2. Ambil & Sinkronkan Data dari Supabase (fallback ke LocalStorage)
    const fetchMadingData = async () => {
        setIsSyncing(true);
        try {
            const { data, error } = await supabase
                .from('pelanggan')
                .select('*')
                .order('nama', { ascending: true });

            if (!error && data && data.length > 0) {
                const mapped: WargaMading[] = data.map((item: any, idx: number) => ({
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
            console.error('Error fetching data for mading:', err);
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchMadingData();
    }, []);

    const filteredData = selectedRt === 'SEMUA'
        ? wargaList
        : wargaList.filter(item => item.rt === selectedRt);

    // Fungsi helper untuk menghitung total per warga dan membulatkannya ke ribuan terdekat
    const getRoundedTotal = (item: any) => {
        const rawTotal = item.tagihanPln + item.admin;
        // Gunakan Math.round untuk pembulatan standar, atau Math.floor jika ingin selalu ke bawah
        return Math.round(rawTotal / 1000) * 1000;
    };

    // Akumulasi total keseluruhan berdasarkan nilai yang sudah dibulatkan
    const totalKeseluruhan = filteredData.reduce((acc, curr) => acc + getRoundedTotal(curr), 0);

    return (
        <>
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        margin: 0;
                        padding: 0;
                    }
                    .no-print {
                        display: none !important;
                    }
                    table {
                        border-collapse: collapse !important;
                        width: 100% !important;
                    }
                    th, td {
                        border: 1px solid black !important;
                        padding: 6px 8px !important;
                    }
                    tr {
                        page-break-inside: avoid;
                    }
                    .print-bg-gray {
                        background-color: #f3f4f6 !important;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a] p-4 md:p-8 font-sans">
                {/* BAR NAVIGASI & ACTION (Hilang saat diprint) */}
                <div className="max-w-[1024px] mx-auto mb-8 bg-white p-4 rounded-xl border border-[#c1c8c2]/30 shadow-sm flex flex-wrap items-center justify-between gap-4 no-print">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="p-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[#012d1d] font-semibold text-sm flex items-center gap-1 border border-gray-300"
                        >
                            ← Kembali
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-[#012d1d]">Lembar Tagihan Pembayaran</h1>
                            <p className="text-xs text-gray-500">Lembar Ini Digunakan Untuk Dicetak dan Ditempel Pada Papan Informasi Desa</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={fetchMadingData}
                            disabled={isSyncing}
                            className="bg-[#012d1d]/10 hover:bg-[#012d1d]/20 text-[#012d1d] font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                            title="Sinkronkan data status pembayaran terbaru dari database"
                        >
                            <span className={`material-symbols-outlined text-sm ${isSyncing ? 'animate-spin' : ''}`}>
                                {isSyncing ? 'progress_activity' : 'cloud_sync'}
                            </span>
                            Sinkron Cloud
                        </button>

                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold uppercase text-gray-600">Pilih RT :</label>
                            <select
                                value={selectedRt}
                                onChange={(e) => setSelectedRt(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-800 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#012d1d] cursor-pointer"
                            >
                                <option value="SEMUA">Semua RT ({wargaList.length})</option>
                                <option value="RT 04">RT 04</option>
                                <option value="RT 05">RT 05</option>
                                <option value="RT 06">RT 06</option>
                            </select>
                        </div>

                        <button
                            onClick={() => window.print()}
                            className="bg-[#012d1d] text-white px-5 py-2 rounded-lg font-semibold text-xs hover:opacity-90 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">print</span>
                            Cetak Lembar Tagihan
                        </button>
                    </div>
                </div>

                {/* DOKUMEN UTAMA SESUAI GAMBAR TARGET */}
                <div className="w-full max-w-[1024px] bg-white mx-auto shadow-md p-8 md:p-12 print:shadow-none print:p-0 text-[#1b1c1a]">

                    {/* Header Layout Dua Kolom */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-[#012d1d] pb-6 mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#012d1d] uppercase tracking-wide leading-tight">
                                PENGUMUMAN TAGIHAN<br />
                                KOLEKTIF LISTRIK<br />
                                DESA BALONG
                            </h1>
                            <p className="text-sm font-semibold text-gray-600 mt-2">
                                Lembar Tagihan Pembayaran
                            </p>
                        </div>

                        {/* Kotak Info Periode & Petugas Piket */}
                        <div className="border border-gray-400 p-3 rounded-md bg-gray-50/50 min-w-[220px] text-xs space-y-1.5">
                            <div className="flex justify-between">
                                <span className="font-bold text-gray-600 uppercase">PERIODE:</span>
                                <span className="font-semibold">AGUSTUS 2026</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-gray-600 uppercase">PETUGAS:</span>
                                <input
                                    type="text"
                                    value={petugasPiket}
                                    onChange={(e) => setPetugasPiket(e.target.value)}
                                    className="border-b border-gray-400 bg-transparent text-right font-semibold text-xs focus:outline-none w-32 no-print"
                                />
                                <span className="print:inline hidden font-semibold">{petugasPiket}</span>
                            </div>
                            {selectedRt !== 'SEMUA' && (
                                <div className="flex justify-between pt-1 border-t border-gray-200">
                                    <span className="font-bold text-gray-600 uppercase">WILAYAH:</span>
                                    <span className="font-bold text-[#012d1d]">{selectedRt}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabel Lembar Kontrol */}
                    <table className="w-full border-collapse border border-gray-400 text-left text-sm mb-8">
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-[#012d1d] print-bg-gray">
                                <th className="p-2 border border-gray-400 text-center w-[45px] font-bold text-xs uppercase">No</th>
                                <th className="p-2 border border-gray-400 font-bold text-xs uppercase">Nama (RT)</th>
                                <th className="p-2 border border-gray-400 font-bold text-xs uppercase min-w-[140px]">ID Pelanggan</th>
                                <th className="p-2 border border-gray-400 text-right font-bold text-xs uppercase">Total Tagihan</th>
                                <th className="p-2 border border-gray-400 text-center w-[100px] font-bold text-xs uppercase">Keterangan / Paraf</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => {
                                const total = getRoundedTotal(item);
                                return (
                                    <tr key={item.idPelanggan || item.id} className="border-b border-gray-300 hover:bg-gray-50">
                                        <td className="p-2 border-r border-gray-300 text-center font-mono text-xs">{index + 1}</td>
                                        <td className="p-2 border-r border-gray-300 font-semibold text-xs md:text-sm">
                                            {item.nama} <span className="text-gray-500 font-normal">({item.rt})</span>
                                        </td>
                                        <td className="p-2 border-r border-gray-300 font-mono text-xs text-gray-700">{item.idPelanggan}</td>
                                        <td className="p-2 border-r border-gray-300 font-mono text-xs text-right font-bold text-[#012d1d]">
                                            Rp {total.toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-2 border-r border-gray-300 text-center text-xs">
                                            {item.isLunas ? (
                                                <span className="font-bold text-emerald-700 print:text-black">
                                                    ✓ LUNAS
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 print:hidden text-[10px]">Belum Bayar</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100 font-bold print-bg-gray">
                                <td colSpan={3} className="p-2 border border-gray-400 text-right uppercase text-xs">Total Keseluruhan ({filteredData.length} Warga):</td>
                                <td className="p-2 border border-gray-400 text-right font-mono text-xs text-[#012d1d]">
                                    Rp {totalKeseluruhan.toLocaleString('id-ID')}
                                </td>
                                <td className="border border-gray-400"></td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Area Tanda Tangan */}
                    <div className="pt-4 flex justify-between items-end text-center print:break-inside-avoid">
                        <div className="w-[220px]">
                            <p className="text-xs mb-16 font-semibold uppercase text-gray-700">Petugas Piket</p>
                            <div className="border-b border-black w-full mb-1"></div>
                            <p className="text-xs text-gray-600 font-semibold">( Nama Terang & Tanda Tangan )</p>
                        </div>
                        <div className="w-[220px]">
                            <p className="text-xs mb-16 font-semibold uppercase text-gray-700">Ketua Karang Taruna</p>
                            <div className="border-b border-black w-full mb-1"></div>
                            <p className="text-xs text-gray-600 font-semibold">( Nama Terang & Tanda Tangan )</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}