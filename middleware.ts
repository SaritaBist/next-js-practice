import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get NextAuth session token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Protect /dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};
