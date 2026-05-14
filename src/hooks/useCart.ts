import { useState, useEffect } from 'react';

const CART_STORAGE_KEY = 'burekas_cart';

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

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    customer: null,
  });

  // Загрузка из localStorage при каждом монтировании
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCart(parsed);
      }
    } catch (e) {
      console.error("Ошибка загрузки корзины из localStorage", e);
    }
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Ошибка сохранения корзины", e);
    }
  }, [cart]);

  const addToCart = (dish: any) => {
    setCart((prev) => {
      const existing = prev.items.find((item) => item.dishId === dish.ID);

      if (existing) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.dishId === dish.ID
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...prev,
          items: [
            ...prev.items,
            {
              dishId: dish.ID,
              name: dish.Name_blyuda,
              price: Number(dish.Price),
              quantity: 1,
              foto: dish.Foto,
            },
          ],
        };
      }
    });
  };

  const updateQuantity = (dishId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.dishId === dishId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };

  const removeItem = (dishId: number) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.dishId !== dishId),
    }));
  };

  const clearCart = () => {
    setCart({ items: [], customer: null });
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  };
}