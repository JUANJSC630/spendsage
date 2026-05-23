"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdaptiveDatePicker } from "@/components/ui/adaptive-date-picker";
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
import {
  useCreateTransaction,
  useTransactionCategories,
} from "@/hooks/use-transactions";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { formSchema } from "./FormTransaction.form";

function FormTransaction() {
  const { colorTheme } = useSyncColorTheme();
  const formatAmount = useFormatAmount();
  const { data: categories = [], isLoading: loadingCategories } =
    useTransactionCategories();
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();

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
      await createTransaction(values);
      toast.success("Transacción agregada");
      form.reset({
        category: "",
        description: "",
        amount: "",
        date: new Date(),
      });
    } catch {
      toast.error("Error al agregar la transacción");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("amount", value, { shouldValidate: true });
  };

  return (
    <div className="rounded-2xl bg-slate-50 p-6 h-full">
      <p className="text-sm font-semibold text-slate-800 mb-5">
        Nueva transacción
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
                    disabled={loadingCategories}
                  >
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue
                        placeholder={
                          loadingCategories
                            ? "Cargando..."
                            : "Selecciona una categoría"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 && !loadingCategories ? (
                        <div className="p-3 text-sm text-slate-400">
                          No hay categorías. Crea una en la sección Categorías.
                        </div>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: cat.color }}
                              />
                              <span>{cat.name}</span>
                              <span className="text-xs text-slate-400">
                                {cat.type === "income"
                                  ? "· Ingreso"
                                  : "· Gasto"}
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
              <FormItem>
                <FormLabel className="text-xs text-slate-500 font-medium">
                  Fecha
                </FormLabel>
                <FormControl>
                  <AdaptiveDatePicker
                    date={field.value}
                    onDateChange={(d) => {
                      if (d) field.onChange(new Date(d.setHours(0, 0, 0, 0)));
                    }}
                    placeholder="Selecciona una fecha"
                    className="bg-white border-slate-200"
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
                <FormLabel className="text-xs text-slate-500 font-medium">
                  Descripción
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white border-slate-200"
                    placeholder="Ej: Mercado, Salario..."
                  />
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
                    type="text"
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

          <Button
            type="submit"
            disabled={!form.formState.isValid || isPending}
            className="mt-2 w-full gap-2 text-white"
            style={{ backgroundColor: colorTheme }}
          >
            <Plus className="w-4 h-4" />
            {isPending ? "Guardando..." : "Agregar transacción"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { FormTransaction };
