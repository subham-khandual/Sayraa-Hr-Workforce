import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Check, X, ShieldAlert, FileText, AlertCircle } from 'lucide-react';

export const HRReviewPage = () => {
  const { routeParams, navigateTo, getEvaluation, applications, candidates, jobs, submitReview } = useApp();
  const { applicationId } = routeParams;

  const [evaluation, setEvaluation] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Review Form States
  const [recommendation, setRecommendation] = useState('Approve'); // Approve, Reject, Escalate
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!applicationId) {
      navigateTo('/pipeline');
      return;
    }

    const loadData = async () => {
      try {
        const app = applications.find(a => a._id === applicationId);
        if (app) {
          const cand = candidates.find(c => c._id === app.candidateId);
          const j = jobs.find(x => x._id === app.jobId);
          setCandidate(cand);
          setJob(j);
        }

        const data = await getEvaluation(applicationId);
        if (data) {
          setEvaluation(data);
        }
      } catch (err) {
        console.error('Failed to load scorecard in review:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [applicationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    await submitReview(applicationId, recommendation, notes);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-semibold">Loading review workspace...</span>
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
          <h1 className="text-xl font-bold font-outfit text-slate-100">HR Review Workspace</h1>
          <p className="text-xs text-slate-400">Human-in-the-loop candidate screening evaluation checkpoint.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: AI Scorecard Recap (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-5">
          <div className="pb-3 border-b border-slate-900">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Applicant Profile</span>
            <h3 className="text-base font-bold text-slate-200">{candidate?.name}</h3>
            <span className="text-xs text-indigo-400 mt-0.5 block">{job?.title}</span>
          </div>

          {evaluation ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">AI Scoring Metrics</span>
                <div className="flex justify-between items-center bg-slate-900/60 border border-slate-850 p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Overall Match Rating</span>
                    <span className="text-2xl font-bold font-outfit text-slate-100">{evaluation.overallScore}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Confidence Rating</span>
                    <span className="text-xs font-bold text-indigo-400">{evaluation.confidenceRating}%</span>
                  </div>
                </div>
              </div>

              {/* Sub criteria */}
              <div className="space-y-2.5">
                {evaluation.criteria?.map(crit => (
                  <div key={crit.name} className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">{crit.name}</span>
                    <span className="font-bold text-slate-200">{crit.score}%</span>
                  </div>
                ))}
              </div>

              {/* Low confidence warning */}
              {evaluation.confidenceRating < 80 && (
                <div className="p-3 bg-amber-950/30 border border-amber-900/50 text-amber-400 rounded-xl flex gap-2 text-[10px] leading-relaxed">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>AI evaluation confidence is low. Stage escalation to a second reviewer is highly recommended.</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No AI screening score generated yet.</p>
          )}
        </div>

        {/* Right Column: Human Review Form (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-900 bg-slate-950/20 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="font-outfit text-sm font-bold text-slate-300 uppercase tracking-wider">HR Decision Recommendation Form</h3>
            
            {/* Outcome Selection Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">Select Review Outcome</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'Approve', label: 'Approve', desc: 'Move to Offer stage', color: 'border-emerald-900/40 hover:bg-emerald-950/10 text-emerald-400' },
                  { value: 'Reject', label: 'Decline', desc: 'Decline application', color: 'border-rose-900/40 hover:bg-rose-950/10 text-rose-400' },
                  { value: 'Escalate', label: 'Escalate', desc: 'Request second audit', color: 'border-amber-900/40 hover:bg-amber-950/10 text-amber-400' }
                ].map(opt => {
                  const isSelected = recommendation === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRecommendation(opt.value)}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-600' 
                          : `bg-slate-900/60 ${opt.color}`
                      }`}
                    >
                      <span className="text-xs font-bold">{opt.label}</span>
                      <span className={`text-[9px] ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400">Review Notes & Decision Rationale</label>
              <textarea
                rows={5}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document your review notes, verification findings, and hiring rationale here (required)..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={!notes.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition text-sm shadow-lg shadow-indigo-600/10 disabled:opacity-50"
            >
              Confirm & Submit Decision
            </button>
          </form>

          <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-2xl flex gap-3 text-slate-500 text-[10px] leading-relaxed mt-6">
            <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              By submitting this form, your username, decision, timestamp, and audit trail reasoning notes will be permanently logged under the application compliance ledger.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
