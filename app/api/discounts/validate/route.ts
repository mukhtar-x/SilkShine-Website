import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import DiscountEvent from '@/lib/models/DiscountEvent';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code, cart } = body;

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
        }

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        await connectDB();

        const cleanCode = code.trim().toUpperCase();
        const discountEvent = await DiscountEvent.findOne({
            code: cleanCode,
            isActive: true,
        }).lean();

        if (!discountEvent) {
            return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
        }

        const { title, discountPercentage, applicableProducts } = discountEvent;

        // Calculate discount
        let eligibleSubtotal = 0;
        const hasSpecificProducts = Array.isArray(applicableProducts) && applicableProducts.length > 0;

        cart.forEach((item: any) => {
            const itemPrice = Number(item.price) || 0;
            const itemQty = Number(item.quantity) || 1;
            const productId = Number(item.id);

            if (!hasSpecificProducts || applicableProducts.includes(productId)) {
                eligibleSubtotal += itemPrice * itemQty;
            }
        });

        if (eligibleSubtotal === 0) {
            return NextResponse.json({
                error: 'This coupon is not applicable to any items in your cart',
            }, { status: 400 });
        }

        const discountAmount = Math.round((eligibleSubtotal * discountPercentage) / 100);

        return NextResponse.json({
            success: true,
            title,
            code: cleanCode,
            discountPercentage,
            discountAmount,
            eligibleSubtotal,
        });
    } catch (error) {
        console.error('[API] POST /api/discounts/validate error:', error);
        return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
    }
}
