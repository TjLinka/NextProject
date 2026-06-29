"use client";
import { Button } from "@/components/UI/Button";
import { CancleOrder } from "@/lib/actions";



export const CancleOrderButton = ({id}: {id: string | number}) => {
  const handleCancleOrder = async () => {
    await CancleOrder(id);
  };

  return (
    <Button onClick={handleCancleOrder} className="bg-red-600 text-white">
      Отменить заказ
    </Button>
  );
};
