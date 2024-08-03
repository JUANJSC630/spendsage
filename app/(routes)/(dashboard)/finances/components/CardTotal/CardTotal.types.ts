import { Transactions } from "@prisma/client";

export type CardTotalProps = {
  transactions: Transactions[];
  type: "income" | "expenses" | "balance";
  title: string;
};
