"use server";

import { serverFetch } from "@/lib/auth";

export async function getUser() {
  const res = await serverFetch("/api/partner/Agent/get-agent-profile-info");
  return res.json();
}
