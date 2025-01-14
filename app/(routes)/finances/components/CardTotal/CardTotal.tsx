"use client";
import React, { useState, useEffect, useMemo } from "react";
import { CardTotalProps } from "./CardTotal.types";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";

export default function CardTotal(props: CardTotalProps) {
  const { transactions } = props;
  const { getSymbol } = useCurrencyStore();
  const formatAmount = useFormatAmount();

  // Procesar los datos para sumar montos por categoría
  const totals = transactions.reduce((acc, item) => {
    const category = item.category;
    const amount = parseFloat(item.amount);

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);

  const totalIncome = totals["income"] || 0;
  const totalExpenses =
    (totals["variable_expenses"] || 0) + (totals["fixed_expenses"] || 0);
  const totalBalance = totalIncome - totalExpenses;

  return (
    <div
      className={
        props.className
          ? props.className
          : "bg-white hover:bg-gray-50 rounded-lg p-8 border grid gap-6 shadow-md"
      }
    >
      <h2
        className={props.classTitle ? props.classTitle : "text-2xl font-bold"}
      >
        {props.title}
      </h2>
      <p
        className={`${props.classText || "text-center text-4xl font-bold"} 
        ${
          props.type === "balance" && totalBalance <= 0 ? "text-red-500" : ""
        }`.trim()}
      >
        {getSymbol()}
        {formatAmount(
          props.type === "income"
            ? totalIncome.toString()
            : props.type === "expenses"
            ? totalExpenses.toString()
            : totalBalance.toString()
        )}
      </p>
    </div>
  );
}
