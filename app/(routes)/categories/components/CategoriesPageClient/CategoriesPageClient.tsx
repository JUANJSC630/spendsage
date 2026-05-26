"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAllCategories, useSeedDefaultCategories } from "@/hooks/use-categories";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { CategoryForm } from "../CategoryForm/CategoryForm";
import { CategoryList } from "../CategoryList/CategoryList";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function CategoriesPageClient() {
  const { data: categories = [], isLoading } = useAllCategories();
  const { mutate: seedCategories, isPending: isSeeding } = useSeedDefaultCategories();
  const { colorTheme } = useSyncColorTheme();

  const { activeCount, archivedCount, userCategoryCount } = useMemo(() => {
    return {
      activeCount: categories.filter((c) => c.isActive).length,
      archivedCount: categories.filter((c) => !c.isActive).length,
      userCategoryCount: categories.filter((c) => c.userId).length,
    };
  }, [categories]);

  const handleSeed = () => {
    seedCategories(undefined, {
      onSuccess: ({ created }) => {
        if (created === 0) {
          toast("Ya tienes todas las categorías sugeridas", { icon: "✓" });
        } else {
          toast.success(`${created} categorías agregadas`);
        }
      },
      onError: () => toast.error("Error al agregar categorías"),
    });
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] w-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Categorías
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {activeCount} activas · {archivedCount} archivadas
          </p>
        </div>
        {userCategoryCount < 5 && (
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-semibold flex-shrink-0 disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: colorTheme }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isSeeding ? "Agregando..." : "Setup rápido"}
          </button>
        )}
      </motion.div>

      {/* Quick setup banner — shown when user has few/no custom categories */}
      {userCategoryCount < 3 && !isLoading && (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl px-4 py-3.5 mb-6 flex items-center justify-between gap-4"
          style={{ backgroundColor: `${colorTheme}12`, borderLeft: `3px solid ${colorTheme}` }}
        >
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Empieza con categorías listas para usar
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              18 categorías pre-configuradas: freelance, suscripciones, hogar, herramientas de trabajo y más.
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold flex-shrink-0 disabled:opacity-50"
            style={{ backgroundColor: colorTheme }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isSeeding ? "Cargando..." : "Importar"}
          </button>
        </motion.div>
      )}

      {/* Form + List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div variants={fadeUp}>
          <CategoryForm />
        </motion.div>
        <motion.div variants={fadeUp}>
          <CategoryList categories={categories} isLoading={isLoading} />
        </motion.div>
      </div>
    </motion.div>
  );
}
