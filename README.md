# Smart Leads Dashboard

A full-stack MERN dashboard for managing sales leads with authentication, role-based access control, filtering, pagination, and admin-only CSV exports.

## Project Overview

Smart Leads Dashboard helps sales teams track leads from multiple sources, update lead status, search and filter records, and export lead data when needed. The application includes a React frontend, a TypeScript Express API, MongoDB persistence, JWT authentication, and Docker support for local development.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, TailwindCSS, React Router DOM, Axios, TanStack React Query |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Tooling | Vite, Docker, Docker Compose |

## Features

- JWT Authentication with Role-Based Access Control for Admin and Sales users
- Leads CRUD operations
- Advanced filtering by status, source, search, and sort order
- Debounced search input
- Backend pagination
- CSV export for Admin users only
- Docker support for MongoDB, backend, and frontend services

## Folder Structure

```text
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm
- MongoDB, or Docker Desktop for containerized setup
- Git

### Clone Repo

```bash
git clone <repository-url>
cd smart-leads-dashboard
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `backend/.env` before starting the server.

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

### Docker Setup

Create `backend/.env` from `backend/.env.example`, then run from the project root:

```bash
docker compose up --build
```

Default service URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Environment Variables

### Backend

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `PORT` | Yes | `5000` | Port used by the Express API |
| `MONGO_URI` | Yes | `mongodb://mongo:27017/smartleads` | MongoDB connection string |
| `JWT_SECRET` | Yes | `your_jwt_secret_here` | Secret used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | Yes | `7d` | JWT expiration duration |
| `NODE_ENV` | Yes | `development` | Runtime environment |

### Frontend

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `VITE_API_URL` | Yes | `http://localhost:5000` | Base URL for API requests |

## API Documentation

Base URL: `http://localhost:5000`

### POST `/api/auth/register`

| Field | Details |
| --- | --- |
| Method | `POST` |
| URL | `/api/auth/register` |
| Auth required | No |
| Body | `{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123", "role": "sales" }` |
| Response | `{ "token": "...", "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "sales" } }` |

### POST `/api/auth/login`

| Field | Details |
| --- | --- |
| Method | `POST` |
| URL | `/api/auth/login` |
| Auth required | No |
| Body | `{ "email": "jane@example.com", "password": "secret123" }` |
| Response | `{ "token": "...", "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "sales" } }` |

### GET `/api/leads`

| Field | Details |
| --- | --- |
| Method | `GET` |
| URL | `/api/leads` |
| Auth required | Yes |
| Query params | `status`, `source`, `search`, `sort`, `page`, `limit` |
| Example | `/api/leads?status=New&source=Website&search=alex&sort=latest&page=1&limit=10` |
| Response | `{ "leads": [...], "total": 42, "page": 1, "totalPages": 5 }` |

### POST `/api/leads`

| Field | Details |
| --- | --- |
| Method | `POST` |
| URL | `/api/leads` |
| Auth required | Yes |
| Body | `{ "name": "Alex Smith", "email": "alex@example.com", "source": "Website", "status": "New" }` |
| Response | Created lead document |

### GET `/api/leads/:id`

| Field | Details |
| --- | --- |
| Method | `GET` |
| URL | `/api/leads/:id` |
| Auth required | Yes |
| Params | `id`: Lead ID |
| Response | Lead document with `createdBy` populated with name and email |

### PUT `/api/leads/:id`

| Field | Details |
| --- | --- |
| Method | `PUT` |
| URL | `/api/leads/:id` |
| Auth required | Yes |
| Params | `id`: Lead ID |
| Body | Any editable fields: `{ "name": "Alex Smith", "email": "alex@example.com", "status": "Qualified", "source": "Referral" }` |
| Response | Updated lead document |

### DELETE `/api/leads/:id`

| Field | Details |
| --- | --- |
| Method | `DELETE` |
| URL | `/api/leads/:id` |
| Auth required | Yes, Admin only |
| Params | `id`: Lead ID |
| Response | `{ "message": "Lead deleted" }` |

### GET `/api/leads/export`

| Field | Details |
| --- | --- |
| Method | `GET` |
| URL | `/api/leads/export` |
| Auth required | Yes, Admin only |
| Query params | `status`, `source`, `search`, `sort` |
| Response | CSV file download named `leads.csv` |

## Role Permissions

| Capability | Admin | Sales |
| --- | --- | --- |
| Register and login | Yes | Yes |
| View leads | Yes | Yes |
| Create leads | Yes | Yes |
| Update own leads | Yes | Yes |
| Update any lead | Yes | No |
| Delete leads | Yes | No |
| Export CSV | Yes | No |

## Git Commit Message Conventions

Use clear, conventional commit messages:

| Type | Purpose | Example |
| --- | --- | --- |
| `feat` | New feature | `feat: add lead CSV export` |
| `fix` | Bug fix | `fix: handle expired auth tokens` |
| `docs` | Documentation changes | `docs: update setup instructions` |
| `refactor` | Code restructuring without behavior change | `refactor: simplify lead filters` |
| `style` | Formatting or styling updates | `style: polish dashboard table` |
| `test` | Test additions or updates | `test: add auth controller tests` |
| `chore` | Maintenance tasks | `chore: update dependencies` |

Recommended format:

```text
type: concise imperative summary
```

Examples:

```text
feat: add role-based lead deletion
fix: reset pagination after filter change
docs: document docker setup
```
