import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, UserCheck, ShieldAlert, Award, Ban } from 'lucide-react';

export const FinalDecisionPage = () => {
  const { routeParams, navigateTo, applications, candidates, jobs, submitDecision } = useApp();
  const { applicationId } = routeParams;

  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Decision Form State
  const [status, setStatus] = useState('Hired'); // Hired, Rejected, On Hold
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!applicationId) {
      navigateTo('/pipeline');
      return;
    }

    const app = applications.find(a => a._id === applicationId);
    if (app) {
      const cand = candidates.find(c => c._id === app.candidateId);
      const j = jobs.find(x => x._id === app.jobId);
      setCandidate(cand);
      setJob(j);
    }
    setIsLoading(false);
  }, [applicationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    await submitDecision(applicationId, status, reason);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-semibold">Loading hiring manager panel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo('/pipeline')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-outfit text-slate-100">Final Hiring Decision</h1>
          <p className="text-xs text-slate-400">Record final hiring decision outcome and release feedback.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Summary Info (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-5">
          <div className="pb-3 border-b border-slate-900">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Position details</span>
            <h3 className="text-base font-bold text-slate-200">{job?.title}</h3>
            <span className="text-xs text-slate-400 mt-0.5 block">{job?.department}</span>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Candidate Profile</span>
            <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl">
              <span className="text-sm font-bold text-slate-200 block">{candidate?.name}</span>
              <span className="text-xs text-slate-400 block mt-0.5">{candidate?.email}</span>
              <span className="text-[10px] text-indigo-400 block font-semibold mt-2">Experience: {candidate?.experience || 'N/A'}</span>
            </div>
          </div>

          <div className="p-4 bg-indigo-950/20 border border-indigo-900/40 text-indigo-300 rounded-2xl flex gap-3 text-xs leading-normal">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-indigo-400" />
            <span>
              This is the final decision checkpoint. Once finalized, state transitions cannot be reversed without filing a separate amendment audit entry.
            </span>
          </div>
        </div>

        {/* Right Column: Decision Form (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-900 bg-slate-950/20 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="font-outfit text-sm font-bold text-slate-300 uppercase tracking-wider">Final Decision Form</h3>
            
            {/* Outcome Selection Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">Final Hiring Status</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'Hired', label: 'Offer / Hire', icon: UserCheck, color: 'border-emerald-900/40 hover:bg-emerald-950/10 text-emerald-400' },
                  { value: 'Rejected', label: 'Decline', icon: Ban, color: 'border-rose-900/40 hover:bg-rose-950/10 text-rose-400' },
                  { value: 'On Hold', label: 'Keep On Hold', icon: ShieldAlert, color: 'border-amber-900/40 hover:bg-amber-950/10 text-amber-400' }
                ].map(opt => {
                  const Icon = opt.icon;
                  const isSelected = status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatus(opt.value)}
                      className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-600' 
                          : `bg-slate-900/60 ${opt.color}`
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-bold">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400">Final Decision Reason & Release Feedback</label>
              <textarea
                rows={5}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the final decision reasons, strengths/weaknesses and feedback details (required)..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={!reason.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition text-sm shadow-lg shadow-indigo-600/10 disabled:opacity-50"
            >
              Submit Final Decision
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
