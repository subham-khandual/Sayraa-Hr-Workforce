import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, FileText, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export const OfferLetterPage = () => {
  const { routeParams, navigateTo, currentUser, showToast } = useApp();
  const { appId } = routeParams;

  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    if (!appId) {
      showToast('Invalid offer link', 'error');
      navigateTo('/dashboard');
      return;
    }

    const mockOffer = {
      candidateName: currentUser?.name || 'Candidate',
      jobTitle: 'MERN Stack Developer',
      department: 'Engineering',
      startDate: '2026-09-15',
      salary: '₹8 - 12 LPA',
      location: 'Bhubaneswar (Hybrid)',
      offerId: appId
    };
    setOffer(mockOffer);
  }, [appId, currentUser, navigateTo, showToast]);

  const handleAccept = async () => {
    if (!appId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/v1/applications/${appId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'Hired', reason: 'Offer accepted by candidate via email link' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to accept offer');
      
      setIsAccepted(true);
      showToast('🎉 Offer accepted successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to accept offer', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!offer) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading offer letter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo('/dashboard')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-outfit text-slate-100">Offer Letter</h1>
          <p className="text-xs text-slate-400">Review and accept your job offer</p>
        </div>
      </div>

      <div className="glass-panel p-5 sm:p-8 rounded-3xl border border-slate-900 bg-slate-950/20 space-y-6">
        {/* Header Card */}
        <div className="bg-[#2E0854] rounded-2xl p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-purple-800/50 border border-purple-400/30 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-purple-200" />
          </div>
          <h2 className="font-outfit font-extrabold text-lg sm:text-xl text-white tracking-wider uppercase">
            SAYRAA AI HR
          </h2>
          <div className="inline-block px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/30 text-[10px] font-extrabold text-purple-200 tracking-widest uppercase">
            Job Offer
          </div>
        </div>

        {/* Salutation */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-100">
            Dear <span className="font-bold">{offer.candidateName}</span>,
          </p>
          <p>
            We are pleased to extend an offer for the position of <strong className="text-purple-300">{offer.jobTitle}</strong> at Sayraa Technologies.
            Please review the details below and accept the offer to proceed with the onboarding process.
          </p>
        </div>

        {/* Offer Details */}
        <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-4 sm:p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Offer Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Candidate</span>
              <span className="font-semibold text-slate-200">{offer.candidateName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Role</span>
              <span className="font-semibold text-slate-200">{offer.jobTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Department</span>
              <span className="font-semibold text-slate-200">{offer.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Start Date</span>
              <span className="font-semibold text-slate-200">{offer.startDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Salary</span>
              <span className="font-semibold text-slate-200">{offer.salary}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Location</span>
              <span className="font-semibold text-slate-200">{offer.location}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isAccepted ? (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigateTo('/dashboard')}
              className="flex-1 py-3 border border-slate-700 hover:bg-slate-900 text-slate-300 text-xs sm:text-sm font-bold rounded-xl transition"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Accept Offer
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-300">Offer Accepted!</h3>
              <p className="text-xs text-slate-400 mt-1">Welcome to Sayraa Technologies. HR will contact you shortly with onboarding details.</p>
            </div>
            <button
              onClick={() => navigateTo('/dashboard')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Security Note */}
        <div className="flex items-start gap-2 p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
          <Shield className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            This offer is confidential and intended only for the named candidate. If you received this in error, please contact hr@sayraa.ai immediately.
          </p>
        </div>
      </div>
    </div>
  );
};