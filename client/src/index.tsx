// index.tsx
import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { AppWithSuspense } from "../../isomorphic/AppWithSuspense";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      staleTime: 1000 * 60,
    },
  },
});

hydrateRoot(
  document.getElementById("root"),
  <QueryClientProvider client={queryClient}>
    <Hydrate state={window.globalCache}>
      <AppWithSuspense />
    </Hydrate>
  </QueryClientProvider>
);
