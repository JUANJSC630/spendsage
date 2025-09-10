"use client";
import { Tags } from "lucide-react";
import React from "react";

export function CategoryNavbar() {
  return (
    <div className="py-3 px-6 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Gestión de Categorías</h1>
        </div>
        
        <div className="text-xs text-gray-600">
          Personaliza las categorías para tus transacciones y presupuestos
        </div>
      </div>
    </div>
  );
}