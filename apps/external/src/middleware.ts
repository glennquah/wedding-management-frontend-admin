import { UserRole } from '@shared/api';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
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
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: () => true,
    },
    cookies: {
      sessionToken: {
        name: 'next-auth.session-token-external',
      },
    },
  },
);

// Restrict the guard to authenticated portals. Landing pages, guest microsites,
// guest attendance links, auth endpoints, and static assets remain public.
export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*'],
};
