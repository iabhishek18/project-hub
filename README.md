# Project Hub

A full-stack marketplace for academic and industry-ready projects. Single seller (admin) uploads and sells projects to buyers (students, colleges, companies).

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Payments**: Razorpay
- **File Storage**: AWS S3
- **Auth**: JWT (access + refresh tokens)

## Project Structure

```
project-hub/
├── apps/
│   ├── backend/          # Express API server
│   │   ├── prisma/       # Schema, migrations, seed
│   │   └── src/
│   │       ├── config/   # DB, S3, Razorpay clients
│   │       ├── middleware/
│   │       ├── routes/
│   │       ├── services/
│   │       └── utils/
│   └── frontend/         # Next.js application
│       └── src/
│           ├── app/      # Pages (App Router)
│           ├── components/
│           ├── hooks/
│           ├── lib/      # API client
│           └── store/    # Zustand state
└── packages/
    └── shared/           # Shared types & enums
```

## Prerequisites

- Node.js >= 18
- PostgreSQL 14+
- AWS account (for S3)
- Razorpay account

## Setup Instructions

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd project-hub
npm install
```

### 2. Configure environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

Edit both files with your actual credentials.

### 3. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### 4. Start development servers

```bash
npm run dev
```

This starts both frontend (http://localhost:3000) and backend (http://localhost:5000) concurrently.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new buyer |
| POST | /api/auth/login | Buyer login |
| POST | /api/auth/admin/login | Admin login |
| POST | /api/auth/refresh | Refresh access token |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | List projects (with filters) |
| GET | /api/projects/featured | Featured projects |
| GET | /api/projects/:id | Project details |
| POST | /api/projects | Create project (admin) |
| PUT | /api/projects/:id | Update project (admin) |
| DELETE | /api/projects/:id | Soft delete (admin) |

### Purchases
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/purchases/create-order | Create Razorpay order |
| POST | /api/purchases/verify | Verify payment |
| GET | /api/purchases/download/:projectId | Get download URL |
| GET | /api/purchases/my-purchases | User's purchases |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/reviews | Create/update review |
| GET | /api/reviews/project/:projectId | Project reviews |
| DELETE | /api/reviews/:id | Delete own review |

### Requests & Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/requests | Submit custom request |
| GET | /api/requests/my-requests | User's requests |
| POST | /api/messages | Send message to admin |
| GET | /api/messages/my-messages | User's messages |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Dashboard stats |
| GET | /api/admin/users | All users |
| GET | /api/admin/requests | All custom requests |
| PUT | /api/admin/requests/:id | Update request status |
| GET | /api/admin/messages | All messages |
| PUT | /api/admin/messages/:id/reply | Reply to message |
| GET | /api/admin/transactions | All transactions |

## Features

### Admin
- Upload, edit, delete projects
- Set pricing and feature flags
- View revenue, sales, and user analytics
- Manage custom project requests
- Reply to buyer messages

### Buyers
- Browse, search, filter projects
- View detailed project pages with reviews
- Purchase via Razorpay
- Download purchased files (presigned S3 URLs)
- Submit reviews and ratings
- Request custom projects
- Contact admin

### Security
- JWT authentication with refresh token rotation
- Role-based access control (ADMIN, STUDENT, COLLEGE, COMPANY)
- Presigned URLs for file access (time-limited)
- Rate limiting on API endpoints
- Input validation with Zod
- Helmet security headers
- CORS configuration

## Deployment

### Backend
Deploy to any Node.js hosting (Railway, Render, AWS EC2):
```bash
npm run build:backend
npm run start -w apps/backend
```

### Frontend
Deploy to Vercel:
```bash
npm run build:frontend
```

### Database
Use managed PostgreSQL (Supabase, Neon, AWS RDS).

## License

MIT
