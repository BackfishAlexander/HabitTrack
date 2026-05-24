export type RatingValue = 1 | 2 | 3 | 4 | 5;

export const RATING_META: Record<
  RatingValue,
  { label: string; bg: string; ring: string; chip: string }
> = {
  1: { label: "Total failure", bg: "bg-r1", ring: "ring-r1", chip: "bg-r1/15 text-r1" },
  2: { label: "Bad",           bg: "bg-r2", ring: "ring-r2", chip: "bg-r2/15 text-r2" },
  3: { label: "Acceptable",    bg: "bg-r3", ring: "ring-r3", chip: "bg-r3/15 text-r3" },
  4: { label: "Good",          bg: "bg-r4", ring: "ring-r4", chip: "bg-r4/15 text-r4" },
  5: { label: "Fantastic",     bg: "bg-r5", ring: "ring-r5", chip: "bg-r5/15 text-r5" },
};

export const RATING_VALUES: RatingValue[] = [1, 2, 3, 4, 5];
