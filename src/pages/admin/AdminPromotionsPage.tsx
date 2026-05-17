import { useEffect, useState } from 'react';

export default function AdminPromotionsPage() {

  const [promotions, setPromotions] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: '',
    type: 'dish',
    id_tovara: '',
    id_kategorii: '',
    procent_skidki: '',
    aktiv: true,
  });

  const loadData = async () => {

    const promoRes = await fetch('/api/admin/promotions');
    const promoData = await promoRes.json();

    const dishRes = await fetch('/api/admin/dishes');
    const dishData = await dishRes.json();

    const catRes = await fetch('/api/categories');
    const catData = await catRes.json();

    setPromotions(promoData);
    setDishes(dishData);
    setCategories(catData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createPromotion = async () => {

    if (!form.name.trim()) return alert('Введите название акции');

    if (form.type === 'dish' && !form.id_tovara)
      return alert('Выберите блюдо');

    if (form.type === 'category' && !form.id_kategorii)
      return alert('Выберите категорию');

    if (!form.procent_skidki || Number(form.procent_skidki) <= 0)
      return alert('Введите корректную скидку');

    await fetch('/api/admin/promotions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        id_tovara: form.type === 'dish' ? form.id_tovara : null,
        id_kategorii: form.type === 'category' ? form.id_kategorii : null,
        procent_skidki: form.procent_skidki,
        aktiv: form.aktiv,
      }),
    });

    setForm({
      name: '',
      type: 'dish',
      id_tovara: '',
      id_kategorii: '',
      procent_skidki: '',
      aktiv: true,
    });

    loadData();
  };

  const togglePromotion = async (id: number) => {

    await fetch(`/api/admin/promotions/toggle/${id}`, {
      method: 'PATCH',
    });

    loadData();
  };

  const deletePromotion = async (id: number) => {

    const confirmDelete = window.confirm(
      'Ты точно хочешь удалить эту акцию? Это действие нельзя отменить.'
    );

    if (!confirmDelete) return;

    await fetch(`/api/admin/promotions/${id}`, {
      method: 'DELETE',
    });

    loadData();
  };

  const isFormInvalid =
    !form.name.trim() ||
    !form.procent_skidki ||
    (form.type === 'dish' && !form.id_tovara) ||
    (form.type === 'category' && !form.id_kategorii);

  return (
    <div className="p-4 md:p-8">

      <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10">
        Акции
      </h1>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow p-4 md:p-6 mb-8 md:mb-10">

        <h2 className="text-xl md:text-2xl font-bold mb-5">
          Создать акцию
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            placeholder="Название акции"
            className="border p-3 rounded-xl"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <div className="flex flex-col sm:flex-row gap-3">

            <button
              onClick={() =>
                setForm({
                  ...form,
                  type: 'dish',
                  id_kategorii: '',
                })
              }
              className={`px-4 py-3 rounded-xl ${
                form.type === 'dish'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Блюдо
            </button>

            <button
              onClick={() =>
                setForm({
                  ...form,
                  type: 'category',
                  id_tovara: '',
                })
              }
              className={`px-4 py-3 rounded-xl ${
                form.type === 'category'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Категория
            </button>

          </div>

          {form.type === 'dish' && (
            <select
              className="border p-3 rounded-xl"
              value={form.id_tovara}
              onChange={(e) =>
                setForm({ ...form, id_tovara: e.target.value })
              }
            >
              <option value="">Выберите блюдо</option>
              {dishes.map((dish: any) => (
                <option key={dish.ID} value={dish.ID}>
                  {dish.Name_blyuda}
                </option>
              ))}
            </select>
          )}

          {form.type === 'category' && (
            <select
              className="border p-3 rounded-xl"
              value={form.id_kategorii}
              onChange={(e) =>
                setForm({ ...form, id_kategorii: e.target.value })
              }
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat: any) => (
                <option key={cat.ID} value={cat.ID}>
                  {cat.nazvanie_kategorii}
                </option>
              ))}
            </select>
          )}

          <input
            type="number"
            placeholder="Скидка %"
            className="border p-3 rounded-xl"
            value={form.procent_skidki}
            onChange={(e) =>
              setForm({ ...form, procent_skidki: e.target.value })
            }
          />

        </div>

        <button
          onClick={createPromotion}
          disabled={isFormInvalid}
          className={`mt-6 px-6 py-3 rounded-xl w-full md:w-auto transition ${
            isFormInvalid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-500 text-white'
          }`}
        >
          Создать акцию
        </button>

      </div>

      {/* LIST */}
      <div className="grid gap-5">

        {promotions.map((promo: any) => (

          <div
            key={promo.ID}
            className="bg-white rounded-2xl shadow p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >

            <div className="flex-1">

              <h3 className="text-xl md:text-2xl font-bold">
                {promo.name}
              </h3>

              <p className="text-gray-500 mt-1">
                {promo.Name_blyuda
                  ? `Блюдо: ${promo.Name_blyuda}`
                  : `Категория: ${promo.nazvanie_kategorii}`}
              </p>

              <p className="text-gray-500 mt-2">
                Скидка:
                <span className="text-red-500 font-bold ml-2">
                  {promo.procent_skidki}%
                </span>
              </p>

            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                onClick={() => togglePromotion(promo.ID)}
                className={`px-5 py-3 rounded-xl text-white ${
                  promo.aktiv ? 'bg-yellow-500' : 'bg-green-500'
                }`}
              >
                {promo.aktiv ? 'Выключить' : 'Включить'}
              </button>

              <button
                onClick={() => deletePromotion(promo.ID)}
                className="bg-red-500 text-white px-5 py-3 rounded-xl"
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