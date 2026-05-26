import { useMutation } from "@tanstack/react-query";

export function useAiCategorize() {
  return useMutation({
    mutationFn: async (description: string): Promise<string> => {
      const res = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) return "variable_expenses";
      const data = await res.json();
      return data.category as string;
    },
  });
}
