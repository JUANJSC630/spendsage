import { auth } from "@clerk/nextjs/server";
import { DashboardClient } from "./components/DashboardClient";

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) return null;
  return <DashboardClient />;
}
