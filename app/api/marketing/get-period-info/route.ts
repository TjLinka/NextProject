import { serverFetch } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(Req: NextRequest) {
  const { searchParams } = Req.nextUrl;
  const m_id = searchParams.get("m_id");
  return await serverFetch(
    `/api/partner/Marketing/get-period-info?marketing_id=${m_id}`,
  );
}
