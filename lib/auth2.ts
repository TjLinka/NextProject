// lib/auth2.ts
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function validateOrRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const currentPath = headerStore.get("x-current-path") ?? "/";

  if (!accessToken && !refreshToken) {
    redirect("/login");
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
        },
        cache: "no-store",
      },
    );

    if (res.ok) return accessToken;
  }

  if (refreshToken) {
    // Редиректим браузер на route handler — он получит Set-Cookie напрямую
    // redirect("/api/refresh");
    redirect(`/api/refresh?callbackUrl=${encodeURIComponent(currentPath)}`);
  }

  return null;
}
