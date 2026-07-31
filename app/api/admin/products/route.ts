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
                name: p.name,
                type: p.type,
                size: p.sizes[0] ?? '',
                price: p.price.toLocaleString(),
                stock: p.stock,
                status: p.status,
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
            stock,
            category,
            type,
            sizes,
            image,
            rating,
            reviews,
        } = body;

        if (!name || price == null || stock == null) {
            return NextResponse.json({ error: 'Name, price, and stock are required' }, { status: 400 });
        }

        await connectDB();
        const lastProduct = await Product.findOne({}).sort({ id: -1 }).lean();
        const nextId = lastProduct ? lastProduct.id + 1 : 1;

        const created = await Product.create({
            id: nextId,
            name,
            description: description || '',
            price: Number(price),
            stock: Number(stock),
            category: category || 'Hair Care',
            type: type || 'Standard',
            sizes: Array.isArray(sizes) ? sizes : [String(sizes || 'Standard')],
            image: image || '/assets/bottle-shot.png',
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
        const { _id, name, description, price, stock, category, type, sizes, image, rating, reviews } = body;

        if (!_id) {
            return NextResponse.json({ error: 'Product _id is required' }, { status: 400 });
        }

        await connectDB();

        const updated = await Product.findByIdAndUpdate(
            _id,
            {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(price !== undefined && { price: Number(price) }),
                ...(stock !== undefined && { stock: Number(stock), status: computeStatus(Number(stock)) }),
                ...(category !== undefined && { category }),
                ...(type !== undefined && { type }),
                ...(sizes !== undefined && { sizes: Array.isArray(sizes) ? sizes : String(sizes).split(',').map((size) => size.trim()).filter(Boolean) }),
                ...(image !== undefined && { image }),
                ...(rating !== undefined && { rating: Number(rating) }),
                ...(reviews !== undefined && { reviews: Number(reviews) }),
            },
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
