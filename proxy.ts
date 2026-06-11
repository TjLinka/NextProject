// app/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // Только примитивная проверка наличия токенов — без fetch!
  if (
    !accessToken &&
    !refreshToken &&
    request.nextUrl.pathname !== "/api/login" &&
    request.nextUrl.pathname !== "/api/registration"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (
    !accessToken &&
    refreshToken &&
    request.nextUrl.pathname !== "/api/refresh"
  ) {
    const redirectUrl = new URL("/api/refresh", request.url);
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();
  response.headers.set("x-current-path", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!login|registration|api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|webp|ico|css|js|woff|woff2|ttf)).*)",
  ],
};
