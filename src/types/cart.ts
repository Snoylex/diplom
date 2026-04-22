export interface CartItem {
  dishId: number;
  name: string;
  price: number;
  quantity: number;
  foto: string;
}

export interface CustomerData {
  fio: string;
  phone: string;
  address: string;
  comment: string;
}

export interface Cart {
  items: CartItem[];
  customer: CustomerData | null;
}