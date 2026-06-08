// app/api/users/route.ts
import { NextResponse } from "next/server";
import { withDatabase, query } from "@/lib/firebird";
import { serializeDates } from "@/utils/serialize";

type User = {
  ID: number;
  NAME: string;
  EMAIL: string;
};

export async function GET() {
  try {
    const users = await withDatabase((db) =>
      // SELECT процедура вызывается через SELECT * FROM
      // query<User>(db, "SELECT * FROM DASHBOARD"),
      // С параметрами:
      query<User>(db, "SELECT * FROM DASHBOARD(?)", [105]),
    );
    return NextResponse.json(serializeDates(users));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Ошибка БД";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
