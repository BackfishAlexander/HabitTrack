"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Today", icon: TodayIcon },
  { href: "/history", label: "History", icon: HistoryIcon },
  { href: "/habits", label: "Habits", icon: HabitsIcon },
];

export function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Habits
        </Link>
        <nav className="hidden gap-1 text-sm md:flex">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                isActive(t.href)
                  ? "bg-ink-800 text-ink-100"
                  : "text-muted hover:bg-ink-850 hover:text-ink-100"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t divider bg-ink-950/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[720px] items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1">
          {TABS.map((t) => {
            const active = isActive(t.href);
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex flex-1 flex-col items-center gap-0.5 px-3 py-2.5 text-[11px] transition-colors ${
                  active ? "text-ink-100" : "text-muted"
                }`}
              >
                <Icon active={active} />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function TodayIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}

function HistoryIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v6h6" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function HabitsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}
