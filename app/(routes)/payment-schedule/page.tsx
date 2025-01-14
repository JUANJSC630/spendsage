import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { Navbar } from "./components/Navbar";
import { CardPaymentSchedule } from "./components/CardPaymentSchedule/CardPaymentSchedule";

export default async function PaymentSchedulePage() {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const data = await db.paymentSchedule.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col py-8">
      <Navbar />
      <div className="container mx-auto px-8 flex-1 ">
        <div className="w-full grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {data.map((paymentSchedule) => (
            <CardPaymentSchedule
              paymentSchedule={paymentSchedule}
              key={paymentSchedule.id}
            />
          ))}

          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-400">No payment schedules yet....</h1>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
