"use client";

import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import React from "react";
import { PaymentItem } from "@prisma/client";

interface PaymentTotalsProps {
  items: PaymentItem[];
}

export function PaymentTotals(props: PaymentTotalsProps) {
  const { items } = props;
  const { currency } = useCurrencyStore(); // Obtener el estado de la moneda

  // Calcular el total pagado basado en el estado de "check"
  const totalPaid = items.reduce((total, item) => {
    const amount = parseFloat(item.amount.replace(/\./g, ""));
    return item.check ? total + amount : total;
  }, 0);

  // Calcular el total de lo que falta por pagar (solo los ítems no marcados)
  const totalPending = items.reduce((total, item) => {
    const amount = parseFloat(item.amount.replace(/\./g, ""));
    return !item.check ? total + amount : total;
  }, 0);

  // Formatear el total pagado y pendiente como moneda según la moneda seleccionada
  const formattedTotalPaid = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(totalPaid);

  const formattedTotalPending = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(totalPending);

  return (
    <div>
      <p className="font-bold text-lg">Total paid: {formattedTotalPaid}</p>
      <p className="font-bold text-lg">Total debt: {formattedTotalPending}</p>
    </div>
  );
}
