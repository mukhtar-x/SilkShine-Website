import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cart, formData, paymentMethod, cartTotal, discount, deliveryCharges } = body;

        if (!cart?.length || !formData?.name || !formData?.phone) {
            return NextResponse.json({ error: 'Missing required order data' }, { status: 400 });
        }

        await connectDB();

        // Generate sequential order ID
        const count = await Order.countDocuments();
        const orderId = `#ORD-${String(count + 1).padStart(3, '0')}`;

        // Build items label for admin display e.g. "2x 5L Can, 1x 200L Drum"
        const itemsLabel = cart
            .map((item: { quantity: number; selectedSize: string; name: string }) =>
                `${item.quantity}x ${item.selectedSize}`)
            .join(', ');

        const totalAmount = cartTotal + (deliveryCharges ?? 500) - (discount ?? 0);
        const amount = `Rs. ${totalAmount.toLocaleString()}`;

        const order = await Order.create({
            orderId,
            customer: formData.name,
            contact: formData.phone,
            address: formData.address,
            city: formData.city,
            items: cart.map((item: { name: string; quantity: number; selectedSize: string; price: number }) => ({
                name: item.name,
                quantity: item.quantity,
                size: item.selectedSize,
                price: item.price,
            })),
            itemsLabel,
            amount,
            totalAmount,
            method: paymentMethod === 'cash' ? 'COD' : 'Card',
            status: 'Pending',
        });

        return NextResponse.json({ success: true, orderId: order.orderId }, { status: 201 });
    } catch (error) {
        console.error('[API] POST /api/orders error:', error);
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}
