"use client";

import { TextareaHTMLAttributes, useState } from "react";

export default function EventPage() {
  const [message, setMessage] = useState<string | null>("");

  const handleSearch = async () => {
    if (message) setMessage('');
  };

  return (
    <>
      <div className="text-xl font-medium">EVENT NAME</div>
      <div className="flex gap-10 mt-5">
        <div className="w-[70%] h-[60vh]">
          <iframe
            width="100%"
            height="100%"
            allow="
            autoplay;
            encrypted-media;
            fullscreen;
            picture-in-picture;
            screen-wake-lock;
          "
            allowfullscreen=""
            src="https://vkvideo.ru/video_ext.php?oid=-224095550&amp;id=456239171&amp;hash=876bf5a11066b608&amp;hd=4"
          ></iframe>
        </div>
        <div className="border-2 border-(--main-color) rounded-md shadow-md p-2 bg-white w-[30%] flex flex-col">
          <div className="grow">1</div>
          <div className="flex gap-10">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="resize-none border-2 border-(--main-color) w-full p-2 rounded outline-none"
              placeholder="Сообщение..."
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}
