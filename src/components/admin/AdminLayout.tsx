import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft, X, Menu } from 'lucide-react';

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-orange-50">

      {/* TOP BAR (mobile only) */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center justify-between px-4 z-50 md:hidden">

        <Link to="/" className="p-2">
          <ArrowLeft size={20} />
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-black text-white rounded"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-72 bg-white z-50 p-6
          transition-transform duration-300
          ${open ? 'translate-x-0' : 'translate-x-full'}
          md:hidden
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">Меню</h1>

          <button
            onClick={() => setOpen(false)}
            className="p-2"
          >
            <X />
          </button>
        </div>

        {/* 🔥 УВЕЛИЧЕННЫЕ ОТСТУПЫ */}
        <nav className="flex flex-col gap-5">

          <Link
            onClick={() => setOpen(false)}
            to="/admin/menu"
            className="p-3 rounded-xl bg-orange-100"
          >
            Меню
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/admin/orders"
            className="p-3 rounded-xl bg-orange-100"
          >
            Заказы
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/admin/ordersarchive"
            className="p-3 rounded-xl bg-orange-100"
          >
            Архив
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/admin/categories"
            className="p-3 rounded-xl bg-orange-100"
          >
            Категории
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/admin/reviews"
            className="p-3 rounded-xl bg-orange-100"
          >
            Отзывы
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/admin/promotions"
            className="p-3 rounded-xl bg-orange-100"
          >
            Акции
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/admin/events"
            className="p-3 rounded-xl bg-orange-100"
          >
            Мероприятия
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/admin/images"
            className="p-3 rounded-xl bg-orange-100"
          >
            Изображения
          </Link>

        </nav>
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:block fixed top-0 left-0 h-full w-72 bg-white border-r p-6 z-50">

        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 rounded hover:bg-orange-100">
            <ArrowLeft size={18} />
          </Link>

          <h1 className="text-xl font-bold">
            Админ панель
          </h1>
        </div>

        <nav className="flex flex-col gap-4">

          <Link
            to="/admin/menu"
            className="p-3 rounded-xl hover:bg-orange-100"
          >
            Меню
          </Link>

          <Link
            to="/admin/orders"
            className="p-3 rounded-xl hover:bg-orange-100"
          >
            Заказы
          </Link>

          <Link
            to="/admin/ordersarchive"
            className="p-3 rounded-xl hover:bg-orange-100"
          >
            Архив
          </Link>

          <Link
            to="/admin/categories"
            className="p-3 rounded-xl hover:bg-orange-100"
          >
            Категории
          </Link>

          <Link
            to="/admin/reviews"
            className="p-3 rounded-xl hover:bg-orange-100"
          >
            Отзывы
          </Link>

          <Link
            to="/admin/promotions"
            className="p-3 rounded-xl hover:bg-orange-100"
          >
            Акции
          </Link>

          <Link
            to="/admin/events"
            className="p-3 rounded-xl hover:bg-orange-100"
          >
            Мероприятия
          </Link>

          <Link
            to="/admin/images"
            className="p-3 rounded-xl hover:bg-orange-100"
          >
            Изображения
          </Link>

        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-4 md:p-10 pt-16 md:ml-72">
        <Outlet />
      </main>

    </div>
  );
}