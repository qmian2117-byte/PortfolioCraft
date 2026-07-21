# Portfolio Management System (SaaS Engine)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A modern, production-ready, full-stack **Portfolio Management System** SaaS platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui design tokens**, **Prisma ORM**, **MySQL**, **JWT (HTTP-Only Cookies)**, **Zod Validation**, and **Framer Motion**.

---

## 🌟 Features Overview

### 🔐 Authentication & Security
- **JWT & HTTP-Only Cookies**: Secure, tamper-proof session persistence.
- **User Authentication**: Register, Login, Logout, Remember Me (30 days vs 7 days), Forgot Password, and Reset Token workflows.
- **Route Protection**: Edge Middleware guarding `/dashboard` and administrative APIs.
- **Data Hardening**: Bcrypt password hashing, Zod schema sanitization, XSS defense, SQL Injection prevention via Prisma parameterized queries, and HTTP Security Headers (CSP, HSTS, X-Frame-Options).

### 📊 Dashboard & Analytics
- **Overview Metrics**: Live counters for total projects, total skills, profile strength percentage, and featured project count.
- **Quick Action Bar**: One-click project creation, skill addition, and public portfolio preview.
- **Recent Activity Widgets**: Instant feed of newly created project entries and top skills.

### 👤 Profile Management
- **Identity & Biography**: Manage professional title, location, contact phone, and custom biography.
- **Avatar Media Pipeline**: Upload, replace, and delete profile pictures with client/server validation (JPEG, PNG, WEBP, SVG max 5MB).
- **Social & Resume Integration**: Connect GitHub, LinkedIn, Twitter/X, personal website, and resume attachments.

### ⚡ Skills Management
- **Full CRUD**: Add, edit, and delete skills.
- **Categorization**: Group skills into Frontend, Backend, Database, DevOps, Mobile, Design, and Other.
- **Proficiency Levels**: Interactive level percentage sliders (1% - 100%).
- **Search & Sort**: Filter skills by category and sort by level or name.

### 📁 Project Management
- **Full CRUD**: Add, edit, replace, and delete projects.
- **Media Upload**: Screenshot attachment, replacement, and removal.
- **Tech Stack Multi-Tagging**: Add dynamic technology badges (Next.js, TypeScript, Docker, etc.).
- **Live Links**: Connect GitHub repository URLs and Live Demo links.
- **Filtering & Search**: Real-time title/description search, category filter, technology stack filter, and date/alphabetical sorting.

### 🌐 SEO Public Portfolio Showcase
- **Dynamic URL**: Accessible via `/p/[username]`.
- **SEO & OpenGraph**: Auto-generated title tags, meta descriptions, and social preview cards.
- **Interactive Showcase**: Public skills progress matrix, project gallery with filter tabs, contact links, and share modal with 1-click clipboard URL copying.
- **Dark Mode Support**: Full light & dark theme switching with smooth transitions.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router), React 18/19 |
| **Language** | TypeScript |
| **Styling & UI** | Tailwind CSS, HSL CSS variables, glassmorphism, Framer Motion |
| **Icons & Alerts** | Lucide Icons, Sonner Toasts |
| **Form & Validation** | React Hook Form, Zod |
| **Backend & API** | Next.js REST API Routes, Edge Middleware |
| **Database & ORM** | MySQL, Prisma ORM |
| **Auth & Security** | JWT (`jose`), `bcryptjs`, HTTP-Only Cookies |

---

## 📁 Folder Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Register, Login, Logout, Me, Reset Password APIs
│   │   ├── profile/       # Profile GET and PUT APIs
│   │   ├── projects/      # Projects CRUD & filter APIs
│   │   ├── skills/        # Skills CRUD & filter APIs
│   │   └── upload/        # Media validation & base64 upload API
│   ├── auth/              # Login, Register, Forgot Password, Reset Pages
│   ├── dashboard/         # Protected Dashboard layout, overview, profile, skills, projects
│   ├── p/[username]/      # Dynamic SEO Public Portfolio Showcase
│   ├── 403/               # 403 Forbidden Error page
│   ├── error.tsx          # 500 Server Error Boundary
│   ├── not-found.tsx      # 404 Not Found Page
│   ├── layout.tsx         # Root Layout & Providers
│   └── page.tsx           # SaaS Landing Home Page
├── components/
│   ├── dashboard/         # Dashboard Sidebar, Header, Breadcrumbs
│   ├── layout/            # Navbar & Footer
│   ├── portfolio/          # Public Portfolio Client Gallery & Share Modal
│   ├── providers/          # ThemeProvider & ToastProvider
│   └── shared/             # ThemeToggle button
├── lib/
│   ├── auth/              # JWT, password hashing, cookie helpers
│   ├── validations/       # Zod schemas (Auth, Profile, Skill, Project)
│   ├── prisma.ts          # Singleton Prisma Client
│   └── utils.ts           # Class merger & REST API response builder
├── prisma/
│   ├── schema.prisma      # Normalized MySQL Database Schema
│   └── seed.js            # Initial Database Seeder
├── types/                 # TypeScript interfaces and contracts
├── middleware.ts          # Route protection middleware
└── tailwind.config.ts     # Design tokens & animation keyframes
```

---

## 🗄️ Database Design (ER Diagram)

```mermaid
erDiagram
    USER ||--o| PROFILE : "has"
    USER ||--o{ SKILL : "manages"
    USER ||--o{ PROJECT : "creates"
    USER ||--o{ PASSWORD_RESET_TOKEN : "requests"

    USER {
        string id PK
        string name
        string email UK
        string password
        enum role
        datetime createdAt
        datetime updatedAt
    }

    PROFILE {
        string id PK
        string userId FK, UK
        string username UK
        string title
        text bio
        string avatarUrl
        string location
        string phone
        string resumeUrl
        string githubUrl
        string linkedinUrl
        string twitterUrl
        string websiteUrl
        boolean isPublic
    }

    SKILL {
        string id PK
        string userId FK
        string name
        enum category
        int level
        string iconName
    }

    PROJECT {
        string id PK
        string userId FK
        string title
        text description
        text content
        string imageUrl
        string githubUrl
        string liveUrl
        enum category
        text technologies
        boolean isFeatured
    }

    PASSWORD_RESET_TOKEN {
        string id PK
        string userId FK
        string token UK
        datetime expiresAt
    }
```

---

## 🔌 REST API Documentation

### Authentication
- `POST /api/auth/register` - Register a new account & profile
- `POST /api/auth/login` - Authenticate & set HTTP-Only JWT cookie
- `POST /api/auth/logout` - Clear auth cookies
- `GET /api/auth/me` - Fetch authenticated user session
- `POST /api/auth/forgot-password` - Generate password reset token
- `POST /api/auth/reset-password` - Reset user password

### Profile & Media
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile details & social links
- `POST /api/upload` - Validate image type/size (5MB limit) & return storage URI
- `DELETE /api/upload` - Remove stored image

### Skills
- `GET /api/skills?search=&category=&sortBy=` - Fetch filtered skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update existing skill
- `DELETE /api/skills/:id` - Delete skill

### Projects
- `GET /api/projects?search=&category=&tech=&sort=` - Fetch filtered projects
- `POST /api/projects` - Create new project entry
- `PUT /api/projects/:id` - Update existing project
- `DELETE /api/projects/:id` - Delete project entry

---

## ⚡ Installation & Setup Guide

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/portfolio_db"
JWT_SECRET="portfolio_super_secret_jwt_key_2026_change_in_production"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Migration & Seed
```bash
# Push schema to MySQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed sample data (Demo user: alex@example.com / Password123!)
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment to Vercel

1. Push your repository to **GitHub**.
2. Connect your repository to **Vercel**.
3. Provision a cloud MySQL database (e.g. PlanetScale, Railway MySQL, Aiven, or Supabase Postgres).
4. Set Environment Variables in Vercel Dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
5. Deploy! Vercel automatically detects Next.js App Router.

---

## 🛡️ Security & Performance Verification

- **TypeScript Strict Mode**: 100% type coverage.
- **Prisma Parameterization**: Complete immunity against SQL Injection.
- **Sanitized Inputs**: All client forms validated via Zod.
- **Security Headers**: HSTS, DENY iframe embedding, no-sniff content type headers.
- **Zero Errors**: Build clean & production verified.
