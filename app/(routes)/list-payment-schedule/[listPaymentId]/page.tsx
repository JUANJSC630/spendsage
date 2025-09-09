import { db } from "@/lib/db";
import { ButtonAddPaymentSchedule } from "../components/ButtonAddPaymentSchedule/ButtonAddPaymentSchedule";
import { CardPaymentSchedule } from "../components/CardPaymentSchedule";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // Importar un icono de Lucide (puedes usar otro)

export default async function PaymentSchedulePage({
  params,
}: {
  params: { listPaymentId: string };
}) {
  const listPaymentSchedule = await db.listPaymentSchedule.findUnique({
    where: { id: params.listPaymentId },
    include: {
      paymentSchedules: true,
    },
  });

  if (!listPaymentSchedule) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-400">
          Listas de pagos no encontrado.
        </h1>
      </div>
    );
  }

  console.log(
    listPaymentSchedule.paymentSchedules.map(
      (paymentSchedule) => paymentSchedule.name
    )
  );

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-8">
      <h1 className="text-3xl font-bold mb-4">{listPaymentSchedule.name}</h1>

      <div className="w-full flex flex-col md:flex-row items-end md:items-center justify-between gap-2 md:gap-8">
        {/* Botón de retroceso */}
        <Link href="/list-payment-schedule">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
        </Link>

        <ButtonAddPaymentSchedule
          listPaymentScheduleId={listPaymentSchedule.id}
        />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {listPaymentSchedule.paymentSchedules.length > 0 ? (
          listPaymentSchedule.paymentSchedules.map((paymentSchedule) => (
            <CardPaymentSchedule
              key={paymentSchedule.id}
              paymentSchedule={paymentSchedule}
            />
          ))
        ) : (
          <p className="text-gray-400">No se encontraron listas de pagos.</p>
        )}
      </div>
    </div>
  );
}
