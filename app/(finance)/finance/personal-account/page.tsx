import { serverFetch } from "@/lib/auth";
import { PersonalAccoutClient } from "./components/PersonalAccountClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPersonalAccountHistory } from "@/lib/actions";

export default async function PersonalAccount() {
  // const res = await serverFetch("/api/partner/Account/get-operations/0", {
  //   method: "POST",
  //   body: JSON.stringify({}),
  // });
  // const data = await res.json();
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["personal_acc"],
    queryFn: () => getPersonalAccountHistory({ from: null, to: null }),
  });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <PersonalAccoutClient />
    </HydrationBoundary>
  );
}
