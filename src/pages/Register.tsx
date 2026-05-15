import { useState } from 'react';

import {
  ArrowLeft,
  UserPlus,
} from 'lucide-react';

import {
  useNavigate,
  Link,
} from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

export default function Register() {

  const [formData, setFormData] =
    useState({

      login: '',
      pass: '',
      fio: '',
      phone: '',
      address: '',

    });

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError('');

    setLoading(true);

    try {

      const response = await fetch(

        '/api/api/register',

        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            formData
          ),

        }

      );

      const data =
        await response.json();

      if (data.success) {

        alert(
          'Регистрация прошла успешно!'
        );

        navigate('/login');

      } else {

        setError(
          data.error ||
          'Ошибка регистрации'
        );

      }

    } catch (err) {

      setError(
        'Ошибка соединения с сервером'
      );

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // UI
  // =========================

  return (

    <div
      className="
        min-h-screen
        bg-orange-50
        px-4
        py-6
      "
    >

      {/* ================= HEADER ================= */}

      <div
        className="
          max-w-md
          mx-auto
          mb-4
        "
      >

        <Link
          to="/login"
          className="
            w-11
            h-11
            rounded-2xl
            bg-white
            shadow-sm
            flex
            items-center
            justify-center
            active:scale-95
            transition
          "
        >

          <ArrowLeft size={22} />

        </Link>

      </div>

      {/* ================= CARD ================= */}

      <div
        className="
          max-w-md
          mx-auto
          bg-white
          rounded-[32px]
          shadow-sm
          p-6
          sm:p-8
        "
      >

        {/* ICON */}
        <div
          className="
            w-16
            h-16
            rounded-3xl
            bg-orange-100
            flex
            items-center
            justify-center
            mx-auto
          "
        >

          <UserPlus
            className="
              text-orange-500
            "
            size={30}
          />

        </div>

        {/* TITLE */}
        <div className="text-center mt-5">

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Регистрация
          </h1>

          <p
            className="
              text-gray-500
              mt-2
              leading-6
            "
          >
            Создайте новый аккаунт
            для оформления заказов
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleRegister}
          className="mt-8 space-y-5"
        >

          {/* LOGIN */}
          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-2
              "
            >
              Логин
            </label>

            <Input
              type="text"
              value={formData.login}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  login:
                    e.target.value,

                })
              }
              placeholder="Введите логин"
              required
              className="
                h-14
                rounded-2xl
                border-gray-200
                text-base
              "
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-2
              "
            >
              Пароль
            </label>

            <Input
              type="password"
              value={formData.pass}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  pass:
                    e.target.value,

                })
              }
              placeholder="Введите пароль"
              required
              className="
                h-14
                rounded-2xl
                border-gray-200
                text-base
              "
            />

          </div>

          {/* FIO */}
          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-2
              "
            >
              ФИО
            </label>

            <Input
              type="text"
              value={formData.fio}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  fio:
                    e.target.value,

                })
              }
              placeholder="Иванов Иван"
              required
              className="
                h-14
                rounded-2xl
                border-gray-200
                text-base
              "
            />

          </div>

          {/* PHONE */}
          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-2
              "
            >
              Телефон
            </label>

            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  phone:
                    e.target.value,

                })
              }
              placeholder="+7 (999) 123-45-67"
              required
              className="
                h-14
                rounded-2xl
                border-gray-200
                text-base
              "
            />

          </div>

          {/* ADDRESS */}
          <div>

            <label
              className="
                block
                text-sm
                font-medium
                mb-2
              "
            >
              Адрес
            </label>

            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  address:
                    e.target.value,

                })
              }
              placeholder="Введите адрес"
              className="
                w-full
                min-h-[110px]
                border
                border-gray-200
                rounded-3xl
                p-4
                text-base
                resize-none
                focus:outline-none
                focus:border-orange-500
              "
            />

          </div>

          {/* ERROR */}
          {error && (

            <div
              className="
                bg-red-50
                border
                border-red-200
                text-red-600
                text-sm
                rounded-2xl
                p-4
              "
            >

              {error}

            </div>

          )}

          {/* BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-14
              rounded-2xl
              text-base
              font-semibold
              bg-orange-500
              hover:bg-orange-600
            "
          >

            {loading

              ? 'Регистрация...'

              : 'Зарегистрироваться'}

          </Button>

        </form>

        {/* LOGIN */}
        <div
          className="
            text-center
            mt-7
            text-sm
            text-gray-500
          "
        >

          Уже есть аккаунт?
          {' '}

          <Link
            to="/login"
            className="
              text-orange-600
              font-medium
            "
          >
            Войти
          </Link>

        </div>

      </div>

    </div>

  );

}