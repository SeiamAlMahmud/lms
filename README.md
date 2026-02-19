# LMS SaaS Platform

Production-style LMS monorepo with role-based backend and scalable frontend architecture.

## Stack

- Frontend: Next.js, TypeScript, Redux Toolkit, React Hook Form, Zod, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Prisma, MongoDB, JWT auth, RBAC

## Repositories / Apps

- `frontend`
- `backend`

## Deployment Links

- Frontend: `ADD_FRONTEND_DEPLOY_URL`
- Backend: `ADD_BACKEND_DEPLOY_URL`

## Test Credentials

- Super Admin: `ADD_EMAIL` / `ADD_PASSWORD`
- Admin: `ADD_EMAIL` / `ADD_PASSWORD`
- Instructor: `ADD_EMAIL` / `ADD_PASSWORD`
- Student: `ADD_EMAIL` / `ADD_PASSWORD`

## Local Setup

### 1. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Backend base URL: `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:3000`

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## API Documentation (High-level)

Base prefix: `/api/v1`

- Auth: `/auth/*`
- Users: `/users/*`
- Categories: `/categories/*`
- Courses: `/courses/*`
- Lessons: `/lessons/*`
- Enrollments: `/enrollments/*`
- Progress: `/progress/*`
- Analytics: `/analytics/*`
- System settings: `/system/*`

## Frontend Architecture

- `src/app`: App router pages, layouts, loading/error boundaries
- `src/components`: Reusable UI, forms, guards, charts
- `src/hooks`: Custom hooks (`useAuth`, `useRoleRedirect`)
- `src/lib/api`: API abstraction layer
- `src/store`: Redux Toolkit store + slices
- `src/providers`: Global providers

## Notes

- Role protection is implemented in frontend route-level guards and backend middleware.
- Dashboards are responsive and include loading skeletons.
- Admin chart component is lazy-loaded for code splitting.
