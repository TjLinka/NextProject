"use client";
import { useEffect, useRef, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { Product } from "../../../types";
export const ProdDesc = ({ data }: { data: Product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [data.adv_desc]);

  return (
    <div className="mt-5">
      <p className="text-xl inline-block font-semibold border-b-2 border-(--main-color)">
        Описание товара
      </p>
      {data.adv_desc.length > 20 && (
        <div className="relative mt-2">
          <div
            ref={contentRef}
            className={`overflow-hidden transition-h duration-300 ${
              isExpanded ? "max-h-screen" : "max-h-[30vh]"
            }`}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.adv_desc),
            }}
          />

          {isClamped && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-b from-transparent to-white flex items-end justify-center">
              <button
                onClick={() => setIsExpanded(true)}
                className="mb-1 flex text-(--main-color) font-medium hover:underline cursor-pointer"
              >
                Показать полностью
                <Image
                  src={"/icons/ArrowDown.svg"}
                  width={100}
                  height={100}
                  className="w-5 h-5"
                  alt=""
                />
              </button>
            </div>
          )}
        
          {isClamped && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="mt-2 flex items-center text-(--main-color) font-medium hover:underline cursor-pointer"
            >
              Свернуть{" "}
              <Image
                src={"/icons/ArrowDown.svg"}
                width={100}
                height={100}
                className="w-5 h-5 rotate-180"
                alt=""
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
