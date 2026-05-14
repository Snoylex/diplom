import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // =========================
  // CAPTCHA
  // =========================

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  const [captcha, setCaptcha] = useState('');

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);

    setNum1(a);
    setNum2(b);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const navigate = useNavigate();

  const { login: loginUser } = useAuth();

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');

    // CAPTCHA CHECK

    if (Number(captcha) !== num1 + num2) {
      setError('Неверная капча');

      generateCaptcha();

      setCaptcha('');

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://cu943745.tw1.ru/api/login',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            login,
            pass,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        loginUser(data.user);

        localStorage.setItem(
          'currentUser',
          JSON.stringify(data.user)
        );

        alert(
          `Добро пожаловать, ${
            data.user.fio ||
            'Пользователь'
          }!`
        );

        navigate('/');

      } else {
        setError(
          data.error ||
            'Неверный логин или пароль'
        );

        generateCaptcha();
      }

    } catch (err) {

      setError(
        'Ошибка соединения с сервером'
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-orange-50
        flex
        items-center
        justify-center
        px-4
        py-6
      "
    >
      
      {/* BACK BUTTON */}
      <Link
        to="/"
        className="
          absolute
          top-4
          left-4
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

      {/* CARD */}
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-3xl
          shadow-sm
          border
          border-gray-100
          p-6
        "
      >
        
        {/* ICON */}
        <div className="flex justify-center mb-5">
          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-orange-100
              flex
              items-center
              justify-center
            "
          >
            <ShieldCheck
              size={32}
              className="text-orange-500"
            />
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Вход
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Войдите в свой аккаунт
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          
          {/* LOGIN */}
          <div>
            <label
              className="
                text-sm
                text-gray-500
              "
            >
              Логин
            </label>

            <Input
              type="text"
              value={login}
              onChange={(e) =>
                setLogin(e.target.value)
              }
              placeholder="Введите логин"
              required
              className="
                mt-2
                h-14
                rounded-2xl
                border-gray-200
                focus:border-orange-400
                focus:ring-orange-100
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              className="
                text-sm
                text-gray-500
              "
            >
              Пароль
            </label>

            <Input
              type="password"
              value={pass}
              onChange={(e) =>
                setPass(e.target.value)
              }
              placeholder="Введите пароль"
              required
              className="
                mt-2
                h-14
                rounded-2xl
                border-gray-200
                focus:border-orange-400
                focus:ring-orange-100
              "
            />
          </div>

          {/* CAPTCHA */}
          <div>
            <label
              className="
                text-sm
                text-gray-500
              "
            >
              Подтвердите, что вы не робот
            </label>

            <div className="flex gap-3 mt-2">
              
              {/* EXAMPLE */}
              <div
                className="
                  min-w-[110px]
                  h-14
                  rounded-2xl
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-lg
                "
              >
                {num1} + {num2}
              </div>

              {/* INPUT */}
              <Input
                type="number"
                value={captcha}
                onChange={(e) =>
                  setCaptcha(
                    e.target.value
                  )
                }
                placeholder="Ответ"
                required
                className="
                  h-14
                  rounded-2xl
                  border-gray-200
                "
              />

              {/* REFRESH */}
              <button
                type="button"
                onClick={generateCaptcha}
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  active:scale-95
                  transition
                "
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="
                bg-red-50
                border
                border-red-100
                text-red-600
                text-sm
                rounded-2xl
                px-4
                py-3
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
              active:scale-[0.98]
              transition
            "
          >
            {loading
              ? 'Вход...'
              : 'Войти'}
          </Button>
        </form>

        {/* LINKS */}
        <div className="mt-7 space-y-3 text-center">
          
          <p className="text-sm text-gray-600">
            Нет аккаунта?{' '}

            <Link
              to="/register"
              className="
                text-orange-600
                font-medium
              "
            >
              Регистрация
            </Link>
          </p>

          <p className="text-sm text-gray-600">
            Забыли пароль?{' '}

            <Link
              to="/forgot-password"
              className="
                text-orange-600
                font-medium
              "
            >
              Восстановить
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}