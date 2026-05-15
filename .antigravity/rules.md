# Spendsage — Agent Rules

## Code Quality
- Use strict TypeScript; do not use `any`
- Every public function must have JSDoc
- Do not hardcode credentials or secrets

## Testing
- Use Vitest for testing; do not use Jest

## Git
- Commits must follow the Conventional Commits format

## Stack Conventions
- Framework: Next.js 14 App Router — pages live in `app/(routes)/`, API routes in `app/api/`
- Auth: all API routes must call `auth()` from `@clerk/nextjs/server` and return 401 if no userId
- DB: use the shared Prisma client from `lib/db.ts`; never instantiate `PrismaClient` directly
- Category queries: use helpers from `lib/categoryQueries.ts` (handles user + default categories)
- State: Zustand for global UI state (currency, color theme); React Query for server state
- Forms: React Hook Form + Zod validation
- UI: Shadcn components (`components/ui/`); Lucide icons; Tailwind CSS
- Dates: use `date-fns` (already installed); format as `dd/MM/yyyy` in the UI

## Budget Model Constraint
- `Budget` has a unique constraint on `[userId, category, month, year]` — account for this on upserts
