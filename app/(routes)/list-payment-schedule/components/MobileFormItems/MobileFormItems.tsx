"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Import the new mobile-friendly date picker instead of the regular DatePicker
import { MobileDatePicker } from "@/components/ui/react-datepicker";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "./FormItems.form";
import { FormItemsProps } from "./FormItems.types";
import { Checkbox } from "@/components/ui/checkbox";
import useFormatAmount from "@/hooks/useFormatAmount";
import { useCreatePaymentItem } from "@/hooks/use-payment-schedules";

export function MobileFormItems(props: FormItemsProps) {
  const { setOpen, paymentSchedule } = props;
  const formatAmount = useFormatAmount();
  const createPaymentItemMutation = useCreatePaymentItem();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      check: false,
      amount: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createPaymentItemMutation.mutateAsync({
        paymentScheduleId: paymentSchedule.id,
        amount: values.amount,
        date: values.date,
        description: values.description,
        check: values.check,
      });
      toast.success("¡Item de pago creado! ✅");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Error al crear item de pago");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("amount", value);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:grid-cols-2 grid gap-4"
      >
        {/* Status */}
        <FormField
          control={form.control}
          name="check"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-start gap-2 items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={() => field.onChange(true)}
                    />
                  </FormControl>
                  <FormLabel>Pagado</FormLabel>
                </div>
                <div className="flex flex-row justify-start gap-2 items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value === false}
                      onCheckedChange={() => field.onChange(false)}
                    />
                  </FormControl>
                  <FormLabel>No Pagado</FormLabel>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Amount */}
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
                  value={formatAmount(form.watch("amount"))}
                  onChange={handleAmountChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Date - Using the new Mobile Date Picker */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col md:mt-2.5">
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <MobileDatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                  placeholder="Selecciona una fecha"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button
            type="submit"
            disabled={createPaymentItemMutation.isPending}
          >
            {createPaymentItemMutation.isPending ? "Creando..." : "Crear Item de Pago"}
          </Button>
        </div>
      </form>
    </Form>
  );
}