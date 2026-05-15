import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderFormModal({ isOpen, onClose }: Props) {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (items.length === 0) {
      alert("Корзина пуста!");
      return;
    }

    try {
      const response = await fetch('/api/orders', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
        body: JSON.stringify({
		personal_id: user?.id,
		phone: user?.phone,
		address: user?.address || null,
		fio: user?.fio || null,
		items: items.map(i => ({
			id: i.id,
			quantity: i.quantity,
			price: i.price
		  }))
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Заказ оформлен!");
        clearCart();
        onClose();
      } else {
        alert("Ошибка: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка соединения");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Подтверждение заказа</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p><b>ФИО:</b> {user?.fio}</p>
          <p><b>Телефон:</b> {user?.phone}</p>
		  <p><b>Адрес:</b> {user?.address}</p>

          <div>
            <h3 className="font-semibold mt-4">Состав заказа:</h3>

            {items.map(item => (
              <div key={item.id}>
                {item.name} × {item.quantity} = {item.price * item.quantity} ₽
              </div>
            ))}
          </div>

          <div className="mt-4">
            <b>Итого: {totalPrice} ₽</b>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full py-6 bg-orange-500 hover:bg-orange-600"
          >
            Подтвердить заказ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}