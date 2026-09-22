import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, Play, X, ShieldCheck, CheckCircle } from 'lucide-react';

export const ReportsPage = () => {
  const { showToast } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const reportsList = [
    { 
      id: 'rep-1', 
      title: 'EEOC Compliance & Bias Audit Report', 
      desc: 'Verifies demographic neutrality and score distribution across pipeline stages to prevent disparate impact.',
      frequency: 'Monthly',
      scope: 'All Jobs'
    },
    { 
      id: 'rep-2', 
      title: 'Candidate Evaluation Summary Pack', 
      desc: 'Export candidate interview transcripts, objective assessment outcomes, and HR review justifications.',
      frequency: 'Ad-hoc',
      scope: 'Per Application'
    },
    { 
      id: 'rep-3', 
      title: 'Screening Efficiency & Time-to-Hire', 
      desc: 'Operational summary of average candidate screening durations, ATS pass rates, and department speed comparisons.',
      frequency: 'Weekly',
      scope: 'Active Jobs'
    }
  ];

  const handleRunReport = (report) => {
    setSelectedReport(report);
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast(`${report.title} generated successfully.`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-outfit text-slate-100">Compliance & Export Reports</h1>
        <p className="text-sm text-slate-400">Generate auditable compliance summaries, EEOC bias checks, and full candidate package exports.</p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportsList.map(rep => (
          <div key={rep.id} className="glass-panel p-6 rounded-2xl border border-slate-850 flex flex-col justify-between hover:border-slate-800 transition">
            <div className="space-y-4">
              <div className="p-3 bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 rounded-xl w-fit">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-200">{rep.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{rep.desc}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-900 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Scope</span>
                <span className="text-slate-350 font-medium">{rep.scope}</span>
              </div>
              <button
                onClick={() => handleRunReport(rep)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/10"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Export Processing Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-center">
            {isExporting ? (
              <div className="py-8 space-y-4 flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Exporting report data...</h3>
                  <p className="text-xs text-slate-500 mt-1">Collecting ledger logs and verifying audit signatures.</p>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Verification Ledger Package Complete</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    The {selectedReport.title} has been compiled, sealed, and downloaded in CSV/PDF format under your local downloads directory.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-6 py-2 bg-slate-900 border border-slate-800 text-slate-350 hover:text-slate-200 text-xs font-semibold rounded-xl transition mt-4"
                >
                  Dismiss Checkpoint
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
