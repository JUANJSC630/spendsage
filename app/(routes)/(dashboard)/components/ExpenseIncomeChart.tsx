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

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
}

interface ExpenseIncomeChartProps {
  transactions: Transactions[];
  categories: Category[];
  className?: string;
}

export default function ExpenseIncomeChart(props: ExpenseIncomeChartProps) {
  const { transactions, categories } = props;

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

  // Create category map for type lookup
  const [categoryMap, setCategoryMap] = useState(new Map());

  useEffect(() => {
    const map = new Map();
    categories.forEach(category => {
      map.set(category.slug, {
        name: category.name,
        color: category.color,
        type: category.type
      });
    });
    setCategoryMap(map);
  }, [categories]);

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
      const categoryInfo = categoryMap.get(transaction.category);

      if (categoryInfo) {
        if (categoryInfo.type === "income") {
          acc[key].income += amount;
        } else if (categoryInfo.type === "expense") {
          acc[key].expenses += amount;
        }
      }

      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    setGroupedData(grouped);
  }, [startDate, endDate, transactions, categoryMap]);

  const sortedKeys = Object.keys(groupedData).sort();

  const data = {
    labels: sortedKeys,
    datasets: [
      {
        label: "Gastos",
        data: sortedKeys.map((key) => groupedData[key].expenses),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Ingresos",
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
          text: "Mes",
        },
      },
    },
  } as const;

  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle>Gastos e Ingresos (Mensuales)</CardTitle>
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
                    <strong>Ingresos:</strong> {symbol}{" "}
                    {formatAmount(groupedData[key].income.toString())}
                  </span>
                  <span className="text-xs md:text-lg">
                    <strong>Gastos:</strong> {symbol}{" "}
                    {formatAmount(groupedData[key].expenses.toString())}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>Cargando...</div>
        )}
      </CardContent>
    </Card>
  );
}
