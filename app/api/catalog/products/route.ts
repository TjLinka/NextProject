import { serverFetch } from "@/lib/auth";

export async function GET() {
    const res = await serverFetch("/api/partner/Catalog/get-catalog");
    return res
}