import React, { useCallback, useState } from "react";

import { useQuery } from "react-query";

const fetchData = () =>
  new Promise(resolve =>
    setTimeout(() => {
      console.log("call made");
      resolve("Hello From React");
    }, 5000)
  );

export const App: React.FC = () => {
  const { data, isLoading } = useQuery("data", fetchData);
  const [count, setCount] = useState(0);

  console.log("rendering", isLoading, data);
  return (
    <>
      <h2>{isLoading ? "loading" : data}</h2>
      <h3>{`hydration test: ${count}`}</h3>
      <button onClick={() => setCount(currCount => currCount + 1)}>
        Click to increase count
      </button>
    </>
  );
};
