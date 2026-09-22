import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  LogIn, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  AlertCircle, 
  Sparkles,
  CheckCircle2,
  LockKeyhole,
  Shield,
  RotateCcw,
  Loader2,
  KeyRound
} from 'lucide-react';
import sayraaAvatar from '../assets/sayraa-avatar.jpg';
import sayraaLogo from '../assets/sayraa.png';

const NAME_REGEX = /^[A-Za-z][A-Za-z ]{1,49}$/;
const GMAIL_REGEX = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const LandingPage = () => {
  const { login, sendOTP, verifyOTP, loginWithGoogle, showToast } = useApp();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [touched, setTouched] = useState({});

  // Inline OTP verification states inside the card
  const [showInlineOTP, setShowInlineOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Validation evaluations
  const isNameValid = NAME_REGEX.test(name.trim());
  const isEmailValid = isSignUp 
    ? GMAIL_REGEX.test(email.trim().toLowerCase()) 
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = isSignUp ? PASSWORD_REGEX.test(password) : password.length > 0;
  const isConfirmPasswordValid = isSignUp ? (confirmPassword.length > 0 && confirmPassword === password) : true;

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

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (isSignUp) {
      if (!isNameValid) {
        showToast('Name must be 2–50 characters and contain only letters and spaces.', 'error');
        return;
      }
      if (!isEmailValid) {
        showToast('Please enter a valid Gmail address ending in @gmail.com.', 'error');
        return;
      }
      if (!isPasswordValid) {
        showToast('Password must meet complexity requirements (8+ chars, uppercase, lowercase, number & special char).', 'error');
        return;
      }
      if (!isConfirmPasswordValid) {
        showToast('Passwords do not match.', 'error');
        return;
      }
      if (!agreed) {
        showToast('Please accept the Terms & Conditions.', 'error');
        return;
      }

      setIsSubmitting(true);
      try {
        await sendOTP(email.trim().toLowerCase(), 'register');
        setShowInlineOTP(true);
        startCountdown();
        showToast('OTP verification code sent to your Gmail!');
      } catch (err) {
        showToast(err.message || 'Failed to send OTP code to your email', 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!email.trim() || !password) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      login(email.trim(), password);
    }
  };

  const handleVerifyInlineOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      showToast('Please enter the 6-digit OTP sent to your email.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyOTP(
        email.trim().toLowerCase(),
        otpCode,
        name.trim(),
        password,
        'Candidate'
      );
      showToast('Account created and verified successfully!');
    } catch (err) {
      showToast(err.message || 'OTP verification failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsSubmitting(true);
    try {
      await sendOTP(email.trim().toLowerCase(), 'register');
      startCountdown();
      showToast('A new OTP code has been sent to your email!');
    } catch (err) {
      showToast(err.message || 'Failed to resend OTP code.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (signUpMode) => {
    setIsSignUp(signUpMode);
    setShowInlineOTP(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 font-sans selection:bg-purple-700 selection:text-white bg-gradient-to-br from-[#2E0854] via-[#3B0764] to-[#1E0538]">
      
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Wave/Curved Gradient Ribbons */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-20 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1000 1000" className="w-full h-full text-purple-400 fill-current opacity-40">
          <path d="M0,1000 C300,800 400,600 500,400 C600,200 800,100 1000,0 L1000,1000 Z"></path>
        </svg>
      </div>

      {/* Top Left Dot Matrix Grid */}
      <div className="absolute top-8 left-6 sm:left-12 grid grid-cols-4 gap-2 opacity-40 pointer-events-none hidden sm:grid">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400" />
        ))}
      </div>

      {/* Right Middle Dot Matrix Grid */}
      <div className="absolute top-1/2 right-6 sm:right-12 grid grid-cols-4 gap-2 opacity-40 pointer-events-none hidden sm:grid">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        ))}
      </div>

      {/* Background Sparkles */}
      <div className="absolute top-16 right-1/4 text-purple-300/80 animate-bounce pointer-events-none hidden sm:block">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="absolute bottom-20 left-16 text-indigo-300/80 pointer-events-none hidden sm:block">
        <Sparkles className="w-5 h-5" />
      </div>

      {/* ── MAIN AUTHENTICATION CARD CONTAINER ── */}
      <div className="w-full max-w-[540px] bg-white/95 backdrop-blur-xl rounded-[28px] sm:rounded-[36px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5),0_10px_30px_-5px_rgba(147,51,234,0.3)] border border-white/80 p-5 sm:p-7 relative z-10 my-auto">
        
        {/* LOGO & BRAND HEADER */}
        <div className="text-center flex flex-col items-center">
          
          {/* Logo on Left of Brand Text */}
          <div className="flex items-center justify-center gap-3.5 mb-1">
            {/* Clean White Round Container for Logo */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-1 border border-slate-200/90 shadow-md shadow-purple-950/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img 
                src={sayraaLogo} 
                alt="Sayraa AI Logo" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Brand Text on Right */}
            <div className="text-left">
              <h1 className="font-outfit font-black text-2xl sm:text-3xl tracking-tight text-[#1E1B4B] leading-none">
                SAYRAA
              </h1>
              <span className="text-[10px] sm:text-[11px] text-purple-600 font-extrabold tracking-[0.25em] uppercase block mt-1">
                TALENT HIRE
              </span>
            </div>
          </div>

          {/* Subtle horizontal bar accent */}
          <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full my-2.5" />

          {/* TITLE & SUBTITLE */}
          <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-0.5">
            {showInlineOTP ? 'Verify Your Account' : (isSignUp ? 'Create Your Account' : 'Welcome Back')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {showInlineOTP 
              ? 'Enter the verification code sent to your email' 
              : (isSignUp ? 'Join Sayraa Talent Hire' : 'Sign in to access your Sayraa AI account')}
          </p>
        </div>

        {/* TAB TOGGLE SWITCHER (Hidden during OTP step) */}
        {!showInlineOTP && (
          <div className="bg-[#F3F4F8] p-1.5 rounded-2xl flex items-center gap-1.5 my-5 border border-slate-200/60 shadow-inner">
            <button
              type="button"
              onClick={() => handleTabChange(true)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                isSignUp 
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md shadow-purple-500/25' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange(false)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                !isSignUp 
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md shadow-purple-500/25' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>
        )}

        {/* INLINE OTP STEP OR FORM */}
        {showInlineOTP ? (
          <div className="py-2 my-4 transition-all duration-300">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowInlineOTP(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Account Details</span>
              </button>
              <span className="text-[11px] font-bold text-purple-600 bg-purple-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                OTP Verification
              </span>
            </div>

            {/* Email Target Indicator */}
            <div className="bg-purple-50/80 border border-purple-200/70 rounded-2xl p-3.5 mb-4 text-center">
              <p className="text-xs text-slate-600 font-medium">
                We've sent a 6-digit OTP code to:
              </p>
              <p className="text-sm font-extrabold text-purple-900 tracking-wide mt-0.5">
                {email.trim().toLowerCase()}
              </p>
            </div>

            {/* OTP Input Form */}
            <form onSubmit={handleVerifyInlineOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    autoFocus
                    className="w-full text-center text-2xl font-mono font-bold tracking-[0.4em] py-3.5 px-4 rounded-2xl bg-slate-50 border-2 border-purple-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/20 text-purple-950 placeholder-slate-300 outline-none transition"
                  />
                </div>
              </div>

              {/* Verify Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting || otpCode.length !== 6}
                className={`w-full py-3.5 px-6 bg-gradient-to-r from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-purple-600/30 hover:shadow-xl active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  (isSubmitting || otpCode.length !== 6) ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Create Account</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Resend Code Section */}
            <div className="mt-4 pt-3 text-center border-t border-slate-100">
              {countdown > 0 ? (
                <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
                  <span>Resend code in</span>
                  <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md font-mono">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isSubmitting}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Didn't get code? Resend OTP</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* REGULAR AUTHENTICATION FORM */
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* FULL NAME (Sign Up only) */}
            {isSignUp && (
              <div className="relative bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/15 rounded-2xl px-4 py-2.5 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100/70 flex items-center justify-center flex-shrink-0 text-purple-600">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-bold text-slate-700 leading-tight">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => handleBlur('name')}
                      placeholder="e.g. Subham Khandual"
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 font-semibold placeholder-slate-400 outline-none border-none p-0 mt-0.5"
                    />
                  </div>
                  {touched.name && isNameValid && (
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            )}

            {/* EMAIL ADDRESS */}
            <div className="relative bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/15 rounded-2xl px-4 py-2.5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100/70 flex items-center justify-center flex-shrink-0 text-purple-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-bold text-slate-700 leading-tight">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder={isSignUp ? "e.g. subham@example.com" : "e.g. subham@example.com"}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 font-semibold placeholder-slate-400 outline-none border-none p-0 mt-0.5"
                  />
                </div>
                {touched.email && isEmailValid && (
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                )}
              </div>
            </div>
            {isSignUp && touched.email && !isEmailValid && email.length > 0 && (
              <p className="text-[11px] text-rose-500 px-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Must be a valid Gmail address (@gmail.com).
              </p>
            )}

            {/* PASSWORD */}
            <div className="relative bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/15 rounded-2xl px-4 py-2.5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100/70 flex items-center justify-center flex-shrink-0 text-purple-600">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-bold text-slate-700 leading-tight">Password</label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder={isSignUp ? "Minimum 8 characters" : "Enter your password"}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 font-semibold placeholder-slate-400 outline-none border-none p-0 mt-0.5"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-purple-600 p-1 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD (Sign Up only) */}
            {isSignUp && (
              <div className="relative bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/15 rounded-2xl px-4 py-2.5 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100/70 flex items-center justify-center flex-shrink-0 text-purple-600">
                    <LockKeyhole className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-bold text-slate-700 leading-tight">Confirm Password</label>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      placeholder="Re-enter your password"
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 font-semibold placeholder-slate-400 outline-none border-none p-0 mt-0.5"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-purple-600 p-1 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* CHECKBOX (Sign Up only) */}
            {isSignUp && (
              <div className="flex items-start gap-2.5 pt-1 px-0.5">
                <input 
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-purple-600 rounded border-slate-300 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 leading-snug cursor-pointer select-none">
                  I agree to the <span className="font-bold text-purple-600 hover:underline">Terms & Conditions</span> and <span className="font-bold text-purple-600 hover:underline">Privacy Policy</span>
                </label>
              </div>
            )}

            {/* MAIN SUBMIT BUTTON */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer mt-2.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>
        )}

        {/* DIVIDER & GOOGLE BUTTON (Hidden during OTP step) */}
        {!showInlineOTP && (
          <>
            <div className="relative flex items-center justify-center my-4">
              <div className="w-full border-t border-slate-200/80" />
              <span className="absolute bg-white px-3 text-xs font-semibold text-slate-400">
                or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={loginWithGoogle}
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl transition-all shadow-sm text-xs sm:text-sm font-bold text-slate-700 active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </>
        )}

        {/* SAYRAA AI HIRING PARTNER & 100% SECURE CARD FOOTER */}
        <div className="mt-5 space-y-3">
          <div className="bg-[#F5F2FF] border border-[#E5DCFF] rounded-[22px] p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-200/60 p-0.5 overflow-hidden shadow-inner">
                  <img 
                    src={sayraaAvatar} 
                    alt="Sayraa AI Hiring Partner"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <Sparkles className="w-3.5 h-3.5 text-purple-600 absolute -top-0.5 -right-0.5" />
              </div>
              <div className="text-left min-w-0">
                <h4 className="font-outfit font-extrabold text-xs sm:text-sm text-[#2E0854] leading-snug">
                  Your AI Hiring Partner
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-tight mt-0.5">
                  From job matching to final selection, Sayraa AI handles it all.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 pl-2 sm:pl-3 border-l border-purple-200/60 flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E5DCFF] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#5B21B6" d="M12 2L4 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z"/>
                  <path fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className="text-left">
                <h5 className="font-outfit font-extrabold text-xs sm:text-sm text-[#2E0854] leading-snug">
                  100% Secure
                </h5>
                <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                  Your data is safe with us always.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-slate-500 pt-1 font-medium">
            <Shield className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span>© 2025 Sayraa AI HR Workforce. All rights reserved.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
