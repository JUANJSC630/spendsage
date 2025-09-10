import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { budgetId: string };
  }
) {
  try {
    const { userId } = auth();
    const { budgetId } = params;
    const data = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const budget = await db.budget.update({
      where: {
        id: budgetId,
        userId,
      },
      data,
    });

    return NextResponse.json(budget);
  } catch (e) {
    console.log("[PATCH BUDGET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { budgetId: string };
  }
) {
  try {
    const { userId } = auth();
    const { budgetId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deleteBudget = await db.budget.delete({
      where: {
        id: budgetId,
        userId,
      },
    });

    return NextResponse.json(deleteBudget);
  } catch (e) {
    console.log("[DELETE BUDGET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}