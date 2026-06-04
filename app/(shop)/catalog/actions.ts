"use server";

import { serverFetch } from "@/lib/auth";

export const getShopCatalog = async (find_str?: string) => {
  let params;
  if (find_str) {
    params = new URLSearchParams({
      find_str: find_str
    });
  }
  console.log(params);
  console.log();
  
  const res = await serverFetch(`/api/partner/Catalog/get-catalog?${params}`);
  // const res = await serverFetch("/api/partner/Catalog/get-catalog-bytyp", {
  //   method: 'post',
  //   body: JSON.stringify({
  //     i_typ: 0,
  //     find_str,
  //     show_mine: false,
  //     offset: 0,
  //     show_count: 20,
  //   })
  // });
  const data = await res.json();

  return data;
};
export const getShopCategoryes = async () => {
  const res = await serverFetch("/api/partner/Catalog/get-catalog-sections");
  const data = await res.json();
  return data;
};
