"use client";
import React, { useState, useEffect } from "react";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { Transactions } from "@prisma/client";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

type CardTotalMonthlyProps = {
  transactions: Transactions[];
  type: "income" | "expenses" | "balance";
  title: string;
  className?: string;
  classTitle?: string;
  classText?: string;
};

export default function CardTotalMonthly(props: CardTotalMonthlyProps) {
  const { transactions } = props;
  const { getSymbol } = useCurrencyStore();
  const formatAmount = useFormatAmount();

  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [symbol, setSymbol] = useState<string>(""); // Nuevo estado para manejar el símbolo de la moneda

  useEffect(() => {
    // Actualiza el símbolo después de la hidratación
    setSymbol(getSymbol());
  }, [getSymbol]);

  useEffect(() => {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    // Filtrar las transacciones dentro del mes actual
    const currentMonthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return isWithinInterval(transactionDate, {
        start: startOfCurrentMonth,
        end: endOfCurrentMonth,
      });
    });

    // Calcular el total basado en el tipo (ingresos o gastos)
    const total = currentMonthTransactions.reduce((acc, item) => {
      const amount = parseFloat(item.amount);

      if (props.type === "income" && item.category === "income") {
        acc += amount;
      } else if (
        props.type === "expenses" &&
        (item.category === "variable_expenses" ||
          item.category === "fixed_expenses")
      ) {
        acc += amount;
      } else if (props.type === "balance") {
        if (item.category === "income") {
          acc += amount;
        } else if (
          item.category === "variable_expenses" ||
          item.category === "fixed_expenses"
        ) {
          acc -= amount;
        }
      }

      return acc;
    }, 0);

    setMonthlyTotal(total);
  }, [transactions, props.type]);

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
          props.type === "balance" && monthlyTotal <= 0 ? "text-red-500" : ""
        }`.trim()}
      >
        {symbol}
        {formatAmount(monthlyTotal.toString())}
      </p>
    </div>
  );
}
