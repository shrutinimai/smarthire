# SmartHire - Job Portal Platform

SmartHire is a full-stack job portal I built where companies can post jobs and candidates can apply, track their applications, and get real-time updates on their status.

## Live Demo
- Frontend: https://smarthire-theta.vercel.app
- Backend: https://smarthire-backend-chzw.onrender.com
- GitHub: https://github.com/shrutinimai/smarthire

## Why I Built This
I wanted to build something that solves a real problem. Most job portals feel outdated — no real-time updates, clunky dashboards, and poor user experience. SmartHire fixes that with a clean UI, instant notifications, and a smooth apply flow.

## Tech Stack
- **Frontend:** React.js, Redux Toolkit, Tailwind CSS, Socket.io
- **Backend:** Node.js, Express.js, JWT, Socket.io, Cloudinary
- **Databases:** MySQL (Sequelize) + MongoDB (Mongoose)
- **Deployed on:** Vercel + Render + Aiven + MongoDB Atlas

## Features

**For Candidates**
- Register and login securely with JWT auth
- Browse and search jobs by title, skills or location
- Apply with a cover letter
- Upload resume as PDF (stored on Cloudinary)
- Track application status — Applied, Reviewed, Shortlisted, Hired
- Get instant notifications when status changes

**For Companies**
- Post and manage job listings
- View all candidates who applied
- Update application status with one click
- Get notified instantly when someone applies

## One Thing I'm Proud Of
Using both MySQL and MongoDB in the same project was intentional. Structured data like users, jobs and applications fit perfectly in MySQL. Resumes with flexible fields like experience, education and skills made more sense in MongoDB. Knowing when to use which database is something I really focused on here.

## Project Structure

smarthire/

├── backend/

│   ├── config/

│   ├── controllers/

│   ├── middleware/

│   ├── models/

│   ├── routes/

│   └── server.js

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── store/

│   │   └── utils/

└── README.md

## API Overview

**Auth Routes**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

**Job Routes**
- GET /api/jobs
- POST /api/jobs
- GET /api/jobs/:id
- PUT /api/jobs/:id
- DELETE /api/jobs/:id

**Application Routes**
- POST /api/applications/apply
- GET /api/applications/my
- GET /api/applications/job/:id
- PUT /api/applications/:id/status

**Resume Routes**
- POST /api/resume/upload
- GET /api/resume/my
- PUT /api/resume/update

## Local Setup

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm start
```

**Environment Variables needed**
PORT=5000

MYSQL_HOST=

MYSQL_USER=

MYSQL_PASSWORD=

MYSQL_DATABASE=

MYSQL_PORT=

MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

## What I Learned
Building this taught me a lot — especially around real-time communication with Socket.io, handling file uploads to cloud storage, designing role-based systems, and making smart decisions about when to use SQL vs NoSQL.

