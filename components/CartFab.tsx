"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatSum } from "@/lib/utils";

export function CartFab() {
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  if (count === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed inset-x-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 flex animate-pop items-center justify-between rounded-2xl bg-espresso-900 px-5 py-4 text-cream-50 shadow-lift transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] sm:inset-x-auto sm:right-6 sm:w-80"
    >
      <span className="flex items-center gap-2 font-semibold">
        <span className="relative">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -right-2 -top-2 flex h-4 w-4 animate-pop items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-espresso-950">
            {count}
          </span>
        </span>
        Savat
      </span>
      <span className="font-mono font-bold tabular-nums">
        {formatSum(total)} so&apos;m
      </span>
    </button>
  );
}
