import { serverFetch } from "@/lib/auth";

export async function POST(req: Request) {
  const {volume } = await req.json();
  const res = await serverFetch("/api/partner/Webshop/upgrade-data", {
    method: "POST",
    body: JSON.stringify({volume}),
  });
  
  return res;
} 