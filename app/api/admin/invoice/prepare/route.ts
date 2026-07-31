import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import SiteMetadata from '@/lib/models/SiteMetadata';
import InvoiceCounter from '@/lib/models/InvoiceCounter';

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId')?.trim() || null;
    const year = new Date().getFullYear();
    const counterKey = `invoice-${year}`;

    const counter = await InvoiceCounter.findOneAndUpdate(
      { key: counterKey },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).lean();

    const metadata = await SiteMetadata.findOne({ key: 'main' }).lean();
    if (!metadata) {
      return NextResponse.json({ error: 'Site metadata not found.' }, { status: 404 });
    }

    let order = null;
    if (orderId) {
      order = await Order.findOne({ $or: [{ orderId }] }).lean();
    }

    return NextResponse.json({
      metadata,
      nextInvoiceNumber: `SS-${year}-${String(counter?.seq ?? 1).padStart(3, '0')}`,
      order,
    });
  } catch (error) {
    console.error('[API] GET /api/admin/invoice/prepare error:', error);
    return NextResponse.json({ error: 'Failed to prepare invoice data' }, { status: 500 });
  }
}
