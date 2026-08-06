import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import Settings from '@/lib/models/Settings';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cart, formData, paymentMethod, discount, deliveryCharges, taxAmount } = body;

        if (!cart?.length || !formData?.name || !formData?.phone) {
            return NextResponse.json({ error: 'Missing required order data' }, { status: 400 });
        }

        await connectDB();

        // Fetch global settings if delivery or tax amounts not provided
        let delCharge = Number(deliveryCharges);
        let taxAmt = Number(taxAmount);

        if (isNaN(delCharge) || isNaN(taxAmt)) {
            const settings = await Settings.findOne({ key: 'global' }).lean();
            if (isNaN(delCharge)) delCharge = settings?.deliveryCharge ?? 500;
            if (isNaN(taxAmt)) {
                const subtotal = cart.reduce((acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity)), 0);
                const discountVal = Number(discount) || 0;
                const taxRate = settings?.taxRate ?? 0;
                taxAmt = Math.round(((subtotal - discountVal) * taxRate) / 100);
            }
        }

        // Calculate accurate subtotal
        const subtotal = cart.reduce((acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity)), 0);
        const discountVal = Number(discount) || 0;
        const totalAmount = Math.max(0, subtotal - discountVal + taxAmt + delCharge);
        const amount = `Rs. ${totalAmount.toLocaleString()}`;

        // Generate sequential order ID
        const count = await Order.countDocuments();
        const orderId = `#ORD-${String(count + 1).padStart(3, '0')}`;

        // Build items label for admin display e.g. "2x 5L Can, 1x 200L Drum"
        const itemsLabel = cart
            .map((item: { quantity: number; selectedSize: string; name: string }) =>
                `${item.quantity}x ${item.selectedSize}`)
            .join(', ');

        const order = await Order.create({
            orderId,
            customer: String(formData.name).trim(),
            contact: String(formData.phone).trim(),
            address: String(formData.address || '').trim(),
            city: String(formData.city || '').trim(),
            items: cart.map((item: { name: string; quantity: number; selectedSize: string; price: number }) => ({
                name: item.name,
                quantity: Number(item.quantity),
                size: item.selectedSize || 'Standard',
                price: Number(item.price),
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
