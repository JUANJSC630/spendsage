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

import CardTotal from "../CardTotal/CardTotal";
import { FromTransaction } from "../FormTransaction";
import { ListTransaction } from "../ListTransaction/ListTransaction";

interface Transaction {
  id: string;
  amount: string;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface FinancesPageClientProps {
  transactions: Transaction[];
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

export function FinancesPageClient({ transactions }: FinancesPageClientProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] w-full">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Finanzas</h1>
        </div>

        <Card className="w-full sm:w-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrar por período
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Mes</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Seleccionar mes" />
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
                  <SelectTrigger className="w-full sm:w-[100px]">
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
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
          <CalendarIcon className="h-4 w-4" />
          {selectedMonthName} {selectedYear} • {filteredTransactions.length} transacciones
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-slate-100 p-4 rounded-md transition-colors duration-300 ease-in">
            <FromTransaction />
          </div>
          <div className="border border-slate-100 p-4 rounded-md transition-colors duration-300 ease-in">
            <ListTransaction transactions={filteredTransactions} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardTotal transactions={filteredTransactions} type="income" title="Total de Ingresos" />
          <CardTotal
            transactions={filteredTransactions}
            type="expenses"
            title="Total de Gastos"
          />
          <CardTotal transactions={filteredTransactions} type="balance" title="Balance Total" />
        </div>
      </div>
    </div>
  );
}