"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ToggleLeft, ToggleRight, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useRecurringTransactions,
  useCreateRecurring,
  useDeleteRecurring,
  useUpdateRecurring,
  useApplyRecurring,
  usePendingRecurring,
} from "@/hooks/use-recurring-transactions";
import { useTransactionCategories } from "@/hooks/use-transactions";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { getCategoryInfo } from "@/lib/categoryMapping";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

const formSchema = z.object({
  description: z.string().nonempty("La descripción es requerida"),
  amount: z
    .string()
    .min(1, "El monto es requerido")
    .refine((v) => /^\d+$/.test(v), "Solo números"),
  category: z.string().nonempty("Selecciona una categoría"),
  dayOfMonth: z.coerce.number().min(1).max(28),
});

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function RecurringPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { colorTheme } = useSyncColorTheme();
  const { getSymbol } = useCurrencyStore();
  const formatAmount = useFormatAmount();
  const symbol = getSymbol();

  const { data: recurring = [], isLoading } = useRecurringTransactions();
  const { data: categories = [] } = useTransactionCategories();
  const { mutate: createRecurring, isPending: isCreating } = useCreateRecurring();
  const { mutate: deleteRecurring } = useDeleteRecurring();
  const { mutate: updateRecurring } = useUpdateRecurring();
  const { mutate: applyRecurring, isPending: isApplying } = useApplyRecurring();
  const pending = usePendingRecurring(month, year);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "", amount: "", category: "", dayOfMonth: 1 },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createRecurring(values, {
      onSuccess: () => {
        toast.success("Recurrente agregada");
        form.reset({ description: "", amount: "", category: "", dayOfMonth: 1 });
      },
      onError: () => toast.error("Error al agregar"),
    });
  };

  const handleApplyAll = () => {
    applyRecurring(
      { month, year },
      {
        onSuccess: ({ created }) =>
          toast.success(`${created} transacción${created !== 1 ? "es" : ""} registrada${created !== 1 ? "s" : ""}`),
        onError: () => toast.error("Error al aplicar recurrentes"),
      },
    );
  };

  const totalMonthly = useMemo(
    () => recurring.filter((r) => r.isActive).reduce((s, r) => s + parseFloat(r.amount), 0),
    [recurring],
  );

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] w-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Recurrentes
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {recurring.filter((r) => r.isActive).length} activas ·{" "}
          {symbol}{formatAmount(totalMonthly.toString())} / mes
        </p>
      </motion.div>

      {/* Pending banner */}
      {pending.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl p-4 mb-6 flex items-center justify-between gap-4"
          style={{ backgroundColor: `${colorTheme}18`, borderLeft: `3px solid ${colorTheme}` }}
        >
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {pending.length} pendiente{pending.length !== 1 ? "s" : ""} para {MONTHS[month - 1]}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Aplícalas para registrarlas como transacciones de este mes
            </p>
          </div>
          <button
            onClick={handleApplyAll}
            disabled={isApplying}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold flex-shrink-0 disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: colorTheme }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isApplying ? "animate-spin" : ""}`} />
            {isApplying ? "Aplicando..." : "Aplicar todas"}
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form */}
        <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-6 h-fit">
          <p className="text-sm font-semibold text-slate-800 mb-4">Nueva recurrente</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-500">Descripción</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white border-slate-200" placeholder="Ej: Netflix, Arriendo, Laura..." />
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
                    <FormLabel className="text-xs text-slate-500">Monto</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={formatAmount(form.watch("amount"))}
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                        className="bg-white border-slate-200"
                        placeholder="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-500">Categoría</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.slug}>
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span>{cat.name}</span>
                                <span className="text-xs text-slate-400">
                                  {cat.type === "income" ? "· Ingreso" : "· Gasto"}
                                </span>
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
                name="dayOfMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-500">Día del mes</FormLabel>
                    <FormControl>
                      <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value.toString()}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((d) => (
                            <SelectItem key={d} value={d.toString()}>
                              Día {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={!form.formState.isValid || isCreating}
                className="w-full h-11 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity mt-1"
                style={{ backgroundColor: colorTheme }}
              >
                <Plus className="w-4 h-4" />
                {isCreating ? "Guardando..." : "Agregar"}
              </button>
            </form>
          </Form>
        </motion.div>

        {/* List */}
        <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-800 mb-4">
            Tus recurrentes ({recurring.length})
          </p>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.3 }} />
              ))}
            </div>
          ) : recurring.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <RefreshCw className="w-8 h-8 text-slate-200 mb-3" />
              <p className="text-sm font-medium text-slate-400">Sin recurrentes</p>
              <p className="text-xs text-slate-300 mt-1">Agrega tus gastos y transferencias fijas</p>
            </div>
          ) : (
            <motion.div
              className="space-y-2 overflow-auto max-h-[500px] pr-0.5"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence initial={false}>
                {recurring.map((r) => {
                  const { category } = getCategoryInfo(categories, r.category);
                  const catColor = category?.color ?? "#94a3b8";
                  const catName = category?.name ?? r.category;
                  const isPending = !r.lastAppliedAt ||
                    new Date(r.lastAppliedAt).getMonth() + 1 !== month ||
                    new Date(r.lastAppliedAt).getFullYear() !== year;

                  return (
                    <motion.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: r.isActive ? 1 : 0.45, y: 0 }}
                      exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
                      className="group bg-white rounded-xl px-4 py-3 flex items-center gap-3"
                    >
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-800 truncate">{r.description}</p>
                          {r.isActive && isPending && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 flex-shrink-0">
                              Pendiente
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {catName} · Día {r.dayOfMonth}
                        </p>
                      </div>

                      <span className="text-sm font-bold tabular-nums text-slate-700 flex-shrink-0">
                        {symbol}{formatAmount(r.amount)}
                      </span>

                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() =>
                            updateRecurring(
                              { id: r.id, isActive: !r.isActive },
                              { onSuccess: () => toast.success(r.isActive ? "Pausada" : "Activada") },
                            )
                          }
                          className="p-1.5 rounded-lg text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                          aria-label={r.isActive ? "Pausar" : "Activar"}
                        >
                          {r.isActive ? (
                            <ToggleRight className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                              aria-label="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar recurrente?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Se eliminará <strong>{r.description}</strong>. Las transacciones ya registradas no se ven afectadas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteRecurring(r.id, {
                                    onSuccess: () => toast.success("Eliminada"),
                                    onError: () => toast.error("Error al eliminar"),
                                  })
                                }
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
