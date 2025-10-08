"use client";
import { Tags } from "lucide-react";
import React from "react";

export function CategoryNavbar() {
  return (
    <div className="py-2 sm:py-3 px-3 sm:px-6 border-b">
      <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
        <div className="flex items-center gap-2">
          <Tags className="text-blue-600" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Gestión de Categorías</h1>
        </div>
        
        <div className="text-xs text-gray-600 max-w-[220px] sm:max-w-none">
          Personaliza las categorías para tus transacciones y presupuestos
        </div>
      </div>
    </div>
  );
}