import { useEffect, useState } from "react";
import {
  pingBackend,
  computeEigen,
  computeNand,
  simulateSpike,
  computePowerSpectrum,
} from "./api";

function App() {
  const [backendStatus, setBackendStatus] = useState<string | null>(null);

  const [eigenResult, setEigenResult] = useState<any | null>(null);
  const [nandResult, setNandResult] = useState<any | null>(null);
  const [spikeResult, setSpikeResult] = useState<any | null>(null);
  const [powerSpectrum, setPowerSpectrum] = useState<any | null>(null);

  const [nandInputs, setNandInputs] = useState<{ a: number; b: number }>({
    a: 0,
    b: 0,
  });

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await pingBackend();
        setBackendStatus(res.status ?? "Unknown backend status");
      } catch (err) {
        console.error("Error pinging backend:", err);
        setBackendStatus("Error reaching backend");
      }
    }

    checkBackend();
  }, []);

  async function handleEigen() {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    const result = await computeEigen(matrix);
    setEigenResult(result);
  }

  async function handleNand() {
    const result = await computeNand(nandInputs.a, nandInputs.b);
    setNandResult(result);
  }

  async function handleSpike() {
    const inputs = [0.2, 0.3, 0.4, 0.6, 0.1, 0.8, 0.3, 0.5, 0.7, 0.2];
    const result = await simulateSpike(inputs);
    setSpikeResult(result);
    setPowerSpectrum(null);
  }

  async function handlePowerSpectrum() {
    if (!spikeResult || !spikeResult.potentials) {
      alert("Run the Spike Neuron first to generate membrane potentials.");
      return;
    }

    const potentials = spikeResult.potentials as number[];
    const spectrum = await computePowerSpectrum(potentials, 1.0);
    setPowerSpectrum(spectrum);
  }

  function handleNandInputChange(key: "a" | "b", value: number) {
    setNandInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        color: "#eee",
        background: "#111",
        minHeight: "100vh",
      }}
    >
      <h1>InfoEngine Cockpit</h1>

      <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Backend Status</h2>
        <p>
          {backendStatus
            ? `Backend says: ${backendStatus}`
            : "Checking backend..."}
        </p>
      </div>

      <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Eigen Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Computes eigenvalues and eigenvectors of a sample 2×2 matrix.
        </p>
        <button onClick={handleEigen}>Compute Eigenvalues</button>
        {eigenResult && (
          <pre
            style={{
              marginTop: "1rem",
              background: "#222",
              padding: "1rem",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(eigenResult, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>NAND Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Computes the NAND of two binary inputs.
        </p>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            A:{" "}
            <select
              value={nandInputs.a}
              onChange={(e) => handleNandInputChange("a", Number(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            B:{" "}
            <select
              value={nandInputs.b}
              onChange={(e) => handleNandInputChange("b", Number(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </label>
        </div>

        <button onClick={handleNand}>Compute NAND</button>

        {nandResult && (
          <pre
            style={{
              marginTop: "1rem",
              background: "#222",
              padding: "1rem",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(nandResult, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Spike Neuron Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Simulates a simple leaky integrate-and-fire neuron over time.
        </p>

        <button onClick={handleSpike}>Simulate Spike Neuron</button>

        {spikeResult && (
          <pre
            style={{
              marginTop: "1rem",
              background: "#222",
              padding: "1rem",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(spikeResult, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Power Spectrum Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Analyzes the Spike Neuron membrane potentials in frequency space (FFT &amp; power spectrum).
        </p>

        <button onClick={handlePowerSpectrum} disabled={!spikeResult}>
          Compute Power Spectrum from Spike Neuron
        </button>

        {!spikeResult && (
          <p style={{ marginTop: "0.5rem", color: "#f88" }}>
            Run the Spike Neuron first to generate a membrane trace.
          </p>
        )}

        {powerSpectrum && (
          <pre
            style={{
              marginTop: "1rem",
              background: "#222",
              padding: "1rem",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(powerSpectrum, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;