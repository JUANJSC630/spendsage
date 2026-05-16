"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { ListPaymentItemsProps } from "./ListPaymentItemsProps.types";
import PaymentScheduleItem from "../PaymentScheduleItem/PaymentScheduleItem";
import { PaymentTotals } from "../PaymentTotals/PaymentTotals";
import { usePaymentItems, useCreatePaymentItem } from "@/hooks/use-payment-schedules";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdaptiveDatePicker } from "@/components/ui/adaptive-date-picker";
import useFormatAmount from "@/hooks/useFormatAmount";

const inlineSchema = z.object({
  description: z.string().min(1, "Requerido"),
  amount: z.string().min(1, "Requerido"),
  date: z.date({ required_error: "Requerido" }),
});
type InlineForm = z.infer<typeof inlineSchema>;

function ListItemsSkeleton() {
  return (
    <div className="space-y-1 py-2 pr-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
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

function InlineAddForm({ paymentScheduleId, onClose }: { paymentScheduleId: string; onClose: () => void }) {
  const createItem = useCreatePaymentItem();
  const formatAmount = useFormatAmount();
  const descriptionRef = useRef<HTMLInputElement>(null);

  const form = useForm<InlineForm>({
    resolver: zodResolver(inlineSchema),
    defaultValues: { description: "", amount: "", date: undefined },
  });

  useEffect(() => {
    descriptionRef.current?.focus();
  }, []);

  const onSubmit = async (values: InlineForm) => {
    try {
      await createItem.mutateAsync({
        paymentScheduleId,
        description: values.description,
        amount: values.amount,
        date: values.date,
        check: false,
      });
      toast.success("¡Pago agregado! ✅");
      form.reset();
      onClose();
    } catch {
      toast.error("Error al agregar pago");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="pt-3 mt-2 border-t border-dashed border-slate-200 flex flex-col gap-3"
      >
        {/* Fila 1: descripción full-width */}
        <Input
          {...form.register("description")}
          ref={descriptionRef}
          placeholder="Descripción del pago"
          className="h-10 text-base sm:text-sm sm:h-8"
        />
        {/* Fila 2: monto + fecha lado a lado */}
        <div className="flex gap-2">
          <Input
            placeholder="Monto"
            className="flex-1 h-10 text-base sm:text-sm sm:h-8"
            value={formatAmount(form.watch("amount"))}
            onChange={(e) => form.setValue("amount", e.target.value.replace(/\D/g, ""))}
          />
          <div className="flex-1">
            <AdaptiveDatePicker
              date={form.watch("date")}
              onDateChange={(d) => form.setValue("date", d as Date)}
              placeholder="Fecha"
            />
          </div>
        </div>
        {/* Fila 3: acciones */}
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1 h-10 sm:h-8 sm:flex-none text-sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1 h-10 sm:h-8 sm:flex-none text-sm" disabled={createItem.isPending}>
            {createItem.isPending ? "Guardando…" : "Guardar"}
          </Button>
        </div>
        {(form.formState.errors.description || form.formState.errors.amount || form.formState.errors.date) && (
          <p className="text-xs text-rose-500">Completa descripción, monto y fecha</p>
        )}
      </form>
    </motion.div>
  );
}

export default function ListPaymentItems(props: ListPaymentItemsProps) {
  const { paymentSchedule, showAddForm = false, onAddFormClose } = props;

  const { data: items = [], isLoading, error } = usePaymentItems(paymentSchedule.id);

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
          <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="10" width="30" height="22" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M5 15h30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M13 23h14M13 28h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
            <path d="M13 7v6M20 7v6M27 7v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

      <AnimatePresence>
        {showAddForm && (
          <InlineAddForm
            paymentScheduleId={paymentSchedule.id}
            onClose={onAddFormClose ?? (() => {})}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
