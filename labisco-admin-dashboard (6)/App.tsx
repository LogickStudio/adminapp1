
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import DashboardPage from './pages/DashboardPage.js';
import ProductsPage from './pages/ProductsPage.js';
import ProductEditPage from './pages/ProductEditPage.js'; // New page for editing/adding products
import ShopManagementPage from './pages/ShopManagementPage.js';
import LoginPage from './pages/LoginPage.js';
import NotFoundPage from './pages/NotFoundPage.js';
import { DashboardIcon, ProductsIcon, SettingsIcon, LogoutIcon, SunIcon, MoonIcon, MenuIcon } from './constants.js';
import type { NavItem } from './types.js';
import { useAuth } from './contexts/AuthContext.js';
import { useTheme } from './contexts/ThemeContext.js';


const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: DashboardIcon },
  { name: 'Products', path: '/products', icon: ProductsIcon },
  { name: 'Shop Management', path: '/shop-management', icon: SettingsIcon },
];

const getPageTitle = (pathname: string): string => {
  if (pathname === '/products/new') return 'Add New Product';
  if (pathname.startsWith('/products/edit/')) return 'Edit Product';
  
  const currentNavItem = navItems.find(item => {
    if (item.path === '/') return pathname === '/';
    return pathname.startsWith(item.path);
  });

  return currentNavItem ? currentNavItem.name : 'Labisco Admin';
};

const Layout: React.FC = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-bgLight dark:bg-bgDark text-textLight dark:text-textDark transition-colors duration-300">
      <Sidebar
        navItems={navItems}
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />

      {/* Backdrop for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden" // z-30 so sidebar (z-40) is on top
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-cardLight dark:bg-cardDark shadow-md p-4 border-b border-borderLight dark:border-borderDark flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleMobileSidebar}
              className="md:hidden p-2 mr-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
              title="Toggle menu"
              aria-label="Toggle menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold">{pageTitle}</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-neutral-600" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-DEFAULT dark:hover:text-primary-light hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
              title="Logout"
            >
              <LogoutIcon className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6"> {/* Adjusted padding for small screens */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductEditPage />} />
          <Route path="products/edit/:productId" element={<ProductEditPage />} />
          <Route path="shop-management" element={<ShopManagementPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;