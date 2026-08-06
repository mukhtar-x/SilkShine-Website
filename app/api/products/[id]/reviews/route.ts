import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { user, rating, comment } = body;

        if (!user || rating == null || !comment) {
            return NextResponse.json({ error: 'Name, rating, and comment are required' }, { status: 400 });
        }

        const numRating = Number(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
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

        const newReview = {
            user: String(user).trim(),
            rating: numRating,
            comment: String(comment).trim(),
            date: new Date(),
        };

        if (!product.reviewsList) {
            product.reviewsList = [];
        }

        product.reviewsList.push(newReview as any);

        // Recalculate average rating & review count
        const totalReviews = product.reviewsList.length;
        const sumRatings = product.reviewsList.reduce((acc, r) => acc + (r.rating || 0), 0);
        const avgRating = Number((sumRatings / totalReviews).toFixed(1));

        product.rating = avgRating;
        product.reviews = totalReviews;

        await product.save();

        return NextResponse.json({
            success: true,
            product,
            review: product.reviewsList[product.reviewsList.length - 1],
        }, { status: 201 });
    } catch (error) {
        console.error('[API] POST /api/products/[id]/reviews error:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}
