import { UserRole } from '@wedding/api-types';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to root path
    if (pathname === '/') {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Check if user has super admin role
    if (token.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.redirect(new URL('/', req.url));
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico)(?!/api)(?!/).*)'],
};
