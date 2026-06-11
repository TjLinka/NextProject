import clsx from "clsx";

export const SectionTitle = ({
  children,
  className,
  big,
}: {
  children: React.ReactNode;
  className?: string;
  big?: boolean
}) => {
  return (
    <p
      className={clsx(
        `md:text-xl text-lg font-semibold inline-block border-b-2 border-(--main-color) ${className}`, {
          'md:text-2xl!' : big
        }
      )}
    >
      {children}
    </p>
  );
};
