"use client";

import { useEffect, useState } from "react";
import { Coffee } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Category, Product } from "@/lib/supabase/types";
import { CategoryChips } from "@/components/CategoryChips";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { CartFab } from "@/components/CartFab";
import { CartSheet } from "@/components/CartSheet";

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("name"),
      ]);
      setCategories(cats ?? []);
      setProducts(prods ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category_id === activeCategory);

  return (
    <div className="smooth-enter">
      <header className="sticky top-0 z-20 bg-cream-100/95 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4 pt-5">
          <Coffee className="h-6 w-6 text-amber-600" />
          <h1 className="font-display text-2xl font-semibold text-espresso-900">
            Menyu
          </h1>
        </div>
        <CategoryChips
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      </header>

      <main className="px-4 pb-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-card bg-cream-200"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="smooth-rise flex flex-col items-center gap-2 py-20 text-center text-espresso-900/40">
            <Coffee className="h-8 w-8" />
            <p className="font-medium">Mahsulotlar topilmadi</p>
            <p className="text-sm">
              &quot;Boshqaruv&quot; bo&apos;limidan mahsulot qo&apos;shing
            </p>
          </div>
        ) : (
          <div className="stagger-list grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={setSelected}
              />
            ))}
          </div>
        )}
      </main>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <CartFab />
      <CartSheet />
    </div>
  );
}
