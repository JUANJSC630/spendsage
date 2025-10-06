"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { Transactions } from "@prisma/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
}

type CardTotalMonthlyDynamicProps = {
  transactions: Transactions[];
  categories: Category[];
  type: "income" | "expenses" | "balance";
  title: string;
  className?: string;
  classTitle?: string;
  classText?: string;
};

export default function CardTotalMonthlyDynamic(props: CardTotalMonthlyDynamicProps) {
  const { transactions, categories } = props;
  const { getSymbol } = useCurrencyStore();
  const formatAmount = useFormatAmount();

  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [symbol, setSymbol] = useState<string>("");

  useEffect(() => {
    setSymbol(getSymbol());
  }, [getSymbol]);

  // Create category map for type lookup
  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach(category => {
      map.set(category.slug, {
        name: category.name,
        color: category.color,
        type: category.type
      });
    });
    return map;
  }, [categories]);

  useEffect(() => {
    // Calculate the total based on category types
    const total = transactions.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      const categoryInfo = categoryMap.get(item.category);

      if (!categoryInfo) return acc;

      if (props.type === "income" && categoryInfo.type === "income") {
        acc += amount;
      } else if (props.type === "expenses" && categoryInfo.type === "expense") {
        acc += amount;
      } else if (props.type === "balance") {
        if (categoryInfo.type === "income") {
          acc += amount;
        } else if (categoryInfo.type === "expense") {
          acc -= amount;
        }
      }

      return acc;
    }, 0);

    setMonthlyTotal(total);
  }, [transactions, props.type, categoryMap]);

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