"use client";
import Image from "next/image";
import { SectionTitle } from "../UI/SectionTitle";
import { QRCodeSVG } from "qrcode.react";
import { useAgentStore } from "@/store/agentStore";
import { useCopyToClipboard } from "@reactuses/core";
import { useModalAndNotify } from "@/store/modalAndNotify";

export const RefLinksModal = () => {
  const agentInfo = useAgentStore((state) => state.agentInfo);
  const showNotification = useModalAndNotify((state) => state.showNotification);
  const [text, copy] = useCopyToClipboard();

  const handleCopy = (url: string) => {
    copy(url);
    showNotification("success", "Ссылка скопирована", "Реф. сслыка");
  };

  return (
    <div className="flex flex-col items-center">
      <SectionTitle>Реферальная ссылка</SectionTitle>
      <p
        className=" leading-[100%] truncate  hover:underline cursor-pointer mt-5"
        onClick={() =>
          handleCopy(
            `${process.env.NEXT_PUBLIC_MAIN_URL}/registration?id=${agentInfo.id}&t=0`,
          )
        }
      >
        {`${process.env.NEXT_PUBLIC_MAIN_URL}/registration?id=${agentInfo.id}&t=0`}
      </p>
      {agentInfo.msflag >= 20 && (
        <p
          className=" leading-[100%] truncate hover:underline cursor-pointer mt-5"
          onClick={() =>
            handleCopy(
              `${process.env.NEXT_PUBLIC_MAIN_URL}/registration?id=${agentInfo.id}&t=10`,
            )
          }
        >
          {`${process.env.NEXT_PUBLIC_MAIN_URL}/registration?id=${agentInfo.id}&t=10`}
        </p>
      )}
      <SectionTitle className="mt-4">
        Поделиться ссылкой в соц. сетях
      </SectionTitle>
      <div className="mt-3 shrink-0 md:w-auto w-full">
        <div className="flex md:gap-5 items-center justify-around ">
          <Image
            alt=""
            src={"/icons/t_logo.svg"}
            width={200}
            height={200}
            className="w-15 h-15"
          />
          <Image
            alt=""
            src={"/icons/vk_logo.svg"}
            width={200}
            height={200}
            className="w-15 h-15"
          />
          <Image
            alt=""
            src={"/icons/whatsapp_logo.svg"}
            width={200}
            height={200}
            className="w-15 h-15"
          />
        </div>
      </div>
      <SectionTitle className=" mt-4">QR Сode</SectionTitle>
      <div className="flex mt-5">
        <QRCodeSVG
          size={180}
          value="https://office.antler/registration/00000069"
        />
      </div>
    </div>
  );
};

// onClick={() =>
//   window.open(
//     `https://vkontakte.ru/share.php?url=https://my.radargp.com/club/00000069','sharer','status=0,toolbar=0,width=650,height=500`,
//   )
// }
