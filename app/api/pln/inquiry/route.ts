import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface InquiryRequest {
    idPelanggan: string;
}

export async function POST(request: Request) {
    let browser = null;

    try {
        const body: InquiryRequest = await request.json();
        const { idPelanggan } = body;

        // -------------------------------------------------------------
        // 1. VALIDASI INPUT ID PELANGGAN
        // -------------------------------------------------------------
        if (!idPelanggan) {
            return NextResponse.json(
                { success: false, status: 'ERROR', message: 'ID Pelanggan wajib diisi.' },
                { status: 400 }
            );
        }

        const cleanIdPel = idPelanggan.replace(/[^0-9]/g, '');

        if (cleanIdPel.length < 11 || cleanIdPel.length > 12) {
            return NextResponse.json(
                { success: false, status: 'INVALID_ID', message: 'Format ID Pelanggan PLN harus 11-12 digit.' },
                { status: 400 }
            );
        }

        const adminDesa = Number(process.env.NEXT_PUBLIC_ADMIN_DESA || 6000);
        console.log(`🤖 [SIGAP Scraper] Memulai cek tagihan Sepulsa untuk ID: ${cleanIdPel}`);

        // -------------------------------------------------------------
        // 2. JALANKAN PUPPETEER
        // -------------------------------------------------------------
        browser = await puppeteer.launch({
            headless: true,
            channel: 'chrome', // Menggunakan Chrome lokal Windows
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        // Buka halaman Sepulsa PLN Postpaid
        await page.goto('https://www.sepulsa.com/transaction/pln?type=postpaid', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // -------------------------------------------------------------
        // 3. INPUT ID PELANGGAN & SUBMIT
        // -------------------------------------------------------------
        const inputSelector = 'input[type="tel"], input[type="text"], input[placeholder*="1234xxx"]';
        await page.waitForSelector(inputSelector, { timeout: 10000 });

        await page.focus(inputSelector);
        await page.type(inputSelector, cleanIdPel, { delay: 50 });

        const buttonSelector = 'button, input[type="submit"]';
        await page.waitForSelector(buttonSelector);

        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const submitBtn = buttons.find(b => b.innerText.includes('Lanjutkan') && !b.disabled);
            if (submitBtn) submitBtn.click();
        });

        // Tunggu respon AJAX
        await new Promise(r => setTimeout(r, 3500));

        // Ambil seluruh teks hasil render halaman
        const rawText = await page.evaluate(() => document.body.innerText);
        const lowerText = rawText.toLowerCase();

        await browser.close();
        browser = null;

        // -------------------------------------------------------------
        // 4. VALIDASI RESPONS DARI HALAMAN
        // -------------------------------------------------------------

        // A. CEK JIKA ID PELANGGAN TIDAK DITEMUKAN / SALAH
        const isInvalidId =
            lowerText.includes('tidak ditemukan') ||
            lowerText.includes('id pelanggan salah') ||
            lowerText.includes('nomor tidak valid') ||
            lowerText.includes('periksa kembali');

        if (isInvalidId) {
            return NextResponse.json({
                success: false,
                status: 'INVALID_ID',
                message: `ID Pelanggan ${cleanIdPel} tidak ditemukan di sistem PLN.`
            }, { status: 404 });
        }

        // B. CEK JIKA TAGIHAN SUDAH LUNAS / NIHIL
        const isLunas =
            lowerText.includes('lunas') ||
            lowerText.includes('tidak ada tagihan') ||
            lowerText.includes('sudah dibayar') ||
            lowerText.includes('tagihan nihil');

        // Extract Angka Nominal
        const rpMatch = rawText.match(/Rp\s?([\d.,]+)/i);
        let tagihanPln = 0;

        if (rpMatch && rpMatch[1]) {
            tagihanPln = parseInt(rpMatch[1].replace(/[^0-9]/g, ''), 10);
        }

        if (isLunas || tagihanPln === 0) {
            return NextResponse.json({
                success: true,
                status: 'LUNAS',
                idPelanggan: cleanIdPel,
                tagihanPln: 0,
                adminDesa: 0,
                totalTagihan: 0,
                message: `Tagihan PLN untuk ID ${cleanIdPel} SUDAH LUNAS / Tidak ada tunggakan.`
            }, { status: 200 });
        }

        // C. KONDISI BELUM LUNAS (BERHASIL AMBIL TAGIHAN)
        const namaMatch = rawText.match(/Nama\s*:\s*([^\n]+)/i) || rawText.match(/Nama Pelanggan\s*:\s*([^\n]+)/i);
        const namaPelanggan = namaMatch ? namaMatch[1].trim() : `PLN - ${cleanIdPel.slice(-4)}`;

        return NextResponse.json({
            success: true,
            status: 'BELUM_LUNAS',
            idPelanggan: cleanIdPel,
            namaPelanggan: namaPelanggan,
            periode: 'Bulan Ini',
            tagihanPln: tagihanPln,
            adminDesa: adminDesa,
            totalTagihan: tagihanPln + adminDesa,
            message: 'Data tagihan berhasil didapatkan.'
        }, { status: 200 });

    } catch (error: any) {
        // Tutup browser jika masih terbuka saat error
        if (browser) await browser.close();

        console.error('⚠️ [SIGAP Scraper Error]:', error.message);

        // -------------------------------------------------------------
        // 5. ERROR HANDLING (Gagal koneksi/Timeout/Kena Block)
        // -------------------------------------------------------------
        let errorMessage = 'Gagal melakukan pengambilan data dari server.';

        if (error.message.includes('timeout')) {
            errorMessage = 'Koneksi ke server PLN/Sepulsa mengalami timeout. Silakan coba lagi.';
        } else if (error.message.includes('Navigation failed')) {
            errorMessage = 'Tidak dapat terhubung ke situs pembanding tagihan.';
        }

        return NextResponse.json({
            success: false,
            status: 'ERROR',
            message: errorMessage,
            errorDetail: error.message
        }, { status: 500 });
    }
}