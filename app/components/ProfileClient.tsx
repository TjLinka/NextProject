"use client";

import { Button } from "@/components/UI/Button";
import { Caption } from "@/components/UI/Caption";
import { Card } from "@/components/UI/Card";
import { localInt } from "@/lib/utils";
import { User } from "@/types/user/types";
import { useCopyToClipboard } from "@reactuses/core";
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
  socialsInfo?: socialsInfo[];
}) {
  const [text, copy] = useCopyToClipboard();
  return (
    <div>
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-5">
        <div className="flex items-center md:justify-between gap-5">
          <Image
            alt="User Avatar"
            width={500}
            height={500}
            src={agentInfo?.avatar}
            className="w-20 rounded-full"
          />
          <p className="md:text-2xl text-xl font-semibold">
            {agentInfo.fullname}
          </p>
        </div>
        <Link href={`/edit-profile`} className="col-span-2">
          <Button className="w-full">Редактировать</Button>
        </Link>
      </div>
      <div className="grid xl:grid-cols-2 gap-5 items-start md:mt-10 mt-5">
        <div>
          <Card title="Личные данные" titleClass="md:text-xl">
            <div className="grid md:grid-cols-2 gap-x-5 gap-y-2">
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
            <div className="grid md:grid-cols-2 gap-x-5 gap-y-2">
              <Caption title="Адресс" text={agentInfo.address} />
              <Caption title="Страна" text={agentInfo.country} />
              <Caption title="Город" text={agentInfo.city} />
            </div>
          </Card>
          <Card title="Данные спонсора" titleClass="text-xl" className="mt-5">
            <div className="grid md:grid-cols-2 gap-x-5 gap-y-2">
              <div className="rounded-full md:col-span-2 shadow-md mb-4 w-20 overflow-hidden border border-gray-300">
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
            <div className="flex md:flex-row flex-col md:gap-5 gap-2">
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
          <Card
            title="Реферальные ссылки"
            titleClass="text-xl"
            className="mt-5"
          >
            <div className="flex md:gap-5 gap-2 items-center w-fit">
              <p className=" leading-[100%] text-gray-500 truncate text-sm">
                http://localhost:3000/registration/000068
              </p>
              <Image
                onClick={() =>
                  copy("http://localhost:3000/registration/000068")
                }
                alt="Copy Icon"
                src={"/icons/CopyIcon.svg"}
                width={100}
                height={100}
                className="md:w-5.5 w-5 md:h-5.5 h-5 cursor-pointer"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
