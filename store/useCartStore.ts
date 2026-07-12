import { create } from "zustand";
import type { Product } from "@/lib/supabase/types";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeOne: (productId: string) => void;
  removeAll: (productId: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalCount: () => number;
  totalSum: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    }),

  removeOne: (productId) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === productId);
      if (!existing) return state;
      if (existing.quantity <= 1) {
        return { items: state.items.filter((i) => i.product.id !== productId) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }),

  removeAll: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),

  clear: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalSum: () =>
    get().items.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
}));
