"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { PaymentSchedule } from "@prisma/client";

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
import { AdaptiveDateRangePicker } from "@/components/ui/adaptive-date-range-picker";
import { useUpdatePaymentSchedule } from "@/hooks/use-payment-schedules";

const editPaymentScheduleFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

type EditPaymentScheduleFormValues = z.infer<typeof editPaymentScheduleFormSchema>;

interface EditPaymentScheduleProps {
  paymentSchedule: PaymentSchedule;
}

export function EditPaymentSchedule({ paymentSchedule }: EditPaymentScheduleProps) {
  const [open, setOpen] = useState(false);
  const updatePaymentScheduleMutation = useUpdatePaymentSchedule();

  const form = useForm<EditPaymentScheduleFormValues>({
    resolver: zodResolver(editPaymentScheduleFormSchema),
    defaultValues: {
      name: paymentSchedule.name,
      dateRange: {
        from: new Date(paymentSchedule.fromDate),
        to: new Date(paymentSchedule.toDate),
      },
    },
  });

  const onSubmit = async (values: EditPaymentScheduleFormValues) => {
    try {
      await updatePaymentScheduleMutation.mutateAsync({
        id: paymentSchedule.id,
        name: values.name,
        fromDate: values.dateRange.from,
        toDate: values.dateRange.to,
      });

      toast.success("¡Lista de pagos actualizada exitosamente! ✅");
      setOpen(false);
    } catch (error) {
      toast.error("Error al actualizar la lista de pagos");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      form.reset({
        name: paymentSchedule.name,
        dateRange: {
          from: new Date(paymentSchedule.fromDate),
          to: new Date(paymentSchedule.toDate),
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Edit className="w-[20px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Lista de Pagos</DialogTitle>
          <DialogDescription>
            Modifica el nombre y fechas de la lista de pagos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la lista" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Rango de Fechas</FormLabel>
                  <FormControl>
                    <AdaptiveDateRangePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      placeholder="Selecciona rango de fechas"
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
                disabled={updatePaymentScheduleMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updatePaymentScheduleMutation.isPending}
              >
                {updatePaymentScheduleMutation.isPending ? "Actualizando..." : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}