import { serverFetch } from "@/lib/auth";

export async function GET() {
  const res = await serverFetch(
    "/api/partner/Structure/get-agent-structure?root_agent=105&agentid=105&level_agent=105",
  );
  return res;
}
