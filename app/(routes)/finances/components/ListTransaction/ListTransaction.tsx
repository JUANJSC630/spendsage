"use client";

import CardTransaction from './CardTransaction/CardTransaction';
import { ListTransactionProps } from './ListTransactionProps.types';

export function ListTransaction(props: ListTransactionProps) {
  const { transactions } = props;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transacciones recientes</h2>
      <div className="grid gap-4 overscroll-y-contain overflow-auto max-h-[400px]">
        {transactions.map((transaction) => (
          <CardTransaction key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
