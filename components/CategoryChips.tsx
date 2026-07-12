"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/supabase/types";

export function CategoryChips({
  categories,
  active,
  onSelect,
}: {
  categories: Category[];
  active: string | "all";
  onSelect: (id: string | "all") => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
      <button
        onClick={() => onSelect("all")}
        className={cn(
          "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-200 active:scale-95",
          active === "all"
            ? "bg-espresso-900 text-cream-50 shadow-soft"
            : "bg-cream-200 text-espresso-900/60 hover:bg-cream-300 hover:text-espresso-900"
        )}
      >
        Barchasi
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-200 active:scale-95",
            active === c.id
              ? "bg-espresso-900 text-cream-50 shadow-soft"
              : "bg-cream-200 text-espresso-900/60 hover:bg-cream-300 hover:text-espresso-900"
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
