import type { NextRequest } from 'next/server';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
export const AUTH_COOKIE_NAME = 'silkshine_admin_session';
export const AUTH_COOKIE_VALUE = 'authenticated';

export function parseCookie(cookieHeader: string | null | undefined, name: string) {
  if (!cookieHeader) return undefined;
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')[1];
}

export function isAdminAuthenticated(request: Request | NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const cookieValue = parseCookie(cookieHeader, AUTH_COOKIE_NAME);
  return cookieValue === AUTH_COOKIE_VALUE;
}
