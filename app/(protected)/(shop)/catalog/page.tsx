import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getShopCatalog, getShopCategoryes } from "./actions";
import { ShopCatalogClient } from "./components/ShopCatalogClient";
import { getCatalog } from "@/dbQuery/dbQuerys";
// import { Product } from "./types";

export default async function ShopCatalog({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { find } = await searchParams; // например ?q=nike
  // const dataBD = await getCatalog()
  // console.log(dataBD);

  // const data: Product[] = await getShopCatalog();
  const catagoryes = await getShopCategoryes();

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["catalog", ""],
    queryFn: () => getCatalog(),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ShopCatalogClient catagoryes={catagoryes} initSearch={find || ""}/>
    </HydrationBoundary>
  );
}
