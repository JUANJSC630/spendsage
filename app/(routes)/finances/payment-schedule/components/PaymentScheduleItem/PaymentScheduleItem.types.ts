import { PaymentItem, PaymentSchedule } from "@prisma/client";

export type PaymentScheduleItemProps = {
  paymentSchedule: PaymentSchedule;
  paymentItem: PaymentItem;
};
