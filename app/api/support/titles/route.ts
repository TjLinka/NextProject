import { serverFetch } from "@/lib/auth";

export async function GET() {
    const res = await serverFetch("/api/partner/Dialogs/get-dialog-titles");
    return res
}