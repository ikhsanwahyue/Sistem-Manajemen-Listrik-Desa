'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ================= FUNGSI LOGIN =================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Akun Default Demo
    const DEFAULT_USER = 'AdminListrik';
    const DEFAULT_PASS = 'SatriaBalong2026';

    // Validasi Cek Akun
    if (username !== DEFAULT_USER || password !== DEFAULT_PASS) {
      setErrorMsg('Username atau Kata Sandi salah!');
      return;
    }

    // Login Sukses
    localStorage.setItem('sigap_user', JSON.stringify({ username, role: 'Pengurus' }));
    localStorage.setItem('sigap_is_auth', 'true');

    // Navigasi Otomatis ke Dashboard (/dashboard)
    router.push('/dashboard');
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 text-on-background relative overflow-hidden bg-background"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='%231B4332' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      {/* Container Utama */}
      <div className="w-full max-w-md z-10">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container text-on-primary mb-3 shadow-md">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">
            SIGAP Listrik Balong
          </h1>
          <p className="text-sm text-on-surface-variant">Sistem Administrasi Listrik Desa</p>
        </div>

        {/* Card Form Login */}
        <div className="bg-surface-container-lowest rounded-xl shadow-lg p-6 md:p-8 relative border-t-4 border-[#D4AF37]">

          {/* Pesan Error jika salah password */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-error-container text-on-error-container text-xs font-semibold text-center border border-error/20">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Username */}
            <div>
              <label className="block text-xs text-on-surface-variant mb-2 font-semibold" htmlFor="username">
                Username / ID Petugas
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-outline material-symbols-outlined text-xl">
                  badge
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan ID"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded text-sm text-on-surface focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs text-on-surface-variant font-semibold" htmlFor="password">
                  Kata Sandi
                </label>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('Hubungi admin Karang Taruna.'); }}
                  className="text-xs text-primary hover:underline transition-colors font-medium"
                >
                  Lupa Kata Sandi?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-outline material-symbols-outlined text-xl">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded text-sm text-on-surface focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-outline hover:text-on-surface transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              className="w-full bg-[#1B4332] text-white py-3 px-4 rounded-lg font-bold text-base shadow-md hover:opacity-95 active:scale-[0.99] transition-all mt-2 flex justify-center items-center gap-2"
            >
              Masuk ke Dashboard
              <span className="material-symbols-outlined text-xl">login</span>
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 z-10 text-center w-full max-w-md">
        <div className="border-t border-outline-variant/20 pt-4 flex flex-col gap-1 items-center">
          <span className="text-xs text-on-surface-variant font-bold">
            Karang Taruna Desa Balong
          </span>
          <span className="text-xs text-outline-variant italic">
            Khusus akses pengurus internal
          </span>
        </div>
      </div>
    </main>
  );
}