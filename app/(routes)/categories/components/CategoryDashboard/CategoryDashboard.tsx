"use client";
import React from "react";
import { Tags, TrendingUp, Archive, DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  type: string;
  isActive: boolean;
}

interface CategoryDashboardProps {
  categories: Category[];
  inactiveCount: number;
}

export function CategoryDashboard({ categories, inactiveCount }: CategoryDashboardProps) {
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const otherCategories = categories.filter(cat => !['expense', 'income'].includes(cat.type));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        <Card className="shadow-sm bg-white border">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-3 sm:px-4">
            <CardTitle className="text-xs font-medium text-gray-600">Total Categorías</CardTitle>
            <Tags className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="py-1 sm:py-2 px-3 sm:px-4">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-xs text-muted-foreground">
              Categorías activas
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white border">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-3 sm:px-4">
            <CardTitle className="text-xs font-medium text-gray-600">Gastos</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="py-1 sm:py-2 px-3 sm:px-4">
            <div className="text-2xl font-bold text-red-600">{expenseCategories.length}</div>
            <div className="text-xs text-muted-foreground">
              Categorías de gastos
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white border">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-3 sm:px-4">
            <CardTitle className="text-xs font-medium text-gray-600">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="py-1 sm:py-2 px-3 sm:px-4">
            <div className="text-2xl font-bold text-green-600">{incomeCategories.length}</div>
            <div className="text-xs text-muted-foreground">
              Categorías de ingresos
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white border">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-3 sm:px-4">
            <CardTitle className="text-xs font-medium text-gray-600">Archivadas</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-1 sm:py-2 px-3 sm:px-4">
            <div className="text-2xl font-bold text-gray-600">{inactiveCount}</div>
            <div className="text-xs text-muted-foreground">
              Categorías inactivas
            </div>
          </CardContent>
        </Card>
      </div>

      {categories.length === 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex flex-col items-center justify-center py-6 text-center">
            <Tags className="h-12 w-12 text-blue-400 mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-1">
              ¡Bienvenido al Gestor de Categorías!
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Personaliza tus finanzas creando categorías únicas para tus transacciones y presupuestos.
            </p>
            <div className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
              💡 Usa el formulario de la izquierda para crear tu primera categoría
            </div>
          </CardContent>
        </Card>
      )}

      {categories.length > 0 && (
        <div className="grid md:grid-cols-3 gap-3">
          {expenseCategories.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="py-2 px-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  Categorías de Gastos
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-1.5">
                  {expenseCategories.slice(0, 4).map((category) => (
                    <div key={category.id} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs">{category.name}</span>
                    </div>
                  ))}
                  {expenseCategories.length > 4 && (
                    <div className="text-xs text-gray-500">
                      +{expenseCategories.length - 4} más...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {incomeCategories.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="py-2 px-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Categorías de Ingresos
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-1.5">
                  {incomeCategories.slice(0, 4).map((category) => (
                    <div key={category.id} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs">{category.name}</span>
                    </div>
                  ))}
                  {incomeCategories.length > 4 && (
                    <div className="text-xs text-gray-500">
                      +{incomeCategories.length - 4} más...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {otherCategories.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="py-2 px-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Tags className="h-4 w-4 text-blue-500" />
                  Otras Categorías
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-1.5">
                  {otherCategories.slice(0, 4).map((category) => (
                    <div key={category.id} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs">{category.name}</span>
                    </div>
                  ))}
                  {otherCategories.length > 4 && (
                    <div className="text-xs text-gray-500">
                      +{otherCategories.length - 4} más...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}