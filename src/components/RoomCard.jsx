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
    <div className="bg-[#0f141b] rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden group transform transition-all duration-300 hover:scale-[1.02] border border-[#1f2733]">
      <div className="relative">
        {imageUrl && !imageError ? (
          <>
            <img 
              src={imageUrl} 
              alt={title} 
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: imageLoading ? 'none' : 'block' }}
            />
            {imageLoading && (
              <div className="h-48 w-full bg-gradient-to-br from-[#1a2230] to-[#141b24] flex items-center justify-center">
                <div className="text-[#caa74a] font-medium">Loading...</div>
              </div>
            )}
          </>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-[#1a2230] to-[#141b24] flex items-center justify-center">
            <div className="text-center text-[#caa74a]">
              <div className="text-4xl mb-2">🏠</div>
              <div className="font-medium">{title}</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 bg-[#0f141b]/80 border border-[#1f2733] text-xs font-medium text-gray-300 px-2 py-1 rounded-full">ID: {id}</div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-['Playfair_Display'] font-bold mb-2 text-gray-100 group-hover:text-[#caa74a] transition-colors duration-200">{title}</h3>
        <p className="text-sm text-gray-300 line-clamp-2 mb-4 leading-relaxed">{description}</p>
        <Link 
          to={`/room/${id}`} 
          className="inline-block w-full bg-gradient-to-r from-[#caa74a] to-[#9a7a2f] hover:from-[#d9b957] hover:to-[#a88938] text-[#0b0f14] font-semibold px-6 py-3 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default RoomCard;
