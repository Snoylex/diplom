import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface Props {
  dish: any;
  onClick: (dish: any) => void;        // клик по карточке → открывает модальное блюда
  onAddToCart: (dish: any) => void;    // клик по кнопке "В корзину"
}

export default function DishCard({ dish, onClick, onAddToCart }: Props) {
  const name = dish.Name_blyuda || 'Без названия';
  const description = dish.Opisanie || 'Описание отсутствует';
  const price = dish.Price || '—';
  const photoName = dish.Foto || 'default.jpg';

  const imageUrl = `/images/dishes/${photoName}`;

  return (
    <Card 
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full"
      onClick={() => onClick(dish)}   // клик по всей карточке открывает модалку блюда
    >
      <div className="relative h-60 overflow-hidden bg-gray-100">
        <img 
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/dishes/default.jpg';
          }}
        />
        <Badge className="absolute top-4 right-4 bg-orange-500 text-white font-semibold px-4 py-1">
          {price} ₽
        </Badge>
      </div>

      <CardContent className="p-6 flex flex-col">
        <h3 className="font-bold text-xl mb-3 line-clamp-2">{name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-grow">
          {description}
        </p>

        <Button 
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600"
          onClick={(e) => {
            e.stopPropagation();        // важно! чтобы не открывалась модалка блюда
            onAddToCart(dish);
          }}
        >
          <ShoppingCart size={18} className="mr-2" />
          В корзину
        </Button>
      </CardContent>
    </Card>
  );
}