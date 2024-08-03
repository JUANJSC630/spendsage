import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { db } from "@/lib/db";
import { CalendarIcon } from "@/utils/CalendarIcon";
import { auth } from "@clerk/nextjs/server";

import CardTotal from "./components/CardTotal/CardTotal";
import { FromTransaction } from "./components/FormTransaction";
import { ListTransaction } from "./components/ListTransaction/ListTransaction";
import Link from "next/link";
import { ListCheck } from "lucide-react";

export default async function FinancesPage() {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const data = await db.transactions.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col">
      <div className="bg-background text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex items-center justify-end gap-8">
          <div>
            <Link href="/finances/payment-schedule">
              <Button variant="outline" className="flex items-center gap-2">
                <ListCheck className="h-5 w-5 text-gray-900" />
                <span className="text-gray-900">Payment Schedule</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-900">
                    {new Date().toLocaleString("default", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex-1 py-8 md:px-6">
        <div className="container mx-auto grid gap-8">
          <div className="grid md:grid-cols-2 gap-8 md:p-4">
            <div className="border border-slate-100 p-4 rounded-md transition-colors duration-300 ease-in">
              <FromTransaction />
            </div>
            <div className="border border-slate-100 p-4 rounded-md transition-colors duration-300 ease-in">
              <ListTransaction transactions={data} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <CardTotal transactions={data} type="income" title="Total Income" />
            <CardTotal
              transactions={data}
              type="expenses"
              title="Total Expenses"
            />
            <CardTotal
              transactions={data}
              type="balance"
              title="Total Balance"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
