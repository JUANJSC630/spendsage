import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { paymentScheduleId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const paymentItems = await db.paymentItem.findMany({
      where: {
        paymentScheduleId: params.paymentScheduleId,
        userId,
      },
      orderBy: {
        check: "asc",
      },
    });

    return NextResponse.json(paymentItems);
  } catch (error) {
    console.log("[GET PAYMENT SCHEDULE ITEMS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { paymentScheduleId: string } }
) {
  try {
    const { userId } = auth();
    const data = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const paymentSchedule = await db.paymentSchedule.findUnique({
      where: {
        id: params.paymentScheduleId,
      },
    });

    if (!paymentSchedule) {
      return new NextResponse("Payment Schedule not found", { status: 404 });
    }

    const paymentItem = await db.paymentItem.create({
      data: {
        paymentScheduleId: params.paymentScheduleId,
        userId,
        ...data,
      },
    });

    return NextResponse.json(paymentItem);
  } catch (error) {
    console.log("[POST PAYMENT SCHEDULE ITEM]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
