/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Nullable } from "primereact/ts-helpers";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { getOrders } from "./actions";
import { localInt } from "@/lib/utils";
import moment from "moment";
import { Card } from "@/components/UI/Card";
import Link from "next/link";

export default function BasicDemo() {
  const [orders, setOrders] = useState([]);
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([]);
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

  useEffect(() => {
    async function getData() {
      const data = await getOrders();
      setOrders(data);
    }
    getData();
  }, []);

  const handleRangeSelect = async () => {
    if (dates) {
      const data = await getOrders(dates);
      setOrders(data);
    }
  };

  return (
    <div className="card">
      <Card className="w-fit" fit title="Диапазон">
        <Calendar
          value={dates}
          onChange={(e) => setDates(e.value)}
          locale="ru"
          onHide={handleRangeSelect}
          numberOfMonths={2}
          placeholder="Укажите диапазон от и до"
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
        />
      </Card>
      <Card className="mt-4">
        <DataTable
          value={orders}
          stripedRows
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
