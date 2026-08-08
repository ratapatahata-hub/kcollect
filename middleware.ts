import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Check if the user is trying to visit the admin page
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = req.headers.get('authorization');

    // If they haven't typed a password yet, show the browser login popup
    if (!authHeader) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin Access"' }
      });
    }

    // Read the username and password they typed
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    // YOUR SECRET USERNAME AND PASSWORD (Change these if you want!)
    if (user === 'U64Ffxdt$du' && pass === 'R4hbde7YGye36#heu*hjcYui70') {
      return NextResponse.next(); // Let them in
    }

    // If they type the wrong password, kick them out
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Access"' }
    });
  }
}