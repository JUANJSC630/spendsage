"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MobileDatePicker, MobileDateRangePicker } from "@/components/ui/react-datepicker";

export default function DatePickerExamplePage() {
  // State for single date picker
  const [date, setDate] = useState<Date | null>(new Date());
  
  // State for date range picker
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: new Date(),
    to: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to 1 month range
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mobile-Friendly Date Pickers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-medium mb-4">Single Date Picker</h2>
          <p className="text-sm text-gray-500 mb-4">
            Este componente funciona mejor en dispositivos móviles que el DatePicker actual.
          </p>
          <div className="max-w-sm">
            <MobileDatePicker 
              date={date} 
              onDateChange={(newDate) => setDate(newDate)} 
            />
          </div>
          {date && (
            <p className="mt-4 text-sm">
              Fecha seleccionada: {date.toLocaleDateString()}
            </p>
          )}
        </Card>
        
        <Card className="p-4">
          <h2 className="text-xl font-medium mb-4">Date Range Picker</h2>
          <p className="text-sm text-gray-500 mb-4">
            Este componente de rango funciona mejor en dispositivos móviles que el DateRangePicker actual.
          </p>
          <div className="max-w-sm">
            <MobileDateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
          {dateRange.from && dateRange.to && (
            <p className="mt-4 text-sm">
              Rango seleccionado: {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
            </p>
          )}
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">Ventajas:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Funciona bien en dispositivos móviles con el modo portal</li>
          <li>Es altamente personalizable y mantiene el estilo visual actual</li>
          <li>Tiene soporte robusto para selección de fechas y rangos</li>
          <li>Incluye navegación por mes/año para mejor experiencia de usuario</li>
        </ul>
      </div>
    </div>
  );
}