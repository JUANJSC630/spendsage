import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { Navbar } from "./components/Navbar/Navbar";
import { FinancesPageClient } from "./components/FinancesPageClient";
import { getActiveCategories } from "@/lib/categoryQueries";

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

  // Load categories for mapping
  const categories = await getActiveCategories(userId);

  return (
    <div className="flex flex-col w-full h-full">
      <FinancesPageClient transactions={data} categories={categories} />
    </div>
  );
}
