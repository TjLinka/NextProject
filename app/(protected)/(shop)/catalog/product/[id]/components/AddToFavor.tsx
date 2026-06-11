"use client";
import { Product } from "../../../types";
import * as motion from "motion/react-client";
import Image from "next/image";
import { useIsFavourite, useToggleFavourite } from "@/hooks/useFavorites";

export const AddToFavor = ({ product }: { product: Product }) => {
  const isFavourite = useIsFavourite(product.id);
  const { mutate: toggleFavourite } = useToggleFavourite();

  const handleFavouritesAction = async () => {
    // api/partner/Favourites/delete/{id}
    toggleFavourite({ id: product.id, isFavourite });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleFavouritesAction}
      className="w-fit"
    >
      <Image
        src={`/icons/Heart${isFavourite ? "Fill" : ""}.svg`}
        width={100}
        height={100}
        alt="Favor Icon"
        className="md:w-10.5 w-7 md:h-10.5 h-7 cursor-pointer"
      />
    </motion.div>
  );
};
