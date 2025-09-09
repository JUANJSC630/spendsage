"use client";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FormPaymentSchedule } from "../FormPaymentSchedule/FormPaymentSchedule";

type ButtonAddPaymentScheduleProps = {
  listPaymentScheduleId: string;
};

export function ButtonAddPaymentSchedule(props: ButtonAddPaymentScheduleProps) {
  const { listPaymentScheduleId } = props;
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  return (
    <Dialog open={isOpenModalCreate} onOpenChange={setIsOpenModalCreate}>
      <DialogTrigger asChild>
        <Button className="space-x-2">
          <PlusCircle className="h-5 w-5" />
          <span>Agregar Lista de Pagos</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Lista de Pagos</DialogTitle>
          <DialogDescription>
            Agregar un nuevo lista de pagos a tu lista.
          </DialogDescription>
        </DialogHeader>
        <FormPaymentSchedule
          setOpenDialog={setIsOpenModalCreate}
          listPaymentScheduleId={listPaymentScheduleId}
        />
      </DialogContent>
    </Dialog>
  );
}
