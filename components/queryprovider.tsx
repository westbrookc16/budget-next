"use client";
//provide query provider from react query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
//import { ReactQueryDevtools } from "react-query/devtools";
//import { Hydrate } from "react-query/hydration";
//create query client
const queryClient = new QueryClient();
//create query provider
export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
