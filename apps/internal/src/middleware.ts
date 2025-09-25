import { UserRole } from '@wedding/api-types';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to root path
    if (pathname === '/login') {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check if user has super admin role
    if (token.role !== UserRole.SUPERADMIN) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow the middleware to run - we'll handle auth logic in the middleware function
        return true;
      },
    },
    cookies: {
      sessionToken: {
        name: 'next-auth.session-token-internal',
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  },
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico)(?!/api)(?!/).*)'],
};
