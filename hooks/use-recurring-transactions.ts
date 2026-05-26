import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { transactionKeys } from "./use-transactions";

export interface RecurringTransaction {
  id: string;
  userId: string;
  description: string;
  amount: string;
  category: string;
  dayOfMonth: number;
  isActive: boolean;
  lastAppliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

type RecurringInput = {
  description: string;
  amount: string;
  category: string;
  dayOfMonth: number;
};

export const recurringKeys = {
  all: ["recurring-transactions"] as const,
  list: () => [...recurringKeys.all, "list"] as const,
};

const api = {
  getAll: async (): Promise<RecurringTransaction[]> => {
    const res = await fetch("/api/recurring-transactions");
    if (!res.ok) throw new Error("Failed to fetch recurring transactions");
    return res.json();
  },

  create: async (data: RecurringInput): Promise<RecurringTransaction> => {
    const res = await fetch("/api/recurring-transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create recurring transaction");
    return res.json();
  },

  update: async ({
    id,
    ...data
  }: Partial<RecurringInput> & { id: string; isActive?: boolean }): Promise<RecurringTransaction> => {
    const res = await fetch(`/api/recurring-transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update recurring transaction");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`/api/recurring-transactions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete recurring transaction");
  },

  apply: async (month: number, year: number): Promise<{ created: number }> => {
    const res = await fetch("/api/recurring-transactions/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, year }),
    });
    if (!res.ok) throw new Error("Failed to apply recurring transactions");
    return res.json();
  },
};

export function useRecurringTransactions() {
  const { isSignedIn } = useAuth();
  return useQuery<RecurringTransaction[]>({
    queryKey: recurringKeys.list(),
    queryFn: api.getAll,
    enabled: !!isSignedIn,
  });
}

export function useCreateRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.create,
    onSuccess: (newItem) => {
      queryClient.setQueryData<RecurringTransaction[]>(
        recurringKeys.list(),
        (old) => (old ? [...old, newItem] : [newItem]),
      );
    },
  });
}

export function useUpdateRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.update,
    onSuccess: (updated) => {
      queryClient.setQueryData<RecurringTransaction[]>(
        recurringKeys.list(),
        (old) => old?.map((r) => (r.id === updated.id ? updated : r)) ?? [],
      );
    },
  });
}

export function useDeleteRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.delete,
    onSuccess: (_, id) => {
      queryClient.setQueryData<RecurringTransaction[]>(
        recurringKeys.list(),
        (old) => old?.filter((r) => r.id !== id) ?? [],
      );
    },
  });
}

export function useApplyRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) =>
      api.apply(month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
      queryClient.invalidateQueries({ queryKey: recurringKeys.list() });
    },
  });
}

export function usePendingRecurring(month: number, year: number) {
  const { data: recurring = [] } = useRecurringTransactions();
  return recurring.filter((r) => {
    if (!r.isActive) return false;
    if (!r.lastAppliedAt) return true;
    const last = new Date(r.lastAppliedAt);
    return (
      last.getMonth() + 1 !== month || last.getFullYear() !== year
    );
  });
}
