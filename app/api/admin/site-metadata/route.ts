import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import SiteMetadata from '@/lib/models/SiteMetadata';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(req: Request) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const metadata = await SiteMetadata.findOne({ key: 'main' }).lean();
    if (!metadata) {
      return NextResponse.json({ error: 'Site metadata not found.' }, { status: 404 });
    }
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('[API] GET /api/admin/site-metadata error:', error);
    return NextResponse.json({ error: 'Failed to fetch site metadata' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid metadata payload' }, { status: 400 });
    }

    await connectDB();

    const updated = await SiteMetadata.findOneAndUpdate(
      { key: 'main' },
      body,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, metadata: updated });
  } catch (error) {
    console.error('[API] PUT /api/admin/site-metadata error:', error);
    return NextResponse.json({ error: 'Failed to update site metadata' }, { status: 500 });
  }
}
