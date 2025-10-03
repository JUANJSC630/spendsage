"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
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
  DollarSign
} from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

import { categoryFormSchema } from "./CategoryForm.form";

const categoryTypes = [
  { value: "expense", label: "Gasto" },
  { value: "income", label: "Ingreso" },
  { value: "transfer", label: "Transferencia" },
  { value: "other", label: "Otro" },
];

const iconOptions = [
  { value: "Folder", label: "Carpeta", icon: Folder },
  { value: "Home", label: "Casa", icon: Home },
  { value: "Car", label: "Transporte", icon: Car },
  { value: "ShoppingCart", label: "Compras", icon: ShoppingCart },
  { value: "Coffee", label: "Comida", icon: Coffee },
  { value: "Gamepad2", label: "Entretenimiento", icon: Gamepad2 },
  { value: "Heart", label: "Salud", icon: Heart },
  { value: "GraduationCap", label: "Educación", icon: GraduationCap },
  { value: "Plane", label: "Viajes", icon: Plane },
  { value: "Shirt", label: "Ropa", icon: Shirt },
  { value: "Smartphone", label: "Tecnología", icon: Smartphone },
  { value: "DollarSign", label: "Dinero", icon: DollarSign },
];

const colorOptions = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6B7280", // Gray
];

function CategoryForm() {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [selectedIcon, setSelectedIcon] = useState("Folder");

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

  const onSubmit = async (values: z.infer<typeof categoryFormSchema>) => {
    try {
      await axios.post(`/api/categories`, values);
      toast.success("¡Categoría creada! 🎯");
      form.reset();
      setSelectedColor("#3B82F6");
      setSelectedIcon("Folder");
      router.refresh();
    } catch (error) {
      console.error("Error creating category:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Ya existe una categoría con ese nombre");
        } else if (error.response?.status === 500) {
          toast.error("Error del servidor. ¿Necesitas reiniciar el servidor de desarrollo?");
        } else {
          toast.error("Error de conexión. Verifica tu conexión a internet.");
        }
      } else {
        toast.error("Error inesperado. Revisa la consola para más detalles.");
      }
    }
  };

  const { isValid } = form.formState;

  const SelectedIconComponent = iconOptions.find(icon => icon.value === selectedIcon)?.icon || Folder;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Crear Categoría</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Alimentación, Transporte..." />
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
                  <FormLabel>Descripción (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe brevemente esta categoría..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Categoría</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícono</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedIcon(value);
                      }} 
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un ícono">
                          <div className="flex items-center gap-2">
                            <SelectedIconComponent className="h-4 w-4" />
                            <span>{iconOptions.find(icon => icon.value === selectedIcon)?.label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => {
                          const IconComponent = icon.icon;
                          return (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                <span>{icon.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <Input 
                          {...field} 
                          type="text"
                          placeholder="#3B82F6"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setSelectedColor(e.target.value);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                              selectedColor === color ? 'border-gray-900' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              field.onChange(color);
                              setSelectedColor(color);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button
            type="submit"
            className={`w-full mt-8 ${
              !isValid ? "opacity-50" : "opacity-100"
            }`}
            disabled={!isValid}
          >
            Crear Categoría
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { CategoryForm };