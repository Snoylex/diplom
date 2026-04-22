import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DishCard from '@/components/menu/DishCard';
import DishModal from '@/components/menu/DishModal';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function MenuPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Корзина
  const { cart, addToCart, totalItems } = useCart();

  // Загрузка данных из бэкенда
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, dishRes] = await Promise.all([
          fetch('http://localhost:5000/api/categories'),
          fetch('http://localhost:5000/api/dishes')
        ]);

        const catData = await catRes.json();
        const dishData = await dishRes.json();

        setCategories(catData);
        setDishes(dishData);
      } catch (err) {
        console.error('Ошибка загрузки меню:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDishes = activeCategory === "all" 
    ? dishes 
    : dishes.filter(d => d.ID_kategorii === Number(activeCategory));

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-2xl">Загрузка меню...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок + иконка корзины */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold">Наше меню</h1>
            <p className="text-gray-600 text-xl mt-2">Свежие ингредиенты и домашние рецепты</p>
          </div>

          {/* Иконка корзины — только здесь */}
          
            <Button 
              variant="outline" 
              className="flex items-center gap-3 px-6 py-3 text-lg"
              onClick={() => alert('Модальное окно корзины будет здесь (следующий шаг)')}
            >
              <ShoppingCart size={24} />
              Корзина {totalItems > 0 && `(${totalItems})`}
            </Button>
          
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-10">
            <TabsTrigger value="all">Все блюда</TabsTrigger>
            {categories.map(cat => (
              <TabsTrigger key={cat.ID} value={cat.ID.toString()}>
                {cat.nazvanie_kategorii}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDishes.map(dish => (
                <DishCard 
                  key={dish.ID} 
                  dish={dish} 
                  onClick={setSelectedDish}
				  onAddToCart={addToCart}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Модальное окно блюда */}
      <DishModal 
        dish={selectedDish} 
        isOpen={!!selectedDish} 
        onClose={() => setSelectedDish(null)} 
      />
    </div>
  );
}