import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user, logout } = useAuth();
  const linkBase =
    'block rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300';

  const menuItems = [
    {
      to: '/',
      label: 'Home',
      end: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      to: '/shop',
      label: 'Shop',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      to: '/meetings',
      label: 'Meeting',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      to: '/collection',
      label: 'Collection',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      to: '/about',
      label: 'About Us',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={
        `fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out w-72 md:w-64 border-r border-[#EAE6DF] bg-[#FAF8F5] flex flex-col ` +
        (isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0')
      }
      aria-hidden={!isOpen}
    >
      {/* Brand logo in Sidebar */}
      <div className="p-6 border-b border-[#EAE6DF] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {user ? (
            <>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="h-9 w-9 rounded-full object-cover border border-[#EAE6DF] shadow-sm flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-[#8C4324] text-white grid place-items-center font-['Playfair_Display'] font-bold text-lg shadow-sm flex-shrink-0">
                  {((user.displayName || user.email || 'U').charAt(0)).toUpperCase()}
                </div>
              )}
              <span 
                className="text-lg font-medium text-[#2E2B27] font-['Playfair_Display'] tracking-tight truncate" 
                title={user.displayName || user.email}
              >
                {user.displayName || user.email.split('@')[0]}
              </span>
            </>
          ) : (
            <>
              {/* Terracotta Box with Serif A Logo */}
              <div className="h-9 w-9 rounded bg-[#8C4324] text-white grid place-items-center font-['Playfair_Display'] font-bold text-xl shadow-sm">
                A
              </div>
              <span className="text-xl font-medium text-[#2E2B27] font-['Playfair_Display'] tracking-tight">Atelier</span>
            </>
          )}
        </div>
        <button
          className="md:hidden text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Studio
        </h3>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 ${linkBase} ${
                    isActive
                      ? 'bg-[#F2ECE4] text-[#8C4324] font-semibold shadow-sm'
                      : 'text-[#6E6A64] hover:bg-[#F9F6F0] hover:text-[#2E2B27]'
                  }`
                }
                onClick={onClose}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* User profile footer/logout block or sign-in link */}
      {user ? (
        <div className="p-4 border-t border-[#EAE6DF] bg-[#FAF8F5] flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="h-8 w-8 rounded-full object-cover border border-[#EAE6DF]" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[#8C4324]/10 text-[#8C4324] grid place-items-center font-bold text-sm border border-[#8C4324]/20 flex-shrink-0">
                {((user.displayName || user.email || 'U').charAt(0)).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#2E2B27] truncate">
                {user.displayName || 'Signed In'}
              </p>
              <p className="text-[10px] text-gray-500 truncate" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-gray-400 hover:text-[#8C4324] hover:bg-[#F2ECE4] rounded-lg transition-colors duration-200 flex-shrink-0"
            title="Sign Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="p-4 border-t border-[#EAE6DF] bg-[#FAF8F5]">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#EAE6DF] text-xs font-semibold text-[#2E2B27] hover:bg-[#8C4324] hover:text-white hover:border-[#8C4324] transition-all duration-300 shadow-sm ${
                isActive ? 'bg-[#8C4324] text-white border-[#8C4324]' : 'bg-white hover:bg-gray-50'
              }`
            }
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>SIGN IN</span>
          </NavLink>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
