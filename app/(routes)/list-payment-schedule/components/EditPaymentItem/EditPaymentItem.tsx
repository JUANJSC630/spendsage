"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Edit, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

import { EditPaymentItemProps } from "./EditPaymentItem.types";
import { editPaymentItemFormSchema, EditPaymentItemFormValues } from "./EditPaymentItem.form";
import { useUpdatePaymentItem } from "@/hooks/use-payment-schedules";
import useFormatAmount from "@/hooks/useFormatAmount";

export default function EditPaymentItem({ paymentItem, paymentSchedule }: EditPaymentItemProps) {
  const [open, setOpen] = useState(false);
  const updatePaymentItemMutation = useUpdatePaymentItem();
  const formatAmount = useFormatAmount();

  const form = useForm<EditPaymentItemFormValues>({
    resolver: zodResolver(editPaymentItemFormSchema),
    defaultValues: {
      amount: paymentItem.amount,
      date: new Date(paymentItem.date),
      description: paymentItem.description,
    },
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("amount", value);
  };

  const onSubmit = async (values: EditPaymentItemFormValues) => {
    try {
      await updatePaymentItemMutation.mutateAsync({
        id: paymentItem.id,
        paymentScheduleId: paymentSchedule.id,
        amount: values.amount,
        date: values.date,
        description: values.description,
      });

      toast.success("¡Pago actualizado exitosamente! ✅");

      setOpen(false);
    } catch (error) {
      toast.error("Error al actualizar el item de pago");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Item de Pago</DialogTitle>
          <DialogDescription>
            Modifica los detalles del item de pago.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción del pago" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Monto del pago"
                      value={formatAmount(form.watch("amount"))}
                      onChange={handleAmountChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      placeholder="Selecciona una fecha"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updatePaymentItemMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updatePaymentItemMutation.isPending}
              >
                {updatePaymentItemMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}