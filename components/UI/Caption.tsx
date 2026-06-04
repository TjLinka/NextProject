import clsx from "clsx";
import Link from "next/link";

interface CaptionProps {
  title: string;
  text: string | number;
  link?: boolean;
  socials?: boolean;
  linkUrl?: string;
  inline?: boolean;
  className?: string
}

export const Caption = ({
  title,
  text,
  link,
  linkUrl,
  inline,
  socials,
  className,
}: CaptionProps) => {
  let captionContent;

  if (socials) {
    captionContent = (
      <a
        href={`${linkUrl}${text}`}
        className="hover:underline text-(--main-text)"
      >
        {text}
      </a>
    );
  } else if (link && linkUrl) {
    captionContent = (
      <Link href={linkUrl} className="hover:underline text-(--main-text)">
        {text}
      </Link>
    );
  } else {
    captionContent = <span className="font-semibold">{text}</span>;
  }
  return (
    <div
      className={clsx(`${className}`, {
        "flex gap-2": inline,
      })}
    >
      <p className="text-gray-500">{title}:</p>
      {captionContent}
    </div>
  );
};
