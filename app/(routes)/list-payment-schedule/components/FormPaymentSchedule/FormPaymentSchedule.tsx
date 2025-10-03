"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "./FormPaymentSchedule.form";
import { FormPaymentScheduleProps } from "./FormPaymentSchedule.types";
import { DateRangePicker } from "./DateRangePicker";

function FormPaymentSchedule(props: FormPaymentScheduleProps) {
  const { setOpenDialog } = props;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listPaymentScheduleId: props.listPaymentScheduleId,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        fromDate: values.dateRange.from,
        toDate: values.dateRange.to,
        name: values.name,
        listPaymentScheduleId: values.listPaymentScheduleId,
      };
      await axios.post(`/api/payment-schedule`, payload);
      toast.success("¡Lista de pagos agregado! 🎉");
      router.refresh();
      setOpenDialog(false);
    } catch (error) {
      toast.error("Ocurrió un error. Por favor intenta de nuevo. 😢");
    }
  };

  const { isValid } = form.formState;

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Rango de Fechas</FormLabel>
                  <FormControl>
                    <DateRangePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Selecciona rango de fechas"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
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
          </div>
          <Button
            type="submit"
            className={`w-full mt-8 ${
              isValid === false ? "opacity-50" : "opacity-100"
            }`}
          >
            Agregar Lista de Pagos
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { FormPaymentSchedule };
