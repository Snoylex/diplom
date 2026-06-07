import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Props {
  dish: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (dish: any) => void;   // для первого добавления
}

export default function DishModal({ dish, isOpen, onClose, onAddToOrder }: Props) {
  const { addToCart } = useCart();   // для последующих добавлений

  if (!dish) return null;

  const name = dish.Name_blyuda || 'Без названия';
  const description = dish.Opisanie || 'Описание отсутствует';
  const price = dish.Price || '—';
  const photoName = dish.Foto || 'default.jpg';

  const imageUrl = `/images/dishes/${photoName}`;

	const handleAdd = () => {


		// ВСЕГДА добавляем в корзину
		addToCart(dish);
		const hasExistingOrder = localStorage.getItem('burekas_customer_data');
		
		if (!hasExistingOrder) {
			onAddToOrder(dish);   // открыть форму
		}

		onClose();
		};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={imageUrl}
            alt={name}
            className="w-full h-48 sm:h-64 md:h-80 object-cover"
            onError={(e) => (e.target as HTMLImageElement).src = '/images/dishes/default.jpg'}
          />
        </div>

        <div className="p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">{name}</DialogTitle>
            <DialogDescription className="text-3xl font-bold text-orange-500 mt-2">
              {price} ₽
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 text-gray-700 leading-relaxed text-[17px]">
            {description}
          </div>

          <div className="flex gap-4 mt-10">
            <Button 
              variant="outline" 
              className="flex-1 py-6 text-lg"
              onClick={onClose}
            >
              Закрыть
            </Button>

            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}