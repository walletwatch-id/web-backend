import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.nextUrl.toString());

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
