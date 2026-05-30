/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";
import { localInt } from "@/lib/utils";
import moment from "moment";
import { Card } from "@/components/UI/Card";
import { Button } from "@/components/UI/Button";
import { TransferMoneyBetweenUsersModal } from "./modals/TransferMoneyBetweenUsers";

export const PersonalAccoutClient = ({ data }: { data: [] }) => {
  const tableColumns = [
    {
      f: "dte",
      h: "Дата операции",
      formatter: (row: any) => {
        return moment(row.dte).format("DD.MM.YYYY");
      },
    },
    {
      f: "income",
      h: "Поступление",
      formatter: (row: any) => {
        return (
          <div className="text-green-500 font-semibold">
            {row.income !== 0 && localInt(row.income)}
          </div>
        );
      },
    },
    {
      f: "outcome",
      h: "Списание",
      formatter: (row: any) => {
        return (
          <div className="text-red-500 font-semibold">
            {row.outcome !== 0 && localInt(row.outcome)}
          </div>
        );
      },
    },
    {
      f: "typname",
      h: "Тип операции",
      formatter: (row: any) => {
        return row.typname;
      },
    },
    {
      f: "comm",
      h: "Комментарий",
      formatter: (row: any) => {
        return row.comm;
      },
    },
  ];
  const [visible, setVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState(data);

  const totals = useMemo(() => {
    return {
      incomes: localInt(tableData.reduce((acc, row) => acc + row.income, 0)),
      outcome: localInt(tableData.reduce((acc, row) => acc + row.outcome, 0)),
      rest: localInt(
        tableData.reduce((acc, row) => acc + Number(row.income), 0) -
          tableData.reduce((acc, row) => acc + Number(row.outcome), 0),
      ),
    };
  }, [tableData]);

  return (
    <>
      <div className="flex justify-between items-center">
        <Card fit>1</Card>
        <div className="flex gap-4">
          <Button onClick={() => setVisible(true)}>
            Перевести средства между партнёрами
          </Button>
          <Button>Перевод с лицевого на товарный счёт</Button>
          <Button>Вывод средств</Button>
        </div>
      </div>
      <Card>
        <DataTable
          scrollHeight="60vh"
          scrollable
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
      <Card className="mt-5">
        <div className="flex justify-around">
          <div>
            <span className="text-lg font-semibold">Пополнение: </span>
            <span className="font-semibold text-green-500">
              {totals.incomes}
            </span>
          </div>
          <div>
            <span className="text-lg font-semibold">Списание: </span>
            <span className="font-semibold text-red-500">{totals.incomes}</span>
          </div>
          <div>
            <span className="text-lg font-semibold">Остаток: </span>
            <span className="font-semibold">{totals.rest}</span>
          </div>
        </div>
      </Card>
      <Dialog
        header="Перевод средств между партнёрами"
        visible={visible}
        draggable={false}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <TransferMoneyBetweenUsersModal />
      </Dialog>
    </>
  );
};
