import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { transactionId: string };
  }
) {
  try {
    const { userId } = auth();
    const { transactionId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deleteTransaction = await db.transactions.delete({
      where: {
        id: transactionId,
      },
    });

    return NextResponse.json(deleteTransaction);
  } catch (e) {
    console.log("[DELETE TRANSACTION]", e);
    return new NextResponse("Interal Server Error", { status: 500 });
  }
}
