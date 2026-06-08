"use client";
import { Button } from "@/components/UI/Button";
import { getBalance } from "@/dbQuery/dbQuerys";
import { transferMoneyBetweenUser } from "@/lib/actions";
import { localInt } from "@/lib/utils";
import { useAgentStore } from "@/store/agentStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Nullable } from "primereact/ts-helpers";
import { useEffect, useState } from "react";

export const TransferMoneyBetweenUsersModal = () => {
  const [summ, setSumm] = useState<Nullable<number>>(null);
  const [comm, setComm] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | number | null>(
    null,
  );

  const queryClient = useQueryClient();

  const userId = useAgentStore((state) => state);
  const [usersList, setUsersList] = useState([]);
  const [password, setPassword] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      return await getBalance();
    },
  });

  console.log(data);

  const mutation = useMutation({
    mutationFn: transferMoneyBetweenUser,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["balance"] }),
        queryClient.invalidateQueries({ queryKey: ["personal_acc"] }),
      ]);
    },
  });

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      agent2_id: selectedUserId,
      agent_id: 105,
      idacc: 0,
      password,
      comm,
      amount: summ,
      check_password: true,
    });
  };

  return (
    <div>
      {!isLoading ? (
        <p>Баланс на Лицевом счете: {localInt(data[0]?.summ)}</p>
      ) : (
        <Skeleton width="50%" className="mb-2 md:w-1/2 w-full"></Skeleton>
      )}
      <div className="mt-5">
        <form
          className="md:grid grid-cols-2 flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
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
            optionValue="id"
            virtualScrollerOptions={{ itemSize: 38 }}
            onChange={(e) => setSelectedUserId(e.value)}
            options={usersList}
            optionLabel="name"
            placeholder="Выберите партёнра"
            className="md:w-full md:w-14rem"
          />
          <InputText
            className="w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="col-start-2">Перевести</Button>
        </form>
      </div>
    </div>
  );
};
