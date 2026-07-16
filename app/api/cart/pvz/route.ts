import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://test-back.artlife.ru/shop/delivery-points/1",
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream error: ${res.status}` },
      { status: res.status },
    );
  }

  const data = await res.json();

  return NextResponse.json(data);
}
