"use client";

import Image from "next/image";
import { Minus, Plus, Coffee } from "lucide-react";
import type { Product } from "@/lib/supabase/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatSum } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeOne = useCartStore((s) => s.removeOne);

  const qty =
    items.find((i) => i.product.id === product?.id)?.quantity ?? 0;

  return (
    <Modal open={!!product} onClose={onClose}>
      {product && (
        <div className="flex flex-col">
          <div className="relative aspect-[4/3] w-full bg-cream-200">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="480px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-espresso-900/20">
                <Coffee className="h-14 w-14" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 p-5">
            <div>
              <h2 className="font-display text-2xl font-semibold text-espresso-900">
                {product.name}
              </h2>
              <p className="mt-1 font-mono text-lg font-bold tabular-nums text-amber-600">
                {formatSum(product.price)} so&apos;m
              </p>
            </div>

            {product.description && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-espresso-900/45">
                  Tarkibi
                </p>
                <p className="text-sm leading-relaxed text-espresso-900/75">
                  {product.description}
                </p>
              </div>
            )}

            <div className="dashed-divider" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-espresso-900/60">
                Miqdori
              </span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeOne(product.id)}
                  disabled={qty === 0}
                  aria-label="Kamaytirish"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center font-mono text-lg font-bold tabular-nums">
                  {qty}
                </span>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => addItem(product)}
                  aria-label="Ko'paytirish"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                addItem(product);
              }}
            >
              Savatga qo&apos;shish
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
