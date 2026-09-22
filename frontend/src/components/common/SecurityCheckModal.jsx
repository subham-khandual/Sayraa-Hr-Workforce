import React, { useState, useEffect, useRef } from 'react';
import { Lock, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SecurityCheckModal = ({ 
  isOpen, 
  onSuccess, 
  onCancel, 
  actionTitle = 'assessment', 
  targetEmail
}) => {
  const { currentUser, showToast, sendOTP, verifyOTP } = useApp();
  const email = targetEmail || currentUser?.email || 'subham@gmail.com';
  
  const maskEmail = (em) => {
    if (!em) return 'subham***@gmail.com';
    const parts = em.split('@');
    if (parts.length !== 2) return em;
    const name = parts[0];
    const visibleLen = Math.min(6, Math.max(3, Math.floor(name.length / 2)));
    return `${name.substring(0, visibleLen)}***@`;
  };

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [demoCode, setDemoCode] = useState('471829');
  
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      sendCode();
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const sendCode = async () => {
    setCanResend(false);
    setCountdown(45);
    setErrorMsg('');
    try {
      const res = await sendOTP(currentUser?.email || email, 'login');
      if (res && res.code) {
        setDemoCode(res.code);
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleDigitChange = (index, value) => {
    const char = value.slice(-1);
    if (!char && value === '') {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);
    setErrorMsg('');

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (pasteData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pasteData.length; i++) {
        newDigits[i] = pasteData[i];
      }
      setOtpDigits(newDigits);
      if (pasteData.length === 6) {
        inputRefs.current[5]?.focus();
      } else {
        inputRefs.current[pasteData.length]?.focus();
      }
    }
  };

  const handleAutoFillDemo = () => {
    const chars = demoCode.split('');
    const newDigits = [...otpDigits];
    chars.forEach((c, idx) => {
      if (idx < 6) newDigits[idx] = c;
    });
    setOtpDigits(newDigits);
    setErrorMsg('');
  };

  const handleVerify = async () => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter the full 6-digit code');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');
    try {
      const verified = await verifyOTP(currentUser?.email || email, fullOtp);
      if (verified) {
        showToast('Identity verified successfully! Starting session.', 'success');
        onSuccess();
      } else {
        setErrorMsg('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  const formattedTime = `${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-md w-full p-8 sm:p-10 border border-slate-200/90 shadow-2xl space-y-6 relative">
        
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 border-4 border-purple-50 flex items-center justify-center text-[#2E0854] shadow-sm">
            <Lock className="w-7 h-7 stroke-[2.2]" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="font-outfit text-2xl font-extrabold text-slate-900 tracking-tight">
            Security Check
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
            We've sent a 6-digit verification code to <br />
            <strong className="font-bold text-slate-900">{maskEmail(email)}</strong>
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputRefs.current[idx] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleDigitChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold font-outfit rounded-2xl border-2 border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all outline-none"
              />
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="text-[11px] text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full font-semibold transition border border-purple-200"
            >
              Demo Code: <span className="font-bold tracking-widest">{demoCode}</span> (Click to auto-fill)
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-500 text-center font-semibold">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="text-center text-xs text-slate-500">
          Didn't receive code?{' '}
          {canResend ? (
            <button
              type="button"
              onClick={sendCode}
              className="font-bold text-[#2E0854] hover:underline inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Resend Code
            </button>
          ) : (
            <span className="font-semibold text-purple-700">Resend in {formattedTime}</span>
          )}
        </div>

        <button
          type="button"
          disabled={isVerifying}
          onClick={handleVerify}
          className="w-full py-4 bg-[#2E0854] hover:bg-[#3B0764] text-white font-bold rounded-2xl text-sm transition shadow-lg shadow-purple-950/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
        >
          {isVerifying ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Identity...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-3 text-left">
          <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-rose-900 block">Important Notice</span>
            <p className="text-[11px] text-rose-700 leading-relaxed font-normal">
              Do not switch tabs or leave this window. Doing so will automatically submit your {actionTitle} and end the session.
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            Cancel and Return
          </button>
        )}
      </div>
    </div>
  );
};
