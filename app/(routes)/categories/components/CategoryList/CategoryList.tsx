"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArchiveRestore, Archive } from "lucide-react";
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
import toast from "react-hot-toast";
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
import {
  Category,
  useDeleteCategory,
  useRestoreCategory,
} from "@/hooks/use-categories";

const iconComponents: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
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

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  expense: { label: "Gasto", className: "bg-red-50 text-red-600" },
  income: { label: "Ingreso", className: "bg-emerald-50 text-emerald-600" },
  transfer: { label: "Transferencia", className: "bg-blue-50 text-blue-600" },
  other: { label: "Otro", className: "bg-slate-100 text-slate-500" },
};

interface CategoryListProps {
  categories: Category[];
  isLoading?: boolean;
}

type Tab = "active" | "archived";

function CategoryItem({
  category,
  isArchived,
}: {
  category: Category;
  isArchived: boolean;
}) {
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const { mutate: restoreCategory, isPending: isRestoring } =
    useRestoreCategory();

  const IconComponent = iconComponents[category.icon] || Folder;
  const typeBadge = TYPE_BADGE[category.type] || TYPE_BADGE.other;

  const handleDelete = () => {
    deleteCategory(category.id, {
      onSuccess: (data) => {
        const wasArchived = !data.isActive === false;
        toast.success(
          wasArchived
            ? "Categoría archivada"
            : isArchived
              ? "Categoría eliminada"
              : "Categoría archivada",
        );
      },
      onError: (err: unknown) => {
        const e = err as { status?: number };
        if (e?.status === 403) {
          toast.error("No se pueden modificar las categorías del sistema");
        } else {
          toast.error("Error al procesar la categoría");
        }
      },
    });
  };

  const handleRestore = () => {
    restoreCategory(category.id, {
      onSuccess: () => toast.success("Categoría restaurada"),
      onError: (err: unknown) => {
        const e = err as { status?: number };
        if (e?.status === 403) {
          toast.error("No se pueden modificar las categorías del sistema");
        } else {
          toast.error("Error al restaurar la categoría");
        }
      },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
      className="group flex items-center gap-3 bg-white rounded-xl px-4 py-3 hover:shadow-sm transition-shadow duration-200"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: category.color + "20" }}
      >
        <IconComponent className="w-4 h-4" style={{ color: category.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-slate-800 truncate">
            {category.name}
          </span>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeBadge.className}`}
          >
            {typeBadge.label}
          </span>
          {category.isDefault && (
            <span className="text-[10px] text-slate-400">· Sistema</span>
          )}
        </div>
        {category.description && (
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {category.description}
          </p>
        )}
      </div>

      {!category.isDefault && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
          {isArchived && (
            <button
              onClick={handleRestore}
              disabled={isRestoring}
              className="p-1.5 rounded-lg text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-40"
              aria-label="Restaurar categoría"
            >
              <ArchiveRestore className="w-3.5 h-3.5" />
            </button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={isDeleting}
                className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
                aria-label={
                  isArchived ? "Eliminar categoría" : "Archivar categoría"
                }
              >
                {isArchived ? (
                  <Trash2 className="w-3.5 h-3.5" />
                ) : (
                  <Archive className="w-3.5 h-3.5" />
                )}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isArchived
                    ? "¿Eliminar permanentemente?"
                    : "¿Archivar categoría?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isArchived ? (
                    <>
                      Esto eliminará permanentemente{" "}
                      <strong>{category.name}</strong>. Esta acción no se puede
                      deshacer.
                    </>
                  ) : (
                    <>
                      La categoría <strong>{category.name}</strong> se
                      archivará. Podrás restaurarla en la pestaña Archivadas.
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isArchived ? "Eliminar" : "Archivar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </motion.div>
  );
}

export function CategoryList({ categories, isLoading }: CategoryListProps) {
  const [tab, setTab] = useState<Tab>("active");

  const { active, archived } = useMemo(() => {
    const sorted = [...categories].sort((a, b) => {
      const typeOrder: Record<string, number> = {
        income: 0,
        expense: 1,
        transfer: 2,
        other: 3,
      };
      if (a.type !== b.type) {
        return (typeOrder[a.type] ?? 4) - (typeOrder[b.type] ?? 4);
      }
      return a.name.localeCompare(b.name);
    });
    return {
      active: sorted.filter((c) => c.isActive),
      archived: sorted.filter((c) => !c.isActive),
    };
  }, [categories]);

  const displayed = tab === "active" ? active : archived;

  return (
    <div className="rounded-2xl bg-slate-50 p-6 h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 mb-5 w-fit">
        {(["active", "archived"] as Tab[]).map((t) => {
          const count = t === "active" ? active.length : archived.length;
          const label = t === "active" ? "Activas" : "Archivadas";
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                tab === t
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
              <span
                className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                  tab === t
                    ? "bg-slate-100 text-slate-600"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-slate-100 rounded-xl animate-pulse"
              style={{ opacity: 1 - i * 0.2 }}
            />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            {tab === "active" ? (
              <Folder className="w-4 h-4 text-slate-300" />
            ) : (
              <Archive className="w-4 h-4 text-slate-300" />
            )}
          </div>
          <p className="text-sm font-medium text-slate-500">
            {tab === "active" ? "Sin categorías" : "Sin archivadas"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {tab === "active"
              ? "Crea tu primera categoría con el formulario"
              : "Las categorías archivadas aparecen aquí"}
          </p>
        </div>
      ) : (
        <motion.div
          className="flex flex-col gap-2 overflow-auto max-h-[440px] pr-0.5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          <AnimatePresence initial={false}>
            {displayed.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                isArchived={tab === "archived"}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
