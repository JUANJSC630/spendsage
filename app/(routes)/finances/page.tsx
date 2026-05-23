import { auth } from "@clerk/nextjs/server";
import { FinancesPageClient } from "./components/FinancesPageClient";

export default async function FinancesPage() {
  const { userId } = auth();
  if (!userId) return null;
  return <FinancesPageClient />;
}
