import { useEffect, useState } from "react";

export default function ArtistProfileForm({ initialValues, onSubmit, onCancel, status }) {
  const [form, setForm] = useState({
    artist_name: "",
    city: "",
    duties: [],
    bio: "",
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        artist_name: initialValues.artist_name ?? "",
        city: initialValues.city ?? "",
        duties: initialValues.duties ?? [],
        bio: initialValues.bio ?? "",
      });
    }
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function toggleDuty(duty) {
    setForm((p) => {
      const exists = p.duties.includes(duty);
      return { ...p, duties: exists ? p.duties.filter((d) => d !== duty) : [...p.duties, duty] };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  const dutyOptions = ["cantante", "ballerino/a", "circense", "artista generico", "gruppo musicale"];

  return (
    <form className="glass-card card-inner space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="label" htmlFor="artist_name">Nome Artista</label>
        <input
          id="artist_name"
          name="artist_name"
          className="input-glass"
          value={form.stage_name}
          onChange={handleChange}
          placeholder="Bob Singer"
        />
      </div>

      <div>
        <label className="label" htmlFor="city">Città</label>
        <input
          id="city"
          name="city"
          className="input-glass"
          value={form.city}
          onChange={handleChange}
          placeholder="Roma"
        />
      </div>

      <div>
        <p className="label mb-2">Che tipo di Artista sei?</p>
        <div className="flex flex-wrap gap-2">
          {dutyOptions.map((d) => (
            <button
              key={d}
              type="button"
              className="btn-ghost"
              onClick={() => toggleDuty(d)}
            >
              {form.duties.includes(d) ? "✅ " : ""}{d.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          className="input-glass min-h-[120px]"
          value={form.bio}
          onChange={handleChange}
          placeholder="Scrivi una breve presentazione..."
        />
      </div>

      <div className="flex gap-2">
        <button className="btn-primary w-full py-3 rounded-xl font-semibold" type="submit" disabled={status === "updating"}>
          {status === "updating" ? "Salvataggio..." : "Salva"}
        </button>
        <button className="btn-ghost w-full py-3 rounded-xl font-semibold" type="button" onClick={onCancel}>
          Annulla
        </button>
      </div>
    </form>
  );
}
