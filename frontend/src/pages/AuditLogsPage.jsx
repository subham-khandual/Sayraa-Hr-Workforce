import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShieldAlert, FileCode2, Clock, Globe } from 'lucide-react';

export const AuditLogsPage = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase()) ||
    log.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-400" /> Compliance Audit Trail
          </h1>
          <p className="text-sm text-slate-400">Verifiable logging of all automated scoring, status changes, and human override actions.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or details..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Audit Log Table list */}
      <div className="glass-panel rounded-2xl border border-slate-900 overflow-hidden bg-slate-950/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-900/40 text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Detailed Audit Log</th>
                <th className="p-4">Initiated By</th>
                <th className="p-4 text-right">Location IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {filtered.map((log, idx) => (
                <tr key={log._id || idx} className="hover:bg-slate-900/20 transition-colors">
                  <td className="p-4 whitespace-nowrap text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-650" />
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                      log.action.includes('OVERRIDE') || log.action.includes('DECISION')
                        ? 'bg-amber-950/40 border-amber-900/30 text-amber-400'
                        : log.action.includes('SUBMIT') || log.action.includes('CREATE')
                        ? 'bg-indigo-950/40 border-indigo-900/30 text-indigo-400'
                        : 'bg-slate-900 border-slate-800 text-slate-450'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 leading-relaxed max-w-sm truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="p-4 whitespace-nowrap font-medium text-slate-200">
                    {log.user}
                  </td>
                  <td className="p-4 whitespace-nowrap text-right text-slate-500 font-mono flex items-center justify-end gap-1">
                    <Globe className="w-3 h-3 text-slate-600" />
                    {log.ip || '192.168.1.42'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 italic">
                    No matching audit ledger entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
