"use client";

import { useMemo, useState } from "react";
import { RATING_META, type RatingValue } from "@/lib/ratings";
import { formatHabitDate, shortHabitDate, weekdayShort } from "@/lib/habitDay";

type Habit = { id: string; name: string; active: boolean };
type RatingRow = {
  id: string;
  habitId: string;
  habitDate: string;
  name: string;
  value: number | null;
};

type Mode = "all" | "habit";

export function HistoryView({
  habits,
  ratings,
}: {
  habits: Habit[];
  ratings: RatingRow[];
}) {
  const [mode, setMode] = useState<Mode>("all");
  const [habitId, setHabitId] = useState<string>(habits[0]?.id ?? "");

  const byDate = useMemo(() => {
    const m = new Map<string, RatingRow[]>();
    for (const r of ratings) {
      const arr = m.get(r.habitDate) ?? [];
      arr.push(r);
      m.set(r.habitDate, arr);
    }
    return m;
  }, [ratings]);

  const allDates = useMemo(
    () => Array.from(byDate.keys()).sort((a, b) => (a > b ? -1 : 1)),
    [byDate],
  );

  return (
    <div>
      {/* Mode tabs */}
      <div className="surface mb-5 flex gap-1 rounded-full p-1 text-sm">
        <ModeTab active={mode === "all"} onClick={() => setMode("all")}>
          All habits
        </ModeTab>
        <ModeTab active={mode === "habit"} onClick={() => setMode("habit")}>
          By habit
        </ModeTab>
      </div>

      {mode === "habit" && (
        <div className="mb-5 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {habits.length === 0 ? (
              <p className="text-sm text-muted">No habits yet.</p>
            ) : (
              habits.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setHabitId(h.id)}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                    h.id === habitId
                      ? "bg-ink-100 text-ink-950"
                      : "surface text-muted hover:text-ink-100"
                  }`}
                >
                  {h.name}
                  {!h.active && <span className="ml-1.5 text-xs opacity-60">(archived)</span>}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {allDates.length === 0 ? (
        <div className="surface rounded-2xl p-8 text-center text-sm text-muted">
          No history yet. Rate today&apos;s habits and check back tomorrow.
        </div>
      ) : mode === "all" ? (
        <AllHabitsView dates={allDates} byDate={byDate} />
      ) : (
        <ByHabitView dates={allDates} byDate={byDate} habitId={habitId} />
      )}
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full px-4 py-2 transition-colors ${
        active ? "bg-ink-800 text-ink-100" : "text-muted hover:text-ink-200"
      }`}
    >
      {children}
    </button>
  );
}

function AllHabitsView({
  dates,
  byDate,
}: {
  dates: string[];
  byDate: Map<string, RatingRow[]>;
}) {
  return (
    <ul className="space-y-3">
      {dates.map((date) => {
        const items = byDate.get(date) ?? [];
        const avg =
          items.filter((i) => i.value !== null).reduce((a, b) => a + (b.value ?? 0), 0) /
          Math.max(1, items.filter((i) => i.value !== null).length);
        return (
          <li key={date} className="surface rounded-2xl p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{formatHabitDate(date)}</p>
                <p className="text-xs text-dim">
                  {items.filter((i) => i.value !== null).length} of {items.length} rated
                </p>
              </div>
              {!Number.isNaN(avg) && avg > 0 && (
                <p className="text-xs text-muted">avg {avg.toFixed(1)}</p>
              )}
            </div>
            <ul className="mt-3 space-y-1.5">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate text-ink-200">{it.name}</span>
                  <Pip value={it.value} />
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

function ByHabitView({
  dates,
  byDate,
  habitId,
}: {
  dates: string[];
  byDate: Map<string, RatingRow[]>;
  habitId: string;
}) {
  const rows = dates
    .map((date) => {
      const item = (byDate.get(date) ?? []).find((r) => r.habitId === habitId);
      return item ? { date, item } : null;
    })
    .filter((x): x is { date: string; item: RatingRow } => x !== null);

  if (rows.length === 0) {
    return (
      <div className="surface rounded-2xl p-8 text-center text-sm text-muted">
        No ratings for this habit yet.
      </div>
    );
  }

  const ratedRows = rows.filter((r) => r.item.value !== null);
  const avg =
    ratedRows.reduce((a, b) => a + (b.item.value ?? 0), 0) / Math.max(1, ratedRows.length);

  return (
    <div>
      <div className="surface mb-4 flex items-center justify-between rounded-2xl px-5 py-4">
        <div>
          <p className="text-sm font-medium">{rows[0].item.name}</p>
          <p className="text-xs text-dim">{ratedRows.length} ratings</p>
        </div>
        {ratedRows.length > 0 && (
          <p className="text-sm text-muted">avg {avg.toFixed(2)}</p>
        )}
      </div>
      <ul className="surface divide-y divide-ink-800 overflow-hidden rounded-2xl">
        {rows.map(({ date, item }) => (
          <li key={item.id} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-baseline gap-3">
              <span className="w-9 text-xs uppercase text-dim">{weekdayShort(date)}</span>
              <span className="text-sm text-ink-200">{shortHabitDate(date)}</span>
            </div>
            <Pip value={item.value} large />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pip({ value, large = false }: { value: number | null; large?: boolean }) {
  const size = large ? "h-7 min-w-7 px-2 text-xs" : "h-6 min-w-6 px-1.5 text-[11px]";
  if (value === null) {
    return (
      <span
        className={`inline-flex ${size} items-center justify-center rounded-full bg-ink-800 text-dim`}
      >
        —
      </span>
    );
  }
  const meta = RATING_META[value as RatingValue];
  return (
    <span
      className={`inline-flex ${size} items-center justify-center rounded-full font-semibold text-ink-950 ${meta.bg}`}
    >
      {value}
    </span>
  );
}
