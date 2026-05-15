import { useEffect, useState } from 'react';

export default function AdminEventsPage() {

  const [events, setEvents] = useState<any[]>([]);

  const emptyForm = {
    event_name: '',
    Opisanie: '',
    Izobrazhenie: '',
    Data_nachala: '',
    Data_okonchaniya: '',
  };

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  // =========================
  // ЗАГРУЗКА
  // =========================

  const loadData = async () => {

    try {

      const res = await fetch(
        'http://localhost:5000/api/admin/events'
      );

      const data = await res.json();

      setEvents(data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // UPLOAD ФОТО
  // =========================

  const uploadImage = async (file: File) => {

    try {

      const formData = new FormData();

      formData.append('image', file);

      const res = await fetch(
        'http://localhost:5000/api/upload-promotion-image',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        Izobrazhenie: data.filename,
      }));

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // СОЗДАТЬ / ИЗМЕНИТЬ
  // =========================

  const saveEvent = async () => {

    try {

      const url = editingId
        ? `http://localhost:5000/api/admin/events/${editingId}`
        : 'http://localhost:5000/api/admin/events';

      const method = editingId
        ? 'PUT'
        : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(form),
      });

      setForm(emptyForm);

      setEditingId(null);

      loadData();

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // УДАЛИТЬ
  // =========================

  const deleteEvent = async (id: number) => {

    if (!confirm('Удалить мероприятие?')) {
      return;
    }

    try {

      await fetch(
        `http://localhost:5000/api/admin/events/${id}`,
        {
          method: 'DELETE',
        }
      );

      loadData();

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // РЕДАКТИРОВАТЬ
  // =========================

  const editEvent = (event: any) => {

    setEditingId(event.ID);

    setForm({
      event_name: event.event_name || '',
      Opisanie: event.Opisanie || '',
      Izobrazhenie: event.Izobrazhenie || '',
      Data_nachala:
        event.Data_nachala?.split('T')[0] || '',

      Data_okonchaniya:
        event.Data_okonchaniya?.split('T')[0] || '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-10">
        Мероприятия
      </h1>

      {/* ФОРМА */}

      <div className="bg-white rounded-2xl shadow p-6 mb-10">

        <h2 className="text-2xl font-bold mb-5">

          {editingId
            ? 'Редактировать мероприятие'
            : 'Создать мероприятие'}

        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Название"
            className="border p-3 rounded-xl"
            value={form.event_name}
            onChange={(e) =>
              setForm({
                ...form,
                event_name: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="border p-3 rounded-xl"
            value={form.Data_nachala}
            onChange={(e) =>
              setForm({
                ...form,
                Data_nachala: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="border p-3 rounded-xl"
            value={form.Data_okonchaniya}
            onChange={(e) =>
              setForm({
                ...form,
                Data_okonchaniya: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Описание"
            className="border p-3 rounded-xl md:col-span-2 h-40"
            value={form.Opisanie}
            onChange={(e) =>
              setForm({
                ...form,
                Opisanie: e.target.value,
              })
            }
          />

        </div>

        {/* ЗАГРУЗКА */}

        <div
          className="border-2 border-dashed rounded-2xl p-10 text-center mt-5"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {

            e.preventDefault();

            const file =
              e.dataTransfer.files[0];

            if (file) {
              uploadImage(file);
            }
          }}
        >

          <p className="mb-3 text-lg">
            Перетащите изображение сюда
          </p>

          <input
            type="file"
            onChange={(e) => {

              const file =
                e.target.files?.[0];

              if (file) {
                uploadImage(file);
              }
            }}
          />

          {form.Izobrazhenie && (

            <img
              src={`http://localhost:5000/images/promotions/${form.Izobrazhenie}`}
              className="w-52 h-52 object-cover rounded-2xl mx-auto mt-5"
            />

          )}

        </div>

        <div className="flex gap-3 mt-6">

          <button
            onClick={saveEvent}
            className="bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-3 rounded-xl"
          >

            {editingId
              ? 'Сохранить'
              : 'Создать'}

          </button>

          {editingId && (

            <button
              onClick={() => {

                setEditingId(null);

                setForm(emptyForm);
              }}
              className="bg-gray-300 px-6 py-3 rounded-xl"
            >
              Отмена
            </button>

          )}

        </div>

      </div>

      {/* СПИСОК */}

      <div className="grid gap-5">

        {events.map((event) => (

          <div
            key={event.ID}
            className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row gap-5"
          >

            <img
              src={`http://localhost:5000/images/promotions/${event.Izobrazhenie}`}
              className="w-full md:w-64 h-64 object-cover rounded-2xl"
            />

            <div className="flex-1">

              <h3 className="text-3xl font-bold">
                {event.event_name}
              </h3>

              <p className="text-gray-500 mt-2">

                {event.Data_nachala}
                {' — '}
                {event.Data_okonchaniya}

              </p>

              <p className="mt-5 text-lg whitespace-pre-wrap">
                {event.Opisanie}
              </p>

            </div>

            <div className="flex flex-col gap-3">

              <button
                onClick={() => editEvent(event)}
                className="bg-blue-500 hover:bg-blue-600 transition text-white px-5 py-3 rounded-xl"
              >
                Изменить
              </button>

              <button
                onClick={() => deleteEvent(event.ID)}
                className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-3 rounded-xl"
              >
                Удалить
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}