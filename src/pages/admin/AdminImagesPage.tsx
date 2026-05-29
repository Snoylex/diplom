import { useEffect, useState } from 'react';

interface FormState {
  foto: string;
  [key: string]: any;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>({ foto: '' });

  const loadImages = async () => {
    try {
      const res = await fetch('/api/admin/images');
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
      await fetch(`/api/admin/images/${name}`, {
        method: 'DELETE',
      });
      loadImages();
    } catch (error) {
      console.error("Ошибка удаления изображения:", error);
    }
  };

  return (
    <div className="mt-8 px-2 sm:px-0">
      <h3 className="text-xl font-bold mb-4">
        Загруженные изображения
      </h3>

      {/* адаптивная сетка */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
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
              src={`/images/${img}`}
              className="w-full h-24 sm:h-28 object-cover rounded-lg"
              alt={img}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deleteImage(img);
              }}
              className="mt-2 w-full bg-red-500 text-white py-1 rounded-lg text-sm"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}