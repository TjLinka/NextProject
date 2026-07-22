import { serverFetch } from "@/lib/auth";

export async function GET() {
    const res = await serverFetch("/api/parnter/Dashboard/get-common");
    return res
}