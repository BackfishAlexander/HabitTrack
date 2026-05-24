import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/history?days=60[&habitId=...]
 * Returns ratings grouped by day. If habitId is set, only ratings for that
 * habit are returned.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const days = Math.min(365, Math.max(7, Number(url.searchParams.get("days") ?? 60)));
  const habitId = url.searchParams.get("habitId") ?? undefined;

  const where: { habitId?: string } = {};
  if (habitId) where.habitId = habitId;

  const ratings = await prisma.rating.findMany({
    where,
    orderBy: [{ habitDate: "desc" }, { createdAt: "asc" }],
    take: habitId ? days : days * 20,
  });

  // Group by habitDate
  const byDate = new Map<string, typeof ratings>();
  for (const r of ratings) {
    const arr = byDate.get(r.habitDate) ?? [];
    arr.push(r);
    byDate.set(r.habitDate, arr);
  }

  const dates = Array.from(byDate.keys()).sort().reverse().slice(0, days);

  return NextResponse.json({
    days: dates.map((date) => ({
      habitDate: date,
      items: (byDate.get(date) ?? []).map((r) => ({
        id: r.id,
        habitId: r.habitId,
        name: r.nameSnapshot,
        value: r.value,
      })),
    })),
  });
}
