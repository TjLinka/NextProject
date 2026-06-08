// app/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Только примитивная проверка наличия токенов — без fetch!
  if (
    !accessToken &&
    !refreshToken &&
    request.nextUrl.pathname !== "/api/login"
  ) {
    console.log('proxy to login');
    
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|webp|ico|css|js|woff|woff2|ttf)).*)",
  ],
};
