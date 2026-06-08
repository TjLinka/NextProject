import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getFavouritesProducts } from "./action";
import { FavoritePageClient } from "./components/FavoritePageClient";
export default async function FavoritePage() {
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["favourites"],
    queryFn: () => getFavouritesProducts(),
  });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <FavoritePageClient />
    </HydrationBoundary>
  );
}
