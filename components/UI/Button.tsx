interface Button {
    children : React.ReactNode
    onClick?: () => void
    className?: string
}

export const Button = ({ children, onClick, className }: Button) => {
  return (
    <button
      className={`${className} bg-[#bf94ff] text-white h-10 px-2 rounded cursor-pointer font-semibold`}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};