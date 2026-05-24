import { prisma } from "@/lib/prisma";
import { HistoryView } from "@/components/HistoryView";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const [habits, ratings] = await Promise.all([
    prisma.habit.findMany({
      orderBy: [{ active: "desc" }, { position: "asc" }, { createdAt: "asc" }],
    }),
    prisma.rating.findMany({
      orderBy: [{ habitDate: "desc" }, { createdAt: "asc" }],
      take: 60 * 20,
    }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">History</h1>
        <p className="mt-1 text-sm text-muted">All your past habit ratings.</p>
      </div>
      <HistoryView
        habits={habits.map((h) => ({ id: h.id, name: h.name, active: h.active }))}
        ratings={ratings.map((r) => ({
          id: r.id,
          habitId: r.habitId,
          habitDate: r.habitDate,
          name: r.nameSnapshot,
          value: r.value,
        }))}
      />
    </div>
  );
}
