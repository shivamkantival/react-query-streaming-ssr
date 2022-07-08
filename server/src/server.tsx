import * as React from "react";
import express from "express";
import { renderToPipeableStream } from "react-dom/server";
import { dehydrate, QueryClient, QueryClientProvider } from "react-query";
import { Writable } from "node:stream";
import { AppWithSuspense } from "../../isomorphic/AppWithSuspense";

const app = express();

const CustomPage = ({ queryClient }) => (
  <html>
    <head></head>
    <body>
      <div id="root">
        <QueryClientProvider client={queryClient}>
          <AppWithSuspense />
        </QueryClientProvider>
      </div>
    </body>
  </html>
);

app.get("/", (req, res) => {
  let didError = false;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
        staleTime: Number.POSITIVE_INFINITY,
      },
    },
  });

  const stream = new Writable({
    write(chunk, _encoding, cb) {
      res.write(chunk, cb);
    },
    final() {
      res.write(
        `<script>
            window.globalCache=${JSON.stringify(dehydrate(queryClient))}
        </script>`
      );

      queryClient.clear();
      res.end();
    },
  });

  const { pipe } = renderToPipeableStream(
    <CustomPage queryClient={queryClient} />,
    {
      bootstrapScripts: ["app.js"],
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        pipe(stream);
      },
      onShellError(error) {
        res.statusCode = 500;
        res.send("<!doctype html><p>Error happened...</p>");
      },
      onError(err) {
        didError = true;
        console.error(err);
      },
    }
  );
});

app.use(express.static("./built"));

app.listen(4242);
