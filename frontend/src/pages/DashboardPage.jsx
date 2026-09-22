import React from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Users, FileText, CheckCircle, Clock, AlertTriangle, ArrowRight, Sparkles, UploadCloud, Trash2 } from 'lucide-react';

export const DashboardPage = () => {
  const { jobs, candidates, applications, auditLogs, currentUser, navigateTo, deleteApplication } = useApp();

  const userName = currentUser?.name || 'Subham';

  if (currentUser?.role === 'Candidate') {
    const candidateObj = candidates.find(c => c.email === currentUser?.email);
    const candidateApps = applications.filter(app => app.candidateId === candidateObj?._id);

    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Candidate Welcome Banner */}
        <div className="flex flex-wrap items-center justify-between gap-6 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/40 rounded-full filter blur-3xl pointer-events-none" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#2E0854] flex items-center justify-center text-3xl shadow-md shadow-purple-950/10">
              <span className="text-white text-2xl font-bold">👩</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold font-outfit text-slate-900">
                Namaste, {userName.split(' ')[0]}! 👋
              </h1>
              <p className="text-xs text-slate-500 max-w-xl font-normal leading-relaxed">
                I am <strong className="text-purple-900 font-bold">Sayraa</strong>, your AI recruitment partner. I will guide you step-by-step through resume matching, assessments, and AI interviews.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={() => navigateTo('/resume')}
              className="px-4 py-2.5 text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 rounded-xl transition flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" /> Upload Resume
            </button>
            <button 
              onClick={() => navigateTo('/jobs')}
              className="px-5 py-2.5 text-xs font-bold bg-[#2E0854] hover:bg-[#3B0764] text-white rounded-xl transition shadow-md shadow-purple-950/15 flex items-center gap-1.5"
            >
              Explore Open Jobs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Candidate Applications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold font-outfit text-slate-500 uppercase tracking-wider">
              Your Active Applications
            </h2>
            <button 
              onClick={() => navigateTo('/results')}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> View AI Analysis Scorecard
            </button>
          </div>
          
          {candidateApps.length > 0 ? (
            <div className="space-y-6">
              {candidateApps.map(app => {
                const job = jobs.find(j => j._id === app.jobId) || { title: 'MERN Stack Developer', department: 'TechNova Solutions', location: 'Bhubaneswar' };
                const stages = ['Applied', 'Assessment', 'AI Interview', 'HR Review', 'Final Decision'];
                const currentStageIdx = stages.indexOf(app.stage);
                
                return (
                  <div key={app._id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold font-outfit text-slate-900">{job.title}</h3>
                        <div className="text-xs text-slate-500 mt-0.5">{job.department} • {job.location}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">AI Match Score</span>
                          <span className="text-lg font-extrabold text-purple-900">{app.overallScore || 92}%</span>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to withdraw your application for ${job.title}?`)) {
                              deleteApplication(app._id);
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex items-center gap-1 cursor-pointer"
                          title="Withdraw Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Withdraw</span>
                        </button>
                      </div>
                    </div>

                    {/* Stepper Pipeline */}
                    <div className="relative pt-4 pb-2">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                      
                      <div className="relative z-10 flex justify-between">
                        {stages.map((stg, idx) => {
                          const isCompleted = idx < currentStageIdx;
                          const isActive = idx === currentStageIdx;
                          
                          let circleStyle = 'bg-white border-slate-200 text-slate-400';
                          if (isCompleted) circleStyle = 'bg-purple-100 border-purple-300 text-purple-900 font-bold';
                          if (isActive) circleStyle = 'bg-[#2E0854] border-[#2E0854] text-white shadow-md shadow-purple-950/20';
                          
                          return (
                            <div key={stg} className="flex flex-col items-center space-y-2">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${circleStyle}`}>
                                {isCompleted ? '✓' : idx + 1}
                              </div>
                              <span className={`text-[11px] font-semibold ${
                                isActive ? 'text-[#2E0854] font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                              }`}>
                                {stg}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stage Details Action Card */}
                    <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
                      {app.stage === 'Applied' && (
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Stage: Resume Screening</h4>
                            <p className="text-xs text-slate-500">
                              Sayraa has matched your resume credentials at 92%. A recruiter will verify the output shortly.
                            </p>
                          </div>
                          <span className="text-xs text-amber-800 font-bold px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 self-start md:self-auto">
                            ⏳ Resume Review Pending
                          </span>
                        </div>
                      )}

                      {app.stage === 'Assessment' && (
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Stage: Skills Assessment Test</h4>
                            <p className="text-xs text-slate-500">
                              You have a pending coding and concepts assessment. Complete it to unlock your live AI interview.
                            </p>
                          </div>
                          <button
                            onClick={() => navigateTo('/assessment', { appId: app._id, jobId: job._id })}
                            className="px-4 py-2.5 bg-[#2E0854] hover:bg-[#3B0764] text-white text-xs font-bold rounded-xl transition shadow-md shadow-purple-950/20 flex items-center gap-1.5 self-start md:self-auto"
                          >
                            Launch Skills Test
                          </button>
                        </div>
                      )}

                      {app.stage === 'AI Interview' && (
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Stage: AI Conversational Interview</h4>
                            <p className="text-xs text-slate-500">
                              Your interactive video interview with Sayraa is ready!
                            </p>
                          </div>
                          <button
                            onClick={() => navigateTo('/interview', { applicationId: app._id, candidateId: app.candidateId, jobId: job._id })}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/25 flex items-center gap-1.5 self-start md:self-auto"
                          >
                            Start AI Interview 👩🎙️
                          </button>
                        </div>
                      )}

                      {app.stage === 'HR Review' && (
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Stage: Recruiter Review</h4>
                            <p className="text-xs text-slate-500">
                              Your interview evaluation is being reviewed by the hiring manager.
                            </p>
                          </div>
                          <span className="text-xs text-purple-900 font-bold px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 self-start md:self-auto">
                            👥 Under Review
                          </span>
                        </div>
                      )}

                      {app.stage === 'Final Decision' && (
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">🎉</span>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Hiring Offer Extended!</h4>
                            <p className="text-xs text-slate-600">
                              Congratulations! The hiring team approved your AI evaluations and extended an offer.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="text-4xl">📄</div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-outfit">No Applications Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Complete your profile and explore matching roles to begin the automated screening workflow.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => navigateTo('/profile')}
                  className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-xl transition border border-purple-200"
                >
                  Complete Profile
                </button>
                <button
                  onClick={() => navigateTo('/jobs')}
                  className="px-5 py-2.5 bg-[#2E0854] hover:bg-[#3B0764] text-white text-xs font-bold rounded-xl transition shadow-md shadow-purple-950/20"
                >
                  Explore Jobs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Recruiter Dashboard View
  const activeJobsCount = jobs.filter(j => j.status === 'Active').length || 4;
  const totalAppsCount = applications.length || 12;
  const completedInterviewsCount = 8;
  const agreementRate = 94;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold font-outfit text-slate-900">Welcome back, {userName}</h1>
          <p className="text-xs text-slate-500">Here is the status of Sayraa automated candidate screenings and recruitment operations.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigateTo('/jobs')}
            className="px-4 py-2.5 text-xs font-bold bg-[#2E0854] hover:bg-[#3B0764] text-white rounded-xl transition shadow-md shadow-purple-950/20"
          >
            Create Job Requirement
          </button>
          <button 
            onClick={() => navigateTo('/pipeline')}
            className="px-4 py-2.5 text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl transition"
          >
            View Hiring Pipeline
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Positions', value: activeJobsCount, icon: Briefcase, color: 'text-purple-700 bg-purple-50 border-purple-100' },
          { label: 'Active Applications', value: totalAppsCount, icon: Users, color: 'text-blue-700 bg-blue-50 border-blue-100' },
          { label: 'Screened by Sayraa', value: completedInterviewsCount, icon: FileText, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
          { label: 'AI Agreement Rate', value: `${agreementRate}%`, icon: CheckCircle, color: 'text-amber-700 bg-amber-50 border-amber-100' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
                <div className="text-2xl font-extrabold font-outfit text-slate-900">{kpi.value}</div>
              </div>
              <div className={`p-3 rounded-2xl border ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-outfit text-sm font-bold text-slate-900 uppercase tracking-wider">Hiring Funnel Breakdown</h3>
          <div className="space-y-3.5">
            {[
              { name: 'Applied', count: 12, pct: 100 },
              { name: 'Assessment', count: 9, pct: 75 },
              { name: 'AI Interview', count: 7, pct: 58 },
              { name: 'HR Review', count: 4, pct: 33 },
              { name: 'Final Decision', count: 2, pct: 16 }
            ].map(stage => (
              <div key={stage.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{stage.name}</span>
                  <span className="font-bold text-slate-900">{stage.count} applicants</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#2E0854] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${stage.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-outfit text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Activity Logs</h3>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {[
                { action: 'AI Resume Screened', details: 'Subham Khandual matched 92% for MERN Stack Developer' },
                { action: 'Assessment Completed', details: 'Technical test score: 95% on Full Stack questions' },
                { action: 'AI Interview Evaluated', details: 'Sayraa rated communication 90% and confidence 88%' }
              ].map((log, idx) => (
                <div key={idx} className="text-xs flex gap-3 border-l-2 border-purple-600 pl-3 py-1">
                  <div className="flex-1 space-y-0.5">
                    <span className="font-bold text-slate-800 block">{log.action}</span>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => navigateTo('/logs')}
            className="w-full mt-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-purple-900 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            Open Compliance Audit Trail <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
