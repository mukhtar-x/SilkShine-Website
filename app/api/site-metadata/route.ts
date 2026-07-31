import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import SiteMetadata from '@/lib/models/SiteMetadata';

export async function GET() {
    try {
        await connectDB();
        const metadata = await SiteMetadata.findOne({ key: 'main' }).lean();
        if (!metadata) {
            return NextResponse.json({ error: 'Site metadata not found. Run seed script.' }, { status: 404 });
        }
        return NextResponse.json(metadata);
    } catch (error) {
        console.error('[API] GET /api/site-metadata error:', error);
        return NextResponse.json({ error: 'Failed to fetch site metadata' }, { status: 500 });
    }
}
