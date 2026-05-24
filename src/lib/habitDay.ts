import { format, addDays, subDays, parseISO } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export const APP_TZ = "America/New_York";
export const DAY_START_HOUR = 5;

/**
 * The "habit day" rolls over at 5am ET. Anything before 5am ET is still part
 * of the previous calendar day's habit log. Returns YYYY-MM-DD.
 */
export function currentHabitDate(now: Date = new Date()): string {
  const zoned = toZonedTime(now, APP_TZ);
  const effective = zoned.getHours() < DAY_START_HOUR ? subDays(zoned, 1) : zoned;
  return format(effective, "yyyy-MM-dd");
}

/** Human-readable label for a habit-day (e.g. "Saturday, May 23"). */
export function formatHabitDate(habitDate: string, now: Date = new Date()): string {
  const today = currentHabitDate(now);
  const yesterday = format(subDays(parseISO(today), 1), "yyyy-MM-dd");
  if (habitDate === today) return `Today · ${format(parseISO(habitDate), "EEEE, MMM d")}`;
  if (habitDate === yesterday) return `Yesterday · ${format(parseISO(habitDate), "EEEE, MMM d")}`;
  return format(parseISO(habitDate), "EEEE, MMM d, yyyy");
}

/** Short label for a habit-day (e.g. "May 23"). */
export function shortHabitDate(habitDate: string): string {
  return format(parseISO(habitDate), "MMM d");
}

/** Day-of-week label (e.g. "Sat"). */
export function weekdayShort(habitDate: string): string {
  return format(parseISO(habitDate), "EEE");
}

/** List of N most recent habit dates (newest first) up to and including today. */
export function recentHabitDates(count: number, now: Date = new Date()): string[] {
  const today = parseISO(currentHabitDate(now));
  return Array.from({ length: count }, (_, i) => format(subDays(today, i), "yyyy-MM-dd"));
}

/** When the next 5am rollover happens, returned as an ISO timestamp (UTC). */
export function nextRolloverIso(now: Date = new Date()): string {
  const zoned = toZonedTime(now, APP_TZ);
  const targetZoned = zoned.getHours() < DAY_START_HOUR ? zoned : addDays(zoned, 1);
  targetZoned.setHours(DAY_START_HOUR, 0, 0, 0);
  return fromZonedTime(targetZoned, APP_TZ).toISOString();
}
