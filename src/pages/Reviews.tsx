import { useEffect, useState } from 'react';

import {
  Star,
  ArrowLeft,
  X,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

import { Link } from 'react-router-dom';

export default function Reviews() {

  const { user } = useAuth();

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [ratingData, setRatingData] =
    useState<any>(null);

  const [text, setText] = useState('');

  const [grade, setGrade] = useState(5);

  const [photo, setPhoto] = useState('');

  const [sort, setSort] =
    useState('new');

const [editingId, setEditingId] =
  useState<number | null>(null);

const [selectedImage, setSelectedImage] =
  useState<string | null>(null);



  // ====================================
  // ЗАГРУЗКА
  // ====================================

  const loadReviews = async () => {

    try {

      const url = user

        ? `
          /api/reviews?userId=${user.id}
        `.replace(/\s/g, '')

        : `
          /api/reviews
        `.replace(/\s/g, '');

      const reviewsRes =
        await fetch(url);

      const reviewsData =
        await reviewsRes.json();

      const ratingRes = await fetch(
        '/api/reviews-rating'
      );

      const rating =
        await ratingRes.json();

      let sorted = [...reviewsData];

      if (sort === 'high') {
        sorted.sort(
          (a, b) => b.Grade - a.Grade
        );
      }

      if (sort === 'low') {
        sorted.sort(
          (a, b) => a.Grade - b.Grade
        );
      }

      setReviews(sorted);

      setRatingData(rating);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    loadReviews();

  }, [sort, user]);

  // ====================================
  // UPLOAD
  // ====================================



  const uploadPhoto = async (
    file: File
  ) => {

    const formData =
      new FormData();

    formData.append(
      'photo',
      file
    );

    const res = await fetch(
      '/api/upload-review-photo',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data =
      await res.json();

    setPhoto(data.filename);

  };

  // ====================================
  // СОХРАНЕНИЕ
  // ====================================

  const saveReview = async () => {

    if (!text) return;

    const body = {
      text,
      grade,
      photo,
      userId: user?.id,
    };

    if (editingId) {

      await fetch(
        `/api/reviews/${editingId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(body),
        }
      );

      alert(
        'Отзыв отправлен на повторную модерацию'
      );

    } else {

      await fetch(
        '/api/reviews',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            ...body,
            user_id: user?.id,
          }),
        }
      );

      alert(
        'Отзыв отправлен на модерацию'
      );

    }

    resetForm();

    loadReviews();

  };

  // ====================================
  // RESET
  // ====================================

  const resetForm = () => {

    setText('');

    setGrade(5);

    setPhoto('');

    setEditingId(null);

  };

  // ====================================
  // EDIT
  // ====================================

  const openEdit = (
    review: any
  ) => {

    setEditingId(review.ID);

    setText(review.Otzyv);

    setGrade(review.Grade);

    setPhoto(review.Photo || '');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  };

  // ====================================
  // DELETE
  // ====================================

  const deleteReview = async (
    id: number
  ) => {

    if (
      !confirm('Удалить отзыв?')
    ) return;

    await fetch(
      `/api/reviews/${id}`,
      {
        method: 'DELETE',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          userId: user?.id,
        }),
      }
    );

    loadReviews();

  };

  // ====================================
  // UI
  // ====================================

  return (

    <div className="
      min-h-screen
      bg-orange-50
      py-6
      md:py-10
    ">

      <div className="
        max-w-6xl
        mx-auto
        px-3
        sm:px-5
        lg:px-6
      ">

        {/* HEADER */}

        <div className="
          flex
          items-center
          gap-4
          mb-8
        ">

          <Link
            to="/"
            className="
              p-3
              bg-white
              rounded-2xl
              shadow
              hover:bg-orange-100
              transition
            "
          >
            <ArrowLeft />
          </Link>

          <div>

            <h1 className="
              text-3xl
              md:text-5xl
              font-bold
            ">
              Отзывы
            </h1>

            <p className="
              text-gray-600
              mt-2
            ">
              Мнения наших гостей
            </p>

          </div>

        </div>

        {/* РЕЙТИНГ */}

        {ratingData && (

          <div className="
            bg-white
            rounded-3xl
            shadow
            p-5
            md:p-8
            mb-8

            flex
            flex-col
            sm:flex-row
            gap-6

            sm:items-center
            sm:justify-between
          ">

            <div>

              <p className="
                text-gray-500
                mb-2
              ">
                Средняя оценка
              </p>

              <h2 className="
                text-4xl
                md:text-6xl
                font-bold
              ">
                {ratingData.avgRating} ⭐
              </h2>

            </div>

            <div className="
              sm:text-right
            ">

              <p className="
                text-gray-500
                mb-2
              ">
                Отзывов
              </p>

              <p className="
                text-3xl
                md:text-5xl
                font-bold
              ">
                {ratingData.total}
              </p>

            </div>

          </div>

        )}

        {/* ФОРМА */}

        {user && (

          <div className="
            bg-white
            rounded-3xl
            shadow
            p-5
            md:p-8
            mb-10
          ">

            <h2 className="
              text-2xl
              md:text-3xl
              font-bold
              mb-6
            ">

              {editingId

                ? 'Редактировать отзыв'

                : 'Оставить отзыв'}

            </h2>

            {/* STARS */}

            <div className="
              flex
              gap-2
              mb-6
              flex-wrap
            ">

              {[1, 2, 3, 4, 5].map(
                (star) => (

                <button
                  key={star}
                  onClick={() =>
                    setGrade(star)
                  }
                >

                  <Star
                    size={34}
                    className={
                      star <= grade

                        ? `
                          fill-yellow-400
                          text-yellow-400
                        `

                        : `
                          text-gray-300
                        `
                    }
                  />

                </button>

              ))}

            </div>

{/* Фото */}
<div
  className="
    border-2
    border-dashed
    rounded-3xl
    p-6
    md:p-10
    text-center
    mb-6
  "
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file) {
      uploadPhoto(file);
    }
  }}
>

  <p className="mb-4 text-gray-600">
    Перетащите фото сюда
  </p>

  <input
    type="file"
    onChange={(e) => {

      const file =
        e.target.files?.[0];

      if (file) {
        uploadPhoto(file);
      }

    }}
  />

  {photo && (
    <img
      src={`/images/reviews/${photo}`}
      className="
        w-full
        max-w-md
        h-64
        object-cover
        rounded-3xl
        mx-auto
        mt-6
        cursor-pointer
      "
      onClick={() =>
        window.open(
          `/images/reviews/${photo}`,
          '_blank'
        )
      }
    />
  )}

</div>

            {/* TEXTAREA */}

            <textarea
              className="
                w-full
                border
                rounded-3xl
                p-5
                h-40
                resize-none
              "

              placeholder="
                Ваш отзыв...
              "

              value={text}

              onChange={(e) =>
                setText(
                  e.target.value
                )
              }
            />

            {/* BUTTONS */}

            <div className="
              flex
              flex-col
              sm:flex-row
              gap-3
              mt-6
            ">

              <button
                onClick={saveReview}
                className="
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  px-6
                  py-4
                  rounded-2xl
                  font-semibold
                "
              >

                {editingId

                  ? 'Сохранить изменения'

                  : 'Отправить отзыв'}

              </button>

              {editingId && (

                <button
                  onClick={resetForm}
                  className="
                    bg-gray-500
                    hover:bg-gray-600
                    text-white
                    px-6
                    py-4
                    rounded-2xl
                    font-semibold
                  "
                >
                  Отмена
                </button>

              )}

            </div>

          </div>

        )}

        {/* SORT */}

        <div className="
          flex
          justify-end
          mb-6
        ">

          <select
            value={sort}

            onChange={(e) =>
              setSort(
                e.target.value
              )
            }

            className="
              border
              rounded-2xl
              p-4
              bg-white
              shadow
            "
          >

            <option value="new">
              Сначала новые
            </option>

            <option value="high">
              С высокой оценкой
            </option>

            <option value="low">
              С низкой оценкой
            </option>

          </select>

        </div>

     {/* REVIEWS */}

<div
  className="
    flex
    gap-4
    overflow-x-auto
    snap-x
    snap-mandatory
    pb-4

    md:grid
    md:gap-6
  "
>

  {reviews.map((review) => (

    <div
      key={review.ID}
      className="
        bg-white
        rounded-3xl
        shadow
        p-5
        md:p-7

        min-w-[78vw]
        snap-center
        flex-shrink-0

        md:min-w-0
      "
    >

              {/* TOP */}

              <div className="
                flex
                flex-col
                md:flex-row
                md:items-start
                md:justify-between
                gap-4
                mb-5
              ">

                <div>

                  <h3 className="
                    text-xl
                    md:text-2xl
                    font-bold
                  ">

                    {review.FIO}

                  </h3>

                  <div className="
                    flex
                    mt-2
                  ">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                      <Star
                        key={star}
                        size={22}
                        className={
                          star <= review.Grade

                            ? `
                              fill-yellow-400
                              text-yellow-400
                            `

                            : `
                              text-gray-300
                            `
                        }
                      />

                    ))}

                  </div>

                </div>

                {/* ACTIONS */}

                {user?.id ===
                  review.id_user && (

                  <div className="
                    flex
                    flex-wrap
                    gap-2
                  ">

                    <button
                      onClick={() =>
                        openEdit(review)
                      }

                      className="
                        bg-blue-500
                        hover:bg-blue-600
                        text-white
                        px-4
                        py-2
                        rounded-xl
                      "
                    >
                      Изменить
                    </button>

                    <button
                      onClick={() =>
                        deleteReview(
                          review.ID
                        )
                      }

                      className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-4
                        py-2
                        rounded-xl
                      "
                    >
                      Удалить
                    </button>

                  </div>

                )}

              </div>

              {/* IMAGE */}

			{review.Photo && (

			<img
				src={`/images/reviews/${review.Photo}`}

				onClick={() =>
				setSelectedImage(
					`/images/reviews/${review.Photo}`
				)
				}

				className="
				w-full
				h-44
				md:max-h-[500px]
				md:h-auto
				object-cover
				rounded-3xl
				mb-5
				cursor-pointer
				hover:opacity-90
				transition
				"
			/>

			)}

              {/* TEXT */}

              <p className="
                text-gray-700
                text-base
                md:text-lg
                leading-relaxed
              ">

                {review.Otzyv}

              </p>

              {/* MODERATION */}

              {review.ver === 0 && (

                <p className="
                  mt-4
                  inline-block
                  bg-yellow-100
                  text-yellow-700
                  text-sm
                  px-4
                  py-2
                  rounded-xl
                ">

                  На модерации

                </p>

              )}

            </div>

          ))}

        </div>

      </div>


{/* IMAGE MODAL */}

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
      setSelectedImage(null)
    }
  >

    <button
      className="
        absolute
        top-5
        right-5
        text-white
      "
    >
      <X size={40} />
    </button>

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