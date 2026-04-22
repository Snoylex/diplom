import { useState, useEffect } from 'react';
import { CartItem, CustomerData, Cart } from '../types/cart';

const CART_STORAGE_KEY = 'burekas_cart';

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    customer: null,
  });

  // Загрузка корзины из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  // Сохранение корзины в localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
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

  const setCustomerData = (customer: CustomerData) => {
    setCart((prev) => ({ ...prev, customer }));
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
    setCustomerData,
    clearCart,
    totalItems,
    totalPrice,
  };
}