import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 minutes — data served from cache before refetch
      gcTime: 10 * 60 * 1000,          // 10 minutes — keep unused data in memory
      retry: 1,
      refetchOnWindowFocus: false,      // prevent surprise refetches on tab switch
    },
  },
});
