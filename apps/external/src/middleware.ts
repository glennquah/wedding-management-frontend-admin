import { UserRole } from '@shared/api';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Define public pages that don't require authentication
    const publicPages = [
      '/',
      '/login',
      '/get-started',
      '/essentials',
      '/the-big-day',
      '/for-businesses',
      '/guest-&-vendor',
    ];

    // Allow access to public pages
    if (publicPages.some((page) => pathname.startsWith(page))) {
      return NextResponse.next();
    }

    // Check if user is authenticated for protected pages
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check if user has admin or vendor role (NOT super admin) for protected pages
    if (token.role !== UserRole.ADMIN && token.role !== UserRole.VENDOR) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones we want to exclude
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
