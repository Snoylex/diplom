import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DiscountsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/promotions')
      .then((res) => res.json())
      .then((data) => {
        const active = data.filter(
          (p: any) => p.aktiv === 1
        );

        setPromotions(active);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link
            to="/"
            className="
              p-2
              rounded-xl
              active:scale-95
              transition
              hover:bg-gray-100
            "
          >
            <ArrowLeft size={24} />
          </Link>

          <h1 className="text-2xl font-bold">
            Акции
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 mt-4 space-y-4">
        {promotions.map((promo) => (
          <div
            key={promo.ID}
            className="
              bg-white
              rounded-2xl
              shadow-sm
              p-4
              border border-gray-100
            "
          >
            {/* TOP */}
            <div className="flex items-start justify-between gap-3">
              
              <div className="flex-1">
                <h2
                  className="
                    text-lg
                    font-bold
                    leading-tight
                    break-words
                  "
                >
                  {promo.name}
                </h2>

                <div className="mt-3">
                  <span className="text-gray-500 text-sm">
                    Скидка
                  </span>

                  <p className="text-2xl font-bold text-orange-500">
                    {promo.procent_skidki}%
                  </p>
                </div>
              </div>

              {/* BADGE */}
              <div
                className="
                  bg-orange-100
                  text-orange-600
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-semibold
                  whitespace-nowrap
                "
              >
                Акция
              </div>
            </div>

            {/* INFO */}
            <div className="mt-4 space-y-2">
              {promo.Name_blyuda && (
                <div
                  className="
                    bg-gray-50
                    rounded-xl
                    px-3
                    py-2
                  "
                >
                  <p className="text-sm text-gray-500">
                    Блюдо
                  </p>

                  <p className="font-medium text-gray-900">
                    {promo.Name_blyuda}
                  </p>
                </div>
              )}

              {promo.nazvanie_kategorii && (
                <div
                  className="
                    bg-gray-50
                    rounded-xl
                    px-3
                    py-2
                  "
                >
                  <p className="text-sm text-gray-500">
                    Категория
                  </p>

                  <p className="font-medium text-gray-900">
                    {promo.nazvanie_kategorii}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}