'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Import koneksi Supabase

// Interface Data Warga (disesuaikan dengan kolom database Supabase)
interface WargaData {
    id?: number | string;
    nama: string;
    rt: string;
    idPelanggan: string;
    tagihanPln: number;
    admin: number;
    isLunas: boolean;
    tglBayar?: string;
}

export default function DashboardPage() {
    const [wargaList, setWargaList] = useState<WargaData[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedRt, setSelectedRt] = useState<string>('Semua RT');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [loadingSingleId, setLoadingSingleId] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formNama, setFormNama] = useState('');
    const [formRt, setFormRt] = useState('RT 04');
    const [formIdPelanggan, setFormIdPelanggan] = useState('');
    const [formTagihanPln, setFormTagihanPln] = useState('');
    const [formAdmin, setFormAdmin] = useState('6000');

    // 1. Ambil data dari Supabase saat komponen dimuat (dengan fallback ke localStorage)
    const fetchWargaFromSupabase = async () => {
        try {
            const { data, error } = await supabase
                .from('pelanggan')
                .select('*')
                .order('nama', { ascending: true });

            if (error) {
                console.warn('Gagal mengambil data dari Supabase, memuat dari LocalStorage:', error.message);
                const saved = localStorage.getItem('sigap_warga_balong_data');
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        if (parsed && parsed.length > 0) setWargaList(parsed);
                    } catch (e) {}
                }
            } else if (data && data.length > 0) {
                // Petakan data dari database ke format interface WargaData
                const mappedData: WargaData[] = data.map((item: any, index: number) => ({
                    id: item.id || index + 1,
                    nama: item.nama || '',
                    rt: item.rt || 'RT 04',
                    idPelanggan: item.id_pelanggan || '',
                    tagihanPln: Number(item.tagihan_pln) || 0,
                    admin: Number(item.admin) || 6000,
                    isLunas: Boolean(item.is_lunas),
                }));
                setWargaList(mappedData);
                localStorage.setItem('sigap_warga_balong_data', JSON.stringify(mappedData));
            }
        } catch (err) {
            console.error('Terjadi kesalahan:', err);
            const saved = localStorage.getItem('sigap_warga_balong_data');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed && parsed.length > 0) setWargaList(parsed);
                } catch (e) {}
            }
        } finally {
            setIsLoaded(true);
        }
    };

    useEffect(() => {
        fetchWargaFromSupabase();
    }, []);

    const handleBatalBayar = async (idPelanggan: string) => {
        // Update state lokal
        setWargaList((prevData) =>
            prevData.map((item) =>
                item.idPelanggan === idPelanggan ? { ...item, isLunas: false } : item
            )
        );

        // Update ke Supabase
        await supabase
            .from('pelanggan')
            .update({ is_lunas: false })
            .eq('id_pelanggan', idPelanggan);
    };

    const handleBayar = async (idPelanggan: string) => {
        // Update state lokal
        setWargaList((prevData) =>
            prevData.map((item) =>
                item.idPelanggan === idPelanggan ? { ...item, isLunas: true } : item
            )
        );

        // Update ke Supabase
        await supabase
            .from('pelanggan')
            .update({ is_lunas: true })
            .eq('id_pelanggan', idPelanggan);
    };

    const handleSyncSingleWarga = async (idPelanggan: string) => {
        setLoadingSingleId(idPelanggan);
        try {
            const cleanId = idPelanggan.replace(/\D/g, '');
            const res = await fetch('/api/pln/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPelanggan: cleanId })
            });

            const data = await res.json();

            if (data.status === 'BELUM_LUNAS') {
                // Update state lokal & Supabase
                setWargaList((prev) =>
                    prev.map((item) =>
                        item.idPelanggan === idPelanggan
                            ? {
                                ...item,
                                tagihanPln: data.tagihanPln,
                                admin: data.adminDesa || item.admin,
                                isLunas: false
                            }
                            : item
                    )
                );

                const targetAdmin = data.adminDesa || 6000;
                await supabase
                    .from('pelanggan')
                    .update({ 
                        tagihan_pln: data.tagihanPln, 
                        admin: targetAdmin, 
                        is_lunas: false 
                    })
                    .eq('id_pelanggan', idPelanggan);

                alert(`📋 Info Tagihan (Belum Bayar):\nID: ${cleanId}\nNama: ${data.namaPelanggan}\nNominal Tagihan PLN: Rp ${data.tagihanPln.toLocaleString('id-ID')}\nAdmin Desa: Rp ${data.adminDesa.toLocaleString('id-ID')}\nTotal: Rp ${data.totalTagihan.toLocaleString('id-ID')}`);
            } else if (data.status === 'LUNAS') {
                // Update state lokal & Supabase
                setWargaList((prev) =>
                    prev.map((item) =>
                        item.idPelanggan === idPelanggan
                            ? {
                                ...item,
                                tagihanPln: 0,
                                isLunas: true
                            }
                            : item
                    )
                );

                await supabase
                    .from('pelanggan')
                    .update({ tagihan_pln: 0, is_lunas: true })
                    .eq('id_pelanggan', idPelanggan);

                alert(`✅ Tagihan Lunas:\n${data.message || `ID ${cleanId} sudah tidak memiliki tagihan (LUNAS).`}`);
            } else if (data.status === 'INVALID_ID') {
                alert(`⚠️ ID Pelanggan Tidak Ditemukan (404):\n${data.message}`);
            } else {
                alert(`❌ Gagal Mengambil Data (500):\n${data.message || 'Terjadi kesalahan sistem/koneksi saat menghubungi PLN.'}`);
            }
        } catch (error) {
            alert('⚠️ Terjadi kesalahan jaringan saat terhubung ke server PLN.');
        } finally {
            setLoadingSingleId(null);
        }
    };

    const [lastSyncTime, setLastSyncTime] = useState<string>("02 Agu 2026, 14:00");

    const syncSemuaTagihanOtomatis = async () => {
        if (!wargaList.length) return;

        setIsSyncing(true);
        setSyncProgress(0);

        const updatedList = [...wargaList];

        for (let i = 0; i < updatedList.length; i++) {
            try {
                const cleanId = updatedList[i].idPelanggan.replace(/\D/g, '');
                const res = await fetch('/api/pln/inquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idPelanggan: cleanId })
                });

                const data = await res.json();
                if (data.status === 'BELUM_LUNAS') {
                    updatedList[i].tagihanPln = data.tagihanPln;
                    if (data.adminDesa) {
                        updatedList[i].admin = data.adminDesa;
                    }
                    updatedList[i].isLunas = false;
                    await supabase
                        .from('pelanggan')
                        .update({ 
                            tagihan_pln: data.tagihanPln, 
                            admin: data.adminDesa || updatedList[i].admin, 
                            is_lunas: false 
                        })
                        .eq('id_pelanggan', updatedList[i].idPelanggan);
                } else if (data.status === 'LUNAS') {
                    updatedList[i].tagihanPln = 0;
                    updatedList[i].isLunas = true;
                    await supabase
                        .from('pelanggan')
                        .update({ tagihan_pln: 0, is_lunas: true })
                        .eq('id_pelanggan', updatedList[i].idPelanggan);
                }
            } catch (err) {
                console.error(`Gagal sync IDPEL ${updatedList[i].idPelanggan}:`, err);
            }

            setSyncProgress(Math.round(((i + 1) / updatedList.length) * 100));
        }

        setWargaList(updatedList);
        setIsSyncing(false);

        const now = new Date();
        const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        setLastSyncTime(`${dateStr}, ${timeStr}`);
    };

    const handleAddWarga = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formNama || !formIdPelanggan) return;

        // Hapus properti id agar Supabase yang mengisinya secara otomatis (autoincrement)
        const newWargaData = {
            nama: formNama.toUpperCase(),
            rt: formRt,
            id_pelanggan: formIdPelanggan,
            tagihan_pln: Number(formTagihanPln) || 0,
            admin: Number(formAdmin) || 6000,
            is_lunas: false,
        };

        // Simpan ke Supabase
        const { error } = await supabase.from('pelanggan').insert([newWargaData]);

        if (error) {
            alert('Gagal menambah warga: ' + error.message);
            return;
        }

        // Segarkan data dari Supabase
        fetchWargaFromSupabase();

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
                                <span>⚡ Sedang Sinkronisasi Tagihan PLN (Cloud)...</span>
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
                    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">TOTAL WARGA TERDAFTAR (CLOUD)</span>
                        </div>
                        <div className="flex items-baseline justify-between mb-2">
                            <span className="text-3xl font-extrabold text-[#1B4332] tracking-tight">{totalKK}</span>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded-full">
                                <span className="material-symbols-outlined text-xs">cloud_done</span> Terhubung
                            </span>
                        </div>
                        <div className="pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 font-medium">
                            RT 04: {countRt04} | RT 05: {countRt05} | RT 06: {countRt06}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <span className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">STATUS SYNC TAGIHAN</span>
                        <div className="flex items-center justify-between">
                            <div className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-xs font-semibold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Sinkron Supabase
                            </div>
                            <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">schedule</span>
                                Terakhir: {lastSyncTime}
                            </span>
                        </div>
                    </div>

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
                        Tarik Tagihan ke Cloud
                    </button>

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

                {/* Warga List Section */}
                <div className="px-5 space-y-3 pb-12">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Daftar Warga ({filteredWarga.length})</span>
                        <button onClick={() => setIsModalOpen(true)} className="text-xs text-[#1B4332] font-bold hover:underline cursor-pointer">
                            + Tambah Warga
                        </button>
                    </div>

                    {!isLoaded ? (
                        <div className="p-8 text-center text-xs text-zinc-400">Memuat data dari database Supabase...</div>
                    ) : filteredWarga.length === 0 ? (
                        <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-400 text-xs font-medium">
                            Data warga tidak ditemukan.
                        </div>
                    ) : (
                        filteredWarga.map((item, idx) => {
                            const initials = item.nama ? item.nama.split(' ').slice(0, 2).map((n) => n[0]).join('') : 'W';
                            const total = item.tagihanPln + item.admin;

                            return (
                                <div key={item.idPelanggan || idx} className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3 hover:border-[#1B4332]/30 transition-all">
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

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleSyncSingleWarga(item.idPelanggan)}
                                                disabled={loadingSingleId === item.idPelanggan || isSyncing}
                                                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                                title="Cek Status Tagihan PLN"
                                            >
                                                <span className={`material-symbols-outlined text-xs ${loadingSingleId === item.idPelanggan ? 'animate-spin' : ''}`}>
                                                    {loadingSingleId === item.idPelanggan ? 'progress_activity' : 'refresh'}
                                                </span>
                                                <span className="text-[10px]">Cek PLN</span>
                                            </button>

                                            {item.isLunas ? (
                                                <button
                                                    onClick={() => handleBatalBayar(item.idPelanggan)}
                                                    className="bg-zinc-100 border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-zinc-200 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                                                    title="Batalkan Pembayaran"
                                                >
                                                    <span className="material-symbols-outlined text-xs">undo</span>
                                                    Batal
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBayar(item.idPelanggan)}
                                                    className="bg-[#1B4332] text-white px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-[#1B4332]/90 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
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
                            <h3 className="text-sm font-bold text-[#1B4332]">Tambah Data Warga (Cloud)</h3>
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
                                <button type="submit" className="bg-[#1B4332] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-95 transition-all shadow-sm cursor-pointer">Simpan ke Cloud</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}