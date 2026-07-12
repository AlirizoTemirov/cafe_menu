"use client";

import Image from "next/image";
import { Eye, Coffee } from "lucide-react";
import type { Product } from "@/lib/supabase/types";
import { formatSum } from "@/lib/utils";

export function ProductCard({
  product,
  onView,
}: {
  product: Product;
  onView: (product: Product) => void;
}) {
  return (
    <button
      onClick={() => onView(product)}
      className="interactive-lift group flex flex-col overflow-hidden rounded-card bg-cream-50 text-left shadow-soft hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-cream-200">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-active:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-espresso-900/20 transition-transform duration-300 group-hover:scale-105">
            <Coffee className="h-10 w-10" />
          </div>
        )}
        <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-espresso-950/45 text-cream-50 opacity-90 backdrop-blur-sm transition-[transform,background-color,opacity] duration-200 group-hover:scale-105 group-hover:bg-espresso-950/60 group-hover:opacity-100">
          <Eye className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 px-3 py-2.5">
        <h3 className="font-display text-[15px] font-semibold leading-tight text-espresso-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="font-mono text-sm font-semibold tabular-nums text-amber-600">
          {formatSum(product.price)} so&apos;m
        </p>
      </div>
    </button>
  );
}
