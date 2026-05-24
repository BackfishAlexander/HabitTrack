import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { currentHabitDate, formatHabitDate, nextRolloverIso } from "@/lib/habitDay";
import { RatingButtons } from "@/components/RatingButtons";
import { RolloverHint } from "@/components/RolloverHint";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const habitDate = currentHabitDate();

  const activeHabits = await prisma.habit.findMany({
    where: { active: true },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  if (activeHabits.length === 0) {
    return <EmptyState />;
  }

  // Lazy generate today's rows
  await prisma.rating.createMany({
    data: activeHabits.map((h) => ({
      habitId: h.id,
      habitDate,
      nameSnapshot: h.name,
    })),
    skipDuplicates: true,
  });

  const ratings = await prisma.rating.findMany({
    where: { habitDate },
  });

  const posByHabit = new Map(activeHabits.map((h) => [h.id, h.position]));
  const sorted = [...ratings].sort((a, b) => {
    const ap = posByHabit.get(a.habitId) ?? 9999;
    const bp = posByHabit.get(b.habitId) ?? 9999;
    if (ap !== bp) return ap - bp;
    return a.nameSnapshot.localeCompare(b.nameSnapshot);
  });

  const ratedCount = sorted.filter((r) => r.value !== null).length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-muted">{formatHabitDate(habitDate)}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          How did the day go?
        </h1>
        <p className="mt-2 text-sm text-muted">
          {ratedCount} of {sorted.length} rated · <RolloverHint iso={nextRolloverIso()} />
        </p>
      </div>

      <ul className="space-y-3">
        {sorted.map((r) => (
          <li
            key={r.id}
            className="surface rounded-2xl p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-medium sm:text-lg">{r.nameSnapshot}</p>
            </div>
            <RatingButtons ratingId={r.id} initialValue={r.value} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="surface mt-4 rounded-2xl p-8 text-center">
      <h1 className="text-xl font-semibold tracking-tight">No habits yet</h1>
      <p className="mt-2 text-sm text-muted">
        Add habits you want to track. They&apos;ll show up here every day for rating.
      </p>
      <Link
        href="/habits"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-ink-100 px-5 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-white"
      >
        Set up habits
      </Link>
    </div>
  );
}
