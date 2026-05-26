"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Check,
  CalendarDays,
  Sparkles,
  SendHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AdaptiveDatePicker } from "@/components/ui/adaptive-date-picker";
import {
  useCreateTransaction,
  useTransactionCategories,
} from "@/hooks/use-transactions";
import { useAiCategorize } from "@/hooks/use-ai-categorize";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";

export function QuickAddFAB() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nlpMode, setNlpMode] = useState(false);
  const [nlpText, setNlpText] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);
  const nlpRef = useRef<HTMLInputElement>(null);

  const { colorTheme } = useSyncColorTheme();
  const { getSymbol } = useCurrencyStore();
  const formatAmount = useFormatAmount();
  const symbol = getSymbol();
  const { data: categories = [] } = useTransactionCategories();
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();
  const { mutateAsync: categorize, isPending: isCategorizing } =
    useAiCategorize();

  useEffect(() => {
    if (open && !nlpMode) {
      const t = setTimeout(() => amountRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
    if (open && nlpMode) {
      const t = setTimeout(() => nlpRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open, nlpMode]);

  const reset = () => {
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date());
    setShowDatePicker(false);
    setNlpMode(false);
    setNlpText("");
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const isValid =
    amount.length > 0 && category.length > 0 && description.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid || isPending) return;
    try {
      await createTransaction({
        amount,
        category,
        description: description.trim(),
        date,
      });
      toast.success("Transacción agregada");
      handleClose();
    } catch {
      toast.error("Error al agregar la transacción");
    }
  };

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
      if (match) setCategory(match.slug);
      if (data.description) setDescription(data.description);
      if (data.amount) setAmount(data.amount);
      if (data.date) setDate(new Date(data.date + "T12:00:00"));
      setNlpText("");
      setNlpMode(false);
    },
    onError: () => toast.error("No pude interpretar la transacción"),
  });

  const handleNlpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlpText.trim()) return;
    parseNlp(nlpText.trim());
  };

  const handleAutoCategorize = async () => {
    if (!description.trim()) return;
    const slug = await categorize(description);
    const match = categories.find((c) => c.slug === slug);
    if (match) setCategory(match.slug);
  };

  const selectedCat = categories.find((c) => c.slug === category);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const dateLabel = isToday
    ? "Hoy"
    : isYesterday
      ? "Ayer"
      : date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white"
        style={{ backgroundColor: colorTheme }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.3 }}
        aria-label="Agregar transacción rápida"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </motion.button>

      <Sheet
        open={open}
        onOpenChange={(v) => {
          if (!v) handleClose();
        }}
      >
        <SheetContent
          side="bottom"
          className="rounded-t-3xl p-0 focus:outline-none"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 24px)" }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-0">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          <SheetHeader className="px-6 pt-3 pb-2">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-semibold text-slate-800">
                Nueva transacción
              </SheetTitle>
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
          </SheetHeader>

          <div className="px-6 pb-6 space-y-3.5">
            {/* NLP input panel */}
            {nlpMode && (
              <form onSubmit={handleNlpSubmit}>
                <div className="flex gap-2">
                  <input
                    ref={nlpRef}
                    type="text"
                    value={nlpText}
                    onChange={(e) => setNlpText(e.target.value)}
                    placeholder="Ej: gasté 50k en rappi ayer"
                    disabled={isParsing}
                    className="flex-1 text-sm rounded-xl border border-violet-200 bg-white px-3 py-2 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
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
                  Describe la transacción — Claude llena el formulario
                </p>
              </form>
            )}

            {/* Amount — hero field */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-3.5">
              <span className="text-2xl font-bold text-slate-300 select-none">
                {symbol}
              </span>
              <input
                ref={amountRef}
                type="text"
                inputMode="numeric"
                value={formatAmount(amount)}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="0"
                className="flex-1 bg-transparent text-2xl font-bold text-slate-800 focus:outline-none placeholder:text-slate-200 tabular-nums min-w-0"
              />
            </div>

            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-slate-50 border-0 rounded-2xl h-12 text-sm focus:ring-0 focus:ring-offset-0">
                {category && selectedCat ? (
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: selectedCat.color }}
                    />
                    <span className="font-medium text-slate-800">
                      {selectedCat.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {selectedCat.type === "income" ? "· Ingreso" : "· Gasto"}
                    </span>
                  </div>
                ) : (
                  <SelectValue placeholder="Categoría" />
                )}
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                      <span className="text-xs text-slate-400">
                        {cat.type === "income" ? "· Ingreso" : "· Gasto"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Description + auto-categorize */}
            <div className="relative">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="Descripción (ej: Mercado, Salario...)"
                className="bg-slate-50 border-0 rounded-2xl h-12 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus-visible:ring-0 pr-16"
              />
              <button
                type="button"
                onClick={handleAutoCategorize}
                disabled={isCategorizing || !description.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-slate-400 hover:text-violet-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Auto-categorizar con IA"
              >
                <Sparkles
                  className={`w-3.5 h-3.5 ${isCategorizing ? "animate-pulse" : ""}`}
                />
                <span className="hidden sm:inline">
                  {isCategorizing ? "..." : "Auto"}
                </span>
              </button>
            </div>

            {/* Date row */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDate(new Date());
                  setShowDatePicker(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isToday
                    ? "text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                style={isToday ? { backgroundColor: colorTheme } : {}}
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => {
                  setDate(yesterday);
                  setShowDatePicker(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isYesterday
                    ? "text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                style={isYesterday ? { backgroundColor: colorTheme } : {}}
              >
                Ayer
              </button>
              <button
                type="button"
                onClick={() => setShowDatePicker((v) => !v)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  !isToday && !isYesterday
                    ? "text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                style={
                  !isToday && !isYesterday
                    ? { backgroundColor: colorTheme }
                    : {}
                }
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {!isToday && !isYesterday ? dateLabel : "Otra fecha"}
              </button>
            </div>

            {showDatePicker && (
              <AdaptiveDatePicker
                date={date}
                onDateChange={(d) => {
                  if (d) {
                    setDate(new Date(d.setHours(0, 0, 0, 0)));
                    setShowDatePicker(false);
                  }
                }}
                placeholder="Selecciona una fecha"
                className="bg-slate-50 border-0 rounded-2xl"
              />
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!isValid || isPending}
              className="w-full h-12 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-40 mt-1"
              style={{ backgroundColor: colorTheme }}
            >
              {isPending ? (
                "Guardando..."
              ) : (
                <>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  Guardar
                </>
              )}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
