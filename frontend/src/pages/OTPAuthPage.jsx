import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  Sparkles,
  Loader2
} from 'lucide-react';

import sayraaLogo from '../assets/sayraa.png';

const GMAIL_REGEX = /^[A-Za-z0-9._%+-]+@gmail\.com$/;

export const OTPAuthPage = () => {
  const { login, verifyOTP, routeParams, showToast } = useApp();
  const [step, setStep] = useState(routeParams?.email ? 'otp' : 'email'); // email, otp, success
  const [email, setEmail] = useState(routeParams?.email || '');
  const [name, setName] = useState(routeParams?.name || '');
  const [password, setPassword] = useState(routeParams?.password || '');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(routeParams?.isSignUp ?? true);
  const [countdown, setCountdown] = useState(routeParams?.email ? 60 : 0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEmailValid = GMAIL_REGEX.test(email.trim().toLowerCase());

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEmailValid) {
      setError('Please enter a valid Gmail address (e.g., yourname@gmail.com).');
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), purpose: isSignUp ? 'register' : 'login' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setStep('otp');
      startCountdown();
      showToast('OTP sent to your Gmail! Check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(
        email.trim().toLowerCase(),
        otp,
        name.trim(),
        password,
        'Candidate'
      );
      setSuccess('Email verified successfully! Redirecting...');
      setStep('success');
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), purpose: isSignUp ? 'register' : 'login' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to resend OTP');
      
      setOtp('');
      startCountdown();
      showToast('New OTP sent! Check your Gmail inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setStep('email');
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white selection:bg-purple-900 selection:text-white">
      {/* LEFT HERO PANEL */}
      <div className="lg:col-span-6 bg-[#2E0854] text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/15 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white p-1 border-2 border-purple-400/30 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
            <img src={sayraaLogo} alt="Sayraa AI Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-xl tracking-tight block leading-tight">SAYRAA</span>
            <span className="text-[10px] text-purple-300 font-semibold tracking-widest uppercase block">TALENT HIRE</span>
          </div>
        </div>

        <div className="my-10 space-y-8 relative z-10">
          <div className="space-y-4">
            <h1 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Secure OTP Login<br />
              via Gmail
            </h1>
            <p className="text-sm lg:text-base text-purple-200 max-w-lg font-normal leading-relaxed">
              No password needed. We send a secure 6-digit code to your Gmail. Fast, safe, and hassle-free authentication.
            </p>
          </div>

          <div className="space-y-3">
            {[
              'Passwordless authentication',
              'OTP sent directly to your Gmail',
              'Secure 6-digit verification code',
              'Auto-login after verification',
              '10-minute code expiry',
              'Resend OTP option available'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-purple-100 font-medium">
                <CheckCircle2 className="w-5 h-5 text-purple-300 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-purple-300/80 pt-6 border-t border-purple-400/15 relative z-10">
          <p>© 2026 Sayraa Talent Hire. All rights reserved.</p>
          <p className="text-[11px] text-purple-400 mt-0.5">Secure. Transparent. Intelligent.</p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="lg:col-span-6 bg-white p-8 lg:p-16 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="space-y-6">
          <div>
            <h2 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight">
              {step === 'email' ? (isSignUp ? 'Create Account with OTP' : 'Sign In with OTP') : 'Verify OTP'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {step === 'email' 
                ? (isSignUp ? 'Enter your Gmail to receive a verification code' : 'Enter your Gmail to receive a login code')
                : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Subham Khandual"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gmail Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition ${
                      email && !isEmailValid 
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20' 
                        : 'border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600'
                    }`}
                  />
                </div>
                {email && !isEmailValid && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Must be a valid Gmail address ending in @gmail.com
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading || (isSignUp && !name.trim()) || !isEmailValid}
                className="w-full py-3.5 bg-[#2E0854] hover:bg-[#3B0764] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition shadow-lg shadow-purple-950/20 active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Send OTP to Gmail
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-slate-600 hover:text-purple-900 font-semibold"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter 6-Digit OTP</label>
                <input 
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition text-center tracking-[0.5em] font-mono text-lg"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-3.5 bg-[#2E0854] hover:bg-[#3B0764] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition shadow-lg shadow-purple-950/20 active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Verify OTP
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button 
                  type="button"
                  onClick={goBack}
                  className="text-xs text-slate-500 hover:text-slate-700 font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change email
                </button>
                <button 
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || isLoading}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Verification Successful!</h3>
                <p className="text-xs text-slate-500 mt-1">{success}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                Redirecting to dashboard...
              </div>
            </div>
          )}

          {step === 'email' && (
            <div className="text-center pt-4">
              <button 
                type="button"
                onClick={() => window.history.back()}
                className="text-xs text-slate-400 hover:text-slate-700 underline"
              >
                Back to main page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};