import { serverFetch } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const res = await serverFetch(`/api/partner/Catalog/get-single/${id}`);
  console.log(res);
  
  return res
}
