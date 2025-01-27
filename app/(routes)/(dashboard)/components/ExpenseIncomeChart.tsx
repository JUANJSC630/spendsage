"use client";

import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Transactions } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import useFormatAmount from "@/hooks/useFormatAmount";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseIncomeChartProps {
  transactions: Transactions[];
  className?: string;
}

export default function ExpenseIncomeChart(props: ExpenseIncomeChartProps) {
  const { transactions } = props;

  const formatAmount = useFormatAmount();
  const { getSymbol } = useCurrencyStore();

  const [symbol, setSymbol] = useState<string>(""); // Nuevo estado para manejar el símbolo de la moneda

  useEffect(() => {
    // Actualiza el símbolo después de la hidratación
    setSymbol(getSymbol());
  }, [getSymbol]);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [groupedData, setGroupedData] = useState<
    Record<string, { income: number; expenses: number }>
  >({});

  useEffect(() => {
    const now = new Date();
    setStartDate(startOfMonth(subMonths(now, 1)));
    setEndDate(endOfMonth(now));
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const grouped = filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!acc[key]) {
        acc[key] = { income: 0, expenses: 0 };
      }

      const amount = parseFloat(transaction.amount);
      if (transaction.category === "income") {
        acc[key].income += amount;
      } else {
        acc[key].expenses += amount;
      }

      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    setGroupedData(grouped);
  }, [startDate, endDate, transactions]);

  const sortedKeys = Object.keys(groupedData).sort();

  const data = {
    labels: sortedKeys,
    datasets: [
      {
        label: "Expenses",
        data: sortedKeys.map((key) => groupedData[key].expenses),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Income",
        data: sortedKeys.map((key) => groupedData[key].income),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
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
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  } as const;

  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle>Expenses and Income (Monthly)</CardTitle>
      </CardHeader>
      <CardContent>
        {startDate && endDate ? (
          <>
            <Bar data={data} options={options} />
            <div>
              {sortedKeys.map((key) => (
                <div key={key} className="flex flex-row gap-2 mt-2">
                  <span className="text-xs md:text-lg">{key}:</span>
                  <span className="text-xs md:text-lg">
                    <strong>Income:</strong> {symbol}{" "}
                    {formatAmount(groupedData[key].income.toString())}
                  </span>
                  <span className="text-xs md:text-lg">
                    <strong>Expenses:</strong> {symbol}{" "}
                    {formatAmount(groupedData[key].expenses.toString())}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </CardContent>
    </Card>
  );
}
