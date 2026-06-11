import { getPersonalAccountInfo } from "@/dbQuery/dbQuerys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BonusAccountClient from "./components/BonusAccountClient";

export default async function BonusAccountPage() {
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["bonus-account"],
    queryFn: () => getPersonalAccountInfo(null, null, 1),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BonusAccountClient />
    </HydrationBoundary>
  );
}
