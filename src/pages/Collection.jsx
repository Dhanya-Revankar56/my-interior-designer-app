import React from 'react';

function Collection() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#caa74a]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-lg mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#caa74a] to-[#8f6b10] rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
          📂
        </div>
        
        <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-gray-900 mb-4">
          My Design Collection
        </h1>
        
        <p className="text-[#caa74a] font-semibold tracking-wider uppercase text-sm mb-6">
          Saved Concepts & Layouts
        </p>
        
        <p className="text-gray-600 text-lg mb-8">
          Organize, group, and showcase all your generated rooms, panoramic views, and design schemes in one unified personal gallery.
        </p>
        
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          Personal Galleries Coming Soon
        </div>
      </div>
    </div>
  );
}

export default Collection;
