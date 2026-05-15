import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {

  const [orders, setOrders] = useState<any[]>([]);
  const [lastOrderId, setLastOrderId] =
  useState<number | null>(null);

  const statuses = [
    'Новый',
    'Готовится',
    'Готов',
    'Доставляется',
    'Завершён',
    'Отменён',
  ];

  // =========================
  // ЗАГРУЗКА
  // =========================

  const loadOrders = async (
  checkNew = false
) => {

  const res = await fetch(
    '/api/admin/orders'
  );

  const data = await res.json();

  setOrders(data);

  // если есть заказы
  if (data.length > 0) {

    const newestOrderId = data[0].ID;

    // первый запуск
    if (lastOrderId === null) {

      setLastOrderId(newestOrderId);

      return;
    }

    // новый заказ
    if (
      checkNew &&
      newestOrderId > lastOrderId
    ) {

      setLastOrderId(newestOrderId);

      // уведомление браузера
      if (
        Notification.permission ===
        'granted'
      ) {

        new Notification(
          'Новый заказ 🍔',
          {
            body:
              `Заказ #${newestOrderId}`,
          }
        );

      }

      // звук
      const audio = new Audio(
        '/notification.mp3'
      );

      audio.play();

    }

  }

};

useEffect(() => {

  // запрос разрешения
  Notification.requestPermission();

  // первый запуск
  loadOrders();

  // каждые 5 сек проверка
  const interval = setInterval(() => {

    loadOrders(true);

  }, 5000);

  return () =>
    clearInterval(interval);

}, [lastOrderId]);

  // =========================
  // СТАТУС
  // =========================

  const changeStatus = async (
    id: number,
    status: string
  ) => {

    await fetch(
      `/api/admin/orders/${id}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          status,
        }),
      }
    );

    loadOrders();
  };

  // =========================
  // УДАЛИТЬ
  // =========================

  const deleteOrder = async (
    id: number
  ) => {

    if (!confirm('Удалить заказ?')) {
      return;
    }

    await fetch(
      `/api/admin/orders/${id}`,
      {
        method: 'DELETE',
      }
    );

    loadOrders();
  };

  // =========================
  // ЦВЕТ СТАТУСА
  // =========================

  const getStatusColor = (
    status: string
  ) => {

    switch (status) {

      case 'Новый':
        return 'bg-blue-500';

      case 'Готовится':
        return 'bg-yellow-500';

      case 'Готов':
        return 'bg-green-500';

      case 'Доставляется':
        return 'bg-purple-500';

      case 'Завершён':
        return 'bg-gray-500';

      case 'Отменён':
        return 'bg-red-500';

      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-10">
        Заказы
      </h1>

      <div className="grid gap-6">

        {orders.map((order) => (

          <div
            key={order.ID}
            className="bg-white rounded-2xl shadow p-6"
          >

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">

              <div>

                <h2 className="text-3xl font-bold">
                  Заказ #{order.ID}
                </h2>

                <p className="text-gray-500 mt-2">
                  {new Date(order.Data)
                    .toLocaleString()}
                </p>

              </div>

              <div
                className={`${getStatusColor(order.Status)} text-white px-5 py-3 rounded-xl font-bold`}
              >
                {order.Status}
              </div>

            </div>

            {/* КЛИЕНТ */}

            <div className="grid md:grid-cols-3 gap-4 mb-6">

              <div className="bg-orange-50 p-4 rounded-xl">

                <p className="text-gray-500">
                  Клиент
                </p>

                <p className="font-bold text-lg">
                  {order.FIO || 'Не указано'}
                </p>

              </div>

              <div className="bg-orange-50 p-4 rounded-xl">

                <p className="text-gray-500">
                  Телефон
                </p>

                <p className="font-bold text-lg">
                  {order.Phone}
                </p>

              </div>

              <div className="bg-orange-50 p-4 rounded-xl">

                <p className="text-gray-500">
                  Адрес
                </p>

                <p className="font-bold text-lg">
                  {order.Adres || 'Самовывоз'}
                </p>

              </div>

            </div>

            {/* БЛЮДА */}

            <div className="grid gap-4 mb-6">

              {order.items.map((item: any) => (

                <div
                  key={item.ID}
                  className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl"
                >

                  <img
                    src={`/images/dishes/${item.Foto}`}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  <div className="flex-1">

                    <h3 className="text-xl font-bold">
                      {item.Name_blyuda}
                    </h3>

                    <p className="text-gray-500">
                      Количество:
                      {' '}
                      {item.Kolichestvo}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-bold text-xl">
                      {item.Summa} ₽
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* FOOTER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <p className="text-gray-500">
                  Сумма заказа
                </p>

                <p className="text-3xl font-bold">
                  {order.Summa_zakaza} ₽
                </p>

              </div>

              <div className="flex gap-3 flex-wrap">

                <select
                  value={order.Status}
                  onChange={(e) =>
                    changeStatus(
                      order.ID,
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-xl"
                >

                  {statuses.map((status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>

                  ))}

                </select>

                <button
                  onClick={() =>
                    deleteOrder(order.ID)
                  }
                  className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-3 rounded-xl"
                >
                  Удалить
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}