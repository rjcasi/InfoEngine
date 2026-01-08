import { useState } from "react";

export default function CausalSetSpikePanel() {
  const [input, setInput] = useState("0.1, 0.8, 0.2, 0.9");
  const [data, setData] = useState<any>(null);

  async function run() {
    const V = input.split(",").map(Number);

    const res = await fetch("/api/causal-set/spike", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ V, threshold: 0.5 })
    });

    const json = await res.json();
    setData(json);
  }

  return (
    <section style={{ padding: "1rem", border: "1px solid #444" }}>
      <h2>Causal Set (Spike-Based)</h2>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Input Vector (comma-separated):
      </label>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          background: "#111",
          color: "#eee",
          border: "1px solid #333"
        }}
      />

      <button
        onClick={run}
        style={{
          padding: "0.5rem 1rem",
          background: "#222",
          border: "1px solid #444",
          color: "#eee",
          cursor: "pointer"
        }}
      >
        Build Causal Set
      </button>

      {data && (
        <pre style={{ marginTop: "1rem", color: "#ccc" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  );
}