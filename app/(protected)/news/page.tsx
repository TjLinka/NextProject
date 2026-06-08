import { getNewsList } from "@/dbQuery/dbQuerys";
import { NewsItem } from "./components/NewsItem";

interface newsProps {
  id: number;
  dte: Date;
  title: string;
}

export default async function NewsPage() {
  const newsList: newsProps[] = await getNewsList();
  return (
    <div className="grid grid-cols-2 gap-5">
      {newsList.map((n) => {
        return <NewsItem key={n.id} news={n} />;
      })}
    </div>
  );
}
