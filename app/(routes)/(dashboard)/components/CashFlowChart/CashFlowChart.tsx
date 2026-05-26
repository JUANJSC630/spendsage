"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Transactions } from "@prisma/client";
import { TransactionCategory } from "@/hooks/use-transactions";
import { getCategoryInfo } from "@/lib/categoryMapping";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";

interface Props {
  transactions: Transactions[];
  categories: TransactionCategory[];
  colorTheme: string;
}

function CashFlowTooltip({
  active,
  payload,
  label,
  symbol,
  formatAmount,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  symbol: string;
  formatAmount: (v: string | number) => string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 text-xs">
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className={`font-bold tabular-nums ${val >= 0 ? "text-emerald-600" : "text-red-500"}`}>
        {val >= 0 ? "+" : "−"}{symbol}{formatAmount(Math.abs(val).toString())}
      </p>
    </div>
  );
}

export function CashFlowChart({ transactions, categories, colorTheme }: Props) {
  const { getSymbol } = useCurrencyStore();
  const formatAmount = useFormatAmount();
  const symbol = getSymbol();

  const chartData = useMemo(() => {
    const today = new Date();
    const days: { date: Date; label: string; balance: number; delta: number }[] = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push({
        date: d,
        label: d.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
        balance: 0,
        delta: 0,
      });
    }

    // Calculate daily net delta
    transactions.forEach((t) => {
      const txDate = new Date(t.date);
      txDate.setHours(0, 0, 0, 0);
      const dayEntry = days.find((d) => d.date.getTime() === txDate.getTime());
      if (!dayEntry) return;
      const { category } = getCategoryInfo(categories, t.category);
      const amt = parseFloat(t.amount);
      if (category?.type === "income") dayEntry.delta += amt;
      else dayEntry.delta -= amt;
    });

    // Running balance
    let running = 0;
    days.forEach((d) => {
      running += d.delta;
      d.balance = running;
    });

    return days;
  }, [transactions, categories]);

  const minBalance = Math.min(...chartData.map((d) => d.balance));
  const maxBalance = Math.max(...chartData.map((d) => d.balance));
  const hasData = chartData.some((d) => d.delta !== 0);

  // Find "paycheck" days — days with large positive income spikes
  const avgPositive =
    chartData.filter((d) => d.delta > 0).reduce((s, d) => s + d.delta, 0) /
    (chartData.filter((d) => d.delta > 0).length || 1);
  const paycheckDays = chartData.filter((d) => d.delta > avgPositive * 1.5);

  if (!hasData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl bg-slate-50 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-800">Flujo de caja — 30 días</p>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          {minBalance < 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-red-300 inline-block" />
              Negativo
            </span>
          )}
          {paycheckDays.length > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 inline-block" style={{ backgroundColor: colorTheme }} />
              Ingresos
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={130}>
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorTheme} stopOpacity={0.18} />
              <stop offset="95%" stopColor={colorTheme} stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="cashGradientNeg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#cbd5e1" }}
            interval={6}
          />
          <YAxis hide domain={[Math.min(minBalance * 1.1, 0), maxBalance * 1.1]} />
          <Tooltip
            content={
              <CashFlowTooltip symbol={symbol} formatAmount={formatAmount} />
            }
            cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
          />
          {minBalance < 0 && (
            <ReferenceLine y={0} stroke="#fca5a5" strokeDasharray="3 3" strokeWidth={1} />
          )}
          <Area
            type="monotone"
            dataKey="balance"
            stroke={colorTheme}
            strokeWidth={2}
            fill={`url(#cashGradient)`}
            dot={false}
            activeDot={{ r: 4, fill: colorTheme, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Summary chips */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {paycheckDays.length > 0 && (
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg text-white"
            style={{ backgroundColor: colorTheme }}
          >
            {paycheckDays.length} ingreso{paycheckDays.length !== 1 ? "s" : ""} grandes
          </span>
        )}
        {minBalance < 0 && (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-100 text-red-600">
            Saldo negativo acumulado
          </span>
        )}
        <span className="text-[11px] text-slate-400 ml-auto tabular-nums">
          Pico: {symbol}{formatAmount(Math.round(maxBalance).toString())}
        </span>
      </div>
    </motion.div>
  );
}
