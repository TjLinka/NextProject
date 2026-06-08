import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { WithdrawPageClient } from "./components/WithdrawPageClient";
import { getWithdrawList } from "@/dbQuery/dbQuerys";

export default async function WithdrawPage() {
  const qc = new QueryClient();

  qc.prefetchQuery({
    queryKey: ["withdrawlist"],
    queryFn: () => {
      return getWithdrawList();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <WithdrawPageClient />
    </HydrationBoundary>
  );
}
