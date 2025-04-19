import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function AdminNav({ children }) {
  const router = useRouter();

  // Navigation items with icons and paths
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Pesanan', path: '/admin/orders', icon: '📦' },
    { label: 'Produk', path: '/admin/products', icon: '🏷️' },
    { label: 'Pengguna', path: '/admin/users', icon: '👥' },
  ];

  // Check if the current path matches the nav item path
  const isActive = (path) => {
    return router.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar / Mobile Nav */}
      <aside className="bg-white shadow-md md:w-64 w-full md:min-h-screen flex-shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path} legacyBehavior>
                  <a className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive(item.path) && <span className="ml-auto bg-blue-500 h-2 w-2 rounded-full"></span>}
                  </a>
                </Link>
              </li>
            ))}
          </ul>

          {/* Admin Tools Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Tools</h3>
            <ul className="mt-4 space-y-1">
              <li>
                <Link href="/" legacyBehavior>
                  <a className="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="mr-3">🏠</span>
                    <span>Kembali ke Toko</span>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-x-auto">{children}</div>
      </main>
    </div>
  );
}
