import React from 'react';
import { Search, Bell, Bot, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopHeader = () => {
  const { currentUser, navigateTo } = useApp();

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Global Search Bar */}
      <div className="relative w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition shadow-inner-sm"
        />
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-600" />
        </button>

        {/* AI Assistant Quick Trigger */}
        <button 
          onClick={() => navigateTo('/resume')}
          title="Sayraa AI Assistant" 
          className="p-2.5 rounded-full text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 transition"
        >
          <Bot className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-slate-200" />

        {/* User Pill */}
        <button 
          onClick={() => navigateTo('/profile')}
          className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
        >
          <img 
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
            alt={currentUser?.name || "Subham Khandual"}
            className="w-8 h-8 rounded-full object-cover border border-purple-200 shadow-sm" 
          />
          <div className="text-left">
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              {currentUser?.name || "Subham Khandual"}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
