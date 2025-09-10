import { Wallet } from 'lucide-react';
import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { BudgetsPageClient } from './components/BudgetsPageClient';

// Interfaces que coinciden con las del componente cliente
interface BudgetData {
  id: string;
  name: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  spent: number;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
}

interface BudgetAlert {
  id: string;
  title: string;
  description: string;
  variant: "default" | "destructive";
}

// Versión de la página para servidor
export default async function BudgetsPage() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Fetch budgets
  const budgets = await db.budget.findMany({
    where: {
      userId,
      month: currentMonth,
      year: currentYear
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch categories for the budgets
  const categories = await db.category.findMany({
    where: {
      userId
    }
  });

  // Create a map of category slugs to their details
  const categoryMap = new Map();
  categories.forEach(category => {
    categoryMap.set(category.slug, {
      id: category.id,
      name: category.name,
      color: category.color
    });
  });

  if (budgets.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Presupuestos</h1>
        </div>
        <Card className="shadow-sm border border-slate-100">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Wallet className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No hay presupuestos para este mes
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Crea tu primer presupuesto para comenzar a gestionar tus gastos y mantener tus finanzas bajo control.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate total budget amount
  const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount), 0);
  
  // Calculate actual spent amounts from transactions for the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
  
  // Get all transactions for the current month and user
  const transactions = await db.transactions.findMany({
    where: {
      userId,
      date: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth
      },
      category: {
        not: "income" // Only count expense transactions
      }
    },
    select: {
      category: true,
      amount: true
    }
  });
  
  // Calculate spent amounts by category
  const spentByCategory = new Map<string, number>();
  transactions.forEach(tx => {
    const current = spentByCategory.get(tx.category) || 0;
    spentByCategory.set(tx.category, current + parseFloat(tx.amount));
  });
  
  // Map budgets with real spent amounts
  const budgetsWithSpent = budgets.map(budget => {
    const spent = spentByCategory.get(budget.category) || 0;
    return { ...budget, spent };
  });
  
  const totalSpent = budgetsWithSpent.reduce((sum, budget) => sum + (budget.spent || 0), 0);

  // Create budget alerts
  const alerts: BudgetAlert[] = [];
  
  // Check for overspent budgets
  const overspentBudgets = budgetsWithSpent.filter(budget => budget.spent > parseFloat(budget.amount));
  if (overspentBudgets.length > 0) {
    alerts.push({
      id: "overspent",
      title: "Presupuestos excedidos",
      description: `Tienes ${overspentBudgets.length} presupuesto(s) que han superado el límite establecido.`,
      variant: "destructive"
    });
  }

  // Check if total spent is near total budget
  if (totalSpent > totalBudget * 0.9 && totalSpent <= totalBudget) {
    alerts.push({
      id: "near-limit",
      title: "Cerca del límite",
      description: "Estás aproximándote al límite de tu presupuesto total para este mes.",
      variant: "default"
    });
  }

  // Prepare budget data for client component
  const budgetsForClient: BudgetData[] = budgetsWithSpent.map(budget => {
    const categoryInfo = categoryMap.get(budget.category) || null;
    
    return {
      id: budget.id,
      name: categoryInfo?.name || budget.category, // Use category name if available, fallback to slug
      amount: parseFloat(budget.amount),
      startDate: new Date(budget.year, budget.month - 1, 1),
      endDate: new Date(budget.year, budget.month, 0),
      spent: budget.spent,
      categoryId: categoryInfo?.id || null,
      category: categoryInfo
    };
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Presupuestos</h1>
      </div>
      
      <BudgetsPageClient 
        budgets={budgetsForClient}
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        alerts={alerts}
      />
    </div>
  );
}
