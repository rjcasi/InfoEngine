import { useState } from "react";

export default function CausalSetSyntheticPanel() {
  const [data, setData] = useState<any>(null);

  async function load() {
    const res = await fetch("/api/causal-set/synthetic");
    const json = await res.json();
    setData(json);
  }

  return (
    <section style={{ padding: "1rem", border: "1px solid #444" }}>
      <h2>Causal Graph (Synthetic)</h2>

      <button
        onClick={load}
        style={{
          padding: "0.5rem 1rem",
          background: "#222",
          border: "1px solid #444",
          color: "#eee",
          cursor: "pointer",
          marginBottom: "1rem"
        }}
      >
        Generate Synthetic Graph
      </button>

      {data && (
        <pre style={{ color: "#ccc" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  );
}