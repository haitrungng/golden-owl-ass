# G-Scores

Dear **HR team** and **Developer team** at **Golden Owl**,

I truly appreciate the opportunity to apply and showcase my technical skills through this project.  
Thank you for taking the time to interview me and review my source code!

---

## Overview

This is [recorded videos](https://www.loom.com/looms/videos) for G-Scores project

**G-Scores** is a full-stack web application that allows users to:

- Look up student exam results by registration number (SBD).
- Analyze and visualize score distributions.
- Generate statistical reports by subject and academic block (A, B, C, D, ...).
- View key performance metrics through an interactive dashboard.

This project includes both a **frontend (Next.js)** and a **backend (NestJS + Prisma + PostgreSQL)**.

---

## Frontend

Built with **Next.js**, **TypeScript**, and **ShadCN/UI**, the frontend provides a clean, responsive, and user-friendly interface.

### Features

- **Search Scores Page:** Enter a student’s SBD to view individual scores.
- **Dashboard:** Displays KPI cards (total candidates, average score, action cards).
- **Reports Page:** Filter by block and analyze subject performance by four score ranges:
  - ≥ 8 points
  - 8 > points ≥ 6
  - 6 > points ≥ 4
  - < 4 points
- **Responsive design** for mobile, tablet, and desktop.
- **Form validation** with `react-hook-form` + `zod`, and customized UI built with **ShadCN** components.

---

## Backend

Developed with **NestJS**, **Prisma**, and **PostgreSQL**, the backend provides a structured REST API and efficient data handling.

### Features

- Fetch scores by SBD.
- Generate score distribution reports (≥8, 6–<8, 4–<6, <4).
- Calculate average scores for individual subjects or all 9 subjects in one query.
- Retrieve Top 10 students by academic block (A, B, C, D, ...).
- Count total candidates with at least one subject score (non-null).
- Strong input validation using `class-validator`.

---

## Environment Variables

### Backend (`backend/.env`)

This is a sample file

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/g_scores"
PORT=8080
CORS_ORIGIN=http://localhost:3000,http://localhost:3000
```

### Frontend (`frontend/.env`)

This is a sample file

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Setup Instructions

### 1️. Clone the repository

```bash
git clone https://github.com/haitrungng/golden-owl-ass
cd webdev-intern-assignment-3
```

### 2️. Backend setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run seed  #seed database
npm run start:dev
```

### 3️. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## Tech Stack

| Layer            | Technologies                                                         |
| ---------------- | -------------------------------------------------------------------- |
| **Frontend**     | Next.js 14, TypeScript, TailwindCSS, ShadCN/UI, Zod, React Hook Form |
| **Backend**      | NestJS, Prisma ORM, PostgreSQL                                       |
| **Dev Tools**    | ESLint, Prettier, dotenv, Nodemon                                    |
| **Architecture** | REST API, DTO validation, Prisma schema management                   |

---

## Key API Endpoints

- score distribution: (≥8, 6–<8, 4–<6, <4)

| Endpoint                                      | Method | Description                                                                          |
| --------------------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| `/scores/search/:sbd`                         | GET    | Search student scores by SBD                                                         |
| `/scores/report`                              | GET    | Get score distribution for all subjects                                              |
| `/scores/report?subject=toan`                 | GET    | Get score distribution for a specific subject                                        |
| `/scores/summary`                             | GET    | Get average scores for 9 subjects and total candidates with at least one valid score |
| `/scores/top?block=A&limit=10`                | GET    | Get Top 10 students of block A                                                       |
| `/scores/top?subjects=toan,vat_li, ngoai_ngu` | GET    | Get Top 10 students having highest total score with 3 subjects                       |
| `/scores/total-candidates`                    | GET    | Get total candidates with at least one valid score                                   |

---

## Database Schema (Prisma)

```prisma
model Score {
  sbd          String  @id
  toan         Float?
  ngu_van      Float?
  ngoai_ngu    Float?
  vat_li       Float?
  hoa_hoc      Float?
  sinh_hoc     Float?
  lich_su      Float?
  dia_li       Float?
  gdcd         Float?
  ma_ngoai_ngu String?
}
```

---

## UI Overview

### Dashboard

- KPI Cards: total candidates, average score, distribution summary
- Score distribution chart per subject
- Top 10 student leaderboard by block
- Quick navigation: search and detailed reports

### Reports

- Filter by subject or block
- Interactive charts showing 4-level score distributions

---

## Docker and Hosting

- I'm trying to work the Docker out but got some problems with Backend, specially prisma, so I failed to host it.
- For Database hosting, I choose [Neon](https://console.neon.tech/)
- I've already hosted the Frontend, if you want to see [LINK](https://golden-owl-ass.vercel.app/)

---

## 🤝 Author

**Developed by:** [Hải Trung Nguyễn](https://github.com/haitrungng)  
**For:** _Golden Owl Asia - Web Development Internship Assignment_  
**Tech Stack:** Full-Stack TypeScript (NestJS + Next.js + Prisma)  
**Contact information:** **haitrungng12004@gmail.com**
