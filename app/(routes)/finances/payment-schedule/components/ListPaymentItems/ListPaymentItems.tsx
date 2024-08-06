import { db } from "@/lib/db";
import { ListPaymentItemsProps } from "./ListPaymentItemsProps.types";
import PaymentScheduleItem from "../PaymentScheduleItem/PaymentScheduleItem";

export default async function ListPaymentItems(props: ListPaymentItemsProps) {
  const { paymentSchedule } = props;

  const items = await db.paymentItem.findMany({
    where: {
      paymentScheduleId: paymentSchedule.id,
    },
    orderBy: {
      check: "asc",
    },
  });

  // Calcular el total pagado basado en el estado de "check"
  const totalPaid = items.reduce((total, item) => {
    // Eliminar los puntos de la cadena antes de convertirla a número
    const amount = parseFloat(item.amount.replace(/\./g, ""));
    // Si el item está marcado como pagado, sumar el monto al total
    return item.check ? total + amount : 0;
  }, 0);

  // Calcular el total de lo que falta por pagar (solo los ítems no marcados)
  const totalPending = items.reduce((total, item) => {
    // Eliminar los puntos de la cadena antes de convertirla a número
    const amount = parseFloat(item.amount.replace(/\./g, ""));
    return !item.check ? total + amount : total;
  }, 0);

  // Formatear el total pagado como moneda
  const formattedTotalPaid = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(totalPaid);

  // Formatear el total pendiente como moneda
  const formattedTotalPending = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(totalPending);

  console.log(items);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 overscroll-y-contain overflow-auto max-h-[350px]">
        {items.map((paymentItem) => (
          <PaymentScheduleItem
            paymentItem={paymentItem}
            paymentSchedule={paymentSchedule}
            key={paymentItem.id}
          />
        ))}
      </div>
      <p className="font-bold text-lg">Total paid: {formattedTotalPaid}</p>
      <p className="font-bold text-lg">Total debt: {formattedTotalPending}</p>
    </div>
  );
}
