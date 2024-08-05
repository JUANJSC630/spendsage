import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Params {
  params: { paymentItemId: string };
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params || !params.paymentItemId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const { paymentItemId } = params;

    const deletePaymentItem = await db.paymentItem.delete({
      where: {
        id: paymentItemId,
      },
    });

    return NextResponse.json(deletePaymentItem);
  } catch (e) {
    console.error("[DELETE PAYMENT ITEM]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
