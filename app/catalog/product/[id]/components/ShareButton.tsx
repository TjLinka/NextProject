"use client";
import { Button } from "@/components/UI/Button";
import { useAgentStore } from "@/store/agentStore";
import { useIsAuth } from "@/utils/hooks/isAuthHook";
import { useCopyToClipboard } from "@reactuses/core";
import clsx from "clsx";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const ShareButton = ({ className, id }: { className?: string, id: string | number }) => {
  const userId = useAgentStore((state) => state.agentInfo.id);
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `https://office.antlercosmetic.ru/catalog/product/${id}?aid=${userId}&t=0`,
    );
  };

  const isAuth = useIsAuth()

  if (!isAuth) return null

  return (
    <Button className={clsx(`w-fit ${className}`)} onClick={handleCopy}>
      <div className="flex gap-2 items-center">
        <span>Поделиться</span>
        <Image
          src={`/icons/Share.svg`}
          alt="Share Button"
          width={200}
          height={200}
          className="w-6"
        />
      </div>
    </Button>
  );
};
