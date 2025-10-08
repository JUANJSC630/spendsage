"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MobileDatePicker, MobileDateRangePicker } from "@/components/ui/react-datepicker";
import { AdaptiveDatePicker } from "@/components/ui/adaptive-date-picker";
import { AdaptiveDateRangePicker } from "@/components/ui/adaptive-date-range-picker";
import useIsMobile from "@/hooks/useIsMobile";

export default function CompareDatePickersPage() {
  // Estado para single date picker
  const [date, setDate] = useState<Date | null>(new Date());
  
  // Estado para date range picker
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: new Date(),
    to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  });
  
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Comparación de Date Pickers</h1>
      
      <div className="bg-yellow-100 p-4 rounded-md mb-8 border border-yellow-300">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Estado de Dispositivo</h2>
        <p className="text-yellow-700">
          Estás usando un dispositivo {isMobile ? "móvil" : "de escritorio"}
        </p>
        <p className="text-yellow-700 mt-2 text-sm">
          Los componentes adaptativos mostrarán automáticamente la versión apropiada según tu dispositivo.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Date Pickers simples */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Date Pickers Individuales</h2>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Original (Shadcn/Radix)</h3>
            <p className="text-sm text-gray-500 mb-4">
              El DatePicker actual que puede no funcionar bien en móviles
            </p>
            <DatePicker 
              date={date} 
              onDateChange={setDate} 
              placeholder="Selecciona una fecha"
            />
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Mobile-Friendly (react-datepicker)</h3>
            <p className="text-sm text-gray-500 mb-4">
              Versión optimizada para móviles
            </p>
            <MobileDatePicker 
              date={date} 
              onDateChange={setDate} 
              placeholder="Selecciona una fecha"
            />
          </Card>
          
          <Card className="p-4 border-2 border-green-300">
            <h3 className="text-lg font-semibold mb-3 text-green-700">Adaptativo (Recomendado)</h3>
            <p className="text-sm text-gray-500 mb-4">
              Detecta automáticamente si es móvil y muestra el componente adecuado
            </p>
            <AdaptiveDatePicker 
              date={date} 
              onDateChange={setDate} 
              placeholder="Selecciona una fecha"
            />
          </Card>
        </div>
        
        {/* Date Range Pickers */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Date Range Pickers</h2>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Original (Shadcn/Radix)</h3>
            <p className="text-sm text-gray-500 mb-4">
              El DateRangePicker actual que puede no funcionar bien en móviles
            </p>
            <DateRangePicker 
              date={dateRange} 
              onDateChange={setDateRange}
              placeholder="Selecciona rango de fechas"
            />
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Mobile-Friendly (react-datepicker)</h3>
            <p className="text-sm text-gray-500 mb-4">
              Versión optimizada para móviles
            </p>
            <MobileDateRangePicker 
              dateRange={dateRange} 
              onDateRangeChange={setDateRange}
              placeholder="Selecciona rango de fechas"
            />
          </Card>
          
          <Card className="p-4 border-2 border-green-300">
            <h3 className="text-lg font-semibold mb-3 text-green-700">Adaptativo (Recomendado)</h3>
            <p className="text-sm text-gray-500 mb-4">
              Detecta automáticamente si es móvil y muestra el componente adecuado
            </p>
            <AdaptiveDateRangePicker 
              dateRange={dateRange} 
              onDateRangeChange={setDateRange}
              placeholder="Selecciona rango de fechas"
            />
          </Card>
        </div>
      </div>
      
      <div className="mt-12 p-6 border rounded-md bg-blue-50">
        <h2 className="text-xl font-bold mb-4">Plan de Migración Recomendado</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Reemplazar todas las importaciones de <code className="bg-gray-100 px-2 py-0.5 rounded">DatePicker</code> por <code className="bg-gray-100 px-2 py-0.5 rounded">AdaptiveDatePicker</code></li>
          <li>Reemplazar todas las importaciones de <code className="bg-gray-100 px-2 py-0.5 rounded">DateRangePicker</code> por <code className="bg-gray-100 px-2 py-0.5 rounded">AdaptiveDateRangePicker</code></li>
          <li>Probar en dispositivos móviles y asegurarse de que todo funcione correctamente</li>
          <li>Para casos específicos donde la solución adaptativa no sea suficiente, utilizar directamente los componentes <code className="bg-gray-100 px-2 py-0.5 rounded">MobileDatePicker</code> o <code className="bg-gray-100 px-2 py-0.5 rounded">MobileDateRangePicker</code></li>
        </ol>
      </div>
    </div>
  );
}