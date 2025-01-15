import { db } from "@/lib/db";
import { ListPaymentItemsProps } from "./ListPaymentItemsProps.types";
import PaymentScheduleItem from "../PaymentScheduleItem/PaymentScheduleItem";

import { PaymentTotals } from "../PaymentTotals/PaymentTotals";

export default async function ListPaymentItems(props: ListPaymentItemsProps) {
  const { paymentSchedule } = props;

  const items = await db.paymentItem.findMany({
    where: {
      paymentScheduleId: paymentSchedule.id,
    },
    orderBy: {
      check: "asc",
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 overscroll-y-contain overflow-auto max-h-[350px]">
        {items.map((paymentItem) => (
          <PaymentScheduleItem
            paymentItem={paymentItem}
            paymentSchedule={paymentSchedule}
            key={paymentItem.id}
          />
        ))}
      </div>
      <PaymentTotals items={items} />
    </div>
  );
}
