import { useEffect, useState } from 'react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  
  const [selectedImage, setSelectedImage] =
	useState('');

  const loadReviews = async () => {
    const res = await fetch('/api/reviews/all');
    const data = await res.json();
	
	

    setReviews(data);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const toggleModeration = async (id: number) => {
    await fetch(
      `/api/admin/reviews/moderate/${id}`,
      {
        method: 'PATCH',
      }
    );

    loadReviews();
  };

  const deleteReview = async (id: number) => {
    await fetch(
      `/api/admin/reviews/${id}`,
      {
        method: 'DELETE',
      }
    );

    loadReviews();
  };

  return (
    <div>
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10">
        Модерация отзывов
      </h1>

      <div className="grid gap-5">
        {reviews.map((review: any) => (
          <div
            key={review.ID}
            className="bg-white p-3 md:p-5 rounded-2xl shadow"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-bold break-words">
                  {review.FIO}
                </h3>

                <p className="text-yellow-500 text-lg md:text-xl">
                  {'★'.repeat(review.Grade)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() =>
                    toggleModeration(review.ID)
                  }
                  className={`px-4 py-2 rounded-xl text-white ${
                    review.ver
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                >
                  {review.ver
                    ? 'Скрыть'
                    : 'Одобрить'}
                </button>

                <button
                  onClick={() =>
                    deleteReview(review.ID)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Удалить
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm md:text-base break-words">
              {review.Otzyv}
            </p>

            {review.Photo && (
              <img
                src={`/images/reviews/${review.Photo}`}
                className="w-32 md:w-40 mt-4 rounded-xl cursor-pointer hover:opacity-80 transition"
				onClick={() =>
				setSelectedImage(
				`/images/reviews/${review.Photo}`
				)
				}
              />
            )}
          </div>
        ))}
      </div>
	  {selectedImage && (
  <div
    className="
      fixed
      inset-0
      bg-black/80
      z-50
      flex
      items-center
      justify-center
      p-4
    "
    onClick={() =>
      setSelectedImage('')
    }
  >
    <img
      src={selectedImage}
      className="
        max-w-full
        max-h-full
        rounded-2xl
      "
    />
  </div>
)}
    </div>
  );
}