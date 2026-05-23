import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Transactions } from "@prisma/client";

export interface TransactionCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  type: string;
  isDefault: boolean;
  isActive: boolean;
}

type TransactionInput = {
  category: string;
  description: string;
  amount: string;
  date: Date;
};

export const transactionKeys = {
  all: ["transactions"] as const,
  list: () => [...transactionKeys.all, "list"] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

const api = {
  getTransactions: async (): Promise<Transactions[]> => {
    const res = await fetch("/api/transactions");
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  },

  getCategories: async (): Promise<TransactionCategory[]> => {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  createTransaction: async (data: TransactionInput): Promise<Transactions> => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create transaction");
    return res.json();
  },

  updateTransaction: async ({
    id,
    ...data
  }: {
    id: string;
    description?: string;
    amount?: string;
    category?: string;
    date?: Date;
  }): Promise<Transactions> => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update transaction");
    return res.json();
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete transaction");
  },
};

export function useTransactions() {
  const { isSignedIn } = useAuth();
  return useQuery<Transactions[]>({
    queryKey: transactionKeys.list(),
    queryFn: api.getTransactions,
    enabled: !!isSignedIn,
  });
}

export function useTransactionCategories() {
  const { isSignedIn } = useAuth();
  return useQuery<TransactionCategory[]>({
    queryKey: categoryKeys.list(),
    queryFn: api.getCategories,
    enabled: !!isSignedIn,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTransaction,
    onSuccess: (newTx) => {
      queryClient.setQueryData<Transactions[]>(transactionKeys.list(), (old) =>
        old ? [newTx, ...old] : [newTx],
      );
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateTransaction,
    onMutate: async ({ id, ...patch }) => {
      await queryClient.cancelQueries({ queryKey: transactionKeys.list() });
      const previous = queryClient.getQueryData<Transactions[]>(
        transactionKeys.list(),
      );
      queryClient.setQueryData<Transactions[]>(
        transactionKeys.list(),
        (old) => old?.map((t) => (t.id === id ? { ...t, ...patch } : t)) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(transactionKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTransaction,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: transactionKeys.list() });
      const previous = queryClient.getQueryData<Transactions[]>(
        transactionKeys.list(),
      );
      queryClient.setQueryData<Transactions[]>(
        transactionKeys.list(),
        (old) => old?.filter((t) => t.id !== id) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(transactionKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
    },
  });
}
