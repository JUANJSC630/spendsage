"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormItems } from "../FormItems";
import { AddItemProps } from "./AddItem.types";
import { PlusCircle } from "lucide-react";

export default function AddItem(props: AddItemProps) {
  const { paymentSchedule } = props;
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-[20px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Add a new item to your payment schedule.
          </DialogDescription>
        </DialogHeader>
        <FormItems setOpen={setOpen} paymentSchedule={paymentSchedule} />
      </DialogContent>
    </Dialog>
  );
}
