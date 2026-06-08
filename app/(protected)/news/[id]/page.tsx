import { Button } from "@/components/UI/Button";
import { SectionTitle } from "@/components/UI/SectionTitle";
import { getNews } from "@/dbQuery/dbQuerys";
import Link from "next/link";

interface newsProps {
  id: number;
  dte: Date;
  title: string;
  image_url: string
}

export default async function NewsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const newsData: newsProps = await getNews(Number(id));
  console.log(newsData);

  return (
    <div>
      <Link href={`/news`}>
        <Button>Назад к новостям</Button>
      </Link>
      <SectionTitle className="mt-4">{newsData.title}</SectionTitle>
    </div>
  );
}
