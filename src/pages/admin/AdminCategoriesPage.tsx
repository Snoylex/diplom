import { useEffect, useState } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editName, setEditName] = useState('');

  const loadCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async () => {
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    setName('');
    loadCategories();
  };

  const deleteCategory = async (id: number) => {
    const confirmDelete = window.confirm('Удалить категорию?');
    if (!confirmDelete) return;

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    loadCategories();
  };

  const updateCategory = async () => {
    if (!editingCategory) return;

    await fetch(`/api/admin/categories/${editingCategory.ID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: editName,
      }),
    });

    setEditingCategory(null);
    setEditName('');
    loadCategories();
  };

  return (
    <div className="p-4 md:p-0">

      {/* TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10">
        Категории
      </h1>

      {/* ADD CATEGORY */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 md:mb-10">

        <h2 className="text-xl md:text-2xl font-bold mb-5">
          Добавить категорию
        </h2>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4">

          <input
            className="border p-3 rounded-xl flex-1"
            placeholder="Название категории"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={addCategory}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition w-full md:w-auto"
          >
            Добавить
          </button>

        </div>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-3">

        {categories.map((cat: any) => (
          <div
            key={cat.ID}
            className="
              flex flex-col md:flex-row
              md:items-center md:justify-between
              gap-3
              bg-orange-100
              px-4 py-4
              rounded-xl
            "
          >

            {/* INFO */}
            <div>
              <div className="font-medium text-base md:text-lg">
                {cat.nazvanie_kategorii}
              </div>

              <div className="text-sm text-gray-500">
                Количество позиций: {cat.dishesCount}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

              <button
                onClick={() => {
                  setEditingCategory(cat);
                  setEditName(cat.nazvanie_kategorii);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition w-full md:w-auto"
              >
                Редактировать
              </button>

              <button
                onClick={() => deleteCategory(cat.ID)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition w-full md:w-auto"
              >
                Удалить
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white p-5 md:p-6 rounded-2xl w-full max-w-md">

            <h2 className="text-xl md:text-2xl font-bold mb-5">
              Редактировать категорию
            </h2>

            <input
              className="border p-3 rounded-xl w-full mb-5"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row gap-3 justify-end">

              <button
                onClick={() => setEditingCategory(null)}
                className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition w-full sm:w-auto"
              >
                Отмена
              </button>

              <button
                onClick={updateCategory}
                className="px-5 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition w-full sm:w-auto"
              >
                Сохранить
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}