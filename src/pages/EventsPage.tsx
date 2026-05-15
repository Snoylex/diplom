import { useEffect, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await fetch(
      '/api/admin/events'
    );

    const data = await res.json();

    setEvents(data);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      'ru-RU',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link
            to="/"
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

          <h1 className="text-2xl font-bold">
            Мероприятия
          </h1>
        </div>
      </div>

      {/* EVENTS */}
      <div className="px-4 mt-4 space-y-5">
        {events.map((event) => (
          <div
            key={event.ID}
            className="
              bg-white
              rounded-2xl
              overflow-hidden
              shadow-sm
              border border-gray-100
            "
          >
            
            {/* IMAGE */}
            <div className="relative">
              <img
                src={`/images/promotions/${event.Izobrazhenie}`}
                alt=""
                onClick={() =>
                  setSelectedImage(
                    `/images/promotions/${event.Izobrazhenie}`
                  )
                }
                className="
                  w-full
                  h-52
                  object-cover
                  cursor-pointer
                  active:scale-[0.98]
                  transition
                "
              />

              {/* DATE BADGE */}
              <div
                className="
                  absolute
                  bottom-3
                  left-3
                  bg-black/70
                  backdrop-blur-sm
                  text-white
                  text-xs
                  px-3
                  py-2
                  rounded-xl
                "
              >
                {formatDate(event.Data_nachala)}
                {' — '}
                {formatDate(event.Data_okonchaniya)}
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h2
                className="
                  text-xl
                  font-bold
                  leading-tight
                  text-gray-900
                "
              >
                {event.event_name}
              </h2>

              <p
                className="
                  mt-3
                  text-gray-600
                  text-sm
                  leading-6
                "
              >
                {event.Opisanie}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL IMAGE */}
      {selectedImage && (
        <div
          className="
            fixed
            inset-0
            bg-black/95
            z-50
            flex
            items-center
            justify-center
            p-4
          "
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setSelectedImage('')}
            className="
              absolute
              top-4
              right-4
              bg-white
              rounded-full
              p-2
              shadow-lg
              active:scale-90
              transition
            "
          >
            <X size={24} />
          </button>

          {/* IMAGE */}
          <img
            src={selectedImage}
            alt=""
            className="
              max-w-full
              max-h-[85vh]
              rounded-2xl
              object-contain
            "
          />
        </div>
      )}
    </div>
  );
}