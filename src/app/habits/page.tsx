import { prisma } from "@/lib/prisma";
import { HabitManager } from "@/components/HabitManager";

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const habits = await prisma.habit.findMany({
    orderBy: [{ active: "desc" }, { position: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Habits</h1>
        <p className="mt-1 text-sm text-muted">
          Edit what you track. Changes take effect with the next 5am roll-over —
          today&apos;s log is untouched.
        </p>
      </div>
      <HabitManager
        initial={habits.map((h) => ({
          id: h.id,
          name: h.name,
          active: h.active,
          position: h.position,
        }))}
      />
    </div>
  );
}
