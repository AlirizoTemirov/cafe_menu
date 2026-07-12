export type Category = {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string | null; // tarkibi
  price: number; // sotuv narxi
  cost_price: number; // tannarx (sof foyda hisoblash uchun)
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type PaymentMethod = "card" | "cash" | "mixed";

export type Order = {
  id: string;
  created_at: string;
  total: number;
  total_cost: number;
  profit: number;
  payment_method: PaymentMethod;
  card_amount: number;
  cash_amount: number;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  unit_cost: number;
  quantity: number;
  line_total: number;
};

export type OrderWithItems = Order & { order_items: OrderItem[] };
