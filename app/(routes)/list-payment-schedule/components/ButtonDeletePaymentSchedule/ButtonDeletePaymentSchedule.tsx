"use client";
import { Trash, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { ButtonDeletePaymentScheduleProps } from "./ButtonDeletePaymentSchedule.types";
import { useDeletePaymentSchedule } from "@/hooks/use-payment-schedules";

export default function ButtonDeletePaymentSchedule(
  props: ButtonDeletePaymentScheduleProps
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
    <div>
      <Button 
        onClick={onDeletePaymentSchedule} 
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? (
          <Loader2 className="w-[20px] animate-spin" />
        ) : (
          <Trash className="w-[20px] hover:text-red-500 transition-colors" />
        )}
      </Button>
    </div>
  );
}
