"use client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

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
      toast.success("Payment schedule deleted! ❌");
      router.refresh();
    } catch (error) {
      toast.error("Error deleting payment schedule ‼️");
      console.error(error);
    }
  };
  return (
    <div>
      <Toaster position="top-right" reverseOrder={true} />
      <Button onClick={onDeletePaymentSchedule}>
        <Trash className="w-[20px] hover:text-red-500" />
      </Button>
    </div>
  );
}
