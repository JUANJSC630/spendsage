import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color: string;
  icon: string;
  type: string;
  isActive: boolean;
  isDefault: boolean;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}

type CreateCategoryInput = {
  name: string;
  description?: string;
  color: string;
  icon: string;
  type: string;
};

export const categoryPageKeys = {
  all: ["categories-page"] as const,
  list: () => [...categoryPageKeys.all, "list"] as const,
};

const ACTIVE_CATEGORIES_KEY = ["categories", "list"];

const api = {
  getAllCategories: async (): Promise<Category[]> => {
    const res = await fetch("/api/categories/all");
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  createCategory: async (data: CreateCategoryInput): Promise<Category> => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 400)
      throw Object.assign(new Error("duplicate"), { status: 400 });
    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
  },

  restoreCategory: async (id: string): Promise<Category> => {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    if (res.status === 403)
      throw Object.assign(new Error("default"), { status: 403 });
    if (!res.ok) throw new Error("Failed to restore category");
    return res.json();
  },

  deleteCategory: async (id: string): Promise<Category> => {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.status === 403)
      throw Object.assign(new Error("default"), { status: 403 });
    if (!res.ok) throw new Error("Failed to delete category");
    return res.json();
  },
};

export function useAllCategories() {
  const { isSignedIn } = useAuth();
  return useQuery<Category[]>({
    queryKey: categoryPageKeys.list(),
    queryFn: api.getAllCategories,
    enabled: !!isSignedIn,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: (newCat) => {
      queryClient.setQueryData<Category[]>(categoryPageKeys.list(), (old) =>
        old ? [newCat, ...old] : [newCat],
      );
      queryClient.invalidateQueries({ queryKey: categoryPageKeys.list() });
      queryClient.invalidateQueries({ queryKey: ACTIVE_CATEGORIES_KEY });
    },
  });
}

export function useRestoreCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.restoreCategory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: categoryPageKeys.list() });
      const previous = queryClient.getQueryData<Category[]>(
        categoryPageKeys.list(),
      );
      queryClient.setQueryData<Category[]>(
        categoryPageKeys.list(),
        (old) =>
          old?.map((c) => (c.id === id ? { ...c, isActive: true } : c)) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(categoryPageKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryPageKeys.list() });
      queryClient.invalidateQueries({ queryKey: ACTIVE_CATEGORIES_KEY });
    },
  });
}

export function useSeedDefaultCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<{ created: number }> => {
      const res = await fetch("/api/categories/seed-defaults", { method: "POST" });
      if (!res.ok) throw new Error("Failed to seed categories");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryPageKeys.list() });
      queryClient.invalidateQueries({ queryKey: ACTIVE_CATEGORIES_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCategory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: categoryPageKeys.list() });
      const previous = queryClient.getQueryData<Category[]>(
        categoryPageKeys.list(),
      );
      // Optimistically mark as inactive (may be hard-deleted or archived by API)
      queryClient.setQueryData<Category[]>(
        categoryPageKeys.list(),
        (old) =>
          old?.map((c) => (c.id === id ? { ...c, isActive: false } : c)) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(categoryPageKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryPageKeys.list() });
      queryClient.invalidateQueries({ queryKey: ACTIVE_CATEGORIES_KEY });
    },
  });
}
