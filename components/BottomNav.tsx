"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Menyu", icon: Coffee },
  { href: "/sales", label: "Sotuvlar", icon: BarChart3 },
  { href: "/admin", label: "Boshqaruv", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-espresso-900/10 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-[transform,color] duration-200 active:scale-95",
                active ? "text-amber-600" : "text-espresso-900/40"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  active && "scale-110 fill-amber-500/20"
                )}
              />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
