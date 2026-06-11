import { serverFetch } from "@/lib/auth";

export async function POST(req: Request) {
  const { root_id, binar_id } = await req.json();
  const res = await serverFetch("/api/partner/Binar/retrieve-track", {
    method: "POST",
    body: JSON.stringify({
      root_id: 243,
      binar_id
    }),
  });
  return res
}
