import { getUser } from "@/lib/actions";
import { User } from "@/types/user/types";
import ProfileClient from "./components/ProfileClient";

export default async function Home() {
  const data : User = await getUser()
  return <div>
    <ProfileClient data={data}/>
  </div>
}
