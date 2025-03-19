import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboardPage && !token) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthPage && token) {
    // Redirect to dashboard if trying to access auth pages while logged in
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
