import { auth } from "@clerk/nextjs/server";
import { BudgetsPageClient } from "./components/BudgetsPageClient";

export default async function BudgetsPage() {
  const { userId } = auth();
  if (!userId) return null;
  return <BudgetsPageClient />;
}
