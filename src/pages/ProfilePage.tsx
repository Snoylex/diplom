import { useEffect, useState } from 'react';

import {
  ArrowLeft,
  User,
  Pencil,
  Save,
} from 'lucide-react';

import { Link } from 'react-router-dom';

export default function ProfilePage() {

  const [user, setUser] =
    useState<any>(null);

  const [editing, setEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [profile, setProfile] =
    useState({
      fio: '',
      phone: '',
      address: '',
    });

  const [orders, setOrders] =
    useState<any[]>([]);

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {

    const savedUser = JSON.parse(
      localStorage.getItem(
        'currentUser'
      ) || '{}'
    );

    setUser(savedUser);

  }, []);

  // =========================
  // LOAD PROFILE + ORDERS
  // =========================

  useEffect(() => {

    if (!user?.id) {

      setLoading(false);

      return;

    }

    const fetchData = async () => {

      try {

        const [profileRes, ordersRes] =
          await Promise.all([

            fetch(
              `/api/profile/${user.id}`
            ),

            fetch(
              `/api/my-orders/${user.id}`
            ),

          ]);

        // PROFILE
        if (profileRes.ok) {

          const data =
            await profileRes.json();

          setProfile({

            fio:
              data.FIO || '',

            phone:
              data.Phone || '',

            address:
              data.Adres || '',

          });

        }

        // ORDERS
        if (ordersRes.ok) {

          const data =
            await ordersRes.json();

          setOrders(data);

        }

      } catch (err) {

        console.error(
          'Ошибка загрузки:',
          err
        );

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, [user?.id]);

  // =========================
  // SAVE PROFILE
  // =========================

  const saveProfile = async () => {

    if (!user?.id) return;

    setSaving(true);

    try {

      const res = await fetch(

        `/api/profile/${user.id}`,

        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            profile
          ),

        }

      );

      if (res.ok) {

        const updatedUser = {
          ...user,
          ...profile,
        };

        localStorage.setItem(
          'currentUser',
          JSON.stringify(
            updatedUser
          )
        );

        setUser(updatedUser);

        setEditing(false);

        alert(
          '✅ Данные обновлены'
        );

      }

    } catch (err) {

      alert(
        'Ошибка сохранения'
      );

    } finally {

      setSaving(false);

    }

  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-50
        "
      >

        <div className="text-center">

          <div
            className="
              w-14
              h-14
              border-4
              border-orange-200
              border-t-orange-500
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-gray-600">
            Загрузка профиля...
          </p>

        </div>

      </div>

    );

  }

  // =========================
  // NOT AUTH
  // =========================

  if (!user?.id) {

    return (

      <div
        className="
          min-h-screen
          bg-gray-50
          flex
          items-center
          justify-center
          px-5
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            p-8
            text-center
            shadow-sm
            w-full
            max-w-sm
          "
        >

          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-orange-100
              flex
              items-center
              justify-center
              mx-auto
            "
          >

            <User
              className="text-orange-500"
              size={30}
            />

          </div>

          <h2
            className="
              text-2xl
              font-bold
              mt-5
            "
          >
            Вы не авторизованы
          </h2>

          <p
            className="
              text-gray-500
              mt-3
              leading-7
            "
          >
            Пожалуйста,
            войдите в аккаунт
          </p>

          <Link
            to="/login"
            className="
              inline-block
              mt-6
              bg-orange-500
              text-white
              px-6
              py-3
              rounded-2xl
              font-medium
            "
          >
            Войти
          </Link>

        </div>

      </div>

    );

  }

  // =========================
  // UI
  // =========================

  return (

    <div
      className="
        min-h-screen
        bg-gray-50
        pb-24
      "
    >

      <div className="px-4 pt-4">

        {/* ================= HEADER ================= */}

        <div
          className="
            sticky
            top-0
            z-20
            bg-gray-50/95
            backdrop-blur-md
            pb-4
          "
        >

          <div
            className="
              bg-white
              rounded-3xl
              shadow-sm
              border
              border-gray-100
              p-4
              flex
              items-center
              gap-4
            "
          >

            {/* BACK */}
            <Link
              to="/"
              className="
                w-11
                h-11
                rounded-2xl
                bg-gray-100
                flex
                items-center
                justify-center
                active:scale-95
                transition
                flex-shrink-0
              "
            >

              <ArrowLeft size={22} />

            </Link>

            {/* TITLE */}
            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                "
              >
                Профиль
              </h1>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >
                Личный кабинет
              </p>

            </div>

          </div>

        </div>

        {/* ================= PROFILE CARD ================= */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-gray-100
            p-5
            mt-4
          "
        >

          {/* TOP */}
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              mb-6
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                "
              >
                Мои данные
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >
                Информация аккаунта
              </p>

            </div>

            {!editing ? (

              <button
                onClick={() =>
                  setEditing(true)
                }
                className="
                  w-11
                  h-11
                  rounded-2xl
                  bg-orange-500
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >

                <Pencil size={18} />

              </button>

            ) : (

              <button
                onClick={saveProfile}
                disabled={saving}
                className="
                  bg-green-600
                  text-white
                  px-5
                  py-3
                  rounded-2xl
                  text-sm
                  font-medium
                  flex
                  items-center
                  gap-2
                "
              >

                <Save size={18} />

                {saving
                  ? 'Сохранение...'
                  : 'Сохранить'}

              </button>

            )}

          </div>

          {/* FIELDS */}
          <div className="space-y-5">

            {/* FIO */}
            <div>

              <p
                className="
                  text-sm
                  text-gray-500
                  mb-2
                "
              >
                ФИО
              </p>

              {editing ? (

                <input
                  className="
                    w-full
                    h-14
                    border
                    border-gray-200
                    rounded-2xl
                    px-4
                    focus:outline-none
                    focus:border-orange-500
                  "
                  value={profile.fio}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      fio:
                        e.target.value,
                    })
                  }
                />

              ) : (

                <div
                  className="
                    bg-gray-100
                    rounded-2xl
                    p-4
                  "
                >

                  {profile.fio ||
                    'Не указано'}

                </div>

              )}

            </div>

            {/* PHONE */}
            <div>

              <p
                className="
                  text-sm
                  text-gray-500
                  mb-2
                "
              >
                Телефон
              </p>

              {editing ? (

                <input
                  className="
                    w-full
                    h-14
                    border
                    border-gray-200
                    rounded-2xl
                    px-4
                    focus:outline-none
                    focus:border-orange-500
                  "
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone:
                        e.target.value,
                    })
                  }
                />

              ) : (

                <div
                  className="
                    bg-gray-100
                    rounded-2xl
                    p-4
                  "
                >

                  {profile.phone ||
                    'Не указано'}

                </div>

              )}

            </div>

            {/* ADDRESS */}
            <div>

              <p
                className="
                  text-sm
                  text-gray-500
                  mb-2
                "
              >
                Адрес
              </p>

              {editing ? (

                <textarea
                  className="
                    w-full
                    min-h-[120px]
                    border
                    border-gray-200
                    rounded-3xl
                    p-4
                    focus:outline-none
                    focus:border-orange-500
                    resize-none
                  "
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address:
                        e.target.value,
                    })
                  }
                />

              ) : (

                <div
                  className="
                    bg-gray-100
                    rounded-3xl
                    p-4
                    leading-7
                  "
                >

                  {profile.address ||
                    'Не указано'}

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ================= ORDERS ================= */}

        <div className="mt-8">

          <div
            className="
              flex
              items-center
              justify-between
              mb-5
            "
          >

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Мои заказы
            </h2>

            <div
              className="
                bg-orange-100
                text-orange-600
                text-sm
                px-3
                py-1
                rounded-full
                font-medium
              "
            >

              {orders.length}

            </div>

          </div>

          {/* EMPTY */}
          {orders.length === 0 ? (

            <div
              className="
                bg-white
                rounded-3xl
                p-10
                text-center
                shadow-sm
              "
            >

              <p className="text-gray-500">
                У вас пока нет заказов
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {orders.map((order) => (

                <div
                  key={order.ID}
                  className="
                    bg-white
                    rounded-3xl
                    shadow-sm
                    border
                    border-gray-100
                    p-5
                  "
                >

                  {/* ORDER TOP */}
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                      mb-5
                    "
                  >

                    <div>

                      <h3
                        className="
                          text-lg
                          font-bold
                        "
                      >
                        Заказ #{order.ID}
                      </h3>

                      <p
                        className="
                          text-sm
                          text-gray-500
                          mt-1
                        "
                      >

                        {new Date(
                          order.Data
                        ).toLocaleString(
                          'ru-RU'
                        )}

                      </p>

                    </div>

                    <div className="text-right">

                      <div
                        className="
                          font-bold
                          text-lg
                        "
                      >

                        {order.Summa_zakaza}
                        ₽

                      </div>

                      <div
                        className="
                          text-orange-500
                          text-sm
                          font-medium
                          mt-1
                        "
                      >

                        {order.Status}

                      </div>

                    </div>

                  </div>

                  {/* ITEMS */}
                  <div className="space-y-4">

                    {order.items?.map(
                      (item: any) => (

                        <div
                          key={item.ID}
                          className="
                            flex
                            gap-3
                            bg-gray-50
                            rounded-2xl
                            p-3
                          "
                        >

                          {/* IMAGE */}
                          <img
                            src={`/images/dishes/${item.Foto}`}
                            alt={
                              item.Name_blyuda
                            }
                            className="
                              w-20
                              h-20
                              rounded-2xl
                              object-cover
                              flex-shrink-0
                            "
                          />

                          {/* INFO */}
                          <div
                            className="
                              flex-1
                              min-w-0
                            "
                          >

                            <h4
                              className="
                                font-medium
                                leading-6
                              "
                            >

                              {
                                item.Name_blyuda
                              }

                            </h4>

                            <p
                              className="
                                text-sm
                                text-gray-500
                                mt-1
                              "
                            >

                              {
                                item.Kolichestvo
                              }
                              ×
                              {' '}
                              {
                                item.Price
                              }
                              ₽

                            </p>

                          </div>

                          {/* SUM */}
                          <div
                            className="
                              font-bold
                              text-sm
                              whitespace-nowrap
                            "
                          >

                            {item.Summa}
                            ₽

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}