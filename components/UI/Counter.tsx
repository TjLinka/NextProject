import clsx from "clsx";
import Image from "next/image";

interface Counter {
  incr: (id: number) => void;
  decr: (id: number) => void;
  count: string | number;
  id: number;
  small?: boolean;
}
export const Counter = ({ incr, decr, count, id, small }: Counter) => {
  return (
    <>
      <div
        className={clsx(
          "flex max-w-34 w-full h-8 rounded-lg border-gray-400 overflow-hidden",
          {
            "h-5! max-w-24!": small,
          },
        )}
      >
        <div
          className="grow cursor-pointer flex justify-center items-center bg-(--main-color)"
          onClick={() => {
            decr(id);
          }}
        >
          <Image
            src="/icons/SignMinus.svg"
            width={100}
            height={100}
            alt="Counter Icon Minus"
            className="w-4 h-4"
          />
        </div>
        <div
          className={clsx(
            "grow flex min-w-20 justify-center items-center font-semibold text",{
              'min-w-9!' :small
            }
          )}
        >
          {count} шт.
        </div>
        <div
          className="grow cursor-pointer flex justify-center items-center bg-(--main-color)"
          onClick={() => {
            incr(id);
          }}
        >
          <Image
            src="/icons/SignPlus.svg"
            width={100}
            height={100}
            className="w-4 h-4"
            alt="Counter Icon Plus"
          />
        </div>
      </div>
    </>
  );
};
