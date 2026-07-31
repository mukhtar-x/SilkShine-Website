import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from '@/lib/adminAuth';

function isAdminRoute(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

function isAllowedAdminPath(pathname: string) {
  return pathname === '/admin/login' || pathname.startsWith('/admin/login');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (isAdminRoute(pathname) && !isAllowedAdminPath(pathname)) {
    if (cookieValue !== AUTH_COOKIE_VALUE) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login' && pathname !== '/api/admin/logout') {
    if (cookieValue !== AUTH_COOKIE_VALUE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
