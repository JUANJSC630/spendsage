import React from "react";
import { CardTotalProps } from "./CardTotal.types";

export default function CardTotal(props: CardTotalProps) {
  const { transactions } = props;

  // Procesar los datos para sumar montos por categoría
  const totals = transactions.reduce((acc, item) => {
    const category = item.category;
    const amount = parseFloat(item.amount); // Convertir a número

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

  // Función para formatear números
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="bg-white hover:bg-gray-50 rounded-lg p-8 border grid gap-6">
      <h2 className="text-2xl font-bold">{props.title}</h2>
      <p
        className={`text-center text-4xl font-bold ${
          props.type === "balance" && totalBalance <= 0 ? "text-red-500" : ""
        }`}
      >
        $
        {formatNumber(
          props.type === "income"
            ? totalIncome
            : props.type === "expenses"
            ? totalExpenses
            : totalBalance
        )}
      </p>
    </div>
  );
}
