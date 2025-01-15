import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link"; // Importar Link para la navegación
import { ButtonAddListPaymentSchedule } from "./components/ButtonAddListPaymentSchedule";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import CardList from "./components/CardList";

export default async function ListPaymentSchedulePage() {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const data = await db.listPaymentSchedule.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="flex flex-col py-8">
      <div className="bg-background py-4 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-end md:items-center justify-end gap-2 md:gap-8">
          <ButtonAddListPaymentSchedule />
        </div>
      </div>

      <div className="container flex-wrap flex flex-row justify-center gap-8">
        {data.map((listPaymentSchedule) => (
          <Link
            key={listPaymentSchedule.id}
            href={`/list-payment-schedule/${listPaymentSchedule.id}`}
          >
            <CardList listPaymentScheduleName={listPaymentSchedule.name} />
          </Link>
        ))}

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-400">
              No payment schedules yet....
            </h1>
          </div>
        ) : null}
      </div>
    </div>
  );
}
