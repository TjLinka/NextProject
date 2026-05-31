import { getShopCatalog, getShopCategoryes } from "./actions";
import { ShopCatalogClient } from "./components/ShopCatalogClient";
import { Product } from "./types";

export default async function ShopCatalog() {
  const data: Product[] = await getShopCatalog();
  const catagoryes = await getShopCategoryes()

  return <ShopCatalogClient data={data} catagoryes={catagoryes} />;
}
