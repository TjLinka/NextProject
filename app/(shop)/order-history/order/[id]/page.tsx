/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/UI/Button";
import { Caption } from "@/components/UI/Caption";
import { Card } from "@/components/UI/Card";
import { serverFetch } from "@/lib/auth";
import { localInt } from "@/lib/utils";
import moment from "moment";
import Link from "next/link";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { CartComponent } from "./components/CartComplect";

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
export default async function OrderPage({ params }: PageProps) {
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

  const { id } = await params;
  const res = serverFetch(`/api/partner/Webshop/data/${id}`);
  const data = await (await res).json();
  const res2 = serverFetch(`/api/partner/Webshop/detail/${id}`);
  const data2 = await (await res2).json();
  const res3 = serverFetch(`/api/partner/Delivery/get/${id}`);
  const data3 = await (await res3).json();
  return (
    <>
      <Link href={"/order-history"}>
        <Button>Назад</Button>
      </Link>
      <p className="text-3xl font-semibold border-b-2 border-(--main-color) inline-block mt-5">
        Заказ № {id}
      </p>
      <div className="grid grid-cols-2 gap-5 mt-5">
        <Card>
          <div className="grid grid-cols-2 gap-5">
            <Caption title="Сумма заказа" text={localInt(data.price_total)} />
            <Caption title="Вес заказа" text={localInt(data.points_total)} />
            <Caption title="Всего единиц" text={localInt(data.cnt_total)} />
            <Caption title="Всего наименований" text={localInt(data.items)} />
          </div>
        </Card>
        <Card>
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 grid grid-cols-3">
              <Caption
                title="Дата отгрузки"
                text={data.findte ? moment(data.findte).format("DD.MM.YYYY") : '-' }
              />
              <Caption
                title="Служба доставки"
                text={data3.delivery_type_name}
              />
              <Caption title="Трек-номер" text={data3.tracknum || "-"} />
            </div>
            <Caption
              className="col-span-2"
              title="Адрес доставки"
              text={data3.recipient_address}
            />
          </div>
        </Card>
        {/* <Card>
          <div className="grid grid-cols-2 gap-5">
            <Caption
              title="Дата оплаты"
              text={moment(data.dte).format("DD.MM.YYYY")}
            />
          </div>
        </Card> */}
      </div>
      <p className="text-3xl font-semibold border-b-2 border-(--main-color) inline-block mt-5">
        Состав заказа:
      </p>
      <Card className="mt-5">
        <CartComponent data={data2} />
      </Card>
    </>
  );
}
