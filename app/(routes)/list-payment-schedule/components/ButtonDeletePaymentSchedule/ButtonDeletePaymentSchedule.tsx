"use client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";

import { ButtonDeletePaymentScheduleProps } from "./ButtonDeletePaymentSchedule.types";

export default function ButtonDeletePaymentSchedule(
  props: ButtonDeletePaymentScheduleProps
) {
  const { paymentSchedule } = props;
  const router = useRouter();

  const onDeletePaymentSchedule = async () => {
    try {
      await axios.delete(`/api/payment-schedule/${paymentSchedule.id}`);
      toast.success("¡Lista de pagos eliminado! ❌");
      router.refresh();
    } catch (error) {
      toast.error("Error al eliminar lista de pagos ‼️");
      console.error(error);
    }
  };
  return (
    <div>
      <Button onClick={onDeletePaymentSchedule}>
        <Trash className="w-[20px] hover:text-red-500" />
      </Button>
    </div>
  );
}
