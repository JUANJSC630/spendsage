"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Plus, Sparkles, SendHorizontal } from "lucide-react";
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
import { useAiCategorize } from "@/hooks/use-ai-categorize";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { formSchema } from "./FormTransaction.form";
import { useMutation } from "@tanstack/react-query";

function FormTransaction() {
  const { colorTheme } = useSyncColorTheme();
  const formatAmount = useFormatAmount();
  const { data: categories = [], isLoading: loadingCategories } =
    useTransactionCategories();
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();
  const { mutateAsync: categorize, isPending: isCategorizing } =
    useAiCategorize();

  const [nlpText, setNlpText] = useState("");
  const [nlpMode, setNlpMode] = useState(false);

  const { mutate: parseNlp, isPending: isParsing } = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch("/api/ai/parse-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Parse failed");
      return res.json() as Promise<{
        description: string;
        amount: string;
        category: string;
        date: string;
      }>;
    },
    onSuccess: (data) => {
      const match = categories.find((c) => c.slug === data.category);
      if (match)
        form.setValue("category", match.slug, { shouldValidate: true });
      if (data.description)
        form.setValue("description", data.description, {
          shouldValidate: true,
        });
      if (data.amount)
        form.setValue("amount", data.amount, { shouldValidate: true });
      if (data.date) {
        const d = new Date(data.date + "T12:00:00");
        form.setValue("date", d, { shouldValidate: true });
      }
      setNlpText("");
      setNlpMode(false);
    },
    onError: () => toast.error("No pude interpretar la transacción"),
  });

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

  const handleAutoCategorize = async () => {
    const description = form.getValues("description");
    if (!description.trim()) return;
    const slug = await categorize(description);
    const match = categories.find((c) => c.slug === slug);
    if (match) form.setValue("category", match.slug, { shouldValidate: true });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("amount", value, { shouldValidate: true });
  };

  const handleNlpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlpText.trim()) return;
    parseNlp(nlpText.trim());
  };

  return (
    <div className="rounded-2xl bg-slate-50 p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-slate-800">
          Nueva transacción
        </p>
        <button
          type="button"
          onClick={() => setNlpMode((v) => !v)}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${
            nlpMode
              ? "bg-violet-100 text-violet-600"
              : "text-slate-400 hover:text-violet-500 hover:bg-violet-50"
          }`}
        >
          <Sparkles className="w-3 h-3" />
          IA
        </button>
      </div>

      {/* NLP input panel */}
      {nlpMode && (
        <form onSubmit={handleNlpSubmit} className="mb-5">
          <div className="flex gap-2">
            <input
              type="text"
              value={nlpText}
              onChange={(e) => setNlpText(e.target.value)}
              placeholder="Ej: gaste 50k en rappi ayer"
              disabled={isParsing}
              className="flex-1 text-sm rounded-xl border border-violet-200 bg-white px-3 py-2 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
              autoFocus
            />
            <button
              type="submit"
              disabled={isParsing || !nlpText.trim()}
              className="p-2.5 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition-colors disabled:opacity-40"
            >
              {isParsing ? (
                <Sparkles className="w-4 h-4 animate-pulse" />
              ) : (
                <SendHorizontal className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
            Describe la transacción en lenguaje natural — Claude la interpreta
          </p>
        </form>
      )}

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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs text-slate-500 font-medium">
                    Descripción
                  </FormLabel>
                  <button
                    type="button"
                    onClick={handleAutoCategorize}
                    disabled={isCategorizing || !form.watch("description")}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-violet-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Auto-categorizar con IA"
                  >
                    <Sparkles
                      className={`w-3 h-3 ${isCategorizing ? "animate-pulse" : ""}`}
                    />
                    {isCategorizing ? "Categorizando..." : "Auto"}
                  </button>
                </div>
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
