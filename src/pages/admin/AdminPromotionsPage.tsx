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

    const promoRes = await fetch(
      'http://localhost:5000/api/admin/promotions'
    );

    const promoData = await promoRes.json();

    const dishRes = await fetch(
      'http://localhost:5000/api/admin/dishes'
    );

    const dishData = await dishRes.json();

    const catRes = await fetch(
      'http://localhost:5000/api/categories'
    );

    const catData = await catRes.json();

    setPromotions(promoData);
    setDishes(dishData);
    setCategories(catData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createPromotion = async () => {

    await fetch(
      'http://localhost:5000/api/admin/promotions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
		name: form.name,
		id_tovara:
			form.type === 'dish'
			? form.id_tovara
			: null,

		id_kategorii:
			form.type === 'category'
			? form.id_kategorii
			: null,

		procent_skidki: form.procent_skidki,
		aktiv: form.aktiv,
		}),
      }
    );

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

  await fetch(
    `http://localhost:5000/api/admin/promotions/toggle/${id}`,
    {
      method: 'PATCH',
    }
  );

  loadData();
};

  const deletePromotion = async (id: number) => {

    await fetch(
      `http://localhost:5000/api/admin/promotions/${id}`,
      {
        method: 'DELETE',
      }
    );

    loadData();
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-10">
        Акции
      </h1>

      {/* ФОРМА */}

      <div className="bg-white rounded-2xl shadow p-6 mb-10">

        <h2 className="text-2xl font-bold mb-5">
          Создать акцию
        </h2>

        <div className="grid grid-cols-3 gap-4">
		
		<input
  placeholder="Название акции"
  className="border p-3 rounded-xl"
  value={form.name}
  onChange={(e) =>
    setForm({
      ...form,
      name: e.target.value,
    })
  }
/>

<div className="flex gap-3">

  <button
    onClick={() =>
      setForm({
        ...form,
        type: 'dish',
        id_kategorii: '',
      })
    }
    className={`px-5 py-3 rounded-xl ${
      form.type === 'dish'
        ? 'bg-orange-500 text-white'
        : 'bg-gray-200'
    }`}
  >
    Скидка на блюдо
  </button>

  <button
    onClick={() =>
      setForm({
        ...form,
        type: 'category',
        id_tovara: '',
      })
    }
    className={`px-5 py-3 rounded-xl ${
      form.type === 'category'
        ? 'bg-orange-500 text-white'
        : 'bg-gray-200'
    }`}
  >
    Скидка на категорию
  </button>

</div>

          {/* БЛЮДО */}

          {form.type === 'dish' && (
  <select
    className="border p-3 rounded-xl"
    value={form.id_tovara}
    onChange={(e) =>
      setForm({
        ...form,
        id_tovara: e.target.value,
        id_kategorii: '',
      })
    }
  >
    <option value="">
      Выберите блюдо
    </option>

    {dishes.map((dish: any) => (
      <option key={dish.ID} value={dish.ID}>
        {dish.Name_blyuda}
      </option>
    ))}
  </select>
)}

          {/* КАТЕГОРИЯ */}

          {form.type === 'category' && (
  <select
    className="border p-3 rounded-xl"
    value={form.id_kategorii}
    onChange={(e) =>
      setForm({
        ...form,
        id_kategorii: e.target.value,
        id_tovara: '',
      })
    }
  >
    <option value="">
      Выберите категорию
    </option>

    {categories.map((cat: any) => (
      <option key={cat.ID} value={cat.ID}>
        {cat.nazvanie_kategorii}
      </option>
    ))}
  </select>
)}

          {/* СКИДКА */}

          <input
            type="number"
            placeholder="Скидка %"
            className="border p-3 rounded-xl"
            value={form.procent_skidki}
            onChange={(e) =>
              setForm({
                ...form,
                procent_skidki: e.target.value,
              })
            }
          />

        </div>

        <button
          onClick={createPromotion}
          className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl"
        >
          Создать акцию
        </button>

      </div>

      {/* СПИСОК */}

      <div className="grid gap-5">

        {promotions.map((promo: any) => (

          <div
            key={promo.ID}
            className="bg-white rounded-2xl shadow p-5 flex items-center justify-between"
          >

            <div>

			<h3 className="text-2xl font-bold">
			{promo.name}
			</h3>

			<p className="text-gray-500 mt-1">
			{promo.Name_blyuda
				? `Блюдо: ${promo.Name_blyuda}`
				: `Категория: ${promo.nazvanie_kategorii}`
			}
			</p>

              <p className="text-gray-500 mt-2">
                Скидка:
                <span className="text-red-500 font-bold ml-2">
                  {promo.procent_skidki}%
                </span>
              </p>

            </div>
			
			<button
			onClick={() => togglePromotion(promo.ID)}
			className={`px-5 py-3 rounded-xl text-white ${
				promo.aktiv
				? 'bg-yellow-500'
				: 'bg-green-500'
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

        ))}

      </div>

    </div>
  );
}