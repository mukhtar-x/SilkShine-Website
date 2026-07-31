import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Review from '@/lib/models/Review';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        await connectDB();

        const query: Record<string, unknown> = {};
        if (productId) {
            query.productId = parseInt(productId, 10);
        } else {
            // Default: return homepage testimonials
            query.isHomepage = true;
        }

        const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('[API] GET /api/reviews error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
