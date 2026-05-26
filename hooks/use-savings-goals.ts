import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: string;
  savedAmount: string;
  emoji: string;
  deadline: string | null;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

type GoalInput = {
  name: string;
  targetAmount: string;
  savedAmount?: string;
  emoji?: string;
  deadline?: string | null;
};

export const goalKeys = {
  all: ["savings-goals"] as const,
  list: () => [...goalKeys.all, "list"] as const,
};

const api = {
  getAll: async (): Promise<SavingsGoal[]> => {
    const res = await fetch("/api/savings-goals");
    if (!res.ok) throw new Error("Failed to fetch goals");
    return res.json();
  },

  create: async (data: GoalInput): Promise<SavingsGoal> => {
    const res = await fetch("/api/savings-goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create goal");
    return res.json();
  },

  update: async ({
    id,
    ...data
  }: Partial<GoalInput> & {
    id: string;
    isComplete?: boolean;
  }): Promise<SavingsGoal> => {
    const res = await fetch(`/api/savings-goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update goal");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`/api/savings-goals/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete goal");
  },
};

export function useSavingsGoals() {
  const { isSignedIn } = useAuth();
  return useQuery<SavingsGoal[]>({
    queryKey: goalKeys.list(),
    queryFn: api.getAll,
    enabled: !!isSignedIn,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.create,
    onSuccess: (newGoal) => {
      queryClient.setQueryData<SavingsGoal[]>(goalKeys.list(), (old) =>
        old ? [newGoal, ...old] : [newGoal],
      );
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.update,
    onSuccess: (updated) => {
      queryClient.setQueryData<SavingsGoal[]>(
        goalKeys.list(),
        (old) => old?.map((g) => (g.id === updated.id ? updated : g)) ?? [],
      );
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.delete,
    onSuccess: (_, id) => {
      queryClient.setQueryData<SavingsGoal[]>(
        goalKeys.list(),
        (old) => old?.filter((g) => g.id !== id) ?? [],
      );
    },
  });
}
