import { PaymentItem, PaymentSchedule } from "@prisma/client";

export type ButtonDeletePaymentItemProps = {
  paymentSchedule: PaymentSchedule;
  paymentItem: PaymentItem;
};
