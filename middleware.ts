import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = request.nextUrl;

    // Define routes that require authentication
    const protectedRoutes = ['/projects'];

    // Allow both logged-in and not logged-in users to access the /test-db route
    if (pathname === '/test-db') {
        return NextResponse.next();
    }

    // If the user is trying to access a protected route
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        // If the user is not authenticated, redirect to the home page
        if (!token) {
            const url = new URL('/', request.url);
            return NextResponse.redirect(url);
        }
    }

    // Continue with the request if it's not a protected route or the user is authenticated
    return NextResponse.next();
}

// Define the routes that should be processed by this middleware
export const config = {
    matcher: ['/projects', '/test-db'],
};
