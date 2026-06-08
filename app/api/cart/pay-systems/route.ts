import { serverFetch } from "@/lib/auth";

export async function POST() {
    const res = await serverFetch("/api/partner/payment/get-paysystems", {
        method: "POST",
        body: JSON.stringify({})
    });
    return res
} 