import { Dispatch, SetStateAction } from "react";

export type FormPaymentScheduleProps = {
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  listPaymentScheduleId: string;
};

