"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
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

import { formSchema } from "./FormListPaymentSchedule.form";
import { FormListPaymentScheduleProps } from "./FormListPaymentSchedule.types";

function FormListPaymentSchedule(props: FormListPaymentScheduleProps) {
  const { setOpenDialog } = props;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/list-payment-schedule`, values);
      toast.success("List Payment schedule added! 🎉");
      router.refresh();
      setOpenDialog(false);
    } catch (error) {
      toast.error("An error occurred. Please try again. 😢");
    }
  };

  const { isValid } = form.formState;

  return (
    <div className="space-y-4">
      <Toaster position="top-right" reverseOrder={true}/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="name"
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
          </div>
          <Button
            type="submit"
            className={`w-full mt-8 ${
              isValid === false ? "opacity-50" : "opacity-100"
            }`}
          >
            Add List Payment Schedule
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { FormListPaymentSchedule };
