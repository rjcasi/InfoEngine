// frontend/src/api.ts

// Backend heartbeat
export async function pingBackend() {
  const res = await fetch("http://localhost:5000/");
  return res.json();
}

// Eigen Organ
export async function computeEigen(matrix: number[][]) {
  const res = await fetch("http://localhost:5000/eigen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matrix }),
  });

  if (!res.ok) throw new Error("Eigen organ error");
  return res.json();
}

// NAND Organ
export async function computeNand(a: number, b: number) {
  const res = await fetch("http://localhost:5000/nand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a, b }),
  });

  if (!res.ok) throw new Error("NAND organ error");
  return res.json();
}

// Spike Neuron Organ
export async function simulateSpike(inputs: number[]) {
  const res = await fetch("http://localhost:5000/spike", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputs }),
  });

  if (!res.ok) throw new Error("Spike neuron organ error");
  return res.json();
}

// Power Spectrum Organ
export async function computePowerSpectrum(
  potentials: number[],
  dt: number = 1.0
) {
  const res = await fetch("http://localhost:5000/power-spectrum", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ potentials, dt }),
  });

  if (!res.ok) throw new Error("Power spectrum organ error");
  return res.json();
}

// Ion Channel Organ
export async function simulateIonChannels() {
  const res = await fetch("http://localhost:5000/ion-channels");
  if (!res.ok) throw new Error("Ion channel organ error");
  return res.json();
}

// Phase-Space Organ
export async function computePhaseSpace(V: number[], dt: number = 0.1) {
  const res = await fetch("http://localhost:5000/phase-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ V, dt }),
  });

  if (!res.ok) throw new Error("Phase-space organ error");
  return res.json();
}

// Causal Set Organ
export async function computeCausalSet(V: number[], threshold: number = 0.5) {
  const res = await fetch("http://localhost:5000/causal-set", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ V, threshold }),
  });

  if (!res.ok) throw new Error("Causal set organ error");
  return res.json();
}

// Attention Tensor Organ
export async function computeAttentionTensor(payload: any) {
  const res = await fetch("http://localhost:5000/attention-tensor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Attention tensor organ error");
  return res.json();
}

// Red/Blue Cyber Organ
export async function runCyber(seed: number | null) {
  const res = await fetch("http://localhost:5000/cyber", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seed }),
  });

  if (!res.ok) throw new Error("Cyber organ error");
  return res.json();
}

// Memory Consolidation Organ
export async function computeMemory(payload: any) {
  const res = await fetch("http://localhost:5000/memory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Memory organ error");
  return res.json();
}