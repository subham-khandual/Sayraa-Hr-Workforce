import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Mail, Phone, BookOpen, Building, CheckCircle, ChevronRight, User } from 'lucide-react';

export const CandidatesPage = () => {
  const { candidates, applications, jobs, navigateTo } = useApp();
  const [search, setSearch] = useState('');

  const filtered = candidates.filter(cand => 
    cand.name.toLowerCase().includes(search.toLowerCase()) ||
    cand.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const getCandidateApplications = (candId) => {
    return applications.filter(a => a.candidateId === candId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-100">Candidates Directory</h1>
          <p className="text-sm text-slate-400">View and inspect profiles parsed from uploaded resumes and applications.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or skill..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(cand => {
          const candApps = getCandidateApplications(cand._id);
          return (
            <div key={cand._id} className="glass-panel p-6 rounded-2xl border border-slate-850 flex flex-col justify-between hover:border-slate-800 transition">
              
              <div className="space-y-4">
                {/* Header Profile */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 text-lg font-bold">
                    {cand.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{cand.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{cand.email}</span>
                      </div>
                      {cand.phone && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{cand.phone}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resume Summary */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-900 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span className="truncate">{cand.education || 'CS Degree'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span className="truncate">{cand.currentCompany || 'Freelancer'}</span>
                  </div>
                </div>

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {cand.skills?.map(skill => (
                    <span key={skill} className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 font-semibold">
                      {skill}
                    </span>
                  ))}
                  {(!cand.skills || cand.skills.length === 0) && (
                    <span className="text-[10px] text-slate-600 italic">No skills listed yet</span>
                  )}
                </div>
              </div>

              {/* Active Applications list */}
              <div className="mt-6 pt-4 border-t border-slate-900 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Pipeline Applications</span>
                {candApps.map(app => {
                  const job = jobs.find(j => j._id === app.jobId);
                  return (
                    <div 
                      key={app._id}
                      onClick={() => navigateTo('/pipeline')}
                      className="flex items-center justify-between p-2 bg-slate-900/40 border border-slate-800 rounded-xl hover:bg-slate-900 cursor-pointer transition text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-300 block">{job ? job.title : 'Software Role'}</span>
                        <span className="text-[10px] text-indigo-400">Stage: {app.stage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          app.overallScore >= 80 
                            ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400' 
                            : app.overallScore >= 60 
                            ? 'bg-secondary-950/40 border border-secondary-900/20 text-secondary-500' 
                            : 'bg-amber-950/40 border border-amber-500/20 text-amber-400'
                        }`}>
                          Score: {app.overallScore}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                  );
                })}
                {candApps.length === 0 && (
                  <span className="text-xs text-slate-500 italic block">No active job applications found.</span>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
