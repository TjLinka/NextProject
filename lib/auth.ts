"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function refreshAccessToken(): Promise<string> {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;
  
  if (!refreshToken) redirect("/login");

  const res = await fetch(
    "https://back.radargp.com/api/partner/Agent/refresh-token",
    {
      method: "GET",
      headers: {
        "X-Frontend-Id": "0",
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
        access_token: `Bearer ${refreshToken}`,
        Cookie: (await cookieStore).toString(),
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!res.ok) redirect("/login");

  const { access_token, expires_in } = await res.json();

  (await cookieStore).set("access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expires_in,
    path: "/",
  });

  return access_token;
}

export async function serverFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;


  const res = await fetch(`${process.env.BACKEND_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      'access_token': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
    credentials: 'include',
    cache: "no-store",
  });
  
  if (res.status !== 401) return res;
  
  const newToken = await refreshAccessToken();

  const retryRes = await fetch(`${process.env.BACKEND_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${newToken}`,
      'access_token': `Bearer ${newToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });  

  if (!retryRes.ok) redirect("/login");

  return retryRes;
}
