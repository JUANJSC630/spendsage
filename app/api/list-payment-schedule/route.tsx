import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lists = await db.listPaymentSchedule.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        paymentSchedules: {
          include: {
            paymentItems: { select: { check: true, amount: true } },
          },
        },
      },
    });

    const enriched = lists.map(({ paymentSchedules, ...list }) => {
      const allItems = paymentSchedules.flatMap((s) => s.paymentItems);
      const totalItems = allItems.length;
      const paidItems = allItems.filter((i) => i.check).length;
      const totalAmount = allItems.reduce(
        (acc, i) => acc + parseFloat(i.amount.replace(/\./g, "")),
        0,
      );
      const paidAmount = allItems
        .filter((i) => i.check)
        .reduce((acc, i) => acc + parseFloat(i.amount.replace(/\./g, "")), 0);
      const progress =
        totalItems === 0 ? 0 : Math.round((paidItems / totalItems) * 100);
      return {
        ...list,
        _stats: { totalItems, paidItems, totalAmount, paidAmount, progress },
      };
    });

    return NextResponse.json(enriched);
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
