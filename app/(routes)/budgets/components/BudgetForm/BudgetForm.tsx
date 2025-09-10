"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormatAmount from "@/hooks/useFormatAmount";

import { budgetFormSchema } from "./BudgetForm.form";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  type: string;
  isActive: boolean;
}

const periods = [
  { value: "monthly", label: "Mensual" },
];

function BudgetForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const formatAmount = useFormatAmount();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        // Filter only active categories
        const activeCategories = response.data.filter((category: Category) => category.isActive);
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error al cargar las categorías');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const form = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: "",
      amount: "",
      period: "monthly",
      month: currentMonth,
      year: currentYear,
    },
  });

  const onSubmit = async (values: z.infer<typeof budgetFormSchema>) => {
    try {
      await axios.post(`/api/budgets`, values);
      toast.success("¡Presupuesto creado! 🎯");
      
      // Redirect to budgets page after successful creation
      setTimeout(() => {
        router.push("/budgets");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        toast.error("Ya existe un presupuesto para esta categoría y período");
      } else {
        toast.error("Ocurrió un error. Por favor intenta de nuevo.");
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("amount", value);
  };

  const { isValid } = form.formState;

  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="space-y-3">
      <Toaster position="top-right" reverseOrder={true} />
      <h2 className="text-sm font-bold">Crear Presupuesto</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loadingCategories}>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Cargando categorías..." : "Selecciona una categoría"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length === 0 && !loadingCategories ? (
                          <div className="p-2 text-sm text-gray-500">
                            No hay categorías disponibles. Crea una en la sección Categorías.
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
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Monto Presupuestado</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      value={formatAmount(form.watch("amount"))}
                      onChange={handleAmountChange}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Período</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el período" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Mes</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        value={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value.toString()}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        value={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className={`w-full ${!isValid ? "opacity-50" : "opacity-100"}`}
            disabled={!isValid}
          >
            Crear Presupuesto
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { BudgetForm };