/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/UI/Button";
import { Caption } from "@/components/UI/Caption";
import { Card } from "@/components/UI/Card";
import { localInt } from "@/lib/utils";
import moment from "moment";
import Link from "next/link";
import { CartComponent } from "./components/CartComplect";
import { getOrderInfo } from "@/dbQuery/dbQuerys";

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
export default async function OrderPage({ params }: PageProps) {
  const { id } = await params;

  const { sale, cart = [], delivery } = await getOrderInfo(id);
  return (
    <>
      <Link href={"/order-history"}>
        <Button>Назад</Button>
      </Link>
      <p className="text-3xl font-semibold border-b-2 border-(--main-color) inline-block mt-5">
        Заказ № {id}
      </p>
      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <Card>
          <div className="grid grid-cols-2 gap-5">
            <Caption title="Сумма заказа" text={localInt(sale.price_total)} />
            <Caption title="Вес заказа" text={localInt(sale.points_total)} />
            <Caption title="Всего единиц" text={localInt(sale.cnt_total)} />
            <Caption title="Всего наименований" text={localInt(sale.items)} />
          </div>
        </Card>
        <Card>
          <div className="grid grid-cols-2 md:gap-5 gap-2">
            <div className="col-span-2 grid md:grid-cols-3 grid-cols-2">
              <Caption
                title="Дата отгрузки"
                text={
                  sale.findte ? moment(sale.findte).format("DD.MM.YYYY") : "-"
                }
              />
              <Caption
                title="Служба доставки"
                text={delivery.delivery_type_name}
              />
              <Caption title="Трек-номер" text={delivery.tracknum || "-"} />
            </div>
            <Caption
              className="col-span-2"
              title="Адрес доставки"
              text={delivery.recipient_address}
            />
          </div>
        </Card>
      </div>
      <p className="text-3xl font-semibold border-b-2 border-(--main-color) inline-block mt-5">
        Состав заказа:
      </p>
      <Card className="mt-5">
        <CartComponent data={cart} />
      </Card>
    </>
  );
}
