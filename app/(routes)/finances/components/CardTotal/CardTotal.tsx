"use client";
import React, { useState, useEffect, useMemo } from "react";
import { CardTotalProps } from "./CardTotal.types";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { getCategoryInfo } from "@/lib/categoryMapping";

export default function CardTotal(props: CardTotalProps) {
  const { transactions, categories } = props;
  const { getSymbol } = useCurrencyStore();
  const [symbol, setSymbol] = useState<string>(""); // Nuevo estado para manejar el símbolo de la moneda

  useEffect(() => {
    // Actualiza el símbolo después de la hidratación
    setSymbol(getSymbol());
  }, [getSymbol]);
  const formatAmount = useFormatAmount();

  // Calculate totals using category mapping for compatibility
  const { totalIncome, totalExpenses, totalBalance } = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      const categoryInfo = getCategoryInfo(categories, transaction.category);

      if (categoryInfo.category) {
        if (categoryInfo.category.type === 'income') {
          income += amount;
        } else if (categoryInfo.category.type === 'expense') {
          expenses += amount;
        }
      }
    });

    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: income - expenses,
    };
  }, [transactions, categories]);

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
        {symbol}
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
