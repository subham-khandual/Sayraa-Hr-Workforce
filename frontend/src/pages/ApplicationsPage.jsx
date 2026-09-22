import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Award, Video, Eye, ShieldAlert, Check, X, ArrowRight, UserCheck, Trash2 } from 'lucide-react';

const STAGES = [
  'Applied',
  'Assessment',
  'AI Interview',
  'HR Review',
  'Final Decision'
];

export const ApplicationsPage = () => {
  const { 
    applications, 
    candidates, 
    jobs, 
    currentUser, 
    updateApplicationStage, 
    deleteApplication,
    navigateTo 
  } = useApp();

  const [activeStageSelector, setActiveStageSelector] = useState(null);

  const getCandidateName = (candId) => {
    const cand = candidates.find(c => c._id === candId);
    return cand ? cand.name : 'Unknown Candidate';
  };

  const getJobTitle = (jobId) => {
    const job = jobs.find(j => j._id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  const handleStageChange = async (appId, nextStage) => {
    await updateApplicationStage(appId, nextStage);
    setActiveStageSelector(null);
  };

  const isRecruiter = currentUser?.role === 'Recruiter' || currentUser?.role === 'Admin' || currentUser?.role === 'Hiring Manager';

  // Filter application by user role if candidate
  const filteredApps = isRecruiter 
    ? applications 
    : applications.filter(a => {
        const cand = candidates.find(c => c._id === a.candidateId);
        return cand && cand.email === currentUser?.email;
      });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-outfit text-slate-100">Hiring Pipeline</h1>
        <p className="text-sm text-slate-400">
          {isRecruiter 
            ? 'Track candidate progress and make human-in-the-loop decisions across stages.' 
            : 'Track the status of your job applications and complete pending assessments/interviews.'}
        </p>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageApps = filteredApps.filter(a => a.stage === stage);
          return (
            <div key={stage} className="flex-1 min-w-[240px] bg-slate-900/40 border border-slate-900 rounded-2xl p-4 flex flex-col gap-4">
              
              {/* Column Header */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{stage}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-bold">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                {stageApps.map(app => {
                  const jobTitle = getJobTitle(app.jobId);
                  const candName = getCandidateName(app.candidateId);
                  
                  return (
                    <div 
                      key={app._id}
                      className="glass-panel p-4 rounded-xl border border-slate-850 space-y-3 relative hover:border-slate-800 transition"
                    >
                      {/* Top Job/Status Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-slate-200">{candName}</div>
                          <div className="text-[10px] text-slate-400 truncate">{jobTitle}</div>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove application for ${jobTitle}?`)) {
                              deleteApplication(app._id);
                            }
                          }}
                          className="text-slate-500 hover:text-rose-400 transition p-1 rounded hover:bg-slate-800/60"
                          title="Withdraw / Remove Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Scores row */}
                      <div className="flex items-center gap-2">
                        {app.atsScore > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950/40 text-indigo-400 font-bold border border-indigo-900/30">
                            ATS: {app.atsScore}%
                          </span>
                        )}
                        {app.overallScore > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 font-bold border border-emerald-900/30">
                            Overall: {app.overallScore}%
                          </span>
                        )}
                      </div>

                      {/* Actions/Status indicator */}
                      <div className="pt-2 border-t border-slate-900 flex flex-col gap-2">
                        {/* Candidate Actions */}
                        {!isRecruiter && currentUser?.role === 'Candidate' && (
                          <>
                            {stage === 'Assessment' && (
                              <button
                                onClick={() => navigateTo('/assessment', { appId: app._id, jobId: app.jobId })}
                                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition"
                              >
                                Take Assessment
                              </button>
                            )}
                            {stage === 'AI Interview' && (
                              <button
                                onClick={() => navigateTo('/interview', { applicationId: app._id, candidateId: app.candidateId, jobId: app.jobId })}
                                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <Video className="w-3 h-3" /> Start AI Interview
                              </button>
                            )}
                            {stage === 'HR Review' && (
                              <span className="text-[10px] text-slate-500 italic block text-center">Awaiting HR Panel Review</span>
                            )}
                            {stage === 'Final Decision' && (
                              <span className="text-[10px] text-slate-500 italic block text-center">Final Decision Pending</span>
                            )}
                          </>
                        )}

                        {/* Recruiter Actions */}
                        {isRecruiter && (
                          <>
                            {stage === 'HR Review' && (
                              <button
                                onClick={() => navigateTo('/review', { applicationId: app._id })}
                                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 shadow-lg shadow-indigo-600/10"
                              >
                                <Eye className="w-3 h-3" /> Review Scorecard
                              </button>
                            )}
                            {stage === 'Final Decision' && (
                              <button
                                onClick={() => navigateTo('/decision', { applicationId: app._id })}
                                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <UserCheck className="w-3 h-3" /> Finalize Offer
                              </button>
                            )}
                            
                            {/* Evaluation scorecard viewer shortcut */}
                            {app.interviewScore > 0 && (
                              <button
                                onClick={() => navigateTo('/evaluation', { applicationId: app._id })}
                                className="w-full py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-200 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                              >
                                View AI Scorecard
                              </button>
                            )}

                            {/* Keyboard-friendly Stage Selector */}
                            <div className="relative mt-1">
                              <button
                                onClick={() => setActiveStageSelector(activeStageSelector === app._id ? null : app._id)}
                                className="w-full py-1 text-slate-500 hover:text-slate-350 text-[9px] font-bold border border-slate-850 rounded hover:bg-slate-900 transition"
                              >
                                Move Stage
                              </button>
                              
                              {activeStageSelector === app._id && (
                                <div className="absolute left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-20 divide-y divide-slate-900">
                                  {STAGES.filter(s => s !== stage).map(st => (
                                    <button
                                      key={st}
                                      onClick={() => handleStageChange(app._id, st)}
                                      className="w-full px-3 py-1.5 text-left text-[10px] text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition"
                                    >
                                      To {st}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {stageApps.length === 0 && (
                  <div className="text-[10px] text-slate-600 text-center py-8 italic border border-dashed border-slate-850 rounded-xl">
                    No candidates in this stage
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
