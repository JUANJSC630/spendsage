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
  AlertTriangle,
  Plus,
  TrendingUpIcon
} from "lucide-react";
import { Transactions } from "@prisma/client";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { startOfMonth, endOfMonth, subMonths, getDaysInMonth, format } from "date-fns";
import { getCategoryInfo } from "@/lib/categoryMapping";

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

    // Calculate totals - fix parsing to handle different amount formats
    const parseAmount = (amount: string): number => {
      if (!amount) return 0;
      // Remove all non-numeric characters except dots and commas
      const cleaned = amount.replace(/[^\d.,]/g, '');
      // Handle European format (1.234,56) vs US format (1,234.56)
      if (cleaned.includes(',') && cleaned.includes('.')) {
        // European format: 1.234,56
        const value = cleaned.replace(/\./g, '').replace(',', '.');
        return parseFloat(value) || 0;
      } else if (cleaned.includes(',')) {
        // Could be decimal separator or thousands separator
        const parts = cleaned.split(',');
        if (parts.length === 2 && parts[1].length <= 2) {
          // Decimal separator: 1234,56
          return parseFloat(cleaned.replace(',', '.')) || 0;
        } else {
          // Thousands separator: 1,234
          return parseFloat(cleaned.replace(/,/g, '')) || 0;
        }
      } else {
        // Simple number or dot as decimal separator
        return parseFloat(cleaned) || 0;
      }
    };

    const currentIncome = currentMonthTransactions
      .filter(t => {
        const categoryInfo = getCategoryInfo(categories, t.category);
        return categoryInfo.category?.type === 'income';
      })
      .reduce((sum, t) => sum + parseAmount(t.amount), 0);

    const currentExpenses = currentMonthTransactions
      .filter(t => {
        const categoryInfo = getCategoryInfo(categories, t.category);
        return categoryInfo.category?.type === 'expense';
      })
      .reduce((sum, t) => sum + parseAmount(t.amount), 0);

    const previousIncome = previousMonthTransactions
      .filter(t => {
        const categoryInfo = getCategoryInfo(categories, t.category);
        return categoryInfo.category?.type === 'income';
      })
      .reduce((sum, t) => sum + parseAmount(t.amount), 0);

    const previousExpenses = previousMonthTransactions
      .filter(t => {
        const categoryInfo = getCategoryInfo(categories, t.category);
        return categoryInfo.category?.type === 'expense';
      })
      .reduce((sum, t) => sum + parseAmount(t.amount), 0);

    // Calculate changes
    const incomeChange = previousIncome > 0 ? ((currentIncome - previousIncome) / previousIncome) * 100 : 0;
    const expenseChange = previousExpenses > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0;

    // Daily averages - fix calculation logic
    const daysInCurrentMonth = getDaysInMonth(currentDate);
    const currentDay = new Date().getDate();
    const isCurrentMonth = selectedMonth === new Date().getMonth() + 1 && selectedYear === new Date().getFullYear();
    const daysToCalculate = isCurrentMonth ? Math.max(currentDay, 1) : daysInCurrentMonth;

    const dailyExpenseAverage = daysToCalculate > 0 ? currentExpenses / daysToCalculate : 0;
    const projectedMonthlyExpenses = isCurrentMonth ? dailyExpenseAverage * daysInCurrentMonth : currentExpenses;

    // Most expensive category - fix parsing and use category mapping
    const expensesByCategory = currentMonthTransactions
      .filter(t => {
        const categoryInfo = getCategoryInfo(categories, t.category);
        return categoryInfo.category?.type === 'expense';
      })
      .reduce((acc, t) => {
        const categoryInfo = getCategoryInfo(categories, t.category);
        const categoryName = categoryInfo.category?.name || t.category;
        acc[categoryName] = (acc[categoryName] || 0) + parseAmount(t.amount);
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
  }, [transactions, selectedMonth, selectedYear, categories]);

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

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // Show empty state if no transactions for the selected period
  if (metrics.transactionCount === 0) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUpIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  No hay transacciones en {months[selectedMonth - 1]} {selectedYear}
                </h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Para ver analíticas y métricas, necesitas agregar transacciones.
                  Registra tus ingresos y gastos para comenzar a visualizar tu situación financiera.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <a
                  href="/finances"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Agregar transacción
                </a>
                <span className="text-xs text-gray-500 mt-1 sm:mt-2">
                  O cambia el período usando los filtros arriba
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            {symbol}{formatAmount(metrics.dailyExpenseAverage)}
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
            {symbol}{formatAmount(metrics.currentIncome)}
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
            {symbol}{formatAmount(metrics.currentExpenses)}
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
              `${symbol}${formatAmount(metrics.topExpenseCategory[1])}` :
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
              {symbol}{formatAmount(metrics.projectedMonthlyExpenses)}
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
              {symbol}{formatAmount(Math.abs(metrics.dailyBudgetRemaining))}
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