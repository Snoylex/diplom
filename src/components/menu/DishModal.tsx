import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  dish: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishModal({ dish, isOpen, onClose }: Props) {
  if (!dish) return null;

  const name = dish.Name_blyuda || 'Без названия';
  const description = dish.Opisanie || 'Описание отсутствует';
  const price = dish.Price || '—';
  const photoName = dish.Foto || 'default.jpg';

  const imageUrl = `/images/dishes/${photoName}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        
        {/* Большое фото */}
        <div className="relative">
          <img 
            src={imageUrl}
            alt={name}
            className="w-full h-80 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/dishes/default.jpg';
            }}
          />
        </div>

        {/* Контент */}
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
            <Button className="flex-1 py-6 text-lg bg-orange-500 hover:bg-orange-600">
              Добавить в заказ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}