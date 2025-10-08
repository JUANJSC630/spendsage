import { Transactions } from "@prisma/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
  isDefault: boolean;
}

export type CardTransactionProps = {
  transaction: Transactions;
  categories: Category[];
};
