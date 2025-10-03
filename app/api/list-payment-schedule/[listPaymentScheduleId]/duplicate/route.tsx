import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface Params {
  params: { listPaymentScheduleId: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params || !params.listPaymentScheduleId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    if (!name || name.trim() === '') {
      return new NextResponse("Name is required", { status: 400 });
    }

    const { listPaymentScheduleId } = params;

    // Obtener la lista original con todos sus datos
    const originalList = await db.listPaymentSchedule.findUnique({
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

    if (!originalList) {
      return new NextResponse("List Payment Schedule not found", { status: 404 });
    }

    // Crear la nueva lista duplicada
    const duplicatedList = await db.listPaymentSchedule.create({
      data: {
        userId,
        name: name.trim(),
        paymentSchedules: {
          create: originalList.paymentSchedules.map((schedule) => ({
            userId,
            name: schedule.name,
            fromDate: schedule.fromDate,
            toDate: schedule.toDate,
            paymentItems: {
              create: schedule.paymentItems.map((item) => ({
                userId,
                check: item.check,
                amount: item.amount,
                date: item.date,
                description: item.description,
              })),
            },
          })),
        },
      },
      include: {
        paymentSchedules: {
          include: {
            paymentItems: true,
          },
        },
      },
    });

    return NextResponse.json(duplicatedList);
  } catch (e) {
    console.error("[DUPLICATE LIST PAYMENT SCHEDULE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}