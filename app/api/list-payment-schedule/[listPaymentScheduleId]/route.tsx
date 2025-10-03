import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface Params {
  params: { listPaymentScheduleId: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params || !params.listPaymentScheduleId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const { listPaymentScheduleId } = params;

    const listPaymentSchedule = await db.listPaymentSchedule.findUnique({
      where: {
        id: listPaymentScheduleId,
        userId,
      },
      include: {
        paymentSchedules: {
          include: {
            paymentItems: true,
          },
        },
      },
    });

    if (!listPaymentSchedule) {
      return new NextResponse("List Payment Schedule not found", { status: 404 });
    }

    return NextResponse.json(listPaymentSchedule);
  } catch (e) {
    console.error("[GET LIST PAYMENT SCHEDULE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
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
