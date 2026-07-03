"use client";

import { finishPayment } from "@/lib/actions";
import { useCartStore } from "@/store/cartStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckPayment() {
  const searchParams = useSearchParams();
  const paymentSystem = searchParams.get("paymentSystem") ?? "";
  const invoiceId = searchParams.get("invoiceId") ?? "";
  const [fromMessage, setFormMessage] = useState<string>("");

  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (invoiceId) {
      async function endPayment() {
        await finishPayment(invoiceId);
        setFormMessage("Оплата прошла успешно");
        clearCart();
      }
      endPayment();
    }
  }, [invoiceId]);

  return (
    <>
      <div className="flex justify-center h-full items-center">
        {fromMessage}
      </div>
    </>
  );
}
