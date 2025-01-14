import { PaymentSchedule } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

export type FormItemsProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  paymentSchedule: PaymentSchedule
};
