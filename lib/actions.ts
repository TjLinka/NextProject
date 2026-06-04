"use server";
import { serverFetch } from "@/lib/auth";
import { transferMoneyBetweenUserRequest } from "@/requsetModel/types";
import moment from "moment";
import { Nullable } from "primereact/ts-helpers";

export async function getUser() {
  const res = await serverFetch("/api/partner/Agent/get-agent-profile-info");
  const res2 = await serverFetch("/api/partner/Agent/sponsor-get");
  const res3 = await serverFetch("/api/partner/SocialMedia/get/105");
  const res4 = await serverFetch("/api/partner/Account/get-short-info");

  const data = {
    agentInfo: await res.json(),
    sponsorInfo: await res2.json(),
    socialsInfo: await res3.json(),
    agentBalance: await res4.json(),
  };

  return data;
}

export const getBalance = async () => {
  const res = await serverFetch("/api/partner/Account/get-short-info");
  const data = await res.json();

  return data;
};

export const transferMoneyBetweenUser = async ({
  agent_id,
  agent2_id,
  amount,
  idacc,
  comm,
  password,
  check_password = true,
}: transferMoneyBetweenUserRequest) => {
  await serverFetch(`/api/partner/Transfer/transfer`, {
    method: "POST",
    body: JSON.stringify({
      agent_id,
      agent2_id,
      amount,
      idacc,
      comm,
      password,
      check_password,
    }),
  });
};

export const getPersonalAccountHistory = async ({
  from,
  to,
}: {
  from: Date | null | string;
  to: Date | null | string;
}) => {
  console.log(from, to);

  const res = await serverFetch("/api/partner/Account/get-operations/0", {
    method: "POST",
    body: JSON.stringify({
      from: from ? moment(from).format("YYYY-MM-DD") : null,
      to: to ? moment(to).format("YYYY-MM-DD") : null,
    }),
  });
  const data = await res.json();
  return data;
};

export const createDialog = async ({
  name,
  title,
  sender,
  reciever,
}: {
  name: string | null;
  title: string | null;
  sender: number;
  reciever: number;
}) => {
  await serverFetch("/api/partner/Dialogs/update", {
    method: "POST",
    body: JSON.stringify({
      name,
      title,
      sender,
      reciever,
    })
  });
};
