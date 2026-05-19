import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const linkBase =
    'block rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-white/5';

  const sections = [
    {
      title: 'Core',
      items: [
        { to: '/', label: 'Home', end: true },
        { to: '/about', label: 'About' },
        { to: '/panorama', label: 'Panorama' },
      ],
    },
    {
      title: 'Rooms',
      items: [
        { to: '/room/1', label: 'Living Room' },
        { to: '/room/2', label: 'Bedroom' },
        { to: '/room/3', label: 'Kitchen' },
      ],
    },
  ];

  return (
    <aside
      className={
        `fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out w-72 md:w-64 border-r border-gray-200 bg-white shadow-xl ` +
        (isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0')
      }
      aria-hidden={!isOpen}
    >
      <div className="p-4 md:p-6 h-full overflow-y-auto">
        <button
          className="md:hidden mb-4 text-sm text-gray-700 hover:text-[#caa74a] bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-all duration-200"
          onClick={onClose}
        >
          Close
        </button>
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wide text-gray-500">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `${linkBase} ${
                        isActive
                          ? 'bg-gray-100 text-[#caa74a] font-semibold'
                          : 'text-gray-700'
                      }`
                    }
                    onClick={onClose}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
