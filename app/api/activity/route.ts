import { serverFetch } from "@/lib/auth";

export async function GET() {
    return await serverFetch('/api/partner/Agent/get-activity')
}