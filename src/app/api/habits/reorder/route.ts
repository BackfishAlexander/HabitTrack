import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** POST /api/habits/reorder — body: { ids: string[] } in desired order. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body?.ids)) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }
  await prisma.$transaction(
    body.ids.map((id: string, idx: number) =>
      prisma.habit.update({ where: { id }, data: { position: idx } }),
    ),
  );
  return NextResponse.json({ ok: true });
}
