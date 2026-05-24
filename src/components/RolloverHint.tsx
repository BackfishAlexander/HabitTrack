"use client";

import { useEffect, useState } from "react";

export function RolloverHint({ iso }: { iso: string }) {
  const [text, setText] = useState("new day at 5am");

  useEffect(() => {
    const update = () => {
      const target = new Date(iso).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      if (hours >= 1) {
        setText(`new day in ${hours}h ${minutes}m`);
      } else {
        setText(`new day in ${minutes}m`);
      }
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [iso]);

  return <span>{text}</span>;
}
