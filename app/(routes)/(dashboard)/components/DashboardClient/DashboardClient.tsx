"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transactions } from "@prisma/client";

import ExpenseIncomeChart from "../ExpenseIncomeChart";
import FinancialSummaryDynamic from "../FinancialSummaryDynamic";
import CategoriesSummaryDynamic from "../CategoriesSummaryDynamic";
import { AdvancedMetrics } from "../AdvancedMetrics";
import { TrendsChart } from "../TrendsChart";
import { TitleText } from "../TitleText";
import { useColorThemeStore } from "@/hooks/useColorThemeStore";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
}

interface DashboardClientProps {
  transactions: Transactions[];
  categories: Category[];
}

const months = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

export function DashboardClient({ transactions, categories }: DashboardClientProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [filteredTransactions, setFilteredTransactions] = useState<Transactions[]>([]);
  const { colorTheme } = useColorThemeStore();
  // Generate years array (current year and previous 5 years)
  const years = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  // Filter transactions by selected month and year
  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();

      return (
        transactionMonth === parseInt(selectedMonth) &&
        transactionYear === parseInt(selectedYear)
      );
    });

    setFilteredTransactions(filtered);
  }, [transactions, selectedMonth, selectedYear]);

  const selectedMonthName = months.find(m => m.value === selectedMonth)?.label || "";

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header with filters */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <TitleText />

        <Card className="w-full sm:w-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Período
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Mes</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Año</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full sm:w-[90px]">
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period indicator */}
      <div className="w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-sm font-medium rounded-full" style={{ color: colorTheme }}>
          <CalendarIcon className="h-4 w-4" />
          {selectedMonthName} {selectedYear} • {filteredTransactions.length} Movimientos
        </div>
      </div>

      {/* Advanced Metrics */}
      <AdvancedMetrics
        transactions={filteredTransactions}
        categories={categories}
        selectedMonth={parseInt(selectedMonth)}
        selectedYear={parseInt(selectedYear)}
      />

      {/* Show other components only if there are transactions */}
      {filteredTransactions.length > 0 && (
        <>
          {/* Main Financial Summary */}
          <FinancialSummaryDynamic
            data={filteredTransactions}
            categories={categories}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-4"
          />

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Categories Summary */}
            <div className="xl:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Distribución por Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoriesSummaryDynamic transactions={filteredTransactions} categories={categories} />
                </CardContent>
              </Card>
            </div>

            {/* Monthly Chart */}
            <div className="xl:col-span-2">
              <ExpenseIncomeChart transactions={filteredTransactions} categories={categories} className="h-full" />
            </div>
          </div>

          {/* Trends Section */}
          <TrendsChart
            transactions={transactions}
            categories={categories}
            className="w-full"
          />
        </>
      )}
    </div>
  );
}