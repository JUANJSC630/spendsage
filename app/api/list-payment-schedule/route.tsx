import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const listPaymentSchedule = await db.listPaymentSchedule.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(listPaymentSchedule);
  } catch (e) {
    console.log("[LIST PAYMENT SCHEDULE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const data = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const listPaymentSchedule = await db.listPaymentSchedule.create({
      data: {
        userId,
        ...data,
      },
    });

    return NextResponse.json(listPaymentSchedule);
  } catch (e) {
    console.log("[LIST PAYMENT SCHEDULE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
