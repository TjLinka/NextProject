import { Card } from "@/components/UI/Card";
import {
  getBalance,
  getDashboard,
  getNewsList,
  getOrdersList,
} from "@/dbQuery/dbQuerys";
import { localInt } from "@/lib/utils";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export default async function Dashboard() {
  const dashBoardData = await getDashboard();
  const balance = await getBalance();
  const orderList = (await getOrdersList(null, null)).splice(0, 2);
  const news = (await getNewsList()).splice(0, 2);

  console.log(orderList);

  return (
    <div className="grid lg:grid-cols-4 gap-3">
      <Card title="Персональный счет">
        <div className="flex gap-2 items-center h-full">
          <Image
            alt="Wallet Icon"
            width={100}
            height={100}
            src={"/icons/FinanceManager.svg"}
            className="w-5 h-5"
          />
          <Link href={"/finance/personal-account"}>
            <span className="font-semibold leading-[100%] text-(--main-text) hover:underline">
              {localInt(balance[0].summ)}
            </span>
          </Link>
        </div>
      </Card>
      <Card title="Бонусный счет">
        <div className="flex gap-2 items-center h-full">
          <Image
            alt="Wallet Icon"
            width={100}
            height={100}
            src={"/icons/FinanceManager.svg"}
            className="w-5 h-5"
          />
          <span className="font-semibold leading-[100%]">
            {localInt(balance[1].summ)}
          </span>
        </div>
      </Card>
      <Card title="Ранг" className="lg:col-span-2">
        <div className="md:flex justify-between">
          <div>
            <div>
              <strong>Текущий</strong> - <strong>Железо</strong>
            </div>
            <div>
              <small>Условия выполнены</small>
            </div>
          </div>
          <div>
            <div className="flex md:justify-end">
              <strong>Следующий</strong> - <strong>Бронза</strong>
            </div>
            <div>
              <small>
                Необходимо - пригласить <strong>5</strong> партнёров
              </small>
            </div>
          </div>
        </div>
      </Card>
      <Card title="Пополнение/Вывод">
        <Link
          href={"#"}
          className="text-(--main-color) font-semibold hover:underline"
        >
          Пополнить счет
        </Link>
        <br />
        <Link
          href={"/finance/withdraw"}
          className="text-(--main-color) font-semibold hover:underline"
        >
          Вывести со счета
        </Link>
      </Card>
      <Card title="Маркетинг"></Card>
      <Card
        title="График"
        className="lg:row-start-2 lg:row-span-2 lg:col-start-2 lg:col-span-3"
      ></Card>
      <Card
        title="Статистика по рангам"
        className="lg:row-start-4 lg:row-span-2 lg:col-start-1 lg:col-span-3"
      ></Card>
      <Card title="Статус заказа">
        {orderList.map((o) => {
          return (
            <p key={o.id} className="text-sm">
              Заказ{" "}
              <Link
                href={`/order-history/order/${o.id}`}
                className="text-(--main-color) font-semibold hover:underline"
              >
                №{o.id}
              </Link>{" "}
              от {moment(o.dte).format("DD.MM.YYYY")} -{" "}
              <span className="capitalize">{o.status}</span>
            </p>
          );
        })}
      </Card>
      <Card title="Новости">
        {news.map((n) => {
          return (
            <Link
              href={`/news/${n.id}`}
              key={n.id}
              className="text-(--main-text) font-semibold hover:underline block"
            >
              {n.title}
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
