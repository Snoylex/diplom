import { useEffect, useState, useRef } from 'react';

export default function AdminMenuPage() {
  const [dishes, setDishes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyForm = {
    name: '',
    description: '',
    price: '',
    categoryId: '',
    foto: '',
  };

  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    const [dishesRes, catRes] = await Promise.all([
      fetch('/api/admin/dishes'),
      fetch('/api/categories'),
    ]);

    setDishes(await dishesRes.json());
    setCategories(await catRes.json());
  };

  useEffect(() => {
    loadData();
  }, []);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    setForm((prev) => ({
      ...prev,
      foto: data.filename,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const saveDish = async () => {
    setError('');

    if (!form.name.trim()) return setError('Введите название');
    if (!form.price || isNaN(Number(form.price)))
      return setError('Введите корректную цену');
    if (!form.categoryId) return setError('Выберите категорию');

    const url = editingId
      ? `/api/admin/dishes/${editingId}`
      : '/api/admin/dishes';

    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    resetForm();
    loadData();
  };

  const editDish = (dish: any) => {
    setForm({
      name: dish.Name_blyuda,
      description: dish.Opisanie,
      price: dish.Price,
      categoryId: dish.ID_kategorii,
      foto: dish.Foto,
    });

    setEditingId(dish.ID);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDish = async (id: number) => {
    await fetch(`/api/admin/dishes/toggle/${id}`, { method: 'PATCH' });
    loadData();
  };

  const filteredDishes = dishes.filter((dish) =>
    dish.Name_blyuda?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3 md:p-0 max-w-6xl mx-auto">

      {/* TITLE */}
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-10">
        Управление меню
      </h1>

      {/* SEARCH */}
      <input
        className="border p-3 rounded-xl w-full mb-4 md:mb-8 text-sm md:text-base"
        placeholder="Поиск блюда..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow p-3 md:p-6 mb-6 md:mb-10">

        <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-5">
          {editingId ? 'Редактирование блюда' : 'Добавить блюдо'}
        </h2>

        {error && (
          <div className="mb-3 bg-red-100 text-red-600 p-2 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

          <input
            placeholder="Название"
            className="border p-3 rounded-xl text-sm md:text-base"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Цена"
            className="border p-3 rounded-xl text-sm md:text-base"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <select
            className="border p-3 rounded-xl md:col-span-2"
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
          >
            <option value="">Категория</option>
            {categories.map((c: any) => (
              <option key={c.ID} value={c.ID}>
                {c.nazvanie_kategorii}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Описание"
            className="border p-3 rounded-xl md:col-span-2 h-24 md:h-40"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        {/* UPLOAD */}
        <div className="border-2 border-dashed rounded-2xl p-4 md:p-8 text-center mt-4 md:mt-5">

          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
            }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-200 px-4 py-2 rounded-xl w-full md:w-auto"
          >
            Загрузить фото
          </button>

          <img
            src={
              form.foto
                ? `/images/dishes/${form.foto}`
                : `/images/dishes/default.jpg`
            }
            className="w-32 h-32 object-cover mt-4 mx-auto rounded-xl"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 mt-5 md:mt-6">

          <button
            onClick={saveDish}
            className="bg-orange-500 text-white px-4 py-3 rounded-xl w-full md:w-auto"
          >
            {editingId ? 'Сохранить' : 'Добавить'}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="bg-gray-200 px-4 py-3 rounded-xl w-full md:w-auto"
            >
              Отмена
            </button>
          )}

        </div>
      </div>

      {/* LIST */}
      <div className="grid gap-4 md:gap-5">

        {filteredDishes.map((dish: any) => (
          <div
            key={dish.ID}
            className="
              bg-white rounded-2xl shadow p-3 md:p-5
              flex flex-col md:flex-row gap-4 md:gap-5
            "
          >

            {/* IMAGE */}
            <img
              src={
                dish.Foto
                  ? `/images/dishes/${dish.Foto}`
                  : `/images/dishes/default.jpg`
              }
              className="
                w-full md:w-64 h-40 md:h-64
                object-cover rounded-2xl
              "
            />

            {/* INFO */}
            <div className="flex-1">

              <h3 className="text-xl md:text-3xl font-bold">
                {dish.Name_blyuda}
              </h3>

              <p className="text-gray-600 mt-2 text-sm md:text-base">
                {dish.Opisanie}
              </p>

              <p className="font-bold mt-3 text-lg">
                {dish.Price} ₽
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {dish.nazvanie_kategorii}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="
              flex flex-col gap-2
              w-full md:w-auto
            ">

              <button
                onClick={() => editDish(dish)}
                className="bg-blue-500 text-white rounded-xl w-full px-3 py-2"
              >
                Изменить
              </button>

              <button
                onClick={() => toggleDish(dish.ID)}
                className="bg-yellow-500 text-white rounded-xl w-full px-3 py-2"
              >
                {dish.aktiv ? 'Скрыть' : 'Показать'}
              </button>

              <button
                onClick={async () => {
                  const ok = window.confirm('Удалить блюдо?');
                  if (!ok) return;

                  await fetch(`/api/admin/dishes/${dish.ID}`, {
                    method: 'DELETE',
                  });

                  loadData();
                }}
                className="bg-red-500 text-white rounded-xl w-full px-3 py-2"
              >
                Удалить
              </button>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}