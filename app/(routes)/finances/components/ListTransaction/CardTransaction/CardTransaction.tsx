"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Transactions } from "@prisma/client";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { getCategoryInfo } from "@/lib/categoryMapping";
import { useDeleteTransaction } from "@/hooks/use-transactions";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
  isDefault: boolean;
}

interface CardTransactionProps {
  transaction: Transactions;
  categories: Category[];
}

export default function CardTransaction({
  transaction,
  categories,
}: CardTransactionProps) {
  const formatAmount = useFormatAmount();
  const { getSymbol } = useCurrencyStore();
  const { mutate: deleteTransaction, isPending } = useDeleteTransaction();

  const symbol = getSymbol();
  const { category } = getCategoryInfo(categories, transaction.category);
  const categoryName = category?.name ?? transaction.category;
  const isIncome = category?.type === "income";
  const categoryColor = category?.color ?? "#94a3b8";

  const handleDelete = () => {
    deleteTransaction(transaction.id, {
      onSuccess: () => toast.success("Transacción eliminada"),
      onError: () => toast.error("Error al eliminar"),
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
      className="group flex items-center gap-3 bg-white rounded-xl px-4 py-3 hover:shadow-sm transition-shadow duration-200"
    >
      <div
        className="w-1.5 h-8 rounded-full flex-shrink-0"
        style={{ backgroundColor: categoryColor }}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {transaction.description}
        </p>
        <p className="text-xs text-slate-400">
          {categoryName} ·{" "}
          {new Date(transaction.date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <span
          className={`text-sm font-bold tabular-nums ${
            isIncome ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isIncome ? "+" : "-"}
          {symbol}
          {formatAmount(transaction.amount)}
        </span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-slate-300 hover:text-red-400 disabled:opacity-30"
          aria-label="Eliminar transacción"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
