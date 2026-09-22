const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const WebSocket = require('ws');
const db = require('./config/db');
const AIOrchestrator = require('./services/aiOrchestrator');
const emailService = require('./services/emailService');


const app = express();
app.use(cors());
app.use(express.json());

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, process.env.JWT_SECRET || 'sayraa-jwt-secret-key-super-secure-change-me', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
}

// ── REST API ROUTES ──

const NAME_REGEX = /^[A-Za-z][A-Za-z ]{1,49}$/;
const GMAIL_REGEX = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Auth routes
app.post('/api/v1/auth/signup', async (req, res) => {
  const { name, email, password, role, organization } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required signup fields' });
  }

  if (!NAME_REGEX.test(name.trim())) {
    return res.status(400).json({ error: 'Name must be 2–50 characters long, start with a letter, and contain only letters and spaces.' });
  }

  if (!GMAIL_REGEX.test(email.trim().toLowerCase())) {
    return res.status(400).json({ error: 'Please enter a valid Gmail address ending in @gmail.com.' });
  }

  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).' });
  }

  try {
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db.createUser({
      name,
      email,
      passwordHash,
      role,
      organization: organization || 'None'
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET || 'sayraa-jwt-secret-key-super-secure-change-me',
      { expiresIn: '24h' }
    );

    await db.addAuditLog('System', 'User Registration', `New user registered: ${name} (${role})`);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        organization: newUser.organization
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPass = await bcrypt.compare(password, user.passwordHash);
    if (!validPass) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'sayraa-jwt-secret-key-super-secure-change-me',
      { expiresIn: '24h' }
    );

    await db.addAuditLog(user.name, 'User Authentication', `${user.name} logged in successfully.`);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Google Firebase Authentication Endpoint
app.post('/api/v1/auth/google', async (req, res) => {
  const { email, name, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required for Google Sign-In' });
  }

  try {
    let user = await db.findUserByEmail(email);

    if (!user) {
      // Auto-register new Google user as Candidate
      const dummyPasswordHash = await bcrypt.hash(Math.random().toString(36), 10);
      user = await db.createUser({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        passwordHash: dummyPasswordHash,
        role: 'Candidate',
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split('@')[0])}&background=5B21B6&color=ffffff&bold=true&size=200`,
        organization: 'None'
      });

      await db.addAuditLog('System', 'Google OAuth Registration', `New user registered via Google: ${user.name} (${user.email})`);
    } else {
      if (avatar) {
        user = await db.updateUser(email, { avatar });
      }
      await db.addAuditLog(user.name, 'Google OAuth Login', `${user.name} signed in with Google.`);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, avatar: user.avatar },
      process.env.JWT_SECRET || 'sayraa-jwt-secret-key-super-secure-change-me',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization
      }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// OTP-based Authentication
app.post('/api/v1/auth/send-otp', async (req, res) => {
  const { email, purpose = 'login' } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!GMAIL_REGEX.test(email.trim().toLowerCase())) {
    return res.status(400).json({ error: 'Please enter a valid Gmail address ending in @gmail.com.' });
  }

  try {
    const otp = emailService.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.deleteExpiredOTPs();
    await db.deleteOTPByEmail(email.toLowerCase());

    await db.createOTP({
      email: email.toLowerCase(),
      otp,
      purpose,
      expiresAt
    });

    const emailResult = await emailService.sendOTPEmail(email.toLowerCase(), otp, purpose);
    if (emailResult && emailResult.success === false) {
      return res.status(500).json({ error: emailResult.error || 'Failed to send OTP email via SMTP' });
    }

    await db.addAuditLog('System', 'OTP Sent', `OTP sent to ${email} for ${purpose}`);

    res.json({ message: 'OTP sent successfully to your Gmail address', expiresIn: 600 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/auth/verify-otp', async (req, res) => {
  const { email, otp, name, password, role, organization } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const record = await db.getOTPByEmail(email);
    if (!record) {
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }

    if (record.verified) {
      return res.status(400).json({ error: 'OTP has already been used. Please request a new one.' });
    }

    if (new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (record.attempts >= 5) {
      return res.status(400).json({ error: 'Too many failed attempts. Please request a new OTP.' });
    }

    if (record.otp !== otp) {
      await db.updateOTP(record._id, { attempts: record.attempts + 1 });
      return res.status(400).json({ error: `Invalid OTP. ${5 - record.attempts - 1} attempts remaining.` });
    }

    await db.updateOTP(record._id, { verified: true });

    let user = await db.findUserByEmail(email);
    const cleanEmail = email.toLowerCase().trim();
    const emailHash = crypto.createHash('md5').update(cleanEmail).digest('hex');
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split('@')[0])}&background=5B21B6&color=ffffff&bold=true&size=200`;
    const userAvatar = `https://www.gravatar.com/avatar/${emailHash}?d=${encodeURIComponent(defaultAvatar)}&s=200`;

    if (!user) {
      const userPasswordHash = await bcrypt.hash(password || Math.random().toString(36), 10);
      user = await db.createUser({
        name: name || email.split('@')[0],
        email: cleanEmail,
        passwordHash: userPasswordHash,
        role: role || 'Candidate',
        organization: organization || 'None',
        avatar: userAvatar
      });
      await db.addAuditLog('System', 'OTP Registration', `New user registered via OTP: ${user.name} (${email})`);
    } else {
      user.avatar = userAvatar;
      await db.addAuditLog(user.name, 'OTP Login', `${user.name} signed in with OTP.`);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, avatar: user.avatar },
      process.env.JWT_SECRET || 'sayraa-jwt-secret-key-super-secure-change-me',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Email Notifications API
app.post('/api/v1/notifications/assessment', authenticateToken, async (req, res) => {
  const { candidateEmail, candidateName, jobTitle, appId, jobId } = req.body;
  if (!candidateEmail || !candidateName || !jobTitle || !appId || !jobId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await emailService.sendAssessmentInvite(candidateEmail, candidateName, jobTitle, appId, jobId);
    await db.addAuditLog(req.user.name, 'Assessment Email Sent', `Assessment invite sent to ${candidateEmail} for ${jobTitle}`);
    res.json({ success: result.success, messageId: result.messageId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/notifications/interview', authenticateToken, async (req, res) => {
  const { candidateEmail, candidateName, jobTitle, appId, candidateId, jobId } = req.body;
  if (!candidateEmail || !candidateName || !jobTitle || !appId || !candidateId || !jobId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await emailService.sendInterviewInvite(candidateEmail, candidateName, jobTitle, appId, candidateId, jobId);
    await db.addAuditLog(req.user.name, 'Interview Email Sent', `Interview invite sent to ${candidateEmail} for ${jobTitle}`);
    res.json({ success: result.success, messageId: result.messageId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/notifications/offer', authenticateToken, async (req, res) => {
  const { candidateEmail, candidateName, jobTitle, department, startDate, appId } = req.body;
  if (!candidateEmail || !candidateName || !jobTitle || !appId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await emailService.sendOfferLetter(candidateEmail, candidateName, jobTitle, department, startDate, appId);
    await db.addAuditLog(req.user.name, 'Offer Email Sent', `Offer letter sent to ${candidateEmail} for ${jobTitle}`);
    res.json({ success: result.success, messageId: result.messageId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Jobs API
app.get('/api/v1/jobs', async (req, res) => {
  try {
    const jobs = await db.getJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/jobs', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Recruiter' && req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Unauthorized role' });
  }

  try {
    const job = await db.createJob(req.body);
    await db.addAuditLog(req.user.name, 'Create Job Posting', `Created job: ${job.title} (${job.department})`);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Candidates API
app.get('/api/v1/candidates', authenticateToken, async (req, res) => {
  try {
    const candidates = await db.getCandidates();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Applications API
app.get('/api/v1/applications', authenticateToken, async (req, res) => {
  try {
    const apps = await db.getApplications();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/applications', authenticateToken, async (req, res) => {
  const { jobId, candidateId, resumeText } = req.body;
  if (!jobId || !candidateId) {
    return res.status(400).json({ error: 'Missing jobId or candidateId' });
  }

  try {
    const candidate = await db.getCandidateById(candidateId);
    const jobs = await db.getJobs();
    const job = jobs.find(j => j._id === jobId);

    if (!candidate || !job) {
      return res.status(404).json({ error: 'Candidate or Job not found' });
    }

    // AI resume parsing matching
    const parsed = await AIOrchestrator.parseResume('resume.txt', resumeText || candidate.skills.join(', '));
    const screening = await AIOrchestrator.atsScreen(parsed.skills, job.skills);

    const appObj = {
      candidateId,
      jobId,
      stage: 'Assessment',
      status: 'Active',
      atsScore: screening.score,
      overallScore: screening.score
    };

    const application = await db.createApplication(appObj);
    await db.addAuditLog('System', 'Candidate Applied', `Applied: ${candidate.name} to ${job.title}. ATS Score: ${screening.score}%`);
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/v1/applications/:id/stage', authenticateToken, async (req, res) => {
  const { stage } = req.body;
  try {
    const application = await db.updateApplicationStage(req.params.id, stage);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    const cand = await db.getCandidateById(application.candidateId);
    const job = (await db.getJobs()).find(j => j._id === application.jobId);

    await db.addAuditLog(req.user.name, 'Update Stage', `Moved candidate ${cand?.name || 'User'} to stage ${stage}`);

    if (stage === 'Assessment' && cand && job) {
      emailService.sendAssessmentInvite(cand.email, cand.name, job.title, application._id, job._id).then(result => {
        db.createCommunicationLog({
          applicationId: application._id,
          candidateId: application.candidateId,
          recipientEmail: cand.email,
          notificationType: 'assessment_link',
          status: result.success ? 'sent' : 'failed',
          errorDetails: result.error || ''
        });
      });
    } else if (stage === 'AI Interview' && cand && job) {
      emailService.sendInterviewInvite(cand.email, cand.name, job.title, application._id, application.candidateId, job._id).then(result => {
        db.createCommunicationLog({
          applicationId: application._id,
          candidateId: application.candidateId,
          recipientEmail: cand.email,
          notificationType: 'interview_invite',
          status: result.success ? 'sent' : 'failed',
          errorDetails: result.error || ''
        });
      });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/v1/applications/:id', authenticateToken, async (req, res) => {
  try {
    const success = await db.deleteApplication(req.params.id);
    if (!success) return res.status(404).json({ error: 'Application not found' });
    await db.addAuditLog(req.user.name, 'Withdraw Application', `Application ${req.params.id} withdrawn/deleted`);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/applications/:id/assessment', authenticateToken, async (req, res) => {
  const { score } = req.body;
  if (score === undefined) {
    return res.status(400).json({ error: 'Missing assessment score' });
  }
  try {
    const app = await db.getApplicationById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const updatedApp = await db.updateApplication(req.params.id, {
      assessmentScore: score,
      stage: 'AI Interview'
    });

    const cand = await db.getCandidateById(app.candidateId);
    await db.addAuditLog(req.user.name, 'Assessment Complete', `Candidate ${cand?.name || 'User'} completed assessment. Score: ${score}%`);
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Evaluations lookup
app.get('/api/v1/applications/:id/evaluation', authenticateToken, async (req, res) => {
  try {
    const evaluation = await db.getEvaluationByApplicationId(req.params.id);
    if (!evaluation) return res.status(404).json({ error: 'Evaluation scorecard not found' });
    res.json(evaluation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HR Review submits
app.post('/api/v1/applications/:id/review', authenticateToken, async (req, res) => {
  const { recommendation, notes } = req.body;
  try {
    const review = await db.createReview({
      applicationId: req.params.id,
      reviewerId: req.user.id,
      reviewerName: req.user.name,
      recommendation,
      notes
    });

    const app = await db.getApplicationById(req.params.id);
    const cand = await db.getCandidateById(app.candidateId);

    // Advance to Final Decision stage
    await db.updateApplicationStage(req.params.id, 'Final Decision');
    await db.addAuditLog(req.user.name, 'HR Review Complete', `Reviewed application for ${cand?.name}. Recommendation: ${recommendation}`);

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Final Decision submits
app.post('/api/v1/applications/:id/decision', authenticateToken, async (req, res) => {
  const { status, reason } = req.body; // Hired, Rejected, On Hold
  try {
    const decision = await db.createDecision({
      applicationId: req.params.id,
      actorId: req.user.id,
      actorName: req.user.name,
      status,
      reason
    });

    const app = await db.getApplicationById(req.params.id);
    const cand = await db.getCandidateById(app.candidateId);
    const job = (await db.getJobs()).find(j => j._id === app.jobId);

    await db.addAuditLog(req.user.name, 'Final Hiring Decision', `Finalized decision for ${cand?.name}: ${status}`);

    if (status === 'Hired' && cand && job) {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + 14);
      const formattedDate = startDate.toISOString().split('T')[0];

      emailService.sendOfferLetter(cand.email, cand.name, job.title, job.department, formattedDate, app._id).then(result => {
        db.createCommunicationLog({
          applicationId: app._id,
          candidateId: app.candidateId,
          recipientEmail: cand.email,
          notificationType: 'offer_letter',
          status: result.success ? 'sent' : 'failed',
          errorDetails: result.error || ''
        });
      });
    }

    res.json(decision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Audit Logs lookup
app.get('/api/v1/audit-logs', authenticateToken, async (req, res) => {
  try {
    const logs = await db.getAuditLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assessments lookup
app.get('/api/v1/assessments', authenticateToken, async (req, res) => {
  try {
    const assessments = await db.getAssessments();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// JSON Parse Error Handler (returns clean 400 instead of stack trace)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
});

// Create Server
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

// Attach WebSocket Upgrade handler
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  
  if (pathname === '/ws/interview') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Live AI Interview Room WebSocket orchestrator
wss.on('connection', async (ws, request) => {
  const urlParams = new URL(request.url, `http://${request.headers.host}`).searchParams;
  const applicationId = urlParams.get('applicationId');
  const candidateId = urlParams.get('candidateId');
  const jobId = urlParams.get('jobId');

  console.log(`🔌 WS Connection Opened: AppId: ${applicationId}, CandidateId: ${candidateId}`);

  if (!applicationId || !candidateId || !jobId) {
    ws.send(JSON.stringify({ type: 'error', message: 'Missing routing parameters' }));
    ws.close();
    return;
  }

  // Load Job skills & Candidate details
  const jobs = await db.getJobs();
  const job = jobs.find(j => j._id === jobId);
  const candidates = await db.getCandidates();
  const candidate = candidates.find(c => c._id === candidateId);

  const skills = job ? job.skills : ['React', 'Node.js'];
  const jobTitle = job ? job.title : 'Software Engineer';
  const candName = candidate ? candidate.name : 'Candidate';

  const questions = AIOrchestrator.generateInterviewQuestions(jobTitle, skills);
  let currentQuestionIndex = -1;
  const transcriptBuffer = [];

  // Send Initial Assistant Greeting
  ws.send(JSON.stringify({
    type: 'speech',
    sender: 'Sayraa',
    text: `Namaste ${candName}! Main hoon Sayraa, aapki screening assistant. Main aapse ${jobTitle} role ke liye kuch sawal poochungi. Kya hum interview shuru karein?`,
    audioState: 'speaking'
  }));

  transcriptBuffer.push({
    sender: 'Sayraa',
    text: `Namaste ${candName}! Main hoon Sayraa, aapki screening assistant. Main aapse ${jobTitle} role ke liye kuch sawal poochungi. Kya hum interview shuru karein?`,
    timestamp: new Date().toISOString()
  });

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'response') {
        const candidateResponse = data.text;
        
        // Log client response
        transcriptBuffer.push({
          sender: 'Candidate',
          text: candidateResponse,
          timestamp: new Date().toISOString()
        });

        // Loop next question
        currentQuestionIndex += 1;
        
        if (currentQuestionIndex < questions.length) {
          const nextQuestion = questions[currentQuestionIndex];
          
          ws.send(JSON.stringify({
            type: 'speech',
            sender: 'Sayraa',
            text: nextQuestion.text,
            focus: nextQuestion.focus,
            audioState: 'speaking'
          }));

          transcriptBuffer.push({
            sender: 'Sayraa',
            text: nextQuestion.text,
            focus: nextQuestion.focus,
            timestamp: new Date().toISOString()
          });
        } else {
          // Interview complete! Evaluate interview responses
          ws.send(JSON.stringify({
            type: 'speech',
            sender: 'Sayraa',
            text: 'Dhanyawaad! Aapka interview safaltapoorvak poora ho chuka hai. Main ab aapka evaluation scorecard generate kar rahi hoon. Ek pal intezaar karein.',
            audioState: 'speaking'
          }));

          transcriptBuffer.push({
            sender: 'Sayraa',
            text: 'Dhanyawaad! Aapka interview safaltapoorvak poora ho chuka hai. Main ab aapka evaluation scorecard generate kar rahi hoon. Ek pal intezaar karein.',
            timestamp: new Date().toISOString()
          });

          // Generate scorecard evaluation with evidence mapping
          const scorecard = await AIOrchestrator.evaluateInterview(applicationId, candidateId, transcriptBuffer);

          // Update application stage to "HR Review" and score
          const app = await db.getApplicationById(applicationId);
          if (app) {
            const overallScore = Math.round((app.atsScore + app.assessmentScore + scorecard.overallScore) / 3);
            await db.updateApplication(applicationId, {
              stage: 'HR Review',
              interviewScore: scorecard.overallScore,
              overallScore: overallScore
            });
          }

          await db.addAuditLog('Sayraa Screening Assistant', 'AI Interview Complete', `AI Screening finished for candidate ${candName}. Overall AI score: ${scorecard.overallScore}%`);

          ws.send(JSON.stringify({
            type: 'complete',
            scorecard
          }));
          
          console.log(`🔌 WS Connection Complete: Evaluation Generated for Application: ${applicationId}`);
        }
      }
    } catch (e) {
      console.error('WS Message parsing error:', e.message);
      ws.send(JSON.stringify({ type: 'error', message: 'Failed to process message' }));
    }
  });

  ws.on('close', () => {
    console.log(`🔌 WS Connection Closed: AppId: ${applicationId}`);
  });
});

// Start Server & Database
const PORT = process.env.PORT || 5000;
db.connect().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Sayraa AI HR Backend running on port ${PORT}`);
  });
});
