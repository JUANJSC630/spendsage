import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Params {
  params: { paymentScheduleId: string };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params || !params.paymentScheduleId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const { paymentScheduleId } = params;
    const { name, fromDate, toDate } = body;

    if (!name || typeof name !== 'string') {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!fromDate || !toDate) {
      return new NextResponse("FromDate and ToDate are required", { status: 400 });
    }

    // Verificar que el PaymentSchedule pertenece al usuario
    const existingPaymentSchedule = await db.paymentSchedule.findFirst({
      where: {
        id: paymentScheduleId,
        listPaymentSchedule: {
          userId,
        },
      },
    });

    if (!existingPaymentSchedule) {
      return new NextResponse("Payment schedule not found", { status: 404 });
    }

    const updatedPaymentSchedule = await db.paymentSchedule.update({
      where: {
        id: paymentScheduleId,
      },
      data: {
        name,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
      },
    });

    return NextResponse.json(updatedPaymentSchedule);
  } catch (e) {
    console.error("[PUT PAYMENT SCHEDULE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
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
