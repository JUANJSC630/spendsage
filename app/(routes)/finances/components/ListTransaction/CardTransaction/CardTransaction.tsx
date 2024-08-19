"use client";
import { useRouter } from "next/navigation";

import React from "react";
import { CardTransactionProps } from "./CardTransaction.types";
import { Trash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

export default function CardTransaction(props: CardTransactionProps) {
  const { transaction } = props;

  const { currency, getSymbol } = useCurrencyStore();

  const router = useRouter();

  const deleteTransaction = async () => {
    try {
      await axios.delete(`/api/transactions/${transaction.id}`);
      toast.success("Transaction deleted successfully! ❌");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while deleting the transaction 😢");
    }
  };

  return (
    <div
      key={transaction.id}
      className="grid md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4"
    >
      <div className="col-span-2">
        <p className="text-lg font-bold">{transaction.description}</p>
        <p className="text-sm text-gray-400">
          {new Date(transaction.date).toLocaleDateString("es-ES")}
        </p>
        <p>
          {
            {
              income: "Income",
              fixed_expenses: "Fixed Expenses",
              variable_expenses: "Variable Expenses",
            }[transaction.category]
          }
        </p>
      </div>
      <div className="col-span-2 md:col-span-1 flex flex-col gap-2 items-end">
        <p
          className={`text-lg ${
            transaction.category === "income"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {transaction.category === "income" ? "+" : "-"}
          {getSymbol()}
          {new Intl.NumberFormat("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(parseFloat(transaction.amount))}
        </p>
        <button
          className="hover:text-red-500 text-red-700/50"
          onClick={deleteTransaction}
        >
          <Trash size={24} />
        </button>
      </div>
    </div>
  );
}
