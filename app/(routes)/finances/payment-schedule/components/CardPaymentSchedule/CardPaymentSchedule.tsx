"use client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import React from "react";
import { CardPaymentScheduleProps } from "./CardPaymentSchedule.types";
import { useRouter } from "next/navigation";

export default function CardPaymentSchedule(props: CardPaymentScheduleProps) {
  const { cardPaymentSchedule } = props;
  const router = useRouter();

  const deletePaymentSchedule = async (id: string) => {
    try {
      await axios.delete(`/api/payment-schedule/${id}`);
      toast.success("Payment schedule deleted! ❌");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">{cardPaymentSchedule.name}</h1>
          <div className="text-gray-500 text-sm">
            {new Date(cardPaymentSchedule.fromDate).toLocaleDateString("es-ES")}
            -{new Date(cardPaymentSchedule.toDate).toLocaleDateString("es-ES")}
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <Button>Add Item</Button>
          <Button onClick={() => deletePaymentSchedule(cardPaymentSchedule.id)}>
            <Trash className="w-[20px] hover:text-red-500" />
          </Button>
        </div>
      </div>
      <div className="space-y-4 overscroll-y-contain overflow-auto max-h-[350px]">
        {/* {list.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-100 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() =>
                          toggleItemChecked(list.id, item.id)
                        }
                      />
                      <div className="flex-1">
                        <div className="text-gray-500 text-sm">{item.date}</div>
                        <div className="font-semibold">${item.amount}</div>
                        <div className="text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItem(list.id, item.id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                ))} */}
        <p>items list</p>
      </div>
    </div>
  );
}
