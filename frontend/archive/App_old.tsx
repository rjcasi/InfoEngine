import React from "react";

import { useEffect, useState } from "react";
import {
  pingBackend,
  computeEigen,
  computeNand,
  simulateSpike,
  computePowerSpectrum,
} from "./api";


import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export default function App() {
  // Backend status
  const [backendStatus, setBackendStatus] = useState<string | null>(null);

  // Organ outputs
  const [eigenResult, setEigenResult] = useState<any | null>(null);
  const [nandResult, setNandResult] = useState<any | null>(null);
  const [spikeResult, setSpikeResult] = useState<any | null>(null);
  const [powerSpectrum, setPowerSpectrum] = useState<any | null>(null);

  // NAND inputs
  const [nandInputs, setNandInputs] = useState({ a: 0, b: 0 });

  // Backend heartbeat
  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await pingBackend();
        setBackendStatus(res.status ?? "Unknown backend status");
      } catch {
        setBackendStatus("Error reaching backend");
      }
    }
    checkBackend();
  }, []);

  // Eigen organ
  async function handleEigen() {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    const result = await computeEigen(matrix);
    setEigenResult(result);
  }

  // NAND organ
  async function handleNand() {
    const result = await computeNand(nandInputs.a, nandInputs.b);
    setNandResult(result);
  }

  function handleNandInputChange(key: "a" | "b", value: number) {
    setNandInputs((prev) => ({ ...prev, [key]: value }));
  }

  // Spike neuron organ
  async function handleSpike() {
    const inputs = [0.2, 0.3, 0.4, 0.6, 0.1, 0.8, 0.3, 0.5, 0.7, 0.2];
    const result = await simulateSpike(inputs);
    setSpikeResult(result);
    setPowerSpectrum(null);
  }

  // Power spectrum organ
  async function handlePowerSpectrum() {
    if (!spikeResult?.potentials) {
      alert("Run the Spike Neuron first to generate membrane potentials.");
      return;
    }
    const spectrum = await computePowerSpectrum(spikeResult.potentials, 1.0);
    setPowerSpectrum(spectrum);
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

      {/* Backend Status */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Backend Status</h2>
        <p>{backendStatus ?? "Checking backend..."}</p>
      </section>

      {/* Eigen Organ */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Eigen Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Computes eigenvalues and eigenvectors of a sample 2×2 matrix.
        </p>
        <button onClick={handleEigen}>Compute Eigenvalues</button>

        {eigenResult && (
          <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
            {JSON.stringify(eigenResult, null, 2)}
          </pre>
        )}
      </section>

      {/* NAND Organ */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
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
          <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
            {JSON.stringify(nandResult, null, 2)}
          </pre>
        )}
      </section>

      {/* Spike Neuron Organ */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Spike Neuron Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Simulates a simple leaky integrate-and-fire neuron over time.
        </p>

        <button onClick={handleSpike}>Simulate Spike Neuron</button>

        {spikeResult && (
          <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
            {JSON.stringify(spikeResult, null, 2)}
          </pre>
        )}
      </section>

      {/* Power Spectrum Organ */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Power Spectrum Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Analyzes the Spike Neuron membrane potentials in frequency space (FFT &amp; power spectrum).
        </p>

        <button onClick={handlePowerSpectrum} disabled={!spikeResult}>
          Compute Power Spectrum
        </button>

        {!spikeResult && (
          <p style={{ marginTop: "0.5rem", color: "#f88" }}>
            Run the Spike Neuron first to generate a membrane trace.
          </p>
        )}

        {powerSpectrum && (
  <>
    <pre
      style={{
        marginTop: "1rem",
        background: "#222",
        padding: "1rem",
        maxHeight: "200px",
        overflow: "auto",
      }}
    >
      {JSON.stringify(powerSpectrum, null, 2)}
    </pre>

    <div style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
      <h3>Power Spectrum Plot</h3>
      <Line
        data={{
          labels: powerSpectrum.freqs,
          datasets: [
            {
              label: "Power",
              data: powerSpectrum.power,
              borderColor: "#4fc3f7",
              backgroundColor: "rgba(79, 195, 247, 0.2)",
              tension: 0.1,
              pointRadius: 0,
            },
          ],
        }}
        options={{
          responsive: true,
          scales: {
            x: {
              title: { display: true, text: "Frequency" },
            },
            y: {
              title: { display: true, text: "Power" },
              type: "linear",
            },
          },
          plugins: {
            legend: { display: false },
          },
        }}
      />
    </div>
  </>
)}
      </section>
    </div>
  );
}