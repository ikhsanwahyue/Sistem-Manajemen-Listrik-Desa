'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Interface Data Warga
interface WargaData {
    id: number;
    nama: string;
    rt: string;
    idPelanggan: string;
    tagihanPln: number;
    admin: number;
    isLunas: boolean;
    tglBayar?: string;
}

// Data Bawaan dari Dokumen Tagihan Listrik Balong
const initialWarga: WargaData[] = [
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

export default function DashboardPage() {
    const [wargaList, setWargaList] = useState<WargaData[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedRt, setSelectedRt] = useState<string>('Semua RT');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [loadingSingleId, setLoadingSingleId] = useState<number | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formNama, setFormNama] = useState('');
    const [formRt, setFormRt] = useState('RT 04');
    const [formIdPelanggan, setFormIdPelanggan] = useState('');
    const [formTagihanPln, setFormTagihanPln] = useState('');
    const [formAdmin, setFormAdmin] = useState('6000');

    useEffect(() => {
        const savedData = localStorage.getItem('sigap_warga_balong_data');
        let dataToUse = initialWarga;

        if (savedData) {
            try {
                dataToUse = JSON.parse(savedData);
            } catch (e) {
                dataToUse = initialWarga;
            }
        }

        setWargaList(dataToUse);
        setIsLoaded(true);

        const needsSync = dataToUse.some((w) => w.tagihanPln === 0);
        if (needsSync) {
            syncSemuaTagihanOtomatis(dataToUse);
        }
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('sigap_warga_balong_data', JSON.stringify(wargaList));
        }
    }, [wargaList, isLoaded]);


    const handleBatalBayar = async (id: number, idPelanggan: string) => {
        setWargaList((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, isLunas: false } : item
            )
        );

        try {
            const cleanId = idPelanggan.replace(/\D/g, '');
            await fetch(`/api/pln/batal-bayar`, { // Sesuaikan endpoint jika ada
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPelanggan: cleanId }),
            });
        } catch (error) {
            console.error("Gagal membatalkan pembayaran:", error);
        }
    };

    const handleBayar = async (id: number, idPelanggan: string) => {
        // Memperbarui state lokal wargaList agar langsung berubah jadi lunas
        setWargaList((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, isLunas: true } : item
            )
        );

        // Kirim update ke backend jika diperlukan
        try {
            const cleanId = idPelanggan.replace(/\D/g, '');
            await fetch(`/api/pln/bayar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPelanggan: cleanId }),
            });
        } catch (error) {
            console.error("Gagal memperbarui status pembayaran:", error);
        }
    };

    const handleSyncSingleWarga = async (id: number, idPelanggan: string) => {
        setLoadingSingleId(id);
        try {
            const cleanId = idPelanggan.replace(/\D/g, '');
            const res = await fetch('/api/pln/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPelanggan: cleanId })
            });

            const data = await res.json();

            if (data.success) {
                setWargaList((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? {
                                ...item,
                                tagihanPln: data.tagihanPln,
                                admin: data.adminDesa || item.admin
                            }
                            : item
                    )
                );
                alert(`✅ Berhasil mengambil tagihan PLN: Rp ${data.tagihanPln.toLocaleString('id-ID')}`);
            } else {
                alert(`⚠️ Gagal: ${data.message || 'ID Pelanggan tidak ditemukan di server PLN'}`);
            }
        } catch (error) {
            alert('⚠️ Terjadi kesalahan jaringan saat terhubung ke server PLN');
        } finally {
            setLoadingSingleId(null);
        }
    };

    const [lastSyncTime, setLastSyncTime] = useState<string>("02 Agu 2026, 14:00");

    const syncSemuaTagihanOtomatis = async (listData?: WargaData[]) => {
        const currentList = listData || wargaList;
        if (!currentList.length) return;

        setIsSyncing(true);
        setSyncProgress(0);

        const updatedList = [...currentList];

        for (let i = 0; i < updatedList.length; i++) {
            try {
                const cleanId = updatedList[i].idPelanggan.replace(/\D/g, '');
                const res = await fetch('/api/pln/inquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idPelanggan: cleanId })
                });

                const data = await res.json();
                if (data.success) {
                    updatedList[i].tagihanPln = data.tagihanPln;
                    if (data.adminDesa) {
                        updatedList[i].admin = data.adminDesa;
                    }
                }
            } catch (err) {
                console.error(`Gagal sync IDPEL ${updatedList[i].idPelanggan}:`, err);
            }

            setSyncProgress(Math.round(((i + 1) / updatedList.length) * 100));
        }

        setWargaList(updatedList);
        localStorage.setItem('sigap_warga_balong_data', JSON.stringify(updatedList));
        setIsSyncing(false);

        // Update Waktu Sync Otomatis Selesai
        const now = new Date();
        const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        setLastSyncTime(`${dateStr}, ${timeStr}`);
    };

    const handleAddWarga = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formNama || !formIdPelanggan) return;

        const newWarga: WargaData = {
            id: Date.now(),
            nama: formNama.toUpperCase(),
            rt: formRt,
            idPelanggan: formIdPelanggan,
            tagihanPln: Number(formTagihanPln) || 0,
            admin: Number(formAdmin) || 6000,
            isLunas: false,
        };

        setWargaList([newWarga, ...wargaList]);
        setFormNama('');
        setFormIdPelanggan('');
        setFormTagihanPln('');
        setIsModalOpen(false);
    };

    const totalKK = wargaList.length;
    const countRt04 = wargaList.filter(w => w.rt === 'RT 04').length;
    const countRt05 = wargaList.filter(w => w.rt === 'RT 05').length;
    const countRt06 = wargaList.filter(w => w.rt === 'RT 06').length;

    const totalTagihanPln = wargaList.reduce((acc, w) => acc + w.tagihanPln, 0);
    const totalAdmin = wargaList.reduce((acc, w) => acc + w.admin, 0);
    const totalTerkumpulUang = wargaList
        .filter((w) => w.isLunas)
        .reduce((acc, w) => acc + w.tagihanPln + w.admin, 0);

    const filteredWarga = wargaList.filter((item) => {
        const matchRt = selectedRt === 'Semua RT' || item.rt === selectedRt;
        const matchSearch =
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.idPelanggan.includes(searchQuery);
        return matchRt && matchSearch;
    });

    return (
        <div className="bg-[#FAF7F2] text-[#1B4332] antialiased min-h-screen font-sans selection:bg-[#1B4332]/10">

            {/* Mobile Container wrapper */}
            <div className="max-w-md mx-auto min-h-screen bg-white md:bg-[#FAF7F2] shadow-2xl relative pb-28">

                {/* Mobile Top App Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-100 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#1B4332] text-lg">account_balance</span>
                        <span className="font-bold text-sm tracking-tight text-[#1B4332]">SIGAP Listrik Balong</span>
                    </div>
                    <button
                        onClick={() => syncSemuaTagihanOtomatis()}
                        disabled={isSyncing}
                        className="text-zinc-600 hover:text-[#1B4332] transition-colors p-1"
                        title="Sync PLN"
                    >
                        <span className="material-symbols-outlined text-lg">sync</span>
                    </button>
                </div>

                {/* Main Heading Section */}
                <div className="px-5 pt-6 pb-4 relative">
                    <div className="flex justify-between items-start">
                        <div className="max-w-[230px]">
                            <h2 className="text-3xl font-extrabold text-[#1B4332] leading-[1.15] tracking-tight mb-2">
                                Sistem Manajemen Listrik Desa Balong
                            </h2>
                            <p className="text-xs text-zinc-500 font-medium">
                                Sekretariat Pemuda / Karang Taruna — Sewon, Bantul
                            </p>
                        </div>

                        {/* Period Badge */}
                        <div className="border border-dashed border-[#1B4332]/40 rounded-xl px-3 py-2 rotate-[3deg] bg-amber-50/40 text-center shrink-0">
                            <span className="block text-[9px] uppercase tracking-wider text-zinc-400 font-bold">PERIODE</span>
                            <span className="text-xs font-bold text-[#1B4332]">Agustus 2026</span>
                        </div>
                    </div>
                </div>

                {/* Sync Progress Bar */}
                {isSyncing && (
                    <div className="px-5 mb-4">
                        <div className="bg-[#1B4332]/10 border border-[#1B4332]/20 p-3 rounded-xl flex flex-col gap-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-[#1B4332]">
                                <span>⚡ Sedang Sinkronisasi Tagihan PLN...</span>
                                <span>{syncProgress}%</span>
                            </div>
                            <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-[#1B4332] h-1.5 rounded-full transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cards Section */}
                <div className="px-5 space-y-3 mb-5">

                    {/* Card 1: Total Warga Terdaftar */}
                    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">TOTAL WARGA TERDAFTAR</span>
                        </div>
                        <div className="flex items-baseline justify-between mb-2">
                            <span className="text-3xl font-extrabold text-[#1B4332] tracking-tight">{totalKK}</span>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded-full">
                                <span className="material-symbols-outlined text-xs">group</span> 100%
                            </span>
                        </div>
                        <div className="pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 font-medium">
                            RT 04: {countRt04} | RT 05: {countRt05} | RT 06: {countRt06}
                        </div>
                    </div>

                    {/* Card 2: Status Sync Tagihan */}
                    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <span className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">STATUS SYNC TAGIHAN</span>
                        <div className="flex items-center justify-between">
                            <div className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-xs font-semibold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Sudah Ditarik
                            </div>
                            <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">schedule</span>
                                Terakhir: {lastSyncTime}
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Total Keuangan Bulan Ini */}
                    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <span className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1">TOTAL KEUANGAN BULAN INI</span>
                        <div className="text-xl font-extrabold text-[#1B4332] tracking-tight mb-2">
                            Rp {totalTerkumpulUang.toLocaleString('id-ID')}
                        </div>
                        <div className="pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 font-medium">
                            PLN: Rp {totalTagihanPln.toLocaleString('id-ID')} | Admin: Rp {totalAdmin.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>

                {/* Search & Actions Toolbar */}
                <div className="px-5 mb-5 space-y-3">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
                        <input
                            type="text"
                            className="w-full bg-zinc-50/80 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                            placeholder="Cari nama atau ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => syncSemuaTagihanOtomatis()}
                        disabled={isSyncing}
                        className="w-full bg-[#1B4332] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#1B4332]/90 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">cloud_download</span>
                        Tarik Tagihan
                    </button>

                    {/* RT Filter Tabs */}
                    <div className="grid grid-cols-4 gap-1.5 bg-zinc-100 p-1 rounded-xl text-center">
                        {['Semua RT', 'RT 04', 'RT 05', 'RT 06'].map((rt) => (
                            <button
                                key={rt}
                                onClick={() => setSelectedRt(rt)}
                                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${selectedRt === rt
                                    ? 'bg-white text-[#1B4332] shadow-xs'
                                    : 'text-zinc-500 hover:text-zinc-800'
                                    }`}
                            >
                                {rt}
                            </button>
                        ))}
                    </div>

                    {/* Action Quick Links */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                            href="/mading"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-colors shadow-2xs"
                        >
                            <span className="material-symbols-outlined text-sm text-[#1B4332]">print</span>
                            Lembar Tagihan
                        </Link>
                        <Link
                            href="/kasir"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-colors shadow-2xs"
                        >
                            <span className="material-symbols-outlined text-sm text-[#1B4332]">receipt_long</span>
                            Lembar Rekapitulasi
                        </Link>
                    </div>
                </div>

                {/* Warga List Section with Updated Card Design */}
                <div className="px-5 space-y-3 pb-12">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Daftar Warga ({filteredWarga.length})</span>
                        <button onClick={() => setIsModalOpen(true)} className="text-xs text-[#1B4332] font-bold hover:underline">
                            + Tambah Warga
                        </button>
                    </div>

                    {filteredWarga.length === 0 ? (
                        <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-400 text-xs font-medium">
                            Data warga tidak ditemukan.
                        </div>
                    ) : (
                        filteredWarga.map((item) => {
                            const initials = item.nama.split(' ').slice(0, 2).map((n) => n[0]).join('');
                            const isSingleLoading = loadingSingleId === item.id;
                            const total = item.tagihanPln + item.admin;

                            return (
                                <div key={item.id} className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3 hover:border-[#1B4332]/30 transition-all">
                                    {/* Top Row: Avatar, Name & RT */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-[#1B4332] font-bold text-xs shrink-0 border border-zinc-200/50">
                                                {initials}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xs text-[#1B4332]">{item.nama}</h4>
                                                <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-1 mt-0.5">
                                                    <span>📍 {item.rt}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Section: ID Pelanggan & Total Amount */}
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                                            <span className="text-zinc-400">•</span>
                                            <span>{item.idPelanggan}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-zinc-400 font-medium">Total</span>
                                            <span className="text-xs font-extrabold text-[#1B4332]">Rp {total.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    {/* Bottom Section: Status Badge & Action Button */}
                                    <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100">
                                        <div>
                                            {item.isLunas ? (
                                                <span className="inline-flex items-center gap-1 bg-[#1B4332]/10 text-[#1B4332] px-2.5 py-1 rounded-full text-[10px] font-bold">
                                                    <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                    LUNAS
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                                    <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                                                    BELUM BAYAR
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            {item.isLunas ? (
                                                <button
                                                    onClick={() => handleBatalBayar(item.id, item.idPelanggan)}
                                                    className="bg-zinc-100 border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-zinc-200 transition-all shadow-2xs flex items-center gap-1"
                                                    title="Batalkan Pembayaran"
                                                >
                                                    <span className="material-symbols-outlined text-xs">undo</span>
                                                    Batal
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBayar(item.id, item.idPelanggan)}
                                                    className="bg-[#1B4332] text-white px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-[#1B4332]/90 transition-all shadow-2xs flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-xs">receipt_long</span>
                                                    Bayar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Mobile Bottom Navigation Bar */}
                <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2.5 border-t border-zinc-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                    <Link className="flex flex-col items-center justify-center text-[#1B4332] px-3 py-1" href="/">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                        <span className="text-[10px] font-bold mt-0.5">Beranda</span>
                    </Link>
                    <Link className="flex flex-col items-center justify-center text-zinc-400 hover:text-zinc-700 px-3 py-1 transition-colors" href="/mading">
                        <span className="material-symbols-outlined text-xl">analytics</span>
                        <span className="text-[10px] font-medium mt-0.5">Laporan</span>
                    </Link>
                    <Link className="flex flex-col items-center justify-center text-zinc-400 hover:text-zinc-700 px-3 py-1 transition-colors" href="/profil">
                        <span className="material-symbols-outlined text-xl">person</span>
                        <span className="text-[10px] font-medium mt-0.5">Profil</span>
                    </Link>
                </nav>
            </div>

            {/* MODAL DIALOG: TAMBAH WARGA */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl border border-zinc-100 space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                            <h3 className="text-sm font-bold text-[#1B4332]">Tambah Data Warga</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 text-lg font-bold cursor-pointer">✕</button>
                        </div>

                        <form onSubmit={handleAddWarga} className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Nama Lengkap Warga</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: ADIWIYONO"
                                    value={formNama}
                                    onChange={(e) => setFormNama(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Wilayah RT</label>
                                    <select
                                        value={formRt}
                                        onChange={(e) => setFormRt(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                                    >
                                        <option value="RT 04">RT 04</option>
                                        <option value="RT 05">RT 05</option>
                                        <option value="RT 06">RT 06</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">IDPEL PLN</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="521.030..."
                                        value={formIdPelanggan}
                                        onChange={(e) => setFormIdPelanggan(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Tagihan Awal (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={formTagihanPln}
                                        onChange={(e) => setFormTagihanPln(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Biaya Admin (Rp)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formAdmin}
                                        onChange={(e) => setFormAdmin(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors cursor-pointer">Batal</button>
                                <button type="submit" className="bg-[#1B4332] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-95 transition-all shadow-sm cursor-pointer">Simpan Data</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}