/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { localInt } from "@/lib/utils";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
export const CartComponent = (data: any) => {
  const tableColumns = [
    {
      f: "article",
      h: "Артикул",
      formatter: (row: any) => {
        return row.article;
      },
    },
    {
      f: "name",
      h: "Название",
      formatter: (row: any) => {
        return row.name;
      },
    },
    {
      f: "price",
      h: "Цена",
      formatter: (row: any) => {
        return localInt(row.price);
      },
    },
    {
      f: "cnt",
      h: "Количество",
      formatter: (row: any) => {
        return localInt(row.cnt);
      },
    },
    {
      f: "price_total",
      h: "Стоимость",
      formatter: (row: any) => {
        return localInt(row.price_total);
      },
    },
  ];
  return (
    <>
      <DataTable
        scrollHeight="40vh"
        scrollable
        stripedRows
        removableSort
        value={data.data}
        tableStyle={{ minWidth: "50rem" }}
        // size="small"
      >
        {tableColumns.map((c) => {
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
    </>
  );
};
