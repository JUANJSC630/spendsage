import { ListPaymentSchedule } from "@prisma/client";

export interface DuplicateListModalProps {
  listPaymentSchedule: ListPaymentSchedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}