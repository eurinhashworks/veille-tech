import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Log the incoming request
  console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`);
  
  // Continue the request pipeline
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
};
