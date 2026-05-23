import { auth } from "@clerk/nextjs/server";
import { CategoriesPageClient } from "./components/CategoriesPageClient/CategoriesPageClient";

export default async function CategoriesPage() {
  const { userId } = auth();
  if (!userId) return null;
  return <CategoriesPageClient />;
}
