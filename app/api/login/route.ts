import { cookies } from "next/headers";
import LoginHandler from "./_services/auth.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { login, password } = await req.json();

  const backendRes = await LoginHandler(login, password);

  const cookieStore = await cookies();

  const resJson = await backendRes.json();

  cookieStore.set("access_token", resJson.access_token);

  const res = NextResponse.json(resJson, {
    status: backendRes.status,
  });

  // пробрасываем Set-Cookie (ВАЖНО: вручную)
  const setCookie = backendRes.headers.get("set-cookie");

  if (setCookie) {
    res.headers.append(
      "set-cookie",
      setCookie.replace(/samesite=none/, "samesite=lax").replace(/secure;/, ""),
    );
  }  

  return res;
}
