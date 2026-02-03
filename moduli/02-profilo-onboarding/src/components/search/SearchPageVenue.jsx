import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchThunk } from "./searchSlice";

import ArtistCard from "../Card/ArtistCard";

export default function SearchPageArtist() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const [selectOption, setSelectOption] = useState(null); // ✅ null o stringa, non boolean
  const [data, setData] = useState([]);
  const [searchForm, setSearchForm] = useState({
    role: role,
    city: "",
    duty: "",
    artist_name: "",
  });

  const optSearch = [
    { label: 'Città', value: 'city' },
    { label: 'Interessi', value: 'duty' },
    { label: 'Nome Artista', value: 'artist_name' }
  ];

  function handleOptionClick(option) {
    console.log("Opzione selezionata:", option);
    setSelectOption(option.value); // Salva 'city', 'duty', o 'artist_name'
    
    // Reset degli altri campi
    setSearchForm((prev) => ({
      ...prev,
      city: "",
      duty: "",
      artist_name: "",
    }));
  }

  function handleChangeInput(e) {
    const { value } = e.target;
    
    // Aggiorna solo il campo selezionato
    setSearchForm((prev) => ({
      ...prev,
      [selectOption]: value  // ✅ Usa selectOption come chiave
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Form inviato:", searchForm);

    const action = await dispatch(
      searchThunk({
        role: searchForm.role,
        filters: {
          q: searchForm.artist_name,
          duty: searchForm.duty,
          city: searchForm.city,
        },
      }),
    );

    console.log("Action ricevuta:", action);

    if (searchThunk.fulfilled.match(action)) {
      setData(action.payload || []);
      console.log("Risultati:", action.payload);
      console.log("duties:", action.payload && action.payload.duties ? action.payload.duties.map((d) => d) : []);
    } else {
      setData([]);
      console.error("Errore:", action.error || action.payload);
    }

    // Reset dopo submit
    setSelectOption(null);
    setSearchForm((prev) => ({
      ...prev,
      city: "",
      duty: "",
      artist_name: "",
    }));
  }

  console.log("Data:", data);
  console.log("Search form:", searchForm);

  return (
    
      <div className="container mx-auto max-w-4xl p-6">
        <form onSubmit={handleSubmit} className="glass-card card-inner">
          <h2 className="text-3xl font-bold mb-6">
            Cerca gli Artisti per i tuoi eventi
          </h2>

          <div className="space-y-4">
            <div>
              <label className="label">Filtra per:</label>
              <div className="flex flex-wrap gap-3">
                {optSearch.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`btn-ghost ${
                      selectOption === option.value ? 'bg-white/20' : ''
                    }`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {selectOption === option.value && '✓ '}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {selectOption && (
              <div>
                <label className="label" htmlFor="searchInput">
                  Cerca per {optSearch.find(o => o.value === selectOption)?.label}:
                </label>
                <input
                  id="searchInput"
                  type="text"
                  className="input-glass"
                  placeholder={
                    selectOption === 'city' ? 'es. Caserta' :
                    selectOption === 'duty' ? 'es. Artista generico' :
                    'es. Trattoria da Manna'
                  }
                  onChange={handleChangeInput}
                  value={searchForm[selectOption]}
                />
                <button 
                  className="btn-primary w-full mt-4 py-3 rounded-xl font-semibold" 
                  type="submit"
                >
                  Cerca
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Risultati */}
        <div className="mt-8">
          {data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  name={artist.artist_name}
                  city={artist.city}
                  duties={artist.duties}
                  bio={artist.bio}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card card-inner text-center">
              <p className="help-text">
                {selectOption 
                  ? "Nessun risultato trovato. Prova con un'altra ricerca." 
                  : "Seleziona un filtro per iniziare la ricerca."}
              </p>
            </div>
          )}
        </div>
      </div>
    
  );
}