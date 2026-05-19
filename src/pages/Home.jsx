import React from 'react';
import RoomCard from '../components/RoomCard';

const rooms = [
  { id: 1, title: 'Living Room', description: 'A cozy space for family time and entertaining guests.', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 2, title: 'Bedroom', description: 'A tranquil retreat designed for rest and relaxation.', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 3, title: 'Kitchen', description: 'A functional and stylish kitchen for culinary creativity.', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 4, title: 'Home Office', description: 'A productive workspace with ergonomic design.', imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
];

function Home() {
  return (
    <section className="space-y-12">
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10 md:p-16 bg-white">
        <div className="relative max-w-3xl z-10 flex flex-col justify-center h-full">
          <h1 className="text-3xl md:text-6xl font-['Playfair_Display'] font-bold tracking-tight mb-6 text-gray-900">
            Luxury Interiors, Thoughtfully Designed
            <span className="block text-2xl md:text-4xl text-[#caa74a]">
              For the way you live
            </span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-10 max-w-2xl">Craft elevated spaces with photorealistic concepts and precise measurements—curated with taste, delivered with ease.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#rooms" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-8 py-4 rounded-xl border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-center">
              Explore Rooms
            </a>
            <a href="/design" className="bg-gradient-to-r from-[#caa74a] to-[#9a7a2f] hover:from-[#d9b957] hover:to-[#a88938] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-center">
              Start Designing
            </a>
            <a href="/panorama" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-8 py-4 rounded-xl border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-center">
              Panoramic View
            </a>
          </div>
        </div>
      </div>

      <div id="rooms" className="space-y-6 bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-gray-900">Popular Rooms</h3>
          <a href="#" className="text-sm font-medium text-[#caa74a] hover:underline transition-colors duration-200">View all</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} {...room} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;
