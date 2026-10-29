import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  const location = useLocation();

  // Hide sidebar on landing, login, register, and profile setup pages
  const noSidebarPaths = ['/', '/login', '/register', '/profile-setup'];
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
