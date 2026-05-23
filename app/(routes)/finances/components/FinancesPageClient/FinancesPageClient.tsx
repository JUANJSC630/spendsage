"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import {
  useTransactions,
  useTransactionCategories,
} from "@/hooks/use-transactions";
import { getCategoryInfo } from "@/lib/categoryMapping";
import { FormTransaction } from "../FormTransaction";
import { ListTransaction } from "../ListTransaction/ListTransaction";

const MONTHS = [
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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function FinancesPageClient() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    (now.getMonth() + 1).toString(),
  );
  const [selectedYear, setSelectedYear] = useState(
    now.getFullYear().toString(),
  );

  const { colorTheme } = useSyncColorTheme();
  const { getSymbol } = useCurrencyStore();
  const formatAmount = useFormatAmount();

  const { data: allTransactions = [], isLoading: loadingTx } =
    useTransactions();
  const { data: categories = [] } = useTransactionCategories();

  const currentYear = now.getFullYear();
  const years = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const y = currentYear - i;
        return { value: y.toString(), label: y.toString() };
      }),
    [currentYear],
  );

  const filtered = useMemo(
    () =>
      allTransactions.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() + 1 === parseInt(selectedMonth) &&
          d.getFullYear() === parseInt(selectedYear)
        );
      }),
    [allTransactions, selectedMonth, selectedYear],
  );

  const { totalIncome, totalExpenses, totalBalance } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    filtered.forEach((t) => {
      const amount = parseFloat(t.amount);
      const { category } = getCategoryInfo(categories, t.category);
      if (category?.type === "income") income += amount;
      else if (category?.type === "expense") expenses += amount;
    });
    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: income - expenses,
    };
  }, [filtered, categories]);

  const symbol = getSymbol();
  const selectedMonthName =
    MONTHS.find((m) => m.value === selectedMonth)?.label ?? "";

  const stats = [
    {
      key: "income",
      label: "Ingresos",
      value: totalIncome,
      Icon: TrendingUp,
      color: "#10b981",
      bg: "#f0fdf4",
    },
    {
      key: "expenses",
      label: "Gastos",
      value: totalExpenses,
      Icon: TrendingDown,
      color: "#ef4444",
      bg: "#fef2f2",
    },
    {
      key: "balance",
      label: "Balance",
      value: totalBalance,
      Icon: ArrowLeftRight,
      color: totalBalance >= 0 ? colorTheme : "#ef4444",
      bg: totalBalance >= 0 ? "#f8fafc" : "#fef2f2",
    },
  ];

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] w-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Finanzas
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {selectedMonthName} {selectedYear} · {filtered.length} movimientos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[130px] h-9 text-sm border-slate-200 bg-slate-50 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[90px] h-9 text-sm border-slate-200 bg-slate-50 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y.value} value={y.value}>
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-3 gap-3 sm:gap-4 mb-8"
      >
        {stats.map(({ key, label, value, Icon, color, bg }) => (
          <div
            key={key}
            className="rounded-2xl px-4 sm:px-5 py-4"
            style={{ backgroundColor: bg }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
              <span className="text-[11px] font-medium text-slate-500 truncate">
                {label}
              </span>
            </div>
            <p
              className="text-lg sm:text-xl font-bold tabular-nums leading-none"
              style={{ color }}
            >
              {symbol}
              {formatAmount(value.toString())}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Form + List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div variants={fadeUp}>
          <FormTransaction />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ListTransaction
            transactions={filtered}
            categories={categories}
            isLoading={loadingTx}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
