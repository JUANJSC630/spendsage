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
    <div className="flex flex-col pb-8">
      <Navbar />
      <div className="container mx-auto px-8 flex-1 ">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((paymentSchedule) => (
            <CardPaymentSchedule
              paymentSchedule={paymentSchedule}
              key={paymentSchedule.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
