"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import {
  Folder,
  Home,
  Car,
  ShoppingCart,
  Coffee,
  Gamepad2,
  Heart,
  GraduationCap,
  Plane,
  Shirt,
  Smartphone,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateCategory } from "@/hooks/use-categories";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { categoryFormSchema } from "./CategoryForm.form";

const CATEGORY_TYPES = [
  { value: "expense", label: "Gasto" },
  { value: "income", label: "Ingreso" },
  { value: "transfer", label: "Transferencia" },
  { value: "other", label: "Otro" },
] as const;

const ICON_OPTIONS = [
  { value: "Folder", icon: Folder },
  { value: "Home", icon: Home },
  { value: "Car", icon: Car },
  { value: "ShoppingCart", icon: ShoppingCart },
  { value: "Coffee", icon: Coffee },
  { value: "Gamepad2", icon: Gamepad2 },
  { value: "Heart", icon: Heart },
  { value: "GraduationCap", icon: GraduationCap },
  { value: "Plane", icon: Plane },
  { value: "Shirt", icon: Shirt },
  { value: "Smartphone", icon: Smartphone },
  { value: "DollarSign", icon: DollarSign },
] as const;

const COLOR_OPTIONS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#F97316",
  "#06B6D4",
  "#84CC16",
  "#EC4899",
  "#6B7280",
] as const;

const TYPE_STYLE: Record<string, { active: string; inactive: string }> = {
  expense: {
    active: "bg-red-500 text-white",
    inactive: "bg-white text-slate-500 hover:bg-red-50 hover:text-red-600",
  },
  income: {
    active: "bg-emerald-500 text-white",
    inactive:
      "bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-600",
  },
  transfer: {
    active: "bg-blue-500 text-white",
    inactive: "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600",
  },
  other: {
    active: "bg-slate-500 text-white",
    inactive: "bg-white text-slate-500 hover:bg-slate-100",
  },
};

export function CategoryForm() {
  const { colorTheme } = useSyncColorTheme();
  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3B82F6",
      icon: "Folder",
      type: "expense",
    },
  });

  const selectedColor = form.watch("color");
  const selectedIcon = form.watch("icon");
  const selectedType = form.watch("type");

  const onSubmit = async (values: z.infer<typeof categoryFormSchema>) => {
    try {
      await createCategory(values);
      toast.success("Categoría creada");
      form.reset({
        name: "",
        description: "",
        color: "#3B82F6",
        icon: "Folder",
        type: "expense",
      });
    } catch (err: unknown) {
      const e = err as { status?: number };
      if (e?.status === 400) {
        toast.error("Ya existe una categoría con ese nombre");
      } else {
        toast.error("Error al crear la categoría");
      }
    }
  };

  return (
    <div className="rounded-2xl bg-slate-50 p-6 h-full">
      <p className="text-sm font-semibold text-slate-800 mb-5">
        Nueva categoría
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-500 font-medium">
                  Nombre
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white border-slate-200"
                    placeholder="Ej: Alimentación, Transporte..."
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
                  Descripción{" "}
                  <span className="text-slate-300 font-normal">· opcional</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="bg-white border-slate-200 resize-none"
                    placeholder="Describe esta categoría..."
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type pills */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-500 font-medium">
                  Tipo
                </FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_TYPES.map((t) => {
                      const isActive = field.value === t.value;
                      const styles = TYPE_STYLE[t.value];
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => field.onChange(t.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                            isActive ? styles.active : styles.inactive
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Icon grid */}
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-500 font-medium">
                  Ícono
                </FormLabel>
                <FormControl>
                  <div className="grid grid-cols-6 gap-1.5">
                    {ICON_OPTIONS.map(({ value, icon: Icon }) => {
                      const isActive = field.value === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => field.onChange(value)}
                          className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-150 ${
                            isActive
                              ? "bg-white shadow-sm"
                              : "bg-white hover:bg-slate-100"
                          }`}
                          style={
                            isActive
                              ? {
                                  boxShadow: `0 0 0 2px ${selectedColor}`,
                                }
                              : {}
                          }
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{
                              color: isActive ? selectedColor : "#94a3b8",
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color circles */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-500 font-medium">
                  Color
                </FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_OPTIONS.map((color, i) => {
                      const isActive = field.value === color;
                      return (
                        <motion.button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.88 }}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: i * 0.03,
                            type: "spring",
                            stiffness: 320,
                            damping: 22,
                          }}
                          className="relative h-8 w-8 rounded-full focus-visible:outline-none"
                          style={{
                            backgroundColor: color,
                            boxShadow: isActive
                              ? `0 0 0 2.5px white, 0 0 0 4.5px ${color}`
                              : "0 1px 3px rgba(0,0,0,0.12)",
                          }}
                        >
                          <AnimatePresence>
                            {isActive && (
                              <motion.span
                                key="check"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 20,
                                }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <Check
                                  className="w-3.5 h-3.5 text-white"
                                  strokeWidth={3}
                                  style={{
                                    filter:
                                      "drop-shadow(0 1px 1px rgba(0,0,0,0.2))",
                                  }}
                                />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      );
                    })}
                  </div>
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
            {isPending ? "Guardando..." : "Crear categoría"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
