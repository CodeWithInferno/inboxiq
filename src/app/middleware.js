import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export default async function middleware(req) {
  console.log(`Middleware executing on: ${req.nextUrl.pathname}`);
  const session = await getSession(req);

  if (!session || !session.user) {
    console.log('User not authenticated, redirecting...');
    return NextResponse.redirect('/api/auth/login');
  }

  console.log('User authenticated, allowing access');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};
