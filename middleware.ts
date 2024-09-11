import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = request.nextUrl;


    const protectedRoutes = ['/projects', '/profile'];


    if (pathname === '/test-db') {
        return NextResponse.next();
    }


    if (protectedRoutes.some(route => pathname.startsWith(route))) {

        if (!token) {
            const url = new URL('/', request.url);
            return NextResponse.redirect(url);
        }
    }


    return NextResponse.next();
}

// Define the routes that should be processed by this middleware
export const config = {
    matcher: ['/projects', '/test-db', '/profile'],
};
