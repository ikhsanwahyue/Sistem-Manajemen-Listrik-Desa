import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIGAP Listrik Balong',
  description: 'Sistem Manajemen Listrik Desa Balong',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {/* Tambahkan baris link di bawah ini agar ikon Material Symbols berfungsi */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}