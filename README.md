# 🤖 Sayraa AI HR Workforce

> **AI-powered recruitment and talent management platform** with smart job matching, AI resume screening, skill assessments, HR evaluation, and live AI interviews powered by **Sayraa**.

Sayraa AI HR Workforce is a full-stack recruitment platform designed to streamline the hiring lifecycle for **candidates, recruiters, and HR teams**.

The platform combines a modern React frontend with an Express.js backend, MongoDB, Firebase authentication, AI-powered recruitment workflows, Gmail OTP/email notifications, and real-time WebSocket interviews.

---

## ✨ Key Features

### 🔐 Authentication

* Email/password registration and login
* JWT-based authentication
* Google Sign-In through Firebase
* Gmail OTP verification
* Role-based access for Candidates, Recruiters, and Admins
* Protected application routes

### 💼 Job Marketplace

* Browse available jobs
* View job descriptions and required skills
* Recruiter/Admin job posting
* Job-based candidate applications
* Skill requirement matching

### 📄 AI Resume Screening

* Resume upload
* Resume text parsing
* Skill extraction and normalization
* ATS-style resume scoring
* Job-to-resume skill matching
* AI-generated screening feedback

### 📝 Skill Assessments

* MCQ assessments
* Coding-oriented assessments
* Automatic scoring
* Candidate assessment tracking
* Assessment results for recruiters

### 🤖 Sayraa AI Interview

* Live AI-powered interview room
* Real-time WebSocket communication
* Role-specific interview questions
* Candidate response processing
* Interview transcript capture
* Browser speech synthesis
* AI interviewer persona named **Sayraa**

### 🔄 Recruitment Pipeline

The platform supports the complete hiring workflow:

```text
Application
     ↓
AI Resume Screening
     ↓
Assessment
     ↓
AI Evaluation
     ↓
HR Review
     ↓
Final Decision
     ↓
Offer Letter
```

### 📊 Recruiter & HR Analytics

* Application pipeline
* Candidate directory
* Hiring analytics
* Evaluation reports
* Compliance/bias audit reports
* Audit logs
* Recruitment activity tracking

### 📧 Email Notifications

Email workflows include:

* Gmail OTP verification
* Assessment invitations
* Interview invitations
* Offer letters

If SMTP credentials are not configured, email messages can be logged to the server console for development.

---

# 🏗️ Project Architecture

```text
Sayraa-Hr-Workforce/
│
├── frontend/                 # React + Vite frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
│
├── backend/                  # Express REST API + WebSocket server
│   ├── config/
│   ├── services/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── README.md
│
└── README.md                 # Project documentation
```

---

# 🧱 Tech Stack

## Frontend

| Technology       | Purpose               |
| ---------------- | --------------------- |
| React 18         | UI framework          |
| Vite 5           | Build tool            |
| Tailwind CSS 3   | Styling               |
| Framer Motion    | Animations            |
| Recharts         | Analytics and charts  |
| Lucide React     | Icons                 |
| Firebase         | Google authentication |
| Native WebSocket | Real-time interview   |
| ESLint           | Code quality          |

## Backend

| Technology            | Purpose               |
| --------------------- | --------------------- |
| Node.js               | Runtime               |
| Express 4             | REST API              |
| MongoDB               | Database              |
| Mongoose 8            | MongoDB ODM           |
| JWT                   | Authentication        |
| bcryptjs              | Password hashing      |
| Firebase/Google OAuth | Google authentication |
| Nodemailer            | Email notifications   |
| Gmail SMTP            | Email delivery        |
| ws                    | WebSocket server      |

---

# 🎨 Frontend

The frontend is a React single-page application designed for both candidates and recruiters.

## Frontend Features

* Responsive recruitment dashboard
* Candidate dashboard
* Recruiter/Admin dashboard
* Job marketplace
* Resume upload
* AI screening results
* Applications pipeline
* Skill assessments
* Live AI interview
* Candidate evaluation
* HR review
* Final hiring decision
* Offer letter
* Analytics
* Reports
* Audit logs
* Settings
* Help and support

## Frontend Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   │   └── images & logos
│   │
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   │
│   ├── config/
│   │   └── firebase.js
│   │
│   ├── context/
│   │   └── AppContext.jsx
│   │
│   ├── pages/
│   │   └── application pages
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── vercel.json
└── package.json
```

---

# 🗺️ Frontend Routes

| Route           | Purpose                  |
| --------------- | ------------------------ |
| `/`             | Landing page             |
| `/login`        | Login                    |
| `/register`     | Registration             |
| `/otp-auth`     | Gmail OTP authentication |
| `/dashboard`    | Role-based dashboard     |
| `/jobs`         | Explore/post jobs        |
| `/profile`      | Candidate profile        |
| `/resume`       | Resume upload            |
| `/results`      | AI screening results     |
| `/applications` | Applications             |
| `/pipeline`     | Recruitment pipeline     |
| `/candidates`   | Candidate directory      |
| `/assessment`   | Skill assessment         |
| `/interview`    | Live AI interview        |
| `/evaluation`   | AI evaluation            |
| `/review`       | HR review                |
| `/decision`     | Final hiring decision    |
| `/offer`        | Offer letter             |
| `/analytics`    | Hiring analytics         |
| `/reports`      | Compliance reports       |
| `/logs`         | Audit logs               |
| `/settings`     | Account settings         |
| `/help`         | Help and support         |

---

# ⚙️ Backend

The backend provides the REST API and WebSocket infrastructure required by the frontend.

## Backend Responsibilities

* Authentication
* Authorization
* Job management
* Candidate management
* Applications
* Resume processing
* AI screening
* Assessments
* Evaluations
* HR reviews
* Hiring decisions
* Email notifications
* Audit logging
* WebSocket interviews
* Demo data seeding

## Backend Structure

```text
backend/
├── config/
│   └── db.js
│
├── services/
│   ├── aiOrchestrator.js
│   └── emailService.js
│
├── uploads/
│   └── candidate resumes
│
├── .env.example
├── server.js
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Install the following before starting:

* **Node.js 18+**
* **npm**
* **MongoDB** local installation or MongoDB Atlas
* Firebase project for Google authentication
* Gmail account with an App Password if email delivery is required

---

# 📥 Clone the Repository

```bash
git clone https://github.com/subham-khandual/Sayraa-Hr-Workforce.git
cd Sayraa-Hr-Workforce
```

---

# 🔧 Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, you can also create/copy the file manually if `cp` is unavailable.

Configure the required values inside `.env`.

### Backend Environment Variables

| Variable             | Example/Default           | Purpose             |
| -------------------- | ------------------------- | ------------------- |
| `PORT`               | `5000`                    | Backend server port |
| `MONGODB_URI`        | MongoDB connection string | Database connection |
| `JWT_SECRET`         | Strong random secret      | JWT signing         |
| `NODE_ENV`           | `development`             | Environment         |
| `GMAIL_USER`         | Your Gmail address        | SMTP sender         |
| `GMAIL_APP_PASSWORD` | Gmail App Password        | SMTP authentication |
| `SMTP_HOST`          | `smtp.gmail.com`          | SMTP server         |
| `SMTP_PORT`          | `587`                     | SMTP port           |
| `SMTP_SECURE`        | `false`                   | SMTP security       |
| `SMTP_USER`          | SMTP username             | SMTP fallback       |
| `SMTP_PASS`          | SMTP password             | SMTP fallback       |

> **Security:** Never commit `.env`, Gmail App Passwords, JWT secrets, or other credentials to GitHub.

---

# ▶️ Start Backend

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Backend runs by default at:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs by default at:

```text
http://localhost:5173
```

The Vite configuration proxies API and WebSocket requests to the backend during development.

---

# 🔗 Frontend ↔ Backend

During development:

```text
Browser
   │
   ▼
React + Vite
localhost:5173
   │
   ├── /api/*
   │
   └── /ws/*
          │
          ▼
Express Backend
localhost:5000
          │
          ▼
       MongoDB
```

---

# 📡 REST API

Base API:

```text
/api/v1
```

## Authentication

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | `/auth/signup`     | Register user         |
| POST   | `/auth/signin`     | Login                 |
| POST   | `/auth/google`     | Google authentication |
| POST   | `/auth/send-otp`   | Send Gmail OTP        |
| POST   | `/auth/verify-otp` | Verify OTP            |

## Jobs

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/jobs`  | List jobs   |
| POST   | `/jobs`  | Create job  |

## Candidates

| Method | Endpoint      | Description     |
| ------ | ------------- | --------------- |
| GET    | `/candidates` | List candidates |

## Applications

| Method | Endpoint                       | Description           |
| ------ | ------------------------------ | --------------------- |
| GET    | `/applications`                | List applications     |
| POST   | `/applications`                | Submit application    |
| PUT    | `/applications/:id/stage`      | Update pipeline stage |
| DELETE | `/applications/:id`            | Withdraw application  |
| POST   | `/applications/:id/assessment` | Submit assessment     |
| GET    | `/applications/:id/evaluation` | Get evaluation        |
| POST   | `/applications/:id/review`     | Submit HR review      |
| POST   | `/applications/:id/decision`   | Submit final decision |

## Notifications

| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | `/notifications/assessment` | Assessment invitation |
| POST   | `/notifications/interview`  | Interview invitation  |
| POST   | `/notifications/offer`      | Offer letter          |

## Other

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | `/audit-logs`  | Audit trail     |
| GET    | `/assessments` | Assessment list |

---

# 📡 Live AI Interview

Sayraa uses a WebSocket connection for real-time interviews.

Connection:

```text
ws://localhost:5000/ws/interview?applicationId=<id>&candidateId=<id>&jobId=<id>
```

### Server → Client

```json
{
  "type": "speech",
  "sender": "Sayraa",
  "text": "Tell me about your experience with React.",
  "audioState": "speaking"
}
```

### Client → Server

```json
{
  "type": "response",
  "text": "I have worked with React for two years..."
}
```

The interview system can:

1. Identify the candidate's job/application.
2. Start the interview.
3. Generate role-specific questions.
4. Receive candidate responses.
5. Continue the interview conversation.
6. Maintain a transcript.
7. Provide interview evaluation data.

---

# 🌱 Demo Data

The backend can automatically seed demonstration data when the database is empty.

Demo data may include:

* Users
* Jobs
* Candidates
* Applications
* Assessments
* Evaluations
* HR reviews
* Hiring decisions
* Audit logs

For development/demo environments, seeded accounts use:

```text
password123
```

> ⚠️ Do not use seeded demo credentials in a production environment.

If MongoDB is unavailable, the backend can use an in-memory fallback so development APIs can still run.

---

# 📧 Email System

The backend uses **Nodemailer + Gmail SMTP** for email communication.

Supported emails include:

* OTP verification
* Assessment invitation
* Interview invitation
* Offer letter

If SMTP credentials are not configured, development messages can be logged to the console instead of being delivered.

---

# 🔥 Firebase Google Authentication

The frontend uses Firebase for Google Sign-In.

To enable Google authentication:

1. Create/open a Firebase project.
2. Enable **Google** under Firebase Authentication providers.
3. Configure the Firebase web application.
4. Add the development domain.
5. Add the production domain.
6. Configure the Firebase settings used by the frontend.

Firebase configuration should be handled securely according to Firebase's web configuration model and project rules.

---

# 📜 Frontend Scripts

From `frontend/`:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

| Command           | Purpose                  |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Create production build  |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

# 📜 Backend Scripts

From `backend/`:

```bash
npm run dev
npm start
```

| Command       | Purpose                              |
| ------------- | ------------------------------------ |
| `npm run dev` | Start backend with automatic restart |
| `npm start`   | Start production server              |

---

# ☁️ Deployment

## Frontend

The React/Vite frontend can be deployed using:

* Vercel
* Netlify
* Cloudflare Pages
* Firebase Hosting

For Vercel deployment:

```bash
cd frontend
npm install
npm run build
```

Then deploy the generated application through Vercel.

## Backend

The Express backend can be deployed on a Node.js-compatible hosting provider such as:

* Render
* Railway
* VPS
* Other Node.js hosting platforms

The production backend requires:

* MongoDB/MongoDB Atlas
* JWT secret
* SMTP credentials if email delivery is required
* Proper CORS configuration
* Production environment variables

---

# 🔐 Security Considerations

Before production deployment:

* Use a strong `JWT_SECRET`
* Never commit `.env`
* Never expose Gmail App Passwords
* Use HTTPS
* Configure production CORS
* Validate uploaded resumes/files
* Restrict upload size and file types
* Protect recruiter/admin APIs
* Use secure password hashing
* Remove or change demo credentials
* Review audit logging
* Apply rate limiting to authentication and OTP endpoints
* Configure secure WebSocket deployment
* Keep dependencies updated

---

# 🧪 Development Workflow

Recommended development workflow:

```text
1. Start MongoDB
       ↓
2. Start Backend
       ↓
3. Start Frontend
       ↓
4. Login/Register
       ↓
5. Create/Browse Job
       ↓
6. Apply with Resume
       ↓
7. AI Resume Screening
       ↓
8. Skill Assessment
       ↓
9. AI Interview
       ↓
10. AI Evaluation
       ↓
11. HR Review
       ↓
12. Final Decision
       ↓
13. Offer Letter
```

---

# 📊 Recruitment Lifecycle

```text
┌──────────────┐
│    Job       │
│   Posting    │
└──────┬───────┘
       ↓
┌──────────────┐
│ Application  │
└──────┬───────┘
       ↓
┌──────────────┐
│ AI Resume    │
│   Screening  │
└──────┬───────┘
       ↓
┌──────────────┐
│ Assessment   │
└──────┬───────┘
       ↓
┌──────────────┐
│ AI Interview │
└──────┬───────┘
       ↓
┌──────────────┐
│ Evaluation   │
└──────┬───────┘
       ↓
┌──────────────┐
│ HR Review    │
└──────┬───────┘
       ↓
┌────────────────────┐
│ Final Decision     │
│ Hired / Rejected / │
│ On Hold            │
└─────────┬──────────┘
          ↓
     ┌───────────┐
     │   Offer   │
     └───────────┘
```

---

# 🧑‍💻 Development

Clone the repository:

```bash
git clone https://github.com/subham-khandual/Sayraa-Hr-Workforce.git
cd Sayraa-Hr-Workforce
```

Install dependencies separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Run both applications in separate terminals.

---

# 📁 Repository Documentation

Additional documentation is available inside the individual applications:

```text
frontend/README.md
backend/README.md
```

The root README provides the overall architecture and setup, while the individual READMEs can contain frontend- or backend-specific implementation details.

---

# 🚧 Project Status

**Status:** Active Development

The platform is being developed as a full-stack AI-powered recruitment and workforce management system.

Current major modules include:

* Authentication
* Job management
* Candidate management
* Resume screening
* Application pipeline
* Skill assessments
* AI interviews
* HR evaluation
* Hiring decisions
* Email notifications
* Analytics
* Audit logs

---

# 👥 User Roles

## Candidate

Candidates can:

* Create an account
* Sign in with Google
* Verify through Gmail OTP
* Browse jobs
* Apply for jobs
* Upload resumes
* View AI screening results
* Complete assessments
* Attend AI interviews
* View application progress

## Recruiter

Recruiters can:

* Create job postings
* View candidates
* Review applications
* View screening results
* Manage assessments
* Review evaluations
* Conduct HR reviews
* Manage hiring decisions

## Admin

Administrators can manage recruitment operations, users, jobs, reports, audit logs, and platform-level workflows.

---

# 🔗 Repository

**GitHub:**
https://github.com/subham-khandual/Sayraa-Hr-Workforce

---

# 📄 License

Add the project's license here when one has been selected.

---

## Built With ❤️

**Sayraa AI HR Workforce**

An AI-powered platform designed to connect **talent, recruiters, and opportunities** through a modern digital hiring experience.
