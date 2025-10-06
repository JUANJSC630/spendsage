import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { DashboardClient } from "./components/DashboardClient";

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

  const categories = await db.category.findMany({
    where: {
      userId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      type: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <DashboardClient transactions={data} categories={categories} />;
}
