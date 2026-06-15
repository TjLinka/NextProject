import { serverFetch } from "@/lib/auth";

export async function POST(Req: Request) {
  const { m_id, comdte } = await Req.json();
  return await serverFetch("/api/partner/Marketing/agent-bonuses", {
    method: "POST",
    body: JSON.stringify({ marketing_id: m_id, comdte }),
  });
}
