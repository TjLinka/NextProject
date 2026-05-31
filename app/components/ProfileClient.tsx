"use client";

import { Button } from "@/components/UI/Button";
import { Caption } from "@/components/UI/Caption";
import { Card } from "@/components/UI/Card";
import { localInt } from "@/lib/utils";
import { User } from "@/types/user/types";
import Image from "next/image";
import Link from "next/link";

type socialsInfo = {
  nickname: string;
  short_link: string;
  social_media_id: number;
  readonly social_media_name: string;
};
type balanceInfo = {
  name: string;
  readonly id: number;
  readonly summ: number;
};

export default function ProfileClient({
  agentInfo,
  sponsorInfo,
  socialsInfo,
  agentBalance,
}: {
  agentInfo: User;
  sponsorInfo: User;
  agentBalance: balanceInfo[];
  socialsInfo: socialsInfo[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center justify-between gap-5">
          <Image
            alt="User Avatar"
            width={500}
            height={500}
            src={agentInfo.avatar}
            className="w-20 rounded-full"
          />
          <p className="text-2xl font-semibold">{agentInfo.fullname}</p>
        </div>
        <Link href={`/edit-profile`} className="col-span-2">
          <Button className="w-full">Редактировать</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-5 items-start mt-10">
        <div>
          <Card title="Личные данные" titleClass="text-xl">
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <Caption title="ID" text={agentInfo.id} />
              <Caption title="ФИО" text={agentInfo.fullname} />
              <Caption title="Почта" text={agentInfo.email} />
              <Caption title="Телефон" text={agentInfo.mobile_phone} />
            </div>
          </Card>
          <Card
            title="Адресс"
            titleClass="text-xl"
            className="row-start-2 mt-5"
          >
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <Caption title="Адресс" text={agentInfo.address} />
              <Caption title="Страна" text={agentInfo.country} />
              <Caption title="Город" text={agentInfo.city} />
            </div>
          </Card>
          <Card title="Данные спонсора" titleClass="text-xl" className="mt-5">
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <div className="rounded-full col-span-2 shadow-md mb-4 w-20 overflow-hidden border border-gray-300">
                <Image
                  alt="Sponsor Avatar"
                  width={500}
                  height={500}
                  className="w-20"
                  src={sponsorInfo.avatar}
                />
              </div>
              <Caption title="ID" text={sponsorInfo.id} />
              <Caption title="ФИО" text={sponsorInfo.fullname} />
              <Caption title="Почта" text={sponsorInfo.email} />
              <Caption title="Телефон" text={sponsorInfo.mobile_phone} />
            </div>
          </Card>
        </div>
        <div>
          <Card title="Мои соц. сети" titleClass="text-xl">
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              {socialsInfo.map((s) => {
                return (
                  <Caption
                    socials={true}
                    title={s.social_media_name}
                    text={s.nickname || "-"}
                    key={s.social_media_id}
                    link={!!s.nickname}
                    linkUrl={s.short_link}
                  />
                );
              })}
            </div>
          </Card>
          <Card
            title="Состояние моих счетов"
            titleClass="text-xl"
            className="mt-5"
          >
            <div className="flex gap-5">
              <Caption
                inline={true}
                title={agentBalance[0]?.name}
                link={true}
                linkUrl="/finance/personal-account"
                text={localInt(agentBalance[0]?.summ)}
              />
              <Caption
                inline={true}
                link={true}
                linkUrl="/finance/personal-account"
                title={agentBalance[1]?.name}
                text={localInt(agentBalance[1]?.summ)}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
