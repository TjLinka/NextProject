import clsx from "clsx";
import React, { useState } from "react";

export const Collapse = ({
  title = "Label",
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={clsx(`${className}`)}>
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer font-semibold text-xl"
      >
        {title}
      </div>
      <div
        className={clsx(
          `max-h-0 ease-in-out pr-2 overflow-y-auto`,
          {
            "md:max-h-100 max-h-50  mt-2 py-2": open,
          },
        )}
      >
        {children}
      </div>
    </div>
  );
};
