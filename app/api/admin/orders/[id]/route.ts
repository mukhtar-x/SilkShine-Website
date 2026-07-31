import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';

const VALID_STATUSES = ['Pending', 'Processing', 'Out for Delivery', 'Completed', 'Cancelled'];

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status } = body;

        if (!VALID_STATUSES.includes(status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        await connectDB();

        // id can be MongoDB _id or orderId string like "#ORD-001"
        const filter = id.startsWith('#')
            ? { orderId: id }
            : { _id: id };

        const updated = await Order.findOneAndUpdate(
            filter,
            { status },
            { new: true }
        ).lean();

        if (!updated) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, status: updated.status });
    } catch (error) {
        console.error('[API] PATCH /api/admin/orders/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}
