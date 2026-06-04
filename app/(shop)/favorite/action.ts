"use server";

import { serverFetch } from "@/lib/auth";

export async function addToFavourites(item_id: string | number) {
  await serverFetch("/api/partner/Favourites/add", {
    method: "POST",
    body: JSON.stringify({ item_id }),
  });
}
export async function removeFromFavourites(item_id: string | number) {
  await serverFetch(`/api/partner/Favourites/delete/${item_id}`, {
    method: "DELETE",
  });
}

export const getFavouritesProducts = async () => {
  const res = await serverFetch("/api/partner/Favourites/get-list");
  const data = await res.json();

  return data;
};
