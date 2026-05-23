"use client";

import { ListPaymentItemsProps } from "./ListPaymentItemsProps.types";
import PaymentScheduleItem from "../PaymentScheduleItem/PaymentScheduleItem";
import { PaymentTotals } from "../PaymentTotals/PaymentTotals";
import { usePaymentItems } from "@/hooks/use-payment-schedules";
import { motion, AnimatePresence } from "framer-motion";

function ListItemsSkeleton() {
  return (
    <div className="space-y-1 py-2 pr-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0"
        >
          <div className="w-5 h-5 rounded bg-slate-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-slate-100 rounded w-1/4 animate-pulse" />
          </div>
          <div className="h-4 bg-slate-200 rounded w-20 animate-pulse shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function ListPaymentItems(props: ListPaymentItemsProps) {
  const { paymentSchedule } = props;

  const {
    data: items = [],
    isLoading,
    error,
  } = usePaymentItems(paymentSchedule.id);

  if (isLoading) {
    return <ListItemsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar los items de pago
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col flex-1">
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200"
        >
          <svg
            className="w-10 h-10 text-slate-300"
            fill="none"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="5"
              y="10"
              width="30"
              height="22"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M5 15h30"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M13 23h14M13 28h8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M13 7v6M20 7v6M27 7v6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-slate-400 text-xs">No hay pagos registrados</p>
        </motion.div>
      ) : (
        <div className="flex flex-col sm:overscroll-y-contain sm:overflow-auto sm:max-h-[350px] sm:pr-1">
          <AnimatePresence initial={false}>
            {items.map((paymentItem) => (
              <motion.div
                key={paymentItem.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <PaymentScheduleItem
                  paymentItem={paymentItem}
                  paymentSchedule={paymentSchedule}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-auto pt-2">
        <PaymentTotals items={items} />
      </div>
    </div>
  );
}
