import { getUser } from "@/lib/actions";
import { User } from "@/types/user/types";
import ProfileClient from "../components/ProfileClient";
import {
  getProfileData,
  getSponsorInfo,
  getBalance,
  getSocials,
} from "@/dbQuery/dbQuerys";

export default async function Home() {
  // const {agentInfo, sponsorInfo, socialsInfo, agentBalance}  = await getUser()
  const agentInfo = await getProfileData<User>();
  const sponsorInfo = await getSponsorInfo<User>();
  const agentBalance = await getBalance();
  const socialsInfo = await getSocials();
  if (agentInfo && sponsorInfo && agentBalance && socialsInfo) {
    return (
      <div>
        <ProfileClient
          agentInfo={agentInfo}
          sponsorInfo={sponsorInfo}
          socialsInfo={socialsInfo}
          agentBalance={agentBalance}
        />
      </div>
    );
  }
}
