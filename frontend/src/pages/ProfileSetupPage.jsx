import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Plus, X, CheckCircle2, ArrowRight } from 'lucide-react';
import sayraaAvatar from '../assets/sayraa-avatar.jpg';

export const ProfileSetupPage = () => {
  const { currentUser, navigateTo, showToast } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Form States
  const [fullName, setFullName] = useState(currentUser?.name || 'Subham Khandual');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Bangalore, Karnataka');
  const [currentRole, setCurrentRole] = useState('Frontend Developer');
  const [experienceYears, setExperienceYears] = useState('2–5 Years');
  const [preferredRole, setPreferredRole] = useState('Full Stack Developer');
  const [expectedSalary, setExpectedSalary] = useState('12');

  // Skills
  const [activeSkills, setActiveSkills] = useState(['React', 'Node.js', 'JavaScript', 'MongoDB']);
  const [suggestedSkills, setSuggestedSkills] = useState(['Python', 'UI/UX', 'AWS']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);

  const removeSkill = (skillToRemove) => {
    setActiveSkills(prev => prev.filter(s => s !== skillToRemove));
    if (!suggestedSkills.includes(skillToRemove)) {
      setSuggestedSkills(prev => [...prev, skillToRemove]);
    }
  };

  const addSkill = (skillToAdd) => {
    if (!activeSkills.includes(skillToAdd)) {
      setActiveSkills(prev => [...prev, skillToAdd]);
    }
    setSuggestedSkills(prev => prev.filter(s => s !== skillToAdd));
  };

  const handleCustomSkillAdd = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !activeSkills.includes(newSkillInput.trim())) {
      setActiveSkills(prev => [...prev, newSkillInput.trim()]);
      setNewSkillInput('');
      setShowAddSkillInput(false);
    }
  };

  const handleContinue = () => {
    showToast('Profile updated successfully!');
    navigateTo('/resume');
  };

  const steps = [
    { num: 1, label: 'Personal Info' },
    { num: 2, label: 'Experience' },
    { num: 3, label: 'Skills' },
    { num: 4, label: 'Education' },
    { num: 5, label: 'Complete' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* ── HEADER ── */}
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Namaste, {fullName.split(' ')[0]} <span className="text-3xl">👋</span>
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Let's help Sayraa understand your skills and find the right opportunities for you.
        </p>
      </div>

      {/* ── MULTI-STEP PROGRESS STEPPER ── */}
      <div className="flex items-center justify-between max-w-2xl px-2">
        {steps.map((stg, idx) => {
          const isActive = stg.num === currentStep;
          const isDone = stg.num < currentStep;

          return (
            <div key={stg.num} className="flex flex-col items-center relative">
              <button
                onClick={() => setCurrentStep(stg.num)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#2E0854] text-white shadow-md shadow-purple-950/20'
                    : isDone
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {stg.num}
              </button>
              <span className={`text-[11px] font-semibold mt-2 ${
                isActive ? 'text-[#2E0854] font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
              }`}>
                {stg.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: FORM (7 cols) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          
           {/* Section 1: Personal Information */}
           <div className="space-y-4">
             <h2 className="font-outfit text-lg font-bold text-slate-900">Personal Information</h2>
             
             {/* Profile Picture */}
             <div className="flex items-center gap-5">
               <div className="relative">
                 <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-200">
                   <img 
                     src={currentUser?.avatar || sayraaAvatar} 
                     alt="Profile"
                     className="w-full h-full object-cover"
                   />
                 </div>
                 <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
               </div>
               <div className="text-xs text-slate-500">
                 <span className="font-medium text-slate-700">Profile Photo</span>
                 <p className="mt-0.5">Auto-synced from your Gmail account</p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                <input 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Subham Khandual"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-purple-600 transition shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number</label>
                <input 
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-purple-600 transition shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore, Karnataka"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-purple-600 transition shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Profile */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="font-outfit text-lg font-bold text-slate-900">Professional Profile</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Role</label>
                <input 
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-purple-600 transition shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Years of Experience</label>
                <select 
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-purple-600 transition shadow-sm"
                >
                  <option value="0–1 Years">0–1 Years (Fresher)</option>
                  <option value="1–2 Years">1–2 Years</option>
                  <option value="2–5 Years">2–5 Years</option>
                  <option value="5–8 Years">5–8 Years</option>
                  <option value="8+ Years">8+ Years</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Preferred Job Role</label>
                <input 
                  type="text"
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-purple-600 transition shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Expected Salary (LPA)</label>
                <input 
                  type="text"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-purple-600 transition shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Key Skills */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="font-outfit text-lg font-bold text-slate-900">Key Skills</h2>
              <button 
                type="button"
                onClick={() => setShowAddSkillInput(!showAddSkillInput)}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>

            {showAddSkillInput && (
              <form onSubmit={handleCustomSkillAdd} className="flex gap-2">
                <input 
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="Type skill name and press enter..."
                  className="px-3.5 py-2 bg-slate-50 border border-purple-300 rounded-xl text-xs flex-1 focus:outline-none focus:bg-white"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#2E0854] text-white text-xs font-bold rounded-xl"
                >
                  Add
                </button>
              </form>
            )}

            {/* Active and suggested skill tag pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {activeSkills.map((skill) => (
                <span 
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-50 border border-purple-200 text-purple-900 rounded-full text-xs font-semibold shadow-xs"
                >
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="text-purple-500 hover:text-purple-800 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {suggestedSkills.map((skill) => (
                <button 
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-full text-xs font-medium transition"
                >
                  {skill} +
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SAYRAA AI COMPANION (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border-2 border-purple-300/80 shadow-md space-y-6 sticky top-28">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={sayraaAvatar} 
                alt="Sayraa AI" 
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-base text-slate-900">Sayraa AI Suggestion</h3>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
              </span>
            </div>
          </div>

          {/* AI Bubble Quote */}
          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 text-xs text-slate-700 leading-relaxed italic">
            "Based on your profile, I can help you discover jobs that match your skills and career goals. Let's make sure your details are accurate to get the best recommendations!"
          </div>

          {/* Value Checklist */}
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Profile completion increases match rate by 40%.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Add specific tech stacks for better AI screening.</span>
            </div>
          </div>

          {/* Action CTA */}
          <button 
            onClick={handleContinue}
            className="w-full py-3.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 active:scale-[0.99]"
          >
            Continue with Sayraa <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

