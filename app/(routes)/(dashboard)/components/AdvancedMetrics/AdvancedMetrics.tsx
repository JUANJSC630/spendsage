"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  DollarSign,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { Transactions } from "@prisma/client";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { startOfMonth, endOfMonth, subMonths, getDaysInMonth, format } from "date-fns";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
}

interface AdvancedMetricsProps {
  transactions: Transactions[];
  categories: Category[];
  selectedMonth: number;
  selectedYear: number;
}

export function AdvancedMetrics({
  transactions,
  categories,
  selectedMonth,
  selectedYear
}: AdvancedMetricsProps) {
  const { getSymbol } = useCurrencyStore();
  const formatAmount = useFormatAmount();
  const [symbol, setSymbol] = useState<string>("");

  useEffect(() => {
    setSymbol(getSymbol());
  }, [getSymbol]);

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach(category => {
      map.set(category.slug, {
        name: category.name,
        color: category.color,
        type: category.type
      });
    });
    return map;
  }, [categories]);

  const metrics = useMemo(() => {
    const currentDate = new Date(selectedYear, selectedMonth - 1);
    const previousDate = subMonths(currentDate, 1);

    // Current month transactions
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= currentMonthStart && date <= currentMonthEnd;
    });

    // Previous month transactions
    const previousMonthStart = startOfMonth(previousDate);
    const previousMonthEnd = endOfMonth(previousDate);
    const previousMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= previousMonthStart && date <= previousMonthEnd;
    });

    // Calculate totals
    const currentIncome = currentMonthTransactions
      .filter(t => categoryMap.get(t.category)?.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const currentExpenses = currentMonthTransactions
      .filter(t => categoryMap.get(t.category)?.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const previousIncome = previousMonthTransactions
      .filter(t => categoryMap.get(t.category)?.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const previousExpenses = previousMonthTransactions
      .filter(t => categoryMap.get(t.category)?.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Calculate changes
    const incomeChange = previousIncome > 0 ? ((currentIncome - previousIncome) / previousIncome) * 100 : 0;
    const expenseChange = previousExpenses > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0;

    // Daily averages
    const daysInCurrentMonth = getDaysInMonth(currentDate);
    const currentDay = new Date().getDate();
    const isCurrentMonth = selectedMonth === new Date().getMonth() + 1 && selectedYear === new Date().getFullYear();
    const daysToCalculate = isCurrentMonth ? currentDay : daysInCurrentMonth;

    const dailyExpenseAverage = currentExpenses / daysToCalculate;
    const projectedMonthlyExpenses = dailyExpenseAverage * daysInCurrentMonth;

    // Most expensive category
    const expensesByCategory = currentMonthTransactions
      .filter(t => categoryMap.get(t.category)?.type === 'expense')
      .reduce((acc, t) => {
        const categoryInfo = categoryMap.get(t.category);
        const categoryName = categoryInfo?.name || t.category;
        acc[categoryName] = (acc[categoryName] || 0) + parseFloat(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const topExpenseCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    // Balance and remaining budget logic
    const currentBalance = currentIncome - currentExpenses;
    const remainingDays = isCurrentMonth ? daysInCurrentMonth - currentDay : 0;
    const dailyBudgetRemaining = remainingDays > 0 ? currentBalance / remainingDays : 0;

    return {
      currentIncome,
      currentExpenses,
      currentBalance,
      incomeChange,
      expenseChange,
      dailyExpenseAverage,
      projectedMonthlyExpenses,
      topExpenseCategory,
      remainingDays,
      dailyBudgetRemaining,
      transactionCount: currentMonthTransactions.length,
      isCurrentMonth
    };
  }, [transactions, selectedMonth, selectedYear, categoryMap]);

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-red-600 bg-red-50";
    if (change < 0) return "text-green-600 bg-green-50";
    return "text-gray-600 bg-gray-50";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return <BarChart3 className="h-3 w-3" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Daily Average */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
          <CardTitle className="text-xs font-medium">Promedio Diario</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="text-lg font-bold">
            {symbol}{formatAmount(metrics.dailyExpenseAverage.toString())}
          </div>
          <div className="text-xs text-muted-foreground">
            Gasto promedio por día
          </div>
        </CardContent>
      </Card>

      {/* Income Change */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
          <CardTitle className="text-xs font-medium">Ingresos vs Mes Anterior</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="text-lg font-bold">
            {symbol}{formatAmount(metrics.currentIncome.toString())}
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${getChangeColor(metrics.incomeChange)}`}
          >
            {getChangeIcon(metrics.incomeChange)}
            {metrics.incomeChange > 0 ? '+' : ''}{metrics.incomeChange.toFixed(1)}%
          </Badge>
        </CardContent>
      </Card>

      {/* Expense Change */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
          <CardTitle className="text-xs font-medium">Gastos vs Mes Anterior</CardTitle>
          <TrendingUp className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="text-lg font-bold">
            {symbol}{formatAmount(metrics.currentExpenses.toString())}
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${getChangeColor(metrics.expenseChange)}`}
          >
            {getChangeIcon(metrics.expenseChange)}
            {metrics.expenseChange > 0 ? '+' : ''}{metrics.expenseChange.toFixed(1)}%
          </Badge>
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
          <CardTitle className="text-xs font-medium">Categoría Mayor Gasto</CardTitle>
          <Target className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="text-lg font-bold truncate">
            {metrics.topExpenseCategory?.[0] || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground">
            {metrics.topExpenseCategory ?
              `${symbol}${formatAmount(metrics.topExpenseCategory[1].toString())}` :
              "Sin gastos"
            }
          </div>
        </CardContent>
      </Card>

      {/* Projected Expenses (only for current month) */}
      {metrics.isCurrentMonth && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
            <CardTitle className="text-xs font-medium">Proyección del Mes</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="text-lg font-bold">
              {symbol}{formatAmount(metrics.projectedMonthlyExpenses.toString())}
            </div>
            <div className="text-xs text-muted-foreground">
              Gasto proyectado total
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Budget Remaining (only for current month) */}
      {metrics.isCurrentMonth && metrics.remainingDays > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
            <CardTitle className="text-xs font-medium">Presupuesto Diario</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${metrics.dailyBudgetRemaining < 0 ? 'text-red-500' : 'text-green-500'}`} />
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className={`text-lg font-bold ${metrics.dailyBudgetRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {symbol}{formatAmount(Math.abs(metrics.dailyBudgetRemaining).toString())}
            </div>
            <div className="text-xs text-muted-foreground">
              {metrics.dailyBudgetRemaining < 0 ? 'Déficit diario' : `${metrics.remainingDays} días restantes`}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}