import { auth } from 'src/lib/auth';
import { NextResponse } from 'next/server';

export const proxy = auth((request) => {
  const isLoggedIn = !!request.auth;
  const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  if (isOnDashboard && !isLoggedIn) {
    const loginUrl = new URL('/auth/jwt/login', request.url);
    loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
