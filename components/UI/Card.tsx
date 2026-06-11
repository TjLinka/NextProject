import clsx from "clsx";

export const Card = ({
  children,
  className,
  contentClass = '',
  titleClass,
  title,
  fit = false,
}: {
  children?: React.ReactNode;
  className?: string;
  contentClass?: string
  titleClass?: string
  title?: string;
  fit?: boolean;
}) => {
  return (
    <div
      className={clsx(
        "bg-white p-3 rounded-md shadow",
        fit && "w-fit",
        className,
      )}
    >
      {title && (
        <p className={clsx(`mb-1 font-semibold text`)}>{title}</p>
      )}
      <div
        className={clsx(`${contentClass}`, {
          "mt-2": title,
        })}
      >
        {children}
      </div>
    </div>
  );
};
