/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Nullable } from "primereact/ts-helpers";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { localInt } from "@/lib/utils";
import moment from "moment";
import { Card } from "@/components/UI/Card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getOrdersList } from "@/dbQuery/dbQuerys";

export default function BasicDemo() {
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  const columns = [
    {
      f: "id",
      h: "ID",
      formatter: (row: any) => {
        return (
          <Link
            href={`/order-history/order/${row.id}`}
            className="text-(--main-text) hover:underline"
          >
            {row.id}
          </Link>
        );
      },
    },
    {
      f: "price_total",
      h: "Сумма",
      formatter: (row: any) => {
        return localInt(row.price_total);
      },
    },
    {
      f: "status",
      h: "Статус",
      formatter: (row: any) => {
        return <span className="capitalize">{row.status}</span>;
      },
    },
    {
      f: "dte",
      h: "Дата создания",
      formatter: (row: any) => {
        return moment(row.dte).format("DD.MM.YYYY");
      },
    },
  ];
  const { data } = useQuery({
    queryKey: ["order_list", dates],
    queryFn: async () => {
      return await getOrdersList(
        dates
          ? dates[0]
            ? moment(dates[0]).format("YYYY-MM-DD")
            : null
          : null,
        dates
          ? dates[1]
            ? moment(dates[1]).format("YYYY-MM-DD")
            : null
          : null,
      );
    },
  });

  return (
    <div className="card">
      <Card className="w-fit" fit title="Диапазон">
        <Calendar
          value={dates}
          showButtonBar
          onChange={(e) => setDates(e.value)}
          locale="ru"
          numberOfMonths={2}
          placeholder="Укажите диапазон от и до"
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
        />
      </Card>
      <Card className="mt-4">
        <DataTable
          value={data}
          stripedRows
          scrollable
          scrollHeight="60vh"
          tableStyle={{ minWidth: "50rem" }}
          size="small"
        >
          {columns.map((c) => {
            return (
              <Column
                sortable
                field={c.f}
                header={c.h}
                key={c.f}
                body={c.formatter}
              ></Column>
            );
          })}
        </DataTable>
      </Card>
    </div>
  );
}
