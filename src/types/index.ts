export interface Product {
  name: string;
  price: string;
  img: string;
  id?: string;
}

export interface Category {
  id: string;
  title: string;
  desc: string;
  products: Product[];
}

export interface CategoriesData {
  [key: string]: Omit<Category, 'id'>;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: Record<string, string>;
}

export type CartItemInput = Omit<CartItem, 'id' | 'quantity'> & { id?: string; quantity?: number };

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'customer';
}
