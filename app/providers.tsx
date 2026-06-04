"use client";

import { PrimeReactProvider } from "primereact/api";
import { addLocale, locale } from "primereact/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import ru from "primelocale/ru.json";

addLocale("ru", ru.ru);
locale("ru");

export function Providers({ children }: { children: React.ReactNode }) {
  return <PrimeReactProvider>{children}</PrimeReactProvider>;
}

export function ProvidersTanStack({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 минута
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
