# GymBuddy

**GymBuddy** is a full-stack web application that connects gym-goers with compatible workout partners based on fitness goals, schedule, workout style, and mindset. Gym owners can list and manage their gyms, while users find and collaborate with workout partners through a smart matching system.

---

## ✨ Features

- **Smart Partner Matching** — Swipe-style matching based on fitness goals, experience level, and schedule
- **Collaboration Tickets** — Book and track shared gym sessions with your match
- **Gym Directory** — Browse and filter gyms by location, facilities, and pricing
- **Gym Owner Dashboard** — List multiple gyms, view visitor stats and recent activity
- **Admin Dashboard** — Manage all users, change roles, and delete gyms/users
- **Email Verification** — Gym owners verify their email during onboarding
- **JWT Authentication** — Secure login with token validation on every app load
- **Role-Based Access** — `user`, `gymOwner`, and `admin` roles with protected routes
- **Real-time Notifications** — In-app notifications for matches and ticket updates

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v4, Custom CSS |
| State | React Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (jsonwebtoken) |
| Email | Nodemailer (Gmail SMTP) |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Gmail account (for email verification)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/gym-buddy.git
cd gym-buddy
```

### 2. Backend Setup

cd backend
npm install
cp .env.example .env
# Fill in your .env values (see Environment Variables below)
node server.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random string for signing JWTs |
| `EMAIL_SERVICE` | Email provider (e.g. `gmail`) |
| `EMAIL_USER` | Email address for sending verification emails |
| `EMAIL_PASS` | Gmail App Password (not your account password) |
| `FRONTEND_URL` | Frontend URL for email links (e.g. `http://localhost:5173`) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g. `http://localhost:3000/api`) |

---

## 👤 User Roles

| Role | Access |
|------|--------|
| `user` | Dashboard, matching, tickets, gym browser |
| `gymOwner` | All user access + owner dashboard (list/manage gyms) |
| `admin` | Full platform access — manage all users and gyms |

### Promote a user to admin

```bash
cd backend
node scripts/make-admin.js user@email.com
```

---

## 📁 Project Structure

```
gym-buddy/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── middleware/       # Auth, error handling
│   ├── services/        # Email, business logic
│   ├── scripts/         # One-time utility scripts
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Route-level page components
│   │   └── services/    # API service layer
│   └── vite.config.ts
│
└── README.md
```

---

## 🌿 Git Branching Strategy

```
main         → Production-ready code
dev          → Active development
feature/*    → New features (branch from dev)
fix/*        → Bug fixes
```

Example:
```bash
git checkout dev
git checkout -b feature/notifications
# work...
git push origin feature/notifications
# open pull request → dev → main
```

---

## 📦 Deployment Notes

- Set `NODE_ENV=production` on the server
- Use a process manager like **PM2** for the backend: `pm2 start server.js`
- Build the frontend: `cd frontend && npm run build` — serve `dist/` via Nginx or a CDN
- Tighten the rate limiter in `backend/server.js` for production
- Use strong, randomly generated `JWT_SECRET` (64+ characters)
- Enable MongoDB Atlas IP whitelisting for your server's IP

---

## 📄 License

MIT
