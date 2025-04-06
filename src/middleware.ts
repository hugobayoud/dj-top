import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

/**
 * Middleware to handle authentication and protected routes
 */
export async function middleware(request: NextRequest) {
  // Update the session
  const response = await updateSession(request);

  // Path that should be protected (require authentication)
  const protectedPaths = ['/add-dj', '/admin'];
  const isPathProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Path for login page
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Get auth cookie
  const authCookie = request.cookies.get('sb-auth-token');

  // If the path is protected and no auth cookie exists, redirect to login
  if (isPathProtected && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user may be authenticated and tries to access login page, redirect to home
  if (isLoginPage && authCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

// Apply middleware to specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
};
