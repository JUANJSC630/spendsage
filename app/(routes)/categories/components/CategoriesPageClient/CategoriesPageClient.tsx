"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAllCategories } from "@/hooks/use-categories";
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

  const { activeCount, archivedCount } = useMemo(() => {
    return {
      activeCount: categories.filter((c) => c.isActive).length,
      archivedCount: categories.filter((c) => !c.isActive).length,
    };
  }, [categories]);

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] w-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Categorías
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {activeCount} activas · {archivedCount} archivadas
        </p>
      </motion.div>

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
