/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/UI/Button";
import { useRequisStore } from "@/store/requisStore";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputMask } from "primereact/inputmask";
import z from "zod";

export const RequisModal = ({ close }: { close: () => void }) => {
  const requis = useRequisStore((state) => state.requis);
  const saveRequis = useRequisStore((state) => state.setRequis);
  const clearRequis = useRequisStore((state) => state.clearRequis);

  const [paymentAccount, setpaymentAccount] = useState(requis.paymentAccount);
  const [fio, setfio] = useState(requis.fio);
  const [inn, setinn] = useState(requis.inn);
  const [corAccount, setcorAccount] = useState(requis.corAccount);
  const [bik, setbik] = useState(requis.bik);
  const [address, setaddress] = useState(requis.address);
  const [bank, setbank] = useState(requis.bank);
  const [work_type, setwork_type] = useState(requis.work_type);
  const [ogrn, setogrn] = useState(requis.ogrn);

  const [ZodError, setZodError] = useState({
    paymentAccount: "",
    fio: "",
    inn: "",
    corAccount: "",
    bik: "",
    address: "",
    bank: "",
    ogrn: "",
  });

  const RequisSchema = z.object({
    paymentAccount: z
      .string()
      .min(20, "Некорретные данные")
      .max(20, "Некорретные данные"),
    fio: z.string().nonempty("Поле не должно быть пустым"),
    inn: z.string().min(12, "Некорретные данные").max(12, "Некорретные данные"),
    corAccount: z
      .string()
      .min(20, "Некорретные данные")
      .max(20, "Некорретные данные"),
    bik: z.string().min(9, "Некорретные данные").max(9, "Некорретные данные"),
    address: z.string().nonempty("Поле не должно быть пустым"),
    bank: z.string().nonempty("Поле не должно быть пустым"),
    ogrn: z
      .string()
      .min(20, "Некорретные данные")
      .max(20, "Некорретные данные"),
  });

  const handleSave = () => {
    const result = RequisSchema.safeParse({
      paymentAccount,
      fio,
      inn,
      corAccount,
      bik,
      address,
      bank,
      ogrn,
    });
    if (!result.success) {
      const errorsList: any = {};
      result.error.issues.forEach((err: any) => {
        errorsList[err.path[0]] = err.message;
      });
      setZodError(errorsList);
      return;
    }
    setZodError({
      paymentAccount: "",
      fio: "",
      inn: "",
      corAccount: "",
      bik: "",
      address: "",
      bank: "",
      ogrn: "",
    });
    saveRequis({
      paymentAccount,
      fio,
      inn,
      corAccount,
      bik,
      address,
      bank,
      work_type,
      ogrn,
    });
    close();
  };

  const handleClearRequis = () => {
    confirmDialog({
      message: "Вы уверны, что хотите очистить реквизиты?",
      header: "Очистка реквизитов",
      // icon: "pi pi-info-circle",
      rejectLabel: "Нет",
      acceptLabel: "Да",
      rejectClassName: "bg-red-500! border-0! w-2/3!",
      acceptClassName: "border-0! w-1/3!",
      defaultFocus: "reject",
      accept: () => {
        clearRequis();
        setpaymentAccount("");
        setfio("");
        setinn("");
        setcorAccount("");
        setbik("");
        setaddress("");
        setbank("");
        setwork_type(0);
        setogrn("");
        // close();
      },
      reject: () => {},
    });
  };

  return (
    <div>
      <Button onClick={handleClearRequis}>Очистить реквизиты</Button>
      <div className="grid md:grid-cols-2 gap-5 gap-y-2 mt-5">
        <div className="">
          <p>ФИО</p>
          <InputText
            value={fio}
            className="w-full"
            onChange={(e) => setfio(e.target.value)}
          />
          <small className="text-red-500">{ZodError.fio}</small>
        </div>
        <div className="">
          <p>ИНН</p>
          <InputText
            keyfilter="int"
            value={inn}
            className="w-full"
            onChange={(e) => setinn(e.target.value)}
          />
          <small className="text-red-500">{ZodError.inn}</small>
        </div>
        <div className="">
          <p>БИК</p>
          <InputText
            value={bik}
            className="w-full"
            onChange={(e) => setbik(e.target.value)}
          />
          <small className="text-red-500">{ZodError.bik}</small>
        </div>
        <div className="">
          <p>Адрес</p>
          <InputText
            value={address}
            className="w-full"
            onChange={(e) => setaddress(e.target.value)}
          />
          <small className="text-red-500">{ZodError.address}</small>
        </div>
        <div className="">
          <p>Банк</p>
          <InputText
            value={bank}
            className="w-full"
            onChange={(e) => setbank(e.target.value)}
          />
          <small className="text-red-500">{ZodError.bank}</small>
        </div>
        <div className="">
          <p>Корр. счет</p>
          <InputText
            value={corAccount}
            className="w-full"
            onChange={(e) => setcorAccount(e.target.value)}
          />
          <small className="text-red-500">{ZodError.corAccount}</small>
        </div>
        <div className="">
          <p>Расчетный счет</p>
          <InputText
            value={paymentAccount}
            className="w-full"
            onChange={(e) => setpaymentAccount(e.target.value)}
          />
          <small className="text-red-500">{ZodError.paymentAccount}</small>
        </div>
        <div className="">
          <p>ОГРНИП</p>
          <InputText
            value={ogrn}
            className="w-full"
            onChange={(e) => setogrn(e.target.value)}
          />
          <small className="text-red-500">{ZodError.ogrn}</small>
        </div>
      </div>
      <Button className="mt-5 w-full" onClick={handleSave}>
        Сохранить и продолжить
      </Button>
      <ConfirmDialog draggable={false} />
    </div>
  );
};
