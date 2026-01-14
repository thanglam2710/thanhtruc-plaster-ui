/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient } from "@tanstack/react-query";
import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";

// Tạo QueryClient một lần duy nhất (singleton)
let queryClientInstance: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          gcTime: 5 * 60 * 1000,
          retry: 0,
          refetchOnWindowFocus: true,
          refetchOnMount: "always",
          refetchOnReconnect: true,
          structuralSharing: false,
        },
        mutations: {
          retry: 0,
        },
      },
    });

    //  Sync data cross-tab (chỉ setup 1 lần)
    broadcastQueryClient({
      queryClient: queryClientInstance,
      broadcastChannel: "bambi-query-sync",
    });

    // Setup BroadcastChannel cho invalidation (chỉ 1 lần)
    if (typeof window !== "undefined") {
      const invalidationChannel = new BroadcastChannel("bambi-invalidation");

      invalidationChannel.onmessage = (event) => {
        const { keys } = event.data;
        if (Array.isArray(keys)) {
          console.log("📡 Received invalidation from other tab:", keys);
          keys.forEach((key: string) => {
            queryClientInstance!.invalidateQueries({
              predicate: (query) => {
                const firstPart = query.queryKey[0];
                return (
                  typeof firstPart === "string" && firstPart.startsWith(key)
                );
              },
            });

            queryClientInstance!.refetchQueries({
              predicate: (query) => {
                const firstPart = query.queryKey[0];
                return (
                  typeof firstPart === "string" && firstPart.startsWith(key)
                );
              },
              type: "all",
            });
          });
        }
      };

      // Lưu channel instance để có thể gửi message
      (queryClientInstance as any).__invalidationChannel = invalidationChannel;
    }
  }

  return queryClientInstance;
}

// Export để dùng trong hooks
export const queryClient = getQueryClient();

// Helper để broadcast invalidation
export function broadcastInvalidation(keys: string[]) {
  const channel = (queryClient as any).__invalidationChannel;
  if (channel) {
    console.log("📤 Broadcasting invalidation to all tabs:", keys);
    channel.postMessage({ keys });
  }
}
