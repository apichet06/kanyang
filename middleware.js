import { NextResponse } from 'next/server'
import { decodeToken } from "./app/utils/decodeToken"

// This function can be marked `async` if using `await` inside
export function middleware(request) {

    try {
        const token = request.cookies.get('token').value;
        // console.log('====================================');
        // console.log(token);
        // console.log('====================================');
        // console.log('====================================');
        // console.log(request.url);
        // console.log('====================================');


        const decodedToken = decodeToken(token);
        if (decodedToken) {
            console.log("Decoded Token:", decodedToken);
        } else {
            console.log("Failed to decode token.");
        }

        return NextResponse.next()
    } catch (error) {
        return NextResponse.redirect(new URL('/', request.url))
    }

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/home/:path*', '/admin/:path*']
}
