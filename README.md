<div align="center">

<img src="./images/banner.png" alt="EducatIN Banner" width="100%" />

<br/>
<br/>
<br/>
<br/>

<!-- Animated App Name -->
<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=42&pause=1000&color=2E7EEA&center=true&vCenter=true&width=500&lines=EducatIN" alt="EducatIN" />
</a>

<br/>

<!-- Animated Tagline -->
<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=500&size=18&pause=2500&color=6B7280&center=true&vCenter=true&width=760&lines=Bringing+Local+Coaching+Schools+to+Life+with+Technology.;Where+Every+Coaching+Centre+Gets+Its+Digital+Edge.;Empowering+Teachers.+Inspiring+Students." alt="Tagline" />
</a>

<br/><br/>

<!-- Nav Links -->
<p>
  <a href="#-overview">Overview</a> ·
  <a href="#-tech-stack">Tech Stack</a> ·
  <a href="#-project-structure">Structure</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-environment-variables">Env Variables</a> ·
  <a href="#-contributing">Contributing</a>
</p>

<!-- Tech Badges -->
<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Strapi_v5-2E7EEA?style=for-the-badge&logo=strapi&logoColor=white" alt="Strapi v5" />
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
</p>

<!-- Status Badges -->
<p>
  <img src="https://img.shields.io/github/license/mohitranjan/educatin?style=flat-square&color=2E7EEA" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/contributions-welcome-orange?style=flat-square" alt="Contributions" />
  <img src="https://img.shields.io/badge/platform-Web%20%7C%20iOS%20%7C%20Android-blueviolet?style=flat-square" alt="Platform" />
</p>

</div>

---

## 📖 Overview

**EducatIN** is a full-fledged EdTech platform built to bridge the gap between local coaching schools and modern technology. Hundreds of neighbourhood coaching centres run on whiteboards and paper — **EducatIN changes that**, giving them the digital infrastructure of a top-tier institution.

Built on a **decoupled (headless) architecture**, the platform cleanly separates content management from presentation — making it fast, scalable, and easy to maintain.

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 🗄️ **Backend** | Strapi v5 | Headless CMS — content, REST APIs, user management |
| 💻 **Web** | Next.js 14 | High-performance admin & teacher dashboard |
| 📱 **Mobile** | React Native (Expo) | Cross-platform app for students & teachers |

---

## 📸 Screenshots


<summary><b>📱 Mobile App — React Native</b></summary>
<br/>

<p align="center">
  <img src="./images/1.png" width="22%" />
  <img src="./images/2.png" width="22%" />
  <img src="./images/3.png" width="22%" />
  <img src="./images/4.png" width="22%" />
</p>
<p align="center">
  <img src="./images/5.png" width="22%" />
  <img src="./images/6.png" width="22%" />
  <img src="./images/7.png" width="22%" />
  <img src="./images/8.png" width="22%" />
</p>
<p align="center">
  <img src="./images/9.png" width="22%" />
  <img src="./images/10.png" width="22%" />
  <img src="./images/11.png" width="22%" />
</p>




<summary><b>💻 Web Dashboard — Next.js</b></summary>
<br/>

<p align="center">
  <img src="./images/1a.png" width="45%" />
  <img src="./images/2a.png" width="45%" />
</p>
<p align="center">
  <img src="./images/3a.png" width="45%" />
  <img src="./images/4a.png" width="45%" />
</p>
<p align="center">
  <img src="./images/5a.png" width="45%" />
  <img src="./images/6a.png" width="45%" />
</p>
<p align="center">
  <img src="./images/7a.png" width="45%" />
  <img src="./images/8a.png" width="45%" />
</p>



---

## 🛠 Tech Stack

### 🗄️ Backend
- **[Strapi v5](https://strapi.io/)** — Headless CMS with REST & GraphQL API
- **PostgreSQL** / **SQLite** — Relational database (configurable per environment)
- **Nodemailer** — Transactional email via SMTP

### 💻 Web Frontend
- **[Next.js 14](https://nextjs.org/)** — React framework with App Router, SSR & SSG
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **React** — Component-driven UI

### 📱 Mobile
- **[React Native](https://reactnative.dev/)** — Cross-platform iOS & Android
- **[Expo](https://expo.dev/)** — Managed workflow, OTA updates, dev tooling
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Lightweight global state management

### 🔐 Auth & Security
- **JWT** — Stateless, token-based authentication
- **RBAC** — Role-Based Access Control enforced at API level via Strapi filters

---

## 📂 Project Structure

```
EducatIN/
├── backend/              # Strapi v5 — API, content types, plugins
│   ├── src/
│   │   ├── api/          # Content type controllers & routes
│   │   └── plugins/      # Strapi plugin configurations
│   └── .env.example
│
├── frontend/             # Next.js 14 — Web dashboard
│   ├── app/              # App Router: layouts, pages, loading states
│   ├── components/       # Reusable UI components
│   ├── lib/              # API clients, helpers, utilities
│   └── .env.example
│
├── mobile/               # React Native — Expo app
│   ├── app/              # Expo Router: screens & navigation
│   ├── components/       # Shared UI components
│   ├── store/            # Zustand state stores
│   └── .env.example
│
└── images/               # Screenshots & assets for README
```

---

## ✨ Features

### 🎓 Students
- Browse and enroll in available courses
- Watch video lectures and download PDF study materials
- Join live classes via integrated session links
- Receive real-time announcements from teachers

### 👨‍🏫 Teachers
- Role-scoped dashboard — access only assigned courses
- Upload video lectures and manage course content
- Schedule and broadcast live sessions
- Post announcements directly to enrolled students

### 🛡️ Admins
- Centralized user, role, and course management via Strapi
- Assign teachers to specific courses
- Full content control and platform-wide oversight

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) `>= 18.x`
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) *(for mobile development)*

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/educatin.git
cd educatin
```

### 2. Backend — Strapi CMS

```bash
cd backend
cp .env.example .env
npm install
npm run develop
```

> ✅ Admin panel available at: `http://localhost:1337/admin`

### 3. Frontend — Next.js Web App

```bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```

> ✅ Web app available at: `http://localhost:3000`

### 4. Mobile — Expo App

```bash
cd ../mobile
cp .env.example .env
npm install
npx expo start
```

> ✅ Scan the QR code with **Expo Go** on Android/iOS, or press `i` / `a` for emulator.

---

## 🔐 Environment Variables

> ⚠️ Never commit `.env` files to version control. Add them to `.gitignore`.

### `backend/.env`

```env
# Database
DATABASE_CLIENT=sqlite            # or "postgres" for production
DATABASE_FILENAME=.tmp/data.db    # SQLite only

# Mail (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your@email.com
SMTP_PASSWORD=your_password

# Security (generate strong random values)
APP_KEYS=key1,key2
API_TOKEN_SALT=your_salt
ADMIN_JWT_SECRET=your_admin_secret
JWT_SECRET=your_jwt_secret
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
```

### `mobile/.env`

```env
# Use your machine's LOCAL IP — "localhost" will not work on a physical device
EXPO_PUBLIC_API_URL=http://192.168.x.x:1337
```

---

## 🛡️ Role-Based Access Control (RBAC)

Data isolation is enforced at the API level. Teachers only receive data for their assigned courses via Strapi's query filters:

```http
GET /api/courses?filters[teacher][id][$eq]={{USER_ID}}&populate=*
```

Roles (`student`, `teacher`, `admin`) are managed in Strapi and validated on every authenticated request by decoding the JWT payload server-side.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch — `git checkout -b feat/your-feature`
3. Commit your changes — `git commit -m "feat: describe your change"`
4. Push to your branch — `git push origin feat/your-feature`
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

---

## 📄 License

Licensed under the **MIT License** — see [LICENSE](./LICENSE) for full details.

---

## 👤 Author

<div align="center">

**Mohit Ranjan** — Full Stack Developer

<p>
  <a href="https://github.com/mohitranjan">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  &nbsp;
  <a href="https://linkedin.com/in/mohitranjan">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
</p>

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=2E7EEA&height=120&section=footer" width="100%" />

<sub>⭐ If EducatIN helped or inspired you, drop a star — it keeps the project alive!</sub>

</div>
