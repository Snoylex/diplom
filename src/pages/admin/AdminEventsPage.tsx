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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const loadData = async () => {
    const res = await fetch('/api/admin/events');
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload-promotion-image', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    setForm((prev) => ({
      ...prev,
      Izobrazhenie: data.filename,
    }));
  };

  const saveEvent = async () => {
    setError('');

    if (!form.event_name.trim()) return setError('Введите название');
    if (!form.Opisanie.trim()) return setError('Введите описание');
    if (!form.Izobrazhenie) return setError('Загрузите изображение');

    const url = editingId
      ? `/api/admin/events/${editingId}`
      : '/api/admin/events';

    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm(emptyForm);
    setEditingId(null);
    loadData();
  };

  const deleteEvent = async (id: number) => {
    if (!confirm('Удалить мероприятие?')) return;
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
    loadData();
  };

  const editEvent = (event: any) => {
    setEditingId(event.ID);
    setForm({
      event_name: event.event_name || '',
      Opisanie: event.Opisanie || '',
      Izobrazhenie: event.Izobrazhenie || '',
      Data_nachala: event.Data_nachala?.split('T')[0] || '',
      Data_okonchaniya: event.Data_okonchaniya?.split('T')[0] || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-3 md:p-0">

      {/* TITLE */}
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-10">
        Мероприятия
      </h1>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow p-3 md:p-6 mb-6 md:mb-10">

        <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-5">
          {editingId ? 'Редактировать' : 'Создать мероприятие'}
        </h2>

        {/* ERROR */}
        {error && (
          <div className="mb-3 bg-red-100 text-red-600 p-2 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* INPUTS */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">

          <input
            placeholder="Название"
            className="border p-3 md:p-3 rounded-xl text-sm md:text-base"
            value={form.event_name}
            onChange={(e) =>
              setForm({ ...form, event_name: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-3 md:p-3 rounded-xl text-sm md:text-base"
            value={form.Data_nachala}
            onChange={(e) =>
              setForm({ ...form, Data_nachala: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-3 md:p-3 rounded-xl text-sm md:text-base"
            value={form.Data_okonchaniya}
            onChange={(e) =>
              setForm({ ...form, Data_okonchaniya: e.target.value })
            }
          />

          <textarea
            placeholder="Описание"
            className="border p-3 md:p-3 rounded-xl md:col-span-2 h-24 md:h-40 text-sm md:text-base"
            value={form.Opisanie}
            onChange={(e) =>
              setForm({ ...form, Opisanie: e.target.value })
            }
          />

        </div>

        {/* UPLOAD */}
        <div
          className="border-2 border-dashed rounded-2xl p-4 md:p-10 text-center mt-4 md:mt-5"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) uploadImage(file);
          }}
        >
          <p className="mb-2 md:mb-3 text-xs md:text-lg text-gray-600">
            Перетащите изображение или выберите файл
          </p>

          <input
            type="file"
            className="text-xs md:text-base"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
            }}
          />

          {form.Izobrazhenie && (
            <img
              src={`/images/promotions/${form.Izobrazhenie}`}
              className="w-40 h-40 md:w-52 md:h-52 object-cover rounded-2xl mx-auto mt-4"
            />
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-5 md:mt-6">

          <button
            onClick={saveEvent}
            className="
              bg-orange-500 hover:bg-orange-600 transition text-white
              px-4 py-3 text-sm md:px-6 md:py-3 md:text-base
              rounded-xl w-full sm:w-auto
            "
          >
            {editingId ? 'Сохранить' : 'Создать'}
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setError('');
              }}
              className="
                bg-gray-200 active:bg-gray-300
                px-4 py-3 text-sm md:px-6 md:py-3 md:text-base
                rounded-xl w-full sm:w-auto
              "
            >
              Отмена
            </button>
          )}

        </div>
      </div>

      {/* LIST */}
      <div className="grid gap-4 md:gap-5">

        {events.map((event) => (
          <div
            key={event.ID}
            className="bg-white rounded-2xl shadow p-3 md:p-5 flex flex-col md:flex-row gap-4 md:gap-5"
          >

            {/* IMAGE */}
            <img
              src={`/images/promotions/${event.Izobrazhenie}`}
              className="w-full md:w-64 h-40 md:h-64 object-cover rounded-2xl"
            />

            {/* INFO */}
            <div className="flex-1">

              <h3 className="text-xl md:text-3xl font-bold">
                {event.event_name}
              </h3>

              <p className="text-gray-500 mt-2 text-sm md:text-base">
                {formatDate(event.Data_nachala)} — {formatDate(event.Data_okonchaniya)}
              </p>

              <p className="mt-3 md:mt-5 text-sm md:text-lg whitespace-pre-wrap break-words">
                {event.Opisanie}
              </p>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col md:flex-col gap-2 w-full md:w-auto">

              <button
                onClick={() => editEvent(event)}
                className="
                  bg-blue-500 text-white rounded-xl w-full
                  px-3 py-2 text-sm md:px-5 md:py-3 md:text-base
                "
              >
                Изменить
              </button>

              <button
                onClick={() => deleteEvent(event.ID)}
                className="
                  bg-red-500 text-white rounded-xl w-full
                  px-3 py-2 text-sm md:px-5 md:py-3 md:text-base
                "
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