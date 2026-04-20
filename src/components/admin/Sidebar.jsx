import React from 'react';
import { Home, FolderOpen, Code, User, MessageSquare, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logoutAdmin } from '../../services/authService';

export function Sidebar() {
  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Manage Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'Manage Skills', href: '/admin/skills', icon: Code },
    { name: 'Manage About', href: '/admin/about', icon: User },
    { name: 'Manage Messages', href: '/admin/messages', icon: MessageSquare },
  ];

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col transition-colors duration-300">
      <div className="p-6">
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          Admin <span className="text-blue-500">Panel</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-300 hover:text-white hover:bg-blue-600 transition-all group"
            >
              <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              {link.name}
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-3">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-white bg-red-600/90 hover:bg-red-500 rounded-lg transition-colors border border-red-500"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
        <Link
          to="/"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
        >
          &larr; Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
