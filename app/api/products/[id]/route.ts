import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
        }
        await connectDB();
        const product = await Product.findOne({ id: numericId }).lean();
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error('[API] GET /api/products/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}
