import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { paymentScheduleId: string };
  }
) {
  try {
    const { userId } = auth();
    const { paymentScheduleId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletePaymentSchedule = await db.paymentSchedule.delete({
      where: {
        id: paymentScheduleId,
      },
    });

    return NextResponse.json(deletePaymentSchedule);
  } catch (e) {
    console.log("[DELETE PAYMENT SCHEDULE]", e);
    return new NextResponse("Interal Server Error", { status: 500 });
  }
}
