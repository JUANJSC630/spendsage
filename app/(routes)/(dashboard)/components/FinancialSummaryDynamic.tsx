"use client";

import CardTotalMonthlyDynamic from "./CardTotalMonthlyDynamic";
import { Transactions } from "@prisma/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
}

interface FinancialSummaryDynamicProps {
  data: Transactions[];
  categories: Category[];
  className?: string;
}

export default function FinancialSummaryDynamic(props: FinancialSummaryDynamicProps) {
  const { data, categories } = props;
  const cardClass =
    "w-full rounded-lg border bg-card text-card-foreground shadow-sm h-[100px] flex flex-col justify-center items-center";
  const cardTitleClass = "text-sm font-medium";
  const cardTextClass = "text-xl font-bold";

  return (
    <div
      className={
        props.className ? props.className : "grid gap-4 md:grid-cols-3"
      }
    >
      <CardTotalMonthlyDynamic
        className={cardClass}
        classTitle={cardTitleClass}
        classText={cardTextClass}
        title="Ingresos Mensuales"
        type="income"
        transactions={data}
        categories={categories}
      />

      <CardTotalMonthlyDynamic
        className={cardClass}
        classTitle={cardTitleClass}
        classText={cardTextClass}
        title="Gastos Mensuales"
        type="expenses"
        transactions={data}
        categories={categories}
      />

      <CardTotalMonthlyDynamic
        className={cardClass}
        classTitle={cardTitleClass}
        classText={cardTextClass}
        title="Balance"
        type="balance"
        transactions={data}
        categories={categories}
      />
    </div>
  );
}