import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { ShieldCheck, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

export const AnalyticsPage = () => {
  const { applications } = useApp();

  const funnelData = [
    { name: 'Applied', candidates: 120, fill: '#6366f1' },
    { name: 'Assessments', candidates: 74, fill: '#818cf8' },
    { name: 'AI Interview', candidates: 42, fill: '#4f46e5' },
    { name: 'HR Review', candidates: 18, fill: '#06b6d4' },
    { name: 'Selected', candidates: 6, fill: '#10b981' }
  ];

  const trendData = [
    { name: 'Jan', applications: 40, hires: 2 },
    { name: 'Feb', applications: 55, hires: 4 },
    { name: 'Mar', applications: 70, hires: 3 },
    { name: 'Apr', applications: 62, hires: 5 },
    { name: 'May', applications: 90, hires: 7 },
    { name: 'Jun', applications: 110, hires: 8 }
  ];

  const agreementData = [
    { name: 'Agreement', value: 92, label: 'AI & Recruiter Agree' },
    { name: 'Override (Decline)', value: 5, label: 'Human Overrode AI Approve' },
    { name: 'Override (Approve)', value: 3, label: 'Human Overrode AI Decline' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-outfit text-slate-100">Recruitment Analytics</h1>
        <p className="text-sm text-slate-400">Detailed hiring funnel metrics, historical trends, and decision oversight analytics.</p>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Funnel Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-850 bg-slate-950/20 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-outfit text-sm font-bold text-slate-350 uppercase tracking-wider">Hiring Funnel Volume</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="candidates" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Area Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-850 bg-slate-950/20 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="font-outfit text-sm font-bold text-slate-350 uppercase tracking-wider">Hiring Trend Over Time</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#6366f1" fillOpacity={0.15} fill="url(#colorApps)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="hires" stroke="#10b981" fillOpacity={0.1} fill="url(#colorHires)" strokeWidth={2.5} />
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI Decision Override Oversight */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-850 bg-slate-950/40 space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="font-outfit text-sm font-bold text-slate-350 uppercase tracking-wider">AI vs. Human Decision Oversight</h3>
        </div>

        <p className="text-xs text-slate-400 leading-normal max-w-3xl">
          Sayraa tracks the alignment rate between AI matching scores/recommendations and final human recruiter choices. 
          Discrepancies (overrides) are logged for model calibrations to prevent disparate impact and bias.
        </p>

        {/* Override Rates progress bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-900">
          {agreementData.map((item, idx) => {
            const barColors = idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-rose-500' : 'bg-amber-500';
            return (
              <div key={idx} className="space-y-2 p-4 bg-slate-900/40 border border-slate-850 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-outfit text-slate-100">{item.value}%</span>
                  <span className="text-[10px] text-slate-500">of applications</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className={`h-full rounded-full ${barColors}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
