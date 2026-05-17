import { useEffect, useState } from 'react';

export default function AdminArchiveOrdersPage() {

  const [orders, setOrders] = useState<any[]>([]);

  const [days, setDays] = useState(7);

  // =========================
  // ЗАГРУЗКА
  // =========================

  const loadOrders = async () => {

    const res = await fetch(
      '/api/admin/ordersarchive'
    );

    const data = await res.json();

    // только архив
    const archiveOrders = data.filter(
      (o: any) =>
        o.Status?.includes('архив')
    );

    setOrders(archiveOrders);
  };

  const loadSettings = async () => {

    const res = await fetch(
      '/api/admin/archive-settings'
    );

    const data = await res.json();

    setDays(data.days);
  };

  useEffect(() => {

    loadOrders();
    loadSettings();

  }, []);

  // =========================
  // СОХРАНИТЬ НАСТРОЙКУ
  // =========================

  const saveDays = async () => {

    await fetch(
      '/api/admin/archive-settings',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          days,
        }),
      }
    );

    alert('Настройка сохранена');

  };

  // =========================
  // УДАЛИТЬ НАВСЕГДА
  // =========================

  const deleteOrder = async (id: number) => {

    if (
      !window.confirm(
        'Удалить заказ навсегда?'
      )
    ) return;

    await fetch(
      `/api/admin/orders/${id}`,
      {
        method: 'DELETE',
      }
    );

    loadOrders();
  };

  return (

    <div className="p-4 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-10 gap-4">

        <div>

          <h1 className="text-3xl md:text-4xl font-bold">
            Архив заказов
          </h1>

          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Архивные и завершённые заказы
          </p>

        </div>

      </div>

      {/* НАСТРОЙКА */}

      <div className="bg-white rounded-2xl md:rounded-3xl shadow p-4 md:p-6 mb-8 md:mb-10">

        <h2 className="text-xl md:text-2xl font-bold mb-5">
          Автоудаление архива
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5">

          <input
            type="number"
            min={1}
            value={days}
            onChange={(e) =>
              setDays(Number(e.target.value))
            }
            className="
              border
              rounded-xl
              p-3
              w-full
              sm:w-40
            "
          />

          <span className="text-base md:text-lg">
            дней
          </span>

          <button
            onClick={saveDays}
            className="
              bg-orange-500
              text-white
              px-6
              py-3
              rounded-xl
              hover:bg-orange-600
              w-full
              sm:w-auto
            "
          >
            Сохранить
          </button>

        </div>

      </div>

      {/* СПИСОК */}

      <div className="grid gap-6">

        {orders.map((order) => (

          <div
            key={order.ID}
            className="
              bg-white
              rounded-2xl
              md:rounded-3xl
              shadow
              p-4
              md:p-6
            "
          >

            {/* TOP */}

            <div className="flex flex-col lg:flex-row lg:justify-between gap-5">

              <div>

                <h2 className="text-xl md:text-2xl font-bold">
                  Заказ #{order.ID}
                </h2>

                <p className="text-gray-500 mt-1 text-sm md:text-base">
                  {new Date(order.Data)
                    .toLocaleString()}
                </p>

              </div>

              <div className="lg:text-right">

                <div
                  className="
                    bg-gray-100
                    px-4
                    py-2
                    rounded-xl
                    inline-block
                    text-sm
                    md:text-base
                  "
                >
                  {order.Status}
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mt-4">
                  {order.Summa_zakaza} ₽
                </h3>

              </div>

            </div>

            {/* USER */}

            <div className="mt-6">

              <h3 className="font-bold text-base md:text-lg">
                Клиент
              </h3>

              <div className="mt-2 space-y-1 text-sm md:text-base break-words">

                <p>
                  {order.FIO || 'Не указано'}
                </p>

                <p>
                  {order.Phone || 'Нет телефона'}
                </p>

                <p>
                  {order.Adres || 'Нет адреса'}
                </p>

              </div>

            </div>

            {/* ITEMS */}

            <div className="mt-8">

              <h3 className="font-bold text-base md:text-lg mb-4">
                Позиции заказа
              </h3>

              <div className="grid gap-4">

                {order.items?.map((item: any) => (

                  <div
                    key={item.ID}
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      gap-4
                      border
                      rounded-2xl
                      p-4
                    "
                  >

                    <img
                      src={`/images/dishes/${item.Foto}`}
                      className="
                        w-full
                        sm:w-24
                        h-48
                        sm:h-24
                        object-cover
                        rounded-2xl
                      "
                    />

                    <div className="flex-1">

                      <h4 className="font-bold text-base md:text-lg">
                        {item.Name_blyuda}
                      </h4>

                      <p className="text-gray-500 mt-1 text-sm md:text-base">
                        {item.Kolichestvo} × {item.Price} ₽
                      </p>

                    </div>

                    <div className="text-xl md:text-2xl font-bold sm:text-right">

                      {item.Summa} ₽

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex justify-stretch md:justify-end mt-8">

              <button
                onClick={() =>
                  deleteOrder(order.ID)
                }
                className="
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  w-full
                  md:w-auto
                "
              >
                Удалить навсегда
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}