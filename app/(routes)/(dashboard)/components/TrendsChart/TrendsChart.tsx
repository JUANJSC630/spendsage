"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Transactions } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import useFormatAmount from "@/hooks/useFormatAmount";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
}

interface TrendsChartProps {
  transactions: Transactions[];
  categories: Category[];
  className?: string;
}

export function TrendsChart({ transactions, categories, className }: TrendsChartProps) {
  const formatAmount = useFormatAmount();
  const { getSymbol } = useCurrencyStore();
  const [symbol, setSymbol] = useState<string>("");

  useEffect(() => {
    setSymbol(getSymbol());
  }, [getSymbol]);

  const categoryMap = new Map();
  categories.forEach(category => {
    categoryMap.set(category.slug, {
      name: category.name,
      color: category.color,
      type: category.type
    });
  });

  // Generate last 6 months of data
  const generateMonthsData = () => {
    const monthsData = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);

      const monthTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      const income = monthTransactions
        .filter(t => categoryMap.get(t.category)?.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = monthTransactions
        .filter(t => categoryMap.get(t.category)?.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      monthsData.push({
        month: format(monthDate, "MMM yyyy"),
        monthShort: format(monthDate, "MMM"),
        income,
        expenses,
        balance: income - expenses,
      });
    }

    return monthsData;
  };

  const monthsData = generateMonthsData();

  const data = {
    labels: monthsData.map(d => d.monthShort),
    datasets: [
      {
        label: "Ingresos",
        data: monthsData.map(d => d.income),
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: "Gastos",
        data: monthsData.map(d => d.expenses),
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "rgba(239, 68, 68, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: "Balance",
        data: monthsData.map(d => d.balance),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const value = `${symbol} ${formatAmount(context.raw.toString())}`;
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Últimos 6 meses",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Monto",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function(value: any) {
            return `${symbol} ${formatAmount(value.toString())}`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📈 Tendencias Financieras
          <span className="text-sm font-normal text-gray-500">(Últimos 6 meses)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Line data={data} options={options} />
        </div>

        {/* Insights Summary */}
        <div className="mt-8 space-y-6">
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Análisis de Tendencias</h3>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {(() => {
                const currentMonth = monthsData[monthsData.length - 1];
                const previousMonth = monthsData[monthsData.length - 2];

                if (!currentMonth || !previousMonth) return null;

                const incomeChange = previousMonth.income > 0 ?
                  ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100 : 0;
                const expenseChange = previousMonth.expenses > 0 ?
                  ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100 : 0;

                // Calculate 6-month averages
                const avgIncome = Math.round(monthsData.reduce((sum, month) => sum + month.income, 0) / monthsData.length);
                const avgExpenses = Math.round(monthsData.reduce((sum, month) => sum + month.expenses, 0) / monthsData.length);

                return (
                  <>
                    {/* Current Month Performance */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h4 className="font-medium text-gray-800">Mes Actual ({currentMonth.monthShort})</h4>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ingresos:</span>
                          <span className="font-medium text-green-700">{symbol}{formatAmount(currentMonth.income.toString())}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gastos:</span>
                          <span className="font-medium text-red-700">{symbol}{formatAmount(currentMonth.expenses.toString())}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="text-gray-600">Balance:</span>
                          <span className={`font-bold ${currentMonth.balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                            {currentMonth.balance >= 0 ? '+' : ''}{symbol}{formatAmount(Math.abs(currentMonth.balance).toString())}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Month-over-Month Change */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <h4 className="font-medium text-gray-800">Cambio vs Mes Anterior</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Ingresos:</span>
                          <div className="flex items-center gap-1">
                            {incomeChange >= 0 ? '📈' : '📉'}
                            <span className={`font-medium ${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Gastos:</span>
                          <div className="flex items-center gap-1">
                            {expenseChange <= 0 ? '📉' : '📈'}
                            <span className={`font-medium ${expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t">
                          {incomeChange >= 0 && expenseChange <= 0 ?
                            '🎉 ¡Tendencia favorable!' :
                            incomeChange < 0 && expenseChange > 0 ?
                            '⚠️ Tendencia preocupante' :
                            '📊 Tendencia mixta'
                          }
                        </div>
                      </div>
                    </div>

                    {/* 6-Month Averages */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <h4 className="font-medium text-gray-800">Promedio 6 Meses</h4>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ingresos:</span>
                          <span className="font-medium text-green-700">{symbol}{new Intl.NumberFormat("de-DE").format(Math.round(avgIncome))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gastos:</span>
                          <span className="font-medium text-red-700">{symbol}{new Intl.NumberFormat("de-DE").format(Math.round(avgExpenses))}</span>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t">
                          {currentMonth.income > avgIncome ?
                            '📊 Ingresos arriba del promedio' :
                            '📉 Ingresos abajo del promedio'
                          }
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Trend Analysis */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <span>🔍</span>
                Análisis de Periodo (6 meses)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {(() => {
                  const totalIncome = monthsData.reduce((sum, month) => sum + month.income, 0);
                  const totalExpenses = monthsData.reduce((sum, month) => sum + month.expenses, 0);
                  const overallBalance = totalIncome - totalExpenses;

                  const highestIncome = Math.max(...monthsData.map(m => m.income));
                  const lowestIncome = Math.min(...monthsData.map(m => m.income));
                  const highestExpenses = Math.max(...monthsData.map(m => m.expenses));
                  const lowestExpenses = Math.min(...monthsData.map(m => m.expenses));

                  return (
                    <>
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-700">💰 Resumen Financiero</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total ingresos:</span>
                            <span className="font-medium text-green-700">{symbol}{new Intl.NumberFormat("de-DE").format(Math.round(totalIncome))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total gastos:</span>
                            <span className="font-medium text-red-700">{symbol}{new Intl.NumberFormat("de-DE").format(Math.round(totalExpenses))}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="text-gray-600">Balance neto:</span>
                            <span className={`font-bold ${overallBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                              {overallBalance >= 0 ? '+' : ''}{symbol}{new Intl.NumberFormat("de-DE").format(Math.round(Math.abs(overallBalance)))}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-700">📊 Rangos</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mayor ingreso:</span>
                            <span className="font-medium text-green-700">{symbol}{new Intl.NumberFormat("de-DE").format(Math.round(highestIncome))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Menor ingreso:</span>
                            <span className="font-medium text-green-600">{symbol}{new Intl.NumberFormat("de-DE").format(Math.round(lowestIncome))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mayor gasto:</span>
                            <span className="font-medium text-red-700">{symbol}{new Intl.NumberFormat("de-DE").format(Math.round(highestExpenses))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Menor gasto:</span>
                            <span className="font-medium text-red-600">{symbol}{new Intl.NumberFormat("de-DE").format(Math.round(lowestExpenses))}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}