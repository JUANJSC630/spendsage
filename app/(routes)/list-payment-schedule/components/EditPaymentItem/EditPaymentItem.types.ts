import { PaymentItem, PaymentSchedule } from "@prisma/client";

export interface EditPaymentItemProps {
  paymentItem: PaymentItem;
  paymentSchedule: PaymentSchedule;
}