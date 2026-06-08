import clsx from "clsx";

export const SectionTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={clsx(
        `md:text-2xl text-lg font-semibold inline-block border-b-2 border-(--main-color) ${className}`,
      )}
    >
      {children}
    </p>
  );
};
