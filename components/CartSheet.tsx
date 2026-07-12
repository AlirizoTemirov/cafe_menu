"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Trash2, CreditCard, Banknote, Layers, Check } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatSum, cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { supabase } from "@/lib/supabase/client";
import type { PaymentMethod } from "@/lib/supabase/types";

export function CartSheet() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeOne = useCartStore((s) => s.removeOne);
  const removeAll = useCartStore((s) => s.removeAll);
  const clear = useCartStore((s) => s.clear);

  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [cardAmount, setCardAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
    [items]
  );

  const cardAmountNum = payment === "mixed" ? Number(cardAmount) || 0 : payment === "card" ? total : 0;
  const cashAmountNum = payment === "mixed" ? Math.max(total - cardAmountNum, 0) : payment === "cash" ? total : 0;

  const canSave = items.length > 0 && (payment !== "mixed" || (cardAmountNum >= 0 && cardAmountNum <= total));

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const totalCost = items.reduce(
        (sum, i) => sum + i.quantity * i.product.cost_price,
        0
      );
      const profit = total - totalCost;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          total,
          total_cost: totalCost,
          profit,
          payment_method: payment,
          card_amount: cardAmountNum,
          cash_amount: cashAmountNum,
        })
        .select()
        .single();

      if (orderError || !order) throw orderError;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        product_name: i.product.name,
        unit_price: i.product.price,
        unit_cost: i.product.cost_price,
        quantity: i.quantity,
        line_total: i.product.price * i.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setSaved(true);
      setTimeout(() => {
        clear();
        setSaved(false);
        setCardAmount("");
        setPayment("card");
        closeCart();
      }, 900);
    } catch (err) {
      console.error(err);
      alert("Buyurtmani saqlashda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={isOpen} onClose={closeCart}>
      <div className="flex items-center justify-between px-5 pb-3">
        <h2 className="font-display text-xl font-semibold">Savat</h2>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="flex items-center gap-1 text-sm font-medium text-brick-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Tozalash
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-espresso-900/40">
            <p className="font-medium">Savat bo&apos;sh</p>
            <p className="text-sm">Menyudan mahsulot tanlang</p>
          </div>
        ) : (
          <div className="smooth-rise receipt-edge overflow-hidden rounded-t-lg border-2 border-dashed border-espresso-900/15">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-dashed border-espresso-900/15 text-left text-xs uppercase tracking-wide text-espresso-900/45">
                  <th className="py-2 pl-3 font-semibold">Mahsulot</th>
                  <th className="py-2 font-semibold">Soni</th>
                  <th className="py-2 pr-3 text-right font-semibold">Summa</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr
                    key={i.product.id}
                    className="border-b border-dashed border-espresso-900/10 transition-colors duration-200 hover:bg-cream-100 last:border-0"
                  >
                    <td className="py-2.5 pl-3 pr-2">
                      <p className="font-medium leading-tight">{i.product.name}</p>
                      <p className="font-mono text-xs text-espresso-900/45 tabular-nums">
                        {formatSum(i.product.price)} / dona
                      </p>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => removeOne(i.product.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-200 text-espresso-900 transition-transform duration-150 active:scale-90"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-4 text-center font-mono font-semibold tabular-nums">
                          {i.quantity}
                        </span>
                        <button
                          onClick={() => addItem(i.product)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-espresso-950 transition-transform duration-150 active:scale-90"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-right">
                      <p className="font-mono font-semibold tabular-nums">
                        {formatSum(i.quantity * i.product.price)}
                      </p>
                      <button
                        onClick={() => removeAll(i.product.id)}
                        className="text-xs text-brick-500/70"
                      >
                        o&apos;chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="smooth-rise border-t border-espresso-900/10 bg-cream-50 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-display text-lg font-semibold">Jami</span>
            <span className="font-mono text-2xl font-bold tabular-nums text-amber-600">
              {formatSum(total)} so&apos;m
            </span>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-espresso-900/45">
            To&apos;lov turi
          </p>
          <div className="mb-3 grid grid-cols-3 gap-2">
            <PaymentButton
              icon={<CreditCard className="h-4 w-4" />}
              label="Karta"
              active={payment === "card"}
              onClick={() => setPayment("card")}
            />
            <PaymentButton
              icon={<Banknote className="h-4 w-4" />}
              label="Naqd"
              active={payment === "cash"}
              onClick={() => setPayment("cash")}
            />
            <PaymentButton
              icon={<Layers className="h-4 w-4" />}
              label="Ikkalasi"
              active={payment === "mixed"}
              onClick={() => setPayment("mixed")}
            />
          </div>

          {payment === "mixed" && (
            <div className="smooth-rise mb-4 grid grid-cols-2 gap-3 rounded-xl bg-cream-200 p-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-espresso-900/50">
                  Kartadan
                </label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  placeholder="0"
                  className="h-10 bg-cream-50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-espresso-900/50">
                  Naqddan
                </label>
                <div className="flex h-10 items-center rounded-xl border-2 border-espresso-900/10 bg-cream-50 px-4 font-mono text-base tabular-nums text-espresso-900/70">
                  {formatSum(cashAmountNum)}
                </div>
              </div>
            </div>
          )}

          <Button
            variant={saved ? "secondary" : "primary"}
            size="lg"
            className="w-full"
            disabled={!canSave || saving}
            onClick={handleSave}
          >
            {saved ? (
              <>
                <Check className="h-5 w-5" /> Saqlandi
              </>
            ) : saving ? (
              "Saqlanmoqda..."
            ) : (
              "Saqlash"
            )}
          </Button>
        </div>
      )}
    </Sheet>
  );
}

function PaymentButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-xs font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-200 active:scale-95",
        active
          ? "border-espresso-900 bg-espresso-900 text-cream-50 shadow-soft"
          : "border-espresso-900/10 bg-cream-50 text-espresso-900/60 hover:border-espresso-900/20 hover:text-espresso-900"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
