import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';


export default function AdminLayout() {
return (
    <div className="min-h-screen flex bg-orange-50">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r p-6">
        {/* Шапка сайдбара */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="p-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft />
          </Link>
          <h1 className="text-1xl sm:text-2xl font-bold whitespace-nowrap">
            Админ панель
          </h1>
        </div>

        {/* Навигация */}
        <nav className="flex flex-col gap-3">
          <Link to="/admin/menu" className="p-3 rounded-xl hover:bg-orange-100">
            Меню
          </Link>

          <Link to="/admin/orders" className="p-3 rounded-xl hover:bg-orange-100">
            Заказы
          </Link>

          <Link to="/admin/ordersarchive" className="p-3 rounded-xl hover:bg-orange-100">
            Заказы архив
          </Link>

          <Link to="/admin/categories" className="p-3 rounded-xl hover:bg-orange-100">
            Категории
          </Link>

          <Link to="/admin/reviews" className="p-3 rounded-xl hover:bg-orange-100">
            Отзывы
          </Link>

          <Link to="/admin/promotions" className="p-3 rounded-xl hover:bg-orange-100">
            Акции
          </Link>

          <Link to="/admin/events" className="p-3 rounded-xl hover:bg-orange-100">
            Мероприятия
          </Link>

          <Link to="/admin/images" className="p-3 rounded-xl hover:bg-orange-100">
            Изображения
          </Link>
        </nav>
      </aside>

	  

      {/* CONTENT */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}