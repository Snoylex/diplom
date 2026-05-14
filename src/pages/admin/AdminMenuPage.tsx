import { useEffect, useState } from 'react';
import { useRef } from 'react';

export default function AdminMenuPage() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    foto: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    const dishesRes = await fetch('http://cu943745.tw1.ru/api/admin/dishes');
    const dishesData = await dishesRes.json();

    const catRes = await fetch('http://cu943745.tw1.ru/api/categories');
    const catData = await catRes.json();
	
	const imagesRes = await fetch('http://cu943745.tw1.ru/api/admin/images');
	const imagesData = await imagesRes.json();

    setDishes(dishesData);
    setCategories(catData);
	setImages(imagesData);
  };

  useEffect(() => {
    loadData();
  }, []);
  
  
  const loadImages = async () => {
  const res = await fetch('http://cu943745.tw1.ru/api/admin/images');

  const data = await res.json();

  setImages(data);
};

const uploadImage = async (file: File) => {
  const formData = new FormData();

  formData.append('image', file);

  const res = await fetch('http://cu943745.tw1.ru/api/admin/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  setForm({
    ...form,
    foto: data.filename,
  });

  loadImages();
};

const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];

  if (!file) return;

  await uploadImage(file);
};

const handleFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  await uploadImage(file);
};

const deleteImage = async (name: string) => {
  const confirmDelete = window.confirm(
    'Удалить изображение?'
  );

  if (!confirmDelete) return;

  await fetch(
    `http://cu943745.tw1.ru/api/admin/images/${name}`,
    {
      method: 'DELETE',
    }
  );

  if (form.foto === name) {
    setForm({
      ...form,
      foto: '',
    });
  }

  loadImages();
};

  const addDish = async () => {
    await fetch('http://cu943745.tw1.ru/api/admin/dishes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    // Сброс формы
    setForm({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      foto: '',
    });

    loadData();
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    await fetch('http://cu943745.tw1.ru/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newCategory }),
    });

    setNewCategory('');
    loadData();
  };


  
  const deleteDish = async (id: number) => {
  const confirmDelete = window.confirm(
    'Удалить позицию?'
  );

  if (!confirmDelete) return;

  const res = await fetch(
    `http://cu943745.tw1.ru/api/admin/dishes/${id}`,
    {
      method: 'DELETE',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  loadData();
};

  const toggleDish = async (id: number) => {
    await fetch(`http://cu943745.tw1.ru/api/admin/dishes/toggle/${id}`, {
      method: 'PATCH',
    });
    loadData();
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-10">Управление меню</h1>

      {/* Форма добавления блюда */}
      <div className="bg-white rounded-2xl p-6 shadow mb-10">
        <h2 className="text-2xl font-bold mb-6">Добавить блюдо</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Название"
            className="border p-3 rounded-xl"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Цена"
            type="number"
            className="border p-3 rounded-xl"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <textarea
            placeholder="Описание"
            className="border p-3 rounded-xl col-span-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />


          <select
            className="border p-3 rounded-xl col-span-2"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Выберите категорию</option>
            {categories.map((cat: any) => (
              <option key={cat.ID} value={cat.ID}>
                {cat.nazvanie_kategorii}
              </option>
            ))}
          </select>
        </div>

<div
  onDrop={handleDrop}
  onDragOver={(e) => e.preventDefault()}
  className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mt-6"
>
  <p className="text-lg mb-4">
    Перетащите фото сюда
  </p>

  <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="bg-gray-200 px-5 py-2 rounded-xl"
  >
    Выбрать файл
  </button>

  <input
    type="file"
    hidden
    ref={fileInputRef}
    onChange={handleFileChange}
  />

  {form.foto && (
    <div className="mt-5">
      <img
        src={`/images/dishes/${form.foto}`}
        className="w-40 h-40 object-cover rounded-xl mx-auto"
      />

      <p className="mt-2 text-sm">
        {form.foto}
      </p>
    </div>
  )}
</div>



        <button
          onClick={addDish}
          className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition"
        >
          Добавить блюдо
        </button>
      </div>

   

      {/* Список блюд */}
      <div className="grid gap-5">
        {dishes.map((dish: any) => (
          <div
            key={dish.ID}
            className="bg-white rounded-2xl shadow p-5 flex gap-5 items-center"
          >
            <img
              src={`/images/dishes/${dish.Foto}`}
              alt={dish.Name_blyuda}
              className="w-28 h-28 object-cover rounded-xl"
            />

            <div className="flex-1">
              <h3 className="text-2xl font-bold">{dish.Name_blyuda}</h3>
              <p className="text-gray-600 mt-1">{dish.Opisanie}</p>
              <p className="mt-2">Категория: {dish.nazvanie_kategorii}</p>
              <p className="font-bold mt-2 text-lg">{dish.Price} ₽</p>
            </div>

            <div className="flex flex-col gap-3">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition">
                Редактировать
              </button>

              <button
                onClick={() => toggleDish(dish.ID)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition"
              >
                {dish.aktiv ? 'Скрыть' : 'Показать'}
              </button>

              <button
                onClick={() => deleteDish(dish.ID)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
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