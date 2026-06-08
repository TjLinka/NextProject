import { Button } from "@/components/UI/Button";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

interface newsProps {
  id: number;
  dte: Date;
  title: string;
  image_url: string;
}

export const NewsItem = ({ news }: { news: newsProps }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex gap-5 items-center justify-between">
        <p className="text-2xl font-semibold inline-block border-b-2 border-(--main-color)">
          {news.title}
        </p>
      </div>
      <small className="text-gray-600">
        {moment(news.dte).format("DD.MM.YYYY")}
      </small>
      <div className="w-full h-70 rounded-lg mt-4">
        <Image
          src={news.image_url}
          width={400}
          height={400}
          alt={news.title}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex justify-end mt-4">
        <Link href={`/news/${news.id}`}>
          <Button>Просмотреть</Button>
        </Link>
      </div>
    </div>
  );
};
