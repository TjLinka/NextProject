import clsx from "clsx";

export const Card = ({
  children,
  className,
  titleClass,
  title,
  fit = false,
}: {
  children: React.ReactNode;
  className?: string;
  titleClass?: string
  title?: string;
  fit?: boolean;
}) => {
  return (
    <div
      className={clsx(
        "bg-white p-4 rounded-md shadow",
        fit && "w-fit",
        className,
      )}
    >
      {title && <p className={clsx(`mb-1 font-semibold ${titleClass}`)}>{title}</p>}
      <div className={clsx('', {
        'mt-5' : title
      })}>{children}</div>
    </div>
  );
};
