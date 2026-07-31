import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ id: 1 }).lean();
        return NextResponse.json(products);
    } catch (error) {
        console.error('[API] GET /api/products error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
