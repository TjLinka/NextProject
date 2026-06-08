import { setAccessTokenCookie } from "@/app/_actions/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateOrRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  console.log('after proxe');
  

  if (!accessToken && !refreshToken) {
    redirect('/login');
  }

  // Есть access_token — валидируем
  if (accessToken) {
    const res = await fetch(
      "https://back.radargp.com/api/partner/Account/get-short-info",
      {
        method: "GET",
        headers: {
          "X-Frontend-Id": "0",
          Authorization: `Bearer ${accessToken}`,
          access_token: `Bearer ${accessToken}`,
          // Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      },
    );

    if (res.ok) return accessToken;
    // 401 — падаем на refresh ниже
  }

  // Refresh
  if (refreshToken) {
    console.log('refresh');
    
    const res = await fetch(
      "https://back.radargp.com/api/partner/Agent/refresh-token",
      {
        method: "GET",
        headers: {
          "X-Frontend-Id": "0",
          Authorization: `Bearer ${refreshToken}`,
          access_token: `Bearer ${refreshToken}`,
          // Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    const { access_token } = await res.json();

    // Устанавливаем куку через Server Action
    await setAccessTokenCookie(access_token);

    return access_token;
  }

  return null;
}
