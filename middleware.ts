import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/auth/login',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth/login',
  '/api/auth/logout',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Redirect authenticated users away from login page
    if (pathname === '/auth/login' && token) {
      try {
        jwt.verify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch (error) {
        // Token is invalid, clear it
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
        return response;
      }
    }
    return NextResponse.next();
  }

  // Protect private routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired, redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  // For API routes (except auth routes), check authentication
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
