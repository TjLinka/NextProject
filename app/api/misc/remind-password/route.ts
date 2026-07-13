import { serverFetch } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
      const { searchParams } = request.nextUrl;
      const email = searchParams.get("email");
      const res = await serverFetch(`/api/partner/Agent/reset-password?email=${email}`);
      return res;
}