import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllCategories } from "@/lib/categoryQueries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categories = await getAllCategories(userId);
    return NextResponse.json(categories);
  } catch (e) {
    console.log("[CATEGORIES_ALL]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
