interface Button {
    children : React.ReactNode
    loading?: boolean,
    onClick?: () => void
    className?: string
}

export const Button = ({ children, onClick, className, loading = false }: Button) => {

  let childrenContent;
  if (loading) {
    childrenContent = <span className="loader"></span>;
  } else {
    childrenContent = children
  }

  return (
    <button
      className={`${className} bg-(--main-color) text-white text-lg h-12 px-2 rounded-xl cursor-pointer font-semibold flex justify-center items-center`}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {childrenContent}
    </button>
  );
};