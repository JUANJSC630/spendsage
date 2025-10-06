"use client";

import useFormatAmount from "@/hooks/useFormatAmount";
import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import { Transactions } from "@prisma/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
}

type CategoriesSummaryDynamicProps = {
  transactions: Transactions[];
  categories: Category[];
  className?: string;
};

export default function CategoriesSummaryDynamic(props: CategoriesSummaryDynamicProps) {
  const { transactions, categories, className } = props;
  const formatAmount = useFormatAmount();
  const { getSymbol } = useCurrencyStore();
  const [symbol, setSymbol] = useState<string>("");

  useEffect(() => {
    setSymbol(getSymbol());
  }, [getSymbol]);

  // Create a map of category slugs to category info
  const categoryMap = new Map();
  categories.forEach(category => {
    categoryMap.set(category.slug, {
      name: category.name,
      color: category.color,
      type: category.type
    });
  });

  // Calculate totals by category slug
  const totals = transactions.reduce((acc, item) => {
    const categorySlug = item.category;
    const amount = parseFloat(item.amount);

    if (!acc[categorySlug]) {
      acc[categorySlug] = 0;
    }
    acc[categorySlug] += amount;
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for chart using actual categories
  const categoryEntries = Object.entries(totals)
    .filter(([slug, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]); // Sort by amount descending

  if (categoryEntries.length === 0) {
    return (
      <div className="md:w-[450px] w-full flex flex-col items-center justify-center p-8 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">No hay transacciones para mostrar</p>
        </div>
      </div>
    );
  }

  const labels = categoryEntries.map(([slug]) => {
    const categoryInfo = categoryMap.get(slug);
    return categoryInfo?.name || slug;
  });

  const dataValues = categoryEntries.map(([, amount]) => amount);

  const backgroundColors = categoryEntries.map(([slug]) => {
    const categoryInfo = categoryMap.get(slug);
    return categoryInfo?.color || "#94A3B8";
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Categorías",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = `${symbol} ${formatAmount(context.raw.toString())}`;
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-[450px] mx-auto">
      <div className="h-[250px] sm:h-[300px]">
        <Doughnut options={options} data={data} />
      </div>

      {/* Summary stats */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Distribución por categorías:</h4>
        {categoryEntries.slice(0, 5).map(([slug, amount]) => {
          const categoryInfo = categoryMap.get(slug);
          const total = dataValues.reduce((sum, val) => sum + val, 0);
          const percentage = ((amount / total) * 100).toFixed(1);

          return (
            <div key={slug} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryInfo?.color || "#94A3B8" }}
                />
                <span className="text-gray-600 truncate">{categoryInfo?.name || slug}</span>
              </div>
              <div className="flex items-center gap-2 sm:flex-shrink-0">
                <span className="font-medium">{symbol}{formatAmount(amount.toString())}</span>
                <span className="text-gray-400">({percentage}%)</span>
              </div>
            </div>
          );
        })}

        {categoryEntries.length > 5 && (
          <div className="text-xs text-gray-400 text-center pt-2">
            +{categoryEntries.length - 5} categorías más...
          </div>
        )}
      </div>
    </div>
  );
}