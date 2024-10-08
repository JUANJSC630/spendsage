import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Params {
  params: { paymentScheduleId: string };
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params || !params.paymentScheduleId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const { paymentScheduleId } = params;

    const deletePaymentSchedule = await db.paymentSchedule.delete({
      where: {
        id: paymentScheduleId,
      },
    });

    return NextResponse.json(deletePaymentSchedule);
  } catch (e) {
    console.error("[DELETE PAYMENT SCHEDULE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
