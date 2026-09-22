# Sayraa Talent Hire — Frontend

React 18 single-page application powering **Sayraa AI HR Workforce** — an AI-powered recruitment platform with smart job matching, resume screening, skill assessments, and live AI interviews.

Built with **Vite**, **Tailwind CSS**, **Framer Motion**, **Recharts**, and **Firebase** (Google Sign-In).

---

## ✨ Features

- 🔐 **Three ways to sign in** — Email/password, Google Sign-In (Firebase), and Gmail OTP verification
- 👥 **Role-based experience** — separate flows for **Candidates** and **Recruiters/Admins**, enforced by a client-side route guard
- 💼 **Job marketplace** — browse openings, view skill requirements, and apply in one click
- 📄 **Resume upload & AI screening** — ATS score, skill matching, and instant feedback
- 📝 **Skill assessments** — MCQ & coding questions with scoring
- 🤖 **Live AI interview room** — real-time conversation with "Sayraa", the AI screening assistant (WebSocket + speech synthesis)
- 🔄 **Full recruiter pipeline** — Applications → Evaluation → HR Review → Final Decision → Offer Letter
- 📊 **Analytics & reports** — pipeline charts (Recharts), compliance & bias-audit report cards
- 🧾 **Audit logs & settings** — activity trail and account preferences

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | lucide-react |
| Auth | Firebase (Google popup) |
| Realtime | Native WebSocket |
| Linting | ESLint |

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets served at root
├── src/
│   ├── assets/             # Images & logos
│   ├── components/
│   │   ├── common/         # Reusable widgets (PhoneGmailSimulator, SecurityCheckModal)
│   │   └── layout/         # AppShell, Sidebar, TopHeader
│   ├── config/
│   │   └── firebase.js     # Firebase app + Google auth provider
│   ├── context/
│   │   └── AppContext.jsx  # Global state: auth, routing, API calls
│   ├── pages/              # 19 routed pages
│   ├── App.jsx             # Client-side router + role guard
│   ├── index.css           # Tailwind layers
│   └── main.jsx            # Entry point
├── index.html
├── vite.config.js          # Dev proxy: /api → :5000, /ws → ws://:5000
├── tailwind.config.js
├── vercel.json             # Deployment config (static build + SPA fallback)
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**
- The backend running on `http://localhost:5000` (see [`../backend/README.md`](../backend/README.md))

### Installation

```bash
# from the frontend/ directory
npm install

# (optional) create your env file from the template
cp .env.example .env
```

### Run in development

```bash
npm run dev
```

The app starts on **http://localhost:5173**. All `/api/*` and `/ws/*` requests are proxied to the backend at `http://localhost:5000` automatically — no CORS setup needed in dev.

## 🔧 Environment Variables

| Variable | Dev default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api/v1` | REST API base URL |
| `VITE_WS_URL` | `ws://localhost:5000/ws/interview` | WebSocket interview endpoint |
| `REACT_APP_API_URL` | same as above | Legacy fallback, kept for compatibility |
| `REACT_APP_WS_URL` | same as above | Legacy fallback, kept for compatibility |

> **Production note:** `frontend/.env.production` sets relative paths (`/api/v1`, `/ws/interview`), expecting the backend to share the same domain behind a reverse proxy. If your API lives elsewhere, set `VITE_API_URL` / `VITE_WS_URL` in your hosting dashboard instead.

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint over `js/jsx` (zero-warning policy) |

## 🗺️ Pages & Routes

| Route | Page |
|---|---|
| `/`, `/login`, `/register` | Landing / auth entry |
| `/otp-auth` | Gmail OTP verification |
| `/dashboard` | Role-aware dashboard |
| `/jobs` | Explore & post jobs |
| `/profile` | Profile setup |
| `/resume` | Resume upload & parsing |
| `/results` | AI screening results |
| `/applications`, `/pipeline` | Applications & pipeline board |
| `/candidates` | Candidate directory (recruiter) |
| `/assessment` | Skill assessments |
| `/interview` | Live AI interview room |
| `/evaluation` | AI evaluation summary |
| `/review` | HR review |
| `/decision` | Final decision |
| `/offer` | Offer letter |
| `/analytics` | Hiring analytics |
| `/reports` | Compliance reports |
| `/logs` | Audit logs |
| `/settings` | Settings |
| `/help` | Help & support |

Candidates are automatically restricted to candidate-relevant routes by the guard in `App.jsx`.

## 🔥 Firebase Google Sign-In

`src/config/firebase.js` holds the Firebase web config. For Google Sign-In to work:
1. Enable the **Google provider** in your Firebase console.
2. Add your dev origin (`http://localhost:5173`) and production domain under **Authentication → Settings → Authorized domains**.

## ☁️ Deployment (Vercel)

The included `vercel.json` builds the static site and rewrites all routes to `index.html` (SPA fallback):

```json
{ "builds": [{ "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } }],
  "routes": [{ "src": "/(.*)", "dest": "/index.html" }] }
```

```bash
npm run build   # outputs to dist/
vercel --prod
```
