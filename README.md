# EduApp - The Smart Gateway to Better Learning 🚀

EduApp is a comprehensive, modern EdTech platform built to bridge the gap between students and educators. It provides a seamless cross-platform experience with a React Native mobile app, a lightweight Next.js web portal, and a powerful Headless CMS backend powered by Strapi v5. 

![Banner (Optional)]()

---

## 🌟 Architecture & Tech Stack

This platform is organized into a monorepo structure containing three core pillars:

1. **`backend/` (Strapi v5 CMS + SQLite)**
   - Headless CMS for dynamically managing users, courses, lectures, announcements, schedules, and quizzes.
   - Configured with robust role-based access control (Student vs Teacher).
   - `@strapi/provider-email-nodemailer` integrated for secure, automated "Forgot Password" workflows via SMTP.

2. **`frontend/` (Next.js 16 + React 19 + Tailwind CSS v4)**
   - A highly optimized, responsive Web Portal meant for desktop and tablet users.
   - Built with Next.js App Router and compiled via cutting-edge `Turbopack`.
   - Uses `lucide-react` for beautiful, lightweight iconography and premium glassmorphic UI elements.
   
3. **`mobile/` (Expo + React Native + Zustand)**
   - A native Android/iOS application focused on accessibility for students and ease of management for teachers on the go.
   - Highly dynamic `React Navigation` (Bottom Tabs & Native Stack).
   - Local state handled reliably via `Zustand`.

---

## 🔥 Key Features

### 🎓 For Students
* **Role-Based Authentication**: Secure JWT session management specifically tailored to student data access.
* **Premium Dashboard**: Glassmorphic UI featuring academic progress rings, grades, and attendance tracking.
* **Dynamic Content Delivery**: Browse subjects, consume embedded video lectures from YouTube links, and read attached PDF course materials natively within the App.
* **Live Classes Portal**: Immediate access to live broadcast links (Zoom/Meet/etc.) triggered by backend scheduling.
* **Notice Board**: Real-time broadcast announcements and alerts from school administrators.

### 👨‍🏫 For Teachers / Instructors
* **Teacher Portal UI**: A distinct, dedicated dashboard view emphasizing classroom management.
* **Quick Stats Overview**: Glanceable metrics tracking total assigned students, average attendance, and active assignment counts.
* **Class Scheduling**: Host live sessions, generate announcements, and trigger meeting links directly to student apps.
* **Course Assignment Management**: View assigned courses, grade syllabus progress, and assign new homework.
* **To-Do Task List**: Integrated checklist system to prioritize grading and syllabus creation.

### 🛠️ Platform Agnostic Features
* **Nodemailer SMTP Integration**: Real working 'Forgot Password' email recovery mechanism (rather than default Strapi Local Mailbox drop).
* **Cross-Platform Sync**: Whether a student views a PDF on the Next.js Web Portal or the React Native Mobile App, state and URLs pull gracefully from the unified Strapi API.
* **Dark / Light Mode**: Dynamic UI theming supported out of the box on mobile.

---

## 🚀 Getting Started

To run the full stack locally, you'll need three separate terminal windows.

### 1. Start the Backend (Strapi)
Make sure you have inserted your SMTP credentials in `backend/.env`.
```bash
cd backend
npm install
npm run develop
```
*Strapi Admin will be available at `http://localhost:1337/admin`.*

### 2. Start the Frontend (Next.js Web Portal)
```bash
cd frontend
npm install
npm run dev
```
*Web Portal will be available at `http://localhost:3000`.*

### 3. Start the Mobile App (Expo)
```bash
cd mobile
npm install
npm run start
```
*Scan the generated QR Code using the `Expo Go` app on your physical device, or press `a`/`i` to launch in a simulator.*

---

## 🔒 Environment Variables Reference
Ensure the following variables are present in your respective `.env` files.

**Backend (`backend/.env`)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

**Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
```

**Mobile (`mobile/.env`)**
```env
EXPO_PUBLIC_API_URL=http://your_local_ip:1337/api
```

---

*This project represents a full-stack, scalable approach to modern education technology. Open to contributions and feedback!*
