import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || "0");
    const year = parseInt(searchParams.get("year") || "0");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!month || !year) {
      return new NextResponse("Month and year are required", { status: 400 });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const budgets = await db.budget.findMany({
      where: {
        userId,
        month,
        year,
      },
    });

    const budgetProgress = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await db.transactions.findMany({
          where: {
            userId,
            category: budget.category,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const spent = transactions.reduce(
          (total, transaction) => total + parseFloat(transaction.amount),
          0
        );

        const budgetAmount = parseFloat(budget.amount);
        const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

        return {
          ...budget,
          spent: spent.toString(),
          percentage,
          remaining: (budgetAmount - spent).toString(),
          isOverBudget: spent > budgetAmount,
          transactionCount: transactions.length,
        };
      })
    );

    return NextResponse.json(budgetProgress);
  } catch (e) {
    console.log("[BUDGET_PROGRESS]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}