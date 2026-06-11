// app/api/refresh/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  console.log(callbackUrl, 'callbackUrl');
  
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { access_token } = await res.json();

  // Редиректим обратно на исходную страницу, Set-Cookie дойдёт до браузера
  const response = NextResponse.redirect(new URL(callbackUrl, request.url));
  response.cookies.set("access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
