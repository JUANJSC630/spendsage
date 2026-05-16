"use client";

import { useState } from "react";
import ButtonDeletePaymentSchedule from "../ButtonDeletePaymentSchedule/ButtonDeletePaymentSchedule";
import ListPaymentItems from "../ListPaymentItems/ListPaymentItems";
import { EditPaymentSchedule } from "../EditPaymentSchedule/EditPaymentSchedule";
import { CardPaymentScheduleProps } from "./CardPaymentSchedule.types";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CardPaymentSchedule(props: CardPaymentScheduleProps) {
  const { paymentSchedule } = props;
  const { colorTheme } = useSyncColorTheme();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Colored top accent */}
      <div className="h-1 w-full" style={{ backgroundColor: colorTheme }} />

      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-800">{paymentSchedule.name}</h2>
          <div className="text-slate-400 text-xs mt-0.5">
            {new Date(paymentSchedule.fromDate).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
            {" — "}
            {new Date(paymentSchedule.toDate).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <EditPaymentSchedule paymentSchedule={paymentSchedule} />
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 sm:h-8 sm:w-8 p-0 text-slate-500 hover:text-slate-900"
            onClick={() => setShowAddForm((v) => !v)}
            title="Agregar pago"
          >
            <PlusCircle className="w-4 h-4" />
          </Button>
          <ButtonDeletePaymentSchedule paymentSchedule={paymentSchedule} />
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <ListPaymentItems
          paymentSchedule={paymentSchedule}
          showAddForm={showAddForm}
          onAddFormClose={() => setShowAddForm(false)}
        />
      </div>
    </div>
  );
}
