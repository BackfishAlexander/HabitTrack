"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Habit = { id: string; name: string; active: boolean; position: number };

export function HabitManager({ initial }: { initial: Habit[] }) {
  const router = useRouter();
  const [habits, setHabits] = useState(initial);
  const [newName, setNewName] = useState("");
  const [pending, startTransition] = useTransition();

  const refresh = () => startTransition(() => router.refresh());

  const active = habits.filter((h) => h.active);
  const archived = habits.filter((h) => !h.active);

  const addHabit = async () => {
    const name = newName.trim();
    if (!name) return;
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const { habit } = await res.json();
      setHabits((h) => [...h, habit]);
      setNewName("");
      refresh();
    }
  };

  const updateHabit = async (id: string, patch: Partial<Habit>) => {
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, ...patch } : h)));
    await fetch(`/api/habits/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    refresh();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const list = [...active];
    const idx = list.findIndex((h) => h.id === id);
    const next = idx + dir;
    if (idx === -1 || next < 0 || next >= list.length) return;
    [list[idx], list[next]] = [list[next], list[idx]];
    setHabits((hs) => {
      const archivedHs = hs.filter((h) => !h.active);
      const reindexed = list.map((h, i) => ({ ...h, position: i }));
      return [...reindexed, ...archivedHs];
    });
    await fetch("/api/habits/reorder", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: list.map((h) => h.id) }),
    });
    refresh();
  };

  return (
    <div className="space-y-8">
      {/* Active */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-dim">
          Active ({active.length})
        </h2>
        {active.length === 0 ? (
          <p className="text-sm text-muted">No active habits. Add one below.</p>
        ) : (
          <ul className="space-y-2">
            {active.map((h, i) => (
              <li key={h.id} className="surface flex items-center gap-2 rounded-2xl p-2 pl-4">
                <EditableName
                  value={h.name}
                  onSave={(name) => updateHabit(h.id, { name })}
                />
                <div className="flex items-center gap-1">
                  <IconBtn
                    label="Move up"
                    disabled={i === 0 || pending}
                    onClick={() => move(h.id, -1)}
                  >
                    <ArrowIcon dir="up" />
                  </IconBtn>
                  <IconBtn
                    label="Move down"
                    disabled={i === active.length - 1 || pending}
                    onClick={() => move(h.id, 1)}
                  >
                    <ArrowIcon dir="down" />
                  </IconBtn>
                  <IconBtn
                    label="Archive"
                    onClick={() => updateHabit(h.id, { active: false })}
                  >
                    <ArchiveIcon />
                  </IconBtn>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add form */}
        <div className="surface mt-3 flex items-center gap-2 rounded-2xl p-2 pl-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addHabit();
            }}
            placeholder="New habit…"
            className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-dim"
          />
          <button
            onClick={addHabit}
            disabled={!newName.trim()}
            className="rounded-full bg-ink-100 px-4 py-2 text-sm font-medium text-ink-950 transition-opacity disabled:opacity-30"
          >
            Add
          </button>
        </div>
      </section>

      {/* Archived */}
      {archived.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-dim">
            Archived ({archived.length})
          </h2>
          <ul className="space-y-2">
            {archived.map((h) => (
              <li
                key={h.id}
                className="surface flex items-center justify-between gap-2 rounded-2xl p-2 pl-4"
              >
                <span className="truncate text-base text-muted">{h.name}</span>
                <button
                  onClick={() => updateHabit(h.id, { active: true })}
                  className="rounded-full bg-ink-800 px-3.5 py-1.5 text-sm text-ink-200 hover:bg-ink-700"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-dim">
            Archived habits stop appearing tomorrow at 5am. Their past ratings stay in history.
          </p>
        </section>
      )}
    </div>
  );
}

function EditableName({
  value,
  onSave,
}: {
  value: string;
  onSave: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft.trim() && draft.trim() !== value) onSave(draft.trim());
          else setDraft(value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="min-w-0 flex-1 truncate py-2 text-left text-base hover:text-ink-100"
    >
      {value}
    </button>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink-800 hover:text-ink-100 disabled:opacity-25"
    >
      {children}
    </button>
  );
}

function ArrowIcon({ dir }: { dir: "up" | "down" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: dir === "down" ? "rotate(180deg)" : undefined }}
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
      <path d="M10 13h4" />
    </svg>
  );
}
