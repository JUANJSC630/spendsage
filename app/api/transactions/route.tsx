import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactions = await db.transactions.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (e) {
    console.log("[TRANSACTION]", e);
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

    const transaction = await db.transactions.create({
      data: {
        userId,
        ...data,
      },
    });

    return NextResponse.json(transaction);
  } catch (e) {
    console.log("[TRANSACTION]", e);
    return new NextResponse("Interal Server Error", { status: 500 });
  }
}
