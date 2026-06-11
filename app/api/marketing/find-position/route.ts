import { serverFetch } from "@/lib/auth";

export async function POST(req: Request) {
  const { root_id, find_str, offset, show_cnt } = await req.json();
  console.log(root_id, find_str);
  
  const res = await serverFetch("/api/partner/Binar/find-position", {
    method: "POST",
    body: JSON.stringify({
      root_id: root_id,
      find_str: find_str,
      offset: 0,
      show_cnt: 20,
    }),
  });
  
  return res;
}
