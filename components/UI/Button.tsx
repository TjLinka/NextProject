"use client";
import clsx from "clsx";
import * as motion from "motion/react-client";
interface Button {
  children: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  className,
  disabled,
  loading = false,
}: Button) => {
  let childrenContent;
  if (loading) {
    childrenContent = <span className="loader"></span>;
  } else {
    childrenContent = children;
  }

  return (
    <motion.button
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        `${className} bg-(--main-color) font-semibold md:text-[16px] text-sm h-10 px-4 rounded-md cursor-pointer flex justify-center items-center`,
        {
          "bg-gray-400! cursor-not-allowed!": disabled,
        },
      )}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {childrenContent}
    </motion.button>
  );
};
