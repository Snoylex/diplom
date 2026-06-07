import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import interior from '@/assets/images/interior.jpg';
import interior1 from '@/assets/images/interior1.jpg';
import interior2 from '@/assets/images/interior2.jpg';
import interior3 from '@/assets/images/interior3.jpg';
import interior4 from '@/assets/images/interior4.jpg';
import interior5 from '@/assets/images/interior5.jpg';
import interior6 from '@/assets/images/interior6.jpg';
import interior7 from '@/assets/images/interior7.jpg';
import interior8 from '@/assets/images/interior8.jpg';

import aboutImg from '@/assets/images/about.jpg';
import iconImg from '@/assets/images/icon.jpg';

const interiorImages = [
  interior,
  interior1,
  interior2,
  interior3,
  interior4,
  interior5,
  interior6,
  interior7,
  interior8,
];

const pdfPath = '/documents/consent.pdf';

function Home() {

  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const { user } = useAuth();
  const [touchStart, setTouchStart] =
	useState(0);

  const [touchEnd, setTouchEnd] =
	useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentImageIndex((prev) =>
        (prev + 1) % interiorImages.length
      );

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const openPDF = () => {
    window.open(pdfPath, '_blank');
  };
  
  const handleSwipe = () => {

  if (touchStart - touchEnd > 50) {

    // свайп влево
    setCurrentImageIndex((prev) =>
      (prev + 1) % interiorImages.length
    );

  }

  if (touchEnd - touchStart > 50) {

    // свайп вправо
    setCurrentImageIndex((prev) =>
      prev === 0
        ? interiorImages.length - 1
        : prev - 1
    );

  }

};

  return (

    <div className="min-h-screen bg-orange-50 overflow-x-hidden">

      {/* ================= HEADER ================= */}

      <header className="
        fixed
        top-0
        left-0
        right-0
        bg-white/95
        backdrop-blur
        shadow-md
        z-50
      ">

        <div className="
          w-full
		  px-4
		  sm:px-6
		  py-3
		  flex
		  items-center
		  justify-between
        ">

          {/* LOGO */}

          <div className="
            flex
            items-center
            gap-3
            min-w-0
			flex-1
          ">

            <div className="
              w-11
              h-11
              sm:w-12
              sm:h-12
              rounded-full
              overflow-hidden
              border-2
              border-orange-600
              shrink-0
            ">

              <img
                src={iconImg}
                alt="Логотип"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            </div>

            <div className="min-w-0">

              <h1 className="
                text-lg
                sm:text-2xl
                font-bold
                text-gray-900
                truncate
              ">
                Кафе "Бурекас"
              </h1>

              <p className="
                text-xs
                sm:text-sm
                text-gray-500
              ">
                Домашняя кухня
              </p>

            </div>

          </div>

          {/* MENU BUTTON */}

          <button
            onClick={() => setIsMenuOpen(true)}
            className="
			  
              flex
              items-center
              gap-2

              bg-orange-500
              hover:bg-orange-600

              text-white

              px-4
              sm:px-5

              py-2.5

              rounded-2xl

              transition

              text-sm
              sm:text-base

              shrink-0
            "
          >

            <Menu size={20} />

            <span className="hidden sm:block">
              Меню
            </span>

          </button>

        </div>

      </header>

      {/* ================= SIDEBAR ================= */}

      <div
        className={`
          fixed
          top-0
          right-0
          h-full

          w-[85%]
          sm:w-80

          bg-white

          shadow-2xl

          z-50

          transition-transform
          duration-300

          ${isMenuOpen
            ? 'translate-x-0'
            : 'translate-x-full'}
        `}
      >

        <div className="
          p-5
          sm:p-6
        ">

          {/* TOP */}

          <div className="
            flex
            items-center
            justify-between
            mb-8
          ">

            <h2 className="
              text-2xl
              font-bold
            ">
              Навигация
            </h2>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="
                p-2
                rounded-xl
                hover:bg-gray-100
              "
            >
              <X size={28} />
            </button>

          </div>

          {/* LINKS */}

          <div className="
            flex
            flex-col
            gap-2
          ">

            <Link
              to="/reviews"
              onClick={() => setIsMenuOpen(false)}
              className="
                py-3
                px-4
                rounded-2xl
                hover:bg-orange-100
                transition
                font-medium
              "
            >
              Отзывы
            </Link>

            <Link
              to="/menu"
              onClick={() => setIsMenuOpen(false)}
              className="
                py-3
                px-4
                rounded-2xl
                hover:bg-orange-100
                transition
                font-medium
              "
            >
              Меню
            </Link>

            <Link
              to="/discounts"
              onClick={() => setIsMenuOpen(false)}
              className="
                py-3
                px-4
                rounded-2xl
                hover:bg-orange-100
                transition
                font-medium
              "
            >
              Акции
            </Link>

            <Link
              to="/events"
              onClick={() => setIsMenuOpen(false)}
              className="
                py-3
                px-4
                rounded-2xl
                hover:bg-orange-100
                transition
                font-medium
              "
            >
              Мероприятия
            </Link>

            <Link
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="
                py-3
                px-4
                rounded-2xl
                hover:bg-orange-100
                transition
                font-medium
              "
            >
              Профиль
            </Link>

            {user?.isAdmin && (

              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="
                  py-3
                  px-4
                  rounded-2xl
                  hover:bg-orange-100
                  transition
                  font-medium
                "
              >
                Админ панель
              </Link>

            )}

            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="
                py-3
                px-4
                rounded-2xl
                hover:bg-orange-100
                transition
                font-medium
              "
            >
              Войти
            </Link>

          </div>

        </div>

      </div>

      {/* OVERLAY */}

      {isMenuOpen && (

        <div
          className="
            fixed
            inset-0
            bg-black/50
            z-40
          "
          onClick={() => setIsMenuOpen(false)}
        />

      )}

      {/* ================= HERO ================= */}

      <section
  className="
    relative
    h-screen
    pt-20
  "

  onTouchStart={(e) =>
    setTouchStart(
      e.targetTouches[0].clientX
    )
  }

  onTouchMove={(e) =>
    setTouchEnd(
      e.targetTouches[0].clientX
    )
  }

  onTouchEnd={handleSwipe}
>

        {/* IMAGES */}

        <div className="absolute inset-0">

          {interiorImages.map((img, index) => (

            <img
              key={index}
              src={img}
              alt={`Интерьер ${index + 1}`}
              className={`
                absolute
                inset-0

                w-full
                h-full

                object-cover

                transition-opacity
                duration-1000

                ${index === currentImageIndex
                  ? 'opacity-100'
                  : 'opacity-0'}
              `}
            />

          ))}

        </div>

        {/* OVERLAY */}

        <div className="
          absolute
          inset-0
          bg-black/50
        " />

        {/* CONTENT */}

        <div className="
          relative
          h-full

          flex
          items-center
          justify-center

          text-center

          px-4
          sm:px-6
        ">

          <div className="
            max-w-4xl
          ">

            <h2 className="
              text-4xl
              sm:text-5xl
              lg:text-7xl

              font-bold
              text-white

              leading-tight

              mb-6
            ">

              Добро пожаловать
              <br />
              в Кафе "Бурекас"

            </h2>

            <p className="
              text-base
              sm:text-xl
              text-white/90

              leading-relaxed

              max-w-2xl
              mx-auto
            ">

              Свежие продукты •
              Домашняя кухня •
              Тёплая атмосфера

            </p>

          </div>

        </div>

        {/* DOTS */}

        <div className="
          absolute
          bottom-6
          left-1/2
          -translate-x-1/2

          flex
          gap-3
        ">

          {interiorImages.map((_, index) => (

            <button
              key={index}
              onClick={() =>
                setCurrentImageIndex(index)
              }
              className={`
                rounded-full
                transition-all

                ${index === currentImageIndex
                  ? `
                    w-6
                    h-3
                    bg-white
                  `
                  : `
                    w-3
                    h-3
                    bg-white/50
                  `}
              `}
            />

          ))}

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section className="
        py-14
        md:py-24
        bg-white
      ">

        <div className="
          max-w-6xl
          mx-auto

          px-4
          sm:px-6

          grid
          lg:grid-cols-2

          gap-10
          lg:gap-16

          items-center
        ">

          {/* TEXT */}

          <div>

            <h2 className="
              text-3xl
              sm:text-5xl
              font-bold
              text-gray-900
              mb-6
            ">

              О нас

            </h2>

            <p className="
              text-base
              sm:text-lg

              text-gray-700

              leading-relaxed
            ">

              Кафе "Бурекас" —
              это место, где царит
              тёплая домашняя атмосфера.

              Мы используем только
              свежие продукты и готовим
              с любовью.

            </p>

            <p className="
              text-base
              sm:text-lg

              text-gray-700

              leading-relaxed

              mt-6
            ">

              Работаем каждый день
              с 10:00 до 23:00.
              Ждём именно вас!

            </p>

          </div>

          {/* IMAGE */}

          <div className="
            rounded-3xl
            overflow-hidden
            shadow-2xl
          ">

            <img
              src={aboutImg}
              alt="О нас"
              className="
                w-full
                h-[280px]
                sm:h-[400px]
                object-cover
              "
            />

          </div>

        </div>

      </section>
	  
	  
	  {/* ================= CONTACTS ================= */}

<section className="
  py-14
  md:py-20
  bg-orange-100
">

  <div className="
    max-w-6xl
    mx-auto

    px-4
    sm:px-6
  ">

    <div className="
      bg-white
      rounded-3xl
      shadow-xl

      p-6
      md:p-10
    ">

      <h2 className="
        text-3xl
        md:text-5xl
        font-bold

        text-center

        mb-10
      ">
        Контактные данные
      </h2>

      <div className="
        grid
        md:grid-cols-3
        gap-8
      ">

        {/* АДРЕС */}

        <div className="
          bg-orange-50
          rounded-2xl
          p-6
        ">

          <h3 className="
            text-2xl
            font-bold
            mb-3
          ">
            Адрес
          </h3>

          <p className="
            text-gray-700
            leading-relaxed
          ">
            г. Биробиджан
            <br />
            ул. Пионерская 78а
          </p>

        </div>

        {/* ТЕЛЕФОН */}

        <div className="
          bg-orange-50
          rounded-2xl
          p-6
        ">

          <h3 className="
            text-2xl
            font-bold
            mb-3
          ">
            Телефон
          </h3>

          <p className="
            text-gray-700
            leading-relaxed
          ">
            +7 (900) 419-13-50
          </p>

        </div>
		
		{/* СОЦСЕТИ */}

<div className="
  bg-orange-50
  rounded-2xl
  p-6
">

  <h3 className="
    text-2xl
    font-bold
    mb-3
  ">
    Соцсети
  </h3>

  <div className="
    flex
    flex-col
    gap-3
  ">

    <a
      href="https://t.me/burekas_cafe"
      target="_blank"
      className="
        text-blue-600
        hover:underline
      "
    >
      Telegram
    </a>

    <a
      href="https://vk.com/kafeburekas"
      target="_blank"
      className="
        text-blue-600
        hover:underline
      "
    >
      VK
    </a>

    

  </div>

</div>

        {/* ВРЕМЯ */}

        <div className="
          bg-orange-50
          rounded-2xl
          p-6
        ">

          <h3 className="
            text-2xl
            font-bold
            mb-3
          ">
            Режим работы
          </h3>

          <p className="
            text-gray-700
            leading-relaxed
          ">
            Ежедневно
            <br />
            10:00 — 23:00
          </p>

        </div>

      </div>

    </div>

  </div>

</section>
	  

      {/* ================= FOOTER ================= */}

      <footer className="
        bg-gray-900
        text-white

        py-10
        sm:py-14
      ">

        <div className="
          max-w-6xl
          mx-auto

          px-4
          sm:px-6

          text-center
        ">

          <button
            onClick={openPDF}
            className="
              text-sm
              text-gray-400
              hover:text-white
              transition
            "
          >

            Согласие на обработку
            персональных данных

          </button>

          <p className="
            mt-4
            text-gray-400
            text-sm
          ">

            © 2026 Кафе "Бурекас".
            Все права защищены.

          </p>

        </div>

      </footer>

    </div>

  );

}

export default Home;