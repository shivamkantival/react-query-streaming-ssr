// index.tsx
import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { AppWithSuspense } from "../../isomorphic/AppWithSuspense";
import { useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      staleTime: 1000 * 60,
    },
  },
});

const CustomComponent = () => {
  const [initialData, setData] = useState();

  useEffect(() => {
    window.onload = () => {
      const data = window.globalCache;
      setData(data);
      data.queries.map(query => queryClient.cancelQueries(query.queryKey));
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={initialData}>
        <AppWithSuspense />
      </Hydrate>
    </QueryClientProvider>
  );
};

hydrateRoot(document.getElementById("root"), <CustomComponent />);
