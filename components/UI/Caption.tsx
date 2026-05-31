import clsx from "clsx";

interface CaptionProps {
  title: string;
  text: string | number;
  link?: boolean;
  socials?: boolean;
  linkUrl?: string;
  inline?: boolean;
}

export const Caption = ({
  title,
  text,
  link,
  linkUrl,
  inline,
  socials,
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
  } else if (link) {
    captionContent = (
      <a href={linkUrl} className="hover:underline text-(--main-text)">
        {text}
      </a>
    );
  } else {
    captionContent = <span className="font-semibold">{text}</span>
  }
  return (
    <div
      className={clsx("", {
        "flex gap-2": inline,
      })}
    >
      <p className="text-gray-500">{title}:</p>
      {captionContent}
    </div>
  );
};
