import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderForm: () => void;
}

export default function CartModal({ isOpen, onClose, onOpenOrderForm }: Props) {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    
    alert(`Заказ оформлен на сумму ${totalPrice} ₽!\n\nНомер телефона: ${'Не указан'}`);
    clearCart();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl">Ваша корзина</DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            Корзина пуста
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-6 last:border-0">
                  <img 
                    src={`/images/dishes/${item.foto}`} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{item.name}</h4>
                    <p className="text-orange-600 font-medium">{item.price} ₽</p>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border rounded-lg">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                  <div className="font-semibold text-lg">
                    {(item.price * item.quantity).toFixed(2)} ₽
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 mt-4">
              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Итого:</span>
                <span>{totalPrice.toFixed(2)} ₽</span>
              </div>

              <Button 
                onClick={onOpenOrderForm}
				className="w-full py-7 text-xl bg-orange-500 hover:bg-orange-600"
				disabled={items.length === 0}
              >
                Оформить заказ
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}