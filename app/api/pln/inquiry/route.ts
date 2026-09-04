import { NextResponse } from 'next/server';
import crypto from 'crypto';
import puppeteer from 'puppeteer';

interface InquiryRequest {
    idPelanggan: string;
}

// --------------------------------------------------------------------------
// 1. HELPER: INQUIRY VIA RESMI DIGIFLAZZ (PPOB AGGREGATOR RESMI PLN)
// --------------------------------------------------------------------------
async function inquiryDigiflazz(cleanIdPel: string, adminDesa: number) {
    const username = process.env.DIGIFLAZZ_USERNAME;
    const apiKey = process.env.DIGIFLAZZ_KEY;

    // Cek jika kredensial Digiflazz sudah disetel dan bukan placeholder
    if (!username || !apiKey || username.includes('anda') || apiKey.includes('anda')) {
        return null; // Digiflazz belum dikonfigurasi, beralih ke fallback
    }

    const refId = `INQ-${Date.now()}-${cleanIdPel}`;
    const sign = crypto
        .createHash('md5')
        .update(`${username}${apiKey}${refId}`)
        .digest('hex');

    const payload = {
        commands: 'inq-pasca',
        username: username,
        buyer_sku_code: 'PLNPOSTPAID',
        customer_no: cleanIdPel,
        ref_id: refId,
        sign: sign
    };

    console.log(`🔌 [Digiflazz] Mengirim inquiry resmi untuk ID: ${cleanIdPel}`);

    const res = await fetch('https://api.digiflazz.com/v1/transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000)
    });

    const result = await res.json();
    console.log(`📡 [Digiflazz Response]:`, JSON.stringify(result));

    if (result && result.data) {
        const d = result.data;
        const msg = (d.message || '').toLowerCase();
        const rc = d.rc;

        // Tagihan Sudah Lunas / Nihil
        if (
            rc === '01' || 
            rc === '40' ||
            msg.includes('lunas') || 
            msg.includes('tidak ada tagihan') ||
            msg.includes('nihil')
        ) {
            return {
                success: true,
                status: 'LUNAS',
                idPelanggan: cleanIdPel,
                namaPelanggan: d.customer_name || `PLN - ${cleanIdPel.slice(-4)}`,
                tagihanPln: 0,
                adminDesa: 0,
                totalTagihan: 0,
                provider: 'DIGIFLAZZ_OFFICIAL',
                message: `Tagihan PLN untuk ID ${cleanIdPel} SUDAH LUNAS / Tidak ada tunggakan.`
            };
        }

        // ID Pelanggan Tidak Ditemukan / Salah
        if (
            rc === '02' || 
            msg.includes('tidak terdaftar') || 
            msg.includes('salah') || 
            msg.includes('tidak valid') || 
            msg.includes('format')
        ) {
            return {
                success: false,
                status: 'INVALID_ID',
                idPelanggan: cleanIdPel,
                provider: 'DIGIFLAZZ_OFFICIAL',
                message: `ID Pelanggan ${cleanIdPel} tidak ditemukan di sistem PLN.`
            };
        }

        // Sukses Ambil Tagihan Asli
        if (rc === '00' || d.status === 'Sukses' || Number(d.price) > 0) {
            const tagihanAsliPln = Number(d.price) || 0;
            const namaWarga = d.customer_name || `PLN - ${cleanIdPel.slice(-4)}`;
            const tarifDaya = d.desc?.tarif ? `${d.desc.tarif} / ${d.desc?.daya || ''}VA` : undefined;
            const lembarTagihan = d.desc?.lembar_tagihan || 1;

            return {
                success: true,
                status: 'BELUM_LUNAS',
                idPelanggan: cleanIdPel,
                namaPelanggan: namaWarga,
                tarifDaya: tarifDaya,
                lembarTagihan: lembarTagihan,
                tagihanPln: tagihanAsliPln,
                adminDesa: adminDesa,
                totalTagihan: tagihanAsliPln + adminDesa,
                provider: 'DIGIFLAZZ_OFFICIAL',
                message: 'Data tagihan resmi PLN berhasil didapatkan.'
            };
        }
    }

    return null;
}

// --------------------------------------------------------------------------
// 2. HELPER: INQUIRY VIA ENHANCED SCRAPER (FALLBACK ENGINE)
// --------------------------------------------------------------------------
async function inquiryScraper(cleanIdPel: string, adminDesa: number) {
    let browser = null;
    try {
        console.log(`🤖 [Scraper Engine] Memulai fallback inquiry untuk ID: ${cleanIdPel}`);

        browser = await puppeteer.launch({
            headless: true,
            channel: 'chrome',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--disable-extensions'
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        );

        await page.goto('https://www.sepulsa.com/transaction/pln?type=postpaid', {
            waitUntil: 'domcontentloaded',
            timeout: 25000
        });

        const inputSelector = 'input[type="tel"], input[type="text"], input[placeholder*="1234xxx"]';
        await page.waitForSelector(inputSelector, { timeout: 10000 });

        await page.focus(inputSelector);
        await page.type(inputSelector, cleanIdPel, { delay: 30 });

        const buttonSelector = 'button, input[type="submit"]';
        await page.waitForSelector(buttonSelector);

        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const submitBtn = buttons.find(b => b.innerText.includes('Lanjutkan') && !b.disabled);
            if (submitBtn) submitBtn.click();
        });

        // Tunggu respons data tagihan muncul
        await new Promise(r => setTimeout(r, 3500));

        const scrapedData = await page.evaluate(() => {
            const bodyText = document.body.innerText || '';
            
            // Cari elemen spesifik rincian harga jika ada
            const priceElements = Array.from(document.querySelectorAll('*'))
                .filter(el => {
                    const text = el.textContent || '';
                    return (
                        (text.includes('Total') || text.includes('Tagihan') || text.includes('Jumlah')) &&
                        text.includes('Rp') &&
                        !text.includes('Diskon') &&
                        !text.includes('Hemat') &&
                        !text.includes('Promo')
                    );
                });

            return {
                fullText: bodyText,
                filteredPriceText: priceElements.map(e => e.textContent).join(' | ')
            };
        });

        await browser.close();
        browser = null;

        const rawText = scrapedData.fullText;
        const lowerText = rawText.toLowerCase();

        // A. Validasi ID Pelanggan Tidak Ditemukan
        const isInvalidId =
            lowerText.includes('tidak ditemukan') ||
            lowerText.includes('id pelanggan salah') ||
            lowerText.includes('nomor tidak valid') ||
            lowerText.includes('periksa kembali');

        if (isInvalidId) {
            return {
                success: false,
                status: 'INVALID_ID',
                idPelanggan: cleanIdPel,
                provider: 'SCRAPER_FALLBACK',
                message: `ID Pelanggan ${cleanIdPel} tidak ditemukan di sistem PLN.`
            };
        }

        // B. Validasi Tagihan Sudah Lunas
        const isLunas =
            lowerText.includes('lunas') ||
            lowerText.includes('tidak ada tagihan') ||
            lowerText.includes('sudah dibayar') ||
            lowerText.includes('tagihan nihil');

        // C. Ekstraksi Nominal Tagihan Asli (Filter ketat agar tidak salah tangkap diskon/admin)
        let tagihanPln = 0;
        
        // Pola spesifik mencari "Tagihan : Rp xxx" atau "Total Tagihan Rp xxx"
        const specificBillMatch = rawText.match(/(?:Tagihan|Total Pembayaran|Jumlah Tagihan|Total Tagihan)\s*:?\s*Rp\s?([\d.,]+)/i);
        if (specificBillMatch && specificBillMatch[1]) {
            tagihanPln = parseInt(specificBillMatch[1].replace(/[^0-9]/g, ''), 10);
        } else {
            // Fallback match regex dengan eliminasi
            const allRp = Array.from(rawText.matchAll(/Rp\s?([\d.,]+)/gi));
            for (const match of allRp) {
                const num = parseInt(match[1].replace(/[^0-9]/g, ''), 10);
                if (num >= 5000) { // Tagihan PLN pascabayar valid biasanya > Rp 5.000
                    tagihanPln = num;
                    break;
                }
            }
        }

        if (isLunas || tagihanPln === 0) {
            return {
                success: true,
                status: 'LUNAS',
                idPelanggan: cleanIdPel,
                tagihanPln: 0,
                adminDesa: 0,
                totalTagihan: 0,
                provider: 'SCRAPER_FALLBACK',
                message: `Tagihan PLN untuk ID ${cleanIdPel} SUDAH LUNAS / Tidak ada tunggakan.`
            };
        }

        // D. Ekstraksi Nama Pelanggan
        const namaMatch =
            rawText.match(/Nama\s*:\s*([^\n\r]+)/i) ||
            rawText.match(/Nama Pelanggan\s*:\s*([^\n\r]+)/i);
        const namaPelanggan = namaMatch ? namaMatch[1].trim() : `PLN - ${cleanIdPel.slice(-4)}`;

        return {
            success: true,
            status: 'BELUM_LUNAS',
            idPelanggan: cleanIdPel,
            namaPelanggan: namaPelanggan,
            tagihanPln: tagihanPln,
            adminDesa: adminDesa,
            totalTagihan: tagihanPln + adminDesa,
            provider: 'SCRAPER_FALLBACK',
            message: 'Data tagihan berhasil didapatkan.'
        };

    } catch (err: any) {
        if (browser) await (browser as any).close();
        console.error('⚠️ [Scraper Error]:', err.message);
        throw err;
    }
}

// --------------------------------------------------------------------------
// 3. MAIN ROUTE HANDLER (POST /api/pln/inquiry)
// --------------------------------------------------------------------------
export async function POST(request: Request) {
    try {
        const body: InquiryRequest = await request.json();
        const { idPelanggan } = body;

        // Validasi input
        if (!idPelanggan) {
            return NextResponse.json(
                { success: false, status: 'ERROR', message: 'ID Pelanggan wajib diisi.' },
                { status: 400 }
            );
        }

        const cleanIdPel = idPelanggan.replace(/\D/g, '');

        if (cleanIdPel.length < 11 || cleanIdPel.length > 12) {
            return NextResponse.json(
                { success: false, status: 'INVALID_ID', message: 'Format ID Pelanggan PLN harus 11-12 digit angka.' },
                { status: 400 }
            );
        }

        const adminDesa = Number(process.env.NEXT_PUBLIC_ADMIN_DESA || 6000);

        // Langkah 1: Coba inquiry via Official Digiflazz API
        try {
            const digiflazzResult = await inquiryDigiflazz(cleanIdPel, adminDesa);
            if (digiflazzResult) {
                const httpStatus = digiflazzResult.status === 'INVALID_ID' ? 404 : 200;
                return NextResponse.json(digiflazzResult, { status: httpStatus });
            }
        } catch (digiErr: any) {
            console.warn('⚠️ [Digiflazz API Error, beralih ke Fallback Scraper]:', digiErr.message);
        }

        // Langkah 2: Fallback ke Scraper Engine jika Digiflazz belum aktif / gagal
        const scraperResult = await inquiryScraper(cleanIdPel, adminDesa);
        const httpStatus = scraperResult.status === 'INVALID_ID' ? 404 : 200;
        return NextResponse.json(scraperResult, { status: httpStatus });

    } catch (error: any) {
        console.error('❌ [Critical Inquiry Error]:', error.message);

        let errorMessage = 'Gagal melakukan pengecekan tagihan dari server.';
        if (error.message && error.message.includes('timeout')) {
            errorMessage = 'Koneksi ke server PLN mengalami batas waktu (timeout). Silakan coba lagi.';
        }

        return NextResponse.json({
            success: false,
            status: 'ERROR',
            message: errorMessage,
            errorDetail: error.message
        }, { status: 500 });
    }
}