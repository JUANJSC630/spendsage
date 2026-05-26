import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { month, year } = await req.json();

    const now = new Date();
    const targetMonth: number = month ?? now.getMonth() + 1;
    const targetYear: number = year ?? now.getFullYear();

    // Get active recurrings that haven't been applied this month
    const recurring = await db.recurringTransaction.findMany({
      where: { userId, isActive: true },
    });

    const pending = recurring.filter((r) => {
      if (!r.lastAppliedAt) return true;
      const last = new Date(r.lastAppliedAt);
      return (
        last.getMonth() + 1 !== targetMonth ||
        last.getFullYear() !== targetYear
      );
    });

    if (pending.length === 0) {
      return NextResponse.json({ created: 0, transactions: [] });
    }

    // Create a transaction for each pending recurring
    const created = await Promise.all(
      pending.map((r) => {
        const day = Math.min(r.dayOfMonth, new Date(targetYear, targetMonth, 0).getDate());
        const date = new Date(targetYear, targetMonth - 1, day, 12, 0, 0);

        return db.transactions.create({
          data: {
            userId,
            description: r.description,
            amount: r.amount,
            category: r.category,
            date,
          },
        });
      }),
    );

    // Update lastAppliedAt on each recurring
    await Promise.all(
      pending.map((r) =>
        db.recurringTransaction.update({
          where: { id: r.id },
          data: { lastAppliedAt: new Date() },
        }),
      ),
    );

    return NextResponse.json({ created: created.length, transactions: created });
  } catch (e) {
    console.log("[RECURRING_APPLY]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
