import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertClick } from "@shared/routes";

export function useClicksToday() {
  return useQuery({
    queryKey: [api.clicks.listToday.path],
    queryFn: async () => {
      const res = await fetch(api.clicks.listToday.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch clicks");
      return api.clicks.listToday.responses[200].parse(await res.json());
    },
    // Refresh frequently to see other people's clicks if needed, or keep standard
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useClickStats() {
  return useQuery({
    queryKey: [api.clicks.stats.path],
    queryFn: async () => {
      const res = await fetch(api.clicks.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.clicks.stats.responses[200].parse(await res.json());
    },
    staleTime: 1000 * 30,
  });
}

export function useCreateClick() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertClick) => {
      const validated = api.clicks.create.input.parse(data);
      const res = await fetch(api.clicks.create.path, {
        method: api.clicks.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.clicks.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to register click");
      }
      
      return api.clicks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.clicks.listToday.path] });
      queryClient.invalidateQueries({ queryKey: [api.clicks.stats.path] });
    },
  });
}
