import { useEffect, useState } from 'react';

// Описание интерфейса для формы (настройте под свои нужды)
interface FormState {
  foto: string;
  [key: string]: any; 
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<string[]>([]);
  // Исправление: Добавлено отсутствующее состояние формы
  const [form, setForm] = useState<FormState>({ foto: '' });

  const loadImages = async () => {
    try {
      const res = await fetch('http://cu943745.tw1.ru/api/admin/images');
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Ошибка загрузки изображений:", error);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const deleteImage = async (name: string) => {
    if (!confirm(`Удалить ${name}?`)) return;

    try {
      await fetch(`http://cu943745.tw1.ru/api/admin/images/${name}`, {
        method: 'DELETE',
      });
      loadImages();
    } catch (error) {
      console.error("Ошибка удаления изображения:", error);
    }
  };

  return (
    // Исправление: Убран лишний символ "<" и лишние закрывающие теги в конце
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">
        Загруженные изображения
      </h3>

      <div className="grid grid-cols-5 gap-4">
        {images.map((img) => (
          <div
            key={img}
            className={`border rounded-xl p-2 cursor-pointer ${
              form.foto === img ? 'border-orange-500 border-4' : ''
            }`}
            onClick={() =>
              setForm({
                ...form,
                foto: img,
              })
            }
          >
            <img
              src={`/images/dishes/${img}`}
              className="w-full h-28 object-cover rounded-lg"
              alt={img}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deleteImage(img);
              }}
              className="mt-2 w-full bg-red-500 text-white py-1 rounded-lg"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
