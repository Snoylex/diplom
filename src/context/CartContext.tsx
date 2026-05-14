import { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  foto: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (dish: any) => void;
  updateQuantity: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (dish: any) => {
  setItems(prev => {
    const existing = prev.find(i => i.id === dish.ID);

    if (existing) {
      return prev.map(i =>
        i.id === dish.ID ? { ...i, quantity: i.quantity + 1 } : i
      );
    }

    return [
      ...prev,
      {
        id: dish.ID,
        name: dish.Name_blyuda,
        price: dish.Price,
        quantity: 1,
        foto: dish.Foto,
      },
    ];
  });
};
  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return;
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ 
  items, 
  addToCart, 
  updateQuantity, 
  removeItem, 
  clearCart, 
  totalPrice,
  totalItems
	}}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}