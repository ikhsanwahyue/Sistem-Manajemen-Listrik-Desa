import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Memastikan route tidak di-cache secara statis oleh Next.js
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        // Validasi secret jika CRON_SECRET disetel di environment
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Lakukan query ringan ke database Supabase agar status project tetap AKTIF (tidak pause)
        const { data, error } = await supabase
            .from('pelanggan')
            .select('id')
            .limit(1);

        if (error) {
            console.error('[CRON Supabase Error]:', error.message);
            return NextResponse.json({
                success: false,
                message: 'Gagal menjalankan query ke Supabase',
                error: error.message
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            status: 'ACTIVE',
            message: 'Supabase berhasil diping! Project tetap aktif dan tidak akan dipause.',
            timestamp: new Date().toISOString(),
            data
        }, { status: 200 });

    } catch (err: any) {
        console.error('[CRON Handler Error]:', err.message);
        return NextResponse.json({
            success: false,
            message: 'Terjadi kesalahan pada cron handler',
            error: err.message
        }, { status: 500 });
    }
}
