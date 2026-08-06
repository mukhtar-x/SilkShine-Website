import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

const computeStatus = (stock: number) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
};

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ id: 1 }).lean();
        return NextResponse.json(
            products.map(p => ({
                id: `PROD-${String(p.id).padStart(2, '0')}`,
                numericId: p.id,
                name: p.name,
                type: p.type,
                size: p.sizes?.[0] ?? '',
                sizes: p.sizes ?? [],
                price: p.price,
                oldPrice: p.oldPrice ?? 0,
                stock: p.stock,
                status: p.status,
                description: p.description ?? '',
                category: p.category ?? 'Hair Care',
                image: p.image ?? '',
                images: p.images ?? [],
                features: p.features ?? [],
                rating: p.rating ?? 0,
                reviews: p.reviews ?? 0,
                reviewsList: p.reviewsList ?? [],
                _id: p._id,
            }))
        );
    } catch (error) {
        console.error('[API] GET /api/admin/products error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            description,
            price,
            oldPrice,
            stock,
            category,
            type,
            sizes,
            image,
            images,
            features,
            rating,
            reviews,
        } = body;

        if (!name || price == null || stock == null) {
            return NextResponse.json({ error: 'Name, price, and stock are required' }, { status: 400 });
        }

        await connectDB();
        const lastProduct = await Product.findOne({}).sort({ id: -1 }).lean();
        const nextId = lastProduct ? lastProduct.id + 1 : 1;

        const parseSizes = (val: any): string[] => {
            if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
            if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
            return ['Standard'];
        };

        const parseFeatures = (val: any): string[] => {
            if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
            if (typeof val === 'string') return val.split('\n').map(s => s.trim()).filter(Boolean);
            return [];
        };

        const parseImages = (val: any): string[] => {
            if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
            if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };

        const created = await Product.create({
            id: nextId,
            name: String(name).trim(),
            description: String(description || '').trim(),
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : 0,
            stock: Number(stock),
            category: String(category || 'Hair Care').trim(),
            type: String(type || 'Standard').trim(),
            sizes: parseSizes(sizes),
            image: String(image || '/assets/bottle-shot.png').trim(),
            images: parseImages(images),
            features: parseFeatures(features),
            rating: Number(rating ?? 0),
            reviews: Number(reviews ?? 0),
            status: computeStatus(Number(stock)),
        });

        return NextResponse.json({ success: true, product: created }, { status: 201 });
    } catch (error) {
        console.error('[API] POST /api/admin/products error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { _id, name, description, price, oldPrice, stock, category, type, sizes, image, images, features, rating, reviews } = body;

        if (!_id) {
            return NextResponse.json({ error: 'Product _id is required' }, { status: 400 });
        }

        await connectDB();

        const parseSizes = (val: any): string[] => {
            if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
            if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
            return ['Standard'];
        };

        const parseFeatures = (val: any): string[] => {
            if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
            if (typeof val === 'string') return val.split('\n').map(s => s.trim()).filter(Boolean);
            return [];
        };

        const parseImages = (val: any): string[] => {
            if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
            if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };

        const updateData: Record<string, any> = {};
        if (name !== undefined) updateData.name = String(name).trim();
        if (description !== undefined) updateData.description = String(description).trim();
        if (price !== undefined) updateData.price = Number(price);
        if (oldPrice !== undefined) updateData.oldPrice = Number(oldPrice);
        if (stock !== undefined) {
            updateData.stock = Number(stock);
            updateData.status = computeStatus(Number(stock));
        }
        if (category !== undefined) updateData.category = String(category).trim();
        if (type !== undefined) updateData.type = String(type).trim();
        if (sizes !== undefined) updateData.sizes = parseSizes(sizes);
        if (image !== undefined) updateData.image = String(image).trim();
        if (images !== undefined) updateData.images = parseImages(images);
        if (features !== undefined) updateData.features = parseFeatures(features);
        if (rating !== undefined) updateData.rating = Number(rating);
        if (reviews !== undefined) updateData.reviews = Number(reviews);

        const updated = await Product.findByIdAndUpdate(
            _id,
            updateData,
            { new: true }
        ).lean();

        if (!updated) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updated });
    } catch (error) {
        console.error('[API] PUT /api/admin/products error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { _id } = body;

        if (!_id) {
            return NextResponse.json({ error: 'Product _id is required' }, { status: 400 });
        }

        await connectDB();
        const deleted = await Product.findByIdAndDelete(_id).lean();
        if (!deleted) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API] DELETE /api/admin/products error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
