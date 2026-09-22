import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, TrendingUp, Sparkles, ArrowRight, RefreshCw, BarChart2, Lightbulb, Star } from 'lucide-react';

export const ResultsPage = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── HEADER ── */}
      <div className="space-y-1">
        <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Your AI Resume Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Sayraa has analyzed your profile and identified your strengths.
        </p>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Overall Score Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#2E0854"
                  strokeWidth="10"
                  strokeDasharray="314.15"
                  strokeDashoffset="25.13" /* 92% filled */
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-outfit font-extrabold text-2xl text-slate-900 leading-tight">92%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">PROFILE MATCH</span>
              </div>
            </div>

            {/* Score Meta Details */}
            <div className="space-y-3 text-center sm:text-left">
              <h2 className="font-outfit text-lg font-bold text-slate-900">
                Excellent Profile Strength
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                Your resume demonstrates strong technical proficiency and relevant experience. The structure is well-formatted, making it highly readable for ATS systems.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ATS Optimized
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" /> Top 10% Match
                </span>
              </div>
            </div>
          </div>

          {/* Grid for Detailed Breakdown & Strengths/Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Detailed Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-800">
                <BarChart2 className="w-4 h-4 text-purple-700" />
                <h3 className="font-outfit text-sm font-bold">detailed Breakdown</h3>
              </div>

              <div className="space-y-3.5 pt-1">
                {[
                  { label: 'Technical Skills', pct: 95, color: 'bg-emerald-500' },
                  { label: 'Project Experience', pct: 94, color: 'bg-emerald-500' },
                  { label: 'Resume Quality', pct: 90, color: 'bg-purple-900' },
                  { label: 'Experience', pct: 88, color: 'bg-purple-900' },
                  { label: 'Education', pct: 85, color: 'bg-purple-700' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-slate-900 font-bold">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.color} transition-all duration-700`} 
                        style={{ width: `${item.pct}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Strengths & Areas to Improve Stack */}
            <div className="space-y-6">
              {/* Key Strengths */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Star className="w-4 h-4" />
                  <h3 className="font-outfit text-sm font-bold text-slate-800">Key Strengths</h3>
                </div>

                <ul className="space-y-2.5 pt-1">
                  {[
                    'Strong MERN Stack skills demonstrated across multiple projects.',
                    'Relevant project experience aligning with target roles.',
                    'Good JavaScript knowledge fundamentals.',
                    'Solid full-stack development lifecycle understanding.'
                  ].map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-normal">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500" />
                <div className="flex items-center gap-2 text-amber-800 pl-1">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h3 className="font-outfit text-sm font-bold text-slate-800">Areas to Improve</h3>
                </div>

                <ul className="space-y-2.5 pt-1 pl-1">
                  {[
                    'Add more measurable achievements (e.g., "improved performance by 20%").',
                    'Highlight cloud or deployment experience (AWS, Docker).',
                    'Include explicit links to live projects or GitHub repositories.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden sticky top-28 space-y-6">
          {/* Top Gradient Banner with Avatar */}
          <div className="bg-[#2E0854] p-6 text-center text-white relative">
            <div className="w-20 h-20 rounded-full mx-auto relative mb-3 border-2 border-purple-300 shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80" 
                alt="Sayraa AI" 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <h3 className="font-outfit font-extrabold text-lg text-white">Sayraa AI Insight</h3>
            <p className="text-xs text-purple-200 font-medium">Your Smart Companion</p>
          </div>

          {/* Body Content */}
          <div className="p-6 pt-0 space-y-6">
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-xs text-slate-700 leading-relaxed italic relative">
              <span className="font-serif text-2xl text-purple-400 absolute -top-1 left-2">“</span>
              <p className="pl-4">
                Your profile is a strong match for <strong className="text-purple-900 not-italic font-bold">Full Stack</strong> and <strong className="text-purple-900 not-italic font-bold">MERN Stack Developer</strong> opportunities. I recommend reviewing your active applications or exploring new matching roles.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button 
                onClick={() => navigateTo('/jobs')}
                className="w-full py-3.5 bg-[#2E0854] hover:bg-[#3B0764] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-purple-950/20 active:scale-[0.99]"
              >
                Explore Matching Jobs <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => navigateTo('/resume')}
                className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                Update Resume
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

