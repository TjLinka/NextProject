import { serverFetch } from "@/lib/auth";

export async function GET() {
    return serverFetch('/api/partner/Catalog/get-activity-items')
}