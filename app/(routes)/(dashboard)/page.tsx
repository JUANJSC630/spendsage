import { CalendarClockIcon } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { TitleText } from "./components/TitleText";
import ExpenseIncomeChart from "./components/ExpenseIncomeChart";
import FinancialSummary from "./components/FinancialSummary";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import CategoriesSummary from "./components/CategoriesSummary";

export default async function dashboardPage() {
  // const [expenses, setExpenses] = useState(123010);
  // const [income, setIncome] = useState(500430);

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
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
      <div className="w-full flex items-center justify-end gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className=" justify-start text-left font-normal"
            >
              <CalendarClockIcon className="mr-2 h-4 w-4" />
              {new Intl.DateTimeFormat("es-ES", {
                month: "long",
              }).format(new Date())}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 z-50"
            align="end"
            side="bottom"
            sideOffset={4}
            alignOffset={0}
            avoidCollisions={true}
            sticky="always"
          >
            <Calendar
              initialFocus
              mode="range"
              numberOfMonths={1}
              className="rounded-md border shadow-md"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <TitleText />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="md:col-span-2 w-full flex flex-col justify-between items-center">
          <FinancialSummary
            data={data}
            className="w-full flex flex-col md:flex-row justify-evenly gap-2"
          />
          <div className="w-full h-full flex flex-col justify-center items-center">
            <CategoriesSummary transactions={data} />
          </div>
        </div>
        <ExpenseIncomeChart transactions={data} className="md:col-span-3" />
      </div>
    </div>
  );
}
