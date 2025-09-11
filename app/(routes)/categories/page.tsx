import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { CategoryDashboard } from "./components/CategoryDashboard/CategoryDashboard";
import { CategoryForm } from "./components/CategoryForm/CategoryForm";
import { CategoryList } from "./components/CategoryList/CategoryList";
import { CategoryNavbar } from "./components/CategoryNavbar/CategoryNavbar";

export default async function CategoriesPage() {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  let categories: any[] = [];
  let hasError = false;

  try {
    if (!db.category) {
      console.error('❌ Category model not found in Prisma client. Server restart required.');
      console.error('🔧 Solution: Stop the dev server (Ctrl+C) and run yarn dev again');
      hasError = true;
    } else {
      categories = await db.category.findMany({
        where: {
          userId,
        },
        orderBy: [
          {
            type: "asc",
          },
          {
            name: "asc",
          },
        ],
      });
    }
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    console.error('🔧 This usually happens when the database schema is out of sync');
    console.error('💡 Try: yarn prisma generate && restart dev server');
    hasError = true;
  }

  // Si hay error, mostrar página de categorías vacías con opción de crear
  if (hasError) {
    categories = [];
  }

  const activeCategories = categories.filter(cat => cat.isActive);
  const inactiveCategories = categories.filter(cat => !cat.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <CategoryNavbar />
      <div className="space-y-6 mt-6">
        <CategoryDashboard 
          categories={activeCategories} 
          inactiveCount={inactiveCategories.length}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-slate-100 p-4 rounded-md bg-white">
            <CategoryForm />
          </div>
          <div className="border border-slate-100 p-4 rounded-md bg-white">
            <CategoryList 
              categories={activeCategories}
              showInactive={false}
            />
          </div>
        </div>
        {inactiveCategories.length > 0 && (
          <div className="border border-slate-100 p-4 rounded-md bg-white">
            <CategoryList 
              categories={inactiveCategories}
              showInactive={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}