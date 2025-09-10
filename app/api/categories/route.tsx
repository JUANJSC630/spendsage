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

    const categories = await db.category.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: [
        {
          type: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    return NextResponse.json(categories);
  } catch (e) {
    console.log("[CATEGORIES]", e);
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

    // Use provided slug or generate from name
    let slug = data.slug;
    if (!slug) {
      slug = data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '');
    }

    const category = await db.category.create({
      data: {
        userId,
        name: data.name,
        slug,
        description: data.description || "",
        color: data.color || "#3B82F6",
        icon: data.icon || "Folder",
        type: data.type || "expense",
        isActive: true,
      },
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORIES]", e);
    if (typeof e === "object" && e !== null && "code" in e && (e as any).code === 'P2002') {
      return new NextResponse("Category name already exists", { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}