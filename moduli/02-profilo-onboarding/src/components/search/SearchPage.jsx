import React, { useState } from "react";

export default function SearchPage({ artist }) {
  const [selectOption, setSelectOption] = useState({opt:null, view:false});
  const [searchForm,setSearchForm] = useState({
    role: artist.role,
    opt: '',

  })
  function handleChange(e){
    e.preventDefault();
    

  }
  return (
    <div>
      <h2 className="m-5">Cerca i locali per i tuoi eventi</h2>
      <label htmlFor="searchVenue" className="m-5">Filtra per: </label>
      <select name="searchVenue" id="searchVenue" className="text-black" >
        <option selected >Seleziona un opzione di ricerca..</option>
        <option value="city" onClick={(e) => setSelectOption({opt:'city',view:true})}>Città</option>
        <option value="duty">Interessi</option>
        <option value="venue_name">Nome Locale</option>
      </select>
      {selectOption.view ?   <div>
                <label className="label" htmlFor="stage_name">
                  Cerca per {selectOption.opt}: 
                </label>
                <input
                  id={selectOption.opt}
                  name={selectOption.opt}
                  type="text"
                  className="input-glass"
                  placeholder="Trattoria da Manna"
                  onChange={(e) => handleChange(e)}
                  value={formArtist.stage_name}
                />
              </div> : null}
      <button className="btn-primary m-5" type='submit'>Cerca</button>
    </div>
  );
}
