"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ButtonAddPaymentSchedule } from "./ButtonAddPaymentSchedule/ButtonAddPaymentSchedule";
import { CardPaymentSchedule } from "./CardPaymentSchedule";
import { useListPaymentSchedule, useGlobalPaymentSummary } from "@/hooks/use-payment-schedules";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface PaymentScheduleDetailPageProps {
  listPaymentId: string;
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col max-w-6xl mx-auto gap-6">
      <div className="sticky top-0 border-b border-slate-200 px-4 py-3 sm:relative sm:border-0 sm:px-0 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="h-3 w-12 bg-slate-100 rounded animate-pulse" />
            <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-slate-200 rounded-lg animate-pulse shrink-0" />
        </div>
      </div>
      <div className="px-4 sm:px-0 flex flex-col gap-6">
        <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function GlobalSummary({ scheduleIds }: { scheduleIds: string[] }) {
  const { currency } = useCurrencyStore();
  const { isLoading, totalPaid, totalPending, totalAmount, progress } = useGlobalPaymentSummary(scheduleIds);

  const fmt = (amount: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);

  if (isLoading) {
    return <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-4 sm:p-5"
    >
      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">
        Resumen general
      </p>

      {/* 2 columnas en mobile, fila en desktop */}
      <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-slate-400 text-xs">Pagado</p>
          <p className="font-semibold text-emerald-600 text-base sm:text-sm">{fmt(totalPaid)}</p>
        </div>
        <div className="text-right sm:text-left">
          <p className="text-slate-400 text-xs">Pendiente</p>
          <p className="font-semibold text-rose-600 text-base sm:text-sm">{fmt(totalPending)}</p>
        </div>
        <div className="col-span-2 sm:col-span-1 sm:ml-auto sm:text-right">
          <p className="text-slate-400 text-xs">Total · Progreso</p>
          <p className="font-semibold text-slate-700 text-base sm:text-sm">
            {fmt(totalAmount)} · {progress}%
          </p>
        </div>
      </div>

      <Progress value={progress} className="h-2.5 bg-slate-200" />
    </motion.div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", delay: i * 0.06 },
  }),
};

export function PaymentScheduleDetailPage({ listPaymentId }: PaymentScheduleDetailPageProps) {
  const { data: listPaymentSchedule, isLoading, error } = useListPaymentSchedule(listPaymentId);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !listPaymentSchedule) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-slate-500 mb-4">Lista de pagos no encontrada.</p>
        <Link href="/list-payment-schedule">
          <Button variant="outline" size="sm">Volver</Button>
        </Link>
      </div>
    );
  }

  const scheduleIds = listPaymentSchedule.paymentSchedules.map((s) => s.id);

  return (
    <div className="flex flex-col max-w-6xl mx-auto gap-6">
      {/* Header — sticky en mobile, normal en desktop */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3 sm:relative sm:top-auto sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:px-0 sm:pt-6 sm:pb-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              href="/list-payment-schedule"
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors mb-0.5"
            >
              <ArrowLeft className="w-3 h-3 shrink-0" /> Volver
            </Link>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 truncate">
              {listPaymentSchedule.name}
            </h1>
          </div>
          <div className="shrink-0">
            <ButtonAddPaymentSchedule listPaymentScheduleId={listPaymentSchedule.id} />
          </div>
        </div>
      </div>

      {/* Contenido con padding lateral en mobile */}
      <div className="px-4 sm:px-0 flex flex-col gap-6 pb-8">
        {scheduleIds.length > 0 && <GlobalSummary scheduleIds={scheduleIds} />}

        <div className="w-full flex flex-col gap-4">
          {listPaymentSchedule.paymentSchedules.length > 0 ? (
            listPaymentSchedule.paymentSchedules.map((paymentSchedule, i) => (
              <motion.div
                key={paymentSchedule.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <CardPaymentSchedule paymentSchedule={paymentSchedule} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-16 text-center"
            >
              <svg
                className="w-14 h-14 text-slate-300"
                fill="none"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="8" y="16" width="48" height="36" rx="5" stroke="currentColor" strokeWidth="2.5" />
                <path d="M8 24h48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M22 36h20M22 43h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 12v8M32 12v8M44 12v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <p className="text-slate-400 text-sm">
                No hay sub-listas de pagos. Usa el botón &ldquo;Agregar&rdquo; para crear una.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
