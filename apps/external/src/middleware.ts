import { UserRole } from '@shared/api';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define public pages that don't require authentication
const publicPages = [
  '/',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/get-started',
  '/essentials',
  '/the-big-day',
  '/for-businesses',
  '/guest-&-vendor',
];

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;

    // For public pages, bypass NextAuth authentication check
    if (publicPages.some((page) => pathname.startsWith(page))) {
      return NextResponse.next();
    }

    const token = req.nextauth.token;

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
      authorized: ({ token }) => {
        // Always authorize to let middleware function handle the logic
        return !!token || true;
      },
    },
    cookies: {
      sessionToken: {
        name: 'next-auth.session-token-external',
      },
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
