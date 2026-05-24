import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const habits = await prisma.habit.findMany({
    orderBy: [{ active: "desc" }, { position: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ habits });
}

/** POST /api/habits — body: { name } */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const max = await prisma.habit.aggregate({
    _max: { position: true },
    where: { active: true },
  });
  const nextPos = (max._max.position ?? -1) + 1;

  const habit = await prisma.habit.create({
    data: { name, position: nextPos },
  });
  return NextResponse.json({ habit });
}
