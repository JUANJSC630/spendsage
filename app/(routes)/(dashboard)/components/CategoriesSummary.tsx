"use client";
import useFormatAmount from "@/hooks/useFormatAmount";
import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import { Transactions } from "@prisma/client";

type CategoriesSummaryProps = {
  transactions: Transactions[];
  className?: string;
};

export default function CategoriesSummary(props: CategoriesSummaryProps) {
  const { transactions, className } = props;
  const formatAmount = useFormatAmount();
  const { getSymbol } = useCurrencyStore();
  const [symbol, setSymbol] = useState<string>(""); // Nuevo estado para manejar el símbolo de la moneda

  useEffect(() => {
    // Actualiza el símbolo después de la hidratación
    setSymbol(getSymbol());
  }, [getSymbol]);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthTransactions = transactions.filter((item) => {
    const transactionDate = new Date(item.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const totals = currentMonthTransactions.reduce((acc, item) => {
    const category = item.category;
    const amount = parseFloat(item.amount);

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);

  console.log(currentMonthTransactions);

  const data = {
    labels: ["Income", "Variable Expenses", "Fixed Expenses"],
    datasets: [
      {
        label: "Categories",
        data: [
          totals["income"] || 0,
          totals["variable_expenses"] || 0,
          totals["fixed_expenses"] || 0,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) =>
            `${symbol} ${formatAmount(context.raw.toString())}`,
        },
      },
    },
  };

  return <Doughnut options={options} data={data} />;
}
