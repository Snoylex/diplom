import { useEffect, useState } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [index, setIndex] = useState(0);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const prev = () => {
    setIndex((i) => (i > 0 ? i - 1 : events.length - 1));
  };

  const next = () => {
    setIndex((i) => (i < events.length - 1 ? i + 1 : 0));
  };

  const shouldShowToggle = (text: string) => {
    return text && text.length > 180;
  };

  const event = events[index];

  return (
    <div className="min-h-screen bg-gray-100 pb-6">

      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/" className="p-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft size={24} />
          </Link>

          <h1 className="text-2xl font-bold">
            Мероприятия
          </h1>
        </div>
      </div>

      {/* MOBILE */}
      <div className="px-4 mt-4 grid gap-5 lg:hidden">

        {events.map((event) => (
          <div
            key={event.ID}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border"
          >
            <img
              src={`/images/promotions/${event.Izobrazhenie}`}
              onClick={() =>
                setSelectedImage(`/images/promotions/${event.Izobrazhenie}`)
              }
              className="w-full aspect-[16/9] object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-bold">
                {event.event_name}
              </h2>
			  
			  <div className="text-xs text-gray-500 mt-1">
			{formatDate(event.Data_nachala)} — {formatDate(event.Data_okonchaniya)}
			</div>

              <p
                className={`
                  mt-3 text-sm text-gray-600 leading-6
                  ${expanded[event.ID] ? '' : 'line-clamp-3'}
                `}
              >
                {event.Opisanie}
              </p>

              <button
                onClick={() => toggleExpand(event.ID)}
                className="mt-2 text-sm text-blue-600"
              >
                {expanded[event.ID] ? 'Скрыть' : 'Показать полностью'}
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* DESKTOP SINGLE SLIDER */}
      <div className="hidden lg:flex items-center justify-center mt-10 px-10">

        <button
          onClick={prev}
          className="p-3 bg-white shadow-md rounded-full hover:scale-105 transition"
        >
          <ChevronLeft />
        </button>

        {/* CARD */}
        {event && (
          <div className="mx-10 w-[900px] bg-white rounded-2xl shadow-sm border overflow-hidden">

            <img
              src={`/images/promotions/${event.Izobrazhenie}`}
              onClick={() =>
                setSelectedImage(`/images/promotions/${event.Izobrazhenie}`)
              }
              className="w-full aspect-[16/9] object-cover cursor-pointer"
            />

            <div className="p-6">

              <h2 className="text-2xl font-bold">
                {event.event_name}
              </h2>

              <div className="text-xs text-gray-500 mt-1">
                {formatDate(event.Data_nachala)} — {formatDate(event.Data_okonchaniya)}
              </div>

              <p
                className={`
                  mt-4 text-gray-600 leading-7
                  ${expanded[event.ID] ? '' : 'line-clamp-5'}
                `}
              >
                {event.Opisanie}
              </p>

              {shouldShowToggle(event.Opisanie) && (
                <button
                  onClick={() => toggleExpand(event.ID)}
                  className="mt-3 text-sm text-blue-600"
                >
                  {expanded[event.ID] ? 'Скрыть' : 'Показать полностью'}
                </button>
              )}

            </div>
          </div>
        )}

        <button
          onClick={next}
          className="p-3 bg-white shadow-md rounded-full hover:scale-105 transition"
        >
          <ChevronRight />
        </button>

      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">

          <button
            onClick={() => setSelectedImage('')}
            className="absolute top-4 right-4 bg-white rounded-full p-2"
          >
            <X size={24} />
          </button>

          <img
            src={selectedImage}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
          />

        </div>
      )}

    </div>
  );
}