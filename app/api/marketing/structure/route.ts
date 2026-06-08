import { serverFetch } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(Req: NextRequest) {
  const { searchParams } = Req.nextUrl;

  console.log(searchParams);
  

  const root_agent = searchParams.get("root_agent");
  const agent_id = searchParams.get("agent_id");
  const level_agent = searchParams.get("level_agent");
  const res = await serverFetch(
    `/api/partner/Structure/get-agent-structure?root_agent=${root_agent}&agentid=105&level_agent=${level_agent}`,
  );
  return res;
}
