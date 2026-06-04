// middleware.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const cookieStore = await cookies();

  if (
    !accessToken &&
    !refreshToken &&
    request.nextUrl.pathname !== "/api/login"
  ) {
    
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!accessToken && refreshToken) {
    const res = await fetch(
      "https://back.radargp.com/api/partner/Agent/refresh-token",
      {
        method: "GET",
        headers: {
          "X-Frontend-Id": "0",
          Authorization: `Bearer ${refreshToken}`,
          access_token: `Bearer ${refreshToken}`,
          Cookie: cookieStore.toString(),
        },
        credentials: "include",
        cache: "no-store",
      },
    );
    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { access_token } = await res.json();

    const response = NextResponse.next();

    // Вот здесь Set-Cookie гарантированно дойдёт до браузера
    response.cookies.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  }
  if (accessToken) {
    const res = await fetch(
      "https://back.radargp.com/api/partner/Account/get-short-info",
      {
        method: "GET",
        headers: {
          "X-Frontend-Id": "0",
          Authorization: `Bearer ${accessToken}`,
          access_token: `Bearer ${accessToken}`,
          Cookie: cookieStore.toString(),
        },
        credentials: "include",
        cache: "no-store",
      },
    );
    if (res.status === 401) {
      const res = await fetch(
        "https://back.radargp.com/api/partner/Agent/refresh-token",
        {
          method: "GET",
          headers: {
            "X-Frontend-Id": "0",
            Authorization: `Bearer ${refreshToken}`,
            access_token: `Bearer ${refreshToken}`,
            Cookie: cookieStore.toString(),
          },
          credentials: "include",
          cache: "no-store",
        },
      );
      if (!res.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const { access_token } = await res.json();

      const response = NextResponse.next();

      // Вот здесь Set-Cookie гарантированно дойдёт до браузера
      response.cookies.set("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|webp|ico|css|js|woff|woff2|ttf)).*)'],
};
