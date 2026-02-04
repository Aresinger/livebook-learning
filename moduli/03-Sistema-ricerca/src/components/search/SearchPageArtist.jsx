import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchThunk } from "./searchSlice";
import VenueCard from "../Card/VenueCard";

export default function SearchPageArtist() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const [selectOption, setSelectOption] = useState(null); // ✅ null o stringa, non boolean
  const [data, setData] = useState([]);
  const [searchForm, setSearchForm] = useState({
    role: role,
    city: "",
    duty: "",
    venue_name: "",
  });

  const optSearch = [
    { label: 'Città', value: 'city' },
    { label: 'Interessi', value: 'duty' },
    { label: 'Nome Locale', value: 'venue_name' }
  ];

  function handleOptionClick(option) {
    console.log("Opzione selezionata:", option);
    setSelectOption(option.value); // Salva 'city', 'duty', o 'venue_name'
    
    // Reset degli altri campi
    setSearchForm((prev) => ({
      ...prev,
      city: "",
      duty: '',
      venue_name: "",
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
          q: searchForm.venue_name,
          duty: searchForm.duty,
          city: searchForm.city,
        },
      }),
    );

    console.log("Action ricevuta:", action);

    if (searchThunk.fulfilled.match(action)) {
      setData(action.payload || []);
      console.log("Risultati:", action.payload);

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
      venue_name: "",
    }));
  }

  console.log("Data:", data);
  console.log("Search form:", searchForm);
  console.log("DataProva:", data.map((item) => item.duties));


  return (
    
      <div className="container mx-auto max-w-4xl p-6">
        <form onSubmit={handleSubmit} className="glass-card card-inner">
          <h2 className="text-3xl font-bold mb-6">
            Cerca i locali per i tuoi eventi
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
                    selectOption === 'duty' ? 'es. gruppo musicale' :
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
        <div className=" mt-5 ">
          {data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {data.map((venue) => (
                <VenueCard
                  key={venue.id}
                  name={venue.venue_name}
                  city={venue.city}
                  duties={venue.duties}
                  bio={venue.bio}
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