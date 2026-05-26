import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const goals = await db.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(goals);
  } catch (e) {
    console.log("[GOALS_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const data = await req.json();

    const goal = await db.savingsGoal.create({
      data: { userId, ...data },
    });

    return NextResponse.json(goal);
  } catch (e) {
    console.log("[GOALS_POST]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
