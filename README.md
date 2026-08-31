# 🛡️ FoodGuard — Digital Food Inspection Platform

FoodGuard is a modern web application designed to digitize and streamline food safety inspections for restaurants, food businesses, and food safety regulatory authorities.

## 🌟 Key Features

- **🏨 Hotel / Restaurant Portal**:
  - Upload food product details, packaging labels, and purchase bills.
  - Automated AI/OCR date extraction and expiry evaluation.
  - Real-time product compliance tracking and violation alerts.
  
- **🛡️ Food Safety Officer Portal**:
  - Verification queue with confidence scoring and expiry flags.
  - Detailed product inspection review and violation logging.
  - Severity level tracking (LOW, MEDIUM, HIGH, CRITICAL).
  - Digital inspection report generation.

- **⚙️ Admin Control Panel**:
  - Platform-wide statistics, safety trends, and compliance metrics.
  - Hotel verification management.
  - Officer registration and territory assignment.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Database & ORM**: SQLite, [Prisma ORM](https://www.prisma.io/)
- **Authentication**: Role-based JWT session authentication (jose, cryptjs)
- **Charts**: [Recharts](https://recharts.org/)

## 🚀 Getting Started

### 1. Clone & Install Dependencies

`ash
git clone <your-repo-url>
cd food
npm install
`

### 2. Environment Setup

Create a .env file in the root directory:

`env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_API_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-jwt-key"
`

### 3. Database Migration & Seeding

`ash
npx prisma db push
npx tsx prisma/seed.ts
`

### 4. Run the Development Server

`ash
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🔑 Demo Credentials

Default password for all demo accounts: password123

| Role | Email |
| :--- | :--- |
| **Hotel / Restaurant** | hotel@example.com |
| **Safety Officer** | officer@example.com |
| **Admin** | dmin@example.com |
