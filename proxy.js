import { NextResponse } from 'next/server';
import { decode } from 'next-auth/jwt';

const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token'];

// Drop session cookies that can't be decrypted (e.g. issued before AUTH_SECRET
// changed), then reload the page so auth() never sees them and errors.
export async function proxy(request) {
  const stale = [];
  for (const name of SESSION_COOKIES) {
    const token = request.cookies.get(name)?.value;
    if (!token) continue;
    try {
      await decode({ token, secret: process.env.AUTH_SECRET, salt: name });
    } catch {
      stale.push(name);
    }
  }
  if (stale.length === 0) return NextResponse.next();

  const response = NextResponse.redirect(request.nextUrl);
  stale.forEach((name) => response.cookies.delete(name));
  return response;
}

export const config = {
  matcher: ['/login', '/admin/:path*'],
};
