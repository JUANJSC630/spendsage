"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Transactions } from "@prisma/client";
import CardTransaction from "./CardTransaction/CardTransaction";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
  isDefault: boolean;
}

interface ListTransactionProps {
  transactions: Transactions[];
  categories: Category[];
  isLoading?: boolean;
}

export function ListTransaction({
  transactions,
  categories,
  isLoading,
}: ListTransactionProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-slate-800">Transacciones</p>
        {transactions.length > 0 && (
          <span className="text-xs font-medium text-slate-400 bg-slate-200 rounded-full px-2 py-0.5">
            {transactions.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-slate-100 rounded-xl animate-pulse"
              style={{ opacity: 1 - i * 0.2 }}
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <span className="text-slate-300 text-xl font-light">–</span>
          </div>
          <p className="text-sm font-medium text-slate-500">Sin movimientos</p>
          <p className="text-xs text-slate-400 mt-1">
            No hay transacciones en este período
          </p>
        </div>
      ) : (
        <motion.div
          className="flex flex-col gap-2 overflow-auto max-h-[420px] pr-0.5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          <AnimatePresence initial={false}>
            {transactions.map((t) => (
              <CardTransaction
                key={t.id}
                transaction={t}
                categories={categories}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
