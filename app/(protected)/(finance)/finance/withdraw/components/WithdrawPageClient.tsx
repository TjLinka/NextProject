"use client";
import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { getWithdrawList } from "@/dbQuery/dbQuerys";
import { localInt } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { NewWithdrawModal } from "./NewWithdrawModal";
import { useWindowSize } from "@reactuses/core";

type ColRow = {
  dte: Date | null;
  doc_id: number | string;
  findte: Date | null;
  amount: number;
  status_name: string;
};

export const WithdrawPageClient = () => {
  const tableColumns = [
    {
      f: "doc_id",
      h: "ID",
    },
    {
      f: "dte",
      h: "Дата создания",
      formatter: (row: ColRow) => {
        return row.dte ? moment(row.dte).format("DD.MM.YYYY") : "-";
      },
    },
    {
      f: "findte",
      h: "Дата завершения",
      formatter: (row: ColRow) => {
        return row.findte ? moment(row.findte).format("DD.MM.YYYY") : "-";
      },
    },
    {
      f: "amount",
      h: "Сумма",
      formatter: (row: ColRow) => {
        return localInt(row.amount);
      },
    },
    {
      f: "status_name",
      h: "Статус",
      formatter: (row: ColRow) => {
        return <span className="capitalize">{row.status_name}</span>;
      },
    },
  ];
  const statusList = [
    {
      id: -1,
      text: "Отмена",
    },
    {
      id: 0,
      text: "Создана",
    },
    {
      id: 1,
      text: "Зарезервирована",
    },
    {
      id: 2,
      text: "Оплачена",
    },
    {
      id: 3,
      text: "Завершена",
    },
  ];

  const [openNewWithdrawModal, setopenNewWithdrawModal] =
    useState<boolean>(false);


  const {width, height} = useWindowSize()

  const [withdrawID, setwithdrawID] = useState<null | string>("");
  const [withdrawSearch, setwithdrawSearch] = useState<null | string>("");
  const [withdrawStatus, setwithdrawStatus] = useState<null | string | number>(
    null,
  );

  const { data: tableData } = useQuery({
    queryKey: ["withdrawlist", withdrawStatus, withdrawSearch],
    queryFn: async () => {
      return await getWithdrawList(
        withdrawID !== "" ? withdrawID : null,
        null,
        null,
        withdrawStatus,
      );
    },
  });

  return (
    <>
      <Button onClick={() => setopenNewWithdrawModal(true)}>
        Создат заявку
      </Button>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 mt-5">
        <Card title="Диапазон от и до"></Card>
        <Card title="Поиск по ID заявки">
          <InputText
            value={withdrawID}
            className="w-full"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setwithdrawID(e.currentTarget.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") setwithdrawSearch(withdrawID);
            }}
            placeholder="Укажите ID заявки"
          />
        </Card>
        <Card title="Поиск по статусу заявки">
          <Dropdown
            value={withdrawStatus}
            showClear
            optionValue="id"
            onChange={(e) => setwithdrawStatus(e.value)}
            options={statusList}
            optionLabel="text"
            placeholder="Укажите статус"
            className="w-full md:w-14rem"
          />
        </Card>
      </div>
      <Card className="mt-5">
        <DataTable
          scrollHeight={`${width > 800 ? '60' : '50'}vh`}
          scrollable
          emptyMessage="Нет данных"
          stripedRows
          value={tableData}
          tableStyle={{ minWidth: "50rem" }}
          size="small"
        >
          {tableColumns.map((c) => {
            return (
              <Column
                field={c.f}
                header={c.h}
                key={c.f}
                body={c.formatter}
              ></Column>
            );
          })}
        </DataTable>
      </Card>
      <Dialog
        draggable={false}
        style={{ width: "35vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Создание заявки на вывод средств"
        visible={openNewWithdrawModal}
        onHide={() => setopenNewWithdrawModal(false)}
      >
        <NewWithdrawModal />
      </Dialog>
    </>
  );
};
