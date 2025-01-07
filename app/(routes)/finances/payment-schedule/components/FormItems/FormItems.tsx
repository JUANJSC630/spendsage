"use client";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "./FormItems.form";
import { FormItemsProps } from "./FormItems.types";
import { Checkbox } from "@/components/ui/checkbox";
import useFormatAmount from "@/hooks/useFormatAmount";

export function FormItems(props: FormItemsProps) {
  const { setOpen, paymentSchedule } = props;
  const formatAmount = useFormatAmount();
  const router = useRouter();
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
      await axios.post(
        `/api/payment-schedule/${paymentSchedule.id}/payment-item`,
        values
      );
      toast.success("Payment item created! ✅");
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast.error("Error creating payment item");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("amount", value);
  };

  return (
    <Form {...form}>
      <Toaster position="top-right" reverseOrder={true} />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:grid-cols-2 grid gap-4"
      >
        <FormField
          control={form.control}
          name="check"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-start gap-2 items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={() => field.onChange(true)}
                    />
                  </FormControl>
                  <FormLabel>Paid</FormLabel>
                </div>
                <div className="flex flex-row justify-start gap-2 items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value === false}
                      onCheckedChange={() => field.onChange(false)}
                    />
                  </FormControl>
                  <FormLabel>Not Paid</FormLabel>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
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
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col md:mt-2.5">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit">Create Payment Item</Button>
        </div>
      </form>
    </Form>
  );
}
