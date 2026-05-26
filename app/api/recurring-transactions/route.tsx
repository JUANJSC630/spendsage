import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const recurring = await db.recurringTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(recurring);
  } catch (e) {
    console.log("[RECURRING_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const data = await req.json();

    const recurring = await db.recurringTransaction.create({
      data: { userId, ...data },
    });

    return NextResponse.json(recurring);
  } catch (e) {
    console.log("[RECURRING_POST]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
