import { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react'; 
import { Link } from 'react-router-dom';


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

const interiorImages = [interior, interior1, interior2, interior3, interior4, interior5, interior6, interior7, interior8];

const pdfPath = '/documents/consent.pdf'; 

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % interiorImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openPDF = () => {
    window.open(pdfPath, '_blank');
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans">
      {/* ====================== ШАПКА ====================== */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-600 flex-shrink-0">
            <img
			 src={iconImg}
			 alt="Логотип"
			 className="w-full h-full object-cover"
			/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Кафе "Бурекас"</h1>
          </div>

          {/* Кнопка открытия меню */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl transition font-medium"
          >
            <Menu size={20} />
            Меню
          </button>
        </div>
      </header>

      {/* ====================== ВЫДВИЖНОЕ МЕНЮ ====================== */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Навигация</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2">
              <X size={28} />
            </button>
          </div>

          <div className="space-y-6 text-lg">
            <a href="#" className="block py-3 hover:text-orange-600 transition">Отзывы</a>
            
			{}
			<Link
				to="/menu"
				onClick={() => setIsMenuOpen(false)}
				className="block py-3 hover:text-orange-600 transition font-medium"
          >
            Меню
          </Link>
			
            <a href="#" className="block py-3 hover:text-orange-600 transition">Акции</a>
            <a href="#" className="block py-3 hover:text-orange-600 transition">Контакты</a>
          </div>
        </div>
      </div>

      {/* Оверлей для закрытия меню при клике вне */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* ====================== ГЕРОЙ-СЕКЦИЯ (слайдер фото) ====================== */}
      <section className="relative h-screen pt-20">
        <div className="absolute inset-0">
          {interiorImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Интерьер ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>

        {/* Тёмный overlay для читаемости текста */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Добро пожаловать<br />в Кафе "Бурекас"
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Свежие продукты • Тёплая атмосфера • Домашняя кухня
            </p>
            
          </div>
        </div>

        {/* Индикаторы слайдера */}
        <div className="absolute bottom-8 left-1/2 flex gap-3 -translate-x-1/2">
          {interiorImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* ====================== БЛОК «О НАС» ====================== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">О нас</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Кафе "Бурекас" — это место, где царит тёплая домашняя атмосфера. 
              Мы используем только свежие продукты и готовим с любовью. 
              Приходите насладиться вкусной едой и приятным интерьером!
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-6">
              Работаем каждый день с 9:00 до 22:00. Ждём именно вас!
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img 
              src={aboutImg} 
              alt="О нас" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ====================== КНОПКА PDF ВНИЗУ ====================== */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <button
            onClick={openPDF}
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >            
            Согласие на обработку персональных данных
          </button>

          <p className="mt-3 text-gray-400 text-sm">
            © 2026 Название Кафе. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;