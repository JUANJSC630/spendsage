"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, CalendarDays, PiggyBank } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useSavingsGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
} from "@/hooks/use-savings-goals";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
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

const EMOJIS = ["🎯", "🏠", "✈️", "🚗", "💻", "📱", "🎓", "💍", "🏋️", "🌴", "💰", "🛡️"];

const formSchema = z.object({
  name: z.string().nonempty("El nombre es requerido"),
  targetAmount: z
    .string()
    .min(1, "El monto objetivo es requerido")
    .refine((v) => /^\d+$/.test(v), "Solo números"),
  emoji: z.string().default("🎯"),
  deadline: z.string().optional(),
});

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function GoalRing({
  pct,
  color,
  emoji,
  isComplete,
}: {
  pct: number;
  color: string;
  emoji: string;
  isComplete: boolean;
}) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 100) / 100);

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
        <motion.circle
          cx="38"
          cy="38"
          r={r}
          fill="none"
          stroke={isComplete ? "#10b981" : color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl">{isComplete ? "✅" : emoji}</span>
      </div>
    </div>
  );
}

function DepositButton({
  goalId,
  colorTheme,
  symbol,
  formatAmount,
}: {
  goalId: string;
  colorTheme: string;
  symbol: string;
  formatAmount: (v: string | number) => string;
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateGoal, isPending } = useUpdateGoal();
  const { data: goals = [] } = useSavingsGoals();

  const goal = goals.find((g) => g.id === goalId);
  if (!goal) return null;

  const handleDeposit = () => {
    const amt = parseFloat(value.replace(/\D/g, ""));
    if (!amt || amt <= 0) return;
    const newSaved = (parseFloat(goal.savedAmount) + amt).toString();
    const target = parseFloat(goal.targetAmount);
    const isComplete = parseFloat(newSaved) >= target;
    updateGoal(
      { id: goalId, savedAmount: newSaved, isComplete },
      {
        onSuccess: () => {
          toast.success(isComplete ? "🎉 ¡Meta alcanzada!" : `+${symbol}${formatAmount(amt.toString())} abonado`);
          setValue("");
          setOpen(false);
        },
        onError: () => toast.error("Error al abonar"),
      },
    );
  };

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        style={{ color: colorTheme, backgroundColor: `${colorTheme}15` }}
      >
        + Abonar
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={formatAmount(value)}
        onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleDeposit();
          if (e.key === "Escape") { setOpen(false); setValue(""); }
        }}
        placeholder="0"
        className="w-24 text-xs font-semibold border-b border-slate-300 bg-transparent focus:outline-none focus:border-slate-500 tabular-nums px-0.5 pb-0.5"
      />
      <button
        onClick={handleDeposit}
        disabled={!value || isPending}
        className="p-1 rounded-md text-white disabled:opacity-40"
        style={{ backgroundColor: colorTheme }}
      >
        <Check className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function GoalsPage() {
  const { colorTheme } = useSyncColorTheme();
  const { getSymbol } = useCurrencyStore();
  const formatAmount = useFormatAmount();
  const symbol = getSymbol();

  const { data: goals = [], isLoading } = useSavingsGoals();
  const { mutate: createGoal, isPending: isCreating } = useCreateGoal();
  const { mutate: deleteGoal } = useDeleteGoal();

  const [selectedEmoji, setSelectedEmoji] = useState("🎯");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", targetAmount: "", emoji: "🎯", deadline: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createGoal(
      {
        ...values,
        emoji: selectedEmoji,
        deadline: values.deadline || null,
      },
      {
        onSuccess: () => {
          toast.success("Meta creada");
          form.reset({ name: "", targetAmount: "", emoji: "🎯", deadline: "" });
          setSelectedEmoji("🎯");
        },
        onError: () => toast.error("Error al crear la meta"),
      },
    );
  };

  const active = goals.filter((g) => !g.isComplete);
  const completed = goals.filter((g) => g.isComplete);

  const totalTarget = active.reduce((s, g) => s + parseFloat(g.targetAmount), 0);
  const totalSaved = active.reduce((s, g) => s + parseFloat(g.savedAmount), 0);

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] w-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Metas</h1>
        <p className="text-sm text-slate-400 mt-1">
          {active.length} activa{active.length !== 1 ? "s" : ""} · {symbol}{formatAmount(Math.round(totalSaved).toString())} de {symbol}{formatAmount(Math.round(totalTarget).toString())} ahorrado
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form */}
        <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-6 h-fit">
          <p className="text-sm font-semibold text-slate-800 mb-4">Nueva meta</p>

          {/* Emoji picker */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2 font-medium">Ícono</p>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setSelectedEmoji(e)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-colors ${
                    selectedEmoji === e ? "ring-2 ring-offset-1" : "bg-white hover:bg-slate-100"
                  }`}
                  style={selectedEmoji === e ? { outline: `2px solid ${colorTheme}`, outlineOffset: "2px", backgroundColor: `${colorTheme}15` } : {}}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-500">Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white border-slate-200" placeholder="Ej: Viaje a Europa, Carro..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-500">Monto objetivo</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={formatAmount(form.watch("targetAmount"))}
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
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-500">Fecha límite (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="bg-white border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={!form.formState.isValid || isCreating}
                className="w-full h-11 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
                style={{ backgroundColor: colorTheme }}
              >
                <Plus className="w-4 h-4" />
                {isCreating ? "Guardando..." : "Crear meta"}
              </button>
            </form>
          </Form>
        </motion.div>

        {/* Goals list */}
        <div className="space-y-4">
          <motion.div variants={fadeUp} className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-800 mb-4">
              En progreso ({active.length})
            </p>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.3 }} />
                ))}
              </div>
            ) : active.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <PiggyBank className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-sm text-slate-400">Sin metas activas</p>
                <p className="text-xs text-slate-300 mt-1">Crea tu primera meta de ahorro</p>
              </div>
            ) : (
              <motion.div
                className="space-y-3"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence initial={false}>
                  {active.map((goal) => {
                    const target = parseFloat(goal.targetAmount);
                    const saved = parseFloat(goal.savedAmount);
                    const pct = target > 0 ? (saved / target) * 100 : 0;
                    const remaining = target - saved;
                    const daysLeft = goal.deadline
                      ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000)
                      : null;

                    return (
                      <motion.div
                        key={goal.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
                        className="group bg-white rounded-2xl p-4 flex items-start gap-4"
                      >
                        <GoalRing pct={pct} color={colorTheme} emoji={goal.emoji} isComplete={goal.isComplete} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="text-sm font-semibold text-slate-800 leading-tight">{goal.name}</p>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all flex-shrink-0">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar meta?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Se eliminará <strong>{goal.name}</strong> y su progreso. Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      deleteGoal(goal.id, {
                                        onSuccess: () => toast.success("Meta eliminada"),
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

                          <div className="flex items-center justify-between text-[11px] mb-1.5">
                            <span className="text-slate-500 tabular-nums">
                              <span className="font-semibold text-slate-700">{symbol}{formatAmount(Math.round(saved).toString())}</span>
                              {" "}de {symbol}{formatAmount(Math.round(target).toString())}
                            </span>
                            <span className="font-semibold" style={{ color: colorTheme }}>
                              {pct.toFixed(0)}%
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: colorTheme }}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(pct, 100)}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {daysLeft !== null && (
                                <span className={`flex items-center gap-1 text-[10px] font-medium ${daysLeft < 30 ? "text-red-500" : "text-slate-400"}`}>
                                  <CalendarDays className="w-3 h-3" />
                                  {daysLeft > 0 ? `${daysLeft}d restantes` : "Vencida"}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 tabular-nums">
                                Faltan {symbol}{formatAmount(Math.max(0, Math.round(remaining)).toString())}
                              </span>
                            </div>
                            <DepositButton
                              goalId={goal.id}
                              colorTheme={colorTheme}
                              symbol={symbol}
                              formatAmount={formatAmount}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>

          {/* Completed goals */}
          {completed.length > 0 && (
            <motion.div variants={fadeUp} className="rounded-2xl bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-emerald-800 mb-3">
                ✅ Completadas ({completed.length})
              </p>
              <div className="space-y-2">
                {completed.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5">
                    <span className="text-lg">{goal.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{goal.name}</p>
                      <p className="text-[11px] text-emerald-600 font-medium tabular-nums">
                        {symbol}{formatAmount(goal.targetAmount)} ahorrado
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar meta completada?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Se eliminará <strong>{goal.name}</strong> del historial.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteGoal(goal.id, { onSuccess: () => toast.success("Eliminada") })}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
