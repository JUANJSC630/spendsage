"use client";

import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import React from "react";
import { PaymentItem } from "@prisma/client";
import { Progress } from "@/components/ui/progress";

interface PaymentTotalsProps {
  items: PaymentItem[];
}

export function PaymentTotals(props: PaymentTotalsProps) {
  const { items } = props;
  const { currency } = useCurrencyStore();

  const totalPaid = items.reduce((total, item) => {
    const amount = parseFloat(item.amount.replace(/\./g, ""));
    return item.check ? total + amount : total;
  }, 0);

  const totalPending = items.reduce((total, item) => {
    const amount = parseFloat(item.amount.replace(/\./g, ""));
    return !item.check ? total + amount : total;
  }, 0);

  const totalAmount = totalPaid + totalPending;
  const progressPercentage = totalAmount === 0 ? 0 : Math.round((totalPaid / totalAmount) * 100);

  const formattedTotalPaid = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(totalPaid);

  const formattedTotalPending = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(totalPending);

  return (
    <div className="space-y-3 pt-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-slate-700">Progreso</span>
        <span className="text-slate-500">{progressPercentage}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4 text-sm mt-3 pt-3 border-t border-slate-100">
        <div className="flex justify-between sm:flex-col sm:justify-start gap-1">
          <span className="text-slate-400">Total pagado</span>
          <span className="font-semibold text-emerald-600">{formattedTotalPaid}</span>
        </div>
        <div className="flex justify-between sm:flex-col sm:justify-start sm:text-right gap-1">
          <span className="text-slate-400">Total pendiente</span>
          <span className="font-semibold text-rose-600">{formattedTotalPending}</span>
        </div>
      </div>
    </div>
  );
}
