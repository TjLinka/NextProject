import { serverFetch } from "@/lib/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPersonalAccountInfo } from "@/dbQuery/dbQuerys";
import { PersonalAccoutClient } from "./components/PersonalAccountClient";

export default async function PersonalAccount() {
  // const res = await serverFetch("/api/partner/Account/get-operations/0", {
  //   method: "POST",
  //   body: JSON.stringify({}),
  // });
  // const data = await res.json();
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["personal_acc"],
    queryFn: () => getPersonalAccountInfo(null, null),
  });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <PersonalAccoutClient />
    </HydrationBoundary>
  );
}
