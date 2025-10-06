"use client";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
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
import { MobileDatePicker } from "@/components/ui/mobile-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

// import { FormTransactionProps } from "./FormTransaction.types";
import { formSchema } from "./FormTransaction.form";
import useFormatAmount from "@/hooks/useFormatAmount";

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  color: string;
  icon: string;
}

function FromTransaction() {
  const router = useRouter();
  const [formattedAmount, setFormattedAmount] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const formatAmount = useFormatAmount();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error al cargar las categorías');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      description: "",
      amount: "",
      date: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/transactions`, values);
      toast.success("¡Transacción agregada! 🎉");
      form.reset();
      setFormattedAmount("");
      router.refresh();
    } catch (error) {
      toast.error("Ocurrió un error. Por favor intenta de nuevo. 😢");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("amount", value);
  };

  const { isValid } = form.formState;

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold mb-4">Agregar Transacción</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loadingCategories}>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Cargando categorías..." : "Selecciona una categoría"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length === 0 && !loadingCategories ? (
                          <div className="p-2 text-sm text-gray-500">
                            No hay categorías disponibles. 
                            <br />
                            Crea una en la sección Categorías.
                          </div>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                                <span>{category.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({category.type === 'income' ? 'Ingreso' : 
                                    category.type === 'expense' ? 'Gasto' : 
                                    category.type})
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
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
                    <MobileDatePicker
                      value={field.value}
                      onChange={(date) => {
                        if (date) {
                          const newDate = new Date(date.setHours(0, 0, 0, 0));
                          field.onChange(newDate);
                        }
                      }}
                      placeholder="Selecciona una fecha"
                    />
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
                  <FormLabel>Descripción</FormLabel>
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
          </div>
          <Button
            type="submit"
            className={`w-full mt-8 ${
              isValid === false ? "opacity-50" : "opacity-100"
            }`}
          >
            Agregar Transacción
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { FromTransaction };
