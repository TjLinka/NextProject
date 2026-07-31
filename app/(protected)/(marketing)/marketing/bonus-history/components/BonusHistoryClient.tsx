/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/UI/Card";
import { localInt } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import _ from 'lodash'

export const BonusHistoryClient = () => {
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [footerTableData, setFooterTableData] = useState([]);
  const [footerBonusDetailsTableData, setFooterBonusDetailsTableData] =
    useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState<null | string>(null);
  const [selectedBonusName, setSelectedBonusName] = useState<null | string>(
    null,
  );

  const tableColumns = [
    {
      f: "comdte",
      h: "Период",
      formatter: (row: any) => {
        return (
          <span className=" capitalize">
            {moment(row.comdte).format("MMM YYYY")}
          </span>
        );
      },
    },
    {
      f: "amount",
      h: "Итого",
      formatter: (row: any) => {
        return (
          <span
            onClick={() => openBonusInfo(row.comdte)}
            className="text-(--main-text) font-semibold cursor-pointer hover:underline"
          >
            {localInt(row.amount)}
          </span>
        );
      },
    },
    // {
    //   f: "comm",
    //   h: "Комментарий",
    //   formatter: (row: any) => {
    //     return row.comm;
    //   },
    // },
  ];
  const footerTableFields = [
    {
      f: "stage",
      h: "Номер бонуса",
    },
    {
      f: "stage_name",
      h: "Наименование",
    },
    {
      f: "amount",
      h: "Итого",
      formatter: (row: any) => {
        return (
          <span
            onClick={() => openBonuseDetails(row)}
            className="text-(--main-text) font-semibold cursor-pointer hover:underline"
          >
            {localInt(row.amount)}
          </span>
        );
      },
    },
  ];
  const footerBonusDetailsTableFields = [
    {
      f: "from_agent",
      h: "ID Партнёра",
    },
    {
      f: "from_agent_name",
      h: "ФИО Партнёра",
    },
    {
      f: "bonus",
      h: "Бонус",
      formatter: (row: any) => {
        return localInt(row.bonus);
      },
    },
    {
      f: "paydte",
      h: "Дата зачисления на ЛС",
      formatter: (row: any) => {
        if (row.paydte === null) return "-";
        return moment(row.paydte).format("DD.MM.YYYY");
      },
    },
  ];
  const { data = [] } = useQuery({
    queryKey: ["bonus-history"],
    queryFn: async () => {
      const res = await fetch(`/api/marketing/get-period-info?m_id=0`);
      const data = await res.json();
      return data;
    },
  });

  const openBonusInfo = async (comdte: string) => {
    setSelectedPeriod(comdte);
    const res = await fetch("/api/marketing/agent-bonuses", {
      method: "POST",
      body: JSON.stringify({
        m_id: 0,
        comdte,
      }),
    });
    setFooterTableData(await res.json());
    setFirstModalOpen(true);
  };

  const openBonuseDetails = async (row: any) => {
    setSelectedBonusName(row.stage_name);
    const res = await fetch("/api/marketing/bonus-detail", {
      method: "POST",
      body: JSON.stringify({
        m_id: 0,
        comdte: selectedPeriod,
        stage: row.stage,
      }),
    });
    const data = await res.json();
    console.log(data);
    setFooterBonusDetailsTableData(data);

    setSecondModalOpen(true);
  };

  return (
    <>
      <Card>
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
        draggable={false}
        style={{ width: "65vw" }}
        breakpoints={{ "1024px": "65vw", "641px": "90vw" }}
        header={`Бонусы за период - ${_.capitalize(moment(selectedPeriod).format("MMM YYYY"))}`}
        visible={firstModalOpen}
        onHide={() => setFirstModalOpen(false)}
      >
        <DataTable
          scrollHeight="40vh"
          scrollable
          emptyMessage="Нет данных"
          stripedRows
          style={{ maxHeight: "500px" }}
          value={footerTableData}
          tableStyle={{ minWidth: "50rem" }}
          size="small"
        >
          {footerTableFields.map((c) => {
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
      </Dialog>
      <Dialog
        draggable={false}
        style={{ width: "65vw" }}
        breakpoints={{ "1024px": "65vw", "641px": "90vw" }}
        header={`Детализация бонуса -  ${selectedBonusName}`}
        visible={secondModalOpen}
        onHide={() => setSecondModalOpen(false)}
      >
        <DataTable
          scrollHeight="40vh"
          scrollable
          style={{ maxHeight: "500px" }}
          emptyMessage="Нет данных"
          stripedRows
          value={footerBonusDetailsTableData}
          tableStyle={{ minWidth: "50rem" }}
          size="small"
        >
          {footerBonusDetailsTableFields.map((c) => {
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
      </Dialog>
    </>
  );
};
