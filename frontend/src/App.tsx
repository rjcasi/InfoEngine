import React, { useState } from "react";

import CausalSetSpikePanel from "./panels/CausalSetSpikePanel";
import CausalSetSyntheticPanel from "./panels/CausalSetSyntheticPanel";
import HashPanel from "./panels/HashPanel";

export default function App() {
  const [panel, setPanel] = useState("spike");

  return (
    <div style={{ padding: "1rem", color: "#eee", background: "#111", minHeight: "100vh" }}>
      <h1>InfoEngine Cockpit</h1>

      {/* Panel Switcher */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => setPanel("spike")}
          style={{
            padding: "0.5rem 1rem",
            background: panel === "spike" ? "#333" : "#111",
            border: "1px solid #444",
            color: "#eee",
            cursor: "pointer"
          }}
        >
          Spike Panel
        </button>

        <button
          onClick={() => setPanel("synthetic")}
          style={{
            padding: "0.5rem 1rem",
            background: panel === "synthetic" ? "#333" : "#111",
            border: "1px solid #444",
            color: "#eee",
            cursor: "pointer"
          }}
        >
          Synthetic Causal Graph
        </button>

        <button
          onClick={() => setPanel("hash")}
          style={{
            padding: "0.5rem 1rem",
            background: panel === "hash" ? "#333" : "#111",
            border: "1px solid #444",
            color: "#eee",
            cursor: "pointer"
          }}
        >
          Hash Organ
        </button>
      </div>

      {/* Panel Renderer */}
      {panel === "spike" && <CausalSetSpikePanel />}
      {panel === "synthetic" && <CausalSetSyntheticPanel />}
      {panel === "hash" && <HashPanel />}
    </div>
  );
}