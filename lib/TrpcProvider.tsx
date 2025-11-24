"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/utils";
import { httpBatchLink } from "@trpc/client"; // <-- Add this import

const queryClient = new QueryClient();

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({ // <-- Use the imported httpBatchLink
        url: "/api/trpc",
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}