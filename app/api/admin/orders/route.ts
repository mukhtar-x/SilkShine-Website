import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';

export async function GET() {
    try {
        await connectDB();
        const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(
            orders.map(o => ({
                id: o.orderId,
                customer: o.customer,
                contact: o.contact,
                address: o.address,
                items: o.itemsLabel,
                amount: o.amount,
                method: o.method,
                status: o.status,
                _id: o._id,
            }))
        );
    } catch (error) {
        console.error('[API] GET /api/admin/orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
