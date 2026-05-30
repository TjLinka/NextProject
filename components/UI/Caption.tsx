interface CaptionProps {
  title: string;
  text: string | number;
}

export const Caption = ({ title, text }: CaptionProps) => {
  return (
    <div>
      <p className="text-gray-500">{title}:</p>
      <p className=" font-semibold">{text}</p>
    </div>
  );
};
