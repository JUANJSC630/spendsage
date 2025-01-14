import CardTotalMonthly from "./CardTotalMonthly";
import { Transactions } from "@prisma/client";

interface FinancialSummaryProps {
  data: Transactions[];
  className?: string;
}

export default async function FinancialSummary(props: FinancialSummaryProps) {
  const { data } = props;
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
      <CardTotalMonthly
        className={cardClass}
        classTitle={cardTitleClass}
        classText={cardTextClass}
        title="Monthly Income"
        type="income"
        transactions={data}
      />

      <CardTotalMonthly
        className={cardClass}
        classTitle={cardTitleClass}
        classText={cardTextClass}
        title="Monthly Expenses"
        type="expenses"
        transactions={data}
      />
      <CardTotalMonthly
        className={cardClass}
        classTitle={cardTitleClass}
        classText={cardTextClass}
        title="Balance"
        type="balance"
        transactions={data}
      />
    </div>
  );
}
