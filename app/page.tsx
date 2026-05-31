import { getUser } from "@/lib/actions";
import { User } from "@/types/user/types";
import ProfileClient from "./components/ProfileClient";

export default async function Home() {
  const {agentInfo, sponsorInfo, socialsInfo, agentBalance}  = await getUser()
  return <div>
    <ProfileClient agentInfo={agentInfo} sponsorInfo={sponsorInfo} socialsInfo={socialsInfo} agentBalance={agentBalance}/>
  </div>
}
