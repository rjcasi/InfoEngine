import { useEffect, useState } from "react";
import { pingBackend, computeEigen } from "./api";

function App() {
  const [message, setMessage] = useState("");
  const [eigen, setEigen] = useState<any>(null);

  useEffect(() => {
    pingBackend().then(data => setMessage(data.message));
  }, []);

  const runEigen = async () => {
    const matrix = [
      [2, 1],
      [1, 2]
    ];
    const result = await computeEigen(matrix);
    setEigen(result);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>InfoEngine Cockpit</h1>
      <p>Backend says: {message}</p>

      <hr />

      <h2>Flow Map Organ</h2>
      <button onClick={runEigen}>Compute Eigenvalues</button>

      {eigen && (
        <pre style={{ background: "#eee", padding: 10 }}>
          {JSON.stringify(eigen, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;