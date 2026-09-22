import React from 'react';
import { 
  LayoutGrid, 
  Search, 
  Briefcase, 
  FileCheck2, 
  MessageSquare, 
  BarChart3, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  UploadCloud
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const { currentRoute, navigateTo, logout, currentUser } = useApp();

  if (!currentUser) return null;

  const navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutGrid },
    { label: 'Explore Jobs', route: '/jobs', icon: Search },
    { label: 'My Applications', route: '/applications', icon: Briefcase },
    { label: 'Upload Resume', route: '/resume', icon: UploadCloud },
    { label: 'Assessments', route: '/assessment', icon: FileCheck2 },
    { label: 'AI Interviews', route: '/interview', icon: MessageSquare },
    { label: 'Results', route: '/results', icon: BarChart3 },
    { label: 'Profile', route: '/profile', icon: User },
    { label: 'Settings', route: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between sticky top-0 h-screen z-20 shadow-sm select-none">
      {/* Brand Header */}
      <div>
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-[#2E0854] flex items-center justify-center shadow-md shadow-purple-950/10">
            <span className="font-outfit font-black text-white text-lg">S</span>
          </div>
          <div>
            <span className="font-outfit font-bold text-lg text-slate-900 tracking-tight block leading-tight">SAYRAA</span>
            <span className="text-[10px] text-slate-400 font-semibold block tracking-wider uppercase">TALENT HIRE</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-210px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => navigateTo(item.route)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#2E0854] text-white shadow-md shadow-purple-950/15 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => navigateTo('/help')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help & Support</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 transition"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
