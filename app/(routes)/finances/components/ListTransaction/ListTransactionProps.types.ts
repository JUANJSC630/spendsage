import { Transactions } from "@prisma/client";

export type ListTransactionProps = {
    transactions: Transactions[];
};