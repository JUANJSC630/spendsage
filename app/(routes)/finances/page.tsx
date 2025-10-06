import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { Navbar } from "./components/Navbar/Navbar";
import { FinancesPageClient } from "./components/FinancesPageClient";

export default async function FinancesPage() {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const data = await db.transactions.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col w-full h-full">
      <FinancesPageClient transactions={data} />
    </div>
  );
}
