import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** PATCH /api/habits/[id] — body: { name?, active?, position? } */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad body" }, { status: 400 });

  const data: { name?: string; active?: boolean; position?: number } = {};
  if (typeof body.name === "string") {
    const trimmed = body.name.trim();
    if (!trimmed) return NextResponse.json({ error: "Name required" }, { status: 400 });
    data.name = trimmed;
  }
  if (typeof body.active === "boolean") data.active = body.active;
  if (typeof body.position === "number") data.position = body.position;

  const habit = await prisma.habit.update({ where: { id }, data });
  return NextResponse.json({ habit });
}

/**
 * DELETE /api/habits/[id] — soft-delete by setting active=false. Past Ratings
 * stay intact so history is preserved. To truly purge, pass ?purge=1 (also
 * removes all historic rating rows).
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(req.url);
  const purge = url.searchParams.get("purge") === "1";
  if (purge) {
    await prisma.habit.delete({ where: { id } });
  } else {
    await prisma.habit.update({ where: { id }, data: { active: false } });
  }
  return NextResponse.json({ ok: true });
}
