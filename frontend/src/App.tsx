import React, { useState } from "react";
import CausalSetSpikePanel from "./panels/CausalSetSpikePanel";
import CausalSetSyntheticPanel from "./panels/CausalSetSyntheticPanel";

export default function App() {
  const [panel, setPanel] = useState("spike");

  return (
    <div
      style={{
        padding: "1rem",
        fontFamily: "sans-serif",
        background: "#000",
        color: "#eee",
        minHeight: "100vh"
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>InfoEngine Cockpit</h1>

      {/* Panel Switcher */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
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
          Causal Set (Spike)
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
          Causal Graph (Synthetic)
        </button>
      </div>

      {/* Render Selected Panel */}
      {panel === "spike" && <CausalSetSpikePanel />}
      {panel === "synthetic" && <CausalSetSyntheticPanel />}
    </div>
  );
}