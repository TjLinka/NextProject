import { serverFetch } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
      const { searchParams } = request.nextUrl;
      const input = searchParams.get("input");
      const res = await serverFetch(`/api/partner/SignUp/check-phone/${input}`);
      return res;
}