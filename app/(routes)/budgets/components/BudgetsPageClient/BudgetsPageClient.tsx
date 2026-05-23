"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2, Wallet, Pencil, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useBudgetsProgress,
  useDeleteBudget,
  useUpdateBudget,
  BudgetProgress,
} from "@/hooks/use-budgets";
import { useTransactionCategories } from "@/hooks/use-transactions";
import useFormatAmount from "@/hooks/useFormatAmount";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import { BudgetForm } from "../BudgetForm/BudgetForm";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

interface BudgetItemProps {
  budget: BudgetProgress;
  categoryName: string;
  categoryColor: string;
  month: number;
  year: number;
}

function BudgetItem({
  budget,
  categoryName,
  categoryColor,
  month,
  year,
}: BudgetItemProps) {
  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget(month, year);
  const { mutate: updateBudget, isPending: isUpdating } = useUpdateBudget(month, year);
  const formatAmount = useFormatAmount();
  const { getSymbol } = useCurrencyStore();
  const symbol = getSymbol();

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const amount = parseFloat(budget.amount);
  const spent = parseFloat(budget.spent);
  const remaining = parseFloat(budget.remaining);
  const pct = Math.min(budget.percentage, 100);
  const isOver = budget.isOverBudget;
  const isNear = !isOver && budget.percentage >= 80;

  const barColor = isOver ? "#ef4444" : isNear ? "#f59e0b" : categoryColor || "#3b82f6";

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEdit = () => {
    setEditValue(Math.round(amount).toString());
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditValue("");
  };

  const confirmEdit = () => {
    const numeric = parseInt(editValue.replace(/\D/g, ""), 10);
    if (!numeric || numeric <= 0) {
      toast.error("El monto debe ser mayor que 0");
      return;
    }
    updateBudget(
      { id: budget.id, amount: numeric.toString() },
      {
        onSuccess: () => {
          toast.success("Presupuesto actualizado");
          setEditing(false);
          setEditValue("");
        },
        onError: () => toast.error("Error al actualizar el presupuesto"),
      },
    );
  };

  const handleDelete = () => {
    deleteBudget(budget.id, {
      onSuccess: () => toast.success("Presupuesto eliminado"),
      onError: () => toast.error("Error al eliminar el presupuesto"),
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
      className="group bg-white rounded-xl px-4 py-3.5 hover:shadow-sm transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: categoryColor || "#94a3b8" }}
          />
          <span className="text-sm font-medium text-slate-800 truncate">
            {categoryName}
          </span>
          {isOver && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 flex-shrink-0">
              Excedido
            </span>
          )}
          {isNear && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 flex-shrink-0">
              Cerca del límite
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
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
              aria-label="Editar monto"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={isDeleting || editing}
                className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
                aria-label="Eliminar presupuesto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar presupuesto?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se eliminará permanentemente el presupuesto de{" "}
                  <strong>{categoryName}</strong>. Esta acción no se puede
                  deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Amounts */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          <span
            className="font-semibold tabular-nums"
            style={{ color: isOver ? "#ef4444" : "#1e293b" }}
          >
            {symbol}
            {formatAmount(spent.toString())}
          </span>{" "}
          de{" "}
          {editing ? (
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              className="inline-block w-24 border-b border-slate-300 bg-transparent text-slate-700 font-semibold tabular-nums focus:outline-none focus:border-blue-400 text-xs px-0.5"
            />
          ) : (
            <span className="tabular-nums">
              {symbol}
              {formatAmount(amount.toString())}
            </span>
          )}
        </span>
        {!editing && (
          <span
            className={`font-medium tabular-nums ${isOver ? "text-red-500" : "text-emerald-600"}`}
          >
            {isOver ? "−" : ""}
            {symbol}
            {formatAmount(Math.abs(remaining).toString())}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function BudgetList({
  budgets,
  categories,
  month,
  year,
  isLoading,
}: {
  budgets: BudgetProgress[];
  categories: { slug: string; name: string; color: string }[];
  month: number;
  year: number;
  isLoading: boolean;
}) {
  const catMap = useMemo(() => {
    const m = new Map<string, { name: string; color: string }>();
    categories.forEach((c) => m.set(c.slug, { name: c.name, color: c.color }));
    return m;
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-slate-100 rounded-xl animate-pulse"
            style={{ opacity: 1 - i * 0.25 }}
          />
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <Wallet className="w-4 h-4 text-slate-300" />
        </div>
        <p className="text-sm font-medium text-slate-500">Sin presupuestos</p>
        <p className="text-xs text-slate-400 mt-1">
          Crea tu primer presupuesto con el formulario
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-2 overflow-auto max-h-[440px] pr-0.5"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <AnimatePresence initial={false}>
        {budgets.map((b) => {
          const cat = catMap.get(b.category);
          return (
            <BudgetItem
              key={b.id}
              budget={b}
              categoryName={cat?.name ?? b.category}
              categoryColor={cat?.color ?? "#94a3b8"}
              month={month}
              year={year}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

export function BudgetsPageClient() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: budgets = [], isLoading } = useBudgetsProgress(month, year);
  const { data: categories = [] } = useTransactionCategories();
  const formatAmount = useFormatAmount();
  const { getSymbol } = useCurrencyStore();
  const symbol = getSymbol();

  const { totalBudget, totalSpent, totalRemaining, overallPct } =
    useMemo(() => {
      const totalBudget = budgets.reduce(
        (s, b) => s + parseFloat(b.amount),
        0,
      );
      const totalSpent = budgets.reduce(
        (s, b) => s + parseFloat(b.spent),
        0,
      );
      const totalRemaining = totalBudget - totalSpent;
      const overallPct =
        totalBudget > 0
          ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100)
          : 0;
      return { totalBudget, totalSpent, totalRemaining, overallPct };
    }, [budgets]);

  const isOverBudget = totalSpent > totalBudget && totalBudget > 0;

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] w-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Presupuestos
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {budgets.length} presupuesto{budgets.length !== 1 ? "s" : ""} ·{" "}
          {budgets.filter((b) => b.isOverBudget).length} excedido
          {budgets.filter((b) => b.isOverBudget).length !== 1 ? "s" : ""}
        </p>
      </motion.div>

      {/* Month/year nav */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-700 min-w-[120px] text-center">
          {MONTHS[month - 1]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
      >
        <div className="rounded-2xl bg-blue-50 p-5">
          <p className="text-xs font-medium text-blue-500 mb-1">
            Presupuestado
          </p>
          <p className="text-xl font-bold text-blue-700 tabular-nums">
            {symbol}
            {formatAmount(totalBudget.toString())}
          </p>
        </div>

        <div
          className={`rounded-2xl p-5 ${isOverBudget ? "bg-red-50" : "bg-slate-100"}`}
        >
          <p
            className={`text-xs font-medium mb-1 ${isOverBudget ? "text-red-500" : "text-slate-500"}`}
          >
            Gastado · {overallPct}%
          </p>
          <p
            className={`text-xl font-bold tabular-nums ${isOverBudget ? "text-red-700" : "text-slate-700"}`}
          >
            {symbol}
            {formatAmount(totalSpent.toString())}
          </p>
        </div>

        <div
          className={`rounded-2xl p-5 ${isOverBudget ? "bg-red-50" : "bg-emerald-50"}`}
        >
          <p
            className={`text-xs font-medium mb-1 ${isOverBudget ? "text-red-500" : "text-emerald-500"}`}
          >
            {isOverBudget ? "Exceso" : "Disponible"}
          </p>
          <p
            className={`text-xl font-bold tabular-nums ${isOverBudget ? "text-red-700" : "text-emerald-700"}`}
          >
            {symbol}
            {formatAmount(Math.abs(totalRemaining).toString())}
          </p>
        </div>
      </motion.div>

      {/* Form + List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div variants={fadeUp}>
          <BudgetForm month={month} year={year} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl bg-slate-50 p-6 h-full">
            <BudgetList
              budgets={budgets}
              categories={categories}
              month={month}
              year={year}
              isLoading={isLoading}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default BudgetsPageClient;
