import { NextResponse } from 'next/server';
import { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid administrator credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error('[API] POST /api/admin/login error:', error);
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
  }
}
