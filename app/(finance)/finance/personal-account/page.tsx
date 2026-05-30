import { getPersonalAccountInfo } from "./actions";
import { PersonalAccoutClient } from "./components/PersonalAccountClient";

export default async function PersonalAccount() {
    const data = await getPersonalAccountInfo()
    return <PersonalAccoutClient data={data}/>
}