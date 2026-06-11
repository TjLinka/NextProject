import { serverFetch } from "@/lib/auth";
import Image from "next/image";
import { Product } from "../../types";
import { Card } from "@/components/UI/Card";
import DOMPurify from "isomorphic-dompurify";
import { BackButton } from "./components/BackButton";
import { MayNeddProducts } from "./components/MayNeedProducts";
import { AddToCartButton } from "./components/AddToCartButton";
import { ProdDesc } from "./components/ProductDesc";
import { localInt } from "@/lib/utils";
import * as motion from "motion/react-client";
import { TabPanel, TabView } from "primereact/tabview";
import { AddToFavor } from "./components/AddToFavor";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
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
      <div className="flex md:flex-row flex-col items-start gap-5 mt-2">
        <div className="max-w-145.5 md:w-auto w-full">
          <Image
            alt="Product Image"
            src={data.image_urls[0]}
            width={500}
            height={500}
            className="max-w-145.5 md:w-auto w-full"
          />
        </div>
        <Card className="grow">
          <div className="md:text-xl font-semibold flex md:flex-row flex-col justify-between md:items-center">
            <span className="inline-block border-b-2 border-(--main-color)">
              {data.name}
            </span>
            <span className="text-sm text-gray-400">
              Артикул: {data.articul}
            </span>
          </div>
          <ProdDesc data={data} />
          <div className="mt-5 flex items-center justify-between">
            <p className="md:text-2xl text-lg font-semibold">
              Цена: {localInt(data.price)} ₽
            </p>
            <div className="flex gap-2 items-center">
              <AddToCartButton product={data} />
              <AddToFavor product={data}/>
            </div>
          </div>
        </Card>
      </div>
      <TabView className="mt-5">
        <TabPanel
          header="Отзывы"
          rightIcon="pi pi-star ml-2"
          // headerTemplate={tab1HeaderTemplate}
        >
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </TabPanel>
        <TabPanel
          header="Состав"
          rightIcon="pi pi-list ml-2"
          headerClassName="flex align-items-center"
        >
          <p className="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
            velit, sed quia non numquam eius modi.
          </p>
        </TabPanel>
        <TabPanel
          header="Доп. материалы"
          rightIcon="pi pi-file ml-2"
          headerClassName="flex align-items-center"
        >
          <p className="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
            velit, sed quia non numquam eius modi.
          </p>
        </TabPanel>
      </TabView>
      <p className="text-2xl font-semibold mt-10 inline-block border-b-2 border-(--main-color)">
        Может также пригодиться
      </p>
      <div className="w-auto max-w-full overflow-hidden mx-auto mt-4">
        <MayNeddProducts />
      </div>
    </div>
  );
}
