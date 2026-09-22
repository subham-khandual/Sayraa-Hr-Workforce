import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search, MapPin, Briefcase, IndianRupee, Sparkles,
  Code2, Cpu, Monitor, Building2, Plus, X,
  Shield, Cloud, Database, Zap, ChevronRight, Layers,
  Server, GitBranch, Lock, BarChart3, Network
} from 'lucide-react';

/* ── CATEGORY DEFINITIONS ─────────────────────────────── */
const ROLE_CATEGORIES = [
  {
    key: 'software',
    category: 'Software Development',
    label: 'DEVELOPMENT',
    gradient: 'from-violet-600 to-indigo-600',
    lightBg: 'bg-violet-50',
    border: 'border-violet-200',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-700',
    tagBg: 'bg-violet-100 text-violet-700 border-violet-200',
    demandColor: 'text-violet-700 bg-violet-100 border-violet-200',
    dot: 'bg-violet-500',
    roles: [
      { title: 'MERN Stack Developer',         salary: '₹6 – 10 LPA',  demand: 'Very High',  tags: ['React', 'Node.js', 'MongoDB'],    icon: <Code2 className="w-4 h-4" /> },
      { title: 'Full Stack Developer',         salary: '₹7 – 12 LPA',  demand: 'High',       tags: ['Next.js', 'Django', 'AWS'],        icon: <Monitor className="w-4 h-4" /> },
      { title: 'Senior Full Stack Developer',  salary: '₹18 – 32 LPA', demand: 'Very High',  tags: ['React', 'Node.js', 'Microservices'], icon: <Code2 className="w-4 h-4" /> },
      { title: 'Frontend Engineer',            salary: '₹8 – 14 LPA',  demand: 'High',       tags: ['React', 'TypeScript', 'Tailwind'],  icon: <Monitor className="w-4 h-4" /> },
      { title: 'Backend Engineer',             salary: '₹9 – 16 LPA',  demand: 'High',       tags: ['Java', 'Spring Boot', 'PostgreSQL'], icon: <Server className="w-4 h-4" /> },
      { title: 'Product Manager',              salary: '₹14 – 28 LPA', demand: 'Very High',  tags: ['Roadmaps', 'Agile', 'Analytics'],   icon: <Briefcase className="w-4 h-4" /> },
    ],
  },
  {
    key: 'ai',
    category: 'AI / Data',
    label: 'AI & DATA',
    gradient: 'from-sky-500 to-blue-600',
    lightBg: 'bg-sky-50',
    border: 'border-sky-200',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-700',
    tagBg: 'bg-sky-100 text-sky-700 border-sky-200',
    demandColor: 'text-sky-700 bg-sky-100 border-sky-200',
    dot: 'bg-sky-500',
    roles: [
      { title: 'AI/ML Engineer',             salary: '₹8 – 15 LPA',   demand: 'Very High',  tags: ['Python', 'TensorFlow', 'PyTorch'],   icon: <Cpu className="w-4 h-4" /> },
      { title: 'Data Scientist',              salary: '₹7 – 14 LPA',   demand: 'High',       tags: ['Pandas', 'Spark', 'SQL'],            icon: <Database className="w-4 h-4" /> },
      { title: 'Generative AI Engineer',      salary: '₹12 – 22 LPA',  demand: 'Explosive',  tags: ['LangChain', 'OpenAI', 'RAG'],        icon: <Sparkles className="w-4 h-4" /> },
      { title: 'Senior Data Engineer',        salary: '₹16 – 28 LPA',  demand: 'Very High',  tags: ['Airflow', 'dbt', 'BigQuery'],        icon: <Database className="w-4 h-4" /> },
      { title: 'MLOps Engineer',              salary: '₹14 – 26 LPA',  demand: 'High',       tags: ['Kubeflow', 'MLflow', 'Docker'],      icon: <Cpu className="w-4 h-4" /> },
      { title: 'Data Analyst',                salary: '₹6 – 12 LPA',   demand: 'High',       tags: ['SQL', 'Tableau', 'Excel'],           icon: <BarChart3 className="w-4 h-4" /> },
      { title: 'Computer Vision Engineer',    salary: '₹12 – 24 LPA',  demand: 'High',       tags: ['OpenCV', 'YOLO', 'PyTorch'],         icon: <Cpu className="w-4 h-4" /> },
    ],
  },
  {
    key: 'cloud',
    category: 'Cloud / DevOps',
    label: 'CLOUD & DEVOPS',
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    tagBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    demandColor: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    dot: 'bg-emerald-500',
    roles: [
      { title: 'Cloud Engineer',         salary: '₹9 – 18 LPA',  demand: 'Very High',  tags: ['AWS', 'GCP', 'Terraform'],           icon: <Cloud className="w-4 h-4" /> },
      { title: 'DevOps Engineer',        salary: '₹8 – 16 LPA',  demand: 'High',       tags: ['Kubernetes', 'Docker', 'CI/CD'],     icon: <Zap className="w-4 h-4" /> },
      { title: 'Senior Cloud Architect', salary: '₹28 – 50 LPA', demand: 'Very High',  tags: ['AWS', 'Azure', 'Architecture'],       icon: <Cloud className="w-4 h-4" /> },
      { title: 'Site Reliability Engineer', salary: '₹16 – 30 LPA', demand: 'High',    tags: ['Prometheus', 'Linux', 'SLOs'],        icon: <Server className="w-4 h-4" /> },
      { title: 'Platform Engineer',      salary: '₹18 – 32 LPA', demand: 'High',       tags: ['Kubernetes', 'IaC', 'GitOps'],        icon: <GitBranch className="w-4 h-4" /> },
      { title: 'Network Engineer',       salary: '₹10 – 20 LPA', demand: 'High',       tags: ['Cisco', 'VPN', 'Firewalls'],          icon: <Network className="w-4 h-4" /> },
    ],
  },
  {
    key: 'security',
    category: 'Cybersecurity',
    label: 'CYBERSECURITY',
    gradient: 'from-rose-500 to-orange-500',
    lightBg: 'bg-rose-50',
    border: 'border-rose-200',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700',
    tagBg: 'bg-rose-100 text-rose-700 border-rose-200',
    demandColor: 'text-rose-700 bg-rose-100 border-rose-200',
    dot: 'bg-rose-500',
    roles: [
      { title: 'Cybersecurity Engineer',   salary: '₹10 – 20 LPA', demand: 'Critical',  tags: ['SIEM', 'Pen Testing', 'Zero Trust'], icon: <Shield className="w-4 h-4" /> },
      { title: 'Security Analyst',          salary: '₹8 – 16 LPA',  demand: 'Very High', tags: ['SOC', 'Splunk', 'Incident Response'], icon: <Lock className="w-4 h-4" /> },
      { title: 'Ethical Hacker',            salary: '₹12 – 24 LPA', demand: 'High',      tags: ['Burp Suite', 'OWASP', 'Red Team'],   icon: <Shield className="w-4 h-4" /> },
      { title: 'Cloud Security Engineer',   salary: '₹16 – 30 LPA', demand: 'Very High', tags: ['AWS Security', 'IAM', 'CSPM'],       icon: <Lock className="w-4 h-4" /> },
      { title: 'DevSecOps Engineer',        salary: '₹14 – 28 LPA', demand: 'High',      tags: ['SAST', 'DAST', 'Container Security'], icon: <Shield className="w-4 h-4" /> },
    ],
  },
];

/* ── COMPONENT ───────────────────────────────────────── */
export const JobsPage = () => {
  const { jobs, currentUser, applyForJob, navigateTo, showToast } = useApp();
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [activeTab, setActiveTab]               = useState('All Jobs');
  const [applyModalJob, setApplyModalJob]        = useState(null);
  const [resumeText, setResumeText]             = useState('');

  /* Mock jobs – 25 in-demand roles */
  const defaultMockJobs = [
    { _id: 'j1',  title: 'MERN Stack Developer',         dept: 'Engineering',         company: 'TechNova Solutions',      matchScore: 92, iconType: 'code',    skills: ['React', 'Node.js', 'MongoDB'],          location: 'Bhubaneswar, Odisha',     salary: '₹6 – 10 LPA',   description: 'Design and build high-performance web apps using the MERN stack.' },
    { _id: 'j2',  title: 'Full Stack Developer',         dept: 'Engineering',         company: 'CodeCraft Pvt. Ltd.',    matchScore: 88, iconType: 'desktop', skills: ['Next.js', 'Django', 'AWS'],              location: 'Hyderabad, Telangana',    salary: '₹7 – 12 LPA',   description: 'End-to-end engineering with modern frontends and cloud microservices.' },
    { _id: 'j3',  title: 'AI/ML Engineer',               dept: 'AI & Research',       company: 'BrainTech Labs',          matchScore: 85, iconType: 'ai',      skills: ['Python', 'TensorFlow', 'PyTorch'],       location: 'Bangalore, Karnataka',    salary: '₹8 – 15 LPA',   description: 'Develop intelligent models and integrate LLM APIs into enterprise systems.' },
    { _id: 'j4',  title: 'Data Scientist',               dept: 'Data & Analytics',    company: 'DataMind Analytics',      matchScore: 80, iconType: 'ai',      skills: ['Pandas', 'Spark', 'SQL'],                location: 'Chennai, Tamil Nadu',     salary: '₹7 – 14 LPA',   description: 'Drive business decisions through statistical modeling and ML pipelines.' },
    { _id: 'j5',  title: 'Generative AI Engineer',       dept: 'AI & Research',       company: 'NeuralLabs Inc.',         matchScore: 91, iconType: 'ai',      skills: ['LangChain', 'OpenAI', 'RAG'],            location: 'Pune, Maharashtra',       salary: '₹12 – 22 LPA',  description: 'Architect production-grade LLM apps, RAG pipelines, and fine-tuned models.' },
    { _id: 'j6',  title: 'Cloud Engineer',               dept: 'Infrastructure',      company: 'CloudNine Systems',       matchScore: 83, iconType: 'desktop', skills: ['AWS', 'GCP', 'Terraform'],               location: 'Gurugram, Haryana',       salary: '₹9 – 18 LPA',   description: 'Design scalable cloud infrastructure and optimize multi-cloud deployments.' },
    { _id: 'j7',  title: 'DevOps Engineer',              dept: 'Platform & DevOps',   company: 'ShipFast Engineering',    matchScore: 87, iconType: 'code',    skills: ['Kubernetes', 'Docker', 'CI/CD'],         location: 'Noida, Uttar Pradesh',    salary: '₹8 – 16 LPA',   description: 'Automate build, test, and deploy pipelines for reliable feature delivery.' },
    { _id: 'j8',  title: 'Cybersecurity Engineer',       dept: 'Security',            company: 'SecureShield Labs',       matchScore: 78, iconType: 'code',    skills: ['SIEM', 'Pen Testing', 'Zero Trust'],     location: 'Mumbai, Maharashtra',     salary: '₹10 – 20 LPA',  description: 'Protect systems through threat modeling and red-team exercises.' },
    { _id: 'j9',  title: 'Senior Full Stack Developer',  dept: 'Engineering',         company: 'InnovateTech Corp.',      matchScore: 90, iconType: 'code',    skills: ['React', 'Node.js', 'Microservices'],     location: 'Bangalore, Karnataka',    salary: '₹18 – 32 LPA',  description: 'Lead end-to-end product development, mentor engineers, and architect scalable systems.' },
    { _id: 'j10', title: 'Frontend Engineer',            dept: 'Engineering',         company: 'PixelWave Studios',       matchScore: 86, iconType: 'desktop', skills: ['React', 'TypeScript', 'Tailwind'],       location: 'Pune, Maharashtra',       salary: '₹8 – 14 LPA',   description: 'Craft polished, accessible, and performant user interfaces for web platforms.' },
    { _id: 'j11', title: 'Backend Engineer',             dept: 'Engineering',         company: 'ScaleGrid Systems',       matchScore: 84, iconType: 'code',    skills: ['Java', 'Spring Boot', 'PostgreSQL'],     location: 'Hyderabad, Telangana',    salary: '₹9 – 16 LPA',   description: 'Design robust APIs, microservices, and data pipelines powering large-scale apps.' },
    { _id: 'j12', title: 'Product Manager',              dept: 'Product',             company: 'NextGen SaaS',            matchScore: 89, iconType: 'code',    skills: ['Roadmaps', 'Agile', 'Analytics'],        location: 'Bangalore, Karnataka',    salary: '₹14 – 28 LPA',  description: 'Define product vision, prioritize roadmap, and collaborate with engineering & design teams.' },
    { _id: 'j13', title: 'Senior Data Engineer',         dept: 'Data & Analytics',    company: 'InsightForge Labs',       matchScore: 88, iconType: 'ai',      skills: ['Airflow', 'dbt', 'BigQuery'],            location: 'Hyderabad, Telangana',    salary: '₹16 – 28 LPA',  description: 'Architect enterprise data lakes, ETL pipelines, and real-time analytics platforms.' },
    { _id: 'j14', title: 'MLOps Engineer',               dept: 'AI & Research',       company: 'AIVision Systems',         matchScore: 87, iconType: 'ai',      skills: ['Kubeflow', 'MLflow', 'Docker'],          location: 'Bangalore, Karnataka',    salary: '₹14 – 26 LPA',  description: 'Build and operate scalable ML training, deployment, and monitoring infrastructure.' },
    { _id: 'j15', title: 'Data Analyst',                 dept: 'Data & Analytics',    company: 'MetricMint Analytics',    matchScore: 76, iconType: 'desktop', skills: ['SQL', 'Tableau', 'Excel'],               location: 'Kolkata, West Bengal',    salary: '₹6 – 12 LPA',   description: 'Translate raw data into actionable business insights through dashboards and reports.' },
    { _id: 'j16', title: 'Computer Vision Engineer',     dept: 'AI & Research',       company: 'Visionary AI Labs',       matchScore: 82, iconType: 'ai',      skills: ['OpenCV', 'YOLO', 'PyTorch'],             location: 'Pune, Maharashtra',       salary: '₹12 – 24 LPA',  description: 'Build production-grade CV models for object detection, OCR, and image classification.' },
    { _id: 'j17', title: 'Senior Cloud Architect',       dept: 'Infrastructure',      company: 'CloudPeak Enterprises',  matchScore: 93, iconType: 'desktop', skills: ['AWS', 'Azure', 'Architecture'],           location: 'Bangalore, Karnataka',    salary: '₹28 – 50 LPA',  description: 'Design multi-cloud and hybrid architectures for enterprise-scale workloads.' },
    { _id: 'j18', title: 'Site Reliability Engineer',    dept: 'Platform & DevOps',   company: 'AlwaysOn Systems',        matchScore: 85, iconType: 'code',    skills: ['Prometheus', 'Linux', 'SLOs'],           location: 'Gurugram, Haryana',       salary: '₹16 – 30 LPA',  description: 'Ensure 99.99% uptime through automation, observability, and incident response.' },
    { _id: 'j19', title: 'Platform Engineer',            dept: 'Platform & DevOps',   company: 'InnerLoop Tech',         matchScore: 84, iconType: 'code',    skills: ['Kubernetes', 'IaC', 'GitOps'],           location: 'Bengaluru, Karnataka',    salary: '₹18 – 32 LPA',  description: 'Build internal developer platforms and paved paths to accelerate engineering velocity.' },
    { _id: 'j20', title: 'Network Engineer',             dept: 'Infrastructure',      company: 'NetCore Solutions',       matchScore: 79, iconType: 'code',    skills: ['Cisco', 'VPN', 'Firewalls'],             location: 'Mumbai, Maharashtra',     salary: '₹10 – 20 LPA',  description: 'Design, configure, and secure enterprise LAN/WAN and cloud network infrastructure.' },
    { _id: 'j21', title: 'Security Analyst',             dept: 'Security',            company: 'CyberSentry Inc.',        matchScore: 81, iconType: 'code',    skills: ['SOC', 'Splunk', 'Incident Response'],     location: 'Pune, Maharashtra',       salary: '₹8 – 16 LPA',   description: 'Monitor, triage, and respond to security incidents across enterprise environments.' },
    { _id: 'j22', title: 'Ethical Hacker',               dept: 'Security',            company: 'RedTeamOps',              matchScore: 83, iconType: 'code',    skills: ['Burp Suite', 'OWASP', 'Red Team'],       location: 'Bangalore, Karnataka',    salary: '₹12 – 24 LPA',  description: 'Conduct authorized penetration tests and emulate adversaries to uncover vulnerabilities.' },
    { _id: 'j23', title: 'Cloud Security Engineer',      dept: 'Security',            company: 'FortifyCloud',            matchScore: 86, iconType: 'code',    skills: ['AWS Security', 'IAM', 'CSPM'],           location: 'Hyderabad, Telangana',    salary: '₹16 – 30 LPA',  description: 'Secure multi-cloud workloads with posture management, IAM, and threat detection.' },
    { _id: 'j24', title: 'DevSecOps Engineer',           dept: 'Security',            company: 'ShieldOps Labs',          matchScore: 85, iconType: 'code',    skills: ['SAST', 'DAST', 'Container Security'],    location: 'Noida, Uttar Pradesh',    salary: '₹14 – 28 LPA',  description: 'Embed security into CI/CD pipelines and ensure secure-by-default cloud-native deployments.' },
  ];

  const allJobs = jobs.length > 0
    ? jobs.map(j => ({ _id: j._id, title: j.title, dept: j.department || 'Engineering', company: j.department || 'Sayraa Partner', matchScore: 90, iconType: 'code', skills: j.skills || ['React', 'Node.js'], location: j.location || 'Bangalore, Karnataka', salary: j.salary || '₹8 – 14 LPA', description: j.description }))
    : defaultMockJobs;

  const filteredJobs = allJobs.filter(job => {
    const q = searchQuery.toLowerCase();
    const matchQ = job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.skills.some(s => s.toLowerCase().includes(q));
    return selectedLocation === 'All' ? matchQ : matchQ && job.location.toLowerCase().includes(selectedLocation.toLowerCase());
  });

  const handleApplyClick   = job => setApplyModalJob(job);
  const handleConfirmApply = async e => {
    e.preventDefault();
    if (!applyModalJob) return;
    await applyForJob(applyModalJob._id, resumeText || 'Applicant resume parsed automatically.');
    setApplyModalJob(null);
    setResumeText('');
    showToast(`Applied to ${applyModalJob.title}!`);
    navigateTo('/resume');
  };

  const quickApplyRole = roleTitle => {
    const job = allJobs.find(j => j.title === roleTitle);
    if (job) setApplyModalJob(job);
    else showToast('Open the job listing below to apply!', 'info');
  };

  const isRecruiter = ['Recruiter', 'Admin', 'Hiring Manager'].includes(currentUser?.role);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight">Explore Open Roles</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5"><span>🤖</span> Sayraa AI matches you to the best-fit positions in real time.</p>
        </div>
        {isRecruiter && (
          <button onClick={() => showToast('Use the admin panel to post new jobs.')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2E0854] hover:bg-[#3B0764] text-white text-xs font-bold rounded-xl transition shadow-md shadow-purple-950/10">
            <Plus className="w-4 h-4" /> Post New Job
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          ALL OPEN POSITIONS — CATEGORY CARDS
          ══════════════════════════════════════════════ */}
      <section className="space-y-5">
        {/* Section heading */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-500" />
            <h2 className="font-outfit text-lg font-bold text-slate-900">All Open Positions</h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold border border-slate-200">
            {filteredJobs.length} roles
          </span>
        </div>

        {/* Compact category cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {ROLE_CATEGORIES.map(cat => {
            const matchedCount = allJobs.filter(j => cat.roles.some(r => r.title === j.title)).length;
            return (
              <button
                key={cat.key}
                onClick={() => setSearchQuery(cat.roles[0].title.split(' ')[0])}
                className={`flex items-center gap-3 px-4 py-3 bg-white border ${cat.border} rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition text-left group`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.iconBg} ${cat.iconColor}`}>
                  {cat.key === 'software'  && <Code2    className="w-5 h-5" />}
                  {cat.key === 'ai'        && <Cpu      className="w-5 h-5" />}
                  {cat.key === 'cloud'     && <Cloud    className="w-5 h-5" />}
                  {cat.key === 'security'  && <Shield   className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-[#2E0854] transition">
                    {cat.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {matchedCount} role{matchedCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2E0854] flex-shrink-0 transition" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">

        {/* Search bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search roles, skills or companies…"
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-sm transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button onClick={() => setSelectedLocation(selectedLocation === 'Bangalore' ? 'All' : 'Bangalore')}
            className={`flex items-center gap-1.5 px-4 py-3 border rounded-2xl text-xs font-semibold transition ${selectedLocation === 'Bangalore' ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
          </button>
          <button className="flex items-center gap-1.5 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl text-xs font-semibold text-slate-700 transition">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Experience
          </button>
          <button className="flex items-center gap-1.5 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl text-xs font-semibold text-slate-700 transition">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> Salary
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200">
          {['All Jobs', 'Saved Jobs', 'Applied Jobs'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-bold transition relative ${activeTab === tab ? 'text-[#2E0854]' : 'text-slate-500 hover:text-slate-800'}`}>
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2E0854] rounded-full" />}
            </button>
          ))}
        </div>

        {/* Sayraa insight banner */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-outfit font-bold text-xs text-purple-950">Sayraa Insight</span>
            <p className="text-xs text-slate-600 mt-0.5">
              {filteredJobs.length} matching role{filteredJobs.length !== 1 ? 's' : ''} found. Generative AI and Cloud roles are trending — apply early for the best match score!
            </p>
          </div>
        </div>

        {/* Job cards grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredJobs.map(job => {
              const cat = ROLE_CATEGORIES.find(c => c.roles.some(r => r.title === job.title));
              return (
                <div key={job._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col gap-4 group cursor-pointer"
                  onClick={() => handleApplyClick(job)}
                >
                  {/* Row 1: Icon + Match badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      cat ? `${cat.iconBg} ${cat.iconColor} ${cat.border}` : 'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                      {job.iconType === 'ai' ? <Cpu className="w-5 h-5" /> : job.iconType === 'desktop' ? <Monitor className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {job.matchScore}% Match
                    </span>
                  </div>

                  {/* Row 2: Title + Dept */}
                  <div className="space-y-0.5">
                    <h3 className="font-outfit font-bold text-[15px] text-slate-900 group-hover:text-[#2E0854] transition leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      {job.dept || job.company}
                    </p>
                  </div>

                  {/* Row 3: Skill tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 3).map(s => (
                      <span key={s} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100" />

                  {/* Row 4: Location + Salary */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[120px]">{job.location}</span>
                    </span>
                    <span className="font-bold text-slate-900 text-xs whitespace-nowrap">{job.salary}</span>
                  </div>

                  {/* Row 5: Apply button */}
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleApplyClick(job); }}
                    className="w-full py-3 bg-[#2E0854] hover:bg-[#3B0764] text-white text-xs font-bold rounded-xl transition shadow-sm shadow-purple-950/20 active:scale-[0.99]"
                  >
                    Apply Now
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <div className="text-4xl">🔍</div>
            <p className="text-sm font-semibold text-slate-600">No roles matched "<span className="text-[#2E0854]">{searchQuery}</span>"</p>
            <button onClick={() => setSearchQuery('')} className="text-xs text-purple-700 hover:underline font-bold">Clear search</button>
          </div>
        )}
      </section>

      {/* ── APPLY MODAL ──────────────────────────────── */}
      {applyModalJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6 relative">
            <button onClick={() => setApplyModalJob(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">Quick Apply</span>
              <h2 className="font-outfit text-xl font-bold text-slate-900">{applyModalJob.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{applyModalJob.company} • {applyModalJob.location}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-700 flex-shrink-0" />
              <p className="text-xs text-purple-900 leading-relaxed">Sayraa AI will automatically match your resume and calculate an instant ATS score for this role!</p>
            </div>
            <form onSubmit={handleConfirmApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Cover Note / Key Experience Highlights (Optional)</label>
                <textarea rows={3} value={resumeText} onChange={e => setResumeText(e.target.value)}
                  placeholder="Share a quick highlight of your relevant projects…"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setApplyModalJob(null)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition">Cancel</button>
                <button type="submit"
                  className="flex-1 py-3 bg-[#2E0854] hover:bg-[#3B0764] text-white text-xs font-bold rounded-xl transition shadow-md shadow-purple-950/20">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
