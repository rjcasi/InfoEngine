import React, { useEffect, useState } from "react";
import { pingBackend, computeEigen, computeNand } from "./api";

export default function App() {
  const [backendMessage, setBackendMessage] = useState<string>("");
  const [eigenResult, setEigenResult] = useState<any | null>(null);
  const [nandResult, setNandResult] = useState<any | null>(null);

  // Backend heartbeat
  useEffect(() => {
    async function loadPing() {
      try {
        const res = await pingBackend();
        setBackendMessage(res.message || JSON.stringify(res));
      } catch (err) {
        setBackendMessage("Backend unreachable");
      }
    }
    loadPing();
  }, []);

  // Eigen organ handler
  async function handleEigen() {
    const matrix = [
      [1, 2],
      [3, 4]
    ];
    const result = await computeEigen(matrix);
    setEigenResult(result);
  }

  // NAND organ handler
  async function handleNand() {
    const result = await computeNand(1, 1);
    setNandResult(result);
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#eee", background: "#111", minHeight: "100vh" }}>
      <h1>InfoEngine Cockpit</h1>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Backend says:</strong> {backendMessage}
      </div>

      {/* Eigenvalue Engine */}
      <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Eigenvalue Engine</h2>
        <button onClick={handleEigen}>Compute Eigenvalues</button>

        {eigenResult && (
          <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
            {JSON.stringify(eigenResult, null, 2)}
          </pre>
        )}
      </div>

      {/* NAND Logic Organ */}
<div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
  <h2>NAND Logic Organ</h2>
  <button onClick={handleNand}>Compute NAND(1,1)</button>

  {nandResult && (
    <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
      {JSON.stringify(nandResult, null, 2)}
    </pre>
  )}
      </div>
    </div>
  );
}