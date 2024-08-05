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

export default function AddItem(props: AddItemProps) {
  const { paymentSchedule } = props;
    const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add new contact</DialogTitle>
          <DialogDescription>
            Create your contacts to manage your relationships with your
            customers.
          </DialogDescription>
        </DialogHeader>
        <FormItems setOpen={setOpen} paymentSchedule={paymentSchedule} />
      </DialogContent>
    </Dialog>
  )
}
