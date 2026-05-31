"use server";

import { serverFetch } from "@/lib/auth";

export async function getUser() {
  const res = await serverFetch("/api/partner/Agent/get-agent-profile-info");
  const res2 = await serverFetch("/api/partner/Agent/sponsor-get");
  const res3 = await serverFetch("/api/partner/SocialMedia/get/105");

  const data = {
    agentInfo: await res.json(),
    sponsorInfo: await res2.json(),
    socialsInfo: await res3.json(),
  }
  
  return data
}
