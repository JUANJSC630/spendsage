"use client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";

import { ButtonDeletePaymentItemProps } from "./ButtonDeletePaymentItem.types";

export default function ButtonDeletePaymentItem(
  props: ButtonDeletePaymentItemProps
) {
  const { paymentSchedule, paymentItem } = props;
  const router = useRouter();

  const onDeletePaymentScheduleItem = async () => {
    try {
      await axios.delete(
        `/api/payment-schedule/${paymentSchedule.id}/payment-item/${paymentItem.id}`
      );
      toast.success("Payment Item deleted! ❌");
      router.refresh();
    } catch (error) {
      toast.error("Error deleting payment item ‼️");
    }
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={true} />
      <Button variant="ghost" size="icon" onClick={onDeletePaymentScheduleItem}>
        <Trash className="h-5 w-5" />
      </Button>
    </div>
  );
}
