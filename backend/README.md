# Sayraa AI HR Workforce — Backend Service

Express.js REST API & WebSocket server powering **Sayraa Talent Hire** — an AI-powered recruitment platform with JWT authentication, Gmail OTP login, AI resume screening, email notifications, and live AI interview rooms.

---

## ✨ Features

- 🔐 **Authentication** — email/password signup & login (JWT, 24h expiry), Google OAuth sign-in, and Gmail OTP verification
- 💼 **Jobs API** — public job listing; recruiter/admin-only posting
- 👥 **Candidates API** — recruiter-accessible candidate directory
- 🔄 **Application pipeline** — apply → AI screening → assessment → evaluation → HR review → final decision
- 🤖 **AI orchestration** — resume text parsing, skill normalization, ATS score matching, and interview question generation
- 📧 **Email notifications** — OTP codes, assessment invites, interview invites, and offer letters (Gmail SMTP via Nodemailer)
- 🧾 **Audit logs** — every significant action is recorded
- 📡 **WebSocket interview room** — real-time AI interviewer with transcript capture
- 🌱 **Auto-seeding & offline mode** — seeds demo data on first run; falls back to an in-memory database when MongoDB is unavailable

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | MongoDB (Mongoose 8) with in-memory fallback |
| Auth | JWT (`jsonwebtoken`), `bcryptjs`, Google OAuth |
| Email | Nodemailer (Gmail SMTP) |
| Realtime | `ws` (WebSocket) |

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # DB connection, Mongoose schemas, data-access layer & seed data
├── services/
│   ├── aiOrchestrator.js  # Resume parsing, ATS screening, interview questions
│   └── emailService.js    # OTP / assessment / interview / offer emails (SMTP)
├── uploads/               # Candidate resume storage (runtime)
├── .env.example           # Environment variable template
├── server.js              # Entry point: REST API + WebSocket setup
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**
- **MongoDB** (local or Atlas) — *optional*: the server falls back to an in-memory database if no connection is available

### Installation

```bash
# from the backend/ directory
npm install

# create your env file from the template, then fill in real values
cp .env.example .env
```

### Run

```bash
npm run dev     # nodemon (auto-restart)
npm start       # production
```

Server runs on **http://localhost:5000** (configurable via `PORT`).

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | HTTP/WS server port |
| `MONGODB_URI` | `mongodb://localhost:27017/sayraa_hr` | MongoDB connection string |
| `JWT_SECRET` | dev fallback ⚠️ | Secret for signing JWTs — **set a strong random value in production** |
| `NODE_ENV` | `development` | Environment name |
| `GMAIL_USER` | — | Gmail address used as SMTP sender |
| `GMAIL_APP_PASSWORD` | — | 16-char Gmail App Password (not your login password) |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP host fallback |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_SECURE` | `false` | Use TLS/SSL directly |
| `SMTP_USER` / `SMTP_PASS` | — | Generic SMTP credentials fallback |

> ⚠️ If no email credentials are configured, emails are logged to the console instead of being sent.

## 🌱 Demo Data

On first connect, the database layer auto-seeds sample **users, jobs, candidates, applications, assessments, evaluations, reviews, decisions, and audit logs** when the `users` collection is empty.

All seeded accounts use the password: **`password123`**

If MongoDB is unreachable, the same seed data is served from an **in-memory store**, so the API works offline out of the box.

## 📡 REST API Reference

Base URL: `/api/v1` · 🔓 = public · 🔒 = `Authorization: Bearer <token>` required

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | 🔓 | Register (name, email, password, role) |
| POST | `/auth/signin` | 🔓 | Login → JWT + user profile |
| POST | `/auth/google` | 🔓 | Google OAuth sign-in (auto-registers as Candidate) |
| POST | `/auth/send-otp` | 🔓 | Send 6-digit OTP to a Gmail address (10 min expiry) |
| POST | `/auth/verify-otp` | 🔓 | Verify OTP → login or signup |

### Jobs & Candidates
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/jobs` | 🔓 | List all job postings |
| POST | `/jobs` | 🔒 Recruiter/Admin | Create a job posting |
| GET | `/candidates` | 🔒 | List candidates |

### Applications Pipeline
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/applications` | 🔒 | List applications |
| POST | `/applications` | 🔒 | Apply — triggers AI resume parsing + ATS scoring |
| PUT | `/applications/:id/stage` | 🔒 | Move application to another pipeline stage |
| DELETE | `/applications/:id` | 🔒 | Withdraw/delete an application |
| POST | `/applications/:id/assessment` | 🔒 | Submit assessment score |
| GET | `/applications/:id/evaluation` | 🔒 | Fetch AI evaluation |
| POST | `/applications/:id/review` | 🔒 | Submit HR review (recommendation + notes) |
| POST | `/applications/:id/decision` | 🔒 | Submit final decision (Hired / Rejected / On Hold) |

### Email Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/notifications/assessment` | 🔒 | Send assessment invite email |
| POST | `/notifications/interview` | 🔒 | Send interview invite email |
| POST | `/notifications/offer` | 🔒 | Send offer letter email |

### Misc
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/audit-logs` | 🔒 | Audit trail |
| GET | `/assessments` | 🔒 | List assessments |

## 📡 WebSocket Interview Room

Connect to:

```
ws://localhost:5000/ws/interview?applicationId=<id>&candidateId=<id>&jobId=<id>
```

**Protocol (JSON messages):**
- Server → client: `{ "type": "speech", "sender": "Sayraa", "text": "...", "audioState": "speaking" }`
- Client → server: `{ "type": "response", "text": "candidate's spoken answer" }`

On connect, "Sayraa" greets the candidate and generates role-specific questions from the job's skills. Each candidate response advances the conversation and is appended to a transcript. `audioState` tells the client when speech synthesis is active.

## 📬 Email Templates

`services/emailService.js` sends branded HTML emails for: **OTP verification**, **assessment invites**, **interview invites**, and **offer letters** — all with a graceful console-log fallback when SMTP is not configured.

## 🔗 Related

- Frontend app: [`../frontend/README.md`](../frontend/README.md)
- Root workspace: run both apps at once with `npm run dev` from the repository root


