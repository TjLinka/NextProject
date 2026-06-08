/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/UI/Button";
import { getBalance } from "@/dbQuery/dbQuerys";
import { localInt } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Skeleton } from "primereact/skeleton";
import { Nullable } from "primereact/ts-helpers";
import { useState } from "react";
import { RequisModal } from "./RequisModal";
import { useRequisStore } from "@/store/requisStore";

export const NewWithdrawModal = () => {
  const requis = useRequisStore((state) => state.requis);

  const isReqGood = Object.keys(requis).some((key: any) => requis[key]);

  const [summ, setSumm] = useState<Nullable<number>>(null);
  const [openRequisModal, setopenRequisModal] = useState<boolean>(false);
  const { data: balance, isLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: getBalance,
  });

  return (
    <>
      <div>
        <p className="font-semibold">Укажите сумму, которую хотите вывести</p>
        {!isLoading ? (
          <p className="text-sm">
            Баланс на Лицевом счете: {localInt(balance[0]?.summ)}
          </p>
        ) : (
          <Skeleton width="50%" className="mb-2 md:w-1/2 w-full"></Skeleton>
        )}
        <InputNumber
          inputId="currency-us"
          value={summ}
          onValueChange={(e) => setSumm(e.value)}
          mode="currency"
          currency="RUB"
          locale="ru"
          className="w-full mt-2"
        />
      </div>
      <div className="mt-5">
        <p className="font-semibold mb-2">Реквизиты</p>
        <Button className="w-full" onClick={() => setopenRequisModal(true)}>
          {isReqGood ? (
            "Проверить"
          ) : (
            <div className="flex font-semibold items-center">
              Добавить
              <Image
                src={"/icons/SignPlus.svg"}
                width={200}
                height={200}
                alt=""
                className="w-7 h-7"
              />
            </div>
          )}
        </Button>
      </div>
      <div className="mt-5">
        <p className="font-semibold mb-2">Комментарий</p>
        <textarea className="border border-[#d1d5db] w-full h-30 rounded-lg resize-none outline-(--main-color) p-2"></textarea>
      </div>
      <Button className="w-full mt-5">Вывести</Button>
      <Dialog
        draggable={false}
        style={{ width: "30vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Реквизиты"
        visible={openRequisModal}
        closeOnEscape={true}
        onHide={() => setopenRequisModal(false)}
      >
        <RequisModal close={() => setopenRequisModal(false)} />
      </Dialog>
    </>
  );
};
