import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface InquiryRequest {
    idPelanggan: string;
}

export async function POST(request: Request) {
    try {
        const body: InquiryRequest = await request.json();
        const { idPelanggan } = body;

        if (!idPelanggan) {
            return NextResponse.json(
                { success: false, message: 'ID Pelanggan wajib diisi' },
                { status: 400 }
            );
        }

        // 1. Bersihkan ID Pelanggan dari spasi/titik (cth: 521.030.321.864 -> 521030321864)
        const cleanIdPel = idPelanggan.replace(/[^0-9]/g, '');

        const username = process.env.PPOB_USERNAME || '';
        const apiKey = process.env.PPOB_API_KEY || '';
        const env = process.env.PPOB_ENV || 'development';
        const adminDesa = Number(process.env.NEXT_PUBLIC_ADMIN_DESA || 6000);

        // Jika API Key belum diset di .env.local, gunakan Mode Simulasi cerdas
        if (!username || !apiKey) {
            console.log('⚠️ [SIGAP] Kredensial PPOB tidak ditemukan di .env.local. Menggunakan Mode Simulasi.');

            // Hitung tagihan simulasi konsisten berbasis ID Pelanggan
            const pseudoRandom = (parseInt(cleanIdPel.slice(-5)) * 123) % 180000 + 35000;
            const tagihanPlnSimulasi = Math.round(pseudoRandom / 100) * 100;

            return NextResponse.json({
                success: true,
                idPelanggan: cleanIdPel,
                namaPelanggan: `PLN - ${cleanIdPel.slice(-4)}`,
                periode: 'AGUSTUS 2026',
                tagihanPln: tagihanPlnSimulasi,
                adminDesa: adminDesa,
                totalTagihan: tagihanPlnSimulasi + adminDesa,
                isSimulasi: true,
                message: 'Berhasil (Mode Simulasi)'
            });
        }

        const refId = `SIGAP-${Date.now()}-${cleanIdPel.slice(-4)}`;

        const signature = crypto
            .createHash('md5')
            .update(username + apiKey + refId)
            .digest('hex');

        const endpoint = env === 'production'
            ? 'https://api.iak.id/api/v1/bill/check'
            : 'https://testpostpaid.mobilepulsa.net/api/v1/bill/check';

        const payload = {
            commands: 'inq-pasca',
            username: username,
            code: 'PLNPOSTPAID',
            hp: cleanIdPel,
            ref_id: refId,
            sign: signature
        };

        const ppobRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const ppobData = await ppobRes.json();

        if (ppobData?.data?.response_code === '00') {
            const nominalPln = Number(ppobData.data.nominal || 0);
            const namaPel = ppobData.data.tr_name || 'PELANGGAN PLN';
            const periode = ppobData.data.period || 'AGUSTUS 2026';

            return NextResponse.json({
                success: true,
                idPelanggan: cleanIdPel,
                namaPelanggan: namaPel,
                periode: periode,
                tagihanPln: nominalPln,
                adminDesa: adminDesa,
                totalTagihan: nominalPln + adminDesa,
                isSimulasi: false,
                message: 'Tagihan PLN berhasil diambil'
            });
        } else {
            return NextResponse.json({
                success: false,
                message: ppobData?.data?.message || 'Gagal mengambil data PLN / ID Pelanggan tidak ditemukan'
            }, { status: 400 });
        }

    } catch (error) {
        console.error('Error PLN Inquiry API:', error);
        return NextResponse.json(
            { success: false, message: 'Gagal terhubung ke server PLN/PPOB' },
            { status: 500 }
        );
    }
}