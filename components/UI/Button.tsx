"use client";
import * as motion from "motion/react-client";
interface Button {
  children: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button = ({
  children,
  onClick,
  className,
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
      whileTap={{ scale: 0.95 }}
      className={`${className} bg-(--main-color) text-white text-[16px] h-12 px-4 rounded-md cursor-pointer flex justify-center items-center`}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {childrenContent}
    </motion.button>
  );
};
