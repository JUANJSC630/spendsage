import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const paymentSchedule = await db.paymentSchedule.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(paymentSchedule);
  } catch (e) {
    console.log("[PAYMENT SCHEDULE]", e);
    return new NextResponse("Interal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const data = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const paymentSchedule = await db.paymentSchedule.create({
      data: {
        userId,
        ...data,
      },
    });

    return NextResponse.json(paymentSchedule);
  } catch (e) {
    console.log("[PAYMENT SCHEDULE]", e);
    return new NextResponse("Interal Server Error", { status: 500 });
  }
}
