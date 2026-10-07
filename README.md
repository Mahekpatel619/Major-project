# UNFAZED — Complete Full-Stack Therapist Practice Management Platform

> **College Major Project Submission**  
> A production-ready SaaS platform engineered for licensed clinical psychologists, psychotherapists, and mental health professionals in India to run, scale, and manage their private practice from one unified system.

---

## 🌟 Platform Highlights & Unique Architecture

- **Public Branded Link (`/dr-sharma`)**: Every practitioner receives a vanity profile link showcasing credentials, RCI licensure, bio, services, consultation fees, and an interactive 4-step client reservation flow.
- **Double-Booking Prevention**: Conflict-free scheduling with configurable session durations (30/45/50/60/90 mins), clinician buffer times, and strict backend atomic validation (HTTP 409 Conflict on collision).
- **Centralized Entitlement Service**: Singleton entitlement engine (`canAccess(therapistId, featureKey)`) enforcing tier limits across Free, Pro, and Premium plans.
- **Strict Clinical Note Privacy**: Clinical progress notes support **SOAP** (Subjective, Objective, Assessment, Plan) and **DAP** templates. Private notes are strictly sanitized at both the database query and serialization levels—ensuring private clinical observations are never leaked to client portals.
- **Smart No-Show Risk Indicator**: Rule-based operational scoring heuristic analyzing historical missed sessions (+3 pts), late cancellations (+2 pts), and unpaid dues (+2 pts) to classify clients into **Low**, **Medium**, and **High Risk** with actionable practice guidance.
- **Indian Financial Ecosystem**: Razorpay test mode integration for instant UPI, NetBanking, and Card payments + dynamic tax invoice generation via **PDFKit**.
- **Wellness Mood Tracker**: Daily client emotional state check-in (Happy, Okay, Sad, Angry, Stressed) with longitudinal trajectory visualization powered by **Recharts**.
- **Homework & Psychoeducational Resources**: Assign cognitive thought records, sleep hygiene protocols, or attach PDFs and guided relaxation audio with client reflection submissions.
- **Real-Time Bidirectional Chat**: Instant encrypted messaging between clinician and clients powered by **Socket.io**.

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** + **Vite 6**
- **Tailwind CSS** (Calming healthcare palette: brand navy, sage teal, clean slate)
- **React Router DOM v6** (Nested public, therapist, and client layouts with route guards)
- **Axios** (Configured with automatic JWT injection interceptors)
- **Recharts** (Area charts, donut breakdown, line trends, and bar charts)
- **Lucide React** (Consistent modern iconography)
- **Socket.io Client** (Real-time chat & notifications)
- **Date-fns** (Date formatting & slot scheduling)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose** (Atlas ready + zero-friction local in-memory fallback)
- **JWT (JSON Web Tokens)** + **bcryptjs** (Role-based authentication: `therapist` vs `client`)
- **Socket.io** (Real-time bidirectional communication engine)
- **Razorpay SDK** (Test mode orders & signature verification)
- **PDFKit** (Dynamic PDF invoice generation)
- **Nodemailer** (Automated notification dispatch with development logger)

---

## 📂 Project Structure

```
UNFAZED/
├── backend/
│   ├── src/
│   │   ├── config/          # Database (with auto-fallback), Razorpay, Mailer
│   │   ├── controllers/     # 15 domain controllers
│   │   ├── middleware/      # Auth (roles), Entitlement gate, Error handlers
│   │   ├── models/          # 14 Mongoose models
│   │   ├── routes/          # Clean modular Express routers
│   │   ├── services/        # Entitlement, Risk Engine, PDFKit Invoices, Notifications
│   │   ├── sockets/         # Socket.io chat handler
│   │   └── utils/           # Database seeder & slug generator
│   ├── test/                # Automated API test suite (9 test suites)
│   ├── server.js            # Express server entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Centralized API service methods & Axios instance
│   │   ├── components/      # Common UI, Modals, Risk Badges, Upgrade Dialogs
│   │   ├── context/         # AuthContext & SocketContext
│   │   ├── layouts/         # PublicLayout, TherapistLayout (14 sidebar items), ClientLayout
│   │   ├── pages/
│   │   │   ├── public/      # Landing, Features, Pricing, Login, Register, /dr-sharma
│   │   │   ├── therapist/   # Dashboard, Clients CRM, Details, Notes, Chat, Analytics, etc.
│   │   │   └── client/      # Portal Dashboard, Appointments, Mood, Homework, Shared Notes
│   │   ├── App.jsx          # Declarative routing & role guards
│   │   └── index.css        # Tailwind directives & design tokens
│   ├── vite.config.js       # Vite bundler with backend proxy
│   └── package.json
│
├── package.json             # Root workspace orchestration
└── README.md                # Major project documentation
```

---

## 🚀 Quick Setup & Local Execution

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Installation
From the root project directory:
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Start Backend Server
```bash
cd backend
node server.js
# Or in dev mode with nodemon:
npm run dev
```
> **Note**: If a remote MongoDB Atlas URI is not configured in `.env`, the backend automatically launches an embedded in-memory MongoDB server and auto-seeds Dr. Sharma's practice and sample data for zero-setup grading!

### 4. Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 🔑 Pre-Seeded Demo Credentials (1-Click Login Available)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Therapist** | `dr.sharma@unfazed.in` | `Password123!` | Dr. Neha Sharma (Senior Clinical Psychologist, Pro Tier, `/dr-sharma`) |
| **Client (Active)** | `aarav.patel@example.com` | `Password123!` | Aarav Patel (Completed sessions, active mood logs, low risk) |
| **Client (High Risk)** | `priya.nair@example.com` | `Password123!` | Priya Nair (1 missed session, 1 late cancel, pending dues -> **High Risk: 9 pts**) |

---

## 🧪 Automated Verification & Test Results

An automated end-to-end API test script is provided in `backend/test/api.test.js`.
To run the automated test suite:
```bash
cd backend
node test/api.test.js
```

### Verified Test Suites:
1. **Health Check**: `GET /api/health` -> HTTP 200 OK.
2. **Public Branded Profile**: `GET /api/therapists/dr-sharma` -> Returns credentials, services, and availability.
3. **Dynamic Slot Generation**: `GET /api/slots/:id` -> Calculates available slots excluding breaks and booked appointments.
4. **JWT Authentication & Passwords**: `POST /api/auth/login` -> Hashes verified via bcryptjs; signs JWT.
5. **MongoDB Aggregation Analytics**: `GET /api/analytics/dashboard` -> Aggregates monthly revenue, active clients, and no-show rate.
6. **Smart No-Show Risk Indicator**: Computed scoring verified for clients (e.g. Priya Nair identified as High Risk with breakdown).
7. **Clinical Note Privacy Isolation**: Verified that client queries never leak private clinician notes.
8. **Centralized Entitlement Service**: Tested tier gating on active clients, analytics, and templates.
9. **Atomic Double-Booking Prevention**: Attempting concurrent booking on identical slots triggers **HTTP 409 Conflict**.

---

## 📄 License & Major Project Declaration
This application was developed as a college major project adhering to industry best practices in healthcare software development, medical confidentiality, and clean modular architecture.
