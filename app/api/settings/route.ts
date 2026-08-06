import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Settings from '@/lib/models/Settings';

export async function GET() {
    try {
        await connectDB();
        let settings = await Settings.findOne({ key: 'global' }).lean();
        if (!settings) {
            settings = await Settings.create({
                key: 'global',
                deliveryCharge: 500,
                taxRate: 0,
            });
        }
        return NextResponse.json({
            deliveryCharge: settings.deliveryCharge ?? 500,
            taxRate: settings.taxRate ?? 0,
        });
    } catch (error) {
        console.error('[API] GET /api/settings error:', error);
        return NextResponse.json({ error: 'Failed to fetch global settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { deliveryCharge, taxRate } = body;

        if (deliveryCharge == null || taxRate == null) {
            return NextResponse.json({ error: 'deliveryCharge and taxRate are required' }, { status: 400 });
        }

        const deliveryChargeNum = Number(deliveryCharge);
        const taxRateNum = Number(taxRate);

        if (isNaN(deliveryChargeNum) || deliveryChargeNum < 0) {
            return NextResponse.json({ error: 'Delivery charge must be a positive number' }, { status: 400 });
        }

        if (isNaN(taxRateNum) || taxRateNum < 0 || taxRateNum > 100) {
            return NextResponse.json({ error: 'Tax rate must be a percentage between 0 and 100' }, { status: 400 });
        }

        await connectDB();

        const updated = await Settings.findOneAndUpdate(
            { key: 'global' },
            {
                deliveryCharge: deliveryChargeNum,
                taxRate: taxRateNum,
            },
            { upsert: true, new: true }
        ).lean();

        return NextResponse.json({
            success: true,
            settings: {
                deliveryCharge: updated.deliveryCharge,
                taxRate: updated.taxRate,
            },
        });
    } catch (error) {
        console.error('[API] POST /api/settings error:', error);
        return NextResponse.json({ error: 'Failed to update global settings' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    return POST(req);
}
