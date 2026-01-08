import React from "react";
import { useEffect, useState } from "react";
import {
  pingBackend,
  computeEigen,
  computeNand,
  simulateSpike,
  computePowerSpectrum,
  simulateIonChannels,
  computePhaseSpace,
  computeCausalSet,
  computeAttentionTensor,
  runCyber,
  computeMemory,
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
  const [ionChannels, setIonChannels] = useState<any | null>(null);
  const [phaseSpace, setPhaseSpace] = useState<any | null>(null);
  const [causalSet, setCausalSet] = useState<any | null>(null);
  const [attentionTensor, setAttentionTensor] = useState<any | null>(null);
  const [cyberResult, setCyberResult] = useState<any | null>(null);
  const [memoryResult, setMemoryResult] = useState<any | null>(null);

  // NAND inputs
  const [nandInputs, setNandInputs] = useState({ a: 0, b: 0 });

  // Cyber organ seed
  const [cyberSeed, setCyberSeed] = useState<number | null>(null);

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

  // Ion channel organ
  async function handleIonChannels() {
    const result = await simulateIonChannels();
    setIonChannels(result);
  }

  // Phase-space organ
  async function handlePhaseSpace() {
    if (!spikeResult?.potentials) {
      alert("Run the Spike Neuron first.");
      return;
    }
    const result = await computePhaseSpace(spikeResult.potentials, 1.0);
    setPhaseSpace(result);
  }

  // Causal set organ
  async function handleCausalSet() {
    if (!spikeResult?.potentials) {
      alert("Run the Spike Neuron first.");
      return;
    }
    const result = await computeCausalSet(spikeResult.potentials, 0.5);
    setCausalSet(result);
  }

  // Attention tensor organ
  async function handleAttentionTensor() {
    if (!spikeResult?.potentials || !ionChannels || !causalSet) {
      alert("Run Spike Neuron, Ion Channels, and Causal Set first.");
      return;
    }

    const payload = {
      V: spikeResult.potentials,
      K: ionChannels.K,
      Na: ionChannels.Na,
      Ca: ionChannels.Ca,
      events: causalSet.events,
    };

    const result = await computeAttentionTensor(payload);
    setAttentionTensor(result);
  }

  // Cyber organ
  async function handleCyber() {
    const result = await runCyber(cyberSeed);
    setCyberResult(result);
    setCyberSeed(result.next_seed);
  }

  // Memory organ
  async function handleMemory() {
    if (!spikeResult || !ionChannels || !attentionTensor) {
      alert("Run Spike Neuron, Ion Channels, and Attention Tensor first.");
      return;
    }

    const payload = {
      V: spikeResult.potentials,
      K: ionChannels.K,
      Na: ionChannels.Na,
      Ca: ionChannels.Ca,
      attention: attentionTensor.attention,
    };

    const result = await computeMemory(payload);
    setMemoryResult(result);
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
                    x: { title: { display: true, text: "Frequency" } },
                    y: { title: { display: true, text: "Power" } },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </>
        )}
      </section>

      {/* Ion Channel Organ */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Ion Channel Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Simulates stochastic K⁺, Na⁺, and Ca²⁺ gating and resulting membrane potential.
        </p>

        <button onClick={handleIonChannels}>Simulate Ion Channels</button>

        {ionChannels && (
          <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
            {JSON.stringify(ionChannels, null, 2)}
          </pre>
        )}
      </section>

      {/* Phase-Space Organ */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Phase-Space Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Computes V vs dV/dt attractor from membrane potentials.
        </p>

        <button onClick={handlePhaseSpace}>Compute Phase Space</button>

        {phaseSpace && (
          <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
            {JSON.stringify(phaseSpace, null, 2)}
          </pre>
        )}
      </section>

      {/* Causal Set Organ */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid "#444" }}>
        <h2>Causal Set Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Extracts events and builds a causal partial order from membrane potentials.
        </p>

        <button onClick={handleCausalSet}>Compute Causal Set</button>

        {causalSet && (
          <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
            {JSON.stringify(causalSet, null, 2)}
          </pre>
        )}
      </section>

      {/* Attention Tensor Organ */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Attention Tensor Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Computes a biologically inspired attention field from membrane, ion channels, and causal events.
        </p>

        <button onClick={handleAttentionTensor}>Compute Attention Tensor</button>

        {attentionTensor && (
          <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
            {JSON.stringify(attentionTensor, null, 2)}
          </pre>
        )}
      </section>

      {/* Red/Blue Cyber Organ */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Red/Blue Cyber Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Generates fuzzing patterns and evaluates defensive response. Recursive cyber loop.
        </p>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Seed:{" "}
            <input
              type="number"
              value={cyberSeed ?? ""}
              onChange={(e) => setCyberSeed(Number(e.target.value))}
              style={{ width: "80px" }}
            />
          </label>
        </div>

        <button onClick={handleCyber}>Run Cyber Round</button>

        {cyberResult && (
          <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
            {JSON.stringify(cyberResult, null, 2)}
          </pre>
        )}
      </section>

      {/* Memory Consolidation Organ */}
      <section style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #444" }}>
        <h2>Memory Consolidation Organ</h2>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          Compresses biophysical and attentional signals into a stable memory vector.
        </p>

        <button onClick={handleMemory}>Consolidate Memory</button>

        {memoryResult && (
          <pre style={{ marginTop: "1rem", background: "#222", padding: "1rem" }}>
            {JSON.stringify(memoryResult, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}