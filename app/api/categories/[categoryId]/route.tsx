import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { categoryId: string };
  }
) {
  try {
    const { userId } = auth();
    const { categoryId } = params;
    const data = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if it's a default category (cannot be modified)
    const existingCategory = await db.category.findUnique({
      where: { id: categoryId },
      select: { isDefault: true, userId: true }
    });

    if (existingCategory?.isDefault) {
      return new NextResponse("Cannot modify default categories", { status: 403 });
    }

    // Generate new slug if name is being updated
    const updateData: any = { ...data };
    if (data.name) {
      updateData.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '');
    }

    const category = await db.category.update({
      where: {
        id: categoryId,
        userId,
      },
      data: updateData,
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("[PATCH CATEGORY]", e);
    if (typeof e === "object" && e !== null && "code" in e && (e as any).code === 'P2002') {
      return new NextResponse("Category name already exists", { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { categoryId: string };
  }
) {
  try {
    const { userId } = auth();
    const { categoryId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if it's a default category (cannot be deleted)
    const existingCategory = await db.category.findUnique({
      where: { id: categoryId },
      select: { isDefault: true, userId: true, slug: true }
    });

    if (existingCategory?.isDefault) {
      return new NextResponse("Cannot delete default categories", { status: 403 });
    }

    // Check if category is being used in transactions or budgets
    const transactionsCount = await db.transactions.count({
      where: {
        userId,
        category: {
          in: await db.category.findUnique({
            where: { id: categoryId, userId },
            select: { slug: true }
          }).then(cat => cat ? [cat.slug] : [])
        }
      }
    });

    const budgetsCount = await db.budget.count({
      where: {
        userId,
        category: {
          in: await db.category.findUnique({
            where: { id: categoryId, userId },
            select: { slug: true }
          }).then(cat => cat ? [cat.slug] : [])
        }
      }
    });

    if (transactionsCount > 0 || budgetsCount > 0) {
      // Instead of deleting, mark as inactive
      const category = await db.category.update({
        where: {
          id: categoryId,
          userId,
        },
        data: {
          isActive: false,
        },
      });
      return NextResponse.json(category);
    }

    // If not used anywhere, actually delete it
    const category = await db.category.delete({
      where: {
        id: categoryId,
        userId,
      },
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("[DELETE CATEGORY]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}