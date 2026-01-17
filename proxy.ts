import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // Note: If deployment fails, you may need to use 'jose' library for Edge Runtime

// CRITICAL: This file must be named "middleware.ts" and placed in the ROOT of your project 
// (or inside src/ if you use a src folder). DO NOT place it inside pages/ or app/.

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// List of public routes
const publicRoutes = [
  '/',
  '/about',
  '/auth/login',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth/login',
  '/api/auth/logout',
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // 1. Check if the current path is a public route
  // FIX: We handle '/' strictly so it doesn't match '/admin'
  const isPublicRoute = publicRoutes.some(route => 
    route === '/' ? pathname === route : pathname.startsWith(route)
  );

  // 2. Handle Public Routes
  if (isPublicRoute) {
    // If user is already logged in and tries to access login page, redirect to admin
    if (pathname === '/auth/login' && token) {
      try {
        jwt.verify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch (error) {
        // Token is invalid, let them stay on login page but clear the cookie
        const response = NextResponse.next();
        response.cookies.delete('auth-token');
        return response;
      }
    }
    return NextResponse.next();
  }

  // 3. Protect Admin and Dashboard Routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // 4. Protect API Routes (excluding the public auth ones handled above)
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
     * - public (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};