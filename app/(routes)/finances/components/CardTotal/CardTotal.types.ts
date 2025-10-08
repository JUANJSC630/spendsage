import { Transactions } from "@prisma/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
  isDefault: boolean;
}

export type CardTotalProps = {
  transactions: Transactions[];
  categories: Category[];
  type: "income" | "expenses" | "balance";
  title: string;
  className?: string;
  classTitle?: string;
  classText?: string;
};
