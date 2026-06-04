import { serverFetch } from "@/lib/auth";
import Image from "next/image";
import { Product } from "../../types";
import { Card } from "@/components/UI/Card";
import DOMPurify from "isomorphic-dompurify";
import { BackButton } from "./components/BackButton";
import { MayNeddProducts } from "./components/MayNeedProducts";
import { AddToCartButton } from "./components/AddToCartButton";

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const res = await serverFetch(`/api/partner/Catalog/get-single/${id}`);
  const data: Product = await res.json();

  return (
    <div>
      <div>
        <div>
          <BackButton />
        </div>
        <div></div>
      </div>
      <div className="flex items-start gap-5 mt-2">
        <div className="max-w-145.5">
          <Image
            alt="Product Image"
            src={data.image_urls[0]}
            width={500}
            height={500}
            className="max-w-145.5"
          />
        </div>
        <Card className="grow">
          <div className="text-xl font-semibold flex justify-between items-center">
            <span className="inline-block border-b-2 border-(--main-color)">
              {data.name}
            </span>
            <span className="text-sm text-gray-400">
              Артикул: {data.articul}
            </span>
          </div>
          <div className="mt-5">
            <p className="text-xl inline-block font-semibold border-b-2 border-(--main-color)">
              Описание товара
            </p>
            {data.adv_desc.length > 20 && (
              <div
                className="mt-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data.adv_desc),
                }}
              ></div>
            )}
          </div>
          <div className="mt-5">
            <AddToCartButton product={data} />
          </div>
        </Card>
      </div>
      <p className="text-2xl font-semibold mt-10 inline-block border-b-2 border-(--main-color)">
        Может также пригодиться
      </p>
      <div className="w-auto max-w-full overflow-hidden mx-auto mt-4">
        <MayNeddProducts />
      </div>
    </div>
  );
}
