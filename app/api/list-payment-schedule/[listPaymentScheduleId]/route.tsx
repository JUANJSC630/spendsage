import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Params {
  params: { listPaymentScheduleId: string };
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params || !params.listPaymentScheduleId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const { listPaymentScheduleId } = params;

    const deleteListPaymentSchedule = await db.listPaymentSchedule.delete({
      where: {
        id: listPaymentScheduleId,
      },
    });

    return NextResponse.json(deleteListPaymentSchedule);
  } catch (e) {
    console.error("[DELETE LIST PAYMENT SCHEDULE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
