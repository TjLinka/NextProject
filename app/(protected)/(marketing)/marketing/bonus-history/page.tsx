import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { BonusHistoryClient } from "./components/BonusHistoryClient";

export default async function BonusHistoryWrapper() {
  const qc = new QueryClient();

  qc.prefetchQuery({
    queryKey: ["bonus-history"],
    queryFn: async () => {
      const res = await fetch(`/api/marketing/get-period-info?m_id=0`);
      const data = await res.json();
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BonusHistoryClient />
    </HydrationBoundary>
  );
}
