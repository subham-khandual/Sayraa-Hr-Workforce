import React from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { useApp } from '../../context/AppContext';
import { Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Toast Component
const Toast = () => {
  const { toast } = useApp();
  if (!toast) return null;

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-purple-50 border-purple-200 text-purple-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-800'
  };

  const Icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle
  };

  const Icon = Icons[toast.type] || Info;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl transition-all duration-300 animate-slide-in ${styles[toast.type] || styles.info}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-semibold">{toast.message}</span>
    </div>
  );
};

export const AppShell = ({ children }) => {
  const { currentRoute } = useApp();

  const publicRoutes = ['/', '/login', '/register', '/otp-auth'];
  const isPublicRoute = publicRoutes.includes(currentRoute);

  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] text-slate-900 font-sans selection:bg-purple-700 selection:text-white">
        {children}
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8F9FD] text-slate-900 font-sans selection:bg-purple-700 selection:text-white">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Top Header */}
        <TopHeader />

        {/* Dynamic Page Routing Slot */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <Toast />
    </div>
  );
};
