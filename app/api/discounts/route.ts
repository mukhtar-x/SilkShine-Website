import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import DiscountEvent from '@/lib/models/DiscountEvent';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get('activeOnly') === 'true';

        await connectDB();

        if (activeOnly) {
            const activeEvent = await DiscountEvent.findOne({ isActive: true }).sort({ updatedAt: -1 }).lean();
            return NextResponse.json(activeEvent || null);
        }

        const events = await DiscountEvent.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(events);
    } catch (error) {
        console.error('[API] GET /api/discounts error:', error);
        return NextResponse.json({ error: 'Failed to fetch discount events' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, code, discountPercentage, isActive, applicableProducts } = body;

        if (!title || !code || discountPercentage == null) {
            return NextResponse.json({ error: 'Title, code, and discount percentage are required' }, { status: 400 });
        }

        const pct = Number(discountPercentage);
        if (isNaN(pct) || pct < 0 || pct > 100) {
            return NextResponse.json({ error: 'Discount percentage must be between 0 and 100' }, { status: 400 });
        }

        await connectDB();

        // If setting this to active, optionally deactivate other events if single active event preferred
        if (isActive) {
            await DiscountEvent.updateMany({}, { isActive: false });
        }

        const created = await DiscountEvent.create({
            title: String(title).trim(),
            code: String(code).trim().toUpperCase(),
            discountPercentage: pct,
            isActive: Boolean(isActive ?? true),
            applicableProducts: Array.isArray(applicableProducts) ? applicableProducts.map(Number).filter((n) => !isNaN(n)) : [],
        });

        return NextResponse.json({ success: true, discountEvent: created }, { status: 201 });
    } catch (error) {
        console.error('[API] POST /api/discounts error:', error);
        return NextResponse.json({ error: 'Failed to create discount event' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { _id, title, code, discountPercentage, isActive, applicableProducts } = body;

        if (!_id) {
            return NextResponse.json({ error: '_id is required' }, { status: 400 });
        }

        await connectDB();

        if (isActive) {
            await DiscountEvent.updateMany({ _id: { $ne: _id } }, { isActive: false });
        }

        const updateData: Record<string, any> = {};
        if (title !== undefined) updateData.title = String(title).trim();
        if (code !== undefined) updateData.code = String(code).trim().toUpperCase();
        if (discountPercentage !== undefined) updateData.discountPercentage = Number(discountPercentage);
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);
        if (applicableProducts !== undefined) {
            updateData.applicableProducts = Array.isArray(applicableProducts)
                ? applicableProducts.map(Number).filter((n) => !isNaN(n))
                : [];
        }

        const updated = await DiscountEvent.findByIdAndUpdate(_id, updateData, { new: true }).lean();
        if (!updated) {
            return NextResponse.json({ error: 'Discount event not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, discountEvent: updated });
    } catch (error) {
        console.error('[API] PUT /api/discounts error:', error);
        return NextResponse.json({ error: 'Failed to update discount event' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { _id } = body;

        if (!_id) {
            return NextResponse.json({ error: '_id is required' }, { status: 400 });
        }

        await connectDB();
        const deleted = await DiscountEvent.findByIdAndDelete(_id).lean();
        if (!deleted) {
            return NextResponse.json({ error: 'Discount event not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API] DELETE /api/discounts error:', error);
        return NextResponse.json({ error: 'Failed to delete discount event' }, { status: 500 });
    }
}
