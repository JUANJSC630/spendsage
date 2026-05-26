import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { goalId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const existing = await db.savingsGoal.findFirst({
      where: { id: params.goalId, userId },
    });
    if (!existing) return new NextResponse("Not Found", { status: 404 });

    const data = await req.json();
    const updated = await db.savingsGoal.update({
      where: { id: params.goalId },
      data,
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.log("[GOALS_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { goalId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const existing = await db.savingsGoal.findFirst({
      where: { id: params.goalId, userId },
    });
    if (!existing) return new NextResponse("Not Found", { status: 404 });

    await db.savingsGoal.delete({ where: { id: params.goalId } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.log("[GOALS_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
