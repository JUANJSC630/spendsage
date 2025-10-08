import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { DashboardClient } from "./components/DashboardClient";
import { getActiveCategories, basicCategorySelect } from "@/lib/categoryQueries";

export default async function dashboardPage() {
  // const [expenses, setExpenses] = useState(123010);
  // const [income, setIncome] = useState(500430);

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

  // Use deduplication function to get categories without duplicates
  const categories = await getActiveCategories(userId);

  return <DashboardClient transactions={data} categories={categories} />;
}
