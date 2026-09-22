import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UploadCloud, CheckCircle, Trash2, Bot, Sparkles, FileText, Loader2 } from 'lucide-react';

export const ResumeUploadPage = () => {
  const { navigateTo, showToast } = useApp();
  const [fileUploaded, setFileUploaded] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState('Subham_Khandual_Resume.pdf');
  const [fileSize, setFileSize] = useState('1.2 MB');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setFileUploaded(true);
      showToast('Resume uploaded successfully!');
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      showToast('Resume analysis complete!');
      navigateTo('/results');
    }, 2200);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
      {/* ── MAIN RESUME UPLOAD CARD ── */}
      <div className="w-full bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-md space-y-8">
        
        {/* Title & Subtitle */}
        <div className="text-center space-y-2">
          <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Upload Your Resume
          </h1>
          <p className="text-sm text-slate-500 font-normal max-w-md mx-auto">
            Upload your resume and let Sayraa AI understand your professional profile.
          </p>
        </div>

        {/* ── DRAG & DROP ZONE ── */}
        <label className="block cursor-pointer">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <div className="border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/20 hover:bg-purple-50/40 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition group">
            <div className="w-14 h-14 rounded-full bg-purple-100/80 group-hover:bg-purple-200 text-purple-700 flex items-center justify-center mb-4 transition shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>

            <p className="text-base font-bold text-slate-800">
              Drag & Drop your resume here
            </p>
            <p className="text-xs text-purple-700 font-semibold mt-1">
              or <span className="underline">browse files</span>
            </p>

            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium mt-6">
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-slate-400" /> PDF</span>
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-slate-400" /> DOC</span>
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-slate-400" /> DOCX</span>
            </div>
          </div>
        </label>

        {/* ── UPLOADED FILE ITEM ── */}
        {fileUploaded && (
          <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl flex items-center justify-between transition animate-fade-in">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block truncate max-w-[240px] sm:max-w-sm">
                  {fileName}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600">
                  Uploaded Successfully <span className="text-slate-400 font-normal">• {fileSize}</span>
                </span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setFileUploaded(false)}
              className="p-2 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-white"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── AI ANALYZING SPINNER ── */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-4 space-y-3 animate-fade-in">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-3 border-purple-200 border-t-purple-800 animate-spin" />
              <Bot className="w-5 h-5 text-purple-900 absolute" />
            </div>
            <p className="text-xs font-semibold text-purple-900 animate-pulse">
              Sayraa is analyzing your resume...
            </p>
          </div>
        )}

        {/* ── PRIMARY CTA BUTTON ── */}
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!fileUploaded || isAnalyzing}
          className={`w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition shadow-lg ${
            !fileUploaded || isAnalyzing
              ? 'bg-purple-900/50 cursor-not-allowed'
              : 'bg-[#2E0854] hover:bg-[#3B0764] shadow-purple-950/20 active:scale-[0.99]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Resume...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-purple-300" /> Analyze Resume
            </>
          )}
        </button>

      </div>
    </div>
  );
};

