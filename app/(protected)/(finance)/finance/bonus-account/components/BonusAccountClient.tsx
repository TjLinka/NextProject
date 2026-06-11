"use client";
import { Card } from "@/components/UI/Card";
import { getPersonalAccountInfo } from "@/dbQuery/dbQuerys";
import { getBonusAccountHistory } from "@/lib/actions";
import { localInt } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Nullable } from "primereact/ts-helpers";
import { useMemo, useState } from "react";

export default function BonusAccountClient() {
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

  const qc = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["bonus-account"],
    queryFn: async () => {
      if (dates) {
        return await getPersonalAccountInfo(dates[0], dates[1], 1);
      } else {
        return await getPersonalAccountInfo(null, null, 1);
      }
    },
  });

  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([]);

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
  const mutation = useMutation({
    mutationFn: getBonusAccountHistory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bonus-account"] });
    },
  });
  return (
    <>
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
          virtualScrollerOptions={{ itemSize: 46 }}
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
    </>
  );
}
