import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { recurringId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const data = await req.json();

    const existing = await db.recurringTransaction.findFirst({
      where: { id: params.recurringId, userId },
    });
    if (!existing) return new NextResponse("Not Found", { status: 404 });

    const updated = await db.recurringTransaction.update({
      where: { id: params.recurringId },
      data,
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.log("[RECURRING_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { recurringId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const existing = await db.recurringTransaction.findFirst({
      where: { id: params.recurringId, userId },
    });
    if (!existing) return new NextResponse("Not Found", { status: 404 });

    await db.recurringTransaction.delete({ where: { id: params.recurringId } });

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.log("[RECURRING_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
