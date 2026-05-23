import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

export interface BudgetProgress {
  id: string;
  userId: string;
  category: string;
  amount: string;
  period: string;
  month: number;
  year: number;
  spent: string;
  percentage: number;
  remaining: string;
  isOverBudget: boolean;
  transactionCount: number;
}

type CreateBudgetInput = {
  category: string;
  amount: string;
  period: string;
  month: number;
  year: number;
};

export const budgetKeys = {
  all: ["budgets"] as const,
  progress: (month: number, year: number) =>
    [...budgetKeys.all, "progress", month, year] as const,
};

const api = {
  getBudgetsProgress: async (
    month: number,
    year: number,
  ): Promise<BudgetProgress[]> => {
    const res = await fetch(
      `/api/budgets/progress?month=${month}&year=${year}`,
    );
    if (!res.ok) throw new Error("Failed to fetch budgets");
    return res.json();
  },

  createBudget: async (data: CreateBudgetInput): Promise<BudgetProgress> => {
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 409 || res.status === 500)
      throw Object.assign(new Error("duplicate"), { status: res.status });
    if (!res.ok) throw new Error("Failed to create budget");
    return res.json();
  },

  updateBudget: async ({
    id,
    amount,
  }: {
    id: string;
    amount: string;
  }): Promise<BudgetProgress> => {
    const res = await fetch(`/api/budgets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) throw new Error("Failed to update budget");
    return res.json();
  },

  deleteBudget: async (id: string): Promise<void> => {
    const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete budget");
  },
};

export function useBudgetsProgress(month: number, year: number) {
  const { isSignedIn } = useAuth();
  return useQuery<BudgetProgress[]>({
    queryKey: budgetKeys.progress(month, year),
    queryFn: () => api.getBudgetsProgress(month, year),
    enabled: !!isSignedIn && !!month && !!year,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}

export function useUpdateBudget(month: number, year: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateBudget,
    onMutate: async ({ id, amount }) => {
      await queryClient.cancelQueries({
        queryKey: budgetKeys.progress(month, year),
      });
      const previous = queryClient.getQueryData<BudgetProgress[]>(
        budgetKeys.progress(month, year),
      );
      queryClient.setQueryData<BudgetProgress[]>(
        budgetKeys.progress(month, year),
        (old) =>
          old?.map((b) => {
            if (b.id !== id) return b;
            const newAmount = parseFloat(amount);
            const spent = parseFloat(b.spent);
            const percentage = newAmount > 0 ? (spent / newAmount) * 100 : 0;
            return {
              ...b,
              amount,
              remaining: (newAmount - spent).toString(),
              percentage,
              isOverBudget: spent > newAmount,
            };
          }) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          budgetKeys.progress(month, year),
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}

export function useDeleteBudget(month: number, year: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteBudget,
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: budgetKeys.progress(month, year),
      });
      const previous = queryClient.getQueryData<BudgetProgress[]>(
        budgetKeys.progress(month, year),
      );
      queryClient.setQueryData<BudgetProgress[]>(
        budgetKeys.progress(month, year),
        (old) => old?.filter((b) => b.id !== id) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          budgetKeys.progress(month, year),
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}
