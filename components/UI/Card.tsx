import clsx from "clsx";

export const Card = ({
  children,
  className,
  title,
  fit = false,
}: {
  children: React.ReactNode;
  className?: string;
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
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className={clsx("")}>{children}</div>
    </div>
  );
};
