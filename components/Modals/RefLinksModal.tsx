"use client";
import Image from "next/image";
import { Card } from "../UI/Card";
import { SectionTitle } from "../UI/SectionTitle";
import { QRCodeSVG } from "qrcode.react";

export const RefLinksModal = () => {
  return (
    <div className="flex flex-col items-center">
      <SectionTitle>Реферальная ссылка</SectionTitle>
      <div className="md:mt-3 mt-1 md:text-lg font-medium">
        https://office.antler/registration/00000069
      </div>
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
