import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { ListPaymentSchedule, PaymentSchedule, PaymentItem } from '@prisma/client';

type PaymentScheduleWithItems = PaymentSchedule & {
  paymentItems: PaymentItem[];
};

type ListPaymentScheduleWithSchedules = ListPaymentSchedule & {
  paymentSchedules: PaymentScheduleWithItems[];
};

// Query Keys
export const paymentScheduleKeys = {
  all: ['payment-schedules'] as const,
  lists: () => [...paymentScheduleKeys.all, 'lists'] as const,
  list: (id: string) => [...paymentScheduleKeys.lists(), id] as const,
  schedules: (listId: string) => [...paymentScheduleKeys.list(listId), 'schedules'] as const,
  schedule: (id: string) => [...paymentScheduleKeys.all, 'schedule', id] as const,
  items: (scheduleId: string) => [...paymentScheduleKeys.schedule(scheduleId), 'items'] as const,
};

// API Functions
const api = {
  getListPaymentSchedules: async (): Promise<ListPaymentSchedule[]> => {
    const response = await fetch('/api/list-payment-schedule');
    if (!response.ok) throw new Error('Failed to fetch payment schedule lists');
    return response.json();
  },

  getListPaymentScheduleById: async (id: string): Promise<ListPaymentScheduleWithSchedules> => {
    const response = await fetch(`/api/list-payment-schedule/${id}`);
    if (!response.ok) throw new Error('Failed to fetch payment schedule list');
    return response.json();
  },

  getPaymentItems: async (scheduleId: string): Promise<PaymentItem[]> => {
    const response = await fetch(`/api/payment-schedule/${scheduleId}/payment-item`);
    if (!response.ok) throw new Error('Failed to fetch payment items');
    return response.json();
  },

  createListPaymentSchedule: async (data: { name: string }): Promise<ListPaymentSchedule> => {
    const response = await fetch('/api/list-payment-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create payment schedule list');
    return response.json();
  },

  createPaymentSchedule: async (data: {
    name: string;
    fromDate: Date;
    toDate: Date;
    listPaymentScheduleId: string;
  }): Promise<PaymentSchedule> => {
    const response = await fetch('/api/payment-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create payment schedule');
    return response.json();
  },

  createPaymentItem: async (data: {
    paymentScheduleId: string;
    amount: string;
    date: Date;
    description: string;
    check?: boolean;
  }): Promise<PaymentItem> => {
    const response = await fetch(`/api/payment-schedule/${data.paymentScheduleId}/payment-item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create payment item');
    return response.json();
  },

  updatePaymentItem: async (data: {
    id: string;
    paymentScheduleId: string;
    amount?: string;
    date?: Date;
    description?: string;
    check?: boolean;
  }): Promise<PaymentItem> => {
    const response = await fetch(`/api/payment-schedule/${data.paymentScheduleId}/payment-item/${data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update payment item');
    return response.json();
  },

  deletePaymentItem: async (paymentScheduleId: string, itemId: string): Promise<void> => {
    const response = await fetch(`/api/payment-schedule/${paymentScheduleId}/payment-item/${itemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete payment item');
  },

  deletePaymentSchedule: async (id: string): Promise<void> => {
    const response = await fetch(`/api/payment-schedule/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete payment schedule');
  },

  deleteListPaymentSchedule: async (id: string): Promise<void> => {
    const response = await fetch(`/api/list-payment-schedule/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete payment schedule list');
  },

  duplicateListPaymentSchedule: async (id: string, name: string): Promise<ListPaymentScheduleWithSchedules> => {
    const response = await fetch(`/api/list-payment-schedule/${id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to duplicate payment schedule list');
    return response.json();
  },

  updateListPaymentSchedule: async (data: { id: string; name: string }): Promise<ListPaymentSchedule> => {
    const response = await fetch(`/api/list-payment-schedule/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name }),
    });
    if (!response.ok) throw new Error('Failed to update payment schedule list');
    return response.json();
  },

  updatePaymentSchedule: async (data: { id: string; name: string; fromDate: Date; toDate: Date }): Promise<PaymentSchedule> => {
    const response = await fetch(`/api/payment-schedule/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        fromDate: data.fromDate,
        toDate: data.toDate
      }),
    });
    if (!response.ok) throw new Error('Failed to update payment schedule');
    return response.json();
  },
};

// Hooks
export function useListPaymentSchedules() {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: paymentScheduleKeys.lists(),
    queryFn: api.getListPaymentSchedules,
    enabled: isSignedIn,
  });
}

export function useListPaymentSchedule(id: string) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: paymentScheduleKeys.list(id),
    queryFn: () => api.getListPaymentScheduleById(id),
    enabled: isSignedIn && !!id,
  });
}

export function usePaymentItems(scheduleId: string) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: paymentScheduleKeys.items(scheduleId),
    queryFn: () => api.getPaymentItems(scheduleId),
    enabled: isSignedIn && !!scheduleId,
  });
}

// Mutations
export function useCreateListPaymentSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createListPaymentSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentScheduleKeys.lists() });
    },
  });
}

export function useCreatePaymentSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createPaymentSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: paymentScheduleKeys.list(variables.listPaymentScheduleId)
      });
    },
  });
}

export function useCreatePaymentItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createPaymentItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: paymentScheduleKeys.items(variables.paymentScheduleId)
      });
    },
  });
}

export function useUpdatePaymentItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updatePaymentItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: paymentScheduleKeys.items(variables.paymentScheduleId)
      });
    },
  });
}

export function useDeletePaymentItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentScheduleId, itemId }: { paymentScheduleId: string; itemId: string }) =>
      api.deletePaymentItem(paymentScheduleId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: paymentScheduleKeys.items(variables.paymentScheduleId)
      });
    },
  });
}

export function useDeletePaymentSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deletePaymentSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentScheduleKeys.all });
    },
  });
}

export function useDeleteListPaymentSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteListPaymentSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentScheduleKeys.lists() });
    },
  });
}

export function useDuplicateListPaymentSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.duplicateListPaymentSchedule(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentScheduleKeys.lists() });
    },
  });
}

export function useUpdateListPaymentSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateListPaymentSchedule,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentScheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentScheduleKeys.list(data.id) });
    },
  });
}

export function useUpdatePaymentSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updatePaymentSchedule,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentScheduleKeys.all });
      // Invalidate the parent list to refresh the data
      queryClient.invalidateQueries({ queryKey: paymentScheduleKeys.lists() });
    },
  });
}