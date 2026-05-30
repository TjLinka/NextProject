import { serverFetch } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { find_str } = await req.json();

  console.log("222222");

  const res = await serverFetch("/api/partner/SignUp/get-sponsors", {
    method: "POST",
    body: JSON.stringify({
      find_str,
    }),
  });

  return res;
}
