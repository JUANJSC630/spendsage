"use client";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { hexToRgba } from "@/hooks/useHexToRgba";
import React from "react";
import { CalendarDays, ChevronRight } from "lucide-react";
import { ListPaymentScheduleStats } from "@/hooks/use-payment-schedules";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

type CardListProps = {
  listPaymentScheduleName: string;
  stats: ListPaymentScheduleStats;
};

export default function CardList({
  listPaymentScheduleName,
  stats,
}: CardListProps) {
  const { colorTheme } = useSyncColorTheme();
  const { currency } = useCurrencyStore();

  const fmt = (amount: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);

  const hasItems = stats.totalItems > 0;

  return (
    <div
      className="group flex flex-col w-full p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-200 relative overflow-hidden gap-3"
      style={{ backgroundColor: hexToRgba(colorTheme, 0.08) }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl text-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: colorTheme }}
          >
            <CalendarDays className="w-4 h-4" />
          </div>
          <h1 className="text-base font-semibold text-slate-800 line-clamp-1">
            {listPaymentScheduleName}
          </h1>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transform group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </div>

      {/* Stats + progress */}
      {hasItems ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>
              {stats.paidItems} de {stats.totalItems} pagados
            </span>
            <span className="font-medium" style={{ color: colorTheme }}>
              {stats.progress}%
            </span>
          </div>
          {/* Mini progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200/70 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${stats.progress}%`,
                backgroundColor: colorTheme,
              }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-emerald-600 font-medium">
              {fmt(stats.paidAmount)}
            </span>
            <span className="text-slate-400">
              {fmt(stats.totalAmount - stats.paidAmount)} pendiente
            </span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400">Sin pagos registrados</p>
      )}
    </div>
  );
}
