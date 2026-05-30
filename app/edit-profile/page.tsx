import { getUser } from "@/lib/actions";
import { EditProfileClient } from "./components/EditProfileClient";

export default async function EditProfile() {
    const data = await getUser()
    return <EditProfileClient data={data}/>
}