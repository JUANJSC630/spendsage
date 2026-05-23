"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { Transactions } from "@prisma/client";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { getCategoryInfo } from "@/lib/categoryMapping";
import {
  useDeleteTransaction,
  useUpdateTransaction,
} from "@/hooks/use-transactions";

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
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction();
  const { mutate: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction();

  const symbol = getSymbol();
  const { category } = getCategoryInfo(categories, transaction.category);
  const categoryName = category?.name ?? transaction.category;
  const isIncome = category?.type === "income";
  const categoryColor = category?.color ?? "#94a3b8";

  const [editing, setEditing] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const descRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && descRef.current) {
      descRef.current.focus();
    }
  }, [editing]);

  const startEdit = () => {
    setEditDesc(transaction.description);
    setEditAmount(Math.round(parseFloat(transaction.amount)).toString());
    setEditCategory(transaction.category);
    const d = new Date(transaction.date);
    setEditDate(d.toISOString().slice(0, 10));
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const confirmEdit = () => {
    const numericAmount = parseInt(editAmount.replace(/\D/g, ""), 10);
    if (!editDesc.trim()) {
      toast.error("La descripción no puede estar vacía");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      toast.error("El monto debe ser mayor que 0");
      return;
    }
    updateTransaction(
      {
        id: transaction.id,
        description: editDesc.trim(),
        amount: numericAmount.toString(),
        category: editCategory,
        date: new Date(editDate + "T12:00:00"),
      },
      {
        onSuccess: () => {
          toast.success("Transacción actualizada");
          setEditing(false);
        },
        onError: () => toast.error("Error al actualizar la transacción"),
      },
    );
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id, {
      onSuccess: () => toast.success("Transacción eliminada"),
      onError: () => toast.error("Error al eliminar"),
    });
  };

  const editCategoryColor =
    categories.find((c) => c.slug === editCategory)?.color ?? "#94a3b8";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
      className="group bg-white rounded-xl overflow-hidden hover:shadow-sm transition-shadow duration-200"
    >
      {/* Normal row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-1.5 h-8 rounded-full flex-shrink-0"
          style={{
            backgroundColor: editing ? editCategoryColor : categoryColor,
          }}
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

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className={`text-sm font-bold tabular-nums ${
              isIncome ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {isIncome ? "+" : "-"}
            {symbol}
            {formatAmount(transaction.amount)}
          </span>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {editing ? (
              <>
                <button
                  onClick={confirmEdit}
                  disabled={isUpdating}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 transition-colors disabled:opacity-40"
                  aria-label="Guardar"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={isUpdating}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors"
                  aria-label="Cancelar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={startEdit}
                className="p-1.5 rounded-lg text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                aria-label="Editar transacción"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting || editing}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30"
              aria-label="Eliminar transacción"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Inline edit form */}
      <AnimatePresence initial={false}>
        {editing && (
          <motion.div
            key="edit-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="px-4 py-3 flex flex-col gap-2.5 bg-slate-50">
              {/* Description */}
              <input
                ref={descRef}
                type="text"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                placeholder="Descripción"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              />

              <div className="grid grid-cols-3 gap-2">
                {/* Category */}
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="text-xs px-2 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-400 col-span-1"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Amount */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatAmount(editAmount)}
                  onChange={(e) =>
                    setEditAmount(e.target.value.replace(/\D/g, ""))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  placeholder="Monto"
                  className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 tabular-nums"
                />

                {/* Date */}
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="text-xs px-2 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
