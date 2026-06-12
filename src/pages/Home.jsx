import React from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';

const rooms = [
  { id: 1, title: 'Living Room', description: 'A cozy space for family time and entertaining guests.', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 2, title: 'Bedroom', description: 'A tranquil retreat designed for rest and relaxation.', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 3, title: 'Kitchen', description: 'A functional and stylish kitchen for culinary creativity.', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 4, title: 'Home Office', description: 'A productive workspace with ergonomic design.', imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
];

function Home() {
  return (
    <section className="space-y-16">
      {/* Editorial Subheader Note */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest pl-2">
        <svg className="w-3.5 h-3.5 text-[#8C4324]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="font-['Playfair_Display'] italic capitalize text-[13px] text-gray-600 tracking-normal normal-case">Crafted interiors, made personal.</span>
      </div>

      {/* Hero Grid Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#EAE6DF] shadow-sm bg-[#FAF8F5]">
        {/* Left Info Column */}
        <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-between min-h-[500px] lg:min-h-[580px]">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase block mb-6">
              EST. 2018 — INTERIOR ATELIER
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display'] font-medium text-[#2E2B27] leading-[1.15] mb-6">
              Spaces that <span className="italic text-[#8C4324] font-medium">feel</span> <br />like home.
            </h1>
            <p className="text-[#6E6A64] text-base md:text-lg max-w-xl leading-relaxed mb-8 font-normal">
              From mood to material — we craft interiors that reflect the people who live in them. Begin your design journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/design" 
                className="inline-flex items-center justify-center gap-2 bg-[#8C4324] hover:bg-[#723218] text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg text-center"
              >
                <span>START DESIGNING</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                to="/collection" 
                className="inline-flex items-center justify-center border border-[#EAE6DF] text-[#2E2B27] bg-white hover:bg-gray-50 font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 text-center"
              >
                VIEW COLLECTION
              </Link>
            </div>
          </div>

          {/* Stats Bar at bottom */}
          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-[#EAE6DF] mt-12">
            <div>
              <div className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-[#8C4324]">240+</div>
              <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">PROJECTS</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-[#8C4324]">12</div>
              <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">AWARDS</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-[#8C4324]">98%</div>
              <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">LOVED</div>
            </div>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-full">
          <img 
            src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80" 
            alt="Atelier Luxury Interior Design Concept"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Quote Overlay Card */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#EAE6DF] max-w-sm">
            <p className="text-[#2E2B27] font-['Playfair_Display'] italic text-base leading-relaxed mb-3">
              "They transformed our house into a story we love telling."
            </p>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block">
              — JANICE L. • HOMEOWNER
            </span>
          </div>
        </div>
      </div>

      {/* Popular Rooms section */}
      <div id="rooms" className="space-y-6 bg-white rounded-3xl p-8 shadow-sm border border-[#EAE6DF]">
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-[#2E2B27]">Popular Rooms</h3>
          <a href="#" className="text-sm font-semibold text-[#8C4324] hover:underline transition-colors duration-200">
            View all
          </a>
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
