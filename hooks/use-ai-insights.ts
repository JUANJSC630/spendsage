import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

export const aiInsightsKeys = {
  byMonth: (month: number, year: number) =>
    ["ai-insights", month, year] as const,
};

export function useAiInsights(month: number, year: number, enabled = true) {
  const { isSignedIn } = useAuth();
  return useQuery<string[]>({
    queryKey: aiInsightsKeys.byMonth(month, year),
    queryFn: async () => {
      const res = await fetch(`/api/ai/insights?month=${month}&year=${year}`);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.insights as string[]).filter(Boolean);
    },
    enabled: !!isSignedIn && enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24h — matches server cache
    retry: false,
  });
}
