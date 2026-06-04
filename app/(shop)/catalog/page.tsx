import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getShopCatalog, getShopCategoryes } from "./actions";
import { ShopCatalogClient } from "./components/ShopCatalogClient";
// import { Product } from "./types";

export default async function ShopCatalog() {
  // const data: Product[] = await getShopCatalog();
  const catagoryes = await getShopCategoryes()

  const qc = new QueryClient()

  await qc.prefetchQuery({
    queryKey: ["catalog", ""],
    queryFn: () => getShopCatalog(''),
  }); 

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ShopCatalogClient catagoryes={catagoryes} />
    </HydrationBoundary>
  );
}
