import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const reviewId = searchParams.get('reviewId');

        if (!reviewId) {
            return NextResponse.json({ error: 'reviewId is required' }, { status: 400 });
        }

        await connectDB();

        let product = null;
        const cleanIdStr = id.replace(/^PROD-/i, '');
        const numericId = parseInt(cleanIdStr, 10);

        if (!isNaN(numericId)) {
            product = await Product.findOne({ id: numericId });
        }
        if (!product && mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id);
        }

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.reviewsList && product.reviewsList.length > 0) {
            product.reviewsList = product.reviewsList.filter(
                (r: any) => String(r._id) !== String(reviewId)
            );

            const totalReviews = product.reviewsList.length;
            const sumRatings = product.reviewsList.reduce((acc: number, r: any) => acc + (r.rating || 0), 0);
            const avgRating = totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 0;

            product.rating = avgRating;
            product.reviews = totalReviews;

            await product.save();
        }

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error('[API] DELETE /api/admin/products/[id]/reviews error:', error);
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
