"use client";
import axios from "axios";
import { 
  Trash2, 
  Edit3, 
  Archive, 
  ArchiveRestore,
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
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

type CategoryType = "income" | "expense" | "transfer" | "other";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  type: CategoryType;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryListProps {
  categories: Category[];
  showInactive?: boolean;
}

const iconComponents = {
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
};

const typeLabels: Record<string, string> = {
  expense: "Gasto",
  income: "Ingreso",
  transfer: "Transferencia", 
  other: "Otro",
};

const typeColors: Record<string, string> = {
  expense: "bg-red-100 text-red-800",
  income: "bg-green-100 text-green-800",
  transfer: "bg-blue-100 text-blue-800",
  other: "bg-gray-100 text-gray-800",
};

export function CategoryList({ categories, showInactive = false }: CategoryListProps) {
  const router = useRouter();
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setDeletingCategoryId(categoryId);
      await axios.delete(`/api/categories/${categoryId}`);
      toast.success(showInactive ? "Categoría eliminada permanentemente" : "Categoría archivada correctamente");
      router.refresh();
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error("No se pueden eliminar las categorías por defecto del sistema");
      } else if (error.response?.status === 400) {
        toast.error("No se puede eliminar esta categoría porque está siendo utilizada");
      } else {
        toast.error("Error al procesar la categoría");
      }
      console.error("Error deleting category:", error);
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleRestoreCategory = async (categoryId: string) => {
    try {
      await axios.patch(`/api/categories/${categoryId}`, {
        isActive: true
      });
      toast.success("Categoría restaurada correctamente");
      router.refresh();
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error("No se pueden modificar las categorías por defecto del sistema");
      } else {
        toast.error("Error al restaurar la categoría");
      }
      console.error("Error restoring category:", error);
    }
  };

  const title = showInactive ? "Categorías Archivadas" : "Mis Categorías";
  const emptyMessage = showInactive 
    ? "No hay categorías archivadas" 
    : "No tienes categorías creadas";
  const emptyDescription = showInactive
    ? "Las categorías archivadas aparecerán aquí"
    : "Crea tu primera categoría usando el formulario";

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          <Archive className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>{emptyMessage}</p>
          <p className="text-sm">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.type !== b.type) {
      const typeOrder = { income: 0, expense: 1, transfer: 2, other: 3 };
      return typeOrder[a.type] - typeOrder[b.type];
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showInactive && (
          <Badge variant="secondary" className="bg-gray-100">
            {categories.length} archivadas
          </Badge>
        )}
      </div>
      
      <div className="space-y-2 sm:space-y-3 max-h-[500px] overflow-y-auto pb-2">
        {sortedCategories.map((category) => {
          const IconComponent = iconComponents[category.icon as keyof typeof iconComponents] || Folder;
          
          return (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      <IconComponent 
                        className="h-4 w-4 sm:h-5 sm:w-5" 
                        style={{ color: category.color }} 
                      />
                    </div>                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                        <h3 className="font-medium text-base sm:text-lg truncate">{category.name}</h3>
                        <Badge className={`text-xs ${typeColors[category.type] || typeColors.other}`}>
                          {typeLabels[category.type] || category.type}
                        </Badge>
                        {category.isDefault && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            Por defecto
                          </Badge>
                        )}
                        {showInactive && (
                          <Badge variant="outline" className="bg-gray-50 text-xs">
                            Archivada
                          </Badge>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{category.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2 ml-1">
                    {showInactive && !category.isDefault ? (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleRestoreCategory(category.id)}
                      >
                        <ArchiveRestore className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    ) : null}

                    {!category.isDefault && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingCategoryId === category.id}
                          >
                            {showInactive ? <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Archive className="h-3 w-3 sm:h-4 sm:w-4" />}
                          </Button>
                        </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {showInactive ? "¿Eliminar categoría permanentemente?" : "¿Archivar categoría?"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {showInactive ? (
                              <>
                                Esta acción eliminará permanentemente la categoría{" "}
                                <strong>{category.name}</strong>. Esta acción no se puede deshacer.
                              </>
                            ) : (
                              <>
                                Esta acción archivará la categoría{" "}
                                <strong>{category.name}</strong>. Podrás restaurarla más tarde si es necesario.
                              </>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {showInactive ? "Eliminar" : "Archivar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    )}

                    {category.isDefault && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Categoría del sistema</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}