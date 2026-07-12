"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Receipt, TrendingUp, Wallet, Banknote, CreditCard } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { OrderWithItems } from "@/lib/supabase/types";
import { cn, formatDate, formatSum } from "@/lib/utils";

const paymentLabel: Record<string, string> = {
  card: "Karta",
  cash: "Naqd",
  mixed: "Aralash",
};

export default function SalesPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      setOrders((data as OrderWithItems[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const summary = useMemo(() => {
    return orders.reduce(
      (acc, o) => {
        acc.revenue += o.total;
        acc.cost += o.total_cost;
        acc.profit += o.profit;
        acc.cash += o.cash_amount;
        acc.card += o.card_amount;
        return acc;
      },
      { revenue: 0, cost: 0, profit: 0, cash: 0, card: 0 }
    );
  }, [orders]);

  const groups = useMemo(() => {
    const map = new Map<string, OrderWithItems[]>();
    for (const o of orders) {
      const day = new Date(o.created_at).toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(o);
    }
    return Array.from(map.entries());
  }, [orders]);

  return (
    <div className="smooth-enter px-4 pb-6 pt-5">
      <h1 className="font-display text-2xl font-semibold text-espresso-900">
        Sotuvlar
      </h1>
      <p className="mb-4 text-sm text-espresso-900/50">
        Barcha buyurtmalar va foyda hisoboti
      </p>

      <div className="stagger-list mb-5 grid grid-cols-2 gap-3">
        <SummaryCard
          icon={<Receipt className="h-4 w-4" />}
          label="Jami tushum"
          value={summary.revenue}
          tone="espresso"
        />
        <SummaryCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Sof foyda"
          value={summary.profit}
          tone="sage"
        />
        <SummaryCard
          icon={<CreditCard className="h-4 w-4" />}
          label="Kartadan tushgan"
          value={summary.card}
          tone="amber"
        />
        <SummaryCard
          icon={<Banknote className="h-4 w-4" />}
          label="Naqddan tushgan"
          value={summary.cash}
          tone="amber"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-card bg-cream-200" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center text-espresso-900/40">
          <Wallet className="h-8 w-8" />
          <p className="font-medium">Hozircha sotuvlar yo&apos;q</p>
        </div>
      ) : (
        <div className="stagger-list space-y-6">
          {groups.map(([day, dayOrders]) => {
            const dayTotal = dayOrders.reduce((s, o) => s + o.total, 0);
            return (
              <div key={day}>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-espresso-900/60">
                    {day}
                  </h2>
                  <span className="font-mono text-sm font-semibold tabular-nums text-espresso-900/60">
                    {formatSum(dayTotal)} so&apos;m
                  </span>
                </div>
                <div className="space-y-2">
                  {dayOrders.map((order) => (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-card bg-cream-50 shadow-soft transition-shadow duration-200 hover:shadow-lift"
                    >
                      <button
                        onClick={() =>
                          setOpenOrder(openOrder === order.id ? null : order.id)
                        }
                        className="flex w-full items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-cream-100"
                      >
                        <div className="text-left">
                          <p className="text-sm font-semibold">
                            {formatDate(order.created_at)}
                          </p>
                          <p className="text-xs text-espresso-900/45">
                            {order.order_items?.length ?? 0} xil mahsulot &middot;{" "}
                            {paymentLabel[order.payment_method]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold tabular-nums text-amber-600">
                            {formatSum(order.total)}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-espresso-900/40 transition-transform",
                              openOrder === order.id && "rotate-180"
                            )}
                          />
                        </div>
                      </button>

                      {openOrder === order.id && (
                        <div className="dashed-divider mx-4" />
                      )}
                      {openOrder === order.id && (
                        <div className="smooth-rise space-y-1.5 px-4 py-3 text-sm">
                          {order.order_items?.map((it) => (
                            <div key={it.id} className="flex justify-between">
                              <span className="text-espresso-900/70">
                                {it.product_name}{" "}
                                <span className="font-mono text-espresso-900/40">
                                  x{it.quantity}
                                </span>
                              </span>
                              <span className="font-mono tabular-nums">
                                {formatSum(it.line_total)}
                              </span>
                            </div>
                          ))}
                          <div className="mt-2 flex justify-between border-t border-espresso-900/10 pt-2 text-xs text-espresso-900/50">
                            <span>Tannarx</span>
                            <span className="font-mono tabular-nums">
                              {formatSum(order.total_cost)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold text-sage-600">
                            <span>Sof foyda</span>
                            <span className="font-mono tabular-nums">
                              {formatSum(order.profit)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "espresso" | "sage" | "amber";
}) {
  const toneClasses = {
    espresso: "bg-espresso-900 text-cream-50",
    sage: "bg-sage-500 text-cream-50",
    amber: "bg-cream-50 text-espresso-900 border-2 border-amber-500/30",
  }[tone];

  return (
    <div className={cn("interactive-lift rounded-card p-3.5 shadow-soft hover:shadow-lift", toneClasses)}>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium opacity-70">
        {icon}
        {label}
      </div>
      <p className="font-mono text-lg font-bold tabular-nums">
        {formatSum(value)}
      </p>
    </div>
  );
}
