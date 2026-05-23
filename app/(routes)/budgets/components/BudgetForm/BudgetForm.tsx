"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBudget } from "@/hooks/use-budgets";
import { useTransactionCategories } from "@/hooks/use-transactions";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { budgetFormSchema } from "./BudgetForm.form";

const MONTHS = [
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

interface BudgetFormProps {
  month?: number;
  year?: number;
}

function BudgetForm({ month: propMonth, year: propYear }: BudgetFormProps) {
  const now = new Date();
  const defaultMonth = propMonth ?? now.getMonth() + 1;
  const defaultYear = propYear ?? now.getFullYear();
  const currentYear = now.getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const { colorTheme } = useSyncColorTheme();
  const { mutateAsync: createBudget, isPending } = useCreateBudget();
  const { data: categories = [] } = useTransactionCategories();
  const formatAmount = useFormatAmount();

  const activeCategories = categories.filter((c) => c.isActive);

  const form = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: "",
      amount: "",
      period: "monthly",
      month: defaultMonth,
      year: defaultYear,
    },
    mode: "onChange",
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("amount", value);
    form.trigger("amount");
  };

  const onSubmit = async (values: z.infer<typeof budgetFormSchema>) => {
    try {
      await createBudget(values);
      toast.success("Presupuesto creado");
      form.reset({
        category: "",
        amount: "",
        period: "monthly",
        month: values.month,
        year: values.year,
      });
    } catch (err: unknown) {
      const e = err as { status?: number };
      if (e?.status === 500 || e?.status === 409) {
        toast.error("Ya existe un presupuesto para esta categoría y período");
      } else {
        toast.error("Error al crear el presupuesto");
      }
    }
  };

  return (
    <div className="rounded-2xl bg-slate-50 p-6 h-full">
      <p className="text-sm font-semibold text-slate-800 mb-5">
        Nuevo presupuesto
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-500 font-medium">
                  Categoría
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={activeCategories.length === 0}
                  >
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue
                        placeholder={
                          activeCategories.length === 0
                            ? "Sin categorías activas"
                            : "Selecciona una categoría"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {activeCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span>{cat.name}</span>
                          </div>
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-500 font-medium">
                  Monto
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    value={formatAmount(form.watch("amount"))}
                    onChange={handleAmountChange}
                    className="bg-white border-slate-200"
                    placeholder="0"
                  />
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
                <FormItem>
                  <FormLabel className="text-xs text-slate-500 font-medium">
                    Mes
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      value={field.value.toString()}
                    >
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m) => (
                          <SelectItem key={m.value} value={m.value.toString()}>
                            {m.label}
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
                <FormItem>
                  <FormLabel className="text-xs text-slate-500 font-medium">
                    Año
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      value={field.value.toString()}
                    >
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
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

          <Button
            type="submit"
            disabled={!form.formState.isValid || isPending}
            className="mt-2 w-full gap-2 text-white"
            style={{ backgroundColor: colorTheme }}
          >
            <Plus className="w-4 h-4" />
            {isPending ? "Guardando..." : "Crear presupuesto"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { BudgetForm };
