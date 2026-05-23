"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Target,
  Flame,
  BarChart3,
  Clock,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  useTransactions,
  useTransactionCategories,
} from "@/hooks/use-transactions";
import useFormatAmount from "@/hooks/useFormatAmount";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { getCategoryInfo } from "@/lib/categoryMapping";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Health Score Ring ────────────────────────────────────────────────────────
function HealthRing({ score }: { score: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 71 ? "#10b981" : score >= 41 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 71 ? "Excelente" : score >= 41 ? "En camino" : "Atención";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="10"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800">{score}</span>
          <span className="text-[10px] text-slate-400 font-medium">/100</span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

// ── 6-Month Trend Bars ───────────────────────────────────────────────────────
function TrendBars({
  data,
}: {
  data: { month: string; income: number; expenses: number }[];
}) {
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1);
  return (
    <>
      <div className="flex items-end gap-1.5 h-16">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex gap-0.5 items-end h-full">
            <motion.div
              className="flex-1 rounded-t-sm bg-emerald-400"
              style={{ minHeight: 2 }}
              initial={{ height: 0 }}
              animate={{ height: `${(d.income / maxVal) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
            />
            <motion.div
              className="flex-1 rounded-t-sm bg-red-400"
              style={{ minHeight: 2 }}
              initial={{ height: 0 }}
              animate={{ height: `${(d.expenses / maxVal) * 100}%` }}
              transition={{
                duration: 0.6,
                delay: i * 0.08 + 0.04,
                ease: "easeOut",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex mt-1.5">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 text-center text-[10px] text-slate-400"
          >
            {d.month}
          </div>
        ))}
      </div>
    </>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function DashboardClient() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { user } = useUser();
  const { data: allTransactions = [] } = useTransactions();
  const { data: categories = [] } = useTransactionCategories();
  const formatAmount = useFormatAmount();
  const { getSymbol } = useCurrencyStore();
  const { colorTheme } = useSyncColorTheme();
  const symbol = getSymbol();

  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";
  const firstName = user?.firstName ?? "";

  // Current month txs
  const currentTxs = useMemo(
    () =>
      allTransactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      }),
    [allTransactions, month, year],
  );

  // Previous month
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevTxs = useMemo(
    () =>
      allTransactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === prevMonth && d.getFullYear() === prevYear;
      }),
    [allTransactions, prevMonth, prevYear],
  );

  // Financial totals
  const { income, expenses, balance, savingsRate } = useMemo(() => {
    let income = 0,
      expenses = 0;
    currentTxs.forEach((t) => {
      const { category } = getCategoryInfo(categories, t.category);
      const amt = parseFloat(t.amount);
      if (category?.type === "income") income += amt;
      else expenses += amt;
    });
    const balance = income - expenses;
    const savingsRate = income > 0 ? (balance / income) * 100 : 0;
    return { income, expenses, balance, savingsRate };
  }, [currentTxs, categories]);

  const { prevExpenses } = useMemo(() => {
    let prevExpenses = 0;
    prevTxs.forEach((t) => {
      const { category } = getCategoryInfo(categories, t.category);
      if (category?.type !== "income") prevExpenses += parseFloat(t.amount);
    });
    return { prevExpenses };
  }, [prevTxs, categories]);

  // Category breakdown (expenses only)
  const categoryBreakdown = useMemo(() => {
    const map = new Map<
      string,
      { name: string; color: string; amount: number }
    >();
    currentTxs.forEach((t) => {
      const { category, resolvedSlug } = getCategoryInfo(
        categories,
        t.category,
      );
      if (category?.type === "income") return;
      const existing = map.get(resolvedSlug);
      if (existing) existing.amount += parseFloat(t.amount);
      else
        map.set(resolvedSlug, {
          name: category?.name ?? t.category,
          color: category?.color ?? "#94a3b8",
          amount: parseFloat(t.amount),
        });
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [currentTxs, categories]);

  const topCategory = categoryBreakdown[0];
  const topCategoryPct =
    expenses > 0 && topCategory ? (topCategory.amount / expenses) * 100 : 0;

  // Daily stats
  const isCurrentMonth =
    month === now.getMonth() + 1 && year === now.getFullYear();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysElapsed = isCurrentMonth ? now.getDate() : daysInMonth;
  const daysRemaining = isCurrentMonth ? daysInMonth - now.getDate() : 0;
  const dailyExpenses = daysElapsed > 0 ? expenses / daysElapsed : 0;
  const projectedExpenses = dailyExpenses * daysInMonth;
  const dailyBudget =
    isCurrentMonth && daysRemaining > 0 ? balance / daysRemaining : 0;

  // Month-over-month
  const expenseMoM =
    prevExpenses > 0 ? ((expenses - prevExpenses) / prevExpenses) * 100 : null;

  // Health score
  const healthScore = useMemo(() => {
    let pts = 0;
    if (savingsRate >= 20) pts += 35;
    else if (savingsRate >= 10) pts += 25;
    else if (savingsRate >= 0) pts += 15;
    if (income > 0) pts += 20;
    if (expenseMoM === null) pts += 15;
    else if (expenseMoM <= 0) pts += 25;
    else if (expenseMoM <= 10) pts += 20;
    else if (expenseMoM <= 30) pts += 10;
    const catCount = categoryBreakdown.length;
    if (catCount >= 4) pts += 20;
    else if (catCount >= 2) pts += 12;
    else if (catCount >= 1) pts += 6;
    return Math.min(pts, 100);
  }, [savingsRate, income, expenseMoM, categoryBreakdown.length]);

  const healthBreakdown = [
    {
      label: "Tasa de ahorro",
      ok: savingsRate >= 20,
      warn: savingsRate >= 0 && savingsRate < 20,
      detail: `${savingsRate >= 0 ? "+" : ""}${savingsRate.toFixed(1)}%`,
    },
    {
      label: "Tendencia de gastos",
      ok: expenseMoM !== null && expenseMoM <= 0,
      warn: expenseMoM === null || (expenseMoM > 0 && expenseMoM <= 30),
      detail:
        expenseMoM !== null
          ? `${expenseMoM >= 0 ? "+" : ""}${expenseMoM.toFixed(0)}% vs anterior`
          : "Sin datos previos",
    },
    {
      label: "Diversificación",
      ok: categoryBreakdown.length >= 4,
      warn: categoryBreakdown.length >= 2,
      detail: `${categoryBreakdown.length} categoría${categoryBreakdown.length !== 1 ? "s" : ""}`,
    },
  ];

  // Smart insights — only show when the data is real and meaningful
  const insights: {
    type: "success" | "warning" | "danger" | "info";
    text: string;
  }[] = [];

  // 1. Savings rate — requires income AND expenses, balance must be nonzero to show danger
  if (income > 0 && expenses > 0) {
    if (savingsRate >= 20) {
      insights.push({
        type: "success",
        text: `Tasa de ahorro de ${savingsRate.toFixed(1)}% — superas el objetivo del 20% recomendado.`,
      });
    } else if (savingsRate > 0) {
      insights.push({
        type: "warning",
        text: `Tasa de ahorro de ${savingsRate.toFixed(1)}%. El objetivo es 20% — te faltan ${(20 - savingsRate).toFixed(1)}pp.`,
      });
    } else if (balance < 0) {
      // Only show when genuinely overspending — never when balance = 0
      insights.push({
        type: "danger",
        text: `Estás gastando ${symbol}${formatAmount(Math.abs(balance))} más de lo que ingresas este mes.`,
      });
    }
  }

  // 2. Category concentration — meaningless with only 1 category; raise threshold to 65%
  if (topCategory && topCategoryPct > 65 && categoryBreakdown.length > 1) {
    insights.push({
      type: "warning",
      text: `${topCategory.name} representa el ${topCategoryPct.toFixed(0)}% de tus gastos. Diversificar te da más control.`,
    });
  }

  // 3. Month-over-month — only when both months have real expenses
  if (expenseMoM !== null && expenses > 0 && prevExpenses > 0) {
    if (expenseMoM > 20) {
      insights.push({
        type: "danger",
        text: `Tus gastos subieron ${expenseMoM.toFixed(0)}% vs ${MONTHS[prevMonth - 1]}. Identifica qué categoría impulsó el alza.`,
      });
    } else if (expenseMoM < -10) {
      insights.push({
        type: "success",
        text: `Bajaste tus gastos un ${Math.abs(expenseMoM).toFixed(0)}% vs ${MONTHS[prevMonth - 1]}. Excelente trabajo.`,
      });
    }
  }

  // 4. Projection — only mid-month with real expenses and income, not when already doing great
  const savingsInsightIsGood = insights.some(
    (i) => i.type === "success" && i.text.includes("ahorro"),
  );
  if (
    isCurrentMonth &&
    income > 0 &&
    expenses > 0 &&
    daysElapsed >= 5 &&
    !savingsInsightIsGood &&
    projectedExpenses > income * 0.85
  ) {
    insights.push({
      type: "warning",
      text: `A este ritmo proyectas gastar ${symbol}${formatAmount(Math.round(projectedExpenses))} en ${MONTHS[month - 1]} — cerca de tu ingreso total.`,
    });
  }

  // 5. Daily budget — only when there's real margin and income registered
  if (
    isCurrentMonth &&
    income > 0 &&
    balance > 0 &&
    daysRemaining > 1 &&
    dailyBudget > 0
  ) {
    insights.push({
      type: "info",
      text: `Quedan ${daysRemaining} días. Presupuesto diario disponible: ${symbol}${formatAmount(Math.round(dailyBudget))}.`,
    });
  }

  // 6. No transactions — the only info insight when month is empty
  if (currentTxs.length === 0) {
    insights.push({
      type: "info",
      text: `No hay movimientos en ${MONTHS[month - 1]} ${year}. Agrega transacciones para ver tu análisis completo.`,
    });
  }

  const visibleInsights = insights.slice(0, 4);

  // 6-month trend
  const trendData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const rawM = month - 5 + i;
      const y = rawM <= 0 ? year - 1 : year;
      const m = ((rawM - 1 + 12) % 12) + 1;
      const txs = allTransactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === m && d.getFullYear() === y;
      });
      let inc = 0,
        exp = 0;
      txs.forEach((t) => {
        const { category } = getCategoryInfo(categories, t.category);
        const amt = parseFloat(t.amount);
        if (category?.type === "income") inc += amt;
        else exp += amt;
      });
      return { month: MONTHS[m - 1].slice(0, 3), income: inc, expenses: exp };
    });
  }, [allTransactions, categories, month, year]);

  // Recent transactions
  const recentTxs = useMemo(
    () =>
      [...currentTxs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [currentTxs],
  );

  const goToPrev = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const goToNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-[calc(2rem+env(safe-area-inset-bottom))] w-full space-y-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {greeting}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {currentTxs.length} movimiento
            {currentTxs.length !== 1 ? "s" : ""} en {MONTHS[month - 1]}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
          <button
            onClick={goToPrev}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-700 min-w-[96px] text-center">
            {MONTHS[month - 1]} {year}
          </span>
          <button
            onClick={goToNext}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* ── Hero balance card ───────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl p-5 text-white"
        style={{
          background: `linear-gradient(135deg, ${colorTheme} 0%, ${colorTheme}bb 100%)`,
        }}
      >
        {/* Top row: balance + savings rate */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] font-medium opacity-60 mb-1 uppercase tracking-wider">
              Balance del mes
            </p>
            <p className="text-2xl sm:text-3xl font-bold tabular-nums">
              {balance >= 0 ? "+" : "−"}
              {symbol}
              {formatAmount(Math.abs(balance))}
            </p>
          </div>
          {income > 0 && (
            <div className="text-right flex-shrink-0">
              <p className="text-[11px] opacity-60 mb-1">Ahorro</p>
              <p className="text-2xl font-bold tabular-nums">
                {savingsRate.toFixed(1)}%
              </p>
            </div>
          )}
        </div>

        {/* Income / Expenses chips */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/10 rounded-xl px-3.5 py-2.5">
            <p className="text-[10px] opacity-60 mb-0.5">Ingresos</p>
            <p className="text-sm font-bold tabular-nums">
              +{symbol}
              {formatAmount(income)}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl px-3.5 py-2.5">
            <p className="text-[10px] opacity-60 mb-0.5">Gastos</p>
            <p className="text-sm font-bold tabular-nums">
              −{symbol}
              {formatAmount(expenses)}
            </p>
          </div>
        </div>

        {income > 0 && (
          <div>
            <div className="flex justify-between text-[11px] mb-1.5 opacity-60">
              <span>Tasa de ahorro</span>
              <span className="font-semibold">{savingsRate.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.max(0, Math.min(savingsRate, 100))}%`,
                }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Quick stats 2×2 ────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] font-medium text-slate-500">
              Prom. diario
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800 tabular-nums">
            {symbol}
            {formatAmount(Math.round(dailyExpenses))}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">en gastos</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Target className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-medium text-slate-500">
              Top categoría
            </span>
          </div>
          {topCategory ? (
            <>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: topCategory.color }}
                />
                <p className="text-sm font-bold text-slate-800 truncate">
                  {topCategory.name}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {topCategoryPct.toFixed(0)}% de gastos
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-300 font-medium">—</p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-medium text-slate-500">
              vs mes anterior
            </span>
          </div>
          {expenseMoM !== null ? (
            <>
              <p
                className={`text-lg font-bold tabular-nums ${expenseMoM > 0 ? "text-red-500" : "text-emerald-600"}`}
              >
                {expenseMoM > 0 ? "+" : ""}
                {expenseMoM.toFixed(0)}%
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">en gastos</p>
            </>
          ) : (
            <p className="text-sm text-slate-300 font-medium">Sin datos</p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-medium text-slate-500">
              {isCurrentMonth ? "Días restantes" : "Período"}
            </span>
          </div>
          {isCurrentMonth ? (
            <>
              <p className="text-lg font-bold text-slate-800">
                {daysRemaining}d
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {dailyBudget > 0
                  ? `${symbol}${formatAmount(Math.round(dailyBudget))}/día disp.`
                  : "Sin margen"}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-800">
                {MONTHS[month - 1].slice(0, 3)} {year}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {daysInMonth} días
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* ── Health score ────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-6">
        <p className="text-sm font-semibold text-slate-800 mb-5">
          Score Financiero
        </p>
        <div className="flex items-center gap-6 sm:gap-10">
          <HealthRing score={healthScore} />
          <div className="flex-1 space-y-3">
            {healthBreakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {item.ok ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  ) : item.warn ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  )}
                  <span className="text-xs text-slate-600 truncate">
                    {item.label}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold tabular-nums flex-shrink-0 ${
                    item.ok
                      ? "text-emerald-600"
                      : item.warn
                        ? "text-amber-600"
                        : "text-red-500"
                  }`}
                >
                  {item.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Smart insights ──────────────────────────────────────────────── */}
      {visibleInsights.length > 0 && (
        <motion.div variants={fadeUp} className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">Insights</p>
          {visibleInsights.map((insight, i) => {
            const cfg = {
              success: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                Icon: CheckCircle2,
                ic: "text-emerald-500",
              },
              warning: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                Icon: AlertTriangle,
                ic: "text-amber-500",
              },
              danger: {
                bg: "bg-red-50",
                text: "text-red-700",
                Icon: AlertTriangle,
                ic: "text-red-500",
              },
              info: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                Icon: Lightbulb,
                ic: "text-blue-500",
              },
            }[insight.type];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className={`flex items-start gap-3 rounded-xl px-4 py-3 ${cfg.bg}`}
              >
                <cfg.Icon
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.ic}`}
                />
                <p className={`text-xs leading-relaxed ${cfg.text}`}>
                  {insight.text}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ── Category breakdown + 6-month trend ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-800 mb-4">
            Gastos por categoría
          </p>
          {categoryBreakdown.length === 0 ? (
            <div className="flex flex-col items-center py-6">
              <p className="text-xs text-slate-400">Sin gastos registrados</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {categoryBreakdown.slice(0, 5).map((cat, i) => {
                const pct = expenses > 0 ? (cat.amount / expenses) * 100 : 0;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs text-slate-600 truncate">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 tabular-nums ml-2 flex-shrink-0">
                        {symbol}
                        {formatAmount(Math.round(cat.amount))}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 0.7,
                          delay: i * 0.1 + 0.2,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-800">
              Tendencia 6 meses
            </p>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" />
                Ing.
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-red-400 inline-block" />
                Gas.
              </span>
            </div>
          </div>
          <TrendBars data={trendData} />
        </motion.div>
      </div>

      {/* ── Recent transactions ─────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-800">
            Últimos movimientos
          </p>
          <Link
            href="/finances"
            className="text-xs font-medium flex items-center gap-0.5 hover:underline"
            style={{ color: colorTheme }}
          >
            Ver todos
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {recentTxs.length === 0 ? (
          <div className="flex flex-col items-center py-8 gap-2">
            <Wallet className="w-8 h-8 text-slate-200" />
            <p className="text-xs text-slate-400">
              Sin movimientos en {MONTHS[month - 1]}
            </p>
            <Link
              href="/finances"
              className="text-xs font-semibold mt-1"
              style={{ color: colorTheme }}
            >
              + Agregar transacción
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTxs.map((t) => {
              const { category } = getCategoryInfo(categories, t.category);
              const isIncome = category?.type === "income";
              const catColor = category?.color ?? "#94a3b8";
              const catName = category?.name ?? t.category;
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5"
                >
                  <div
                    className="w-1.5 h-7 rounded-full flex-shrink-0"
                    style={{ backgroundColor: catColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">
                      {t.description}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {catName} ·{" "}
                      {new Date(t.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold tabular-nums flex-shrink-0 ${
                      isIncome ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {isIncome ? "+" : "−"}
                    {symbol}
                    {formatAmount(t.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
