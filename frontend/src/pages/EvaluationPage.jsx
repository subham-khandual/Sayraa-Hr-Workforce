import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowLeft, Award, HelpCircle, UserCheck } from 'lucide-react';

export const EvaluationPage = () => {
  const { routeParams, navigateTo, getEvaluation, candidates, applications, jobs } = useApp();
  const { applicationId } = routeParams;

  const [evaluation, setEvaluation] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error('Failed to load scorecard evaluation:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [applicationId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-semibold">Generating scorecard metrics...</span>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-sm text-slate-500 italic">No evaluation scorecard found for this applicant.</p>
        <button
          onClick={() => navigateTo('/pipeline')}
          className="px-4 py-2 bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-bold rounded-xl"
        >
          Return to Pipeline
        </button>
      </div>
    );
  }

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 60) return 'text-cyan-400 stroke-cyan-500';
    if (score >= 40) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-950/40 border-emerald-900/40 text-emerald-300';
    if (score >= 60) return 'bg-cyan-950/40 border-cyan-900/40 text-cyan-300';
    if (score >= 40) return 'bg-amber-950/40 border-amber-900/40 text-amber-300';
    return 'bg-rose-950/40 border-rose-900/40 text-rose-300';
  };

  const ratingRadius = 36;
  const ratingCircumference = 2 * Math.PI * ratingRadius;
  const ratingStrokeDashoffset = ratingCircumference - (evaluation.overallScore / 100) * ratingCircumference;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo('/pipeline')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-outfit text-slate-100">Candidate Evaluation Scorecard</h1>
          <p className="text-xs text-slate-400">Detailed breakdown and evaluation metrics for {candidate?.name || 'Applicant'}.</p>
        </div>
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Score circle & Criteria (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* Score Visualization */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r={ratingRadius}
                    className="stroke-slate-900"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={ratingRadius}
                    className={getScoreColor(evaluation.overallScore)}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={ratingCircumference}
                    strokeDashoffset={ratingStrokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold font-outfit text-slate-100">{evaluation.overallScore}</span>
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Match Rating</span>
                </div>
              </div>

              <div className="mt-3.5 space-y-1">
                <h3 className="font-outfit text-base font-bold text-slate-200">{candidate?.name}</h3>
                <span className="text-xs text-slate-400 block">{job?.title}</span>
              </div>
            </div>

            {/* Criteria Breakdown */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Evaluated Criteria Breakdown</h4>
              <div className="space-y-3">
                {evaluation.criteria?.map(crit => {
                  const valColor = crit.score >= 80 ? 'bg-emerald-500' : crit.score >= 60 ? 'bg-cyan-500' : crit.score >= 40 ? 'bg-amber-500' : 'bg-rose-500';
                  return (
                    <div key={crit.name} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-300">{crit.name}</span>
                        <span className="font-bold text-slate-200">{crit.score}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${valColor}`} style={{ width: `${crit.score}%` }} />
                      </div>
                      {crit.detail && <span className="text-[10px] text-slate-500 block leading-normal">{crit.detail}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Recommendation Recommendation */}
          <div className={`p-4 rounded-2xl border text-xs leading-normal mt-4 ${getScoreBg(evaluation.overallScore)}`}>
            <strong>Sayraa screening Recommendation:</strong> {evaluation.recommendation}
          </div>
        </div>

        {/* Right Card: Evidence Inspector Panel (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-900 bg-slate-950/20 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-outfit text-sm font-bold text-slate-300 uppercase tracking-wider">Evaluation Evidence logs</h3>
              <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded-md">
                Confidence: {evaluation.confidenceRating}%
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              Sayraa maps candidate ratings directly to interview transcript comments and statements. Click on quotes to trace compliance records.
            </p>

            <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1">
              {evaluation.evidence?.map(ev => (
                <div key={ev.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-indigo-400 uppercase tracking-wider">{ev.criterion}</span>
                    <span className="text-slate-500 font-semibold">{ev.source}</span>
                  </div>
                  <blockquote className="text-xs text-slate-300 italic border-l-2 border-indigo-600 pl-3 py-0.5 leading-relaxed">
                    "{ev.quote}"
                  </blockquote>
                </div>
              ))}
              {(!evaluation.evidence || evaluation.evidence.length === 0) && (
                <span className="text-xs text-slate-500 italic block text-center py-10">No transcript evidence quotes parsed.</span>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-900">
            <button
              onClick={() => navigateTo('/review', { applicationId })}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
            >
              <UserCheck className="w-4 h-4" /> Open HR Review Workspace
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
