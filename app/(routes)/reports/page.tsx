"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Star,
} from "lucide-react";
import {
  useTransactions,
  useTransactionCategories,
} from "@/hooks/use-transactions";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { getCategoryInfo } from "@/lib/categoryMapping";

const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];
const MONTHS_FULL = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function CompactTooltip({
  active, payload, label, symbol, formatAmount,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  symbol: string;
  formatAmount: (v: string | number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2.5 text-xs">
      <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold tabular-nums">
            {symbol}{formatAmount(p.value.toString())}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());

  const { colorTheme } = useSyncColorTheme();
  const { getSymbol } = useCurrencyStore();
  const formatAmount = useFormatAmount();
  const symbol = getSymbol();

  const { data: allTransactions = [], isLoading } = useTransactions();
  const { data: categories = [] } = useTransactionCategories();

  const currentYear = now.getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  // Year-filtered transactions
  const yearTxs = useMemo(
    () => allTransactions.filter((t) => new Date(t.date).getFullYear() === year),
    [allTransactions, year],
  );

  // 12-month breakdown
  const monthlyData = useMemo(() =>
    MONTHS.map((label, i) => {
      const m = i + 1;
      const txs = yearTxs.filter((t) => new Date(t.date).getMonth() + 1 === m);
      let income = 0, expenses = 0;
      txs.forEach((t) => {
        const { category } = getCategoryInfo(categories, t.category);
        const amt = parseFloat(t.amount);
        if (category?.type === "income") income += amt;
        else expenses += amt;
      });
      return { label, month: m, income, expenses, balance: income - expenses, txCount: txs.length };
    }),
    [yearTxs, categories],
  );

  // Annual totals
  const { totalIncome, totalExpenses, totalSaved, savingsRate } = useMemo(() => {
    const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
    const totalExpenses = monthlyData.reduce((s, m) => s + m.expenses, 0);
    const totalSaved = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (totalSaved / totalIncome) * 100 : 0;
    return { totalIncome, totalExpenses, totalSaved, savingsRate };
  }, [monthlyData]);

  // Best month (highest positive balance)
  const bestMonth = useMemo(() => {
    const withData = monthlyData.filter((m) => m.income > 0 || m.expenses > 0);
    if (!withData.length) return null;
    return withData.reduce((best, m) => (m.balance > best.balance ? m : best));
  }, [monthlyData]);

  // Worst month
  const worstMonth = useMemo(() => {
    const withData = monthlyData.filter((m) => m.expenses > 0);
    if (!withData.length) return null;
    return withData.reduce((worst, m) => (m.expenses > worst.expenses ? m : worst));
  }, [monthlyData]);

  // Category breakdown for the year
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { name: string; color: string; amount: number; count: number }>();
    yearTxs.forEach((t) => {
      const { category, resolvedSlug } = getCategoryInfo(categories, t.category);
      if (category?.type === "income") return;
      const existing = map.get(resolvedSlug);
      const amt = parseFloat(t.amount);
      if (existing) {
        existing.amount += amt;
        existing.count += 1;
      } else {
        map.set(resolvedSlug, {
          name: category?.name ?? t.category,
          color: category?.color ?? "#94a3b8",
          amount: amt,
          count: 1,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount).slice(0, 7);
  }, [yearTxs, categories]);

  const maxCatAmount = categoryBreakdown[0]?.amount ?? 1;

  const hasData = yearTxs.length > 0;

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] w-full space-y-5"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Reportes</h1>
          <p className="text-sm text-slate-400 mt-1">
            {yearTxs.length} movimientos en {year}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setYear((y) => y - 1)}
            disabled={!years.includes(year - 1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-slate-700 min-w-[48px] text-center">{year}</span>
          <button
            onClick={() => setYear((y) => y + 1)}
            disabled={year >= currentYear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Annual summary cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-emerald-50 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-[11px] font-medium text-emerald-600">Ingresos</p>
          </div>
          <p className="text-lg font-bold text-emerald-700 tabular-nums leading-none">
            {symbol}{formatAmount(Math.round(totalIncome).toString())}
          </p>
        </div>

        <div className="rounded-2xl bg-red-50 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            <p className="text-[11px] font-medium text-red-500">Gastos</p>
          </div>
          <p className="text-lg font-bold text-red-600 tabular-nums leading-none">
            {symbol}{formatAmount(Math.round(totalExpenses).toString())}
          </p>
        </div>

        <div className={`rounded-2xl p-4 ${totalSaved >= 0 ? "bg-blue-50" : "bg-red-50"}`}>
          <div className="flex items-center gap-1.5 mb-2">
            <PiggyBank className={`w-3.5 h-3.5 ${totalSaved >= 0 ? "text-blue-400" : "text-red-400"}`} />
            <p className={`text-[11px] font-medium ${totalSaved >= 0 ? "text-blue-500" : "text-red-500"}`}>
              Ahorro anual
            </p>
          </div>
          <p className={`text-lg font-bold tabular-nums leading-none ${totalSaved >= 0 ? "text-blue-700" : "text-red-600"}`}>
            {totalSaved >= 0 ? "+" : "−"}{symbol}{formatAmount(Math.abs(Math.round(totalSaved)).toString())}
          </p>
          {totalIncome > 0 && (
            <p className={`text-[10px] mt-0.5 font-medium ${totalSaved >= 0 ? "text-blue-400" : "text-red-400"}`}>
              {savingsRate.toFixed(1)}% del ingreso
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-amber-50 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <p className="text-[11px] font-medium text-amber-600">Mejor mes</p>
          </div>
          {bestMonth ? (
            <>
              <p className="text-lg font-bold text-amber-700 leading-none">
                {MONTHS_FULL[bestMonth.month - 1]}
              </p>
              <p className="text-[10px] text-amber-500 mt-0.5 font-medium tabular-nums">
                +{symbol}{formatAmount(Math.round(bestMonth.balance).toString())}
              </p>
            </>
          ) : (
            <p className="text-sm text-amber-300 font-medium">Sin datos</p>
          )}
        </div>
      </motion.div>

      {/* Bar chart */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-slate-800">Ingresos vs Gastos</p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" />
              Ingresos
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />
              Gastos
            </span>
          </div>
        </div>

        {!hasData ? (
          <div className="flex items-center justify-center h-48 text-slate-300">
            <p className="text-sm">Sin datos para {year}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barCategoryGap="28%" barGap={2}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis hide />
              <Tooltip
                content={
                  <CompactTooltip symbol={symbol} formatAmount={formatAmount} />
                }
                cursor={{ fill: "#f1f5f9", radius: 6 }}
              />
              <Bar dataKey="income" name="Ingresos" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expenses" name="Gastos" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Category breakdown + monthly table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Top categories */}
        <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-800 mb-4">Top categorías del año</p>
          {categoryBreakdown.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-xs text-slate-300">Sin gastos en {year}</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {categoryBreakdown.map((cat, i) => {
                const pct = (cat.amount / maxCatAmount) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs text-slate-600 truncate">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{cat.count} mov.</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 tabular-nums ml-2 flex-shrink-0">
                        {symbol}{formatAmount(Math.round(cat.amount).toString())}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: i * 0.07, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Month-by-month table */}
        <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-800 mb-4">Mes a mes</p>
          <div className="space-y-1.5 overflow-auto max-h-[320px]">
            {monthlyData
              .filter((m) => m.income > 0 || m.expenses > 0)
              .reverse()
              .map((m) => (
                <div
                  key={m.month}
                  className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-2.5"
                >
                  <span className="text-xs font-semibold text-slate-500 w-8 flex-shrink-0">
                    {MONTHS[m.month - 1]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-[11px] tabular-nums">
                      <span className="text-emerald-600 font-medium">
                        +{symbol}{formatAmount(Math.round(m.income).toString())}
                      </span>
                      <span className="text-red-500 font-medium">
                        −{symbol}{formatAmount(Math.round(m.expenses).toString())}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(0, Math.min(100, m.income > 0 ? (m.balance / m.income) * 100 : 0))}%`,
                          backgroundColor: m.balance >= 0 ? colorTheme : "#ef4444",
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold tabular-nums flex-shrink-0 ${
                      m.balance >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {m.balance >= 0 ? "+" : "−"}
                    {symbol}{formatAmount(Math.abs(Math.round(m.balance)).toString())}
                  </span>
                </div>
              ))}
            {monthlyData.filter((m) => m.income > 0 || m.expenses > 0).length === 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-xs text-slate-300">Sin movimientos en {year}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
