'use server'
import { serverFetch } from "@/lib/auth";

export const getStructureTreeData = async () => {
  const params = new URLSearchParams({
    root_agent: "105",
    agentid: "105",
    level_agent: "105",
  });
  
  const res = await serverFetch(
    `/api/partner/Structure/get-agent-structure?${params}`,
  );
  const data = await res.json()
  return data
};
