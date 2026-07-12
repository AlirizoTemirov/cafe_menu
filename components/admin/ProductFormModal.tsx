"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ImageUploader";
import { supabase } from "@/lib/supabase/client";
import type { Category, Product } from "@/lib/supabase/types";

const empty = {
  name: "",
  category_id: "",
  price: "",
  cost_price: "",
  description: "",
  image_url: null as string | null,
};

export function ProductFormModal({
  open,
  product,
  categories,
  onClose,
  onSaved,
}: {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        product
          ? {
              name: product.name,
              category_id: product.category_id,
              price: String(product.price),
              cost_price: String(product.cost_price),
              description: product.description ?? "",
              image_url: product.image_url,
            }
          : { ...empty, category_id: categories[0]?.id ?? "" }
      );
    }
  }, [open, product, categories]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.category_id || !form.price) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category_id: form.category_id,
        price: Number(form.price),
        cost_price: Number(form.cost_price) || 0,
        description: form.description.trim() || null,
        image_url: form.image_url,
        is_active: true,
      };

      if (product) {
        await supabase.from("products").update(payload).eq("id", product.id);
      } else {
        await supabase.from("products").insert(payload);
      }
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Saqlashda xatolik yuz berdi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} className="sm:max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 pt-14">
        <h2 className="font-display text-xl font-semibold">
          {product ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
        </h2>

        <div>
          <Label>Rasm</Label>
          <ImageUploader
            value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
          />
        </div>

        <div>
          <Label>Nomi</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Masalan: Cappuccino"
            required
          />
        </div>

        <div>
          <Label>Kategoriya</Label>
          <Select
            value={form.category_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, category_id: e.target.value }))
            }
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Sotuv narxi</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="12000"
              required
            />
          </div>
          <div>
            <Label>Tannarx</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={form.cost_price}
              onChange={(e) =>
                setForm((f) => ({ ...f, cost_price: e.target.value }))
              }
              placeholder="6000"
            />
          </div>
        </div>

        <div>
          <Label>Tarkibi</Label>
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Espresso, sut, ko'pik..."
          />
        </div>

        <Button type="submit" size="lg" disabled={saving} className="w-full">
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </form>
    </Modal>
  );
}
