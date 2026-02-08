import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const authPages = ["/signin", "/signup"]
const protectedPages = ["/create"]

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  // Redirect authenticated users away from auth pages
  if (sessionCookie && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (!sessionCookie && protectedPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/signin", "/signup", "/create"],
}
