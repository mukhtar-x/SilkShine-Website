import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        await connectDB();

        let product = null;

        // Try numeric ID lookup (e.g. 1 or "PROD-01")
        const cleanIdStr = id.replace(/^PROD-/i, '');
        const numericId = parseInt(cleanIdStr, 10);

        if (!isNaN(numericId)) {
            product = await Product.findOne({ id: numericId }).lean();
        }

        // Fallback to ObjectId lookup if not found
        if (!product && mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id).lean();
        }

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('[API] GET /api/products/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}
