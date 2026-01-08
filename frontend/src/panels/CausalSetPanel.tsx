import { useState } from "react";

export default function CausalSetPanel() {
  const [data, setData] = useState<any>(null);

  async function load() {
    const res = await fetch("/api/causal-set");
    const json = await res.json();
    setData(json);
  }

  return (
    <section style={{ padding: "1rem", border: "1px solid #444" }}>
      <h2>Causal Set Organ</h2>
      <button onClick={load} style={{ marginBottom: "1rem" }}>
        Generate Causal Set
      </button>

      {data && (
        <pre style={{ fontSize: "0.8rem", color: "#ccc" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  );
}