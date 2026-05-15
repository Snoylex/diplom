import { useState } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const sendCode = async () => {
    const res = await fetch(
      '/api/api/password/send-code',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      }
    );

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert('Код отправлен');
    setStep(2);
  };

  const resetPassword = async () => {
    const res = await fetch(
      '/api/api/password/reset',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          code,
          newPassword,
        }),
      }
    );

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert('Пароль изменён');

    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link
            to="/login"
            className="
              p-2
              rounded-xl
              active:scale-95
              transition
              hover:bg-gray-100
            "
          >
            <ArrowLeft size={24} />
          </Link>

          <h1 className="text-xl font-bold">
            Восстановление
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 pt-8 pb-6">
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-gray-100
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
            <h2 className="text-2xl font-bold">
              {step === 1
                ? 'Сброс пароля'
                : 'Введите код'}
            </h2>

            <p className="text-gray-500 text-sm mt-2 leading-6">
              {step === 1
                ? 'Мы отправим код подтверждения на ваш номер телефона'
                : 'Введите код из SMS и придумайте новый пароль'}
            </p>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              
              <div>
                <label className="text-sm text-gray-500">
                  Номер телефона
                </label>

                <input
                  placeholder="+7 (999) 999-99-99"
                  className="
                    mt-2
                    border
                    border-gray-200
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                    outline-none
                    p-4
                    rounded-2xl
                    w-full
                    text-base
                    transition
                  "
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </div>

              <button
                onClick={sendCode}
                className="
                  w-full
                  bg-orange-500
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  text-base
                  active:scale-[0.98]
                  transition
                "
              >
                Отправить код
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              
              <div>
                <label className="text-sm text-gray-500">
                  Код подтверждения
                </label>

                <input
                  placeholder="Введите код"
                  className="
                    mt-2
                    border
                    border-gray-200
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                    outline-none
                    p-4
                    rounded-2xl
                    w-full
                    text-base
                    transition
                  "
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Новый пароль
                </label>

                <input
                  type="password"
                  placeholder="Новый пароль"
                  className="
                    mt-2
                    border
                    border-gray-200
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                    outline-none
                    p-4
                    rounded-2xl
                    w-full
                    text-base
                    transition
                  "
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                />
              </div>

              <button
                onClick={resetPassword}
                className="
                  w-full
                  bg-green-600
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  text-base
                  active:scale-[0.98]
                  transition
                "
              >
                Сменить пароль
              </button>
            </div>
          )}

          {/* STEP INDICATOR */}
          <div className="flex justify-center gap-2 mt-8">
            <div
              className={`
                h-2 rounded-full transition-all
                ${
                  step === 1
                    ? 'w-8 bg-orange-500'
                    : 'w-2 bg-gray-300'
                }
              `}
            />

            <div
              className={`
                h-2 rounded-full transition-all
                ${
                  step === 2
                    ? 'w-8 bg-orange-500'
                    : 'w-2 bg-gray-300'
                }
              `}
            />
          </div>
        </div>
      </div>
    </div>
  );
}