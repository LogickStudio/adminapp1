
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { NavItem } from '../types.js';
import { LabiscoLogoIcon, XCircleIcon } from '../constants.js';

interface SidebarProps {
  navItems: NavItem[];
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, isMobileOpen, closeMobileSidebar }) => {
  return (
    <aside
      className={`
        bg-cardLight dark:bg-cardDark p-4 flex flex-col 
        transform transition-transform duration-300 ease-in-out
        fixed inset-y-0 left-0 z-40 w-64 
        ${isMobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
        md:static md:translate-x-0 md:shadow-none md:border-r md:border-borderLight md:dark:border-borderDark 
        md:flex md:w-64 
      `}
      aria-label="Main navigation"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center justify-start px-1">
          <LabiscoLogoIcon className="h-10 w-auto" />
        </div>
        <button
          onClick={closeMobileSidebar}
          className="md:hidden p-1 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
          title="Close menu"
          aria-label="Close menu"
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                end={item.path === '/'}
                onClick={isMobileOpen ? closeMobileSidebar : undefined} // Close sidebar on nav item click on mobile
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors duration-200 ease-in-out 
                   text-base font-medium
                   ${isActive 
                      ? 'bg-primary-DEFAULT text-white shadow-lg' 
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-primary-DEFAULT dark:hover:text-primary-light'
                   }`
                }
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-borderLight dark:border-borderDark text-center text-neutral-500 dark:text-neutral-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Labisco Inc.</p>
      </div>
    </aside>
  );
};

export default Sidebar;