"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
// import { FormTransactionProps } from "./FormTransaction.types";

import { formSchema } from "./FormTransaction.form";

function FromTransaction() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      description: "",
      amount: "",
    },
  });
  const [formattedAmount, setFormattedAmount] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/transactions`, values);
      toast.success("Transaction added! 🎉");
      form.reset();
      setFormattedAmount("");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred. Please try again. 😢");
    }
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except for periods
    const numberValue = value.replace(/\D/g, "");
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(numberValue));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove periods for internal value handling
    const unformattedValue = value.replace(/\./g, "");
    form.setValue("amount", unformattedValue);
    // Update formatted value for display
    setFormattedAmount(formatAmount(unformattedValue));
  };

  const { isValid } = form.formState;

  return (
    <div className="space-y-4">
      <Toaster position="top-right" reverseOrder={true} />
      <h2 className="text-2xl font-bold mb-4">Income</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"income"}>Income</SelectItem>
                        <SelectItem value={"fixed_expenses"}>
                          Fixed Expenses
                        </SelectItem>
                        <SelectItem value={"variable_expenses"}>
                          Variable Expenses
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
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

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text" // Change to text to allow formatting
                      value={formattedAmount} // Display formatted value
                      onChange={handleAmountChange} // Handle change and format
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className={`w-full mt-8 ${isValid === false ? 'opacity-50' : 'opacity-100'}`}>
            Add Transaction
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { FromTransaction };
