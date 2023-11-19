export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  count: number;
};

export type Cart = {
  id: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  status: string;
  cart_items: CartItem[];
};
