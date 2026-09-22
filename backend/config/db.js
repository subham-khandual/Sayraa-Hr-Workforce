const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS servers to resolve MongoDB Atlas SRV records reliably
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if unable to set custom DNS
}

// Seed Data
const seedData = {
  users: [
    {
      _id: 'user-recruiter-1',
      email: 'recruiter@sayraa.ai',
      passwordHash: '', // Will be bcrypt-hashed on start
      name: 'Rohan Sharma',
      role: 'Recruiter',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      organization: 'Sayraa Technologies'
    },
    {
      _id: 'user-candidate-1',
      email: 'candidate@sayraa.ai',
      passwordHash: '', // Will be bcrypt-hashed on start
      name: 'Ananya Iyer',
      role: 'Candidate',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      organization: 'None'
    }
  ],
  jobs: [
    {
      _id: 'job-101',
      title: 'Senior AI / Full-Stack Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA (Hybrid)',
      type: 'Full-Time',
      experience: '5+ years',
      salary: '$140,000 - $180,000',
      status: 'Active',
      description: 'We are looking for a Senior Full-Stack Engineer with strong AI integration capabilities to build next-generation interfaces.',
      skills: ['React', 'Node.js', 'MongoDB', 'Python', 'LLM Integration'],
      applicantsCount: 14,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job-102',
      title: 'Product Manager - AI Platform',
      department: 'Product',
      location: 'New York, NY (Remote)',
      type: 'Full-Time',
      experience: '4+ years',
      salary: '$130,000 - $165,000',
      status: 'Active',
      description: 'Lead the vision and development of our enterprise AI recruiting workflows and integrations.',
      skills: ['Product Strategy', 'Agile', 'AI/ML Concepts', 'UX Design'],
      applicantsCount: 8,
      createdAt: new Date().toISOString()
    }
  ],
  candidates: [
    {
      _id: 'cand-1',
      name: 'Ananya Iyer',
      email: 'candidate@sayraa.ai',
      phone: '+1 (555) 019-2834',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'HTML/CSS'],
      resumeUrl: '/resumes/ananya_iyer.pdf',
      experience: '4 years',
      education: 'B.S. in Computer Science - UCLA',
      currentCompany: 'DevTech Solutions'
    },
    {
      _id: 'cand-2',
      name: 'Kabir Mehta',
      email: 'kabir.mehta@gmail.com',
      phone: '+1 (555) 048-9391',
      skills: ['Python', 'PyTorch', 'Node.js', 'React', 'MongoDB'],
      resumeUrl: '/resumes/kabir_mehta.pdf',
      experience: '6 years',
      education: 'M.S. in AI - Stanford University',
      currentCompany: 'NeuralLabs'
    }
  ],
  applications: [
    {
      _id: 'app-301',
      candidateId: 'cand-1',
      jobId: 'job-101',
      stage: 'HR Review', // Applied, Resume, Screening, ATS Passed, Assessment, AI Interview, HR Review, Final Decision
      status: 'Active', // Active, Advanced, Rejected, Hired
      atsScore: 84,
      assessmentScore: 78,
      interviewScore: 89,
      overallScore: 85,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'app-302',
      candidateId: 'cand-2',
      jobId: 'job-101',
      stage: 'AI Interview',
      status: 'Active',
      atsScore: 92,
      assessmentScore: 85,
      interviewScore: 0,
      overallScore: 88,
      createdAt: new Date().toISOString()
    }
  ],
  assessments: [
    {
      _id: 'assess-101',
      title: 'Full-Stack JavaScript Skills Assessment',
      jobId: 'job-101',
      timeLimit: 45, // minutes
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          text: 'What is the purpose of React.useMemo hook?',
          options: [
            'To memoize computationally expensive operations',
            'To create persistent state references',
            'To schedule rendering updates',
            'To handle side effects'
          ],
          correctOptionIndex: 0
        },
        {
          id: 'q2',
          type: 'coding',
          text: 'Write a Node.js middleware function that logs the HTTP method and request URL.',
          template: 'module.exports = function(req, res, next) {\n  // Write code here\n};'
        }
      ]
    }
  ],
  evaluations: [
    {
      _id: 'eval-1',
      applicationId: 'app-301',
      candidateId: 'cand-1',
      overallScore: 85,
      confidenceRating: 92, // percentage
      criteria: [
        { name: 'Technical Knowledge', score: 88, detail: 'Strong grasp of React render pipeline and event loops.' },
        { name: 'Problem Solving', score: 85, detail: 'Systematically broke down complex algorithm prompt.' },
        { name: 'Communication', score: 90, detail: 'Very articulate, explains thoughts clearly during coding.' },
        { name: 'Role Fit', score: 77, detail: 'Moderate alignment with AI systems but excellent developer skills.' }
      ],
      evidence: [
        {
          id: 'ev-1',
          criterion: 'Technical Knowledge',
          quote: 'We use hooks like useMemo to avoid re-running expensive logic on every single re-render of components.',
          source: 'Live Interview Transcript (Q2)'
        },
        {
          id: 'ev-2',
          criterion: 'Communication',
          quote: 'Let me first explain my approach before I start writing the actual logic for this endpoint.',
          source: 'Live Interview Transcript (Q1)'
        }
      ],
      recommendation: 'Advance to Offer discussion. Outstanding communication and technical base.'
    }
  ],
  reviews: [],
  decisions: [],
  auditLogs: [
    {
      _id: 'audit-1',
      actor: 'System',
      action: 'Resume Screening Complete',
      details: 'Parsed resume for Ananya Iyer. ATS Match Score: 84%. Advancing to Assessment.',
      timestamp: new Date().toISOString()
    }
  ]
};

// In-Memory Database Store (Fallback)
let useMemoryDb = true;
const memoryDb = {
  users: [...seedData.users],
  jobs: [...seedData.jobs],
  candidates: [...seedData.candidates],
  applications: [...seedData.applications],
  assessments: [...seedData.assessments],
  evaluations: [...seedData.evaluations],
  reviews: [...seedData.reviews],
  decisions: [...seedData.decisions],
  auditLogs: [...seedData.auditLogs],
  otps: []
};

// MongoDB Mongoose Schemas Definition
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['Admin', 'Recruiter', 'Hiring Manager', 'Candidate'] },
  avatar: { type: String },
  organization: { type: String }
});

const JobSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true },
  department: { type: String },
  location: { type: String },
  type: { type: String },
  experience: { type: String },
  salary: { type: String },
  status: { type: String, default: 'Active' },
  description: { type: String },
  skills: [{ type: String }],
  applicantsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const CandidateSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  skills: [{ type: String }],
  resumeUrl: { type: String },
  experience: { type: String },
  education: { type: String },
  currentCompany: { type: String }
});

const ApplicationSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  candidateId: { type: String, required: true },
  jobId: { type: String, required: true },
  stage: { type: String, default: 'Applied' },
  status: { type: String, default: 'Active' },
  atsScore: { type: Number, default: 0 },
  assessmentScore: { type: Number, default: 0 },
  interviewScore: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const AssessmentSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true },
  jobId: { type: String, required: true },
  timeLimit: { type: Number },
  questions: [Schema.Types.Mixed]
});

const EvaluationSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  applicationId: { type: String, required: true },
  candidateId: { type: String, required: true },
  overallScore: { type: Number },
  confidenceRating: { type: Number },
  criteria: [Schema.Types.Mixed],
  evidence: [Schema.Types.Mixed],
  recommendation: { type: String }
});

const ReviewSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  applicationId: { type: String, required: true },
  reviewerId: { type: String, required: true },
  reviewerName: { type: String },
  recommendation: { type: String }, // Approve, Reject, Escalate
  notes: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const DecisionSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  applicationId: { type: String, required: true },
  actorId: { type: String, required: true },
  actorName: { type: String },
  status: { type: String }, // Hired, Rejected, On Hold
  reason: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const AuditLogSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  actor: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const OTPSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, required: true, enum: ['login', 'register', 'password_reset'] },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 }
});

const CommunicationLogSchema = new Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  applicationId: { type: String, required: true },
  candidateId: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  notificationType: { type: String, enum: ['assessment_link', 'interview_invite', 'offer_letter', 'status_update'] },
  status: { type: String, enum: ['sent', 'delivered', 'failed', 'pending'], default: 'pending' },
  sentAt: { type: Date, default: Date.now },
  errorDetails: { type: String }
});

let Models = {};

// Initialize Mongoose Password Hashes
const bcrypt = require('bcryptjs');
const initPass = bcrypt.hashSync('password123', 10);
seedData.users.forEach(u => u.passwordHash = initPass);
memoryDb.users.forEach(u => u.passwordHash = initPass);

// Database Initialization Function
async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️  No MONGODB_URI environment variable set. Running in-memory sandbox database mode.');
    useMemoryDb = true;
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully.');
    useMemoryDb = false;

    // Compile models
    Models.User = mongoose.model('User', UserSchema);
    Models.Job = mongoose.model('Job', JobSchema);
    Models.Candidate = mongoose.model('Candidate', CandidateSchema);
    Models.Application = mongoose.model('Application', ApplicationSchema);
    Models.Assessment = mongoose.model('Assessment', AssessmentSchema);
    Models.Evaluation = mongoose.model('Evaluation', EvaluationSchema);
    Models.Review = mongoose.model('Review', ReviewSchema);
    Models.Decision = mongoose.model('Decision', DecisionSchema);
    Models.AuditLog = mongoose.model('AuditLog', AuditLogSchema);
    Models.OTP = mongoose.model('OTP', OTPSchema);
    Models.CommunicationLog = mongoose.model('CommunicationLog', CommunicationLogSchema);

    // Seed database if empty
    const userCount = await Models.User.countDocuments();
    if (userCount === 0) {
      await Models.User.insertMany(seedData.users);
      await Models.Job.insertMany(seedData.jobs);
      await Models.Candidate.insertMany(seedData.candidates);
      await Models.Application.insertMany(seedData.applications);
      await Models.Assessment.insertMany(seedData.assessments);
      await Models.Evaluation.insertMany(seedData.evaluations);
      await Models.AuditLog.insertMany(seedData.auditLogs);
      console.log('✅ Seeded MongoDB with default developer data.');
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️  Falling back to in-memory sandbox database mode.');
    useMemoryDb = true;
  }
}

// Global DB Operations API
const db = {
  connect: connectDb,
  isMemory: () => useMemoryDb,
  memoryDb: memoryDb,


  // Audit Logs Helper
  addAuditLog: async (actor, action, details) => {
    const log = {
      _id: 'audit-' + Math.random().toString(36).substring(2, 9),
      actor,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    if (useMemoryDb) {
      memoryDb.auditLogs.unshift(log);
      return log;
    } else {
      const newLog = new Models.AuditLog(log);
      return await newLog.save();
    }
  },
  getAuditLogs: async () => {
    return useMemoryDb ? memoryDb.auditLogs : await Models.AuditLog.find().sort({ timestamp: -1 });
  },

  // Users Operations
  findUserByEmail: async (email) => {
    if (useMemoryDb) {
      return memoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      return await Models.User.findOne({ email: new RegExp('^' + email + '$', 'i') });
    }
  },
  updateUser: async (email, updateFields) => {
    if (useMemoryDb) {
      const u = memoryDb.users.find(usr => usr.email.toLowerCase() === email.toLowerCase());
      if (u) {
        Object.assign(u, updateFields);
        return u;
      }
      return null;
    } else {
      return await Models.User.findOneAndUpdate({ email: new RegExp('^' + email + '$', 'i') }, updateFields, { new: true });
    }
  },
  createUser: async (userObj) => {
    const newUser = {
      _id: 'user-' + Math.random().toString(36).substring(2, 9),
      ...userObj,
      avatar: userObj.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };
    if (useMemoryDb) {
      memoryDb.users.push(newUser);
      // Create a matching candidate model if the signup is a candidate
      if (newUser.role === 'Candidate') {
        memoryDb.candidates.push({
          _id: 'cand-' + Math.random().toString(36).substring(2, 9),
          name: newUser.name,
          email: newUser.email,
          phone: '',
          skills: [],
          experience: '',
          education: ''
        });
      }
      return newUser;
    } else {
      const user = new Models.User(newUser);
      const savedUser = await user.save();
      if (savedUser.role === 'Candidate') {
        const newCand = new Models.Candidate({
          name: savedUser.name,
          email: savedUser.email,
          skills: [],
          experience: '',
          education: ''
        });
        await newCand.save();
      }
      return savedUser;
    }
  },

  // Jobs Operations
  getJobs: async () => {
    return useMemoryDb ? memoryDb.jobs : await Models.Job.find();
  },
  createJob: async (jobObj) => {
    const newJob = {
      _id: 'job-' + Math.random().toString(36).substring(2, 9),
      ...jobObj,
      applicantsCount: 0,
      createdAt: new Date().toISOString()
    };
    if (useMemoryDb) {
      memoryDb.jobs.push(newJob);
      return newJob;
    } else {
      const job = new Models.Job(newJob);
      return await job.save();
    }
  },

  // Candidates
  getCandidates: async () => {
    return useMemoryDb ? memoryDb.candidates : await Models.Candidate.find();
  },
  getCandidateById: async (id) => {
    if (useMemoryDb) {
      return memoryDb.candidates.find(c => c._id === id);
    } else {
      return await Models.Candidate.findById(id);
    }
  },
  createCandidate: async (candidateObj) => {
    const newCand = {
      _id: 'cand-' + Math.random().toString(36).substring(2, 9),
      ...candidateObj
    };
    if (useMemoryDb) {
      memoryDb.candidates.push(newCand);
      return newCand;
    } else {
      const cand = new Models.Candidate(newCand);
      return await cand.save();
    }
  },

  // Applications
  getApplications: async () => {
    return useMemoryDb ? memoryDb.applications : await Models.Application.find();
  },
  getApplicationById: async (id) => {
    if (useMemoryDb) {
      return memoryDb.applications.find(a => a._id === id);
    } else {
      return await Models.Application.findById(id);
    }
  },
  updateApplicationStage: async (id, stage) => {
    if (useMemoryDb) {
      const app = memoryDb.applications.find(a => a._id === id);
      if (app) {
        app.stage = stage;
        return app;
      }
      return null;
    } else {
      return await Models.Application.findByIdAndUpdate(id, { stage }, { new: true });
    }
  },
  updateApplication: async (id, updateFields) => {
    if (useMemoryDb) {
      const app = memoryDb.applications.find(a => a._id === id);
      if (app) {
        Object.assign(app, updateFields);
        return app;
      }
      return null;
    } else {
      return await Models.Application.findByIdAndUpdate(id, updateFields, { new: true });
    }
  },
  createApplication: async (appObj) => {
    const newApp = {
      _id: 'app-' + Math.random().toString(36).substring(2, 9),
      ...appObj,
      createdAt: new Date().toISOString()
    };
    if (useMemoryDb) {
      memoryDb.applications.push(newApp);
      // Increment job applicant counter
      const job = memoryDb.jobs.find(j => j._id === appObj.jobId);
      if (job) job.applicantsCount += 1;
      return newApp;
    } else {
      const app = new Models.Application(newApp);
      const savedApp = await app.save();
      await Models.Job.findByIdAndUpdate(appObj.jobId, { $inc: { applicantsCount: 1 } });
      return savedApp;
    }
  },
  deleteApplication: async (id) => {
    if (useMemoryDb) {
      const idx = memoryDb.applications.findIndex(a => a._id === id);
      if (idx !== -1) {
        memoryDb.applications.splice(idx, 1);
        return true;
      }
      return false;
    } else {
      await Models.Application.findByIdAndDelete(id);
      return true;
    }
  },

  // Assessments
  getAssessments: async () => {
    return useMemoryDb ? memoryDb.assessments : await Models.Assessment.find();
  },

  // Evaluations
  getEvaluationByApplicationId: async (appId) => {
    if (useMemoryDb) {
      return memoryDb.evaluations.find(e => e.applicationId === appId);
    } else {
      return await Models.Evaluation.findOne({ applicationId: appId });
    }
  },
  createEvaluation: async (evalObj) => {
    const newEval = {
      _id: 'eval-' + Math.random().toString(36).substring(2, 9),
      ...evalObj
    };
    if (useMemoryDb) {
      memoryDb.evaluations.push(newEval);
      return newEval;
    } else {
      const evaluation = new Models.Evaluation(newEval);
      return await evaluation.save();
    }
  },

  // HR Review
  createReview: async (reviewObj) => {
    const newReview = {
      _id: 'review-' + Math.random().toString(36).substring(2, 9),
      ...reviewObj,
      timestamp: new Date().toISOString()
    };
    if (useMemoryDb) {
      memoryDb.reviews.push(newReview);
      return newReview;
    } else {
      const r = new Models.Review(newReview);
      return await r.save();
    }
  },

  // Decisions
  createDecision: async (decObj) => {
    const newDec = {
      _id: 'dec-' + Math.random().toString(36).substring(2, 9),
      ...decObj,
      timestamp: new Date().toISOString()
    };
    if (useMemoryDb) {
      memoryDb.decisions.push(newDec);
      const app = memoryDb.applications.find(a => a._id === decObj.applicationId);
      if (app) {
        app.status = decObj.status === 'Hired' ? 'Hired' : 'Rejected';
      }
      return newDec;
    } else {
      const dec = new Models.Decision(newDec);
      const savedDec = await dec.save();
      const statusMap = { 'Hired': 'Hired', 'Rejected': 'Rejected' };
      if (statusMap[decObj.status]) {
        await Models.Application.findByIdAndUpdate(decObj.applicationId, { status: statusMap[decObj.status] });
      }
      return savedDec;
    }
  },

  // OTP Operations
  createOTP: async (otpObj) => {
    const newOTP = {
      _id: 'otp-' + Math.random().toString(36).substring(2, 9),
      ...otpObj,
      createdAt: new Date().toISOString()
    };
    if (useMemoryDb) {
      memoryDb.otps = memoryDb.otps || [];
      memoryDb.otps.push(newOTP);
      return newOTP;
    } else {
      const otp = new Models.OTP(newOTP);
      return await otp.save();
    }
  },
  getOTPByEmail: async (email) => {
    if (useMemoryDb) {
      const otps = (memoryDb.otps || []).filter(o => o.email.toLowerCase() === email.toLowerCase());
      return otps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
    } else {
      return await Models.OTP.findOne({ email: new RegExp('^' + email + '$', 'i') }).sort({ createdAt: -1 });
    }
  },
  updateOTP: async (id, updateFields) => {
    if (useMemoryDb) {
      const otp = memoryDb.otps.find(o => o._id === id);
      if (otp) {
        Object.assign(otp, updateFields);
        return otp;
      }
      return null;
    } else {
      return await Models.OTP.findByIdAndUpdate(id, updateFields, { new: true });
    }
  },
  deleteExpiredOTPs: async () => {
    if (useMemoryDb) {
      const now = new Date();
      memoryDb.otps = (memoryDb.otps || []).filter(o => new Date(o.expiresAt) > now);
    } else {
      await Models.OTP.deleteMany({ expiresAt: { $lt: new Date() } });
    }
  },
  deleteOTPByEmail: async (email) => {
    if (useMemoryDb) {
      memoryDb.otps = (memoryDb.otps || []).filter(o => o.email.toLowerCase() !== email.toLowerCase());
    } else {
      await Models.OTP.deleteMany({ email: new RegExp('^' + email + '$', 'i') });
    }
  },

  // Communication Logs
  createCommunicationLog: async (logObj) => {
    const newLog = {
      _id: 'comm-' + Math.random().toString(36).substring(2, 9),
      ...logObj,
      sentAt: new Date().toISOString()
    };
    if (useMemoryDb) {
      memoryDb.communicationLogs = memoryDb.communicationLogs || [];
      memoryDb.communicationLogs.push(newLog);
      return newLog;
    } else {
      const log = new Models.CommunicationLog(newLog);
      return await log.save();
    }
  }
};

module.exports = db;
