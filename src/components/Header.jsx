import React from 'react';
import { useLocation } from 'react-router-dom';

function Header({ onMenuClick = () => {} }) {
  const location = useLocation();

  // Helper to determine the current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/shop') return 'Shop';
    if (path === '/meetings') return 'Meeting';
    if (path === '/collection') return 'Collection';
    if (path === '/about') return 'About Us';
    if (path === '/design') return 'Design Tool';
    if (path.startsWith('/room/')) return 'Room Details';
    if (path === '/login') return 'Sign In';
    if (path === '/demo') return 'Demo Access';
    return 'Atelier';
  };

  return (
    <header className="w-full sticky top-0 z-30 border-b border-[#EAE6DF] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Active module name */}
          <span className="text-xl font-semibold text-[#2E2B27] font-['Playfair_Display'] tracking-tight">
            {getPageTitle()}
          </span>

          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl border border-[#EAE6DF] text-gray-500 hover:text-[#8C4324] bg-white hover:bg-gray-50 transition-all duration-200"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
