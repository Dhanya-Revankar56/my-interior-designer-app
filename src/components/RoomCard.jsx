import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RoomCard({ id, title, description, imageUrl }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  
  return (
    <div className="bg-[#FAF8F5] rounded-2xl shadow-sm hover:shadow-md overflow-hidden group transform transition-all duration-300 border border-[#EAE6DF] flex flex-col justify-between h-full">
      <div className="relative overflow-hidden">
        {imageUrl && !imageError ? (
          <>
            <img 
              src={imageUrl} 
              alt={title} 
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: imageLoading ? 'none' : 'block' }}
            />
            {imageLoading && (
              <div className="h-48 w-full bg-gradient-to-br from-[#FAF8F5] to-[#EAE6DF] flex items-center justify-center">
                <div className="text-[#8C4324] font-medium text-sm">Loading...</div>
              </div>
            )}
          </>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-[#FAF8F5] to-[#EAE6DF] flex items-center justify-center">
            <div className="text-center text-[#8C4324]">
              <div className="text-3xl mb-1">🏠</div>
              <div className="font-medium text-sm">{title}</div>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 border border-[#EAE6DF] text-[10px] font-bold text-[#8C4324] px-2 py-0.5 rounded-full shadow-sm">
          ID: {id}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-['Playfair_Display'] font-bold mb-2 text-[#2E2B27] group-hover:text-[#8C4324] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-[#6E6A64] line-clamp-2 mb-4 leading-relaxed font-normal">
            {description}
          </p>
        </div>
        
        <Link 
          to={`/room/${id}`} 
          className="inline-block w-full bg-[#8C4324] hover:bg-[#723218] text-white font-semibold px-4 py-2.5 rounded-xl text-center transition-all duration-300 hover:shadow-sm text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default RoomCard;
