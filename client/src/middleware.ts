import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
    const { cookies, url, nextUrl } = request
    const pathname = nextUrl.pathname

    const sessionCookieName = process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || ''
    const session = cookies.get(sessionCookieName)?.value
    const isAuthenticated = Boolean(session)

    const isAuthRoute = pathname.startsWith('/account')
    const isDeactivateRoute = pathname === '/account/deactivate'
    const isDashboardRoute = pathname.startsWith('/dashboard')

    if (!isAuthenticated) {
        if (isDashboardRoute || isDeactivateRoute) {
            return NextResponse.redirect(new URL('/account/login', url))
        }
    }

    if (isAuthenticated && isAuthRoute && !isDeactivateRoute) {
        return NextResponse.redirect(new URL('/dashboard/settings', url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/account/:path*', '/dashboard/:path*'],
}
