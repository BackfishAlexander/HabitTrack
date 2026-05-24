import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** PATCH /api/ratings — body: { id, value | null }. Clears if value is null. */
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const value = body.value;
  if (value !== null && (typeof value !== "number" || value < 1 || value > 5)) {
    return NextResponse.json({ error: "Value must be 1-5 or null" }, { status: 400 });
  }
  const updated = await prisma.rating.update({
    where: { id: body.id },
    data: { value: value as number | null },
  });
  return NextResponse.json({ id: updated.id, value: updated.value });
}
