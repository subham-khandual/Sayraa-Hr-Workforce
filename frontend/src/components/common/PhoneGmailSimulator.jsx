import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Archive, 
  Trash2, 
  Mail, 
  MoreVertical, 
  Reply, 
  Forward, 
  FileText, 
  Sparkles, 
  Clock, 
  Video, 
  Shield, 
  ExternalLink, 
  Smartphone, 
  X, 
  CheckCircle2, 
  Wifi, 
  Battery, 
  Signal, 
  Search 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PhoneGmailSimulator = ({ isOpen, onClose }) => {
  const { 
    gmailEmails, 
    currentUser, 
    navigateTo, 
    showToast, 
    acceptOffer 
  } = useApp();

  const [activeEmailId, setActiveEmailId] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox', 'detail'

  // Selected email or default to first email
  const currentEmail = gmailEmails.find(e => e.id === activeEmailId) || gmailEmails[0];

  if (!isOpen) return null;

  const handleOpenEmail = (emailItem) => {
    setActiveEmailId(emailItem.id);
    setActiveTab('detail');
  };

  const handleActionClick = (email) => {
    if (email.type === 'assessment') {
      navigateTo('/assessment', { appId: email.appId, jobId: email.jobId });
      showToast('Opening Assessment Test with Security Verification...');
      onClose();
    } else if (email.type === 'interview') {
      navigateTo('/interview', { applicationId: email.appId, candidateId: email.candidateId || 'cand-1', jobId: email.jobId });
      showToast('Opening AI Video Interview with Security Verification...');
      onClose();
    } else if (email.type === 'offer') {
      if (acceptOffer) acceptOffer(email.appId);
      showToast('🎉 Congratulations! Offer Letter Accepted successfully!', 'success');
      navigateTo('/dashboard');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Container simulating smartphone device frame */}
      <div className="relative max-w-sm w-full bg-slate-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-600/40">
        
        {/* Phone Speaker & Camera Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 z-20">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-10 h-1 rounded-full bg-slate-850" />
        </div>

        {/* Close Button on Top Right Corner outside frame */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 p-2 bg-white text-slate-800 rounded-full shadow-lg hover:bg-slate-100 transition z-30"
          title="Close Phone View"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Inner Phone Screen */}
        <div className="bg-[#F8F9FA] rounded-[38px] overflow-hidden flex flex-col h-[700px] text-slate-900 relative">
          
          {/* Status Bar */}
          <div className="px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 bg-[#F8F9FA]">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* ── INBOX LIST VIEW ── */}
          {activeTab === 'inbox' ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Gmail Top Bar */}
              <div className="p-3 bg-white border-b border-slate-200 shadow-sm flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-2xl text-xs text-slate-500">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Search in mail</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center">
                  {(currentUser?.name || 'S')[0]}
                </div>
              </div>

              {/* Inbox Label */}
              <div className="px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Primary Inbox ({gmailEmails.length})
              </div>

              {/* Email List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {gmailEmails.map((email) => (
                  <div 
                    key={email.id}
                    onClick={() => handleOpenEmail(email)}
                    className="p-4 hover:bg-purple-50/50 cursor-pointer transition flex items-start gap-3 bg-white"
                  >
                    <div className="w-9 h-9 rounded-full bg-purple-800 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                      S
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {email.sender}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {email.time || '10:30 AM'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-purple-950 truncate">
                        {email.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate leading-snug">
                        {email.preview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ── EMAIL DETAIL VIEW (Exact Match to Mockups) ── */
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              
              {/* Gmail Action Header */}
              <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-slate-700">
                <button 
                  onClick={() => setActiveTab('inbox')}
                  className="p-1 hover:bg-slate-100 rounded-full transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 text-slate-600">
                  <Archive className="w-4 h-4" />
                  <Trash2 className="w-4 h-4" />
                  <Mail className="w-4 h-4" />
                  <MoreVertical className="w-4 h-4" />
                </div>
              </div>

              {/* Email Content Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-800">
                
                {/* Subject Line */}
                <div className="space-y-1">
                  <h2 className="font-outfit text-base font-extrabold text-slate-900 leading-snug">
                    {currentEmail.subject}
                  </h2>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                    Inbox
                  </span>
                </div>

                {/* Sender Info */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-purple-800 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      S
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {currentEmail.sender}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        to me ▾
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {currentEmail.time || '10:30 AM'}
                  </span>
                </div>

                {/* ── PURPLE EMAIL HERO CARD ── */}
                <div className="rounded-2xl overflow-hidden border border-purple-900 shadow-sm bg-[#2E0854] text-white text-center py-6 px-4 space-y-1.5">
                  <h3 className="font-outfit font-extrabold text-lg tracking-wider uppercase">
                    SAYRAA {currentEmail.type === 'offer' ? 'AI' : ''}
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/30 text-[10px] font-extrabold text-purple-200 tracking-widest uppercase">
                    {currentEmail.badgeTitle}
                  </div>
                </div>

                {/* Greeting & Body */}
                <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                  <p className="font-semibold text-slate-900">
                    Dear <span className="font-bold">{currentUser?.name || currentEmail.candidateName || 'Subham khandual'}</span>,
                  </p>
                  <p>
                    {currentEmail.bodyText}
                  </p>

                  {/* Dynamic Inner Cards depending on email type */}
                  {currentEmail.type === 'offer' && (
                    <div className="p-4 bg-slate-50 border-l-4 border-purple-900 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-purple-950 text-xs">
                        <FileText className="w-3.5 h-3.5 text-purple-900" />
                        <span>Offer Summary</span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[9px]">Candidate</span>
                          <span className="font-semibold text-slate-800">{currentUser?.name || 'Subham khandual'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[9px]">Role</span>
                          <span className="font-semibold text-slate-800">{currentEmail.jobTitle || 'Frontend Developer Intern'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[9px]">Department</span>
                          <span className="font-semibold text-slate-800">{currentEmail.department || 'Developer'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[9px]">Start Date</span>
                          <span className="font-semibold text-slate-800">{currentEmail.startDate || '2026-08-24'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentEmail.type === 'interview' && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                        <span>Interview Details</span>
                      </div>
                      <div className="space-y-2 text-[11px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase">Duration</span>
                            <span className="font-semibold text-slate-800">15–20 minutes</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                            <Video className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase">Format</span>
                            <span className="font-semibold text-slate-800">AI-led video session</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase">Expiry</span>
                            <span className="font-semibold text-slate-800">Link valid for 72 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Primary Purple Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleActionClick(currentEmail)}
                      className="w-full py-3.5 bg-[#2E0854] hover:bg-[#3B0764] text-white font-bold rounded-2xl text-xs transition shadow-lg shadow-purple-950/20 active:scale-[0.99] cursor-pointer"
                    >
                      {currentEmail.buttonLabel || 'Start Now'}
                    </button>
                  </div>

                  {/* Direct clickable link (for Assessment) */}
                  {currentEmail.type === 'assessment' && (
                    <div className="text-center pt-1 space-y-1">
                      <span className="text-[10px] text-slate-400 block">Or copy this unique link:</span>
                      <button 
                        onClick={() => handleActionClick(currentEmail)}
                        className="text-[10px] text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl font-mono block w-full truncate border border-purple-200 text-center"
                      >
                        https://hr.sayraa.app/assessment?appId={currentEmail.appId || 'app-1'}
                      </button>
                    </div>
                  )}

                  {/* PDF Attachment (for Offer Letter) */}
                  {currentEmail.type === 'offer' && (
                    <div className="pt-2 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        1 Attachment
                      </span>
                      <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-sm">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-xs">
                          PDF
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-slate-800 block truncate">
                            Offer_Letter_{currentUser?.name?.split(' ')[0] || 'Subham'}.pdf
                          </span>
                          <span className="text-[10px] text-slate-400">245 KB</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Signoff */}
                  <div className="pt-4 border-t border-slate-100 space-y-0.5 text-slate-600">
                    <p className="text-[11px]">Warm regards,</p>
                    <p className="text-xs font-bold text-[#2E0854]">
                      {currentEmail.sender}
                    </p>
                  </div>
                </div>

                {/* Footer Quote */}
                <div className="p-3 rounded-xl bg-slate-100 text-center text-[10px] text-slate-500">
                  <span className="font-semibold block">One Intelligence. Infinite Solutions.</span>
                  <span>© 2026 Sayraa AI. All rights reserved.</span>
                </div>

                {/* Reply / Forward Bottom Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button className="py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition">
                    <Reply className="w-3.5 h-3.5" /> Reply
                  </button>
                  <button className="py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition">
                    <Forward className="w-3.5 h-3.5" /> Forward
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
