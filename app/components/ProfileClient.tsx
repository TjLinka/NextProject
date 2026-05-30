"use client";

import { Button } from "@/components/UI/Button";
import { Caption } from "@/components/UI/Caption";
import { Card } from "@/components/UI/Card";
import { User } from "@/types/user/types";
import Link from "next/link";

export default function ProfileClient({ data }: { data: User }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-5 items-start">
        <Card>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <Caption title="ID" text={data.id} />
            <Caption title="ФИО" text={data.fullname} />
            <Caption title="Почта" text={data.email} />
            <Caption title="Телефон" text={data.mobile_phone} />
          </div>
        </Card>
        <Card>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <Caption title="ID" text={data.id} />
            <Caption title="ФИО" text={data.fullname} />
            <Caption title="Почта" text={data.email} />
            <Caption title="Телефон" text={data.mobile_phone} />
            <Link href={`/edit-profile`} className="col-span-2">
              <Button className="w-full">Редактировать</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
