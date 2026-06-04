import { serverFetch } from "@/lib/auth";

export async function POST() {
  const res = await serverFetch("/api/partner/Dialogs/get", {
    method: "POST",
    body: JSON.stringify({}),
  });
  console.log(res);
  
  return res;
}
