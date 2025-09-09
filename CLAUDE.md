# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
yarn dev                 # Start development server on localhost:3000
yarn build               # Build application (includes Prisma generation)
yarn start               # Start production server
yarn lint                # Run ESLint

# Database
yarn prisma generate     # Generate Prisma client
yarn prisma migrate dev  # Run database migrations
yarn prisma studio       # Open Prisma Studio database browser
yarn prisma db push      # Push schema changes to database
```

## Architecture Overview

**Framework**: Next.js 14 with App Router using TypeScript, Tailwind CSS, and Prisma ORM.

**Authentication**: Clerk handles user authentication with userId available throughout the app.

**Database**: PostgreSQL with Prisma ORM. Core models include:
- `Transactions`: Financial transactions with category, amount, date, and optional bank account relations
- `ListPaymentSchedule`: Container for payment schedule groups
- `PaymentSchedule`: Scheduled payment periods with date ranges
- `PaymentItem`: Individual payment items within schedules
- `BankAccount`: User bank accounts with balance tracking

**Key Directories**:
- `app/(routes)/` - Main application pages using App Router
  - `(dashboard)` - Dashboard overview
  - `finances` - Transaction management
  - `list-payment-schedule` - Payment scheduling
  - `reports` - Financial reports and analytics
  - `settings` - User settings
- `app/api/` - API routes for transactions, payment schedules
- `components/ui/` - Shadcn UI components
- `hooks/` - Custom React hooks (currency, color themes, amount formatting)
- `lib/` - Utilities including database connection (`db.ts`) and query helpers
- `utils/` - Icon components and data utilities

**State Management**: 
- Zustand for global state (currency, color themes)
- React Query for server state management
- React Hook Form with Zod validation for forms

**UI Stack**: 
- Shadcn UI components built on Radix UI
- Chart.js and Recharts for data visualization
- Tailwind CSS for styling
- Lucide React for icons

**Database Connection**: Uses global Prisma client pattern in `lib/db.ts` to prevent connection issues in development.