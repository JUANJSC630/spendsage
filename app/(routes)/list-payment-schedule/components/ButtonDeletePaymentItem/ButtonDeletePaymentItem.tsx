"use client";
import { Trash, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { ButtonDeletePaymentItemProps } from "./ButtonDeletePaymentItem.types";
import { useDeletePaymentItem } from "@/hooks/use-payment-schedules";

export default function ButtonDeletePaymentItem(
  props: ButtonDeletePaymentItemProps,
) {
  const { paymentSchedule, paymentItem } = props;
  const deleteMutation = useDeletePaymentItem();

  const onDeletePaymentScheduleItem = async () => {
    try {
      await deleteMutation.mutateAsync({
        paymentScheduleId: paymentSchedule.id,
        itemId: paymentItem.id,
      });
      toast.success("¡Item de pago eliminado! ❌");
    } catch (error) {
      toast.error("Error al eliminar item de pago ‼️");
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDeletePaymentScheduleItem}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash className="h-5 w-5 hover:text-red-500 transition-colors" />
        )}
      </Button>
    </div>
  );
}
