"use client";

import { useYearContext } from "@/app/(routes)/list-payment-schedule/components/YearContext";
import { CardListWithActions } from "./CardListWithActions";
import { ListPaymentScheduleWithStats } from "@/hooks/use-payment-schedules";
import { motion, AnimatePresence } from "framer-motion";

interface ContentProps {
  data: ListPaymentScheduleWithStats[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function Content({ data }: ContentProps) {
  const { filteredData, selectedYear } = useYearContext();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredData.map((listPaymentSchedule) => (
          <motion.div key={listPaymentSchedule.id} variants={cardVariants}>
            <CardListWithActions listPaymentSchedule={listPaymentSchedule} />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {filteredData.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 mt-8"
          >
            <svg
              className="w-16 h-16 text-slate-300"
              fill="none"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="8"
                y="16"
                width="48"
                height="36"
                rx="5"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                d="M8 24h48"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="20" cy="36" r="3" fill="currentColor" opacity="0.4" />
              <circle cx="32" cy="36" r="3" fill="currentColor" opacity="0.4" />
              <circle cx="44" cy="36" r="3" fill="currentColor" opacity="0.4" />
              <path
                d="M20 12v8M32 12v8M44 12v8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <h1 className="text-xl font-semibold text-slate-500">
                {selectedYear
                  ? `No se encontraron listas para ${selectedYear}`
                  : "Aún no tienes listas de pagos"}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Comienza creando tu primera lista de pagos arriba.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
