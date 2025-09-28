# Next.js Multi-Tenant SaaS Starter (TypeScript, SQLite)

## What this contains (minimal starter)
- Next.js (Pages router) TypeScript starter
- Prisma + SQLite (dev.db) schema for Tenant, User, AuditLog, CallLog
- Subdomain-to-tenant middleware (middleware.ts)
- Auth API: signup, login, logout (bcrypt + JWT in httpOnly cookie)
- Mock Vapi endpoint and Call creation
- Socket.IO basic integration via API route
- Simple admin/user dashboard page with realtime update example
- No Docker required

## Quickstart (no Docker)
1. Make sure Node 18+ is installed.
2. Copy `.env.example` to `.env` and edit if needed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
   This will create `dev.db`.
5. Add a hosts entry for testing subdomains (edit `/etc/hosts` or Windows hosts file):
   ```
   127.0.0.1 acme.localhost
   127.0.0.1 tenant.localhost
   ```
6. Run dev server:
   ```bash
   npm run dev
   ```
7. Open: `http://acme.localhost:3000` and sign up (use tenant subdomain `acme` on signup).

## Notes
- This is a minimal demo focusing on architecture and patterns. Do NOT use in production without further hardening.
- See `prisma/schema.prisma` for DB structure and `pages/api` for main logic.
