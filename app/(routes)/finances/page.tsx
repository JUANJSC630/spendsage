import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import CardTotal from "./components/CardTotal/CardTotal";
import { FromTransaction } from "./components/FormTransaction";
import { ListTransaction } from "./components/ListTransaction/ListTransaction";
import { Navbar } from "./components/Navbar/Navbar";

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
    <div className="flex flex-col w-full h-full justify-center">
      <Navbar />
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
          <CardTotal transactions={data} type="balance" title="Total Balance" />
        </div>
      </div>
    </div>
  );
}
