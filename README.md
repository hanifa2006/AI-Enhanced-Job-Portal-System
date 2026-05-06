# AI-Enhanced Job Portal System (MERN)

A full-stack job portal web application built with the MERN stack where employers can post jobs and candidates can browse and apply for jobs.

## Features

- User authentication with JWT (login / register).
- Role-based access: Candidate and Employer.
- Employers can create and manage job postings.
- Candidates can browse jobs and apply.
- Each candidate can see all their applications in a "My Applications" page.

## Tech Stack

- **Frontend:** React, React Router, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Auth:** JWT, bcryptjs

## Project Structure

```bash
AI-Enhanced-Job-Portal-System/
  ├─ client/        # React frontend
  ├─ server/        # Node/Express backend
  ├─ .gitignore
  └─ README.md
```

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/hanifa2006/AI-Enhanced-Job-Portal-System.git
cd AI-Enhanced-Job-Portal-System
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside `server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start backend:

```bash
npm run dev
```

### 3. Frontend setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`.

## Future Improvements

- Admin dashboard for managing users and jobs.
- Resume upload and AI-based job recommendations.
- Better UI styling (e.g., Tailwind or Material UI).

## Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Login / Register
![Auth Page](screenshots/auth.png)

### Candidate Dashboard
![Candidate Dashboard](screenshots/candidate-dashboard.png)

### Employer Dashboard
![Employer Dashboard](screenshots/employer-dashboard.png)

### My Applications
![My Applications](screenshots/my-applications.png)

## Author

**Shaik Hanifa**