import { serverFetch } from "@/lib/auth";

export async function GET(req : Request) {
    const res = await serverFetch('/api/partner/Agent/get-agent-profile-info')
    return res;
}