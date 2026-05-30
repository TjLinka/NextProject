"use client";
import { Button } from "@/components/UI/Button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Nullable } from "primereact/ts-helpers";
import { useEffect, useState } from "react";

export const TransferMoneyBetweenUsersModal = () => {
  const [summ, setSumm] = useState<Nullable<number>>();
  const [comm, setComm] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | number>("");
  const [usersList, setUsersList] = useState([]);
  const [password, setPassword] = useState<string>();
  useEffect(() => {
    async function getUsers() {
      const res = await fetch("/api/misc/users-list-sponsor", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setUsersList(data);
    }
    getUsers();
  }, []);

  const handleFilter = () => {
    console.log("222");
  };

  return (
    <div>
      <p>Баланс на Лицевом счете:</p>
      <div className=" mt-5">
        <form className="grid grid-cols-2 gap-5">
          <InputNumber
            inputId="currency-us"
            value={summ}
            onValueChange={(e) => setSumm(e.value)}
            mode="currency"
            currency="RUB"
            locale="ru"
          />
          <InputText value={comm} onChange={(e) => setComm(e.target.value)} />
          <Dropdown
            value={selectedUserId}
            filter
            showClear
            virtualScrollerOptions={{ itemSize: 38 }}
            onChange={(e) => setSelectedUserId(e.value)}
            options={usersList}
            optionLabel="name"
            placeholder="Выберите партёнра"
            className="w-full md:w-14rem"
          />
          <InputText
            className="w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="col-start-2">Превести</Button>
        </form>
      </div>
    </div>
  );
};
