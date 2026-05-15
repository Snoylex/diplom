import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  Tabs,
  TabsContent,
} from '@/components/ui/tabs';

import DishCard from '@/components/menu/DishCard';
import DishModal from '@/components/menu/DishModal';

import { useCart } from '../context/CartContext';

import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';

import CartModal from '@/components/cart/CartModal';
import OrderFormModal from '@/components/cart/OrderFormModal';

import { useAuth } from '../context/AuthContext';

export default function MenuPage() {

  const [categories, setCategories] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);

  const [selectedDish, setSelectedDish] = useState<any>(null);

  const [activeCategory, setActiveCategory] =
    useState('all');

  const [loading, setLoading] = useState(true);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [isOrderFormOpen, setIsOrderFormOpen] =
    useState(false);

  const { user } = useAuth();

  const {
    addToCart,
    totalItems,
  } = useCart();

  // ====================================
  // ЗАГРУЗКА
  // ====================================

  useEffect(() => {

    const fetchData = async () => {

      try {

        const [catRes, dishRes] =
          await Promise.all([

            fetch(
              '/api/api/categories'
            ),

            fetch(
              '/api/api/dishes'
            ),

          ]);

        if (catRes.ok) {
          setCategories(await catRes.json());
        }

        if (dishRes.ok) {
          setDishes(await dishRes.json());
        }

      } catch (err) {

        console.error(
          'Ошибка загрузки меню:',
          err
        );

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, []);

  // ====================================
  // ФИЛЬТР
  // ====================================

  const filteredDishes =
    Array.isArray(dishes)

      ? (
          activeCategory === 'all'
            ? dishes
            : dishes.filter(
                (d) =>
                  d.ID_kategorii ===
                  Number(activeCategory)
              )
        )

      : [];

  // ====================================
  // LOADING
  // ====================================

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-2xl
      ">

        Загрузка меню...

      </div>

    );

  }

  // ====================================
  // UI
  // ====================================

  return (

    <div className="
      min-h-screen
      bg-orange-50
      py-6
      md:py-10
    ">

      <div className="
        max-w-7xl
        mx-auto
        px-3
        sm:px-5
        lg:px-6
      ">

        {/* HEADER */}

        <div className="
  bg-white
  shadow-sm
  rounded-3xl
  p-4
  md:p-6
  flex
  items-center
  justify-between
  gap-4
  mb-8
">

  <div className="flex items-center gap-4">

    <Link
      to="/"
      className="
        w-12
        h-12
        flex
        items-center
        justify-center
        rounded-2xl
        bg-white
        hover:bg-gray-100
        transition
      "
    >

      <ArrowLeft size={22} />

    </Link>

    <div>

      <h1 className="
        text-2xl
        md:text-5xl
        font-bold
      ">
        Меню
      </h1>

      <p className="
        text-gray-500
        text-sm
        md:text-lg
        mt-1
      ">
        Свежие ингредиенты
        и домашние рецепты
      </p>

    </div>

  </div>


          <div className="
            flex
            flex-col
            sm:flex-row
            gap-3
            sm:items-center
          ">

            {user ? (

              <div className="
                bg-white
                px-4
                py-3
                rounded-2xl
                
                md:text-base
              ">

                Здравствуйте,
                {' '}
                {user.fio}

              </div>

            ) : (

              <div className="
                flex
                flex-col
                sm:flex-row
                gap-3
                sm:items-center
              ">

                <span className="
                  text-sm
                  md:text-base
                ">
                  Для заказа войдите
                </span>

                <button
                  onClick={() =>
                    window.location.href =
                      '/login'
                  }
                  className="
                    bg-orange-500
                    text-white
                    px-5
                    py-2
                    rounded-xl
                  "
                >
                  Войти
                </button>

              </div>

            )}

            <Button
              variant="outline"
              className="
                flex
                items-center
                justify-center
                gap-3
                px-5
                py-6
                text-base
                md:text-lg
                rounded-2xl
              "
              onClick={() => {

                if (!user) return;

                setIsCartOpen(true);

              }}
            >

              <ShoppingCart size={22} />

              Корзина

              {totalItems > 0 &&
                ` (${totalItems})`}

            </Button>

          </div>

        </div>

        {/* КАТЕГОРИИ */}

        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
        >

          <div className="
            sticky
            top-0
            z-20
            bg-orange-50
            pb-4
          ">

            <div className="
              flex
              gap-3
              overflow-x-auto
              py-2
              px-1
              scrollbar-thin
              scrollbar-thumb-orange-300
            ">

              <button
                onClick={() =>
                  setActiveCategory('all')
                }
                className={`
                  whitespace-nowrap
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  transition
                  min-w-fit

                  ${
                    activeCategory === 'all'

                      ? 'bg-orange-500 text-white'

                      : `
                        bg-white
                        hover:bg-orange-100
                      `
                  }
                `}
              >
                Все блюда
              </button>

              {categories.map((cat) => (

                <button
                  key={cat.ID}
                  onClick={() =>
                    setActiveCategory(
                      cat.ID.toString()
                    )
                  }
                  className={`
                    whitespace-nowrap
                    px-5
                    py-3
                    rounded-2xl
                    font-semibold
                    transition
                    min-w-fit

                    ${
                      activeCategory ===
                      cat.ID.toString()

                        ? 'bg-orange-500 text-white'

                        : `
                          bg-white
                          hover:bg-orange-100
                        `
                    }
                  `}
                >

                  {cat.nazvanie_kategorii}

                </button>

              ))}

            </div>

          </div>

          {/* БЛЮДА */}

          <TabsContent value={activeCategory}>

            {filteredDishes.length === 0 ? (

              <p className="
                text-center
                py-20
                text-gray-500
                text-xl
              ">

                Нет блюд
                в этой категории

              </p>

            ) : (

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-5
                md:gap-7
              ">

                {filteredDishes.map((dish) => (

                  <DishCard
                    key={dish.ID}
                    dish={dish}
                    onClick={setSelectedDish}
                    onAddToCart={addToCart}
                  />

                ))}

              </div>

            )}

          </TabsContent>

        </Tabs>

      </div>

      {/* МОДАЛКА БЛЮДА */}

      <DishModal
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() =>
          setSelectedDish(null)
        }
        onAddToOrder={() => {

          setSelectedDish(null);

          setIsOrderFormOpen(true);

        }}
      />

      {/* КОРЗИНА */}

      <CartModal
        isOpen={isCartOpen}
        onClose={() =>
          setIsCartOpen(false)
        }
        onOpenOrderForm={() => {

          setIsCartOpen(false);

          setIsOrderFormOpen(true);

        }}
      />

      {/* ФОРМА ЗАКАЗА */}

      <OrderFormModal
        isOpen={isOrderFormOpen}
        onClose={() =>
          setIsOrderFormOpen(false)
        }
      />

    </div>

  );

}