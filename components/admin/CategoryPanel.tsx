"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/lib/supabase/types";

export function CategoryPanel({
  categories,
  onChange,
}: {
  categories: Category[];
  onChange: () => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await supabase.from("categories").insert({
        name: name.trim(),
        sort_order: categories.length,
      });
      setName("");
      onChange();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Kategoriyani o'chirish shu kategoriyadagi mahsulotlarga ta'sir qilishi mumkin. Davom etasizmi?"
      )
    )
      return;
    await supabase.from("categories").delete().eq("id", id);
    onChange();
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Yangi kategoriya nomi"
        />
        <Button type="submit" size="md" disabled={saving}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-2 rounded-card bg-cream-50 p-3 shadow-soft"
          >
            <GripVertical className="h-4 w-4 text-espresso-900/25" />
            <span className="flex-1 text-sm font-semibold">{c.name}</span>
            <button
              onClick={() => handleDelete(c.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brick-500/10 text-brick-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="py-8 text-center text-sm text-espresso-900/40">
            Hozircha kategoriya yo&apos;q
          </p>
        )}
      </div>
    </div>
  );
}
