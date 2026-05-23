"use client";
import { Trash, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { ButtonDeletePaymentScheduleProps } from "./ButtonDeletePaymentSchedule.types";
import { useDeletePaymentSchedule } from "@/hooks/use-payment-schedules";

export default function ButtonDeletePaymentSchedule(
  props: ButtonDeletePaymentScheduleProps,
) {
  const { paymentSchedule } = props;
  const deleteMutation = useDeletePaymentSchedule();

  const onDeletePaymentSchedule = async () => {
    try {
      await deleteMutation.mutateAsync(paymentSchedule.id);
      toast.success("¡Lista de pagos eliminada! ❌");
    } catch (error) {
      toast.error("Error al eliminar lista de pagos ‼️");
      console.error(error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-10 w-10 sm:h-8 sm:w-8 p-0 text-slate-500 hover:text-red-500"
      onClick={onDeletePaymentSchedule}
      disabled={deleteMutation.isPending}
    >
      {deleteMutation.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash className="w-4 h-4" />
      )}
    </Button>
  );
}
