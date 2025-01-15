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

import { FormListPaymentSchedule } from "./FormListPaymentSchedule/FormListPaymentSchedule";

export function ButtonAddListPaymentSchedule() {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  return (
    <Dialog open={isOpenModalCreate} onOpenChange={setIsOpenModalCreate}>
      <DialogTrigger asChild>
        <Button className="space-x-2">
          <PlusCircle className="h-5 w-5" />
          <span>Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment Schedule</DialogTitle>
          <DialogDescription>
            Add a new list payment schedule to your list.
          </DialogDescription>
        </DialogHeader>
        <FormListPaymentSchedule setOpenDialog={setIsOpenModalCreate} />
      </DialogContent>
    </Dialog>
  );
}
