import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categories = await db.category.findMany({
      where: {
        userId,
        isActive: true,
        ...(type && { type }),
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (e) {
    console.log("[CATEGORIES_BY_TYPE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}