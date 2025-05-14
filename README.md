# SpendSage

https://spendsage.vercel.app/

## About the Business

SpendSage is a personal financial management application designed to help users monitor their expenses, income, and plan their finances. The platform offers the following main features:

- **Transaction Management**: Recording and tracking of income and expenses.
- **Payment Scheduling**: Planning and tracking of recurring and scheduled payments.
- **Financial Reports**: Visualization of financial data through charts and statistics.
- **Dashboard**: Overview of the current financial situation.

The application is designed to simplify personal financial management, allowing users to make informed decisions about their finances and maintain better control over their money.

## Technologies Used

### Frontend
- **Next.js**: React framework for server-side rendering and static site generation
- **React**: Library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework for rapid design
- **Shadcn UI**: Reusable UI components
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **React Query**: State management and data fetching
- **Recharts & Chart.js**: Data visualization with charts
- **Zustand**: Lightweight global state management
- **Lucide React**: Icons

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: ORM for databases with TypeScript
- **PostgreSQL**: Relational database
- **Clerk**: Authentication and user management

### DevOps & Tools
- **Vercel**: Deployment and hosting
- **Vercel Analytics**: Usage analytics
- **TypeScript**: Static typing
- **ESLint**: Code linting
- **Prisma Migrations**: Database change management

## Database Structure

The application uses the following main models:
- **Transactions**: Financial transaction records
- **ListPaymentSchedule**: Payment schedule lists
- **PaymentSchedule**: Individual payment schedules
- **PaymentItem**: Individual payment items within a schedule

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/spendsage.git
cd spendsage

# Install dependencies
npm install
# or
yarn

# Configure environment variables
cp .env.example .env
# Edit .env with your settings

# Run Prisma migrations
npx prisma migrate dev

# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
