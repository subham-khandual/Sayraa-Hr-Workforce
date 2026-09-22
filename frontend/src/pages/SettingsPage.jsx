import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Sliders, ToggleLeft, HelpCircle } from 'lucide-react';

export const SettingsPage = () => {
  const { settings, setSettings, showToast } = useApp();

  const [atsThreshold, setAtsThreshold] = useState(settings.atsThreshold);
  const [assessThreshold, setAssessThreshold] = useState(settings.assessmentThreshold);
  const [interviewThreshold, setInterviewThreshold] = useState(settings.interviewThreshold);
  const [autoScreening, setAutoScreening] = useState(settings.autoScreening);

  const handleSave = (e) => {
    e.preventDefault();
    setSettings({
      atsThreshold,
      assessmentThreshold: assessThreshold,
      interviewThreshold,
      autoScreening
    });
    showToast('Platform scoring thresholds and screening rules saved successfully.');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-outfit text-slate-100">Platform Settings</h1>
        <p className="text-sm text-slate-400">Configure applicant screening thresholds, evaluation criteria, and automated rules.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-6 rounded-3xl border border-slate-900 bg-slate-950/20 space-y-6">
        <h3 className="font-outfit text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" /> Screening & Match Rubrics
        </h3>

        {/* ATS Threshold */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-350 flex items-center gap-1.5">
              ATS Resume Match Threshold
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" title="Minimum match percentage to auto-advance resumes." />
            </label>
            <span className="font-bold text-indigo-400">{atsThreshold}%</span>
          </div>
          <input
            type="range"
            min="40"
            max="95"
            value={atsThreshold}
            onChange={(e) => setAtsThreshold(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Assessment Pass Threshold */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-350 flex items-center gap-1.5">
              Assessment Passing Cutoff
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" title="Minimum objective assessment test score." />
            </label>
            <span className="font-bold text-indigo-400">{assessThreshold}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="90"
            value={assessThreshold}
            onChange={(e) => setAssessThreshold(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Interview Passing Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-350 flex items-center gap-1.5">
              AI Interview Match Target
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" title="Ideal overall screening interview score target." />
            </label>
            <span className="font-bold text-indigo-400">{interviewThreshold}%</span>
          </div>
          <input
            type="range"
            min="40"
            max="95"
            value={interviewThreshold}
            onChange={(e) => setInterviewThreshold(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Toggles */}
        <div className="pt-4 border-t border-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-300 block">Auto-Screen New Applications</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Parse and score resume files immediately upon submission.</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoScreening(!autoScreening)}
              className={`w-11 h-6 rounded-full transition-colors relative ${autoScreening ? 'bg-indigo-600' : 'bg-slate-900 border border-slate-800'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${autoScreening ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition text-sm shadow-lg shadow-indigo-600/10"
        >
          Save Configuration Rules
        </button>
      </form>
    </div>
  );
};
