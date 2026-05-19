import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header({ onMenuClick = () => {} }) {
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ? saved === 'dark' : prefersDark;
    setDark(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/room/${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="w-full sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#caa74a] to-[#8f6b10] text-white grid place-items-center font-bold shadow">ID</div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold text-gray-900 font-['Playfair_Display']">Interior Designer</span>
              <span className="text-[11px] text-[#9a7a2f] -mt-0.5">Plan. Visualize. Refine.</span>
            </div>
          </div>

            <nav className="hidden md:flex items-center gap-1 text-sm">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'text-[#caa74a] bg-gray-100' : 'text-gray-700 hover:text-[#caa74a] hover:bg-gray-100'}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'text-[#caa74a] bg-gray-100' : 'text-gray-700 hover:text-[#caa74a] hover:bg-gray-100'}`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/panorama"
                className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'text-[#caa74a] bg-gray-100' : 'text-gray-700 hover:text-[#caa74a] hover:bg-gray-100'}`
                }
              >
                Panorama
              </NavLink>
              {user && (
                <NavLink
                  to="/design"
                  className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'text-[#caa74a] bg-gray-100' : 'text-gray-700 hover:text-[#caa74a] hover:bg-gray-100'}`
                  }
                >
                  Design
                </NavLink>
              )}
            </nav>

          <form onSubmit={handleSubmit} className="flex-1 hidden md:flex max-w-sm ml-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to room (e.g., 101)"
                className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm outline-none focus:border-[#caa74a] focus:ring-2 focus:ring-[#caa74a]/20 text-gray-800 placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-[#caa74a] transition-colors duration-200"
                aria-label="Search"
              >
                🔎
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark((v) => !v)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-gray-300 text-gray-700 hover:text-[#caa74a] bg-white hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {dark ? '🌙' : '☀️'}
            </button>
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-xl px-3 py-2 transition-all duration-200">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full border border-gray-300"
                    />
                  )}
                  <span className="text-gray-800 text-sm font-medium">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <button 
                  onClick={logout} 
                  className="bg-gradient-to-r from-[#caa74a] to-[#9a7a2f] hover:from-[#d9b957] hover:to-[#a88938] text-[#0b0f14] font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                  title="Sign out"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="hidden md:inline-flex bg-gradient-to-r from-[#caa74a] to-[#9a7a2f] hover:from-[#d9b957] hover:to-[#a88938] text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow">Sign in</NavLink>
            )}
            <button
              onClick={onMenuClick}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl border border-gray-300 text-gray-700 hover:text-[#caa74a] bg-white hover:bg-gray-100 transition-all duration-200"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
