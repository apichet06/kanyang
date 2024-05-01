import { NextResponse } from 'next/server'


// This function can be marked `async` if using `await` inside
export function middleware(request) {

    try {
        const token = request.cookies.get('token').value;
        console.log('====================================');
        console.log(token);
        console.log('====================================');
        console.log('====================================');
        console.log(request.url);
        console.log('====================================');
        return NextResponse.next()
    } catch (error) {
        return NextResponse.redirect(new URL('/', request.url))
    }

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/home/:path*', '/admin/:path*']
}
