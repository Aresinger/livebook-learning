import React from "react";

export default function VenueCard({ 
  image, 
  name, 
  city,
  duty = [], 
  bio,
  onClick 
}) {
  console.log(duty)
  return (
    <div 
      className="glass-card cursor-pointer hover:scale-[1.02] transition-transform duration-300"
      onClick={onClick}
    >
      {/* Immagine */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image || '/placeholder-venue.jpg'} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Nome sovrapposto all'immagine */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {name}
          </h3>
          {city && (
            <p className="text-white/90 text-sm mt-1">📍 {city}</p>
          )}
        </div>
      </div>

      {/* Contenuto */}
      <div className="card-inner">
        {/* Interessi/Tags */}
        {duty && duty.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {duty.map((duty, index) => (
              <span 
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20 text-white/90"
              >
                {duty}
              </span>
            ))}
          </div>
        )}

        {/* Biografia */}
        {bio && (
          <p className="help-text line-clamp-3">
            {bio} 
          </p>
        )}
      </div>
    </div>
  );
}