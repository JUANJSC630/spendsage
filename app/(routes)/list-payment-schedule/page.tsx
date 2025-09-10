import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ButtonAddListPaymentSchedule } from "./components/ButtonAddListPaymentSchedule";
import { ListPaymentScheduleClient } from "./components/ListPaymentScheduleClient";
import { FilterYear } from "./components/FilterYear";
import { YearProvider } from "./components/YearContext";
import { Content } from "./components/Content";

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
      <YearProvider data={data}>
        {/* Header con filtro y botón */}
        <div className="bg-background py-4 px-6 mb-6">
          <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2 md:gap-8">
            <h1 className="text-2xl font-bold">Listas de Pagos</h1>
            <div className="flex flex-wrap w-full sm:w-auto items-center gap-2 sm:gap-4">
              <FilterYear data={data} />
              <ButtonAddListPaymentSchedule />
            </div>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="container mx-auto">
          <Content data={data} />
        </div>
      </YearProvider>
    </div>
  );
}
