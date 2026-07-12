"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Coffee, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Category, Product } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { cn, formatSum } from "@/lib/utils";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { CategoryPanel } from "@/components/admin/CategoryPanel";

type Tab = "products" | "categories";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null | "new">(null);

  async function loadAll() {
    setLoading(true);
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("*").order("name"),
    ]);
    setCategories(cats ?? []);
    setProducts(prods ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleDeleteProduct(id: string) {
    if (!confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadAll();
  }

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="smooth-enter px-4 pb-6 pt-5">
      <h1 className="font-display text-2xl font-semibold text-espresso-900">
        Boshqaruv
      </h1>
      <p className="mb-4 text-sm text-espresso-900/50">
        Mahsulot va kategoriyalarni boshqaring
      </p>

      <div className="mb-5 flex gap-2 rounded-2xl bg-cream-200 p-1">
        <TabButton
          active={tab === "products"}
          onClick={() => setTab("products")}
          icon={<Coffee className="h-4 w-4" />}
          label="Mahsulotlar"
        />
        <TabButton
          active={tab === "categories"}
          onClick={() => setTab("categories")}
          icon={<Tag className="h-4 w-4" />}
          label="Kategoriyalar"
        />
      </div>

      {tab === "products" ? (
        <div>
          <Button
            variant="secondary"
            size="md"
            className="mb-4 w-full"
            onClick={() => setEditing("new")}
            disabled={categories.length === 0}
          >
            <Plus className="h-4 w-4" /> Yangi mahsulot
          </Button>
          {categories.length === 0 && (
            <p className="mb-4 text-center text-sm text-espresso-900/45">
              Avval kamida bitta kategoriya qo&apos;shing
            </p>
          )}

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-card bg-cream-200" />
              ))}
            </div>
          ) : (
            <div className="stagger-list space-y-2">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="interactive-lift flex items-center gap-3 rounded-card bg-cream-50 p-2.5 shadow-soft hover:shadow-lift"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-espresso-900/20">
                        <Coffee className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-espresso-900/45">
                      {categoryName(p.category_id)}
                    </p>
                    <p className="font-mono text-sm font-semibold tabular-nums text-amber-600">
                      {formatSum(p.price)} so&apos;m
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <button
                      onClick={() => setEditing(p)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-200 text-espresso-900 transition-transform duration-150 active:scale-90"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-brick-500/10 text-brick-500 transition-transform duration-150 active:scale-90"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <CategoryPanel categories={categories} onChange={loadAll} />
      )}

      <ProductFormModal
        open={editing !== null}
        product={editing === "new" ? null : editing}
        categories={categories}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          loadAll();
        }}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-200 active:scale-[0.98]",
        active ? "bg-cream-50 text-espresso-900 shadow-soft" : "text-espresso-900/45 hover:text-espresso-900"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
