import { serverFetch } from "@/lib/auth";

export async function POST(body: Request) {
  const {dates} = await body.json();
  const res = await serverFetch("/api/partner/Account/get-operations/0", {
    method: "POST",
    body: JSON.stringify({
      from: dates[0],
      to: dates[1]
    }),
  });
  return res;
}
