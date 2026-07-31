import { Card } from "@/components/UI/Card";
import { getMaterial } from "@/lib/actions";

export default async function DeliveryInfoPage() {
    const res = await getMaterial(769)

    console.log(res);
    

    return (
      <>
        <Card>
          <div dangerouslySetInnerHTML={{ __html: res.content}}></div>
        </Card>
      </>
    );
}