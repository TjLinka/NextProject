// app/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Нет обоих токенов
  if (!accessToken && !refreshToken) {
    // Главная для неавторизованных → каталог
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL("/catalog", request.url)
      );
    }

    // Остальные защищённые страницы → login
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Есть refreshToken, но нет accessToken
  if (
    !accessToken &&
    refreshToken &&
    pathname !== "/api/refresh"
  ) {
    const redirectUrl = new URL("/api/refresh", request.url);

    redirectUrl.searchParams.set(
      "callbackUrl",
      pathname
    );

    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();

  response.headers.set(
    "x-current-path",
    pathname
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!login|registration|remindpass|catalog|cart|api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|webp|ico|css|js|woff|woff2|ttf)).*)",
  ],
};