/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";
import { localInt } from "@/lib/utils";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Card } from "@/components/UI/Card";
import { Button } from "@/components/UI/Button";
import { Nullable } from "primereact/ts-helpers";
import { TransferMoneyBetweenUsersModal } from "./modals/TransferMoneyBetweenUsers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPersonalAccountHistory } from "@/lib/actions";
import { getPersonalAccountInfo } from "@/dbQuery/dbQuerys";
import Link from "next/link";

export const PersonalAccoutClient = () => {
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
      formatter: (row: { income: number }) => {
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
      formatter: (row: { outcome: number }) => {
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
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const { data = [] } = useQuery({
    queryKey: ["personal_acc"],
    queryFn: async () => {
      if (dates) {
        return await getPersonalAccountInfo(dates[0], dates[1]);
      } else {
        return await getPersonalAccountInfo(null, null);
      }
    },
  });

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: getPersonalAccountHistory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["personal_acc"] });
    },
  });

  const totals = useMemo(() => {
    return {
      incomes: localInt(
        data.reduce(
          (acc: number, row: { income: number }) => acc + row.income,
          0,
        ),
      ),
      outcome: localInt(
        data.reduce(
          (acc: number, row: { outcome: number }) => acc + row.outcome,
          0,
        ),
      ),
      rest: localInt(
        data.reduce(
          (acc: number, row: { income: number }) => acc + Number(row.income),
          0,
        ) -
          data.reduce(
            (acc: number, row: { outcome: number }) =>
              acc + Number(row.outcome),
            0,
          ),
      ),
    };
  }, [data]);
  const handleRangeSelect = async () => {
    if (dates) {
      mutation.mutate({
        from: moment(dates[0]).format("YYYY-MM-DD"),
        to: moment(dates[1]).format("YYYY-MM-DD"),
      });
    }
  };
  return (
    <>
      <div className="flex md:flex-row flex-col md:justify-between md:items-end">
        <Card title="Диапозон" className="md:w-fit w-full">
          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value)}
            locale="ru"
            onHide={handleRangeSelect}
            placeholder="Укажите диапазон от и до"
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
          />
        </Card>
        <div className="flex md:flex-row flex-col md:gap-2 gap-4 md:mt-0 mt-2">
          <Button onClick={() => setVisible(true)}>
            Перевести средства между партнёрами
          </Button>
          <Button>Перевод с лицевого на товарный счёт</Button>
          <Link href={`/finance/withdraw`} className="md:w-auto w-full">
            <Button className="md:w-auto w-full">Вывод средств</Button>
          </Link>
        </div>
      </div>
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
            <span className="font-semibold text-red-500">{totals.outcome}</span>
          </div>
          <div>
            <span className="text-lg font-semibold">Остаток: </span>
            <span className="font-semibold">{totals.rest}</span>
          </div>
        </div>
      </Card>
      <Card className="mt-5">
        <DataTable
          scrollHeight="60vh"
          scrollable
          emptyMessage="Нет данных"
          stripedRows
          value={data}
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
        header="Перевод средств между партнёрами"
        visible={visible}
        draggable={false}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
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
