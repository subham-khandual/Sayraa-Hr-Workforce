# Sayraa AI HR Workforce - Backend Service

Express.js REST API & WebSocket server powering the Sayraa AI HR Recruitment Platform.

## Directory Structure

```
server/ (backend)
├── config/          # Database configuration, schemas & data-access layer (db.js)
├── services/        # Business logic: AI orchestration & email service
├── uploads/         # Storage directory for candidate resumes
├── .env             # Server environment variables
├── server.js        # Server entry point: REST API & WebSocket setup
├── package.json     # Dependencies and scripts
└── README.md        # Backend Documentation
```

## Running Backend

```bash
npm install
npm run dev
```
Server runs on `http://localhost:5000`.
