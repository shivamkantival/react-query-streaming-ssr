import { QueryClientProvider } from "react-query";
import { Suspense } from "react";
import { App } from "../App";
import * as React from "react";

export const AppWithSuspense = () => (
  <>
    <h1>Hello World!</h1>
    <Suspense>
      <App />
    </Suspense>
  </>
);
