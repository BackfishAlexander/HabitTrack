import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentHabitDate, nextRolloverIso } from "@/lib/habitDay";

export const dynamic = "force-dynamic";

/**
 * Returns today's ratings. Lazily generates a Rating row for every active
 * habit if rows don't yet exist for the current habit-day. Renames/reorders
 * after generation do not retroactively change today's rows.
 */
export async function GET() {
  const habitDate = currentHabitDate();

  const activeHabits = await prisma.habit.findMany({
    where: { active: true },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  if (activeHabits.length > 0) {
    await prisma.rating.createMany({
      data: activeHabits.map((h) => ({
        habitId: h.id,
        habitDate,
        nameSnapshot: h.name,
      })),
      skipDuplicates: true,
    });
  }

  const ratings = await prisma.rating.findMany({
    where: { habitDate },
    include: { habit: true },
  });

  const habitIdToPos = new Map(activeHabits.map((h) => [h.id, h.position]));
  ratings.sort((a, b) => {
    const ap = habitIdToPos.get(a.habitId) ?? 9999;
    const bp = habitIdToPos.get(b.habitId) ?? 9999;
    if (ap !== bp) return ap - bp;
    return a.nameSnapshot.localeCompare(b.nameSnapshot);
  });

  return NextResponse.json({
    habitDate,
    nextRollover: nextRolloverIso(),
    items: ratings.map((r) => ({
      id: r.id,
      habitId: r.habitId,
      name: r.nameSnapshot,
      value: r.value,
    })),
  });
}
