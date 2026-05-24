"use client";

import { useState, useTransition } from "react";
import { RATING_META, RATING_VALUES, type RatingValue } from "@/lib/ratings";

export function RatingButtons({
  ratingId,
  initialValue,
}: {
  ratingId: string;
  initialValue: number | null;
}) {
  const [value, setValue] = useState<number | null>(initialValue);
  const [pending, startTransition] = useTransition();

  const save = (next: number | null) => {
    setValue(next);
    startTransition(async () => {
      await fetch("/api/ratings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: ratingId, value: next }),
      });
    });
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {RATING_VALUES.map((v) => {
        const meta = RATING_META[v as RatingValue];
        const selected = value === v;
        const anySelected = value !== null;
        return (
          <button
            key={v}
            onClick={() => save(selected ? null : v)}
            aria-label={`${v} — ${meta.label}`}
            aria-pressed={selected}
            disabled={pending}
            className={`relative h-10 w-10 shrink-0 rounded-full text-sm font-semibold transition-all sm:h-11 sm:w-11 ${
              selected
                ? `${meta.bg} text-ink-950 scale-105 shadow-lg`
                : anySelected
                ? "bg-ink-800/60 text-ink-500 hover:bg-ink-700 hover:text-ink-200"
                : `${meta.chip} hover:scale-105`
            }`}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}
