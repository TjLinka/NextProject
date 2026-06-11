import { serverFetch } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const res = await serverFetch(
    `/api/partner/Delivery/get-delivery-prices?${searchParams.toString()}`,
  );    
  return res;
}
